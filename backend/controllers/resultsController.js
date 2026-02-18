const Marks = require('../models/Marks');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Exam = require('../models/Exam');
const ExamWeightage = require('../models/ExamWeightage');
const { calculateGrade, calculatePercentage, calculateWeightedScore } = require('../utils/calculations');

// Get result for a single student across all exams
exports.getStudentResult = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId).populate('class school');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const marks = await Marks.find({ student: studentId })
            .populate('subject exam')
            .sort({ 'exam.name': 1 });

        // Group marks by exam
        const examResults = {};
        let grandTotalObtained = 0;
        let grandTotalMax = 0;

        for (const mark of marks) {
            const examId = mark.exam._id.toString();
            if (!examResults[examId]) {
                examResults[examId] = {
                    exam: mark.exam,
                    subjects: [],
                    totalObtained: 0,
                    totalMax: 0
                };
            }
            const maxMarks = Math.min(mark.subject.maxMarks, mark.exam.maxMarks);
            examResults[examId].subjects.push({
                subject: mark.subject,
                marksObtained: mark.marksObtained,
                maxMarks,
                grade: mark.grade,
                percentage: calculatePercentage(mark.marksObtained, maxMarks)
            });
            examResults[examId].totalObtained += mark.marksObtained;
            examResults[examId].totalMax += maxMarks;
            grandTotalObtained += mark.marksObtained;
            grandTotalMax += maxMarks;
        }

        // Calculate per-exam totals, average, percentage
        const examResultsArray = Object.values(examResults).map(er => ({
            ...er,
            percentage: calculatePercentage(er.totalObtained, er.totalMax),
            average: er.subjects.length > 0 ? parseFloat((er.totalObtained / er.subjects.length).toFixed(2)) : 0
        }));

        const overallPercentage = calculatePercentage(grandTotalObtained, grandTotalMax);
        const overallGrade = await calculateGrade(overallPercentage, student.school._id);

        // Calculate weighted score if weightages exist
        let weightedScore = null;
        const weightages = await ExamWeightage.find({
            school: student.school._id,
            class: student.class._id
        }).populate('exam');

        if (weightages.length > 0) {
            weightedScore = 0;
            for (const w of weightages) {
                const examResult = examResults[w.exam._id.toString()];
                if (examResult) {
                    weightedScore += calculateWeightedScore(
                        examResult.totalObtained,
                        examResult.totalMax,
                        w.weightagePercent
                    );
                }
            }
            weightedScore = parseFloat(weightedScore.toFixed(2));
        }

        res.json({
            success: true,
            data: {
                student,
                examResults: examResultsArray,
                summary: {
                    totalObtained: grandTotalObtained,
                    totalMax: grandTotalMax,
                    percentage: overallPercentage,
                    grade: overallGrade,
                    weightedScore
                }
            }
        });
    } catch (error) { next(error); }
};

// Get class-wise results for a specific exam
exports.getClassResults = async (req, res, next) => {
    try {
        const { classId, examId } = req.params;
        const students = await Student.find({ class: classId }).sort({ rollNumber: 1 });

        if (students.length === 0) {
            return res.json({ success: true, data: [] });
        }

        const subjects = await Subject.find({ class: classId });
        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

        const studentIds = students.map(s => s._id);
        const allMarks = await Marks.find({
            student: { $in: studentIds },
            exam: examId
        }).populate('subject');

        // Build student results
        const studentResults = [];
        for (const student of students) {
            const studentMarks = allMarks.filter(m => m.student.toString() === student._id.toString());
            let totalObtained = 0;
            let totalMax = 0;
            const subjectMarks = [];

            for (const mark of studentMarks) {
                const maxMarks = Math.min(mark.subject.maxMarks, exam.maxMarks);
                totalObtained += mark.marksObtained;
                totalMax += maxMarks;
                subjectMarks.push({
                    subject: mark.subject,
                    marksObtained: mark.marksObtained,
                    maxMarks,
                    grade: mark.grade
                });
            }

            const percentage = calculatePercentage(totalObtained, totalMax);
            const schoolId = student.school;
            const grade = await calculateGrade(percentage, schoolId);

            studentResults.push({
                student,
                subjects: subjectMarks,
                totalObtained,
                totalMax,
                percentage,
                grade,
                average: subjectMarks.length > 0 ? parseFloat((totalObtained / subjectMarks.length).toFixed(2)) : 0
            });
        }

        // Calculate ranks
        studentResults.sort((a, b) => b.percentage - a.percentage);
        studentResults.forEach((result, index) => {
            result.rank = index + 1;
        });

        res.json({ success: true, data: { exam, results: studentResults } });
    } catch (error) { next(error); }
};

// Get result for student for a specific exam
exports.getStudentExamResult = async (req, res, next) => {
    try {
        const { studentId, examId } = req.params;
        const student = await Student.findById(studentId).populate('class school');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

        const marks = await Marks.find({ student: studentId, exam: examId }).populate('subject');
        let totalObtained = 0;
        let totalMax = 0;
        const subjectResults = [];

        for (const mark of marks) {
            const maxMarks = Math.min(mark.subject.maxMarks, exam.maxMarks);
            totalObtained += mark.marksObtained;
            totalMax += maxMarks;
            subjectResults.push({
                subject: mark.subject,
                marksObtained: mark.marksObtained,
                maxMarks,
                grade: mark.grade,
                percentage: calculatePercentage(mark.marksObtained, maxMarks)
            });
        }

        const percentage = calculatePercentage(totalObtained, totalMax);
        const grade = await calculateGrade(percentage, student.school._id);

        // Calculate rank within class for this exam
        const classStudents = await Student.find({ class: student.class._id });
        const classStudentIds = classStudents.map(s => s._id);
        const allClassMarks = await Marks.find({
            student: { $in: classStudentIds },
            exam: examId
        });

        // Sum marks per student
        const studentTotals = {};
        for (const m of allClassMarks) {
            const sid = m.student.toString();
            if (!studentTotals[sid]) studentTotals[sid] = 0;
            studentTotals[sid] += m.marksObtained;
        }

        const sortedTotals = Object.entries(studentTotals)
            .sort(([, a], [, b]) => b - a);
        const rank = sortedTotals.findIndex(([sid]) => sid === studentId) + 1;

        res.json({
            success: true,
            data: {
                student,
                exam,
                subjects: subjectResults,
                summary: {
                    totalObtained,
                    totalMax,
                    percentage,
                    grade,
                    average: subjectResults.length > 0 ? parseFloat((totalObtained / subjectResults.length).toFixed(2)) : 0,
                    rank: rank || null
                }
            }
        });
    } catch (error) { next(error); }
};

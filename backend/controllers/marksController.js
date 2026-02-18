const Marks = require('../models/Marks');
const Subject = require('../models/Subject');
const Exam = require('../models/Exam');
const Student = require('../models/Student');
const { calculateGrade, calculatePercentage } = require('../utils/calculations');

// Upload marks for a student
exports.create = async (req, res, next) => {
    try {
        const { student, subject, exam, marksObtained } = req.body;

        // Validate that student, subject, and exam exist
        const [studentDoc, subjectDoc, examDoc] = await Promise.all([
            Student.findById(student).populate('school'),
            Subject.findById(subject),
            Exam.findById(exam)
        ]);

        if (!studentDoc) return res.status(404).json({ success: false, message: 'Student not found' });
        if (!subjectDoc) return res.status(404).json({ success: false, message: 'Subject not found' });
        if (!examDoc) return res.status(404).json({ success: false, message: 'Exam not found' });

        // Validate max marks
        const maxMarks = Math.min(subjectDoc.maxMarks, examDoc.maxMarks);
        if (marksObtained > maxMarks) {
            return res.status(400).json({
                success: false,
                message: `Marks obtained (${marksObtained}) cannot exceed maximum marks (${maxMarks})`
            });
        }

        // Calculate grade automatically
        const percentage = calculatePercentage(marksObtained, maxMarks);
        const grade = await calculateGrade(percentage, studentDoc.school._id || studentDoc.school);

        const marks = await Marks.create({
            student, subject, exam, marksObtained, grade
        });

        const populated = await marks.populate('student subject exam');
        res.status(201).json({ success: true, data: populated, message: 'Marks uploaded successfully' });
    } catch (error) { next(error); }
};

// Bulk upload marks
exports.bulkCreate = async (req, res, next) => {
    try {
        const { marks: marksArray } = req.body;
        if (!Array.isArray(marksArray) || marksArray.length === 0) {
            return res.status(400).json({ success: false, message: 'Marks array is required' });
        }

        const results = [];
        const errors = [];

        for (const entry of marksArray) {
            try {
                const [studentDoc, subjectDoc, examDoc] = await Promise.all([
                    Student.findById(entry.student).populate('school'),
                    Subject.findById(entry.subject),
                    Exam.findById(entry.exam)
                ]);

                if (!studentDoc || !subjectDoc || !examDoc) {
                    errors.push({ entry, message: 'Student, subject, or exam not found' });
                    continue;
                }

                const maxMarks = Math.min(subjectDoc.maxMarks, examDoc.maxMarks);
                if (entry.marksObtained > maxMarks) {
                    errors.push({ entry, message: `Marks exceed maximum (${maxMarks})` });
                    continue;
                }

                const percentage = calculatePercentage(entry.marksObtained, maxMarks);
                const grade = await calculateGrade(percentage, studentDoc.school._id || studentDoc.school);

                const marks = await Marks.create({
                    student: entry.student,
                    subject: entry.subject,
                    exam: entry.exam,
                    marksObtained: entry.marksObtained,
                    grade,
                    remarks: entry.remarks
                });
                results.push(marks);
            } catch (err) {
                errors.push({ entry, message: err.message });
            }
        }

        res.status(201).json({
            success: true,
            data: { created: results.length, failed: errors.length, errors },
            message: `${results.length} marks uploaded, ${errors.length} failed`
        });
    } catch (error) { next(error); }
};

// Get all marks with filters
exports.getAll = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.student) filter.student = req.query.student;
        if (req.query.exam) filter.exam = req.query.exam;
        if (req.query.subject) filter.subject = req.query.subject;

        const marks = await Marks.find(filter)
            .populate('student subject exam')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: marks });
    } catch (error) { next(error); }
};

// Get marks by ID
exports.getById = async (req, res, next) => {
    try {
        const marks = await Marks.findById(req.params.id).populate('student subject exam');
        if (!marks) return res.status(404).json({ success: false, message: 'Marks not found' });
        res.json({ success: true, data: marks });
    } catch (error) { next(error); }
};

// Update marks
exports.update = async (req, res, next) => {
    try {
        const existing = await Marks.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: 'Marks not found' });

        if (req.body.marksObtained !== undefined) {
            const [subjectDoc, examDoc, studentDoc] = await Promise.all([
                Subject.findById(existing.subject),
                Exam.findById(existing.exam),
                Student.findById(existing.student).populate('school')
            ]);

            const maxMarks = Math.min(subjectDoc.maxMarks, examDoc.maxMarks);
            if (req.body.marksObtained > maxMarks) {
                return res.status(400).json({
                    success: false,
                    message: `Marks obtained (${req.body.marksObtained}) cannot exceed maximum marks (${maxMarks})`
                });
            }

            const percentage = calculatePercentage(req.body.marksObtained, maxMarks);
            req.body.grade = await calculateGrade(percentage, studentDoc.school._id || studentDoc.school);
        }

        const marks = await Marks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate('student subject exam');
        res.json({ success: true, data: marks, message: 'Marks updated successfully' });
    } catch (error) { next(error); }
};

// Delete marks
exports.delete = async (req, res, next) => {
    try {
        const marks = await Marks.findByIdAndDelete(req.params.id);
        if (!marks) return res.status(404).json({ success: false, message: 'Marks not found' });
        res.json({ success: true, message: 'Marks deleted successfully' });
    } catch (error) { next(error); }
};

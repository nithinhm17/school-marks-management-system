const Exam = require('../models/Exam');

exports.getAll = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.class) filter.class = req.query.class;
        if (req.query.academicYear) filter.academicYear = req.query.academicYear;
        const exams = await Exam.find(filter).populate('class').sort({ date: -1, name: 1 });
        res.json({ success: true, data: exams });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const exam = await Exam.findById(req.params.id).populate('class');
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, data: exam });
    } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
    try {
        const exam = await Exam.create(req.body);
        const populated = await exam.populate('class');
        res.status(201).json({ success: true, data: populated, message: 'Exam created successfully' });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('class');
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, data: exam, message: 'Exam updated successfully' });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, message: 'Exam deleted successfully' });
    } catch (error) { next(error); }
};

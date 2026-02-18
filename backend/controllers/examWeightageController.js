const ExamWeightage = require('../models/ExamWeightage');

exports.getAll = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.school) filter.school = req.query.school;
        if (req.query.class) filter.class = req.query.class;
        const weightages = await ExamWeightage.find(filter).populate('exam school class').sort({ weightagePercent: -1 });
        res.json({ success: true, data: weightages });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const weightage = await ExamWeightage.findById(req.params.id).populate('exam school class');
        if (!weightage) return res.status(404).json({ success: false, message: 'Exam weightage not found' });
        res.json({ success: true, data: weightage });
    } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
    try {
        const weightage = await ExamWeightage.create(req.body);
        const populated = await weightage.populate('exam school class');
        res.status(201).json({ success: true, data: populated, message: 'Exam weightage created successfully' });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const weightage = await ExamWeightage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('exam school class');
        if (!weightage) return res.status(404).json({ success: false, message: 'Exam weightage not found' });
        res.json({ success: true, data: weightage, message: 'Exam weightage updated successfully' });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const weightage = await ExamWeightage.findByIdAndDelete(req.params.id);
        if (!weightage) return res.status(404).json({ success: false, message: 'Exam weightage not found' });
        res.json({ success: true, message: 'Exam weightage deleted successfully' });
    } catch (error) { next(error); }
};

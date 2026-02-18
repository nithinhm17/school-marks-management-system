const GradeRange = require('../models/GradeRange');

exports.getAll = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.school) filter.school = req.query.school;
        const grades = await GradeRange.find(filter).populate('school').sort({ minPercentage: -1 });
        res.json({ success: true, data: grades });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const grade = await GradeRange.findById(req.params.id).populate('school');
        if (!grade) return res.status(404).json({ success: false, message: 'Grade range not found' });
        res.json({ success: true, data: grade });
    } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
    try {
        const grade = await GradeRange.create(req.body);
        const populated = await grade.populate('school');
        res.status(201).json({ success: true, data: populated, message: 'Grade range created successfully' });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const grade = await GradeRange.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('school');
        if (!grade) return res.status(404).json({ success: false, message: 'Grade range not found' });
        res.json({ success: true, data: grade, message: 'Grade range updated successfully' });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const grade = await GradeRange.findByIdAndDelete(req.params.id);
        if (!grade) return res.status(404).json({ success: false, message: 'Grade range not found' });
        res.json({ success: true, message: 'Grade range deleted successfully' });
    } catch (error) { next(error); }
};

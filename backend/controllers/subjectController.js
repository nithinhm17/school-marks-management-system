const Subject = require('../models/Subject');

exports.getAll = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.class) filter.class = req.query.class;
        const subjects = await Subject.find(filter).populate('class').sort({ name: 1 });
        res.json({ success: true, data: subjects });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id).populate('class');
        if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
        res.json({ success: true, data: subject });
    } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
    try {
        const subject = await Subject.create(req.body);
        const populated = await subject.populate('class');
        res.status(201).json({ success: true, data: populated, message: 'Subject created successfully' });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('class');
        if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
        res.json({ success: true, data: subject, message: 'Subject updated successfully' });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
        res.json({ success: true, message: 'Subject deleted successfully' });
    } catch (error) { next(error); }
};

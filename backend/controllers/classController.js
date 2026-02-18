const Class = require('../models/Class');

exports.getAll = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.school) filter.school = req.query.school;
        const classes = await Class.find(filter).populate('school').sort({ name: 1 });
        res.json({ success: true, data: classes });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const cls = await Class.findById(req.params.id).populate('school');
        if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
        res.json({ success: true, data: cls });
    } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
    try {
        const cls = await Class.create(req.body);
        const populated = await cls.populate('school');
        res.status(201).json({ success: true, data: populated, message: 'Class created successfully' });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('school');
        if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
        res.json({ success: true, data: cls, message: 'Class updated successfully' });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const cls = await Class.findByIdAndDelete(req.params.id);
        if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
        res.json({ success: true, message: 'Class deleted successfully' });
    } catch (error) { next(error); }
};

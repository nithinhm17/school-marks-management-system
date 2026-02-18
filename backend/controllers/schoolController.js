const School = require('../models/School');

exports.getAll = async (req, res, next) => {
    try {
        const schools = await School.find().populate('board').sort({ name: 1 });
        res.json({ success: true, data: schools });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const school = await School.findById(req.params.id).populate('board');
        if (!school) return res.status(404).json({ success: false, message: 'School not found' });
        res.json({ success: true, data: school });
    } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
    try {
        const school = await School.create(req.body);
        const populated = await school.populate('board');
        res.status(201).json({ success: true, data: populated, message: 'School created successfully' });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('board');
        if (!school) return res.status(404).json({ success: false, message: 'School not found' });
        res.json({ success: true, data: school, message: 'School updated successfully' });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);
        if (!school) return res.status(404).json({ success: false, message: 'School not found' });
        res.json({ success: true, message: 'School deleted successfully' });
    } catch (error) { next(error); }
};

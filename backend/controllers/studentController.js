const Student = require('../models/Student');

exports.getAll = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.class) filter.class = req.query.class;
        if (req.query.school) filter.school = req.query.school;
        const students = await Student.find(filter).populate('class school').sort({ rollNumber: 1 });
        res.json({ success: true, data: students });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id).populate('class school');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, data: student });
    } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
    try {
        const student = await Student.create(req.body);
        const populated = await student.populate('class school');
        res.status(201).json({ success: true, data: populated, message: 'Student created successfully' });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('class school');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, data: student, message: 'Student updated successfully' });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (error) { next(error); }
};

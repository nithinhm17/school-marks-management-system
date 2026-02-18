const AcademicBoard = require('../models/AcademicBoard');

exports.getAll = async (req, res, next) => {
    try {
        const boards = await AcademicBoard.find().sort({ name: 1 });
        res.json({ success: true, data: boards });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const board = await AcademicBoard.findById(req.params.id);
        if (!board) return res.status(404).json({ success: false, message: 'Board not found' });
        res.json({ success: true, data: board });
    } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
    try {
        const board = await AcademicBoard.create(req.body);
        res.status(201).json({ success: true, data: board, message: 'Board created successfully' });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const board = await AcademicBoard.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!board) return res.status(404).json({ success: false, message: 'Board not found' });
        res.json({ success: true, data: board, message: 'Board updated successfully' });
    } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
    try {
        const board = await AcademicBoard.findByIdAndDelete(req.params.id);
        if (!board) return res.status(404).json({ success: false, message: 'Board not found' });
        res.json({ success: true, message: 'Board deleted successfully' });
    } catch (error) { next(error); }
};

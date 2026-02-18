const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/examController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', [
    body('name').trim().notEmpty().withMessage('Exam name is required'),
    body('type').trim().notEmpty().withMessage('Exam type is required'),
    body('class').notEmpty().withMessage('Class is required'),
    body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
    body('maxMarks').isInt({ min: 1 }).withMessage('Maximum marks is required and must be at least 1'),
], validate, ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;

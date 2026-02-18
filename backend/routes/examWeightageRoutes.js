const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/examWeightageController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', [
    body('exam').notEmpty().withMessage('Exam is required'),
    body('school').notEmpty().withMessage('School is required'),
    body('class').notEmpty().withMessage('Class is required'),
    body('weightagePercent').isFloat({ min: 0, max: 100 }).withMessage('Weightage must be 0-100'),
], validate, ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;

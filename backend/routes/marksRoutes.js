const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/marksController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', [
    body('student').notEmpty().withMessage('Student is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('exam').notEmpty().withMessage('Exam is required'),
    body('marksObtained').isFloat({ min: 0 }).withMessage('Marks obtained must be 0 or more'),
], validate, ctrl.create);
router.post('/bulk', ctrl.bulkCreate);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;

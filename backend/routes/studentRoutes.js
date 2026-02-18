const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', [
    body('name').trim().notEmpty().withMessage('Student name is required'),
    body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
    body('class').notEmpty().withMessage('Class is required'),
    body('school').notEmpty().withMessage('School is required'),
], validate, ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;

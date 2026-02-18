const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/classController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', [
    body('name').trim().notEmpty().withMessage('Class name is required'),
    body('school').notEmpty().withMessage('School is required'),
    body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
], validate, ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/gradeRangeController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', [
    body('school').notEmpty().withMessage('School is required'),
    body('grade').trim().notEmpty().withMessage('Grade is required'),
    body('minPercentage').isFloat({ min: 0, max: 100 }).withMessage('Min percentage must be 0-100'),
    body('maxPercentage').isFloat({ min: 0, max: 100 }).withMessage('Max percentage must be 0-100'),
], validate, ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;

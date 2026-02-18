const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/schoolController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', [
    body('name').trim().notEmpty().withMessage('School name is required'),
    body('board').notEmpty().withMessage('Academic board is required'),
], validate, ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;

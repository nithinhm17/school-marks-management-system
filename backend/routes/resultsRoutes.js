const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resultsController');

router.get('/student/:studentId', ctrl.getStudentResult);
router.get('/student/:studentId/exam/:examId', ctrl.getStudentExamResult);
router.get('/class/:classId/exam/:examId', ctrl.getClassResults);

module.exports = router;

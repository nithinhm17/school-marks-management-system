const mongoose = require('mongoose');

const examWeightageSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: [true, 'Exam is required']
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School is required']
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, 'Class is required']
    },
    weightagePercent: {
        type: Number,
        required: [true, 'Weightage percentage is required'],
        min: [0, 'Weightage cannot be negative'],
        max: [100, 'Weightage cannot exceed 100']
    }
}, { timestamps: true });

examWeightageSchema.index({ exam: 1, school: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('ExamWeightage', examWeightageSchema);

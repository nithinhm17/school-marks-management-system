const mongoose = require('mongoose');

const gradeRangeSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School is required']
    },
    grade: {
        type: String,
        required: [true, 'Grade is required'],
        trim: true
    },
    minPercentage: {
        type: Number,
        required: [true, 'Minimum percentage is required'],
        min: 0,
        max: 100
    },
    maxPercentage: {
        type: Number,
        required: [true, 'Maximum percentage is required'],
        min: 0,
        max: 100
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

gradeRangeSchema.index({ school: 1, grade: 1 }, { unique: true });

module.exports = mongoose.model('GradeRange', gradeRangeSchema);

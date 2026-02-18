const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Exam name is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Exam type is required'],
        trim: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, 'Class is required']
    },
    academicYear: {
        type: String,
        required: [true, 'Academic year is required'],
        trim: true
    },
    maxMarks: {
        type: Number,
        required: [true, 'Maximum marks is required'],
        min: [1, 'Maximum marks must be at least 1']
    },
    date: {
        type: Date
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

examSchema.index({ name: 1, class: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Exam', examSchema);

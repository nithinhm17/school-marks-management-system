const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student is required']
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject is required']
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: [true, 'Exam is required']
    },
    marksObtained: {
        type: Number,
        required: [true, 'Marks obtained is required'],
        min: [0, 'Marks cannot be negative']
    },
    grade: {
        type: String,
        trim: true
    },
    remarks: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Compound unique index to prevent duplicate marks entry
marksSchema.index({ student: 1, subject: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model('Marks', marksSchema);

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        trim: true
    },
    code: {
        type: String,
        trim: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, 'Class is required']
    },
    maxMarks: {
        type: Number,
        required: [true, 'Maximum marks is required'],
        min: [1, 'Maximum marks must be at least 1']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

subjectSchema.index({ name: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);

const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'School name is required'],
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicBoard',
        required: [true, 'Academic board is required']
    },
    contactEmail: {
        type: String,
        trim: true
    },
    contactPhone: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);

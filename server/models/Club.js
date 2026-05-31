const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    headName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    collegeCode: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    signatureUrl: {
        type: String,
        trim: true
    },
    sealUrl: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);

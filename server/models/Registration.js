const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    event: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
        title: { type: String, required: true },
        organizingClub: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
            name: { type: String, required: true }
        }
    },
    student: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        name: { type: String, required: true },
        universityID: { type: String, required: true },
        email: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isPaid: { type: Boolean, default: false },
    transactionID: { type: String }, // For paid events
    paymentUsername: { type: String }, // Name/ID used for payment
    rejectionReason: { type: String },
    attendanceStatus: {
        type: String,
        enum: ['absent', 'present'],
        default: 'absent'
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    certificateUrl: { type: String },
    isCertificatePosted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);

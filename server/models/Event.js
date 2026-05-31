const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Workshop, Seminar, Cultural, etc.
    organizingClub: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
        name: { type: String, required: true }
    },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    registrationDeadline: { type: Date, required: true },
    venue: { type: String, required: true },
    mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Offline' },
    meetingLink: { type: String },
    maxParticipants: { type: Number, required: true },
    eligibility: { type: String },
    registrationRequired: { type: Boolean, default: true },
    posterUrl: { type: String },
    brochureUrl: { type: String },
    organizerName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contacts: [{
        name: { type: String, required: true },
        number: { type: String, required: true }
    }],
    certificateAvailable: { type: Boolean, default: false },
    feedbackEnabled: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    registrationAmount: { type: Number, default: 0 },
    paymentQRUrl: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isPosted: { type: Boolean, default: false },
    registrationClosed: { type: Boolean, default: false },
    rejectionReason: { type: String },
    attendanceCode: { type: String },
    attendanceCodeExpires: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);

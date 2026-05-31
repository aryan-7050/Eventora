const mongoose = require('mongoose');

const EditedEventSchema = new mongoose.Schema({
    originalEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
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
    rejectionReason: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EditedEvent', EditedEventSchema);

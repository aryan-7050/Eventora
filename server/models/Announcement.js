const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderType: { type: String, enum: ['Club', 'Admin'], required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    audience: [{ 
        type: String, 
        enum: ['everyone', 'all_students', 'all_clubs', 'admin', 'registered_participants', 'specific_clubs'] 
    }],
    targetEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // For registered_participants
    targetClubIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }], // For specific_clubs
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);

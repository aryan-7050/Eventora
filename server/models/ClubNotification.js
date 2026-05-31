const mongoose = require('mongoose');

const clubNotificationSchema = new mongoose.Schema({
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ClubNotification', clubNotificationSchema);

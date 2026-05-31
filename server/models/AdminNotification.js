const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
    sender: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, required: true }, // 'Club' or 'System'
        name: { type: String, required: true }
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AdminNotification', adminNotificationSchema);

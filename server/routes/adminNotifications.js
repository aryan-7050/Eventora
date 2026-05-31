const express = require('express');
const router = express.Router();
const AdminNotification = require('../models/AdminNotification');

// Get all notifications for admin
router.get('/', async (req, res) => {
    try {
        const notifications = await AdminNotification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
});

// Mark a notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const notification = await AdminNotification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: 'Server error marking notification read' });
    }
});

// Mark all as read
router.put('/read-all', async (req, res) => {
    try {
        await AdminNotification.updateMany({ read: false }, { read: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

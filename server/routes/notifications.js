const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const ClubNotification = require('../models/ClubNotification');

// Get notifications for a student
router.get('/:studentId', async (req, res) => {
    try {
        const notifications = await Notification.find({ student: req.params.studentId })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

// Mark notification as read
router.put('/read/:id', async (req, res) => {
    try {
        const { isClub } = req.query;
        const model = isClub === 'true' ? ClubNotification : Notification;
        await model.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update notification' });
    }
});

// Get notifications for a club
router.get('/club/:clubId', async (req, res) => {
    try {
        const notifications = await ClubNotification.find({ club: req.params.clubId })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch club notifications' });
    }
});

// Mark all club notifications as read
router.put('/club/:clubId/read-all', async (req, res) => {
    try {
        await ClubNotification.updateMany(
            { club: req.params.clubId, read: false },
            { read: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update notifications' });
    }
});

module.exports = router;

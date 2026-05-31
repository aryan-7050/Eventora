const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const Student = require('../models/Student');
const Club = require('../models/Club');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');
const ClubNotification = require('../models/ClubNotification');

const AdminNotification = require('../models/AdminNotification');

// Create an announcement
router.post('/create', async (req, res) => {
    try {
        const { senderId, senderType, senderName, message, audience, targetEventId, targetClubIds } = req.body;
        
        // Ensure audience is an array
        const audienceList = Array.isArray(audience) ? audience : [audience];

        const announcement = new Announcement({
            senderId, senderType, senderName, message, audience: audienceList, targetEventId, targetClubIds
        });
        await announcement.save();

        // Trigger individual notifications for each selected audience
        for (const target of audienceList) {
            if (target === 'everyone' || target === 'all_students') {
                const students = await Student.find({});
                const notifications = students.map(student => ({
                    student: student._id,
                    title: `Emergency Announcement from ${senderName}`,
                    message: message,
                    type: 'warning'
                }));
                await Notification.insertMany(notifications);
            }

            if (target === 'everyone' || target === 'all_clubs') {
                const clubs = await Club.find({ isApproved: true });
                const notifications = clubs.map(club => ({
                    club: club._id,
                    title: `Emergency Announcement from ${senderName}`,
                    message: message,
                    type: 'warning'
                }));
                await ClubNotification.insertMany(notifications);
            }

            if (target === 'registered_participants' && targetEventId) {
                const registrations = await Registration.find({ 'event.id': targetEventId, status: 'approved' });
                const studentIds = [...new Set(registrations.map(r => r.student.id))];
                const notifications = studentIds.map(sid => ({
                    student: sid,
                    title: `Emergency Update: ${senderName}`,
                    message: message,
                    type: 'warning'
                }));
                await Notification.insertMany(notifications);
            }

            if (target === 'specific_clubs' && targetClubIds) {
                const notifications = targetClubIds.map(clubId => ({
                    club: clubId,
                    title: `Admin Alert: ${senderName}`,
                    message: message,
                    type: 'warning'
                }));
                await ClubNotification.insertMany(notifications);
            }

            if (target === 'admin') {
                const adminAlert = new AdminNotification({
                    sender: { id: senderId, type: senderType, name: senderName },
                    title: `CLUB ALERT: ${senderName}`,
                    message: message,
                    type: 'warning'
                });
                await adminAlert.save();
            }
        }

        res.status(201).json({ message: 'Announcement created and notifications broadcasted', announcement });
    } catch (err) {
        console.error('Announcement error:', err);
        res.status(500).json({ message: 'Failed to create announcement' });
    }
});

// Get history for a specific sender
router.get('/history/:senderId', async (req, res) => {
    try {
        const history = await Announcement.find({ senderId: req.params.senderId })
            .sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch announcement history' });
    }
});

// Get announcements for a specific user (Student)
router.get('/student/:studentId', async (req, res) => {
     try {
         // Students see 'everyone' and 'all_students'
         // For 'registered_participants', it's harder to query here directly without joining registrations
         // So we rely on the individual Notifications created above for efficiency.
         // This GET might be for a central announcement board if we add one.
         const announcements = await Announcement.find({
             audience: { $in: ['everyone', 'all_students'] }
         }).sort({ createdAt: -1 }).limit(10);
         res.json(announcements);
     } catch (err) {
         res.status(500).json({ message: 'Failed to fetch announcements' });
     }
});

module.exports = router;

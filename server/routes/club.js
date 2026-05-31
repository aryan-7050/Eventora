const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');

// Get club profile with stats
router.get('/profile/:id', async (req, res) => {
    try {
        const club = await Club.findById(req.params.id).select('-password');
        if (!club) return res.status(404).json({ message: 'Club not found' });

        // Get stats
        const events = await Event.find({ 'organizingClub.id': req.params.id });
        const eventIds = events.map(e => e._id);
        
        const hostedCount = events.length;
        const participantCount = await Registration.countDocuments({ 
            'event.organizingClub.id': req.params.id,
            status: 'approved'
        });
        
        const feedbacks = await Feedback.find({ eventId: { $in: eventIds } });
        const avgRating = feedbacks.length > 0 
            ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
            : 0;

        res.json({
            ...club._doc,
            stats: {
                eventsHosted: hostedCount,
                totalParticipants: participantCount,
                avgRating: parseFloat(avgRating)
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update club profile
router.put('/profile/:id', async (req, res) => {
    try {
        const { name, headName, description, collegeCode } = req.body;
        const club = await Club.findByIdAndUpdate(
            req.params.id,
            { $set: { name, headName, description, collegeCode } },
            { new: true }
        ).select('-password');

        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json(club);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Change Password
router.put('/change-password/:id', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, club.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        club.password = await bcrypt.hash(newPassword, salt);
        await club.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Upload/Update Signature
router.put('/signature/:id', async (req, res) => {
    try {
        const { signatureUrl } = req.body;
        const club = await Club.findByIdAndUpdate(
            req.params.id,
            { $set: { signatureUrl } },
            { new: true }
        ).select('-password');
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json(club);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Upload/Update Official Seal
router.put('/seal/:id', async (req, res) => {
    try {
        const { sealUrl } = req.body;
        const club = await Club.findByIdAndUpdate(
            req.params.id,
            { $set: { sealUrl } },
            { new: true }
        ).select('-password');
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json(club);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get events ready for certificates (approved and have attendees)
router.get('/certificate-events/:id', async (req, res) => {
    try {
        const events = await Event.find({ 
            'organizingClub.id': req.params.id,
            status: 'approved'
        }).sort({ eventDate: -1 });

        // Filter events that have at least one attendee
        const eventsWithAttendance = await Promise.all(events.map(async (event) => {
            const attendeeCount = await Registration.countDocuments({
                'event.id': event._id,
                attendanceStatus: 'present'
            });
            const postedCount = await Registration.countDocuments({
                'event.id': event._id,
                isCertificatePosted: true
            });
            return attendeeCount > 0 ? { ...event._doc, attendeeCount, certificatesPosted: postedCount > 0 } : null;
        }));

        res.json(eventsWithAttendance.filter(e => e !== null));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get attendees for an event
router.get('/event-attendees/:eventId', async (req, res) => {
    try {
        const attendees = await Registration.find({
            'event.id': req.params.eventId,
            attendanceStatus: 'present'
        });
        res.json(attendees);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Save generated certificates
router.put('/save-certificates/:eventId', async (req, res) => {
    try {
        const { certificates } = req.body; // Array of { studentId, certificateUrl }
        
        const updates = certificates.map(cert => 
            Registration.findOneAndUpdate(
                { 'event.id': req.params.eventId, 'student.id': cert.studentId },
                { $set: { certificateUrl: cert.certificateUrl } },
                { new: true }
            )
        );
        
        await Promise.all(updates);
        res.json({ message: 'Certificates saved successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Post certificates and notify students
router.put('/post-certificates/:eventId', async (req, res) => {
    try {
        const registrations = await Registration.find({
            'event.id': req.params.eventId,
            attendanceStatus: 'present'
        });

        if (registrations.length === 0) {
            return res.status(404).json({ message: 'No attendees found for this event' });
        }

        const event = await Event.findById(req.params.eventId);

        // Update all registrations to posted
        await Registration.updateMany(
            { 'event.id': req.params.eventId, attendanceStatus: 'present' },
            { $set: { isCertificatePosted: true } }
        );

        // Create notifications for each student
        const notifications = registrations.map(reg => ({
            student: reg.student.id,
            title: 'Certificate Posted!',
            message: `Certificate for "${event.title}" is now available in your profile.`,
            type: 'success'
        }));

        await Notification.insertMany(notifications);

        res.json({ message: 'Certificates posted and students notified' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get dashboard stats and recent data
router.get('/dashboard/:id', async (req, res) => {
    try {
        const clubId = req.params.id;
        const events = await Event.find({ 'organizingClub.id': clubId });
        const eventIds = events.map(e => e._id);
        
        // 1. Basic Stats
        const totalEvents = events.length;
        const approvedEvents = events.filter(e => e.status === 'approved').length;
        
        // 2. Registration Stats
        const allRegistrations = await Registration.find({ 'event.organizingClub.id': clubId });
        const totalReach = allRegistrations.length;
        const approvedRegistrations = allRegistrations.filter(r => r.status === 'approved').length;
        
        // 3. Attendance Stats
        const attendedCount = allRegistrations.filter(r => r.attendanceStatus === 'present').length;
        const attendanceRate = approvedRegistrations > 0 
            ? ((attendedCount / approvedRegistrations) * 100).toFixed(0)
            : 0;
            
        // 4. Certificates
        const certificatesIssued = allRegistrations.filter(r => r.isCertificatePosted).length;
        
        // 5. Avg Registrations
        const avgRegistrations = totalEvents > 0 
            ? (totalReach / totalEvents).toFixed(0)
            : 0;

        // 6. Recent Events (Top 5)
        const recentEvents = await Event.find({ 'organizingClub.id': clubId })
            .sort({ createdAt: -1 })
            .limit(5);

        // Fetch registration counts for these recent events
        const recentEventsWithCounts = await Promise.all(recentEvents.map(async (event) => {
            const count = await Registration.countDocuments({ 'event.id': event._id });
            return {
                ...event._doc,
                registrations: count
            };
        }));

        // 7. Recent Registrations (Top 5)
        const newRegistrations = await Registration.find({ 'event.organizingClub.id': clubId })
            .sort({ registeredAt: -1 })
            .limit(5);

        res.json({
            stats: [
                { label: 'Events Created', value: totalEvents, color: 'teal', link: '/club/posted-events' },
                { label: 'Events Approved', value: approvedEvents, color: 'green', link: '/club/event-status' },
                { label: 'Avg Registrations', value: parseInt(avgRegistrations), color: 'blue', link: '/club/approve-students' }
            ],
            quickStats: {
                attendanceRate: `${attendanceRate}%`,
                totalReach: totalReach > 1000 ? (totalReach/1000).toFixed(1) + 'k' : totalReach,
                certificatesIssued
            },
            recentEvents: recentEventsWithCounts,
            newRegistrations
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching dashboard data', error: err.message });
    }
});

module.exports = router;

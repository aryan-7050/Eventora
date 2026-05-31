const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Notification = require('../models/Notification');

// Student: Register for an event
router.post('/register', async (req, res) => {
    try {
        const { eventId, studentId, studentName, universityID, email, isPaid, transactionID, paymentUsername } = req.body;

        // Check if already registered
        const existing = await Registration.findOne({ 'event.id': eventId, 'student.id': studentId });
        if (existing) {
            if (existing.status === 'rejected') {
                // Allow re-registration by deleting previous or updating? 
                // Let's delete it so a fresh one is created
                await Registration.findByIdAndDelete(existing._id);
            } else {
                return res.status(400).json({ message: 'You have already registered for this event.' });
            }
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const newRegistration = new Registration({
            event: {
                id: event._id,
                title: event.title,
                organizingClub: event.organizingClub
            },
            student: {
                id: studentId,
                name: studentName,
                universityID,
                email
            },
            status: 'pending',
            isPaid,
            transactionID,
            paymentUsername
        });

        await newRegistration.save();
        res.status(201).json({ message: 'Registration submitted successfully!', registration: newRegistration });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Student: Get my registrations
router.get('/student/:studentId', async (req, res) => {
    try {
        const registrations = await Registration.find({ 'student.id': req.params.studentId })
            .sort({ registeredAt: -1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch registrations' });
    }
});

// Club: Get pending registrations for their events
router.get('/club/:clubId', async (req, res) => {
    try {
        const registrations = await Registration.find({ 'event.organizingClub.id': req.params.clubId })
            .sort({ registeredAt: -1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch student registrations' });
    }
});

// Club: Approve/Reject registration
router.put('/status/:id', async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const registration = await Registration.findById(req.params.id);
        if (!registration) return res.status(404).json({ message: 'Registration not found' });

        registration.status = status;
        registration.rejectionReason = status === 'rejected' ? rejectionReason : '';
        await registration.save();

        // Create Notification for student
        const notification = new Notification({
            student: registration.student.id,
            title: `Registration ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: status === 'approved'
                ? `Your registration for "${registration.event.title}" has been approved!`
                : `Your registration for "${registration.event.title}" has been rejected. Reason: ${rejectionReason || 'Other'}`,
            type: status === 'approved' ? 'success' : 'error'
        });
        await notification.save();

        res.json({ message: `Registration ${status} successfully`, registration });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update registration status' });
    }
});

// Club: Get attendees for a specific event
router.get('/event/:eventId/attendees', async (req, res) => {
    try {
        const registrations = await Registration.find({ 'event.id': req.params.eventId, status: 'approved' })
            .select('student attendanceStatus')
            .sort({ 'student.name': 1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch attendees' });
    }
});

// Club: Manually mark attendance
router.patch('/:id/manual-attendance', async (req, res) => {
    try {
        const { status } = req.body; // 'present' or 'absent'
        console.log(`Manually marking attendance for registration ${req.params.id} to status ${status}`);

        const registration = await Registration.findByIdAndUpdate(
            req.params.id,
            { attendanceStatus: status },
            { new: true }
        );

        if (!registration) {
            console.log(`Registration ${req.params.id} not found for manual attendance update`);
            return res.status(404).json({ message: 'Registration not found' });
        }

        console.log(`Attendance updated successfully for ${registration.student.name}`);
        res.json({ message: 'Attendance status updated', registration });
    } catch (err) {
        console.error("Manual attendance update error:", err);
        res.status(500).json({ message: 'Failed to update attendance' });
    }
});

module.exports = router;

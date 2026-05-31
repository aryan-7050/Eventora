const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const EditedEvent = require('../models/EditedEvent');
const Notification = require('../models/Notification');

// Fetch approved and posted events for students
router.get('/browse', async (req, res) => {
    try {
        const events = await Event.find({ status: 'approved', isPosted: true, registrationClosed: { $ne: true } });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch event' });
    }
});

// Create a new event (Club)
router.post('/create', async (req, res) => {
    try {
        console.log("------------------- NEW EVENT REQUEST -------------------");
        console.log("Received data for event:", req.body.title);
        console.log("Organizing Club:", req.body.organizingClub);
        console.log("Payload size:", JSON.stringify(req.body).length, "bytes");

        const eventData = req.body;
        const newEvent = new Event(eventData);
        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully and sent for approval', event: newEvent });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create event' });
    }
});

// Get events for a specific club
router.get('/club/:clubId', async (req, res) => {
    try {
        const events = await Event.find({ 'organizingClub.id': req.params.clubId });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch club events' });
    }
});

// Update event (Reposting a rejected event)
router.put('/update/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { ...req.body, status: 'pending', rejectionReason: '', isPosted: false },
            { new: true }
        );
        res.json({ message: 'Event updated and reposted for approval', event: updatedEvent });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update event' });
    }
});

// Post an approved event
router.put('/post/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { isPosted: true },
            { new: true }
        );
        res.json({ message: 'Event posted successfully!', event });
    } catch (err) {
        res.status(500).json({ message: 'Failed to post event' });
    }
});




// Get current attendance status (Club)
router.get('/:id/attendance', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const active = event.attendanceCode && new Date() < new Date(event.attendanceCodeExpires);
        res.json({
            code: active ? event.attendanceCode : null,
            expires: active ? event.attendanceCodeExpires : null,
            active
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch attendance status' });
    }
});

// Generate attendance code (Club)
router.post('/:id/attendance/generate', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if there's already an active code
        if (event.attendanceCode && new Date() < new Date(event.attendanceCodeExpires)) {
            return res.json({
                message: 'Existing code is still active',
                code: event.attendanceCode,
                expires: event.attendanceCodeExpires
            });
        }

        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const expires = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

        event.attendanceCode = code;
        event.attendanceCodeExpires = expires;
        await event.save();

        res.json({ message: 'Attendance code generated', code, expires });
    } catch (err) {
        res.status(500).json({ message: 'Failed to generate code' });
    }
});

// Mark attendance (Student)
router.post('/:id/attendance/mark', async (req, res) => {
    try {
        const { studentId, code } = req.body;
        console.log(`Marking attendance for student ${studentId} with code ${code} for event ${req.params.id}`);

        const event = await Event.findById(req.params.id);
        if (!event) {
            console.log("Event not found");
            return res.status(404).json({ message: 'Event not found' });
        }

        if (!event.attendanceCode || event.attendanceCode !== code) {
            console.log(`Code mismatch: Expected ${event.attendanceCode}, got ${code}`);
            return res.status(400).json({ message: 'Invalid attendance code' });
        }

        if (new Date() > new Date(event.attendanceCodeExpires)) {
            console.log("Attendance code expired");
            return res.status(400).json({ message: 'Attendance code has expired' });
        }

        // Use new mongoose.Types.ObjectId() for explicit matching in nested fields
        const registration = await Registration.findOneAndUpdate(
            {
                'event.id': new mongoose.Types.ObjectId(req.params.id),
                'student.id': new mongoose.Types.ObjectId(studentId),
                status: 'approved'
            },
            { attendanceStatus: 'present' },
            { new: true }
        );

        if (!registration) {
            console.log(`Registration not found for student ${studentId} and event ${req.params.id} with status approved`);
            return res.status(404).json({ message: 'Approved registration not found for this event. Please ensure your registration is approved.' });
        }

        console.log("Attendance marked successfully");
        res.json({ message: 'Attendance marked successfully', registration });
    } catch (err) {
        console.error("Attendance marking error:", err);
        res.status(500).json({ message: 'Failed to mark attendance' });
    }
});

// Close registration for an event (Club)
router.put('/close-registration/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { registrationClosed: true },
            { new: true }
        );
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Registration closed successfully', event });
    } catch (err) {
        console.error('Close registration error:', err);
        res.status(500).json({ message: 'Failed to close registration' });
    }
});

// Propose an edit for an existing event (Club)
router.post('/edit-propose/:id', async (req, res) => {
    try {
        const originalEvent = await Event.findById(req.params.id);
        if (!originalEvent) return res.status(404).json({ message: 'Original event not found' });

        // Check if there's already a pending edit
        const existingEdit = await EditedEvent.findOne({ originalEventId: req.params.id, status: 'pending' });
        if (existingEdit) {
            return res.status(400).json({ message: 'An edit is already pending approval for this event' });
        }

        const editData = { ...req.body, originalEventId: req.params.id, status: 'pending' };
        // Remove _id and __v from the edit data if present
        delete editData._id;
        delete editData.__v;
        delete editData.isPosted;
        delete editData.attendanceCode;
        delete editData.attendanceCodeExpires;
        delete editData.registrationClosed;

        const editedEvent = new EditedEvent(editData);
        await editedEvent.save();

        res.status(201).json({ message: 'Edit proposal submitted for admin approval', editedEvent });
    } catch (err) {
        console.error('Propose edit error:', err);
        res.status(500).json({ message: 'Failed to submit edit proposal' });
    }
});

// Get edited event proposals for a club
router.get('/edited-events/club/:clubId', async (req, res) => {
    try {
        const edits = await EditedEvent.find({ 'organizingClub.id': req.params.clubId })
            .sort({ createdAt: -1 });
        res.json(edits);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch edited events' });
    }
});

// Apply approved edit to original event (Club posts the changes)
router.put('/apply-edit/:editId', async (req, res) => {
    try {
        const editedEvent = await EditedEvent.findById(req.params.editId);
        if (!editedEvent) return res.status(404).json({ message: 'Edited event not found' });
        if (editedEvent.status !== 'approved') {
            return res.status(400).json({ message: 'This edit has not been approved yet' });
        }

        // Copy all editable fields to the original event
        const updateFields = {
            title: editedEvent.title,
            description: editedEvent.description,
            category: editedEvent.category,
            eventDate: editedEvent.eventDate,
            startTime: editedEvent.startTime,
            endTime: editedEvent.endTime,
            registrationDeadline: editedEvent.registrationDeadline,
            venue: editedEvent.venue,
            mode: editedEvent.mode,
            meetingLink: editedEvent.meetingLink,
            maxParticipants: editedEvent.maxParticipants,
            eligibility: editedEvent.eligibility,
            registrationRequired: editedEvent.registrationRequired,
            posterUrl: editedEvent.posterUrl,
            brochureUrl: editedEvent.brochureUrl,
            organizerName: editedEvent.organizerName,
            contactEmail: editedEvent.contactEmail,
            contacts: editedEvent.contacts,
            certificateAvailable: editedEvent.certificateAvailable,
            feedbackEnabled: editedEvent.feedbackEnabled,
            isPaid: editedEvent.isPaid,
            registrationAmount: editedEvent.registrationAmount,
            paymentQRUrl: editedEvent.paymentQRUrl
        };

        await Event.findByIdAndUpdate(editedEvent.originalEventId, updateFields);
        await EditedEvent.findByIdAndDelete(req.params.editId);

        res.json({ message: 'Event updated successfully with approved changes' });
    } catch (err) {
        console.error('Apply edit error:', err);
        res.status(500).json({ message: 'Failed to apply edit' });
    }
});

// Notify registered participants about event updates (Club)
router.post('/notify-participants/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Find all approved registrations for this event
        const registrations = await Registration.find({
            'event.id': new mongoose.Types.ObjectId(req.params.id),
            status: 'approved'
        });

        if (registrations.length === 0) {
            return res.json({ message: 'No registered participants to notify', count: 0 });
        }

        // Create notifications for each registered student
        const notifications = registrations.map(reg => ({
            student: reg.student.id,
            title: 'Event Details Updated',
            message: `The details for "${event.title}" have been updated. Please check the event page for the latest information.`,
            type: 'info'
        }));

        await Notification.insertMany(notifications);

        res.json({ message: `Notifications sent to ${registrations.length} participants`, count: registrations.length });
    } catch (err) {
        console.error('Notify participants error:', err);
        res.status(500).json({ message: 'Failed to notify participants' });
    }
});

module.exports = router;

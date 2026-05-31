const express = require('express');
const router = express.Router();
const Club = require('../models/Club');

// Get all pending clubs
router.get('/pending-clubs', async (req, res) => {
    try {
        const pendingClubs = await Club.find({ isApproved: false });
        res.json(pendingClubs);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching clubs' });
    }
});

const { sendApprovalEmail } = require('../utils/emailService');

// Approve a club
router.put('/approve-club/:id', async (req, res) => {
    try {
        const club = await Club.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!club) return res.status(404).json({ message: 'Club not found' });

        // Send approval email in the background (don't await) to prevent UI hang
        sendApprovalEmail(club.email, club.name, club.headName).catch(err => {
            console.error('Background Email Error:', err);
        });

        res.json({ 
            message: 'Club approved successfully!', 
            club 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error approving club' });
    }
});

// Reject (Delete) a club
router.delete('/reject-club/:id', async (req, res) => {
    try {
        const { reason } = req.body;
        const club = await Club.findByIdAndDelete(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json({ message: 'Club rejected and removed. Reason: ' + (reason || 'No reason provided') });
    } catch (err) {
        res.status(500).json({ message: 'Server error rejecting club' });
    }
});

// Get all approved clubs
router.get('/clubs', async (req, res) => {
    try {
        const approvedClubs = await Club.find({ isApproved: true });
        res.json(approvedClubs);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching approved clubs' });
    }
});

/* ── EVENT MANAGEMENT ────────────────────────────────────── */
const Event = require('../models/Event');

// Get all pending events
router.get('/pending-events', async (req, res) => {
    try {
        const pendingEvents = await Event.find({ status: 'pending' });
        res.json(pendingEvents);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching pending events' });
    }
});

// Approve an event
router.put('/approve-event/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event approved successfully', event });
    } catch (err) {
        res.status(500).json({ message: 'Server error approving event' });
    }
});

// Reject an event
router.put('/reject-event/:id', async (req, res) => {
    try {
        const { reason } = req.body;
        const event = await Event.findByIdAndUpdate(req.params.id, {
            status: 'rejected',
            rejectionReason: reason || 'No reason provided'
        }, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event rejected. Reason: ' + (reason || 'No reason provided'), event });
    } catch (err) {
        res.status(500).json({ message: 'Server error rejecting event' });
    }
});

// Get all conducted events (posted events)
router.get('/conducted-events', async (req, res) => {
    try {
        const conductedEvents = await Event.find({ isPosted: true });
        res.json(conductedEvents);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching conducted events' });
    }
});

/* ── EDITED EVENT MANAGEMENT ────────────────────────────── */
const EditedEvent = require('../models/EditedEvent');
const ClubNotification = require('../models/ClubNotification');

// Get all pending edited events
router.get('/pending-edited-events', async (req, res) => {
    try {
        const pendingEdits = await EditedEvent.find({ status: 'pending' });
        res.json(pendingEdits);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching pending edited events' });
    }
});

// Approve an edited event
router.put('/approve-edited-event/:id', async (req, res) => {
    try {
        const editedEvent = await EditedEvent.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        if (!editedEvent) return res.status(404).json({ message: 'Edited event not found' });

        // Create notification for the club
        const notification = new ClubNotification({
            club: editedEvent.organizingClub.id,
            title: 'Event Edit Approved',
            message: `Your edit proposal for "${editedEvent.title}" has been approved. You can now post the changes.`,
            type: 'success'
        });
        await notification.save();

        res.json({ message: 'Edited event approved successfully', editedEvent });
    } catch (err) {
        res.status(500).json({ message: 'Server error approving edited event' });
    }
});

// Reject an edited event
router.put('/reject-edited-event/:id', async (req, res) => {
    try {
        const { reason } = req.body;
        const editedEvent = await EditedEvent.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected', rejectionReason: reason || 'No reason provided' },
            { new: true }
        );
        if (!editedEvent) return res.status(404).json({ message: 'Edited event not found' });

        // Create notification for the club
        const notification = new ClubNotification({
            club: editedEvent.organizingClub.id,
            title: 'Event Edit Rejected',
            message: `Your edit proposal for "${editedEvent.title}" was rejected. Reason: ${reason || 'No reason provided'}`,
            type: 'error'
        });
        await notification.save();

        res.json({ message: 'Edited event rejected', editedEvent });
    } catch (err) {
        res.status(500).json({ message: 'Server error rejecting edited event' });
    }
});

const Student = require('../models/Student');

// Get all students
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching students' });
    }
});

// Remove a student
router.delete('/student/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student account removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error removing student' });
    }
});

// Remove an approved club
router.delete('/club/:id', async (req, res) => {
    try {
        const club = await Club.findByIdAndDelete(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json({ message: 'Club removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error removing club' });
    }
});

// Get admin profile with stats
router.get('/profile/:id', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const totalClubs = await Club.countDocuments({ isApproved: true });
        const totalEvents = await Event.countDocuments({ status: 'approved' });
        const totalStudents = await Student.countDocuments();

        res.json({
            ...admin._doc,
            stats: {
                totalClubs,
                totalEvents,
                totalStudents
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update admin profile
router.put('/profile/:id', async (req, res) => {
    try {
        const { name, email, collegeCode } = req.body;
        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { $set: { name, email, collegeCode } },
            { new: true }
        ).select('-password');

        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Change Admin Password
router.put('/change-password/:id', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Upload/Update Official Seal (Admin Only)
router.put('/official-seal/:id', async (req, res) => {
    try {
        const { sealUrl } = req.body;
        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { $set: { sealUrl } },
            { new: true }
        ).select('-password');
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Public route to get the official seal (for clubs)
router.get('/get-official-seal', async (req, res) => {
    try {
        const admin = await Admin.findOne().select('sealUrl');
        res.json({ sealUrl: admin ? admin.sealUrl : '' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

const Admin = require('../models/Admin');
const Registration = require('../models/Registration');

// Get dashboard stats and pending approvals
router.get('/dashboard/:id', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalClubs = await Club.countDocuments({ isApproved: true });
        const approvedEvents = await Event.countDocuments({ status: 'approved' });
        const pendingEventsCount = await Event.countDocuments({ status: 'pending' });

        // Pending Pipelines
        const pendingClubs = await Club.find({ isApproved: false }).sort({ createdAt: -1 }).limit(5);
        const pendingEvents = await Event.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(5);

        // Performance Metrics
        const totalProcessedEvents = await Event.countDocuments({ status: { $in: ['approved', 'rejected'] } });
        const approvalRate = totalProcessedEvents > 0 
            ? ((approvedEvents / totalProcessedEvents) * 100).toFixed(0)
            : 0;

        const studentsWithRegs = await Registration.distinct('student.id');
        const participationRate = totalStudents > 0
            ? ((studentsWithRegs.length / totalStudents) * 100).toFixed(0)
            : 0;

        // Current Semester Events (Estimation)
        const now = new Date();
        const currentYear = now.getFullYear();
        const semesterStart = now.getMonth() >= 6 ? new Date(currentYear, 6, 1) : new Date(currentYear, 0, 1);
        const semesterEvents = await Event.countDocuments({ 
            eventDate: { $gte: semesterStart },
            status: 'approved' 
        });

        // Active Clubs
        const activeClubsCount = await Event.distinct('organizingClub.id', { status: 'approved' });

        res.json({
            stats: [
                { label: 'Registered Students', value: totalStudents, color: 'blue', link: '/admin/students' },
                { label: 'Registered Clubs', value: totalClubs, icon: 'Building2', color: 'purple', link: '/admin/clubs' },
                { label: 'Approved Events', value: approvedEvents, color: 'green', link: '/admin/events' },
                { label: 'Pending Approval', value: pendingEventsCount, color: 'orange', link: '/admin/approve-events' },
            ],
            pendingClubs,
            pendingEvents,
            quickStats: {
                approvalRate: `${approvalRate}%`,
                participationRate: `${participationRate}%`,
                semesterEvents,
                activeClubs: activeClubsCount.length
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching dashboard data', error: err.message });
    }
});

module.exports = router;

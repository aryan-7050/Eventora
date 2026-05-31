const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Registration = require('../models/Registration');
const bcrypt = require('bcryptjs');

// Get student profile
router.get('/profile/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select('-password');
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Get stats
        const registrationCount = await Registration.countDocuments({ 'student.id': req.params.id, status: 'approved' });
        const attendedCount = await Registration.countDocuments({ 
            'student.id': req.params.id, 
            attendanceStatus: 'present' 
        });
        const pendingCount = await Registration.countDocuments({ 
            'student.id': req.params.id, 
            status: 'pending' 
        });
        const totalRegistrations = await Registration.countDocuments({ 'student.id': req.params.id });

        res.json({
            ...student._doc,
            stats: {
                registrations: registrationCount,
                attended: attendedCount,
                pending: pendingCount,
                total: totalRegistrations
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update student profile
router.put('/profile/:id', async (req, res) => {
    try {
        const { name, collegeCode } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: { name, collegeCode } },
            { new: true }
        ).select('-password');

        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Change Password
router.put('/change-password/:id', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(newPassword, salt);
        await student.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;

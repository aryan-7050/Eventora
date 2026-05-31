const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const Student = require('../models/Student');
const Club = require('../models/Club');
const Admin = require('../models/Admin');

/* ── STUDENT AUTH ────────────────────────────────────────── */

// Student Register
router.post('/student/register', async (req, res) => {
    try {
        const { name, email, password, studentId, collegeCode } = req.body;

        // Fetch official admin college code
        let admin = await Admin.findOne({});
        
        if (!admin) {
            return res.status(400).json({ message: 'System not initialized. Please contact administrator.' });
        }

        if (!admin.collegeCode) {
            return res.status(400).json({ message: 'College Code not yet set by administrator.' });
        }
        
        const providedCode = collegeCode ? collegeCode.trim().toUpperCase() : '';
        const officialCode = admin.collegeCode.trim().toUpperCase();

        if (providedCode !== officialCode) {
            return res.status(400).json({ message: `Invalid College Code. Verification failed. Expected format similar to: ${admin.collegeCode}` });
        }

        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is required' });
        }

        // Check if student exists
        let student = await Student.findOne({ $or: [{ email }, { studentId }] });
        if (student) return res.status(400).json({ message: 'Student with this email or ID already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create student
        student = new Student({
            name,
            email,
            password: hashedPassword,
            studentId,
            collegeCode
        });

        await student.save();

        // Create Token
        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, student: { id: student._id, name: student.name, email: student.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Student Login
router.post('/student/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, student: { id: student._id, name: student.name, email: student.email } });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── CLUB AUTH ───────────────────────────────────────────── */

// Club Register
router.post('/club/register', async (req, res) => {
    try {
        const { name, headName, email, password, collegeCode, description } = req.body;

        let admin = await Admin.findOne({});

        if (!admin) {
            return res.status(400).json({ message: 'System not initialized. Please contact administrator.' });
        }

        if (!admin.collegeCode) {
            return res.status(400).json({ message: 'College Code not yet set by administrator.' });
        }
        
        const providedCode = collegeCode ? collegeCode.trim().toUpperCase() : '';
        const officialCode = admin.collegeCode.trim().toUpperCase();

        if (providedCode !== officialCode) {
            return res.status(400).json({ message: `Invalid College Code. Verification failed. Expected: ${admin.collegeCode}` });
        }

        let club = await Club.findOne({ email });
        if (club) return res.status(400).json({ message: 'Club already registered with this email' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        club = new Club({
            name,
            headName,
            email,
            password: hashedPassword,
            collegeCode,
            description,
            isApproved: false // Requires admin approval
        });

        await club.save();
        res.status(201).json({ message: 'Registration submitted. Waiting for admin approval.' });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Club Login
router.post('/club/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const club = await Club.findOne({ email });
        if (!club) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, club.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!club.isApproved) {
            return res.status(403).json({ message: 'Club not yet approved by admin' });
        }

        const token = jwt.sign({ id: club._id, role: 'club' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, club: { id: club._id, name: club.name, email: club.email } });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── ADMIN AUTH ──────────────────────────────────────────── */

router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // For simplicity, we check against the default admin credentials
        // In a real app, you'd use bcrypt and find the admin in the database
        if (email === 'admin@gmail.com') {
            let admin = await Admin.findOne({ email: 'admin@gmail.com' });
            
            // If the admin doesn't exist in the database yet, create it with hashed password
            if (!admin) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('admin', salt);
                admin = new Admin({
                    email: 'admin@gmail.com',
                    password: hashedPassword,
                    name: 'System Administrator'
                });
                await admin.save();
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid admin credentials' });

            const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.json({ 
                token, 
                user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' } 
            });
        }

        res.status(400).json({ message: 'Invalid admin credentials' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during admin login' });
    }
});

module.exports = router;

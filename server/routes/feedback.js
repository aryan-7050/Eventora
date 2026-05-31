const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Student = require('../models/Student');
const Event = require('../models/Event');

// Submit feedback
router.post('/submit', async (req, res) => {
    try {
        const { eventId, studentId, rating, review } = req.body;
        console.log(`[Feedback] New submission: Event=${eventId}, Student=${studentId}, Rating=${rating}`);
        
        // Check if feedback already exists for this student and event
        const existing = await Feedback.findOne({ eventId, studentId });
        if (existing) {
            return res.status(400).json({ message: 'You have already submitted feedback for this event' });
        }

        const feedback = new Feedback({
            eventId,
            studentId,
            rating,
            review
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (err) {
        console.error('Feedback submission error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get feedback for an event
router.get('/event/:eventId', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ eventId: req.params.eventId })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        console.error('Fetch feedback error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get feedback submitted by a student
router.get('/student/:studentId', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ studentId: req.params.studentId });
        res.json(feedbacks);
    } catch (err) {
        console.error('Fetch student feedback error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;

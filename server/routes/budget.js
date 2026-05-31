const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get budget for an event
router.get('/event/:eventId', async (req, res) => {
    try {
        let budget = await Budget.findOne({ eventId: req.params.eventId });
        if (!budget) {
            // Create a default budget if not found (requested by user for each event)
            budget = new Budget({ 
                eventId: req.params.eventId,
                clubId: req.query.clubId, // Should pass from frontend
                items: [],
                totalEstimated: 0,
                totalActual: 0
            });
            await budget.save();
        }
        res.json(budget);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch budget' });
    }
});

// Update budget (add/edit items)
router.put('/update/:eventId', async (req, res) => {
    try {
        const { items, sponsors, notes } = req.body;
        
        let totalEstimated = 0;
        let totalActual = 0;
        
        if (items) {
            items.forEach(item => {
                totalEstimated += Number(item.estimatedAmount || 0);
                totalActual += Number(item.actualAmount || 0);
            });
        }

        const budget = await Budget.findOneAndUpdate(
            { eventId: req.params.eventId },
            { 
                items, 
                sponsors, 
                notes,
                totalEstimated,
                totalActual
            },
            { new: true, upsert: true }
        );
        res.json({ message: 'Budget updated', budget });
    } catch (err) {
        console.error('Budget update error:', err);
        res.status(500).json({ message: 'Failed to update budget' });
    }
});

module.exports = router;

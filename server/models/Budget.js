const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    items: [{
        description: { type: String, required: true },
        category: { type: String, enum: ['Venue', 'Equipment', 'Marketing', 'Refreshments', 'Prizes', 'Speakers', 'Other'], default: 'Other' },
        estimatedAmount: { type: Number, required: true },
        actualAmount: { type: Number, default: 0 },
        status: { type: String, enum: ['Planned', 'Paid', 'Pending'], default: 'Planned' }
    }],
    totalEstimated: { type: Number, default: 0 },
    totalActual: { type: Number, default: 0 },
    sponsors: [{
        name: { type: String },
        amount: { type: Number }
    }],
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);

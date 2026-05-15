const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tripName: {
        type: String,
        required: [true, "Trip ka naam zaroori hai"]
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: String,
    // Itinerary Builder data (Checklist Point 1 & 3)
    stops: [{
        city: String,
        arrivalDate: Date,
        duration: Number,
        activities: [{
            name: String,
            cost: { type: Number, default: 0 }
        }]
    }],
    totalBudget: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Trip', tripSchema);
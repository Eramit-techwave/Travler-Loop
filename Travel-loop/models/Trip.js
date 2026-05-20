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
    origin: {
        type: String,
        default: 'Current Location'
    },
    destination: {
        type: String,
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: String,
    status: {
        type: String,
        enum: ['planning', 'ongoing', 'completed', 'cancelled'],
        default: 'planning'
    },
    // Itinerary Builder data
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
    },
    totalDistance: {
        type: Number,
        default: 0,
        description: 'Total distance in km'
    },
    travelers: {
        type: String,
        default: '1 Person'
    },
    hotels: [{
        name: String,
        location: String,
        checkIn: Date,
        checkOut: Date,
        price: Number,
        rating: Number,
        bookedDate: Date
    }],
    weather: {
        temp: Number,
        condition: Number,
        humidity: Number,
        windSpeed: Number,
        lastUpdated: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trip', tripSchema);
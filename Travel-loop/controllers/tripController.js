const Trip = require('../models/Trip');

// ── CREATE NEW TRIP ──
exports.createTrip = async (req, res) => {
    try {
        // Frontend se aane wala data nikalna
        const { tripName, startDate, endDate, description, totalBudget } = req.body;

        // Validation: Check if the request has a user from 'protect' middleware
        if (!req.user || !req.user._id) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication failed: User information not found." 
            });
        }

        // Creating the document matching your schema
        const newTrip = await Trip.create({
            userId: req.user._id, // Matching your schema's 'userId' field
            tripName,
            startDate,
            endDate: endDate || startDate, // Fallback if endDate is not provided
            description,
            totalBudget: totalBudget || 0,
            stops: [] // Initialized as an empty array as per your schema
        });

        res.status(201).json({
            success: true,
            message: "Success: Itinerary has been successfully created.",
            data: newTrip
        });

    } catch (error) {
        console.error("Internal Server Error:", error.message);
        res.status(500).json({
            success: false,
            message: `Execution Error: ${error.message}`
        });
    }
};

// ── FETCH USER TRIPS ──
exports.getMyTrips = async (req, res) => {
    try {
        // Find all trips belonging to the logged-in user
        const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: trips.length,
            data: trips
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve itineraries."
        });
    }
};
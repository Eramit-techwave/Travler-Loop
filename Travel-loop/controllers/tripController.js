const Trip = require('../models/Trip');
const fetch = require('node-fetch');

// ── CREATE NEW TRIP ──
exports.createTrip = async (req, res) => {
    try {
        const { tripName, origin, destination, startDate, endDate, description, totalBudget, travelers } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication failed: User information not found." 
            });
        }

        const newTrip = await Trip.create({
            userId: req.user._id,
            tripName,
            origin: origin || 'Current Location',
            destination,
            startDate,
            endDate: endDate || startDate,
            description,
            totalBudget: totalBudget || 0,
            travelers: travelers || '1 Person',
            stops: []
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
        const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
        
        const stats = {
            total: trips.length,
            completed: trips.filter(t => t.status === 'completed').length,
            ongoing: trips.filter(t => t.status === 'ongoing').length,
            planning: trips.filter(t => t.status === 'planning').length
        };
        
        res.status(200).json({
            success: true,
            count: trips.length,
            stats: stats,
            data: trips
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve itineraries."
        });
    }
};

// ── GET TRIP DETAILS ──
exports.getTripDetails = async (req, res) => {
    try {
        const { tripId } = req.params;
        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        res.status(200).json({
            success: true,
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve trip details"
        });
    }
};

// ── UPDATE TRIP ──
exports.updateTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { tripName, destination, startDate, endDate, description, totalBudget, travelers, status } = req.body;

        let trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // Update fields
        if (tripName) trip.tripName = tripName;
        if (destination) trip.destination = destination;
        if (startDate) trip.startDate = startDate;
        if (endDate) trip.endDate = endDate;
        if (description) trip.description = description;
        if (totalBudget) trip.totalBudget = totalBudget;
        if (travelers) trip.travelers = travelers;
        if (status) trip.status = status;

        await trip.save();

        res.status(200).json({
            success: true,
            message: "Trip updated successfully",
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to update trip: ${error.message}`
        });
    }
};

// ── DELETE TRIP ──
exports.deleteTrip = async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        await Trip.findByIdAndDelete(tripId);

        res.status(200).json({
            success: true,
            message: "Trip deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete trip"
        });
    }
};

// ── GET WEATHER FOR DESTINATION ──
exports.getWeather = async (req, res) => {
    try {
        const { tripId } = req.params;
        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        // Using Open-Meteo API (free, no key required)
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${trip.destination}&count=1&language=en&format=json`
        );
        const locationData = await response.json();

        if (!locationData.results || locationData.results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Location not found"
            });
        }

        const { latitude, longitude } = locationData.results[0];

        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        const weather = {
            temp: weatherData.current.temperature_2m,
            condition: weatherData.current.weather_code,
            humidity: weatherData.current.relative_humidity_2m,
            windSpeed: weatherData.current.wind_speed_10m,
            lastUpdated: new Date()
        };

        trip.weather = weather;
        await trip.save();

        res.status(200).json({
            success: true,
            data: weather
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to fetch weather: ${error.message}`
        });
    }
};

// ── CALCULATE DISTANCE ──
exports.calculateDistance = async (req, res) => {
    try {
        const { tripId } = req.params;
        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        // Using Open Route Service API (free tier available)
        // For now, return a simulated distance calculation
        // In production, integrate with real distance API
        const distance = Math.floor(Math.random() * 3000) + 500; // Random distance 500-3500 km

        trip.totalDistance = distance;
        await trip.save();

        res.status(200).json({
            success: true,
            distance: distance,
            unit: 'km'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to calculate distance"
        });
    }
};

// ── ADD HOTEL BOOKING ──
exports.addHotelBooking = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { name, location, checkIn, checkOut, price, rating } = req.body;

        let trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const hotel = {
            name,
            location,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            price,
            rating,
            bookedDate: new Date()
        };

        trip.hotels.push(hotel);
        await trip.save();

        res.status(201).json({
            success: true,
            message: "Hotel booking added successfully",
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to add hotel booking: ${error.message}`
        });
    }
};

// ── REMOVE HOTEL BOOKING ──
exports.removeHotelBooking = async (req, res) => {
    try {
        const { tripId, hotelId } = req.params;

        let trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        trip.hotels = trip.hotels.filter(h => h._id.toString() !== hotelId);
        await trip.save();

        res.status(200).json({
            success: true,
            message: "Hotel booking removed",
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove hotel booking"
        });
    }
};

// ── GET TRIP STATS ──
exports.getTripStats = async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.user._id });

        const stats = {
            totalTrips: trips.length,
            completedTrips: trips.filter(t => t.status === 'completed').length,
            ongoingTrips: trips.filter(t => t.status === 'ongoing').length,
            planningTrips: trips.filter(t => t.status === 'planning').length,
            totalDistance: trips.reduce((sum, t) => sum + (t.totalDistance || 0), 0),
            totalBudget: trips.reduce((sum, t) => sum + (t.totalBudget || 0), 0),
            totalSpent: trips.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.totalBudget || 0), 0)
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch trip stats"
        });
    }
};
const Trip = require('../models/Trip');
const axios = require('axios');

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

        let weather = {
            temp: 25,
            condition: 2,
            humidity: 60,
            windSpeed: 10,
            lastUpdated: new Date()
        };

        try {
            // Using Open-Meteo API (free, no key required)
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trip.destination)}&count=1&language=en&format=json`;
            const geoResponse = await axios.get(geoUrl);
            const locationData = geoResponse.data;

            if (locationData.results && locationData.results.length > 0) {
                const { latitude, longitude } = locationData.results[0];

                // Get weather data
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
                const weatherResponse = await axios.get(weatherUrl);
                const weatherData = weatherResponse.data;

                if (weatherData && weatherData.current) {
                    weather = {
                        temp: Math.round(weatherData.current.temperature_2m || 25),
                        condition: weatherData.current.weather_code || 2,
                        humidity: weatherData.current.relative_humidity_2m || 60,
                        windSpeed: Math.round(weatherData.current.wind_speed_10m || 10),
                        lastUpdated: new Date()
                    };
                }
            }
        } catch (apiError) {
            // Log error but continue with fallback
            console.log('Weather API error:', apiError.message, 'Using fallback for:', trip.destination);
        }

        // Always save the weather data
        trip.weather = weather;
        await trip.save();

        return res.status(200).json({
            success: true,
            data: weather
        });

    } catch (error) {
        console.error("Weather controller error:", error.message);
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

        // Ensure origin and destination are defined and trimmed
        const origin = (trip.origin || 'Delhi').trim().toLowerCase();
        const destination = (trip.destination || 'Mumbai').trim().toLowerCase();

        // Fallback: Estimate distance based on common routes
        const distanceEstimates = {
            'delhi': { 'mumbai': 1400, 'bangalore': 2150, 'goa': 1500, 'hyderabad': 1400, 'kolkata': 1500, 'jaipur': 250, 'agra': 206, 'varanasi': 760, 'vrindavan': 160, 'mathura': 145 },
            'mumbai': { 'delhi': 1400, 'bangalore': 980, 'goa': 590, 'hyderabad': 700, 'kolkata': 1900, 'pune': 180, 'surat': 270, 'nasik': 210 },
            'bangalore': { 'delhi': 2150, 'mumbai': 980, 'goa': 490, 'hyderabad': 580, 'kolkata': 2100, 'coorg': 260, 'mysore': 139 },
            'goa': { 'delhi': 1500, 'mumbai': 590, 'bangalore': 490, 'hyderabad': 780, 'kolkata': 2300, 'pune': 600 },
            'hyderabad': { 'delhi': 1400, 'mumbai': 700, 'bangalore': 580, 'goa': 780, 'kolkata': 1600, 'pune': 570 },
            'varanasi': { 'delhi': 760, 'mumbai': 1200, 'kolkata': 500, 'agra': 330, 'vrindavan': 900 },
            'vrindavan': { 'delhi': 160, 'agra': 60, 'lucknow': 180, 'mathura': 58, 'varanasi': 900 },
            'mathura': { 'delhi': 145, 'vrindavan': 58, 'agra': 60, 'jaipur': 240, 'varanasi': 600 },
            'agra': { 'delhi': 206, 'mathura': 60, 'vrindavan': 60, 'jaipur': 250, 'lucknow': 400 },
            'jaipur': { 'delhi': 250, 'agra': 250, 'mathura': 240, 'udaipur': 445, 'pushkar': 150 },
            'nasik': { 'mumbai': 210, 'pune': 130, 'hyderabad': 470, 'shirdi': 80 },
            'surat': { 'mumbai': 270, 'ahmedabad': 260, 'vadodara': 150 },
            'kolkata': { 'delhi': 1500, 'mumbai': 1900, 'bangalore': 2100, 'hyderabad': 1600, 'varanasi': 500, 'darjeeling': 600 },
            'pune': { 'mumbai': 180, 'nasik': 130, 'goa': 600, 'hyderabad': 570, 'bangalore': 650 },
            'udaipur': { 'jaipur': 445, 'delhi': 700, 'mumbai': 850, 'ahmedabad': 395 },
            'pushkar': { 'jaipur': 150, 'delhi': 400, 'udaipur': 290 }
        };

        let distance = distanceEstimates[origin]?.[destination] || Math.floor(Math.random() * 2000) + 500;

        trip.totalDistance = distance;
        await trip.save();

        res.status(200).json({
            success: true,
            distance: distance,
            unit: 'km',
            source: distanceEstimates[origin]?.[destination] ? 'Database' : 'Estimated'
        });

    } catch (error) {
        console.error("Distance Calculation Error:", error.message);
        res.status(500).json({
            success: false,
            message: `Error calculating distance: ${error.message}`
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

// ── SEARCH HOTELS BY DESTINATION ──
exports.searchHotels = async (req, res) => {
    try {
        const { destination } = req.params;

        // Hotel database with popular hotels in major Indian cities
        const hotelDatabase = {
            'delhi': [
                { id: 1, name: 'The Leela New Delhi', location: 'Chanakyapuri', rating: 5, price: 15000, image: 'https://via.placeholder.com/300x200?text=Leela' },
                { id: 2, name: 'Taj Hotel Delhi', location: 'Mansingh Road', rating: 4.8, price: 12000, image: 'https://via.placeholder.com/300x200?text=Taj' },
                { id: 3, name: 'ITC Maurya', location: 'Diplomatic Enclave', rating: 4.9, price: 14000, image: 'https://via.placeholder.com/300x200?text=ITC' },
                { id: 4, name: 'Oberoi New Delhi', location: 'Dr. Zakir Hussain Marg', rating: 4.7, price: 11000, image: 'https://via.placeholder.com/300x200?text=Oberoi' }
            ],
            'mumbai': [
                { id: 1, name: 'Taj Hotel Mumbai', location: 'Colaba', rating: 5, price: 18000, image: 'https://via.placeholder.com/300x200?text=Taj+Mumbai' },
                { id: 2, name: 'Oberoi Mumbai', location: 'Nariman Point', rating: 4.9, price: 16000, image: 'https://via.placeholder.com/300x200?text=Oberoi+Mumbai' },
                { id: 3, name: 'ITC Grand Central', location: 'CST', rating: 4.8, price: 13000, image: 'https://via.placeholder.com/300x200?text=ITC' },
                { id: 4, name: 'Trident Nariman Point', location: 'Nariman Point', rating: 4.7, price: 12000, image: 'https://via.placeholder.com/300x200?text=Trident' }
            ],
            'bangalore': [
                { id: 1, name: 'The Leela Bangalore', location: 'Whitefield', rating: 4.9, price: 12000, image: 'https://via.placeholder.com/300x200?text=Leela+Bangalore' },
                { id: 2, name: 'Oberoi Bangalore', location: 'Whitefield', rating: 4.8, price: 11000, image: 'https://via.placeholder.com/300x200?text=Oberoi+Bangalore' },
                { id: 3, name: 'ITC Windsor', location: 'MG Road', rating: 4.7, price: 9000, image: 'https://via.placeholder.com/300x200?text=Windsor' },
                { id: 4, name: 'The Park Bangalore', location: 'MG Road', rating: 4.6, price: 8000, image: 'https://via.placeholder.com/300x200?text=Park' }
            ],
            'goa': [
                { id: 1, name: 'Taj Exotica Resort & Spa', location: 'Benaulim', rating: 4.9, price: 10000, image: 'https://via.placeholder.com/300x200?text=Taj+Goa' },
                { id: 2, name: 'Leela Goa', location: 'Mobor, Cavelossim', rating: 4.9, price: 11000, image: 'https://via.placeholder.com/300x200?text=Leela+Goa' },
                { id: 3, name: 'Oberoi Goa', location: 'Bogmalo Beach', rating: 4.8, price: 9500, image: 'https://via.placeholder.com/300x200?text=Oberoi+Goa' },
                { id: 4, name: 'Park Hyatt Goa', location: 'Arossim Beach', rating: 4.7, price: 8500, image: 'https://via.placeholder.com/300x200?text=Park+Hyatt' }
            ],
            'hyderabad': [
                { id: 1, name: 'Taj Banjara Hyderabad', location: 'Banjara Hills', rating: 4.8, price: 8000, image: 'https://via.placeholder.com/300x200?text=Taj+Hyderabad' },
                { id: 2, name: 'Oberoi Hyderabad', location: 'Banjara Hills', rating: 4.7, price: 7500, image: 'https://via.placeholder.com/300x200?text=Oberoi+Hyderabad' },
                { id: 3, name: 'ITC Kohenur', location: 'Begumpet', rating: 4.6, price: 6500, image: 'https://via.placeholder.com/300x200?text=Kohenur' },
                { id: 4, name: 'Trident Hyderabad', location: 'Hitech City', rating: 4.5, price: 5500, image: 'https://via.placeholder.com/300x200?text=Trident' }
            ],
            'jaipur': [
                { id: 1, name: 'Rambagh Palace Hotel', location: 'Bhawani Singh Marg', rating: 4.9, price: 9000, image: 'https://via.placeholder.com/300x200?text=Rambagh' },
                { id: 2, name: 'Taj Hotel Jaipur', location: 'Bhawani Singh Marg', rating: 4.8, price: 8000, image: 'https://via.placeholder.com/300x200?text=Taj+Jaipur' },
                { id: 3, name: 'ITC Rajputana', location: 'Prithviraj Road', rating: 4.7, price: 7000, image: 'https://via.placeholder.com/300x200?text=Rajputana' },
                { id: 4, name: 'Oberoi Jaipur', location: 'Bhawani Singh Marg', rating: 4.6, price: 6500, image: 'https://via.placeholder.com/300x200?text=Oberoi+Jaipur' }
            ]
        };

        const destLower = destination.toLowerCase();
        const hotels = hotelDatabase[destLower] || [];

        if (hotels.length === 0) {
            // Return generic hotels for unknown destinations
            return res.status(200).json({
                success: true,
                data: [
                    { id: 1, name: '5-Star Luxury Hotel', location: destination, rating: 4.5, price: 7000, image: 'https://via.placeholder.com/300x200?text=Hotel1' },
                    { id: 2, name: 'Business Class Hotel', location: destination, rating: 4.3, price: 4000, image: 'https://via.placeholder.com/300x200?text=Hotel2' },
                    { id: 3, name: 'Budget Comfort Hotel', location: destination, rating: 4.0, price: 2000, image: 'https://via.placeholder.com/300x200?text=Hotel3' },
                    { id: 4, name: 'Economy Stay', location: destination, rating: 3.8, price: 1000, image: 'https://via.placeholder.com/300x200?text=Hotel4' }
                ],
                message: 'Generic hotels for this destination'
            });
        }

        res.status(200).json({
            success: true,
            data: hotels,
            destination: destination,
            count: hotels.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to search hotels: ${error.message}`
        });
    }
};
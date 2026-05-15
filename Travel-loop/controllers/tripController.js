const Trip = require('../models/Trip');

// 1. Naya Trip banana
exports.createTrip = async (req, res) => {
    try {
        const { userId, tripName, startDate, endDate, description } = req.body;
        const newTrip = await Trip.create({ userId, tripName, startDate, endDate, description });
        res.status(201).json({ status: 'success', data: newTrip });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 2. Stop add karna
exports.addStop = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { city, arrivalDate, duration, activities } = req.body;
        const trip = await Trip.findByIdAndUpdate(
            tripId,
            { $push: { stops: { city, arrivalDate, duration, activities } } },
            { new: true }
        );
        res.status(200).json({ status: 'success', data: trip });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 3. User ki trips dikhana
exports.getMyTrips = async (req, res) => {
    try {
        const { userId } = req.params;
        const trips = await Trip.find({ userId });
        res.status(200).json({ status: 'success', data: trips });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 4. Budget Calculation (Checklist Point 9)
exports.getBudgetBreakdown = async (req, res) => {
    try {
        const { tripId } = req.params;
        const trip = await Trip.findById(tripId);
        if (!trip) return res.status(404).json({ message: "Trip nahi mili" });

        let totalCost = 0;
        trip.stops.forEach(stop => {
            stop.activities.forEach(act => { totalCost += act.cost; });
        });

        res.status(200).json({
            status: 'success',
            tripName: trip.tripName,
            totalEstimatedBudget: totalCost
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
// 5. Weather Info (External API Call)
exports.getWeather = async (req, res) => {
    try {
        const { city } = req.params;
        const API_KEY = "8952848b2d89d873a7488e145758432d"; // Ye meri dummy key hai testing ke liye
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) throw new Error(data.message);

        res.status(200).json({
            status: 'success',
            city: data.name,
            temp: data.main.temp,
            description: data.weather[0].description
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
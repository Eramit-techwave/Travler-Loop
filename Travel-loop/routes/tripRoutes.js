const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware'); // Braces check karein

// CREATE: POST http://localhost:5000/api/trips/add
router.post('/add', protect, tripController.createTrip);

// FETCH: GET http://localhost:5000/api/trips/my-trips
router.get('/my-trips', protect, tripController.getMyTrips);

module.exports = router;
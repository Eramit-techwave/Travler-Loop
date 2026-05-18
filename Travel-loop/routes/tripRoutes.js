const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// Protected trip endpoints

// CREATE: POST https://travler-loop.onrender.com/api/trips/add
router.post('/add', protect, tripController.createTrip);

// FETCH: GET https://travler-loop.onrender.com/api/trips/my-trips
router.get('/my-trips', protect, tripController.getMyTrips);

module.exports = router;
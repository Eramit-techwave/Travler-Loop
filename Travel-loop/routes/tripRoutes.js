const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// Protected trip endpoints

// CREATE: POST /api/trips/add
router.post('/add', protect, tripController.createTrip);

// FETCH: GET /api/trips/my-trips
router.get('/my-trips', protect, tripController.getMyTrips);

// GET STATS: GET /api/trips/stats
router.get('/stats', protect, tripController.getTripStats);

// SEARCH HOTELS: GET /api/trips/hotels/search/:destination (MUST be before /:tripId)
router.get('/hotels/search/:destination', protect, tripController.searchHotels);

// WEATHER: GET /api/trips/:tripId/weather
router.get('/:tripId/weather', protect, tripController.getWeather);

// DISTANCE: GET /api/trips/:tripId/distance
router.get('/:tripId/distance', protect, tripController.calculateDistance);

// HOTEL BOOKING: POST /api/trips/:tripId/hotels
router.post('/:tripId/hotels', protect, tripController.addHotelBooking);

// REMOVE HOTEL: DELETE /api/trips/:tripId/hotels/:hotelId
router.delete('/:tripId/hotels/:hotelId', protect, tripController.removeHotelBooking);

// GET TRIP DETAILS: GET /api/trips/:tripId
router.get('/:tripId', protect, tripController.getTripDetails);

// UPDATE: PUT /api/trips/:tripId
router.put('/:tripId', protect, tripController.updateTrip);

// DELETE: DELETE /api/trips/:tripId
router.delete('/:tripId', protect, tripController.deleteTrip);

module.exports = router;
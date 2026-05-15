const express = require('express');
const tripController = require('../controllers/tripController');
const router = express.Router();

router.post('/create', tripController.createTrip);
router.get('/my-trips/:userId', tripController.getMyTrips);
router.post('/add-stop/:tripId', tripController.addStop);


// DHAYAN SE DEKHO: tripController.getBudgetBreakdown hona chahiye
router.get('/budget/:tripId', tripController.getBudgetBreakdown);
// Weather check karne ka rasta
router.get('/weather/:city', tripController.getWeather);

module.exports = router;
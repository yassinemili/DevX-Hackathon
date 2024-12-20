import express from 'express';
const router = express.Router();
import {
    createRide,
    updateRideStatus,
    getUserRidesWithBikes,
    getUserRides
} from '../controller/rideControllers.js';


router.route('/').post(createRide);
router.put('/:RideId', updateRideStatus)
router.get('/getBookingByUser/:userId', getUserRidesWithBikes);
router.get("/historyrides/:userId", getUserRides);

export default router;
import express from 'express';
const router = express.Router();
import {
    getBikes,
    deleteBike,
    createBike,
    updateBike,
    closestBikes
} from '../controller/bikeControllers.js';


router.route('/').post(createBike).get(getBikes);
router.get('/seebikes', closestBikes);
router.route('/:id').put(updateBike).delete(deleteBike);

export default router;
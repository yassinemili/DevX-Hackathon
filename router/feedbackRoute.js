import express from 'express';
const router = express.Router();
import {
    setFeedback,
    getFeedback
} from '../controller/feedBackControllers.js';

// Submit feedback
router.post('/submit', setFeedback);

// Get all feedback
router.get('/allFeeds', getFeedback);

export default router;
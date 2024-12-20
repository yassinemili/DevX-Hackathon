import asyncHandler from 'express-async-handler';
import db from "../config/dbConfig.js";


// @desc Submit
// route GET /api/feedback/submit
const setFeedback = asyncHandler(async (req, res) => {
    const { userId, feedbackText, rating, BikeId } = req.body;

    if (!userId || !feedbackText) {
        return res.status(400).json({ message: 'User ID and feedback text are required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO feedback (userid, feedback_text, rating , BikeId) VALUES (?, ?, ? , ?)',
            [userId, feedbackText, rating || null, BikeId]
        );

        res.status(201).json({ message: 'Feedback submitted successfully', feedbackId: result.insertId });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred while submitting feedback' });
    }
});

// @desc Register
// route GET /api/feedback/Allfeeds
const getFeedback = asyncHandler(async (req, res) => {
    try {
        const [feedback] = await db.query('SELECT * FROM feedback ORDER BY userid');
        res.status(200).json({ feedback });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred while retrieving feedback' });
    }
});

export {
    setFeedback,
    getFeedback
};

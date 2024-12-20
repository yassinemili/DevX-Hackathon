import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// we are not implementing this functionalite 

// Middleware to verify JWT from cookie
const protect = asyncHandler(async (req, res, next) => {
    // Get token from Authorization header (Bearer token format)
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
    }
    if (token) {
        return res.status(200).json({ message: 'token success' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }
});

export { protect };
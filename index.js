import express from 'express';
import dotenv from 'dotenv';
import userRoute from './router/userRoute.js';
import feedbackRoute from './router/feedbackRoute.js';
import bikeRoute from './router/bikeRoutes.js';
import rideRoute from './router/rideRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// Use CORS middleware with the options
app.use(cors(corsOptions));

app.use("/api/auth", userRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/bike", bikeRoute);
app.use("/api/ride", rideRoute);

// Start the server
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

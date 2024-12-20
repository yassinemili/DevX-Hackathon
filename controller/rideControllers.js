import asyncHandler from 'express-async-handler';
import db from '../config/dbConfig.js'; // Assume this is your MySQL connection pool

// Create Ride
const createRide = asyncHandler(async (req, res) => {
    const { userid, BikeId } = req.body;

    if (!userid || !BikeId) {
        return res.status(400).json({ message: 'User ID and Bike ID are required' });
    }

    // check status bike
    const [bike] = await db.query('SELECT * FROM bikes WHERE BikeId =?', [BikeId]);
    if (bike.status === '3' || bike.status === '2') {
        return res.status(400).json({ message: 'Bike is currently unavailable' });
    }
    // set time start 
    const StartTime = new Date().toISOString();
    // updating status bike
    await db.query("UPDATE bikes SET status = ? WHERE BikeId = ?", [2, BikeId]);

    const [result] = await db.query(
        'INSERT INTO rides (userid, BikeId, StartTime, EndTime, Distance, TotalCost) VALUES (?, ?, ?, ?, ?, ?)',
        [userid, BikeId, StartTime, null, null, null]  // Here, we're inserting NULL for EndTime
    );

    if (result.affectedRows) {
        res.status(201).json({
            message: 'Ride created successfully',
            ride: {
                id: result.insertId,
                StartTime,
                BikeId,
                StartTime,
            }
        });
    } else {
        res.status(400).json({ message: 'Failed to create ride' });
    }
});

// Set your cost rate (e.g., $0.5 per minute)
const RATE_PER_MINUTE = 0.5;

// Update Ride Status, Set End Time, and Calculate Cost
const updateRideStatus = asyncHandler(async (req, res) => {
    const { RideId, } = req.params;
    const { long, lat } = req.body;
    const status = 1;

    if (!status || ![2, 3].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const [rideResult] = await db.query(
        `SELECT rides.* 
         FROM rides 
         INNER JOIN bikes ON rides.BikeId = bikes.BikeId
         WHERE rides.RideId = ? AND bikes.status = 1`,
        [RideId]
    );

    if (rideResult.length === 0) {
        return res.status(404).json({ message: 'Ride not found or already completed.' });
    }

    const ride = rideResult[0];

    // Set the end time
    const end_time = new Date().toISOString();

    const start_time = await db.query(
        'SELECT StartTime FROM RIdes WHERE RideId =?',
        [RideId]
    );

    const durationMinutes = Math.ceil((end_time - start_time) / (1000 * 60));

    // Calculate the total cost if the ride is completed
    const cost = 0;
    if (status === 1) {
        cost = durationMinutes * RATE_PER_MINUTE;
    }

    // Update the ride with status, end_time, and cost
    const [result] = await db.query(
        'UPDATE rides SET EndTime = ?, TotalCost = ? WHERE RideId = ?',
        [end_time, cost, RideId]
    );
    // update status of bike in bike table
    await db.query("UPDATE bikes SET status = ? WHERE BikeId = ?", [status, rideResult.BikeId]);
    await db.query("UPDATE bikes SET Latitude = ? WHERE BikeId = ?", [lat, rideResult.BikeId]);
    await db.query("UPDATE bikes SET Longitude = ? WHERE BikeId = ?", [long, rideResult.BikeId]);
    if (result.affectedRows > 0) {
        res.status(200).json({
            message: 'Ride updated successfully',
            ride_id: RideId,
            status: status === 1 ? 'Completed' : 'Canceled',
            duration: durationMinutes + ' minutes',
            cost: status === 1 ? `$${cost.toFixed(2)}` : 'NULL',
            end_time: end_time
        });
    } else {
        res.status(500).json({ message: 'Failed to update the ride.' });
    }
});

const getUserRidesWithBikes = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const [rides] = await db.query(
        'SELECT * from RIdes',
        [userId]
    );

    if (rides.length > 0 && rides[0].EndTime == null) {
        return res.status(200).json({
            message: `Active rides for user ${userId}`,
            rides: rides
        });
    } else {
        return res.status(404).json({ message: 'No active rides found for this user.' });
    }
});


// get all the rides before that user had

const getUserRides = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate if userId is provided
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // Query to get rides with bike status = 2
        const [rides] = await db.query(
            `SELECT 
                RIdes.RideId AS ride_id,
                RIdes.BikeId AS bike_id,
                RIdes.StartTime AS start_time,
                RIdes.EndTime AS end_time,
                bikes.Status AS bike_status,
                bikes.Longitude,
                bikes.Latitude
             FROM rides
             INNER JOIN bikes ON RIdes.BikeId = bikes.BikeId
             WHERE RIdes.userid = ? AND bikes.Status = 2 or bikes.Status = 3 `,
            [userId]
        );

        // Check if any rides were found
        if (rides.length > 0) {
            return res.status(200).json({
                message: `All rides for user ${userId}`,
                rides: rides
            });
        } else {
            // If no rides found
            return res.status(404).json({ message: 'No rides found for this user with bike status 2.' });
        }

    } catch (error) {
        // Handle any error that occurs during the query
        console.error("Error fetching rides:", error);
        return res.status(500).json({ message: 'An error occurred while fetching the rides.', error: error.message });
    }
});








export {
    createRide,
    updateRideStatus,
    getUserRidesWithBikes,
    getUserRides
};

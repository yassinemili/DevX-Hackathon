import asyncHandler from 'express-async-handler';
import db from "../config/dbConfig.js";
import haversine from '../util/haversinUtils.js';

// @desc    Create a new bike
// @route   POST /api/bikes
const createBike = asyncHandler(async (req, res) => {
    const { longitude, latitude, status } = req.body;

    if (!longitude || !latitude || status === undefined || null) {
        return res.status(400).json({ message: 'All fields are required: longitude, latitude, status' });
    }

    const [result] = await db.query(
        'INSERT INTO bikes (longitude, latitude, status) VALUES (?, ?, ?)',
        [longitude, latitude, status]
    );

    res.status(201).json({ message: 'Bike created successfully', bikeId: result.BikeId });
});

// @desc    Get all bikes avaible
// @route   GET /api/bikes


var closestBike = null;
var minDistance = Infinity;

const getBikes = asyncHandler(async (req, res) => {
    const [bikes] = await db.query('SELECT * FROM bikes where status = 1');
    res.status(200).json(bikes);
});
// @desc    Get all bikes avaible
// @route   GET /api/bikes/seebikes
const closestBikes = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const [bikes] = await db.query('SELECT * FROM bikes WHERE status = 1');


    // Iterate over the bikes list and calculate distance to the user's location
    bikes.forEach(bike => {
        const distance = haversine(latitude, longitude, bike.Latitude, bike.Longitude);

        if (distance < minDistance) {
            minDistance = distance;
            closestBike = bike;
        }
    });

    if (closestBike) {
        return res.status(200).json({
            bike: closestBike,
            distance: minDistance
        });
    } else {
        return res.status(404).json({ error: 'No bikes found.' });
    }
});

// @desc    Update a bike by ID
// @route   PUT /api/bikes/:id
const updateBike = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { longitude, latitude, status } = req.body;

    const [existingBike] = await db.query('SELECT * FROM bikes WHERE id = ?', [id]);

    if (existingBike.length === 0) {
        return res.status(404).json({ message: 'Bike not found' });
    }

    // Dynamically build update query
    const updatedFields = [];
    const queryParams = [];

    if (longitude) {
        updatedFields.push('longitude = ?');
        queryParams.push(longitude);
    }
    if (latitude) {
        updatedFields.push('latitude = ?');
        queryParams.push(latitude);
    }
    if (status !== undefined) {
        updatedFields.push('status = ?');
        queryParams.push(status);
    }

    if (updatedFields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    queryParams.push(id);

    const updateQuery = `UPDATE bikes SET ${updatedFields.join(', ')} WHERE id = ?`;
    await db.query(updateQuery, queryParams);

    res.status(200).json({ message: 'Bike updated successfully' });
});

// @desc    Delete a bike by ID
// @route   DELETE /api/bikes/:id
// acces    admin
const deleteBike = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM bikes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bike not found' });
    }

    res.status(200).json({ message: 'Bike deleted successfully' });
});


export {
    createBike,
    getBikes,
    updateBike,
    deleteBike,
    closestBikes
}

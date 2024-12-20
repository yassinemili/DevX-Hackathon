import asyncHandler from 'express-async-handler';
import db from '../config/dbConfig.js'; 

const getSettings = asyncHandler(async (req, res) => {
    const [settings] = await db.query('SELECT * FROM settings');
    res.status(200).json(settings);
});

// @desc Update user
// route PUT /api/users/profile
const updateSetting = asyncHandler(async (req, res) => {
    const { UserId } = req.params; 
    const { value } = req.body; 

    if (!value) {
        return res.status(400).json({ message: 'New value is required' });
    }

    const [result] = await db.query(`UPDATE settings SET ${name} = ?`, [value]);

    if (result.affectedRows > 0) {
        res.status(200).json({ message: `${UserId} updated successfully`, value });
    } else {
        res.status(404).json({ message: `Setting "${UserId}" not found` });
    }
});

const resetSettings = asyncHandler(async (req, res) => {
    const defaults = {
        BookingFee: 5.0,
        HourlyRate: 20,
        DamageReportPoints: 0.0,
        PointValue: '0.0',
    };

    const queries = [];
    for (const [key, value] of Object.entries(defaults)) {
        queries.push(db.query(`UPDATE settings SET ${key} = ?`, [value]));
    }

    await Promise.all(queries);

    res.status(200).json({ message: 'All settings have been reset to default values', defaults });
});

const createSettings = asyncHandler(async (req, res) => {
    const { BookingFee, HourlyRate, DamageReportPoints, PointValue } = req.body;

    const [result] = await db.query(
        'INSERT INTO settings (BookingFee, HourlyRate, DamageReportPoints, PointValue) VALUES (?, ?, ?, ?)',
        [BookingFee || 5.0, HourlyRate || 20, DamageReportPoints || 0.0, PointValue || '1.0']
    );

    if (result.affectedRows > 0) {
        res.status(201).json({ message: 'Settings created successfully' });
    } else {
        res.status(500).json({ message: 'Failed to create settings' });
    }
});

export { getSettings, updateSetting, resetSettings, createSettings };

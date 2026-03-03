const jwt = require('jsonwebtoken');
const Device = require('../models/deviceModel');

/**
 * Middleware to verify JWT token. (For AI agent GET requests)
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};

/**
 * Middleware to verify ESP32 Device API Key. (For IoT data submission)
 */
const verifyApiKey = async (req, res, next) => {
    const apiKey = req.header('x-api-key');
    const deviceId = req.body.device_id || req.query.device_id;

    if (!apiKey) {
        return res.status(401).json({ error: 'Missing x-api-key header.' });
    }

    if (!deviceId) {
        return res.status(400).json({ error: 'Missing device_id for authentication.' });
    }

    try {
        console.log(`[Auth Check] Device: ${deviceId}, API Key: ${apiKey}`);
        const device = await Device.findOne({ device_id: deviceId, api_key: apiKey });

        if (!device) {
            console.warn(`[Auth Failed] No match for Device: ${deviceId} with API Key: ${apiKey}`);
            return res.status(401).json({ error: 'Invalid device_id or API key.' });
        }

        console.log(`[Auth Success] Device recognized: ${device.location}`);
        req.device = device;
        next();
    } catch (error) {
        console.error('API Key Verification Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    verifyToken,
    verifyApiKey
};

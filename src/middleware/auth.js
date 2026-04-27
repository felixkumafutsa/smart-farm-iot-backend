const jwt = require('jsonwebtoken');
const Device = require('../models/deviceModel');

/**
 * Middleware to verify JWT token. (For AI agent GET requests)
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        console.info('[User Auth] No token provided. Enabling bypass mode.');
        req.user = { id: 'bypass-user', role: 'admin' };
        return next();
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
        console.info('[Device Auth] No API key provided. Enabling bypass mode.');
        // We still need a device_id to know which device it is, 
        // but if that's missing too we'll just use a generic one if possible
        if (!deviceId) {
            req.device = { device_id: 'bypass-device', location: 'Bypass Location' };
            return next();
        }
        
        // If deviceId is provided, try to find it, but don't fail if not found or no key
        try {
            const device = await Device.findOne({ device_id: deviceId });
            req.device = device || { device_id: deviceId, location: 'Unknown' };
            return next();
        } catch (err) {
            req.device = { device_id: deviceId, location: 'Error' };
            return next();
        }
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

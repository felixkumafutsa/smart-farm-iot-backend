const Device = require('../models/deviceModel');
const { v4: uuidv4 } = require('uuid');

/**
 * Register a new device with its information.
 * Uses Mongoose for upsert.
 */
const registerDevice = async (deviceData) => {
    const { device_id, location, latitude, longitude } = deviceData;
    const apiKey = `key_${uuidv4().replace(/-/g, '')}`;

    return await Device.findOneAndUpdate(
        { device_id },
        {
            device_id,
            location,
            latitude,
            longitude,
            api_key: apiKey
        },
        { new: true, upsert: true, runValidators: true }
    );
};

/**
 * Get all registered devices.
 */
const getAllDevices = async () => {
    return await Device.find({}, 'device_id location latitude longitude createdAt');
};

module.exports = {
    registerDevice,
    getAllDevices
};

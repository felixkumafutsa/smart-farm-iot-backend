const Device = require('../models/deviceModel');
const crypto = require('crypto');

/**
 * Register a new device with its information.
 * Uses Mongoose for upsert.
 */
const registerDevice = async (deviceData) => {
    const { device_id, location, latitude, longitude } = deviceData;
    const apiKey = `key_${crypto.randomUUID().replace(/-/g, '')}`;

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

/**
 * Update a device's information.
 */
const updateDevice = async (deviceId, updateData) => {
    return await Device.findOneAndUpdate(
        { device_id: deviceId },
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

/**
 * Delete a device.
 */
const deleteDevice = async (deviceId) => {
    return await Device.findOneAndDelete({ device_id: deviceId });
};

module.exports = {
    registerDevice,
    getAllDevices,
    updateDevice,
    deleteDevice
};

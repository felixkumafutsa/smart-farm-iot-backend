const SensorReading = require('../models/iotModel');
const { DateTime } = require('luxon');

/**
 * Soil interpretation logic.
 * @param {number} moisture - Percent 0-100
 * @returns {string} - Dry, Moderate, Wet
 */
const interpretSoilMoisture = (moisture) => {
    if (moisture >= 0 && moisture <= 30) return 'Dry';
    if (moisture >= 31 && moisture <= 60) return 'Moderate';
    if (moisture >= 61 && moisture <= 100) return 'Wet';
    return 'Unknown';
};

/**
 * Save new sensor reading to MongoDB.
 */
const saveReading = async (data) => {
    const { device_id, temperature, humidity, soil_moisture, water_level } = data;
    const soil_status = soil_moisture !== undefined ? interpretSoilMoisture(soil_moisture) : undefined;

    const reading = new SensorReading({
        device_id,
        temperature,
        humidity,
        soil_moisture,
        soil_status,
        water_level,
        latitude: data.latitude,
        longitude: data.longitude,
        light_intensity: data.light_intensity
    });

    return await reading.save();
};

/**
 * Get the latest reading for a specific device.
 */
const getLatestReading = async (deviceId) => {
    return await SensorReading.findOne({ device_id: deviceId })
        .sort({ created_at: -1 })
        .exec();
};

/**
 * Get historical data for a specific device.
 */
const getHistory = async (deviceId, hours) => {
    const cutoff = new Date(Date.now() - hours * 3600000); // Calculate time window
    return await SensorReading.find({
        device_id: deviceId,
        created_at: { $gte: cutoff }
    })
        .sort({ created_at: 1 })
        .exec();
};

/**
 * Calculate device status (online/offline).
 * Online if last reading within 10 minutes.
 */
const getDeviceStatus = async (deviceId) => {
    const latest = await SensorReading.findOne({ device_id: deviceId })
        .sort({ created_at: -1 })
        .exec();

    if (!latest) {
        return { device_id: deviceId, online: false, last_seen: 'Never' };
    }

    const lastSeen = DateTime.fromJSDate(latest.created_at);
    const now = DateTime.now();
    const diffMinutes = now.diff(lastSeen, 'minutes').toObject().minutes;

    return {
        device_id: deviceId,
        online: diffMinutes <= 10,
        last_seen: lastSeen.toRelative()
    };
};

module.exports = {
    saveReading,
    getLatestReading,
    getHistory,
    getDeviceStatus,
    interpretSoilMoisture
};

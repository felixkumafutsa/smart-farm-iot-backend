const iotService = require('../services/iotService');
const { AppError } = require('../middleware/error');

/**
 * Accept sensor data from ESP32.
 */
exports.sendData = async (req, res, next) => {
    try {
        const { device_id, temperature, humidity, soil_moisture, light_intensity, latitude, longitude } = req.body;

        console.log('Telemetry data received:', req.body);

        const reading = await iotService.saveReading({
            device_id,
            temperature,
            humidity,
            soil_moisture,
            light_intensity,
            latitude,
            longitude
        });

        res.status(201).json({
            success: true,
            message: 'Reading stored successfully.',
            reading: {
                ...reading.toObject(),
                timestamp: reading.created_at
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get latest sensor data for AI Agent. (Requires JWT)
 */
exports.getLatest = async (req, res, next) => {
    try {
        const { device_id } = req.query;
        if (!device_id) throw new AppError('device_id is required', 400);

        const latest = await iotService.getLatestReading(device_id);
        if (!latest) throw new AppError('No readings found for this device', 404);

        res.status(200).json({
            success: true,
            data: latest.toObject()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get historical data (last X hours). (Requires JWT)
 */
exports.getHistory = async (req, res, next) => {
    try {
        const { device_id } = req.query;
        const hours = parseInt(req.query.hours) || 24;

        if (!device_id) throw new AppError('device_id is required', 400);

        const history = await iotService.getHistory(device_id, hours);
        res.status(200).json({
            success: true,
            count: history.length,
            history: history.map(h => h.toObject())
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get device status. (Requires JWT or public)
 */
exports.getStatus = async (req, res, next) => {
    try {
        const { device_id } = req.query;
        if (!device_id) throw new AppError('device_id is required', 400);

        const status = await iotService.getDeviceStatus(device_id);
        res.status(200).json({
            success: true,
            ...status
        });
    } catch (error) {
        next(error);
    }
};

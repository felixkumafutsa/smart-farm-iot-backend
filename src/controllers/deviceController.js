const deviceService = require('../services/deviceService');
const { AppError } = require('../middleware/error');

/**
 * Register a new device.
 */
exports.register = async (req, res, next) => {
    try {
        const { device_id, location, latitude, longitude } = req.body;

        const device = await deviceService.registerDevice({
            device_id,
            location,
            latitude,
            longitude
        });

        res.status(201).json({
            success: true,
            message: 'Device registered successfully. Use the provided api_key for IoT data submission.',
            device: {
                id: device.id,
                device_id: device.device_id,
                location: device.location,
                latitude: parseFloat(device.latitude),
                longitude: parseFloat(device.longitude),
                api_key: device.api_key, // In real-world, provide once or securely.
                created_at: device.created_at
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * List all devices.
 */
exports.list = async (req, res, next) => {
    try {
        const devices = await deviceService.getAllDevices();
        res.status(200).json({
            success: true,
            count: devices.length,
            devices
        });
    } catch (error) {
        next(error);
    }
};

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

const iotService = require('../services/iotService');

/**
 * List all devices.
 */
exports.list = async (req, res, next) => {
    try {
        const devices = await deviceService.getAllDevices();
        
        // Augment with real-time online status
        const augmentedDevices = await Promise.all(devices.map(async (device) => {
            const status = await iotService.getDeviceStatus(device.device_id);
            return {
                ...device.toObject(),
                online: status.online,
                last_seen: status.last_seen
            };
        }));

        res.status(200).json({
            success: true,
            count: augmentedDevices.length,
            devices: augmentedDevices
        });
    } catch (error) {
        next(error);
    }
};

const Device = require('../models/deviceModel');
const SensorReading = require('../models/iotModel');
const DeviceCommand = require('../models/commandModel');
const { AppError } = require('../middleware/error');

/**
 * Agent Service
 * Handles complex analytics and cross-collection queries for AI agents.
 */
class AgentService {
    /**
     * Get all registered devices with their latest status.
     */
    async getDevices() {
        return await Device.find({}, 'device_id location latitude longitude createdAt');
    }

    /**
     * Get specific device info and its latest telemetry.
     */
    async getDeviceDetail(deviceId) {
        const device = await Device.findOne({ device_id: deviceId });
        if (!device) throw new AppError('Device not found', 404);

        const latestData = await SensorReading.findOne({ device_id: deviceId }).sort({ created_at: -1 });

        return {
            profile: device,
            latest_telemetry: latestData
        };
    }

    /**
     * Get historical data with pagination and filters.
     */
    async getHistoricalData(deviceId, filters) {
        const { page = 1, limit = 100, startDate, endDate } = filters;

        const query = { device_id: deviceId };
        if (startDate || endDate) {
            query.created_at = {};
            if (startDate) query.created_at.$gte = new Date(startDate);
            if (endDate) query.created_at.$lte = new Date(endDate);
        }

        const data = await SensorReading.find(query)
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await SensorReading.countDocuments(query);

        return {
            data,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Perform summarized IoT insights (Average, Trends, Anomaly detection).
     */
    async queryInsights(deviceId, queryType) {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const match = { device_id: deviceId, created_at: { $gte: last24Hours } };

        if (queryType === 'averages') {
            const stats = await SensorReading.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: '$device_id',
                        avg_temp: { $avg: '$temperature' },
                        avg_humidity: { $avg: '$humidity' },
                        avg_moisture: { $avg: '$soil_moisture' },
                        avg_light: { $avg: '$light_intensity' },
                        readings_count: { $sum: 1 }
                    }
                }
            ]);
            return stats[0] || { message: 'No data found for the last 24h' };
        }

        if (queryType === 'anomalies') {
            // Simple anomaly detection: temp > 40 or humidity < 10
            const anomalies = await SensorReading.find({
                ...match,
                $or: [{ temperature: { $gt: 40 } }, { humidity: { $lt: 10 } }]
            }).sort({ created_at: -1 });

            return {
                anomaly_count: anomalies.length,
                recent_triggers: anomalies.slice(0, 5)
            };
        }

        throw new AppError('Invalid query type. Use "averages" or "anomalies"', 400);
    }

    /**
     * Queue a command for a device.
     */
    async queueCommand(agentId, deviceId, command, payload) {
        const device = await Device.findOne({ device_id: deviceId });
        if (!device) throw new AppError('Device not found', 404);

        return await DeviceCommand.create({
            device_id: deviceId,
            agent_id: agentId,
            command,
            payload
        });
    }
}

module.exports = new AgentService();

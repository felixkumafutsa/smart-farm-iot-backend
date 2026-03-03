const agentService = require('../services/agentService');
const { AppError } = require('../middleware/error');

/**
 * Agent Controller
 */
exports.getAllDevices = async (req, res, next) => {
    try {
        const devices = await agentService.getDevices();
        res.status(200).json({ success: true, count: devices.length, devices });
    } catch (error) {
        next(error);
    }
};

exports.getDeviceDetail = async (req, res, next) => {
    try {
        const detail = await agentService.getDeviceDetail(req.params.device_id);
        res.status(200).json({ success: true, ...detail });
    } catch (error) {
        next(error);
    }
};

exports.getHistory = async (req, res, next) => {
    try {
        const filters = {
            page: req.query.page,
            limit: req.query.limit,
            startDate: req.query.startDate,
            endDate: req.query.endDate
        };
        const history = await agentService.getHistoricalData(req.params.device_id, filters);
        res.status(200).json({ success: true, ...history });
    } catch (error) {
        next(error);
    }
};

exports.postQuery = async (req, res, next) => {
    try {
        const { device_id, query_type } = req.body;
        if (!device_id || !query_type) {
            throw new AppError('device_id and query_type are required', 400);
        }
        const result = await agentService.queryInsights(device_id, query_type);
        res.status(200).json({ success: true, result });
    } catch (error) {
        next(error);
    }
};

exports.postCommand = async (req, res, next) => {
    try {
        const { device_id, command, payload } = req.body;
        if (!device_id || !command) {
            throw new AppError('device_id and command are required', 400);
        }
        const result = await agentService.queueCommand(req.agent._id, device_id, command, payload);
        res.status(201).json({ success: true, message: 'Command queued', command: result });
    } catch (error) {
        next(error);
    }
};

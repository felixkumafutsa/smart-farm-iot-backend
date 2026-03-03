const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { verifyAgentKey, checkPermission } = require('../middleware/agentAuth');

// All agent routes are protected by the x-agent-key header
router.use(verifyAgentKey);

/**
 * @route GET /api/agent/devices
 * @desc Get all registered devices
 */
router.get('/devices', checkPermission('read_telemetry'), agentController.getAllDevices);

/**
 * @route GET /api/agent/devices/:device_id
 * @desc Get device profile and latest telemetry
 */
router.get('/devices/:device_id', checkPermission('read_telemetry'), agentController.getDeviceDetail);

/**
 * @route GET /api/agent/devices/:device_id/data
 * @desc Get historical sensor data with pagination
 */
router.get('/devices/:device_id/data', checkPermission('read_telemetry'), agentController.getHistory);

/**
 * @route POST /api/agent/query
 * @desc Run AI insights (averages, anomalies)
 */
router.post('/query', checkPermission('read_telemetry'), agentController.postQuery);

/**
 * @route POST /api/agent/commands
 * @desc Send commands to devices
 */
router.post('/commands', checkPermission('send_commands'), agentController.postCommand);

module.exports = router;

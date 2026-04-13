const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { verifyAgentKey, checkPermission } = require('../middleware/agentAuth');

// All agent routes are protected by the x-agent-key header
router.use(verifyAgentKey);

/**
 * @swagger
 * /api/agent/devices:
 *   get:
 *     summary: Get all registered devices (AI Agent context)
 *     tags: [Agent]
 *     security:
 *       - agentKeyAuth: []
 *     responses:
 *       200:
 *         description: List of devices
 */
router.get('/devices', checkPermission('read_telemetry'), agentController.getAllDevices);

/**
 * @swagger
 * /api/agent/devices/{device_id}:
 *   get:
 *     summary: Get device details and latest telemetry
 *     tags: [Agent]
 *     security:
 *       - agentKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device details
 */
router.get('/devices/:device_id', checkPermission('read_telemetry'), agentController.getDeviceDetail);

/**
 * @swagger
 * /api/agent/devices/{device_id}/data:
 *   get:
 *     summary: Get historical sensor data with pagination
 *     tags: [Agent]
 *     security:
 *       - agentKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Historical telemetry
 */
router.get('/devices/:device_id/data', checkPermission('read_telemetry'), agentController.getHistory);

/**
 * @swagger
 * /api/agent/query:
 *   post:
 *     summary: Run AI insights (averages, anomalies)
 *     tags: [Agent]
 *     security:
 *       - agentKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [query]
 *             properties:
 *               query: { type: string, example: "What is the average humidity today?" }
 *     responses:
 *       200:
 *         description: AI Query result
 */
router.post('/query', checkPermission('read_telemetry'), agentController.postQuery);

/**
 * @swagger
 * /api/agent/commands:
 *   post:
 *     summary: Send command to a device
 *     tags: [Agent]
 *     security:
 *       - agentKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [device_id, command]
 *             properties:
 *               device_id: { type: string }
 *               command: { type: string, example: "ACTIVATE_PUMP" }
 *     responses:
 *       200:
 *         description: Command dispatched
 */
router.post('/commands', checkPermission('send_commands'), agentController.postCommand);

module.exports = router;

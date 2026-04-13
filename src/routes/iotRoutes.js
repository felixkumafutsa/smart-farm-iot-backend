const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
const { validate, schemas } = require('../middleware/validator');
const { verifyToken, verifyApiKey } = require('../middleware/auth');

/**
 * @swagger
 * /api/iot/data:
 *   post:
 *     summary: Submit sensor telemetry (Hardware Only)
 *     tags: [IoT]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [device_id, temperature, humidity, soil_moisture]
 *             properties:
 *               device_id: { type: string }
 *               temperature: { type: number }
 *               humidity: { type: number }
 *               soil_moisture: { type: number }
 *               light_intensity: { type: number }
 *     responses:
 *       201:
 *         description: Data stored
 */
router.post('/data', verifyApiKey, validate(schemas.sendSensorData), iotController.sendData);

/**
 * @swagger
 * /api/iot/latest:
 *   get:
 *     summary: Get latest reading for a device
 *     tags: [IoT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: device_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Latest telemetry
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reading' }
 */
router.get('/latest', verifyToken, iotController.getLatest);

/**
 * @swagger
 * /api/iot/history:
 *   get:
 *     summary: Get historical readings
 *     tags: [IoT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: device_id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: hours
 *         schema: { type: integer, default: 24 }
 *     responses:
 *       200:
 *         description: List of historical data
 */
router.get('/history', verifyToken, iotController.getHistory);

/**
 * @swagger
 * /api/iot/device-status:
 *   get:
 *     summary: Check device online/offline status
 *     tags: [IoT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: device_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Online status
 */
router.get('/device-status', verifyToken, iotController.getStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
const { validate, schemas } = require('../middleware/validator');
const { verifyToken, verifyApiKey } = require('../middleware/auth');

/**
 * ESP32 Endpoint: Send sensor data.
 * Requires API key in x-api-key header.
 */
router.post('/data', verifyApiKey, validate(schemas.sendSensorData), iotController.sendData);

/**
 * Get latest sensor data (AI Agent).
 * Requires JWT token.
 */
router.get('/latest', verifyToken, iotController.getLatest);

/**
 * Get historical data (AI Agent).
 * Requires JWT token.
 */
router.get('/history', verifyToken, iotController.getHistory);

/**
 * Get device status.
 * Requires JWT token.
 */
router.get('/device-status', verifyToken, iotController.getStatus);

module.exports = router;

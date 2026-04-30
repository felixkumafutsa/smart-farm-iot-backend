const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { validate, schemas } = require('../middleware/validator');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/devices/register:
 *   post:
 *     summary: Register or update a smart farm unit
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [device_id, location, latitude, longitude]
 *             properties:
 *               device_id: { type: string, example: greenhouse-01 }
 *               location: { type: string, example: North Sector }
 *               latitude: { type: number, example: -1.28 }
 *               longitude: { type: number, example: 36.82 }
 *     responses:
 *       201:
 *         description: Device registered
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Device' }
 */
router.post('/register', validate(schemas.registerDevice), deviceController.register);

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: List all registered devices
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 devices:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Device' }
 */
router.get('/', verifyToken, deviceController.list);

/**
 * @swagger
 * /api/devices/{device_id}:
 *   patch:
 *     summary: Update a device
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location: { type: string }
 *               latitude: { type: number }
 *               longitude: { type: number }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/:device_id', verifyToken, deviceController.update);

/**
 * @swagger
 * /api/devices/{device_id}:
 *   delete:
 *     summary: Remove a device
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removed
 */
router.delete('/:device_id', verifyToken, deviceController.remove);

module.exports = router;

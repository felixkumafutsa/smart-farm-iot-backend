const express = require('express');
const router = express.Router();
const agentManagementController = require('../controllers/agentManagementController');
const { verifyAgentKey, checkPermission } = require('../middleware/agentAuth');

/**
 * @swagger
 * /api/agent-management/agents:
 *   post:
 *     summary: Create a new agent (Public Setup)
 *     tags: [Agent Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, name]
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Agent created
 */
router.post('/agents', agentManagementController.createAgent);

// Protected endpoints (require agent authentication)
router.use(verifyAgentKey);

/**
 * @swagger
 * /api/agent-management/agents:
 *   get:
 *     summary: List all agents
 *     tags: [Agent Management]
 *     security:
 *       - agentKeyAuth: []
 *     responses:
 *       200:
 *         description: List of agents
 */
router.get('/agents', checkPermission('admin'), agentManagementController.listAgents);

/**
 * @swagger
 * /api/agent-management/agents/{id}/toggle:
 *   patch:
 *     summary: Toggle agent active status
 *     tags: [Agent Management]
 *     security:
 *       - agentKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Status toggled
 */
router.patch('/agents/:id/toggle', checkPermission('admin'), agentManagementController.toggleAgent);

module.exports = router;

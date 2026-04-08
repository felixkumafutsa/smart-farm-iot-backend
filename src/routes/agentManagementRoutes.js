const express = require('express');
const router = express.Router();
const agentManagementController = require('../controllers/agentManagementController');
const { verifyAgentKey, checkPermission } = require('../middleware/agentAuth');

// Public endpoint for creating agents (for initial setup)
router.post('/agents', agentManagementController.createAgent);

// Protected endpoints (require agent authentication)
router.use(verifyAgentKey);

// List all agents (requires admin permission)
router.get('/agents', checkPermission('admin'), agentManagementController.listAgents);

// Toggle agent status (requires admin permission)
router.patch('/agents/:id/toggle', checkPermission('admin'), agentManagementController.toggleAgent);

module.exports = router;

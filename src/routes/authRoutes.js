const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Login route (Admin / AI Agent).
 */
router.post('/login', authController.login);

/**
 * Register a new Agent (Admin / partner systems).
 */
router.post('/register-agent', authController.registerAgent);

module.exports = router;

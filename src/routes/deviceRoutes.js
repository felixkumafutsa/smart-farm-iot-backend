const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { validate, schemas } = require('../middleware/validator');
const { verifyToken } = require('../middleware/auth');

/**
 * Register device - public. (Return API key)
 */
router.post('/register', validate(schemas.registerDevice), deviceController.register);

/**
 * List all devices - (Requires Token)
 */
router.get('/', verifyToken, deviceController.list);

module.exports = router;

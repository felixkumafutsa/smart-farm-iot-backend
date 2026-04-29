const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/error');

/**
 * Basic login for AI Agent / Admin to get JWT.
 * For production, integrate with a real user database.
 */
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Simple auth for demo - in reality, check DB.
        const adminUser = process.env.ADMIN_USER || 'admin';
        const adminPass = process.env.ADMIN_PASS || 'password123';
        const jwtSecret = process.env.JWT_SECRET || 'default_secret_change_me';

        if (!process.env.JWT_SECRET) {
            console.warn('[Auth] WARNING: JWT_SECRET not set in environment variables!');
        }

        if (username !== adminUser || password !== adminPass) {
            throw new AppError('Incorrect username or password', 401);
        }

        const token = jwt.sign(
            { id: 'admin', role: 'ai-agent' },
            jwtSecret,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            message: 'Authenticated successfully.',
            token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Register a new Agent (Admin only in production)
 */
const Agent = require('../models/agentModel');
exports.registerAgent = async (req, res, next) => {
    try {
        const { name, permissions } = req.body;
        if (!name) throw new AppError('Agent name is required', 400);

        const agent = await Agent.create({ name, permissions });

        res.status(201).json({
            success: true,
            message: 'Agent created successfully.',
            agent: {
                id: agent._id,
                name: agent.name,
                api_key: agent.api_key,
                permissions: agent.permissions
            }
        });
    } catch (error) {
        next(error);
    }
};

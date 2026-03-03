const Agent = require('../models/agentModel');
const { AppError } = require('./error');

/**
 * Middleware to verify Agent API Key.
 * Checks against the 'agents' collection.
 */
const verifyAgentKey = async (req, res, next) => {
    const agentKey = req.header('x-agent-key');

    if (!agentKey) {
        return next(new AppError('Unauthorized: Missing x-agent-key header', 401));
    }

    try {
        const agent = await Agent.findOne({ api_key: agentKey, is_active: true });

        if (!agent) {
            console.warn(`[Agent Auth Failed] Invalid key attempt: ${agentKey}`);
            return next(new AppError('Unauthorized: Invalid Agent Key', 401));
        }

        // Attach agent to request
        req.agent = agent;
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Check if the agent has a specific permission.
 */
const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.agent.permissions.includes(permission) && !req.agent.permissions.includes('admin')) {
            return next(new AppError(`Forbidden: Missing ${permission} permission`, 403));
        }
        next();
    };
};

module.exports = {
    verifyAgentKey,
    checkPermission
};

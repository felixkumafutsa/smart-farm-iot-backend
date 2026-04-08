const Agent = require('../models/agentModel');
const { AppError } = require('../middleware/error');

/**
 * Create a new agent (for external AI systems)
 */
const createAgent = async (req, res, next) => {
    try {
        const { name, permissions = ['read_telemetry'] } = req.body;

        // Check if agent already exists
        const existingAgent = await Agent.findOne({ name });
        if (existingAgent) {
            return next(new AppError('Agent with this name already exists', 400));
        }

        // Create new agent
        const agent = new Agent({
            name,
            permissions,
            is_active: true
        });

        await agent.save();

        res.status(201).json({
            success: true,
            message: 'Agent created successfully',
            data: {
                name: agent.name,
                api_key: agent.api_key,
                permissions: agent.permissions,
                integration_guide: {
                    header_name: 'x-agent-key',
                    header_value: agent.api_key,
                    base_url: `${req.protocol}://${req.get('host')}/api/agent`
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * List all agents (admin only)
 */
const listAgents = async (req, res, next) => {
    try {
        const agents = await Agent.find({})
            .select('-__v')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: agents.length,
            data: agents
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle agent active status
 */
const toggleAgent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const agent = await Agent.findById(id);

        if (!agent) {
            return next(new AppError('Agent not found', 404));
        }

        agent.is_active = !agent.is_active;
        await agent.save();

        res.json({
            success: true,
            message: `Agent ${agent.is_active ? 'activated' : 'deactivated'}`,
            data: {
                id: agent._id,
                name: agent.name,
                is_active: agent.is_active
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAgent,
    listAgents,
    toggleAgent
};

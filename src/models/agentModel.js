const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * Agent Schema
 * Stores details of external AI agents or partner systems.
 */
const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    api_key: {
        type: String,
        required: true,
        unique: true,
        default: () => `agent_${crypto.randomUUID().replace(/-/g, '')}`
    },
    permissions: {
        type: [String],
        enum: ['read_telemetry', 'send_commands', 'admin'],
        default: ['read_telemetry']
    },
    rate_limit: {
        max_requests: { type: Number, default: 1000 },
        window_ms: { type: Number, default: 3600000 } // 1 hour
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema);

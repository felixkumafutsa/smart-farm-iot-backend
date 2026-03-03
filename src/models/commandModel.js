const mongoose = require('mongoose');

/**
 * Device Command Schema
 * Queue of commands sent by agents to IoT devices.
 */
const deviceCommandSchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true,
        index: true
    },
    agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    command: {
        type: String, // e.g., "PUMP_ON", "PUMP_OFF", "SET_THRESHOLD"
        required: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'executed', 'failed'],
        default: 'pending'
    },
    sent_at: Date,
    executed_at: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('DeviceCommand', deviceCommandSchema);

const mongoose = require('mongoose');

/**
 * Device Schema for MongoDB.
 */
const deviceSchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    api_key: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Device', deviceSchema);

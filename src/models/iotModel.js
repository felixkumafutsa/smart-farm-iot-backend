const mongoose = require('mongoose');

/**
 * Sensor Reading Schema for MongoDB.
 */
const sensorReadingSchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true,
        index: true // Fast lookup by device_id
    },
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    soil_moisture: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    soil_status: {
        type: String,
        enum: ['Dry', 'Moderate', 'Wet', 'Unknown'],
        required: true
    },
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    light_intensity: {
        type: Number,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true // Index for time-series queries
    }
});

module.exports = mongoose.model('SensorReading', sensorReadingSchema);

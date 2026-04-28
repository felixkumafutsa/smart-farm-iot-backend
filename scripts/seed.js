const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Agent = require('../src/models/agentModel');
const Device = require('../src/models/deviceModel');
const SensorReading = require('../src/models/iotModel');

dotenv.config();

/**
 * Seed data into the database.
 */
const seedData = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI is not defined');

        console.log('[Seed] Connecting to MongoDB...');
        await mongoose.connect(uri, { dbName: 'smart_farm_db' });

        // Clean existing data (Optional)
        console.log('[Seed] Cleaning existing Agents, Devices, and Readings...');
        await Agent.deleteMany({});
        await Device.deleteMany({});
        await SensorReading.deleteMany({});

        // Seed one AI Agent
        console.log('[Seed] Creating one test Agent...');
        const agent = await Agent.create({
            name: 'Primary Farm Agent',
            permissions: ['read_telemetry', 'send_commands', 'admin']
        });

        // Seed one Device
        console.log('[Seed] Creating one test Device...');
        const device = await Device.create({
            device_id: 'smart-gate-001',
            location: 'Main Entrance - Greenhouse',
            latitude: 45.4215,
            longitude: -75.6972,
            api_key: 'device_key_987654321'
        });

        // Seed sample sensor readings (12 hours of data)
        console.log('[Seed] Creating sample sensor readings...');
        const readings = [];
        const now = new Date();
        for (let i = 12; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - i * 3600000); // Each hour
            readings.push({
                device_id: 'smart-gate-001',
                temperature: 22 + Math.random() * 5, // 22-27°C
                humidity: 60 + Math.random() * 20, // 60-80%
                soil_moisture: 50 + Math.random() * 30, // 50-80%
                soil_status: 'Moderate',
                light_intensity: 500 + Math.random() * 500, // 500-1000 lux
                latitude: 45.4215 + (Math.random() - 0.5) * 0.001,
                longitude: -75.6972 + (Math.random() - 0.5) * 0.001,
                created_at: timestamp
            });
        }
        await SensorReading.insertMany(readings);

        console.log('--------------------------------------------------');
        console.log('SEEDING SUCCESSFUL!');
        console.log('--------------------------------------------------');
        console.log('ADMIN DASHBOARD CREDENTIALS:');
        console.log(`  Username: ${process.env.ADMIN_USER || 'admin'}`);
        console.log(`  Password: ${process.env.ADMIN_PASS || 'password123'}`);
        console.log('--------------------------------------------------');
        console.log('AGENT CREDENTIALS (for API/AI interaction):');
        console.log(`  Agent Name: ${agent.name}`);
        console.log(`  API Key:    ${agent.api_key}`);
        console.log('--------------------------------------------------');
        console.log('DEVICE CREDENTIALS (for IoT telemetry):');
        console.log(`  Device ID:  ${device.device_id}`);
        console.log(`  API Key:    ${device.api_key}`);
        console.log('--------------------------------------------------');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('[Seed] Error during seeding:', error);
        process.exit(1);
    }
};

seedData();

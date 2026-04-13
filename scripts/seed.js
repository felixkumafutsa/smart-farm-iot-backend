const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Agent = require('../src/models/agentModel');
const Device = require('../src/models/deviceModel');

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
        console.log('[Seed] Cleaning existing Agents and Devices...');
        await Agent.deleteMany({});
        await Device.deleteMany({});

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

const mongoose = require('mongoose');
const Agent = require('../src/models/agentModel');
require('dotenv').config();

/**
 * Script to create Google AI Studio Agent
 * Run: node scripts/createGoogleAIAgent.js
 */
async function createGoogleAIAgent() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartfarm');
        console.log('Connected to MongoDB');

        // Check if Google AI Studio agent already exists
        const existingAgent = await Agent.findOne({ name: 'Google AI Studio Agent' });
        if (existingAgent) {
            console.log('Google AI Studio Agent already exists:');
            console.log(`API Key: ${existingAgent.api_key}`);
            console.log('Use this key in Google AI Studio with header: x-agent-key');
            process.exit(0);
        }

        // Create new Google AI Studio agent
        const googleAIAgent = new Agent({
            name: 'Google AI Studio Agent',
            permissions: ['read_telemetry', 'send_commands'], // Full access for farm management
            is_active: true,
            rate_limit: {
                max_requests: 2000, // Higher limit for AI agent
                window_ms: 3600000 // 1 hour
            }
        });

        await googleAIAgent.save();
        
        console.log('✅ Google AI Studio Agent created successfully!');
        console.log('\n📋 Integration Instructions:');
        console.log('1. API Key:', googleAIAgent.api_key);
        console.log('2. In Google AI Studio, add custom header:');
        console.log('   - Header Name: x-agent-key');
        console.log('   - Header Value:', googleAIAgent.api_key);
        console.log('3. Upload your agent_api_spec.yaml to Google AI Studio');
        console.log('4. Use the system instructions from AI_AGENT_DEVELOPER_GUIDE.md.resolved');
        
        console.log('\n🔗 Your API Base URL:');
        console.log('https://smart-farm-iot-backend-m3bhxcln9-felixkumafutsas-projects.vercel.app/api/agent');
        
    } catch (error) {
        console.error('❌ Error creating agent:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

createGoogleAIAgent();

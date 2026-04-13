const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Farm IoT API',
      version: '1.0.0',
      description: 'Production-ready API documentation for the Smart Farm IoT system monitoring telemetry and managing farm hardware.',
      contact: {
        name: 'Smart Farm Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
      {
        url: 'https://smart-farm-iot-backend.vercel.app',
        description: 'Production Vercel Server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'Custom API key for hardware units (ESP32) to submit telemetry data.',
        },
        agentKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-agent-key',
          description: 'Security key for AI Agents to interact with farm telemetry and send commands.',
        },
      },
      schemas: {
        Device: {
          type: 'object',
          properties: {
            device_id: { type: 'string' },
            location: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            api_key: { type: 'string', description: 'Generated on registration' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Reading: {
          type: 'object',
          properties: {
            device_id: { type: 'string' },
            temperature: { type: 'number' },
            humidity: { type: 'number' },
            soil_moisture: { type: 'number' },
            light_intensity: { type: 'number' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' }
          }
        }
      }
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;

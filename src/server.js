const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./utils/db');

dotenv.config();

// Debug: Log environment variables on startup
console.log('[Config] Environment Variables:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`  PORT: ${process.env.PORT || 'undefined'}`);
console.log(`  JWT_SECRET: ${process.env.JWT_SECRET ? '✓ Set' : '✗ MISSING'}`);
console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? '✓ Set' : '✗ MISSING'}`);
console.log(`  FRONTEND_URL: ${process.env.FRONTEND_URL || 'undefined'}`);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

/**
 * Start Express Server.
 */
const server = app.listen(PORT, async () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

/**
 * Handle unhandled rejections globally.
 */
process.on('unhandledRejection', (err) => {
    console.error('[Critical Error] Unhandled Rejection! Shutting down...', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

/**
 * Handle SIGTERM for graceful shutdown.
 */
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    server.close(() => {
        console.log('Process terminated.');
    });
});

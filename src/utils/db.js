const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Configure MongoDB connection using Mongoose.
 */
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('[Database] CRITICAL ERROR: MONGODB_URI is not defined in environment variables.');
        console.error('[Database] Ensure you have a .env file locally with MONGODB_URI defined.');
        return;
    }

    try {
        const conn = await mongoose.connect(uri, {
            dbName: 'smart_farm_db'
        });
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database] Error: ${error.message}`);
        // In serverless, we don't necessarily want to exit the process
        throw error;
    }
};

module.exports = connectDB;

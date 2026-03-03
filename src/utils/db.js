const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Configure MongoDB connection using Mongoose.
 */
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
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

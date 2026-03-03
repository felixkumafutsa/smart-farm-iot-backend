const app = require('../src/app');
const connectDB = require('../src/utils/db');

// Entry point for Vercel Serverless Functions
module.exports = async (req, res) => {
    // Ensure database is connected for every request (uses cache if already connected)
    await connectDB();

    // Hand off the request to the Express app
    return app(req, res);
};

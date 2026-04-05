const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, AppError } = require('./middleware/error');
const { apiLimiter } = require('./middleware/rateLimit');
const { injectSpeedInsights } = require('@vercel/speed-insights');

// Routes
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const iotRoutes = require('./routes/iotRoutes');
const agentRoutes = require('./routes/agentRoutes');

const app = express();

/**
 * Initialize Vercel Speed Insights.
 */
injectSpeedInsights();

/**
 * Middleware setup.
 */
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(morgan('dev')); // Logging
app.use(express.json()); // JSON body parsing
app.use(express.urlencoded({ extended: true })); // URL encoded parsing

// Apply rate limiting to all requests
app.use('/api', apiLimiter);

/**
 * Endpoint definitions.
 */
app.get('/', (req, res) => {
    res.json({ message: 'Smart Farm IoT API - Online' });
});

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/agent', agentRoutes);

/**
 * Handle undefined routes.
 */
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * Global Error Handler.
 */
app.use(errorHandler);

module.exports = app;

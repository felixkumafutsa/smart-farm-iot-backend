const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./utils/swagger');
const { errorHandler, AppError } = require('./middleware/error');
const { apiLimiter } = require('./middleware/rateLimit');

// Routes
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const iotRoutes = require('./routes/iotRoutes');
const agentRoutes = require('./routes/agentRoutes');
const agentManagementRoutes = require('./routes/agentManagementRoutes');

const app = express();

/**
 * Trust proxy for Vercel deployment (fixes rate-limiting issues)
 */
app.set('trust proxy', 1);

/**
 * Middleware setup.
 */
app.use(cors()); // CORS support
app.use(helmet({
    crossOriginResourcePolicy: false,
})); // Security headers
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

/**
 * Swagger API Documentation.
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css',
    customJs: [
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js',
    ],
}));

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/agent-management', agentManagementRoutes);

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
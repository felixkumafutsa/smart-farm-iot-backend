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
const corsOptions = {
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173', // Dev frontend
            process.env.FRONTEND_URL  // Production frontend
        ].filter(Boolean);
        
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log for debugging
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // CORS support
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "unpkg.com"],
            "style-src": ["'self'", "'unsafe-inline'", "unpkg.com"],
            "img-src": ["'self'", "data:", "unpkg.com"],
        },
    },
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
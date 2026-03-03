const Joi = require('joi');

/**
 * Validates request body against a Joi schema.
 */
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            error: 'Validation failed.',
            details: error.details.map(d => d.message)
        });
    }
    next();
};

/**
 * Registration schema.
 */
const schemas = {
    registerDevice: Joi.object({
        device_id: Joi.string().pattern(/^[a-zA-Z0-9-_]+$/).min(3).max(30).required()
            .messages({ 'string.pattern.base': 'device_id can only contain alphanumeric characters, hyphens, and underscores.' }),
        location: Joi.string().min(2).max(100).required(),
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required()
    }),

    sendSensorData: Joi.object({
        device_id: Joi.string().required(),
        temperature: Joi.number().required(),
        humidity: Joi.number().required(),
        soil_moisture: Joi.number().min(0).max(100).required(),
        light_intensity: Joi.number().min(0).max(100).optional(),
        latitude: Joi.number().min(-90).max(90).optional(),
        longitude: Joi.number().min(-180).max(180).optional()
    })
};

module.exports = {
    validate,
    schemas
};

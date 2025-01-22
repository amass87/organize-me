// src/middleware/validate.js
const { AppError } = require('./errorMiddleware');
const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  };

  const { error, value } = schema.validate(req.body, validationOptions);
  if (error) {
    const errorMessage = error.details
      .map(details => details.message)
      .join(', ');
    return next(new AppError(errorMessage, 400));
  }

  req.validatedData = value;
  return next();
};

// Auth validation schemas
const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Task validation schemas
const taskSchemas = {
  create: Joi.object({
    title: Joi.string().required().min(1).max(200),
    date: Joi.date().iso().required(),
    status: Joi.string().valid('pending', 'completed').default('pending'),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium')
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(200),
    date: Joi.date().iso(),
    status: Joi.string().valid('pending', 'completed'),
    priority: Joi.string().valid('low', 'medium', 'high')
  }).min(1)
};

module.exports = {
  validate,
  authSchemas,
  taskSchemas
};

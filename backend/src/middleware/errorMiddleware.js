import logger from '../utils/logger.js';

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFound = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  // Log error
  if (statusCode === 500) {
    logger.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }
  // Send error response
  res.status(statusCode).json({
    status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
};

export { AppError, notFound, errorHandler };

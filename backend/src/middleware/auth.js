// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { AppError } from './errorMiddleware.js';
import logger from '../utils/logger.js';

const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh'
};

// Extract token from headers or cookies
const extractToken = (req) => {
  const authHeader = req.header('Authorization');
  
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }
  
  return null;
};

// Verify JWT token
const verifyToken = (token, type = TOKEN_TYPES.ACCESS) => {
  try {
    const secret = type === TOKEN_TYPES.REFRESH 
      ? process.env.JWT_REFRESH_SECRET 
      : process.env.JWT_SECRET;
      
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 401);
    }
    throw error;
  }
};

// Main authentication middleware
const auth = (options = {}) => async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new AppError('No authentication token provided', 401);
    }

    // Verify the token
    const decoded = verifyToken(token);

    // Check token type if specified
    if (options.type && decoded.type !== options.type) {
      throw new AppError('Invalid token type', 401);
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    // Add token info for potential refresh
    req.token = {
      expires: new Date(decoded.exp * 1000),
      type: decoded.type
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Authentication error:', error);
      next(new AppError('Authentication failed', 401));
    }
  }
};

// Role-based authorization middleware
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('Not authorized to access this resource', 403));
  }

  next();
};

// Refresh token middleware
const refreshAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new AppError('No refresh token provided', 401);
    }

    const decoded = verifyToken(token, TOKEN_TYPES.REFRESH);

    // Add refresh token info to request
    req.refresh = {
      userId: decoded.userId,
      tokenId: decoded.tokenId
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Refresh token error:', error);
      next(new AppError('Invalid refresh token', 401));
    }
  }
};

// Named export
export {
  auth,
  authorize,
  refreshAuth,
  TOKEN_TYPES
};

// Default export
export default {
  auth,
  authorize,
  refreshAuth,
  TOKEN_TYPES
};

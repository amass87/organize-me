import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { auth, refreshAuth, TOKEN_TYPES } from '../middleware/auth.js';
import { AppError } from '../middleware/errorMiddleware.js';
import db from '../config/database.js';
import logger from '../utils/logger.js';

// Validation middlewares
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage('Password must be at least 8 characters long and contain numbers, uppercase and lowercase letters'),
  body('name').trim().notEmpty().escape()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation error', 400, errors.array());
  }
  next();
};

// Generate tokens
const generateTokens = (userId, email, role = 'user') => {
  const accessToken = jwt.sign(
    { userId, email, role, type: TOKEN_TYPES.ACCESS },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId, type: TOKEN_TYPES.REFRESH },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Register
router.post('/register',
  registerValidation,
  validateRequest,
  async (req, res, next) => {
    try {
      const { email, password, name } = req.body;

      await db.transaction(async (client) => {
        // Check if user exists
        const existingUser = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [email]
        );

        if (existingUser.rows.length > 0) {
          throw new AppError('Email already registered', 400);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const { rows: [user] } = await client.query(
          'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
          [email, hashedPassword, name, 'user']
        );

        // Generate tokens
        const tokens = generateTokens(user.id, user.email, user.role);

        // Store refresh token
        await client.query(
          'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
          [user.id, tokens.refreshToken]
        );

        res.status(201).json({
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          },
          ...tokens
        });
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post('/login',
  loginValidation,
  validateRequest,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { rows: [user] } = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      const tokens = generateTokens(user.id, user.email, user.role);

      // Store refresh token
      await db.query(
        'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
        [user.id, tokens.refreshToken]
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        ...tokens
      });
    } catch (error) {
      next(error);
    }
  }
);

// Refresh token
router.post('/refresh', refreshAuth, async (req, res, next) => {
  try {
    const { userId } = req.refresh;

    const { rows: [user] } = await db.query(
      'SELECT email, role FROM users WHERE id = $1',
      [userId]
    );

    const tokens = generateTokens(userId, user.email, user.role);

    // Update refresh token
    await db.query(
      'UPDATE refresh_tokens SET token = $1 WHERE user_id = $2',
      [tokens.refreshToken, userId]
    );

    res.json(tokens);
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', auth(), async (req, res, next) => {
  try {
    await db.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1',
      [req.user.userId]
    );

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', auth(), async (req, res, next) => {
  try {
    const { rows: [user] } = await db.query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [req.user.userId]
    );

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Example route
router.get('/test', (req, res) => {
    res.send('Auth route working');
});


export default router;

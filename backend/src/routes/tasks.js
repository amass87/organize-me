// src/routes/tasks.js
import express from 'express';
const router = express.Router();
import { body, param, query, validationResult } from 'express-validator';
import { AppError } from '../middleware/errorMiddleware.js';
import db from '../config/database.js';

// Validation middlewares
const taskValidation = [
  body('title').trim().notEmpty().escape(),
  body('date').isISO8601().toDate(),
  body('status').optional().isIn(['pending', 'completed', 'in_progress']),
  body('priority').optional().isIn(['low', 'medium', 'high'])
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation error', 400, errors.array());
  }
  next();
};

// Get all tasks with filtering and pagination
router.get('/', 
  [
    query('status').optional().isIn(['pending', 'completed', 'in_progress']),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { 
        status, 
        priority, 
        startDate, 
        endDate,
        page = 1,
        limit = 20
      } = req.query;

      let whereClause = ['user_id = $1'];
      let params = [req.user.userId];
      let paramCount = 1;

      if (status) {
        whereClause.push(`status = $${++paramCount}`);
        params.push(status);
      }

      if (priority) {
        whereClause.push(`priority = $${++paramCount}`);
        params.push(priority);
      }

      if (startDate) {
        whereClause.push(`date >= $${++paramCount}`);
        params.push(startDate);
      }

      if (endDate) {
        whereClause.push(`date <= $${++paramCount}`);
        params.push(endDate);
      }

      const offset = (page - 1) * limit;

      // Get total count
      const countQuery = `
        SELECT COUNT(*) 
        FROM tasks 
        WHERE ${whereClause.join(' AND ')}
      `;
      
      const { rows: [count] } = await db.query(countQuery, params);

      // Get tasks
      const query = `
        SELECT * 
        FROM tasks 
        WHERE ${whereClause.join(' AND ')}
        ORDER BY date ASC, priority DESC
        LIMIT $${++paramCount} OFFSET $${++paramCount}
      `;

      const { rows: tasks } = await db.query(
        query,
        [...params, limit, offset]
      );

      res.json({
        tasks,
        pagination: {
          total: parseInt(count.count),
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count.count / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Add a task
router.post('/',
  taskValidation,
  validateRequest,
  async (req, res, next) => {
    try {
      const { title, date, status = 'pending', priority = 'medium' } = req.body;

      const { rows: [task] } = await db.query(
        `INSERT INTO tasks (title, date, status, priority, user_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [title, date, status, priority, req.user.userId]
      );

      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
);

// Update a task
router.patch('/:id',
  [
    param('id').isInt(),
    ...taskValidation.map(validation => validation.optional())
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      await db.transaction(async (client) => {
        // Ensure task belongs to user
        const { rows: [task] } = await client.query(
          'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
          [id, req.user.userId]
        );

        if (!task) {
          throw new AppError('Task not found', 404);
        }

        const setClause = Object.keys(updates)
          .map((key, i) => `${key} = $${i + 1}`)
          .join(', ');
        
        const query = `
          UPDATE tasks 
          SET ${setClause}, updated_at = NOW()
          WHERE id = $${Object.keys(updates).length + 1} 
          AND user_id = $${Object.keys(updates).length + 2}
          RETURNING *
        `;
        
        const values = [...Object.values(updates), id, req.user.userId];
        const { rows: [updatedTask] } = await client.query(query, values);

        res.json(updatedTask);
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete a task
router.delete('/:id',
  param('id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const { rows } = await db.query(
        'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, req.user.userId]
      );
      
      if (rows.length === 0) {
        throw new AppError('Task not found', 404);
      }

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Get tasks for a specific date range
router.get('/range',
  [
    query('startDate').isISO8601().toDate(),
    query('endDate').isISO8601().toDate()
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;

      const { rows: tasks } = await db.query(
        `SELECT * 
         FROM tasks 
         WHERE user_id = $1 
         AND date BETWEEN $2 AND $3
         ORDER BY date ASC, priority DESC`,
        [req.user.userId, startDate, endDate]
      );

      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
);

// Bulk update tasks (for reordering)
router.post('/bulk-update',
  body('tasks').isArray(),
  body('tasks.*.id').isInt(),
  body('tasks.*.order').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { tasks } = req.body;

      await db.transaction(async (client) => {
        for (const task of tasks) {
          await client.query(
            'UPDATE tasks SET "order" = $1 WHERE id = $2 AND user_id = $3',
            [task.order, task.id, req.user.userId]
          );
        }
      });

      res.json({ message: 'Tasks updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

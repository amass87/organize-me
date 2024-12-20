//src/routes/tasks.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes in this router
router.use(auth);

// Get all tasks (only for authenticated user)
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT 
        id, user_id, title, status, priority,
        to_char(date, 'YYYY-MM-DD') as date,
        created_at, updated_at
      FROM tasks 
      WHERE user_id = $1 
      ORDER BY date ASC`,
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a task
router.post('/', async (req, res) => {
  try {
    const { title, date, status = 'pending', priority = 'medium' } = req.body;
    const query = `
      INSERT INTO tasks (title, date, status, priority, user_id)
      VALUES ($1, $2::date, $3, $4, $5)
      RETURNING id, user_id, title, status, priority, 
                to_char(date, 'YYYY-MM-DD') as date,
                created_at, updated_at
    `;
    const { rows } = await db.query(query, [title, date, status, priority, req.user.userId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task (only if it belongs to the user)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // First check if task belongs to user
    const taskCheck = await db.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const setClause = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');
    
    const query = `
      UPDATE tasks 
      SET ${setClause}
      WHERE id = $${Object.keys(updates).length + 1} AND user_id = $${Object.keys(updates).length + 2}
      RETURNING *
    `;
    
    const values = [...Object.values(updates), id, req.user.userId];
    const { rows } = await db.query(query, values);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task (only if it belongs to the user)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *';
    const { rows } = await db.query(query, [id, req.user.userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY date ASC',
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
    const { rows } = await db.query(
      `INSERT INTO tasks (title, date, status, priority, user_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [title, date, status, priority, req.user.userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Ensure task belongs to user
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

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { rows } = await db.query(
      'SELECT * FROM tasks WHERE user_id = $1 AND date = $2',
      [req.user.userId, date]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

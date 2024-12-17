//src/routes/tasks.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        id,
        user_id,
        title,
        status,
        priority,
        to_char(date, 'YYYY-MM-DD') as date,
        created_at,
        updated_at
      FROM tasks 
      ORDER BY date ASC`
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
      INSERT INTO tasks (title, date, status, priority)
      VALUES ($1, $2::date, $3, $4)
      RETURNING id, user_id, title, status, priority, 
                to_char(date, 'YYYY-MM-DD') as date,
                created_at, updated_at
    `;
    const { rows } = await db.query(query, [title, date, status, priority]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    // If date is being updated, format it
    if (updates.date) {
      updates.date = updates.date.split('T')[0];
    }

    const setClause = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');
    const query = `
      UPDATE tasks 
      SET ${setClause}
      WHERE id = $${Object.keys(updates).length + 1}
      RETURNING *
    `;
    const values = [...Object.values(updates), id];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

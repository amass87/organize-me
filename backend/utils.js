// tests/utils.js
import db from '../src/config/database.js';

export const clearDatabase = async () => {
  await db.query('TRUNCATE users, refresh_tokens, tasks RESTART IDENTITY CASCADE');
};

export const closeDatabase = async () => {
  await db.end();
};

export const createTestUser = async () => {
  const { rows: [user] } = await db.query(
    `INSERT INTO users (email, password_hash, name) 
     VALUES ($1, $2, $3) 
     RETURNING id, email, name`,
    ['test@example.com', 'hashedpassword123', 'Test User']
  );
  return user;
};

export const createTestTask = async (userId) => {
  const { rows: [task] } = await db.query(
    `INSERT INTO tasks (user_id, title, date, status, priority) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [userId, 'Test Task', '2025-02-12', 'pending', 'medium']
  );
  return task;
};

// tests/setup.js
import { jest } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import db from '../src/config/database.js';

global.beforeAll(async () => {
  // Setup test database and tables
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      title VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      priority VARCHAR(50) DEFAULT 'medium',
      "order" INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

global.afterAll(async () => {
  // Clean up test database
  await db.query(`
    DROP TABLE IF EXISTS tasks;
    DROP TABLE IF EXISTS refresh_tokens;
    DROP TABLE IF EXISTS users;
  `);
  await db.end();
});

global.beforeEach(async () => {
  // Clean up tables before each test
  await db.query(`
    TRUNCATE tasks, refresh_tokens, users RESTART IDENTITY CASCADE;
  `);
});

// tests/auth.test.js
import request from 'supertest';
import app from '../src/app.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../src/config/database.js';

describe('Auth Routes', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'TestPassword123',
    name: 'Test User'
  };

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should not register user with existing email', async () => {
      // First registration
      await request(app)
        .post('/auth/register')
        .send(testUser);

      // Second registration attempt
      const response = await request(app)
        .post('/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testUser.password, salt);
      
      await db.query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)',
        [testUser.email, hashedPassword, testUser.name]
      );
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });
});

// tests/tasks.test.js
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/database.js';

describe('Tasks Routes', () => {
  let authToken;
  let userId;

  const testUser = {
    email: 'tasktest@example.com',
    password: 'TestPassword123',
    name: 'Task Test User'
  };

  beforeEach(async () => {
    // Create test user and get auth token
    const response = await request(app)
      .post('/auth/register')
      .send(testUser);

    authToken = response.body.accessToken;
    userId = response.body.user.id;
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const task = {
        title: 'Test Task',
        date: '2025-03-01',
        priority: 'high'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(task);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(task.title);
    });

    it('should not create task without authentication', async () => {
      const task = {
        title: 'Test Task',
        date: '2025-03-01'
      };

      const response = await request(app)
        .post('/tasks')
        .send(task);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /tasks', () => {
    beforeEach(async () => {
      // Create some test tasks
      const tasks = [
        {
          title: 'Task 1',
          date: '2025-03-01',
          status: 'pending',
          priority: 'high'
        },
        {
          title: 'Task 2',
          date: '2025-03-02',
          status: 'completed',
          priority: 'medium'
        }
      ];

      for (const task of tasks) {
        await db.query(
          `INSERT INTO tasks (title, date, status, priority, user_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [task.title, task.date, task.status, task.priority, userId]
        );
      }
    });

    it('should get all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(2);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/tasks')
        .query({ status: 'pending' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.tasks[0].status).toBe('pending');
    });
  });

  describe('PATCH /tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      // Create a test task
      const { rows: [task] } = await db.query(
        `INSERT INTO tasks (title, date, status, priority, user_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        ['Update Test Task', '2025-03-01', 'pending', 'medium', userId]
      );
      taskId = task.id;
    });

    it('should update task successfully', async () => {
      const updates = {
        title: 'Updated Task',
        status: 'completed'
      };

      const response = await request(app)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updates.title);
      expect(response.body.status).toBe(updates.status);
    });
  });
});

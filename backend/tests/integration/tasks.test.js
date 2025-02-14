// backend/tests/integration/tasks.test.js
import request from 'supertest';
import { app } from '../../src/index.js';
import { query } from '../../src/config/database.js';

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
      .post('/api/auth/register')
      .send(testUser);

    authToken = response.body.accessToken;
    userId = response.body.user.id;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const task = {
        title: 'Test Task',
        date: '2025-03-01',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
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
        .post('/api/tasks')
        .send(task);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
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
        await query(
          `INSERT INTO tasks (title, date, status, priority, user_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [task.title, task.date, task.status, task.priority, userId]
        );
      }
    });

    it('should get all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(2);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ status: 'pending' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.tasks[0].status).toBe('pending');
    });
  });
});

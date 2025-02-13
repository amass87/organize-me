// tests/basic.test.js
import request from 'supertest';
import app from '../src/app.js';
import { clearDatabase } from './utils.js';

describe('Basic Test', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should respond to health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });
});

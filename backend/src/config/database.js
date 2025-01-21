const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'planner_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'planner_db',
  password: process.env.DB_PASSWORD || 'planner123',
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

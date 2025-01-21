require('dotenv').config();
const db = require('../config/database');

async function testConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Database connected successfully:', result.rows[0]);
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    process.exit();
  }
}

testConnection();

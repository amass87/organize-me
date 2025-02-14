// src/config/database.js
import pkg from 'pg';
const { Pool } = pkg;
import logger from '../utils/logger.js';

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'planner_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'planner_db',
  password: process.env.DB_PASSWORD || 'planner123',
  port: process.env.DB_PORT || 5432,
  // Additional pool configuration
  max: process.env.DB_POOL_SIZE || 20, // Maximum number of clients
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false // Needed for some hosting providers
  } : undefined
};

const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', err);
});

// Monitor pool events in development
if (process.env.NODE_ENV === 'development') {
  pool.on('connect', () => {
    logger.debug('New client connected to the pool');
  });
  
  pool.on('remove', () => {
    logger.debug('Client removed from pool');
  });
}

// Enhanced query function with error handling
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log query information in development
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Executed query', {
        text,
        duration,
        rows: res.rowCount
      });
    }
    
    return res;
  } catch (error) {
    logger.error('Database query error', {
      error: error.message,
      query: text,
      params
    });
    throw error;
  }
}

// Transaction helper
async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Health check function
async function healthCheck() {
  try {
    const result = await query('SELECT NOW()');
    return {
      status: 'healthy',
      timestamp: result.rows[0].now,
      pool: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  } catch (error) {
    logger.error('Database health check failed', error);
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

// Cleanup function for graceful shutdown
async function close() {
  try {
    logger.info('Closing database pool...');
    await pool.end();
    logger.info('Database pool closed');
  } catch (error) {
    logger.error('Error closing database pool', error);
    throw error;
  }
}

// Named export
export {
  query,
  transaction,
  healthCheck,
  close,
  pool
}

// Default export
export default {
  query,
  transaction,
  healthCheck,
  close,
  pool // Exported for direct access if needed
};

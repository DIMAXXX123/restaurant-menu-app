require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') || process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : false,
});

pool.on('error', (err) => {
  console.error('Unexpected DB error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};

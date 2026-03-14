const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export default async function handler(req, res) {
  requireAuth(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const result = await pool.query('SELECT id, username, email, created_at FROM admins WHERE id = $1', [req.admin.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Admin not found' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error('[Error]', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

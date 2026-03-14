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
  // GET - public access
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT key, value FROM cafe_settings');
      const settings = {};
      for (const row of result.rows) {
        settings[row.key] = row.value;
      }
      res.json(settings);
    } catch (err) {
      console.error('[Error]', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  // PUT - requires auth
  requireAuth(req, res, async () => {
    if (req.method !== 'PUT') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const updates = req.body;
      const allowedKeys = [
        'cafe_name', 'phone', 'email', 'address',
        'hours_weekday', 'hours_weekend', 'maps_embed_url',
      ];

      for (const [key, value] of Object.entries(updates)) {
        if (!allowedKeys.includes(key)) continue;
        await pool.query(
          `INSERT INTO cafe_settings (key, value) VALUES ($1, $2)
           ON CONFLICT (key) DO UPDATE SET value = $2`,
          [key, value]
        );
      }
      res.json({ message: 'Settings updated' });
    } catch (err) {
      console.error('[Error]', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

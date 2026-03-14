const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CATEGORY_ORDER = [
  'popular', 'hot-drinks', 'cold-drinks', 'breakfast',
  'light-bites', 'sandwiches', 'mains', 'desserts',
];

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
  const { method, url } = req;
  
  // GET /api/menu - public, returns grouped menu
  if (method === 'GET' && url === '/api/menu') {
    try {
      const result = await pool.query(
        'SELECT * FROM menu_items WHERE available = TRUE ORDER BY category, name'
      );
      const grouped = {};
      for (const cat of CATEGORY_ORDER) {
        grouped[cat] = result.rows.filter((item) => item.category === cat);
      }
      res.json(grouped);
    } catch (err) {
      console.error('[Error]', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  // All other routes require auth
  requireAuth(req, res, async () => {
    try {
      // GET /api/menu/all - all items
      if (method === 'GET' && url === '/api/menu/all') {
        const result = await pool.query('SELECT * FROM menu_items ORDER BY category, name');
        res.json(result.rows);
        return;
      }

      // POST /api/menu - create
      if (method === 'POST' && url === '/api/menu') {
        const { name, description, price, category, emoji, image_url, available } = req.body;
        if (!name || !price || !category) {
          return res.status(400).json({ error: 'Name, price, and category are required' });
        }
        const result = await pool.query(
          `INSERT INTO menu_items (name, description, price, category, emoji, image_url, available)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [name, description || '', price, category, emoji || '🍽️', image_url || null, available !== false]
        );
        res.status(201).json(result.rows[0]);
        return;
      }

      // Handle /api/menu/:id
      const idMatch = url.match(/^\/api\/menu\/(\d+)$/);
      if (idMatch) {
        const id = idMatch[1];

        // GET /api/menu/:id
        if (method === 'GET') {
          const result = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
          if (!result.rows[0]) return res.status(404).json({ error: 'Item not found' });
          res.json(result.rows[0]);
          return;
        }

        // PUT /api/menu/:id
        if (method === 'PUT') {
          const { name, description, price, category, emoji, image_url, available } = req.body;
          const result = await pool.query(
            `UPDATE menu_items
             SET name=$1, description=$2, price=$3, category=$4, emoji=$5, image_url=$6,
                 available=$7, updated_at=NOW()
             WHERE id=$8 RETURNING *`,
            [name, description, price, category, emoji || '🍽️', image_url || null, available, id]
          );
          if (!result.rows[0]) return res.status(404).json({ error: 'Item not found' });
          res.json(result.rows[0]);
          return;
        }

        // DELETE /api/menu/:id
        if (method === 'DELETE') {
          const result = await pool.query('DELETE FROM menu_items WHERE id=$1 RETURNING id', [id]);
          if (!result.rows[0]) return res.status(404).json({ error: 'Item not found' });
          res.json({ message: 'Deleted' });
          return;
        }

        // PATCH /api/menu/:id/availability
        if (method === 'PATCH' && url.includes('/availability')) {
          const result = await pool.query(
            `UPDATE menu_items SET available = NOT available, updated_at=NOW()
             WHERE id=$1 RETURNING *`,
            [id]
          );
          if (!result.rows[0]) return res.status(404).json({ error: 'Item not found' });
          res.json(result.rows[0]);
          return;
        }
      }

      res.status(404).json({ error: 'Not found' });
    } catch (err) {
      console.error('[Error]', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

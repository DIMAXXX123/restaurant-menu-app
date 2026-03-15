const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

const CATEGORY_ORDER = [
  'popular', 'hot-drinks', 'cold-drinks', 'breakfast',
  'light-bites', 'sandwiches', 'mains', 'desserts',
];

// GET /api/menu — all available items grouped by category
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM menu_items WHERE available = TRUE ORDER BY category, name'
    );
    const grouped = {};
    for (const cat of CATEGORY_ORDER) {
      grouped[cat] = result.rows.filter((item) => item.category === cat);
    }
    res.json(grouped);
  } catch (err) {
    next(err);
  }
});

// GET /api/menu/all — all items including unavailable (admin)
router.get('/all', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM menu_items ORDER BY category, name');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/menu/:id
router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM menu_items WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/menu — create
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, description, price, category, emoji, image_url, available } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    if (typeof name !== 'string' || name.length > 150) {
      return res.status(400).json({ error: 'Name must be a string (max 150 chars)' });
    }
    if (description && (typeof description !== 'string' || description.length > 500)) {
      return res.status(400).json({ error: 'Description must be a string (max 500 chars)' });
    }
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0 || priceNum > 99999) {
      return res.status(400).json({ error: 'Price must be a number between 0 and 99999' });
    }
    if (!CATEGORY_ORDER.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    const result = await db.query(
      `INSERT INTO menu_items (name, description, price, category, emoji, image_url, available)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description || '', priceNum, category, emoji || '🍽️', image_url || null, available !== false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/menu/:id — update
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, description, price, category, emoji, image_url, available } = req.body;
    const result = await db.query(
      `UPDATE menu_items
       SET name=$1, description=$2, price=$3, category=$4, emoji=$5, image_url=$6,
           available=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name, description, price, category, emoji || '🍽️', image_url || null, available, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/menu/:id
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM menu_items WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/menu/:id/availability — toggle available
router.patch('/:id/availability', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      `UPDATE menu_items SET available = NOT available, updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

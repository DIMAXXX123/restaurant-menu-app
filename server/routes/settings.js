const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// GET /api/settings — public (for footer, hero etc.)
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT key, value FROM cafe_settings');
    const settings = {};
    for (const row of result.rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings — update (auth required)
router.put('/', requireAuth, async (req, res, next) => {
  try {
    const updates = req.body; // { key: value, ... }
    const allowedKeys = [
      'cafe_name', 'phone', 'email', 'address',
      'hours_weekday', 'hours_weekend', 'maps_embed_url',
    ];

    for (const [key, value] of Object.entries(updates)) {
      if (!allowedKeys.includes(key)) continue;
      await db.query(
        `INSERT INTO cafe_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = $2`,
        [key, value]
      );
    }
    res.json({ message: 'Settings updated' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

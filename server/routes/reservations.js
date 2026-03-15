const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');
const { sendTelegramNotification } = require('../telegram');

const router = express.Router();

// POST /api/reservations — public
router.post('/', async (req, res, next) => {
  try {
    const { guest_name, phone, email, date, time, guests, notes } = req.body;
    if (!guest_name || !date || !time || !guests) {
      return res.status(400).json({ error: 'Name, date, time, and guests are required' });
    }
    // Input length & type validation
    if (typeof guest_name !== 'string' || guest_name.length > 100) {
      return res.status(400).json({ error: 'Guest name must be a string (max 100 chars)' });
    }
    if (phone && (typeof phone !== 'string' || phone.length > 30)) {
      return res.status(400).json({ error: 'Phone must be a string (max 30 chars)' });
    }
    if (email && (typeof email !== 'string' || email.length > 100)) {
      return res.status(400).json({ error: 'Email must be a string (max 100 chars)' });
    }
    if (notes && (typeof notes !== 'string' || notes.length > 500)) {
      return res.status(400).json({ error: 'Notes must be a string (max 500 chars)' });
    }
    const guestsNum = Number(guests);
    if (!Number.isInteger(guestsNum) || guestsNum < 1 || guestsNum > 50) {
      return res.status(400).json({ error: 'Guests must be an integer between 1 and 50' });
    }

    const result = await db.query(
      `INSERT INTO reservations (guest_name, phone, email, date, time, guests, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [guest_name, phone || '', email || '', date, time, guests, notes || '']
    );

    const r = result.rows[0];
    await sendTelegramNotification(
      `🍽️ <b>New Reservation!</b>\n\n` +
      `👤 <b>Guest:</b> ${r.guest_name}\n` +
      `📞 <b>Phone:</b> ${r.phone || 'N/A'}\n` +
      `📧 <b>Email:</b> ${r.email || 'N/A'}\n` +
      `📅 <b>Date:</b> ${r.date}\n` +
      `🕐 <b>Time:</b> ${r.time}\n` +
      `👥 <b>Guests:</b> ${r.guests}\n` +
      `📝 <b>Notes:</b> ${r.notes || 'None'}`
    );

    res.status(201).json(r);
  } catch (err) {
    next(err);
  }
});

// GET /api/reservations — all (auth required)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM reservations';
    const params = [];
    if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    query += ' ORDER BY date DESC, time DESC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/reservations/:id/status
router.patch('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be accepted or rejected' });
    }

    const result = await db.query(
      'UPDATE reservations SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Reservation not found' });

    const r = result.rows[0];
    const emoji = status === 'accepted' ? '✅' : '❌';
    await sendTelegramNotification(
      `${emoji} <b>Reservation ${status.charAt(0).toUpperCase() + status.slice(1)}</b>\n\n` +
      `👤 <b>Guest:</b> ${r.guest_name}\n` +
      `📅 <b>Date:</b> ${r.date} at ${r.time}\n` +
      `👥 <b>Guests:</b> ${r.guests}`
    );

    res.json(r);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/reservations/:id
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM reservations WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Reservation not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

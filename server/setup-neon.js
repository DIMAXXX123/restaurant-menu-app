/**
 * setup-neon.js
 * Run once to initialise your Neon database:
 *   node server/setup-neon.js
 *
 * Requires DATABASE_URL in .env pointing to your Neon connection string.
 */
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

if (!process.env.DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('🔌  Connected to Neon database');

    // ── 1. Schema ────────────────────────────────────────────────
    console.log('📐  Applying schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);
    console.log('✅  Schema applied');

    // ── 2. Seed menu items ───────────────────────────────────────
    console.log('🌱  Seeding menu items...');
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await client.query(seed);
    console.log('✅  Menu items seeded');

    // ── 3. Admin user ────────────────────────────────────────────
    console.log('👤  Creating admin user...');
    const hash = await bcrypt.hash('admin1234', 10);
    await client.query(`
      INSERT INTO admins (username, password_hash, email)
      VALUES ('admin', $1, 'admin@cafe.com')
      ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
    `, [hash]);
    console.log('✅  Admin user ready  (username: admin / password: admin1234)');

    // ── 4. Verify ────────────────────────────────────────────────
    const { rows: menuRows } = await client.query('SELECT COUNT(*) FROM menu_items');
    const { rows: adminRows } = await client.query('SELECT username FROM admins');
    console.log(`\n📊  Database summary:`);
    console.log(`    Menu items : ${menuRows[0].count}`);
    console.log(`    Admins     : ${adminRows.map(r => r.username).join(', ')}`);
    console.log('\n🎉  Neon database is ready!');
  } catch (err) {
    console.error('❌  Setup failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();

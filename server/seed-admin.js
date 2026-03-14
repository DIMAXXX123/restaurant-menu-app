/**
 * seed-admin.js
 * Run once to create the default admin user with password "admin1234"
 * Usage: node server/seed-admin.js
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db');

async function seedAdmin() {
  const password = 'admin1234';
  const hash = await bcrypt.hash(password, 10);

  try {
    await db.query(
      `INSERT INTO admins (username, password_hash, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO UPDATE SET password_hash = $2`,
      ['admin', hash, 'admin@monochrome.cafe']
    );
    console.log('✅ Admin user seeded successfully');
    console.log('   Username: admin');
    console.log('   Password: admin1234');
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  } finally {
    process.exit(0);
  }
}

seedAdmin();

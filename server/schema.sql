-- Monochrome Café – Database Schema

-- Admin users
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(8,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  emoji VARCHAR(10) DEFAULT '🍽️',
  image_url VARCHAR(255),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  guest_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(100),
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Café settings
CREATE TABLE IF NOT EXISTS cafe_settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT
);

INSERT INTO cafe_settings (key, value) VALUES
  ('cafe_name', 'Monochrome Café'),
  ('phone', '+43 1 234 5678'),
  ('email', 'hello@monochrome.cafe'),
  ('address', 'Schubertgasse 12, 1090 Vienna'),
  ('hours_weekday', '08:00 – 22:00'),
  ('hours_weekend', '09:00 – 23:00'),
  ('maps_embed_url', 'https://maps.google.com/maps?q=Schubertgasse+12+Vienna&output=embed')
ON CONFLICT DO NOTHING;

# Monochrome Café

A full-stack café web application — minimalist design, specialty coffee vibes.

**Stack:** Express 5 · PostgreSQL · React 18 · Vite · JWT Auth · Telegram Notifications

---

## Prerequisites

- **Node.js** 20+
- **PostgreSQL** 14+
- A **Telegram Bot** (optional, for reservation notifications)

---

## Quick Start

### 1. Install dependencies

```bash
npm install && cd client && npm install && cd ..
```

### 2. Create database

```bash
psql -U postgres -c "CREATE DATABASE cafe_db"
```

### 3. Run schema

```bash
psql -U postgres -d cafe_db -f server/schema.sql
```

### 4. Seed menu data (50+ items)

```bash
psql -U postgres -d cafe_db -f server/seed.sql
```

### 5. Create admin user

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npm run seed-admin
```

### 6. Start development server

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000
- **Admin Panel:** http://localhost:5173/admin

---

## Default Admin Login

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin1234`|

> Change the password immediately after first login via Settings.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/cafe_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=7d

TELEGRAM_BOT_TOKEN=123456789:ABCDEFghijk...
TELEGRAM_CHAT_ID=123456789

VITE_API_URL=http://localhost:4000
```

---

## Telegram Bot Setup (2 minutes)

1. Open Telegram and message `@BotFather`
2. Send `/newbot` and follow the prompts
3. Copy the **token** → set as `TELEGRAM_BOT_TOKEN`
4. Start a conversation with your new bot
5. Visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Find `"chat":{"id":...}` → set as `TELEGRAM_CHAT_ID`

---

## Features

### Public Site
- **Hero section** — dark charcoal + gold dot-grid design
- **Full menu** — 8 categories, responsive card grid
- **Reservation form** — with live validation
- **4 languages** — EN / HR / DE / IT (toggle in navbar)
- **Mobile responsive** — works perfectly at 375px

### Admin Panel (`/admin`)
- **Dashboard** — stats, recent reservations
- **Menu Editor** — add/edit/delete items, image upload, availability toggle
- **Reservations** — filter, search, accept/reject with Telegram notifications
- **Settings** — café info, map embed, change password

---

## Project Structure

```
RestourantMenuDef/
├── server/
│   ├── index.js          # Express app
│   ├── db.js             # PostgreSQL pool
│   ├── telegram.js       # Telegram notifications
│   ├── schema.sql        # Database schema
│   ├── seed.sql          # 50+ menu items
│   ├── seed-admin.js     # Admin user seeder
│   ├── middleware/
│   │   └── auth.js       # JWT middleware
│   └── routes/
│       ├── auth.js
│       ├── menu.js
│       ├── reservations.js
│       ├── upload.js
│       └── settings.js
├── client/
│   └── src/
│       ├── components/   # Navbar, Hero, MenuCard, Footer, admin/Sidebar
│       ├── pages/        # MenuPage, ReservationPage, admin/*
│       ├── context/      # TranslationContext
│       ├── hooks/        # useTranslation
│       └── i18n.js       # EN / HR / DE / IT translations
├── uploads/              # Uploaded images
└── .env.example
```

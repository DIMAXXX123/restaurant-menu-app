/**
 * Download real food photos from Unsplash and upload to Supabase via prod API.
 * Usage: node scripts/upload-images.js
 */
require('dotenv').config();
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const API = 'https://restaurant-menu-app-378x.onrender.com';

// Map: menu item ID → Unsplash photo ID (real food photos, free to use)
const IMAGE_MAP = {
  // === POPULAR ===
  1:  'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop', // Café Viennois
  2:  'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=400&fit=crop', // Avocado Toast
  3:  'https://images.unsplash.com/photo-1608039829572-9b0ba1039c4b?w=600&h=400&fit=crop', // Eggs Benedict — replaced
  4:  'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&h=400&fit=crop', // Croissant au Beurre
  5:  'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop', // Cappuccino
  6:  'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop', // Tiramisu
  7:  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop', // Club Sandwich
  8:  'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop', // Acai Bowl

  // === HOT DRINKS ===
  9:  'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&h=400&fit=crop', // Espresso
  10: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&h=400&fit=crop', // Doppio
  11: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&h=400&fit=crop', // Flat White
  12: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&h=400&fit=crop', // Matcha Latte
  13: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop', // London Fog
  14: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&h=400&fit=crop', // Hot Chocolate
  15: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=600&h=400&fit=crop', // Chai Latte

  // === COLD DRINKS ===
  16: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop', // Cold Brew
  17: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=400&fit=crop', // Iced Matcha Latte
  18: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=400&fit=crop', // Sparkling Lemonade
  19: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=400&fit=crop', // Berry Smoothie
  20: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&h=400&fit=crop', // Fresh Orange Juice
  21: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&h=400&fit=crop', // Iced Americano
  22: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=400&fit=crop', // Kombucha

  // === BREAKFAST ===
  23: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop', // Full Viennese Breakfast
  24: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop', // Bircher Muesli
  25: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop', // Pancake Stack
  26: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&h=400&fit=crop', // Smashed Avocado & Feta
  27: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&h=400&fit=crop', // Granola Bowl
  28: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=600&h=400&fit=crop', // Shakshuka
  29: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=400&fit=crop', // French Toast

  // === LIGHT BITES ===
  30: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&h=400&fit=crop', // Cheese Board
  31: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&h=400&fit=crop', // Charcuterie Plate
  32: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop', // Soup of the Day
  33: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=400&fit=crop', // Hummus & Pita
  34: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&h=400&fit=crop', // Bruschetta Trio
  35: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&h=400&fit=crop', // Mezze Platter

  // === SANDWICHES ===
  36: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&h=400&fit=crop', // Croque Monsieur
  37: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop', // Tuna Niçoise Wrap
  38: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600&h=400&fit=crop', // BLT Sourdough
  39: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop', // Roasted Veg Ciabatta
  40: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=600&h=400&fit=crop', // Pulled Chicken Brioche
  41: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&h=400&fit=crop', // Smoked Salmon Bagel

  // === MAINS ===
  42: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=600&h=400&fit=crop', // Wiener Schnitzel
  43: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&h=400&fit=crop', // Pasta Carbonara
  44: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop', // Grilled Salmon
  45: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop', // Mushroom Risotto
  46: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&h=400&fit=crop', // Chicken Caesar Salad
  47: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', // Beef Burger
  48: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', // Vegetable Tagine

  // === DESSERTS ===
  49: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop', // Sachertorte
  50: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&h=400&fit=crop', // Crème Brûlée
  51: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&h=400&fit=crop', // Lemon Tart
  52: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&h=400&fit=crop', // Affogato
  53: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop', // Chocolate Fondant
  54: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=600&h=400&fit=crop', // Apple Strudel
};

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const get = url.startsWith('https') ? https.get : http.get;
    get(url, { headers: { 'User-Agent': 'CafeApp/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function login() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ username: 'admin', password: 'admin1234' });
    const req = https.request(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
    }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        const parsed = JSON.parse(body);
        if (parsed.token) resolve(parsed.token);
        else reject(new Error(parsed.error));
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function uploadToApi(token, buffer, filename) {
  return new Promise((resolve, reject) => {
    const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="${filename}"\r\nContent-Type: image/jpeg\r\n\r\n`;
    const footer = `\r\n--${boundary}--\r\n`;
    const payload = Buffer.concat([Buffer.from(header), buffer, Buffer.from(footer)]);

    const req = https.request(`${API}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length,
      },
    }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.url) resolve(parsed.url);
          else reject(new Error(parsed.error || body));
        } catch { reject(new Error(body)); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function updateMenuItem(token, id, imageUrl) {
  return new Promise((resolve, reject) => {
    // First get current item data
    const getReq = https.request(`${API}/api/menu/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        const item = JSON.parse(body);
        const data = JSON.stringify({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          emoji: item.emoji,
          image_url: imageUrl,
          available: item.available,
        });
        const putReq = https.request(`${API}/api/menu/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
          },
        }, (res2) => {
          let body2 = '';
          res2.on('data', (c) => body2 += c);
          res2.on('end', () => resolve(JSON.parse(body2)));
        });
        putReq.on('error', reject);
        putReq.write(data);
        putReq.end();
      });
    });
    getReq.on('error', reject);
    getReq.end();
  });
}

async function main() {
  console.log('Logging in...');
  const token = await login();
  console.log('Logged in!\n');

  const ids = Object.keys(IMAGE_MAP).map(Number);
  let done = 0;
  const total = ids.length;

  for (const id of ids) {
    const url = IMAGE_MAP[id];
    try {
      process.stdout.write(`[${++done}/${total}] Item ${id}: downloading...`);
      const buffer = await downloadImage(url);
      process.stdout.write(` ${(buffer.length/1024).toFixed(0)}KB, uploading...`);
      const imageUrl = await uploadToApi(token, buffer, `item-${id}-${Date.now()}.jpg`);
      process.stdout.write(` updating DB...`);
      await updateMenuItem(token, id, imageUrl);
      console.log(' OK');
    } catch (err) {
      console.log(` FAIL: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);

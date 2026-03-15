/**
 * Upload remaining images that failed due to rate limit.
 * Adds delay between requests to avoid rate limiting.
 */
require('dotenv').config();
const https = require('https');

const API = 'https://restaurant-menu-app-378x.onrender.com';

const REMAINING = {
  3:  'https://images.unsplash.com/photo-1608039790093-765f12ecab61?w=600&h=400&fit=crop', // Eggs Benedict
  4:  'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&h=400&fit=crop', // Croissant
  10: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&h=400&fit=crop', // Doppio
  36: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&h=400&fit=crop', // Croque Monsieur
  37: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop', // Tuna Wrap
  38: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600&h=400&fit=crop', // BLT
  39: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop', // Roasted Veg
  40: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=600&h=400&fit=crop', // Pulled Chicken
  41: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&h=400&fit=crop', // Salmon Bagel
  42: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=600&h=400&fit=crop', // Schnitzel
  43: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&h=400&fit=crop', // Carbonara
  44: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop', // Salmon
  45: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop', // Risotto
  46: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&h=400&fit=crop', // Caesar Salad
  47: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', // Burger
  48: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', // Tagine
  49: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop', // Sachertorte
  50: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&h=400&fit=crop', // Crème Brûlée
  51: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&h=400&fit=crop', // Lemon Tart
  52: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&h=400&fit=crop', // Affogato
  53: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop', // Choco Fondant
  54: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=600&h=400&fit=crop', // Apple Strudel
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CafeApp/1.0' } }, (res) => {
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
    const getReq = https.request(`${API}/api/menu/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        const item = JSON.parse(body);
        const data = JSON.stringify({
          name: item.name, description: item.description, price: item.price,
          category: item.category, emoji: item.emoji, image_url: imageUrl, available: item.available,
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

  const ids = Object.keys(REMAINING).map(Number);
  let done = 0;

  for (const id of ids) {
    const url = REMAINING[id];
    try {
      process.stdout.write(`[${++done}/${ids.length}] Item ${id}: downloading...`);
      const buffer = await downloadImage(url);
      process.stdout.write(` ${(buffer.length/1024).toFixed(0)}KB, uploading...`);
      const imageUrl = await uploadToApi(token, buffer, `item-${id}-${Date.now()}.jpg`);
      process.stdout.write(` updating DB...`);
      await updateMenuItem(token, id, imageUrl);
      console.log(' OK');
    } catch (err) {
      console.log(` FAIL: ${err.message}`);
    }
    // 3 sec delay between items to avoid rate limit
    await sleep(3000);
  }

  console.log('\nDone!');
}

main().catch(console.error);

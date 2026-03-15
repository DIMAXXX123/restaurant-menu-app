const express = require('express');
const multer = require('multer');
const path = require('path');
const requireAuth = require('../middleware/auth');
const { uploadImage } = require('../supabase');

const router = express.Router();

// Use memory storage — file buffer goes straight to Supabase
const storage = multer.memoryStorage();

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTS.includes(ext) && ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, png, and webp images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/upload
router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    const publicUrl = await uploadImage(req.file.buffer, filename, req.file.mimetype);

    res.json({ url: publicUrl });
  } catch (err) {
    next(err);
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max 5MB allowed.' });
    }
  }
  next(err);
});

module.exports = router;

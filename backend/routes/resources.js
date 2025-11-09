const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// configure multer to store uploads within backend/uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

// Add resource (supports file upload)
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, description, url, tags } = req.body;
    let fileUrl = url || null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }
    const resource = new Resource({ title, description, url: fileUrl, tags: tags ? tags.split(',').map(t => t.trim()) : [], owner: req.user.id });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    console.error('Resource save error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

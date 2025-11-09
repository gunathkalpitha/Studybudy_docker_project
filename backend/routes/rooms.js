const express = require('express');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const router = express.Router();

// Create room
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const room = new Room({ name, description, host: req.user.id, members: [req.user.id] });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error('Create room error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().populate('host', 'email');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room by id
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('host', 'email displayName').populate('members', 'email displayName')
    if (!room) return res.status(404).json({ message: 'Room not found' })
    res.json(room)
  } catch (err) {
    console.error('Get room error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Join room
router.post('/:id/join', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!room.members.includes(req.user.id)) {
      room.members.push(req.user.id);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a file entry to a room (must be authenticated)
router.post('/:id/files', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    const { title, url } = req.body;
    if (!url) return res.status(400).json({ message: 'Missing file url' });
    const fileEntry = { title: title || 'File', url, owner: req.user.id };
    room.files = room.files || [];
    room.files.push(fileEntry);
    await room.save();
    res.status(201).json(fileEntry);
  } catch (err) {
    console.error('Add file to room error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

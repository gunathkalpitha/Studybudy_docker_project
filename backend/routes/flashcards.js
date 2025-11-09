const express = require('express');
const Flashcard = require('../models/Flashcard');
const auth = require('../middleware/auth');

const router = express.Router();

// List flashcards for current user (owner or shared)
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cards = await Flashcard.find({ $or: [{ owner: userId }, { sharedWith: userId }] }).sort({ createdAt: -1 }).lean();
    res.json(cards);
  } catch (err) {
    console.error('Flashcards list error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create flashcard
router.post('/', auth, async (req, res) => {
  try {
    const { title, front, back, sharedWith } = req.body;
    const card = new Flashcard({ title, front, back, owner: req.user.id, sharedWith: Array.isArray(sharedWith) ? sharedWith : [] });
    await card.save();
    res.status(201).json(card);
  } catch (err) {
    console.error('Create flashcard error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get by id (only owner or shared)
router.get('/:id', auth, async (req, res) => {
  try {
    const card = await Flashcard.findById(req.params.id).lean();
    if (!card) return res.status(404).json({ message: 'Not found' });
    const allowed = String(card.owner) === String(req.user.id) || (card.sharedWith || []).some(id => String(id) === String(req.user.id));
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    res.json(card);
  } catch (err) {
    console.error('Get flashcard error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const card = await Flashcard.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Not found' });
    if (String(card.owner) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
    await card.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete flashcard error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

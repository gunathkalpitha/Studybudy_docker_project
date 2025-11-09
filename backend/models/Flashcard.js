const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  front: { type: String, required: true },
  back: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// Collaborative fields
roomSchema.add({
  notepad: { type: String, default: '' },
  messages: [{ sender: { type: String }, text: { type: String }, ts: { type: Date, default: Date.now } }],
  files: [{ title: String, url: String, owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, createdAt: { type: Date, default: Date.now } }]
});

module.exports = mongoose.model('Room', roomSchema);

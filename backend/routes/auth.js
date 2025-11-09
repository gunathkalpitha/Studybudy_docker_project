const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT Token
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'
if (!process.env.JWT_SECRET) console.warn('Warning: JWT_SECRET not set, using development secret')
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const user = new User({ email, password, displayName });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({ message: 'User created successfully', token, user: { id: user._id, email: user.email, displayName: user.displayName } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email, displayName: user.displayName, photoURL: user.photoURL } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Development helper: simple Google sign-in mock for local/dev use
// POST /api/auth/google/dev
router.post('/google/dev', async (req, res) => {
  try {
    // In real deployment replace with proper Google OAuth flow.
    const { email } = req.body || {};
    const demoEmail = email || `google_user_${Date.now()}@example.com`;

    let user = await User.findOne({ email: demoEmail });
    if (!user) {
      // create user with a random password (won't be used)
      user = new User({ email: demoEmail, password: Math.random().toString(36).slice(2), displayName: 'Google User' });
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({ message: 'Google (dev) login successful', token, user: { id: user._id, email: user.email, displayName: user.displayName } });
  } catch (error) {
    console.error('Google dev login error:', error);
    res.status(500).json({ message: 'Server error during Google dev login' });
  }
});

module.exports = router;
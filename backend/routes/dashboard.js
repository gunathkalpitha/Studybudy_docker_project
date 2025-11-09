const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Room = require('../models/Room')
const Task = require('../models/Task')
const Resource = require('../models/Resource')
const Flashcard = require('../models/Flashcard')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

// simple auth middleware: expects Authorization: Bearer <token>
async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing auth token' })
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId).lean()
    if (!user) return res.status(401).json({ message: 'Invalid token' })
    req.user = user
    next()
  } catch (err) {
    console.error('Auth middleware error', err.message || err)
    return res.status(401).json({ message: 'Authentication failed' })
  }
}

// GET /api/dashboard - returns profile, rooms, tasks, recent resources/flashcards
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user

    // Rooms where user is host or member
    const rooms = await Room.find({ $or: [{ host: user._id }, { members: user._id }] })
      .sort({ createdAt: -1 })
      .lean()

    // Tasks owned by user (limit recent 10)
    const tasks = await Task.find({ owner: user._id }).sort({ createdAt: -1 }).limit(10).lean()

    // Recent resources and flashcards
    const resources = await Resource.find({ owner: user._id }).sort({ createdAt: -1 }).limit(6).lean()
    const flashcards = await Flashcard.find({ owner: user._id }).sort({ createdAt: -1 }).limit(6).lean()

    // map rooms to include participant count
    const mappedRooms = rooms.map(r => ({
      id: r._id,
      title: r.name,
      description: r.description,
      participants: Array.isArray(r.members) ? r.members.length + (r.host ? 1 : 0) : 1,
      lastActive: r.createdAt,
      imageUrl: r.imageUrl || null,
    }))

    res.json({
      user: { id: user._id, email: user.email, displayName: user.displayName, xp: user.xp || 0 },
      rooms: mappedRooms,
      tasks: tasks.map(t => ({ id: t._id, title: t.title, subject: t.subject, dueDate: t.dueDate, completed: t.completed })),
      resources: resources.map(r => ({ id: r._id, title: r.title, url: r.url })),
      flashcards: flashcards.map(f => ({ id: f._id, title: f.title }))
    })
  } catch (err) {
    console.error('Dashboard error', err)
    res.status(500).json({ message: 'Failed to load dashboard data' })
  }
})

module.exports = router

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const flashcardsRoutes = require('./routes/flashcards');
const resourcesRoutes = require('./routes/resources');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ensure uploads directory exists
const fs = require('fs');
const uploadsPath = path.join(__dirname, '..', 'uploads');
try { fs.mkdirSync(uploadsPath, { recursive: true }); } catch (e) { /* ignore */ }

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://3.227.13.241:5173'],
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/api/auth/health', (req, res) => {
  console.log('Health check requested');
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ status: 'healthy', message: 'MongoDB connected' });
  }
  res.status(503).json({ status: 'unhealthy', message: 'MongoDB not connected' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/flashcards', flashcardsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// create HTTP server and attach socket.io for real-time features
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// basic in-memory room state (not persistent) for presence and notepad
const roomState = new Map();
const Room = require('./models/Room')

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('joinRoom', async ({ roomId, user }) => {
    try {
      socket.join(roomId);
      // initialize state from DB if needed
      let state = roomState.get(roomId);
      if (!state) {
        const roomDoc = await Room.findById(roomId).lean().catch(() => null)
        state = { members: {}, notepad: roomDoc?.notepad || '' }
        roomState.set(roomId, state)
      }
      state.members[socket.id] = user || { id: socket.id, name: 'Anonymous' }
      roomState.set(roomId, state)
      // notify current members
      io.to(roomId).emit('presence', Object.values(state.members))
      // send current notepad
      socket.emit('notepad', state.notepad)
      // also send recent messages from DB if present
      const roomDoc = await Room.findById(roomId).lean().catch(() => null)
      if (roomDoc && roomDoc.messages && Array.isArray(roomDoc.messages)) {
        socket.emit('chatHistory', roomDoc.messages.slice(-100))
      }
    } catch (err) {
      console.error('joinRoom handler error', err)
    }
  });

  socket.on('leaveRoom', ({ roomId }) => {
    socket.leave(roomId);
    const state = roomState.get(roomId);
    if (state) {
      delete state.members[socket.id];
      roomState.set(roomId, state);
      io.to(roomId).emit('presence', Object.values(state.members));
    }
  });

  socket.on('notepadUpdate', async ({ roomId, content }) => {
    try {
      const state = roomState.get(roomId) || { members: {}, notepad: '' };
      state.notepad = content;
      roomState.set(roomId, state);
      socket.to(roomId).emit('notepad', content);
      // persist to DB
      await Room.findByIdAndUpdate(roomId, { $set: { notepad: content } }).catch(() => null)
    } catch (err) {
      console.error('notepadUpdate handler error', err)
    }
  });

  socket.on('chatMessage', async ({ roomId, message, from }) => {
    try {
      const payload = { sender: from || socket.id, text: message, ts: new Date() }
      // broadcast
      io.to(roomId).emit('chatMessage', payload)
      // persist to DB
      await Room.findByIdAndUpdate(roomId, { $push: { messages: payload } }).catch(() => null)
    } catch (err) {
      console.error('chatMessage handler error', err)
    }
  });

  // voice chat presence (simple signaling for who enabled mic)
  socket.on('voiceJoin', ({ roomId, user }) => {
    try {
      let state = roomState.get(roomId) || { members: {}, notepad: '', voice: {} };
      state.voice = state.voice || {};
      state.voice[socket.id] = user || { id: socket.id, name: 'Anonymous' };
      roomState.set(roomId, state);
      io.to(roomId).emit('voicePresence', Object.values(state.voice));
    } catch (e) { console.error('voiceJoin error', e) }
  });

  socket.on('voiceLeave', ({ roomId }) => {
    try {
      const state = roomState.get(roomId);
      if (state && state.voice && state.voice[socket.id]) {
        delete state.voice[socket.id];
        roomState.set(roomId, state);
        io.to(roomId).emit('voicePresence', Object.values(state.voice));
      }
    } catch (e) { console.error('voiceLeave error', e) }
  });

  socket.on('disconnect', () => {
    // remove from all rooms tracked
    for (const [roomId, state] of roomState.entries()) {
      if (state.members && state.members[socket.id]) {
        delete state.members[socket.id];
        io.to(roomId).emit('presence', Object.values(state.members));
      }
    }
    console.log('socket disconnected', socket.id);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

// Connect to MongoDB and start server with retry logic
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/auth_db';

const connectWithRetry = (retries = Infinity, delay = 5000) => {
  let attempts = 0;

  const attempt = () => {
    attempts += 1;
    console.log(`Attempting MongoDB connection (attempt ${attempts}) to ${mongoUri}...`);
    mongoose
      .connect(mongoUri, { retryWrites: true, w: 'majority' })
      .then(() => {
        console.log(`Connected to MongoDB successfully (${mongoUri})`);
        server.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });

        server.on('error', (err) => {
          console.error('Server error:', err);
          process.exit(1);
        });
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message || err);
        if (attempts >= retries) {
          console.error('Max MongoDB connection attempts reached. Exiting.');
          process.exit(1);
        }
        console.log(`Retrying in ${delay}ms...`);
        setTimeout(attempt, delay);
      });
  };

  attempt();
};

// retry indefinitely (container will keep trying until Mongo is ready)
connectWithRetry();

// start the HTTP server with socket.io after mongoose connects inside connectWithRetry
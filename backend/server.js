require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
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

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.log('Connected to MongoDB successfully');
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
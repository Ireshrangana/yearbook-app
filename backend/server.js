const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth.routes');
const yearbookRoutes = require('./routes/yearbook.routes');

const app = express();
const uploadsPath = path.join(__dirname, 'uploads');
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

fs.mkdirSync(uploadsPath, { recursive: true });

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsPath));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    mongoReadyState: mongoose.connection.readyState
  });
});

app.get('/', (_req, res) => {
  res.json({
    message: 'Yearbook App backend is running',
    health: '/api/health'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/yearbooks', yearbookRoutes);

app.use((err, _req, res, _next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.message) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Unexpected server error' });
});

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('Server will keep running, but database-backed routes may fail until MongoDB is available.');
  }
};

connectToDatabase().finally(() => {
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
});

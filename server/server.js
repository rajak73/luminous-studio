require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luminosbook';

// Middleware
let allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
if (process.env.CLIENT_URL) {
  const clientUrls = process.env.CLIENT_URL.split(',').map(url => url.trim());
  allowedOrigins = allowedOrigins.concat(clientUrls);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Setup local uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/settings', require('./routes/settings'));

// Upload route
const { upload } = require('./middleware/upload');
const { protect } = require('./middleware/auth');
app.post('/api/upload/image', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  
  if (req.file.path && req.file.path.startsWith('http')) {
    // Cloudinary upload
    return res.json({ url: req.file.path });
  } else {
    // Local upload fallback
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.json({ url: imageUrl });
  }
});

// Health check
app.get('/', (req, res) => res.send('LuminosBook API is running'));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'LuminosBook API running' }));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

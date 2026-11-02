require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const { initDefaultAdmin } = require('./models/userStore');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: true,
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Base API route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'JobTrack API',
    endpoints: {
      signup: 'POST /api/auth/signup',
      userLogin: 'POST /api/auth/login',
      adminLogin: 'POST /api/auth/admin/login',
      logout: 'POST /api/auth/logout',
      currentUser: 'GET /api/auth/me',
      adminOverview: 'GET /api/admin/overview'
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error. Please try again later.'
  });
});

// Start Server and Bootstrap Default Admin
app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`🚀 JobTrack Express Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
  try {
    await initDefaultAdmin();
  } catch (err) {
    console.error('Failed to initialize default admin account:', err);
  }
});

module.exports = app;

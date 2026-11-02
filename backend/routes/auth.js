const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  invalidateToken
} = require('../models/userStore');
const { authenticateToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'jobtrack_super_secret_jwt_key_2026_change_in_production';

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Email validator regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// 1. POST /api/auth/signup (User Registration)
// ==========================================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Field presence checks
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Check duplicate email
    const existing = findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This email address is already registered. Please log in.'
      });
    }

    // Create user (strictly assigns 'user' role)
    const newUser = await createUser({
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: 'user'
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to JobTrack.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
  }
});

// ==========================================
// 2. POST /api/auth/login (User Login)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Role check: Only 'user' role accounts may log in here
    if (user.role !== 'user') {
      if (user.role === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'This is an administrator account. Please log in using the Admin Login page.'
        });
      }
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only job seeker accounts can sign in here.'
      });
    }

    // Verify bcrypt password
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login. Please try again.' });
  }
});

// ==========================================
// 3. POST /api/auth/admin/login (Admin Login)
// ==========================================
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Admin email and password are required.' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    // Role check: Only 'admin' role accounts may log in here
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: This account does not have administrator privileges. Please use User Login.'
      });
    }

    // Verify bcrypt password
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Administrator authentication successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin authentication.' });
  }
});

// ==========================================
// 4. POST /api/auth/logout
// ==========================================
router.post('/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (token) {
    invalidateToken(token);
  }

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// ==========================================
// 5. GET /api/auth/me (Current Authenticated User)
// ==========================================
router.get('/me', authenticateToken, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

module.exports = router;

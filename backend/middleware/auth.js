const jwt = require('jsonwebtoken');
const { isTokenInvalidated } = require('../models/userStore');

const JWT_SECRET = process.env.JWT_SECRET || 'jobtrack_super_secret_jwt_key_2026_change_in_production';

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token missing.'
    });
  }

  // Check if token was invalidated by logout
  if (isTokenInvalidated(token)) {
    return res.status(401).json({
      success: false,
      message: 'Session has ended. Please log in again.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
}

// Middleware to enforce specific role requirement
function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Only accounts with the '${requiredRole}' role can access this resource.`
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin: requireRole('admin'),
  requireUser: requireRole('user')
};

const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../models/userStore');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Protect ALL routes in this router with authenticateToken and requireAdmin
router.use(authenticateToken);
router.use(requireAdmin);

// ==========================================
// GET /api/admin/overview
// Returns system metrics and registered accounts (admin-only)
// ==========================================
router.get('/overview', (req, res) => {
  const allUsers = getAllUsers();
  
  const userCount = allUsers.filter(u => u.role === 'user').length;
  const adminCount = allUsers.filter(u => u.role === 'admin').length;

  // Map users safely without password hashes
  const safeUsers = allUsers.map(({ passwordHash: _, ...user }) => user);

  return res.status(200).json({
    success: true,
    message: 'Administrator metrics retrieved successfully.',
    admin: {
      name: req.user.name,
      email: req.user.email
    },
    metrics: {
      totalAccounts: allUsers.length,
      regularUsers: userCount,
      administrators: adminCount
    },
    accounts: safeUsers
  });
});

module.exports = router;

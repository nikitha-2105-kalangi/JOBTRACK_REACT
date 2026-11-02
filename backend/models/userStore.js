const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory and users.json exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

// In-memory token blacklist for invalidated tokens on logout
const invalidatedTokens = new Set();

function isTokenInvalidated(token) {
  return invalidatedTokens.has(token);
}

function invalidateToken(token) {
  if (token) {
    invalidatedTokens.add(token);
  }
}

// Read all users from persistent JSON file
function getAllUsers() {
  ensureDataFile();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
}

// Save all users to persistent JSON file atomically
function saveUsers(users) {
  ensureDataFile();
  const tempFile = `${USERS_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(users, null, 2), 'utf8');
  fs.renameSync(tempFile, USERS_FILE);
}

// Find user by email (case-insensitive)
function findUserByEmail(email) {
  if (!email) return null;
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
}

// Find user by ID
function findUserById(id) {
  if (!id) return null;
  const users = getAllUsers();
  return users.find((u) => u.id === id) || null;
}

// Create new user (role defaults strictly to 'user' unless explicitly created by seed)
async function createUser({ name, email, password, role = 'user' }) {
  const users = getAllUsers();

  const normalizedEmail = email.trim().toLowerCase();
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  // Hash password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: passwordHash,
    role: role === 'admin' ? 'admin' : 'user', // enforce role safety
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // Return user without passwordHash
  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser;
}

// Verify a user's password using bcrypt
async function verifyPassword(plainPassword, passwordHash) {
  if (!plainPassword || !passwordHash) return false;
  return await bcrypt.compare(plainPassword, passwordHash);
}

// Initialize default administrator account if none exists
async function initDefaultAdmin() {
  ensureDataFile();
  const users = getAllUsers();
  const adminExists = users.some((u) => u.role === 'admin');

  if (!adminExists) {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@jobtrack.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminName = process.env.ADMIN_NAME || 'JobTrack Administrator';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const defaultAdmin = {
      id: 'admin_root_001',
      name: adminName,
      email: adminEmail,
      passwordHash: passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    users.push(defaultAdmin);
    saveUsers(users);
    console.log(`[Admin Seed] Initialized default administrator: ${adminEmail}`);
  }
}

module.exports = {
  getAllUsers,
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  initDefaultAdmin,
  isTokenInvalidated,
  invalidateToken
};

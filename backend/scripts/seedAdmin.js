require('dotenv').config();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

async function seedAdmin() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@jobtrack.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const adminName = process.env.ADMIN_NAME || 'JobTrack Administrator';

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    try {
      users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
    } catch {
      users = [];
    }
  }

  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === adminEmail);
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  if (existingIndex >= 0) {
    users[existingIndex].passwordHash = passwordHash;
    users[existingIndex].role = 'admin';
    users[existingIndex].name = adminName;
    console.log(`[Seed Admin] Updated existing administrator account: ${adminEmail}`);
  } else {
    users.push({
      id: `admin_${Date.now()}`,
      name: adminName,
      email: adminEmail,
      passwordHash: passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    console.log(`[Seed Admin] Created new administrator account: ${adminEmail}`);
  }

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  console.log(`[Seed Admin] Admin credentials set:`);
  console.log(` - Email: ${adminEmail}`);
  console.log(` - Role:  admin`);
  console.log(` - Pass:  (hidden hashed with bcrypt)`);
}

seedAdmin().catch(console.error);

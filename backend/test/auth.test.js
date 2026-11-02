/**
 * JobTrack Backend Authentication Test Suite
 * Tests all 10 required scenarios:
 * 1. A new user can register.
 * 2. Duplicate email registration is rejected.
 * 3. A user can log in with correct credentials.
 * 4. Incorrect user credentials are rejected.
 * 5. An ordinary user cannot log in through Admin Login.
 * 6. An administrator can log in through Admin Login.
 * 7. A user cannot access administrator-only backend routes.
 * 8. Passwords are stored as hashes.
 * 9. Accounts persist in persistent JSON storage.
 * 10. Logout invalidates the authenticated session.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000';
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting JobTrack Authentication Test Suite');
  console.log(`📡 Target API: ${BASE_URL}`);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  const testUser = {
    name: 'Alice Tester',
    email: `alice_${Date.now()}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!'
  };

  const adminUser = {
    email: 'admin@jobtrack.com',
    password: 'Admin@12345'
  };

  let userToken = '';
  let adminToken = '';

  try {
    // ----------------------------------------------------
    // Scenario 1: A new user can register
    // ----------------------------------------------------
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const signupData = await signupRes.json();
    assert(
      signupRes.status === 201 && signupData.success === true && signupData.user.role === 'user',
      'Scenario 1: A new user can register with role "user"',
      JSON.stringify(signupData)
    );

    // ----------------------------------------------------
    // Scenario 2: Duplicate email registration is rejected
    // ----------------------------------------------------
    const duplicateRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const duplicateData = await duplicateRes.json();
    assert(
      duplicateRes.status === 409 && duplicateData.success === false,
      'Scenario 2: Duplicate email registration is rejected with 409 Conflict',
      JSON.stringify(duplicateData)
    );

    // ----------------------------------------------------
    // Scenario 3: A user can log in with correct credentials
    // ----------------------------------------------------
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    const loginData = await loginRes.json();
    userToken = loginData.token;
    assert(
      loginRes.status === 200 && loginData.success === true && Boolean(loginData.token),
      'Scenario 3: A user can log in with correct credentials',
      JSON.stringify(loginData)
    );

    // ----------------------------------------------------
    // Scenario 4: Incorrect user credentials are rejected
    // ----------------------------------------------------
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword999!'
      })
    });
    const badLoginData = await badLoginRes.json();
    assert(
      badLoginRes.status === 401 && badLoginData.success === false,
      'Scenario 4: Incorrect credentials are rejected with 401 Unauthorized',
      JSON.stringify(badLoginData)
    );

    // ----------------------------------------------------
    // Scenario 5: Ordinary user cannot log in through Admin Login
    // ----------------------------------------------------
    const userToAdminRes = await fetch(`${BASE_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    const userToAdminData = await userToAdminRes.json();
    assert(
      userToAdminRes.status === 403 && userToAdminData.success === false,
      'Scenario 5: Ordinary user is rejected on Admin Login with 403 Forbidden',
      JSON.stringify(userToAdminData)
    );

    // ----------------------------------------------------
    // Scenario 6: Administrator can log in through Admin Login
    // ----------------------------------------------------
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminUser)
    });
    const adminLoginData = await adminLoginRes.json();
    adminToken = adminLoginData.token;
    assert(
      adminLoginRes.status === 200 && adminLoginData.success === true && adminLoginData.user.role === 'admin',
      'Scenario 6: Administrator logs in successfully through Admin Login',
      JSON.stringify(adminLoginData)
    );

    // ----------------------------------------------------
    // Scenario 7: A user cannot access administrator-only backend routes
    // ----------------------------------------------------
    const userAccessAdminRouteRes = await fetch(`${BASE_URL}/api/admin/overview`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    const userAccessAdminRouteData = await userAccessAdminRouteRes.json();
    assert(
      userAccessAdminRouteRes.status === 403 && userAccessAdminRouteData.success === false,
      'Scenario 7: Ordinary user blocked from admin-only routes with 403 Forbidden',
      JSON.stringify(userAccessAdminRouteData)
    );

    // Verify admin CAN access the admin-only route
    const adminAccessAdminRouteRes = await fetch(`${BASE_URL}/api/admin/overview`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    assert(
      adminAccessAdminRouteRes.status === 200,
      'Scenario 7 (Verification): Administrator successfully accesses /api/admin/overview'
    );

    // ----------------------------------------------------
    // Scenario 8: Passwords are stored as bcrypt hashes
    // ----------------------------------------------------
    const rawData = fs.readFileSync(USERS_FILE, 'utf8');
    const storedUsers = JSON.parse(rawData);
    const storedUser = storedUsers.find((u) => u.email === testUser.email);
    const isBcryptHash = storedUser && storedUser.passwordHash && storedUser.passwordHash.startsWith('$2');
    const plainTextExposed = rawData.includes(testUser.password);
    assert(
      Boolean(isBcryptHash && !plainTextExposed),
      'Scenario 8: Passwords are encrypted as bcrypt hashes, never plain text',
      `Hash prefix: ${storedUser?.passwordHash?.substring(0, 7)}`
    );

    // ----------------------------------------------------
    // Scenario 9: Accounts persist in persistent JSON storage
    // ----------------------------------------------------
    const persisted = storedUsers.some((u) => u.email === testUser.email);
    assert(
      persisted,
      'Scenario 9: Accounts successfully persisted in data/users.json file'
    );

    // ----------------------------------------------------
    // Scenario 10: Logout invalidates the authenticated session
    // ----------------------------------------------------
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    const logoutData = await logoutRes.json();

    // Now try accessing /api/auth/me with the invalidated userToken
    const meAfterLogoutRes = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    assert(
      logoutRes.status === 200 && meAfterLogoutRes.status === 401,
      'Scenario 10: Logout successfully invalidates token; subsequent requests rejected with 401',
      `Logout: ${logoutRes.status}, Me after logout: ${meAfterLogoutRes.status}`
    );

  } catch (err) {
    console.error('Test execution error (ensure backend server is running on port 5000):', err.message);
  }

  console.log('\n====================================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');
}

runTests();

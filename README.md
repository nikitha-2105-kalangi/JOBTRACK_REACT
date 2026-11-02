# JobTrack — Job Application Tracker
> Full-Stack Job Application Tracker with Separate User & Admin Authentication

JobTrack is a modern web application designed to help job seekers organize their career journey, track applications, prepare for interviews, and monitor responses. This phase delivers a secure, production-ready authentication architecture with separate, server-verified portals for **Job Seekers (Users)** and **Platform Administrators (Admins)**.

---

## 1. Technologies Used

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM (v6)
- **Backend**: Node.js & Express
- **API Communication**: Native Fetch API
- **Password Hashing**: `bcryptjs` (10 salt rounds)
- **Authentication**: Server-side JSON Web Token (JWT) verification with role-based access control and token invalidation on logout
- **Account Storage**: Persistent JSON storage (`backend/data/users.json`) with atomic file writes
- **Styling**: Pure, responsive CSS using Flexbox, CSS Grid, and the JobTrack design system
- **Version Control**: Git & GitHub

---

## 2. Project Folder Structure

The project maintains a clean separation of concerns between frontend and backend while preserving original static files:

```
JOBTRACK/
├── backend/                        # Node.js & Express Backend Server
│   ├── data/
│   │   └── users.json              # Local persistent account storage (excluded by .gitignore)
│   ├── middleware/
│   │   └── auth.js                 # JWT verification & role authorization (requireUser, requireAdmin)
│   ├── models/
│   │   └── userStore.js            # User data layer, bcrypt hashing, and admin auto-seed
│   ├── routes/
│   │   ├── auth.js                 # Authentication endpoints (/signup, /login, /admin/login, /logout, /me)
│   │   └── admin.js                # Protected administrator-only test endpoint (/overview)
│   ├── scripts/
│   │   └── seedAdmin.js            # Standalone CLI script to seed or reset administrator
│   ├── test/
│   │   └── auth.test.js            # Automated test suite covering all 10 core backend scenarios
│   ├── .env                        # Local backend environment configuration
│   ├── .env.example                # Safe environment variable template
│   ├── .gitignore                  # Backend git exclusion rules
│   ├── package.json                # Backend dependencies and scripts
│   └── server.js                   # Express application entrypoint
├── frontend/                       # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx  # Route guard enforcing authentication and role permissions
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Authentication state, session restoration, and token storage
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Dual-portal landing page (User Login vs. Admin Login)
│   │   │   ├── UserLoginPage.jsx   # Dedicated User Login page (role: "user" only)
│   │   │   ├── UserSignupPage.jsx  # User Registration (strictly assigns role: "user")
│   │   │   ├── AdminLoginPage.jsx  # Dedicated Admin Login page (role: "admin" only)
│   │   │   ├── UserDashboardPlaceholder.jsx   # Authenticated User dashboard placeholder
│   │   │   └── AdminDashboardPlaceholder.jsx  # Authenticated Admin control center placeholder
│   │   ├── App.jsx                 # Route configurations
│   │   ├── index.css               # Unified JobTrack CSS design system & responsive styling
│   │   └── main.jsx                # React application bootstrap
│   ├── index.html                  # HTML template with JobTrack icon and branding
│   ├── package.json                # Frontend dependencies and build scripts
│   └── vite.config.js              # Vite configuration with /api development proxy to port 5000
├── .env.example                    # Root environment documentation
├── .gitignore                      # Root Git configuration (protects .env, node_modules, users.json)
├── package.json                    # Root convenience workspace scripts
└── README.md                       # Comprehensive project documentation
```

---

## 3. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Modern Web Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari

---

## 4. Installation & Setup

### Step 1: Install Backend Dependencies

Open a terminal in the project root:

```powershell
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

In a second terminal:

```powershell
cd frontend
npm install
```

---

## 5. Commands to Run (VS Code on Windows)

Run the backend and frontend simultaneously using two separate terminals in VS Code:

### Terminal 1: Backend Server (Port 5000)

```powershell
cd "C:\Users\HP\Desktop\SECOND YEAR\Frontend_21\JOBTRACK\backend"
npm start
```

*Expected Terminal Output:*
```text
===============================================
🚀 JobTrack Express Server running on port 5000
📡 URL: http://localhost:5000
===============================================
[Admin Seed] Initialized default administrator: admin@jobtrack.com
```

### Terminal 2: Frontend Client (Port 5173)

```powershell
cd "C:\Users\HP\Desktop\SECOND YEAR\Frontend_21\JOBTRACK\frontend"
npm run dev
```

*Expected Terminal Output:*
```text
  VITE v5.3.1  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and visit: **`http://localhost:5173`**

---

## 6. Frontend Routes & URLs

| Route | Page | Purpose |
| :--- | :--- | :--- |
| **`http://localhost:5173/`** | **Landing Page** | Overview of JobTrack with distinct buttons for **User Login** and **Admin Login**. |
| **`http://localhost:5173/signup`** | **User Signup** | Registration for job seekers (assigns `role: "user"` automatically). |
| **`http://localhost:5173/login`** | **User Login** | Login for job seekers (`role: "user"` only). |
| **`http://localhost:5173/admin/login`** | **Admin Login** | Restricted portal for administrators (`role: "admin"` only). |
| **`http://localhost:5173/dashboard`** | **User Dashboard** | Protected placeholder confirming authenticated user access. |
| **`http://localhost:5173/admin/dashboard`** | **Admin Dashboard** | Protected placeholder confirming admin access and interactive query test. |

---

## 7. Backend API Endpoints

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Registers a new account with `role: "user"`. Validates fields, checks duplicates, and hashes password with bcrypt. |
| `POST` | `/api/auth/login` | Public | Authenticates standard job seekers (`role: "user"` only). Rejects admin accounts with instructions to use Admin Login. |
| `POST` | `/api/auth/admin/login` | Public | Authenticates platform administrators (`role: "admin"` only). Rejects standard users with `403 Forbidden`. |
| `POST` | `/api/auth/logout` | Authenticated | Server-side token invalidation; client clears stored token. |
| `GET` | `/api/auth/me` | Authenticated | Returns current profile (`id`, `name`, `email`, `role`). Safe from password exposure. |
| `GET` | `/api/admin/overview` | Admin Only | Protected administrative endpoint verifying role check (returns user counts and system status). |

---

## 8. Initializing the Administrator Account

The first administrator is initialized securely using backend environment variables:

### Default Initial Credentials:
- **Email**: `admin@jobtrack.com`
- **Password**: `Admin@12345`
- **Role**: `admin`

### Security Safeguards:
1. **Automatic Initialization**: On server startup, `server.js` checks if an administrator exists. If not, it creates one with a bcrypt-hashed password using credentials in `backend/.env`.
2. **Custom Admin Credentials**: Edit `backend/.env`:
   ```env
   ADMIN_EMAIL=mycustomadmin@company.com
   ADMIN_PASSWORD=MySecurePassword!99
   ADMIN_NAME=Platform Lead Admin
   ```
3. **Manual Seed / Reset Script**: To re-seed or update admin credentials at any time:
   ```powershell
   cd backend
   npm run seed
   ```
4. **No Secrets in Frontend**: Admin credentials and secrets are never committed to Git or exposed in client bundles.

---

## 9. Testing & Verification

### Running the Automated Test Suite

With the backend running on port 5000, execute:

```powershell
cd backend
npm test
```

The automated script tests:
1. New user registration with `role: "user"`.
2. Duplicate email registration rejection (HTTP 409).
3. Valid user credentials login (HTTP 200).
4. Invalid credentials rejection (HTTP 401).
5. User rejection on Admin Login (HTTP 403).
6. Administrator login through Admin Login (HTTP 200).
7. Regular user rejection on admin-only route `/api/admin/overview` (HTTP 403).
8. Passwords stored strictly as bcrypt hashes (`$2a$...`).
9. Persistence in `backend/data/users.json`.
10. Token invalidation upon logout (subsequent request returns HTTP 401).

### Manual Test Checklist

1. **Landing Page**: Navigate to `http://localhost:5173/`. Verify clear options for User Login, Admin Login, and Create Account.
2. **User Signup**: Go to `/signup`. Fill in name, email, password, and confirm password. Click "Sign Up". Verify successful redirection to `/dashboard`.
3. **Password Toggle**: Click the eye icon next to password fields to verify visibility toggle.
4. **Duplicate Email**: Try to sign up again with the exact same email. Verify that an alert banner appears: *"This email address is already registered. Please log in."*
5. **User Login**: Go to `/login`. Sign in with your registered user credentials. Verify redirection to `/dashboard`.
6. **Cross-Role Protection (User -> Admin)**: Go to `/admin/login`. Enter the regular user's email and password. Verify rejection with: *"Access denied: This account does not have administrator privileges. Please use User Login."*
7. **Cross-Role Protection (Admin -> User)**: Go to `/login`. Enter `admin@jobtrack.com` and `Admin@12345`. Verify rejection with: *"This is an administrator account. Please log in using the Admin Login page."*
8. **Admin Login**: Go to `/admin/login`. Enter `admin@jobtrack.com` and `Admin@12345`. Verify redirection to `/admin/dashboard`.
9. **Admin Route Verification**: On `/admin/dashboard`, click **"Run Admin Verification Query"**. Verify that live account statistics are returned.
10. **Protected Route Enforcing**: Log out. Try to manually type `http://localhost:5173/dashboard` or `http://localhost:5173/admin/dashboard` in the browser URL bar. Verify that unauthenticated visitors are immediately redirected to `/login` or `/admin/login`.
11. **State Persistence on Page Refresh**: Log in to `/dashboard` and press `F5` / Refresh. Verify you remain logged in and your user name is preserved without getting logged out.
12. **Logout**: Click **Logout**. Verify stored token is cleared and session is invalidated.

---

## 10. Git Setup & GitHub Push Commands

The repository is configured with a strict `.gitignore` to prevent committing sensitive files, `.env` configs, and real user data (`backend/data/users.json`).

Follow these commands to commit your work and push to GitHub:

### 1. Initialize Git (if not already initialized)
```powershell
cd "C:\Users\HP\Desktop\SECOND YEAR\Frontend_21\JOBTRACK"
git init
```

### 2. Verify Ignored Files
```powershell
# Ensure node_modules, .env, and backend/data/users.json are NOT listed as untracked
git status
```

### 3. Stage and Commit Project Files
```powershell
git add .
git commit -m "feat: complete separate user and admin authentication architecture"
```

### 4. Connect to Your GitHub Repository
Replace `<YOUR_GITHUB_REPO_URL>` with your actual repository URL:
```powershell
# Set main branch
git branch -M main

# Add your GitHub remote (if not already set)
git remote add origin <YOUR_GITHUB_REPO_URL>

# Push to GitHub
git push -u origin main
```

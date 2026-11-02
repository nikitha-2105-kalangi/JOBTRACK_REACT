import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserDashboardPlaceholder() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="placeholder-page">
      {/* Top Header */}
      <header className="placeholder-header">
        <div className="header-brand">
          <div className="brand-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="7" width="20" height="14" rx="3" />
              <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
            </svg>
          </div>
          <span className="brand-title">JobTrack</span>
        </div>

        <div className="header-user-info">
          <span className="role-badge user">Role: {user?.role || 'user'}</span>
          <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#334155' }}>
            {user?.name || 'User'}
          </span>
          <button onClick={handleLogout} className="logout-btn" type="button">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="placeholder-main">
        <div className="dashboard-hero-card">
          <h1>Welcome, {user?.name || 'User'}! 👋</h1>
          <p className="sub">
            You have successfully logged in to the <strong>JobTrack User Portal</strong>.
          </p>

          <div className="status-callout">
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <div>
              <strong>Authenticated via Node.js Express Backend</strong>
              <p style={{ margin: '4px 0 0', fontSize: '13.5px', opacity: 0.9 }}>
                Your session is secured using server-side token authentication with passwords hashed via bcrypt.
              </p>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">Account Name</div>
              <div className="detail-value">{user?.name}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Email Address</div>
              <div className="detail-value">{user?.email}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Assigned Role</div>
              <div className="detail-value" style={{ color: '#2563eb' }}>
                {user?.role?.toUpperCase()}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">User ID</div>
              <div className="detail-value" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                {user?.id}
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '8px' }}>
              📌 Phase 1 Authentication Scope Completed
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
              Signup and separate User/Admin authentication are fully operational. Job application tracking, interviews, analytics, and settings will be integrated into this dashboard in the next development phase as specified.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

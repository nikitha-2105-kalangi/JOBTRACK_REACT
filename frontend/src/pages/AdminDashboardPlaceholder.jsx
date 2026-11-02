import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPlaceholder() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const fetchAdminOverview = async () => {
    setLoadingMetrics(true);
    setMetricsError('');
    try {
      const response = await fetch('/api/admin/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch admin metrics');
      }
      setMetrics(data);
    } catch (err) {
      setMetricsError(err.message);
    } finally {
      setLoadingMetrics(false);
    }
  };

  return (
    <div className="placeholder-page">
      {/* Top Header */}
      <header className="placeholder-header" style={{ borderBottomColor: '#e0e7ff' }}>
        <div className="header-brand">
          <div className="brand-icon-box admin">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="brand-title">JobTrack <span style={{ color: '#4f46e5', fontSize: '15px' }}>Admin Portal</span></span>
        </div>

        <div className="header-user-info">
          <span className="role-badge admin">Role: {user?.role || 'admin'}</span>
          <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#334155' }}>
            {user?.name || 'Administrator'}
          </span>
          <button onClick={handleLogout} className="logout-btn" type="button">
            Admin Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="placeholder-main">
        <div className="dashboard-hero-card">
          <h1>Administrator Control Center 🛡️</h1>
          <p className="sub">
            Logged in as <strong>{user?.name}</strong> with privileged system administrator rights.
          </p>

          <div className="status-callout admin">
            <span style={{ fontSize: '20px' }}>⚡</span>
            <div>
              <strong>Protected Administrator Environment</strong>
              <p style={{ margin: '4px 0 0', fontSize: '13.5px', opacity: 0.9 }}>
                Only accounts with verified <code>role: "admin"</code> can access this console and its protected backend endpoints.
              </p>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">Admin Name</div>
              <div className="detail-value">{user?.name}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Email Address</div>
              <div className="detail-value">{user?.email}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Privilege Level</div>
              <div className="detail-value" style={{ color: '#6d28d9' }}>
                ADMINISTRATOR
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Security ID</div>
              <div className="detail-value" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                {user?.id}
              </div>
            </div>
          </div>

          <div className="admin-action-section">
            <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '8px' }}>
              Verify Administrator-Only Route: <code>GET /api/admin/overview</code>
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              Click below to query the protected admin route. Standard users attempting to query this endpoint receive a <code>403 Forbidden</code> response.
            </p>

            <button
              onClick={fetchAdminOverview}
              className="action-btn"
              disabled={loadingMetrics}
              type="button"
            >
              {loadingMetrics ? 'Querying Backend...' : 'Run Admin Verification Query'}
            </button>

            {metricsError && (
              <div className="alert-box error" style={{ marginTop: '16px' }}>
                <span>⚠️ {metricsError}</span>
              </div>
            )}

            {metrics && (
              <div style={{ marginTop: '20px', background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <h4 style={{ fontSize: '14px', color: '#166534', marginBottom: '10px' }}>
                  ✅ Endpoint Response: 200 OK (Verified Admin Access)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>{metrics.metrics.totalAccounts}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Total Accounts</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a' }}>{metrics.metrics.regularUsers}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Regular Users</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#9333ea' }}>{metrics.metrics.administrators}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Admins</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

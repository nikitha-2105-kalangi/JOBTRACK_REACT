import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!formData.email.trim() || !formData.password) {
      setServerError('Please enter administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await adminLogin(formData.email, formData.password);
      setSuccessMessage(result.message || 'Admin authentication successful! Redirecting...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (err) {
      setServerError(err.message || 'Admin login failed. Access denied.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-container">
      {/* Left Branding Side (Admin Dark Purple / Indigo Theme) */}
      <section className="auth-image admin-theme">
        <div className="auth-image-content">
          <div className="brand-badge" style={{ background: 'rgba(99, 102, 241, 0.25)', borderColor: 'rgba(165, 180, 252, 0.3)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Admin Control Center</span>
          </div>

          <h1>System Administration</h1>
          <p>
            Secure, restricted management portal for JobTrack platform administrators and system operators.
          </p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🛡️</div>
              <span>Strict role-based authorization check</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🔒</div>
              <span>Server-side verification against privilege escalation</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">⚡</div>
              <span>Protected administrator-only API endpoints</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Form Side */}
      <section className="auth-form admin-theme-form">
        <div className="auth-form-card">
          <Link to="/" className="back-home-link">
            &larr; Back to Portal Selection
          </Link>

          <div className="auth-form-header">
            <div className="admin-portal-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Restricted Access</span>
            </div>
            <h2>Admin Login</h2>
            <p className="subtitle">Enter your administrator credentials to continue</p>
          </div>

          {serverError && (
            <div className="alert-box error" role="alert">
              <span>⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          {successMessage && (
            <div className="alert-box success" role="alert">
              <span>✅</span>
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="adminEmail">Administrator Email</label>
              <input
                type="email"
                id="adminEmail"
                name="email"
                placeholder="admin@jobtrack.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="adminPassword">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="adminPassword"
                  name="password"
                  placeholder="Enter administrator password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn admin-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Authenticating Admin...</span>
                </>
              ) : (
                <span>Access Admin Portal</span>
              )}
            </button>
          </form>

          <p className="switch-page" style={{ marginTop: '20px', fontSize: '13.5px' }}>
            Looking for regular user login?{' '}
            <Link to="/login">Go to User Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

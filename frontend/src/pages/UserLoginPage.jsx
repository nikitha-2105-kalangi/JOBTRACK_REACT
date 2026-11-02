import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
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
      setServerError('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(formData.email, formData.password);
      setSuccessMessage(result.message || 'Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-container">
      {/* Left Branding Side */}
      <section className="auth-image">
        <div className="auth-image-content">
          <h1>Welcome Back!</h1>
          <p>
            Log in to your JobTrack account to manage active applications, track scheduled interviews, and monitor employer follow-ups.
          </p>
          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span>Job Seeker portal access</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span>Secure server-side token authentication</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span>Persistent cloud-ready account storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Form Side */}
      <section className="auth-form">
        <div className="auth-form-card">
          <Link to="/" className="back-home-link">
            &larr; Back to Portal Selection
          </Link>

          <div className="auth-form-header">
            <h2>User Login</h2>
            <p className="subtitle">Sign in to your JobTrack account</p>
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
              <label htmlFor="loginEmail">Email Address</label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="loginPassword">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="loginPassword"
                  name="password"
                  placeholder="Enter your password"
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

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          <p className="switch-page">
            Don't have an account? <Link to="/signup">Create Account</Link>
          </p>

          <p className="switch-page" style={{ marginTop: '12px', fontSize: '13px' }}>
            Are you an administrator?{' '}
            <Link to="/admin/login" style={{ color: '#4f46e5' }}>
              Switch to Admin Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

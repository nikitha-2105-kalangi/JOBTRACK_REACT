import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserSignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time error clearing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirming your password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

      setSuccessMessage(result.message || 'Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      setServerError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-container">
      {/* Left Branding Side */}
      <section className="auth-image">
        <div className="auth-image-content">
          <h1>Start Your Journey</h1>
          <p>
            Create your JobTrack account and organize your job search in one place. Keep track of every interview, application date, and employer response.
          </p>
          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span>Automatic standard User role assignment</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span>bcrypt 10-round salted password hashing</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span>Seamless application and interview tracking</span>
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
            <h2>Create Account</h2>
            <p className="subtitle">Join JobTrack today</p>
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
            {/* Full Name */}
            <div className="form-field">
              <label htmlFor="signupName">Full Name</label>
              <input
                type="text"
                id="signupName"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Email Address */}
            <div className="form-field">
              <label htmlFor="signupEmail">Email Address</label>
              <input
                type="email"
                id="signupEmail"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-field">
              <label htmlFor="signupPassword">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="signupPassword"
                  name="password"
                  placeholder="Create a password (min 6 characters)"
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
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          <p className="switch-page">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

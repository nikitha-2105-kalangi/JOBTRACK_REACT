import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="auth-container">
      {/* Left Branding Side */}
      <section className="auth-image">
        <div className="auth-image-content">
          <div className="brand-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="7" width="20" height="14" rx="3" />
              <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
            </svg>
            <span>JobTrack Platform</span>
          </div>

          <h1>Organize Your Career Journey</h1>
          <p>
            Track every job application, stay prepared for upcoming interviews, and streamline your entire job search workflow in one unified dashboard.
          </p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span>Separate secure portals for Job Seekers & Administrators</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span>End-to-end encrypted authentication with bcrypt & JWT</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span>Automated role-based access control</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Option Cards Side */}
      <section className="auth-form">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>Welcome to JobTrack</h2>
            <p className="subtitle">
              Select your portal below to sign in or get started.
            </p>
          </div>

          <div className="portal-selection-grid">
            {/* 1. User Login Option */}
            <Link to="/login" className="portal-card">
              <div className="portal-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="portal-info">
                <h3>User Login</h3>
                <p>For job seekers tracking applications, interviews, and progress.</p>
              </div>
              <span className="portal-arrow">&rarr;</span>
            </Link>

            {/* 2. Admin Login Option */}
            <Link to="/admin/login" className="portal-card admin">
              <div className="portal-icon-box admin">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="portal-info">
                <h3>Admin Login</h3>
                <p>For platform administrators managing accounts and security.</p>
              </div>
              <span className="portal-arrow">&rarr;</span>
            </Link>
          </div>

          <p className="switch-page">
            Don't have an account?{' '}
            <Link to="/signup">Create Account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

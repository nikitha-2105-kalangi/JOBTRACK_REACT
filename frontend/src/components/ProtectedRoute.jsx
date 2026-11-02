import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = ['user', 'admin'] }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontWeight: 500 }}>
          <div className="spinner" style={{ borderColor: '#cbd5e1', borderTopColor: '#2563eb' }}></div>
          <span>Verifying authentication...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If route requires admin, redirect to admin login, otherwise standard user login
    const redirectPath = allowedRoles.includes('admin') && !allowedRoles.includes('user')
      ? '/admin/login'
      : '/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Authenticated but wrong role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

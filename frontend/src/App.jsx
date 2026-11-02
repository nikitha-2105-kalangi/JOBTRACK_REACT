import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserLoginPage from './pages/UserLoginPage';
import UserSignupPage from './pages/UserSignupPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserDashboardPlaceholder from './pages/UserDashboardPlaceholder';
import AdminDashboardPlaceholder from './pages/AdminDashboardPlaceholder';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public Landing and Auth Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/signup" element={<UserSignupPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected User Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboardPlaceholder />
          </ProtectedRoute>
        }
      />

      {/* Protected Administrator Dashboard Route */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPlaceholder />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

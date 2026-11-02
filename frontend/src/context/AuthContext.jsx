import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('jobtrack_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount or token change
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('jobtrack_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem('jobtrack_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session verification error:', err);
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [token]);

  // User Signup
  const signup = async (name, email, password, confirmPassword) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    if (data.token) {
      localStorage.setItem('jobtrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // User Login
  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('jobtrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // Administrator Login
  const adminLogin = async (email, password) => {
    const response = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Admin login failed');
    }

    if (data.token) {
      localStorage.setItem('jobtrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // Logout
  const logout = async () => {
    const currentToken = localStorage.getItem('jobtrack_token');
    try {
      if (currentToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
          },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('jobtrack_token');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    loading,
    signup,
    login,
    adminLogin,
    logout,
    isAuthenticated: Boolean(user && token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

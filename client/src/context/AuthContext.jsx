import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, loginUser, registerUser, logoutUser } from '../api/auth';
import { getProfile, updateProfile } from '../api/profile';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fitmate_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('fitmate_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore authenticated session on load/refresh
  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem('fitmate_token');
    if (!savedToken) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const [meRes, profileRes] = await Promise.all([
        getMe(),
        getProfile().catch(() => ({ data: null })),
      ]);

      if (meRes?.user) {
        setUser(meRes.user);
        localStorage.setItem('fitmate_user', JSON.stringify(meRes.user));
      }

      if (profileRes?.data) {
        setProfile(profileRes.data);
      }
    } catch (err) {
      console.warn('Session verification failed, logging out:', err?.message);
      localStorage.removeItem('fitmate_token');
      localStorage.removeItem('fitmate_user');
      setUser(null);
      setProfile(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginUser({ email, password });
      if (data.token) {
        localStorage.setItem('fitmate_token', data.token);
        setToken(data.token);
      }
      if (data.user) {
        localStorage.setItem('fitmate_user', JSON.stringify(data.user));
        setUser(data.user);
      }
      // Fetch profile
      try {
        const pRes = await getProfile();
        setProfile(pRes.data);
      } catch (pErr) {
        // Ignored
      }
      return data;
    } catch (err) {
      let msg = err.response?.data?.message;
      if (!msg) {
        if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
          msg = 'Unable to connect to the backend server. Please ensure the server is running on port 5000.';
        } else {
          msg = err.message || 'Login failed. Please check credentials.';
        }
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  // Register handler
  const register = async (formData) => {
    setError(null);
    try {
      const data = await registerUser(formData);
      if (data.token) {
        localStorage.setItem('fitmate_token', data.token);
        setToken(data.token);
      }
      if (data.user) {
        localStorage.setItem('fitmate_user', JSON.stringify(data.user));
        setUser(data.user);
      }
      try {
        const pRes = await getProfile();
        setProfile(pRes.data);
      } catch (pErr) {
        // Ignored
      }
      return data;
    } catch (err) {
      let msg = err.response?.data?.message;
      if (!msg) {
        if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
          msg = 'Unable to connect to the backend server. Please ensure the server is running on port 5000.';
        } else {
          msg = err.message || 'Registration failed.';
        }
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await logoutUser().catch(() => {});
    } finally {
      localStorage.removeItem('fitmate_token');
      localStorage.removeItem('fitmate_user');
      setUser(null);
      setProfile(null);
      setToken(null);
    }
  };

  // Update profile
  const updateUserProfile = async (profileData) => {
    const res = await updateProfile(profileData);
    if (res?.data) {
      setProfile(res.data);
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('fitmate_user', JSON.stringify(res.data.user));
      }
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        error,
        isAuthenticated: Boolean(user && token),
        isProfileComplete: Boolean(profile?.height && profile?.currentWeight),
        login,
        register,
        logout,
        updateUserProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

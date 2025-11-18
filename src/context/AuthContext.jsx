import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    console.log('🔍 Checking stored auth:', { hasToken: !!storedToken, hasUser: !!storedUser });

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      console.log('✅ Restored auth from localStorage');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('📡 Sending login request to API...');
      const response = await authAPI.login(email, password);
      console.log('📦 API response:', response);

      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      console.log('✅ Login successful, auth state updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error details:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || 'Login fehlgeschlagen',
      };
    }
  };

  const register = async (email, password, firstName, lastName, company) => {
    try {
      console.log('📡 Sending registration request to API...');
      const response = await authAPI.register(email, password, firstName, lastName, company);
      console.log('📦 API response:', response);

      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      console.log('✅ Registration successful, auth state updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('Error details:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || 'Registrierung fehlgeschlagen',
      };
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('workshopData'); // Clear any local workshop data
  };

  const updateProfile = async (firstName, lastName, company) => {
    try {
      const response = await authAPI.updateProfile(firstName, lastName, company);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Profilaktualisierung fehlgeschlagen',
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
  };

  console.log('🔐 Auth state:', { isAuthenticated: !!token, hasUser: !!user, loading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

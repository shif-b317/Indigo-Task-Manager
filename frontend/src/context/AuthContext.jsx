import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { initiateSocketConnection, disconnectSocket } from '../services/socket';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        initiateSocketConnection(parsedUser._id);
      } catch (error) {
        console.error('Failed to parse user from local storage:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data.data;
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      initiateSocketConnection(data._id);
      showToast('Welcome back! Logged in successfully.', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const data = response.data.data;
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      initiateSocketConnection(data._id);
      showToast('Registration complete! Welcome aboard.', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Signup failed. Please try again.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    disconnectSocket();
    showToast('Logged out successfully.', 'info');
  };

  const updateProfileState = (updatedData) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const newUser = { ...currentUser, ...updatedData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfileState }}>
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

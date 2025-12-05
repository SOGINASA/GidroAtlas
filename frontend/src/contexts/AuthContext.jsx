import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hydroatlasAuthToken');
    const role = localStorage.getItem('hydroatlasUserRole');
    
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUser({ token, role });
    }
    setLoading(false);
  }, []);

  const login = (userData, role) => {
    localStorage.setItem('hydroatlasAuthToken', userData.token);
    localStorage.setItem('hydroatlasUserRole', role);
    setUser(userData);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('hydroatlasAuthToken');
    localStorage.removeItem('hydroatlasUserRole');
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    userRole,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './components/api/AuthUtils';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import EmergencyDashboard from './pages/emergency/EmergencyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/citizen/dashboard" element={
            <ProtectedRoute allowedTypes={['user','resident']}>
              <CitizenDashboard />
            </ProtectedRoute>
          } />

          <Route path="/emergency/control-center" element={
            <ProtectedRoute allowedTypes={['mchs','emergency']}>
              <EmergencyDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/overview" element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
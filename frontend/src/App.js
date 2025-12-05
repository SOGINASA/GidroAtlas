import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/auth/RequireAuth';

// Styles
import './styles/animations.css';

// Public pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Guest pages
// import GuestMap from './pages/guest/GuestMap';
// import GuestWaterBodies from './pages/guest/GuestWaterBodies';
// import GuestFacilities from './pages/guest/GuestFacilities';

// Expert pages
// import ExpertDashboard from './pages/expert/ExpertDashboard';
// import ExpertMap from './pages/expert/ExpertMap';

// Emergency pages
// import EmergencyDashboard from './pages/emergency/EmergencyDashboard';

// Admin pages
// import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Маршруты гостя (без авторизации) */}
          <Route path="/guest/map" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-3xl">Guest Map - В разработке</h1></div>} />
          <Route path="/guest/waterbodies" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-3xl">Guest Water Bodies - В разработке</h1></div>} />
          <Route path="/guest/facilities" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-3xl">Guest Facilities - В разработке</h1></div>} />

          {/* Защищённые маршруты для экспертов */}
          <Route element={<RequireAuth allowedRoles={['expert']} />}>
            <Route path="/expert/dashboard" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-3xl">Expert Dashboard - В разработке</h1></div>} />
            <Route path="/expert/map" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-3xl">Expert Map - В разработке</h1></div>} />
          </Route>

          {/* Защищённые маршруты для МЧС */}
          <Route element={<RequireAuth allowedRoles={['emergency']} />}>
            <Route path="/emergency/control-center" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-3xl">Emergency Control Center - В разработке</h1></div>} />
            <Route path="/emergency/map" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-3xl">Emergency Map - В разработке</h1></div>} />
          </Route>

          {/* Защищённые маршруты для админов */}
          <Route element={<RequireAuth allowedRoles={['admin']} />}>
            <Route path="/admin/overview" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-3xl">Admin Overview - В разработке</h1></div>} />
            <Route path="/admin/users" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-3xl">Users Management - В разработке</h1></div>} />
          </Route>

          {/* 404 */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
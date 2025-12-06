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

// Guest pages (В разработке)
// import GuestMap from './pages/guest/GuestMap';
// import GuestWaterBodies from './pages/guest/GuestWaterBodies';
// import GuestFacilities from './pages/guest/GuestFacilities';

// Expert pages
import ExpertDashboard from './pages/expert/ExpertDashboard';
import ExpertMapPage from './pages/expert/ExpertMapPage';
import ExpertWaterBodiesPage from './pages/expert/WaterBodiesPage';
import ExpertFacilitiesPage from './pages/expert/FacilitiesPage';
import ExpertPrioritizationPage from './pages/expert/PrioritizationPage';
import ExpertPredictionsPage from './pages/expert/ExpertPredictionsPage';
import ExpertAnalyticsPage from './pages/expert/AnalyticsPage';
import ExpertNotificationsPage from './pages/expert/ExpertNotificationsPage';
import ExpertProfilePage from './pages/expert/ExpertProfilePage';

// Emergency pages
import EmergencyDashboard from './pages/emergency/EmergencyDashboard';
import EmergencyWaterBodies from './pages/emergency/WaterBodiesManagement';
import EmergencyFacilities from './pages/emergency/FacilitiesManagement';
import EmergencyCriticalZones from './pages/emergency/CriticalZonesPage';
import EmergencyAnalytics from './pages/emergency/AnalyticsPage';
import EmergencyReports from './pages/emergency/ReportsPage';
import EmergencyPrioritization from './pages/emergency/PrioritizationPage';
import EmergencyMap from './pages/emergency/EmergencyMap';
import EmergencyPredictions from './pages/emergency/PredictionsPage';
import EmergencyNotifications from './pages/emergency/NotificationsManagement';
import EmergencyProfile from './pages/emergency/ProfilePage';

// Admin pages (В разработке)
// import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
            <Route path="/expert/dashboard" element={<ExpertDashboard />} />
            <Route path="/expert/map" element={<ExpertMapPage />} />
            <Route path="/expert/waterbodies" element={<ExpertWaterBodiesPage />} />
            <Route path="/expert/facilities" element={<ExpertFacilitiesPage />} />
            <Route path="/expert/prioritization" element={<ExpertPrioritizationPage />} />
            <Route path="/expert/predictions" element={<ExpertPredictionsPage />} />
            <Route path="/expert/analytics" element={<ExpertAnalyticsPage />} />
            <Route path="/expert/notifications" element={<ExpertNotificationsPage />} />
            <Route path="/expert/profile" element={<ExpertProfilePage />} />
          </Route>

          {/* Защищённые маршруты для МЧС */}
          <Route element={<RequireAuth allowedRoles={['emergency']} />}>
            <Route path="/emergency/control-center" element={<EmergencyDashboard />} />
            <Route path="/emergency/map" element={<EmergencyMap />} />
            <Route path="/emergency/waterbodies" element={<EmergencyWaterBodies />} />
            <Route path="/emergency/facilities" element={<EmergencyFacilities />} />
            <Route path="/emergency/predictions" element={<EmergencyPredictions />} />
            <Route path="/emergency/critical-zones" element={<EmergencyCriticalZones />} />
            <Route path="/emergency/prioritization" element={<EmergencyPrioritization />} />
            <Route path="/emergency/analytics" element={<EmergencyAnalytics />} />
            <Route path="/emergency/notifications" element={<EmergencyNotifications />} />
            <Route path="/emergency/reports" element={<EmergencyReports />} />
            <Route path="/emergency/profile" element={<EmergencyProfile />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
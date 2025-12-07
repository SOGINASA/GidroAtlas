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
import GuestMap from './pages/guest/GuestMap';
import GuestWaterBodies from './pages/guest/GuestWaterBodies';
import GuestFacilities from './pages/guest/GuestFacilities';
import GuestAboutPage from './pages/guest/GuestAboutPage';
import GuestNotificationsPage from './pages/guest/GuestNotificationsPage';

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

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersManagement from './pages/admin/UsersManagement';
import AdminWaterBodiesManagement from './pages/admin/WaterBodiesManagement';
import AdminFacilitiesManagement from './pages/admin/FacilitiesManagement';
import AdminMap from './pages/admin/AdminMap';
import AdminAISettings from './pages/admin/AISettings';
import AdminSensorsManagement from './pages/admin/SensorsManagement';
import AdminPrioritizationPage from './pages/admin/PrioritizationPage';
import AdminNotificationsSettings from './pages/admin/NotificationsSettings';
import AdminLogsPage from './pages/admin/LogsPage';
import AdminSystemAnalytics from './pages/admin/SystemAnalytics';
import AdminSettingsPage from './pages/admin/SettingsPage';
import AdminProfilePage from './pages/admin/ProfilePage';
import WaterBodyDetails from './pages/admin/WaterBodyDetail';
import FacilityDetails from './pages/admin/FacilityDetail';
import CriticalZoneDetails from './pages/admin/CriticalZoneDetail';

// Shared detail pages (role-based adaptive layout)
import FacilityDetailPage from './pages/shared/FacilityDetailPage';
import WaterBodyDetailPage from './pages/shared/WaterBodyDetailPage';
import CriticalZoneDetailPage from './pages/shared/CriticalZoneDetailPage';

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
          <Route path="/guest/map" element={<GuestMap />} />
          <Route path="/guest/waterbodies" element={<GuestWaterBodies />} />
          <Route path="/guest/facilities" element={<GuestFacilities />} />
          <Route path="/guest/about" element={<GuestAboutPage />} />
          <Route path="/guest/notifications" element={<GuestNotificationsPage />} />

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

          {/* Общие маршруты деталей - доступны для всех авторизованных пользователей с адаптивным лейаутом */}
          <Route element={<RequireAuth allowedRoles={['admin', 'expert', 'emergency']} />}>
            <Route path="/detail/facility/:id" element={<FacilityDetailPage />} />
            <Route path="/detail/waterbody/:id" element={<WaterBodyDetailPage />} />
            <Route path="/detail/critical-zone/:id" element={<CriticalZoneDetailPage />} />
          </Route>

          {/* Гостевые маршруты деталей - доступны для гостей без авторизации */}
          <Route path="/guest/facility/:id" element={<FacilityDetailPage />} />
          <Route path="/guest/waterbody/:id" element={<WaterBodyDetailPage />} />

          {/* Админ-специфичные маршруты деталей (устаревшие - используйте /detail/...) */}
          <Route path="/admin/waterbody/:id" element={<WaterBodyDetails />} />
          <Route path="/admin/facility/:id" element={<FacilityDetails />} />
          <Route path="/admin/critical-zone/:id" element={<CriticalZoneDetails />} />

          {/* Защищённые маршруты для админов */}
          <Route element={<RequireAuth allowedRoles={['admin']} />}>
            <Route path="/admin/overview" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersManagement />} />
            <Route path="/admin/waterbodies" element={<AdminWaterBodiesManagement />} />
            <Route path="/admin/facilities" element={<AdminFacilitiesManagement />} />
            <Route path="/admin/map" element={<AdminMap />} />
            <Route path="/admin/ai-settings" element={<AdminAISettings />} />
            <Route path="/admin/sensors" element={<AdminSensorsManagement />} />
            <Route path="/admin/prioritization" element={<AdminPrioritizationPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsSettings />} />
            <Route path="/admin/logs" element={<AdminLogsPage />} />
            <Route path="/admin/system-analytics" element={<AdminSystemAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
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
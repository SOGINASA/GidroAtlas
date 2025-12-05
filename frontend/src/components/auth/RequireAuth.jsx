import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const RequireAuth = ({ allowedRoles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  // Показываем загрузку пока проверяем аутентификацию
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a4275] to-[#1068a8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если роль не разрешена, перенаправляем на главную
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Если все проверки пройдены, рендерим дочерние маршруты
  return <Outlet />;
};

export default RequireAuth;
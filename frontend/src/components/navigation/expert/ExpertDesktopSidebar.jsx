import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Home,
  Map,
  Droplets,
  Zap,
  ListOrdered,
  Brain,
  BarChart3,
  Bell,
  User,
  LogOut
} from 'lucide-react';

const ExpertDesktopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Дашборд', path: '/expert/dashboard' },
    { icon: Map, label: 'Карта', path: '/expert/map' },
    { icon: Droplets, label: 'Водоёмы', path: '/expert/waterbodies' },
    { icon: Zap, label: 'ГТС', path: '/expert/facilities' },
    { icon: ListOrdered, label: 'Приоритизация', path: '/expert/prioritization' },
    { icon: Brain, label: 'Прогнозирование', path: '/expert/predictions' },
    { icon: BarChart3, label: 'Аналитика', path: '/expert/analytics' },
    { icon: Bell, label: 'Уведомления', path: '/expert/notifications' },
    { icon: User, label: 'Профиль', path: '/expert/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-gradient-to-b from-blue-600 to-blue-700 text-white z-50">
      {/* Logo/Brand */}
      <div className="flex items-center justify-center h-20 px-6 border-b border-blue-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">GidroAtlas</h1>
            <p className="text-xs text-blue-200">Эксперт</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                active
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
              {active && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-blue-500/30 p-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || 'Эксперт'}
            </p>
            <p className="text-xs text-blue-200">Экспертный доступ</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Выйти</span>
        </button>
      </div>
    </aside>
  );
};

export default ExpertDesktopSidebar;
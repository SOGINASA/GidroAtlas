import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Map, 
  Droplets, 
  Zap, 
  Brain, 
  AlertTriangle, 
  ListOrdered,
  BarChart3, 
  Bell, 
  FileText, 
  User, 
  LogOut,
  Siren
} from 'lucide-react';

const EmergencyDesktopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Центр управления', path: '/emergency/control-center' },
    { icon: Map, label: 'Карта мониторинга', path: '/emergency/map' },
    { icon: Droplets, label: 'Водоёмы', path: '/emergency/waterbodies' },
    { icon: Zap, label: 'ГТС', path: '/emergency/facilities' },
    { icon: Brain, label: 'Прогнозирование', path: '/emergency/predictions' },
    { icon: AlertTriangle, label: 'Критические зоны', path: '/emergency/critical-zones' },
    { icon: ListOrdered, label: 'Приоритизация', path: '/emergency/prioritization' },
    { icon: BarChart3, label: 'Аналитика', path: '/emergency/analytics' },
    { icon: Bell, label: 'Уведомления', path: '/emergency/notifications' },
    { icon: FileText, label: 'Отчёты', path: '/emergency/reports' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-gradient-to-b from-red-600 to-red-700 border-r border-red-500/30 shadow-2xl">
      {/* Logo & Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-red-500/30">
        <Link to="/emergency/control-center" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
            <Siren className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GidroAtlas</h1>
            <p className="text-xs text-red-200">МЧС • Emergency</p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-red-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {active && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-red-500/30 px-4 py-4">
        <Link
          to="/emergency/profile"
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
            isActive('/emergency/profile')
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-red-100 hover:bg-white/10 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name || 'Профиль'}</p>
            <p className="text-xs text-red-200 truncate">{user?.email || 'МЧС'}</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-100 hover:bg-red-800/50 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Выход</span>
        </button>
      </div>
    </div>
  );
};

export default EmergencyDesktopSidebar;
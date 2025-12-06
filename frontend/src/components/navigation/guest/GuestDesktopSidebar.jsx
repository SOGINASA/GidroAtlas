import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Droplets, MapPin, Waves, Zap, Bell, Info, LogIn } from 'lucide-react';

const GuestDesktopSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: MapPin, label: 'Карта', path: '/guest/map' },
    { icon: Waves, label: 'Водоёмы', path: '/guest/waterbodies' },
    { icon: Zap, label: 'ГТС', path: '/guest/facilities' },
    { icon: Bell, label: 'Уведомления', path: '/guest/notifications' },
    { icon: Info, label: 'О проекте', path: '/guest/about' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-gradient-to-b from-gray-600 to-gray-700">
      {/* Logo */}
      <div className="flex items-center h-20 px-6 border-b border-gray-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-lg">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GidroAtlas</h1>
            <p className="text-xs text-gray-300">Гостевой доступ</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-gray-200 hover:bg-gray-600 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-gray-700' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Login Button */}
      <div className="p-4 border-t border-gray-500">
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <LogIn className="w-5 h-5" />
          <span>Войти в систему</span>
        </button>
        <p className="text-xs text-center text-gray-400 mt-3">
          Войдите для доступа ко всем функциям
        </p>
      </div>
    </div>
  );
};

export default GuestDesktopSidebar;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Droplets, 
  Zap,
  MoreVertical,
  Globe,
  Brain,
  Radio,
  ListOrdered,
  Bell,
  ScrollText,
  BarChart3,
  Settings,
  User,
  X
} from 'lucide-react';

const AdminBottomNav = () => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const mainItems = [
    { icon: LayoutDashboard, label: 'Обзор', path: '/admin/overview' },
    { icon: Users, label: 'Пользов.', path: '/admin/users' },
    { icon: Droplets, label: 'Водоёмы', path: '/admin/waterbodies' },
    { icon: Zap, label: 'ГТС', path: '/admin/facilities' },
  ];

  const moreItems = [
    { icon: Globe, label: 'Карта', path: '/admin/map' },
    { icon: Brain, label: 'Настройка AI', path: '/admin/ai-settings' },
    { icon: Radio, label: 'Датчики IoT', path: '/admin/sensors' },
    { icon: ListOrdered, label: 'Приоритизация', path: '/admin/prioritization' },
    { icon: Bell, label: 'Уведомления', path: '/admin/notifications' },
    { icon: ScrollText, label: 'Логи и аудит', path: '/admin/logs' },
    { icon: BarChart3, label: 'Аналитика', path: '/admin/system-analytics' },
    { icon: Settings, label: 'Настройки', path: '/admin/settings' },
    { icon: User, label: 'Профиль', path: '/admin/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* More Menu Overlay */}
      {showMenu && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[100]" 
          onClick={() => setShowMenu(false)}
          style={{ touchAction: 'none' }}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-600 rounded-t-3xl shadow-2xl animate-slide-up max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-b from-purple-500 to-purple-600 px-6 py-4 border-b border-white/10 backdrop-blur-xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Дополнительно</h3>
                  <p className="text-xs text-purple-100 mt-0.5">Администрирование</p>
                </div>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-all active:scale-95"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="px-4 py-6">
              <div className="grid grid-cols-3 gap-3">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMenu(false)}
                      className={`flex flex-col items-center justify-center space-y-2 p-4 rounded-2xl transition-all active:scale-95 min-h-[80px] ${
                        active
                          ? 'bg-white/25 text-white shadow-lg scale-105'
                          : 'bg-white/10 text-purple-50 hover:bg-white/15'
                      }`}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                        active ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-center leading-tight">{item.label}</span>
                      {active && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-purple-600 to-pink-600 border-t-2 border-purple-500/30 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom)',
          minHeight: '70px'
        }}
      >
        <div className="grid grid-cols-5 gap-0.5 h-[70px] max-w-screen-xl mx-auto">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center space-y-1 transition-all active:scale-95 relative group ${
                  active ? 'text-white' : 'text-purple-100'
                }`}
              >
                {/* Active indicator line */}
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-b-full" />
                )}
                
                {/* Icon container */}
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                  active ? 'bg-white/20 scale-110' : 'bg-transparent group-hover:bg-white/10'
                }`}>
                  <Icon className={`transition-all ${active ? 'w-6 h-6' : 'w-5 h-5'}`} />
                  {active && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-300 rounded-full animate-pulse shadow-lg" />
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-[10px] font-semibold leading-tight transition-all ${
                  active ? 'text-white' : 'text-purple-100'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all active:scale-95 relative group ${
              showMenu ? 'text-white' : 'text-purple-100'
            }`}
          >
            {/* Active indicator */}
            {showMenu && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-b-full" />
            )}
            
            {/* Icon container */}
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              showMenu ? 'bg-white/20 scale-110 rotate-90' : 'bg-transparent group-hover:bg-white/10'
            }`}>
              <MoreVertical className={`transition-all ${showMenu ? 'w-6 h-6' : 'w-5 h-5'}`} />
            </div>
            
            {/* Label */}
            <span className={`text-[10px] font-semibold leading-tight transition-all ${
              showMenu ? 'text-white' : 'text-purple-100'
            }`}>
              Ещё
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default AdminBottomNav;
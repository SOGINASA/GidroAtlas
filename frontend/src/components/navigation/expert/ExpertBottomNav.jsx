import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Map,
  ListOrdered,
  Brain,
  MoreVertical,
  Droplets,
  Zap,
  BarChart3,
  Bell,
  User,
  X
} from 'lucide-react';

const ExpertBottomNav = () => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const mainItems = [
    { icon: Home, label: 'Дашборд', path: '/expert/dashboard' },
    { icon: Map, label: 'Карта', path: '/expert/map' },
    { icon: ListOrdered, label: 'Приорит.', path: '/expert/prioritization' },
    { icon: Brain, label: 'Прогноз', path: '/expert/predictions' },
  ];

  const moreItems = [
    { icon: Droplets, label: 'Водоёмы', path: '/expert/waterbodies' },
    { icon: Zap, label: 'ГТС', path: '/expert/facilities' },
    { icon: BarChart3, label: 'Аналитика', path: '/expert/analytics' },
    { icon: Bell, label: 'Уведомления', path: '/expert/notifications' },
    { icon: User, label: 'Профиль', path: '/expert/profile' },
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
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 rounded-t-3xl shadow-2xl animate-slide-up max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-4 border-b border-white/10 backdrop-blur-xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Дополнительно</h3>
                  <p className="text-xs text-blue-100 mt-0.5">Экспертные функции</p>
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
                          : 'bg-white/10 text-blue-50 hover:bg-white/15'
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

      {/* Bottom Navigation Bar - Fixed and Beautiful */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 border-t-2 border-blue-500/30 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
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
                  active ? 'text-white' : 'text-blue-100'
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
                  active ? 'text-white' : 'text-blue-100'
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
              showMenu ? 'text-white' : 'text-blue-100'
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
              showMenu ? 'text-white' : 'text-blue-100'
            }`}>
              Ещё
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default ExpertBottomNav;
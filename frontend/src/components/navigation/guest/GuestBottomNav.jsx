import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Waves, Zap, Bell, MoreHorizontal, Info, LogIn, X } from 'lucide-react';

const GuestBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainButtons = [
    { icon: MapPin, label: 'Карта', path: '/guest/map' },
    { icon: Waves, label: 'Водоёмы', path: '/guest/waterbodies' },
    { icon: Zap, label: 'ГТС', path: '/guest/facilities' },
    { icon: Bell, label: 'Уведомления', path: '/guest/notifications' }
  ];

  const moreItems = [
    { icon: Info, label: 'О проекте', path: '/guest/about' },
    { icon: LogIn, label: 'Войти', path: '/login', highlight: true }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-600 to-gray-700 border-t border-gray-500 z-40"
        style={{ 
          minHeight: '70px',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className="flex items-center justify-around h-[70px] px-2">
          {/* Main Buttons */}
          {mainButtons.map((button) => {
            const Icon = button.icon;
            const active = isActive(button.path);

            return (
              <button
                key={button.path}
                onClick={() => handleNavigation(button.path)}
                className="flex flex-col items-center justify-center flex-1 relative group"
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-b-full" />
                )}

                {/* Icon container */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  active 
                    ? 'bg-white shadow-lg scale-110' 
                    : 'bg-gray-600/50 group-hover:bg-gray-600 group-hover:scale-105'
                }`}>
                  <Icon className={`w-5 h-5 transition-colors ${
                    active ? 'text-gray-700' : 'text-gray-200 group-hover:text-white'
                  }`} />
                </div>

                {/* Label */}
                <span className={`text-[10px] mt-1 font-medium transition-colors ${
                  active ? 'text-white' : 'text-gray-300'
                }`}>
                  {button.label}
                </span>

                {/* Pulse indicator for active */}
                {active && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  </div>
                )}
              </button>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center justify-center flex-1 relative group"
          >
            {showMoreMenu && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-b-full" />
            )}

            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              showMoreMenu 
                ? 'bg-white shadow-lg scale-110 rotate-90' 
                : 'bg-gray-600/50 group-hover:bg-gray-600 group-hover:scale-105'
            }`}>
              <MoreHorizontal className={`w-5 h-5 transition-all ${
                showMoreMenu ? 'text-gray-700' : 'text-gray-200 group-hover:text-white'
              }`} />
            </div>

            <span className={`text-[10px] mt-1 font-medium transition-colors ${
              showMoreMenu ? 'text-white' : 'text-gray-300'
            }`}>
              Ещё
            </span>
          </button>
        </div>
      </div>

      {/* More Menu Modal */}
      {showMoreMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={() => setShowMoreMenu(false)}
          />

          {/* Menu */}
          <div className="lg:hidden fixed bottom-[70px] left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 animate-slideUp"
               style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Меню</h3>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="px-4 py-4 space-y-2 max-h-[60vh] overflow-y-auto">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all ${
                      item.highlight
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      item.highlight ? 'bg-white/20' : 'bg-white'
                    }`}>
                      <Icon className={`w-6 h-6 ${item.highlight ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <span className="font-semibold text-lg">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GuestBottomNav;
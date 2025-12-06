import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Droplets, 
  Zap, 
  Globe,
  Brain, 
  Radio,
  ListOrdered,
  Bell, 
  ScrollText, 
  BarChart3,
  Settings, 
  User, 
  LogOut,
  Shield,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const AdminDesktopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = React.useRef(null);
  
  // Используем localStorage для сохранения состояния между переходами
  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem('adminSidebarExpanded');
    return saved ? JSON.parse(saved) : ['main', 'data', 'system']; // По умолчанию все развёрнуты
  });

  // Сохраняем и восстанавливаем позицию скролла
  React.useEffect(() => {
    const savedScrollPos = sessionStorage.getItem('adminSidebarScrollPos');
    if (savedScrollPos && navRef.current) {
      navRef.current.scrollTop = parseInt(savedScrollPos, 10);
    }
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        sessionStorage.setItem('adminSidebarScrollPos', navRef.current.scrollTop.toString());
      }
    };

    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener('scroll', handleScroll);
      return () => navElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  // Основные разделы
  const mainItems = [
    { icon: LayoutDashboard, label: 'Обзор системы', path: '/admin/overview' },
    { icon: Users, label: 'Пользователи', path: '/admin/users' },
    { icon: Globe, label: 'Карта', path: '/admin/map' },
  ];

  // Управление данными
  const dataManagementItems = [
    { icon: Droplets, label: 'Водоёмы', path: '/admin/waterbodies' },
    { icon: Zap, label: 'ГТС', path: '/admin/facilities' },
    { icon: ListOrdered, label: 'Приоритизация', path: '/admin/prioritization' },
  ];

  // Система и мониторинг
  const systemItems = [
    { icon: Brain, label: 'Настройка AI', path: '/admin/ai-settings' },
    { icon: Radio, label: 'Датчики IoT', path: '/admin/sensors' },
    { icon: Bell, label: 'Уведомления', path: '/admin/notifications' },
    { icon: BarChart3, label: 'Аналитика', path: '/admin/system-analytics' },
    { icon: ScrollText, label: 'Логи и аудит', path: '/admin/logs' },
    { icon: Settings, label: 'Настройки', path: '/admin/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newSections = prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section];
      
      // Сохраняем в localStorage
      localStorage.setItem('adminSidebarExpanded', JSON.stringify(newSections));
      return newSections;
    });
  };

  const MenuSection = ({ title, items, sectionKey }) => {
    const isExpanded = expandedSections.includes(sectionKey);
    const hasActiveItem = items.some(item => isActive(item.path));

    return (
      <div className="mb-2">
        <button
          onClick={() => toggleSection(sectionKey)}
          className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 ${
            hasActiveItem
              ? 'bg-white/10 text-white'
              : 'text-purple-200 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                      : 'text-purple-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  {active && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-lg" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-gradient-to-b from-purple-600 via-purple-700 to-pink-600 shadow-2xl">
      {/* Logo & Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-purple-800/40 to-pink-800/40 backdrop-blur-sm">
        <Link to="/admin/overview" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/30 group-hover:ring-white/50 transition-all">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">GidroAtlas</h1>
            <p className="text-xs text-purple-200">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu with Custom Scroll */}
      <nav ref={navRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
        {/* Основное меню - всегда развёрнуто */}
        <div className="mb-3">
          <div className="px-4 py-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">Основное</span>
          </div>
          <div className="space-y-1">
            {mainItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                      : 'text-purple-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  {active && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-lg" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Управление данными - сворачиваемая секция */}
        <MenuSection 
          title="Управление данными" 
          items={dataManagementItems} 
          sectionKey="data"
        />

        {/* Система и мониторинг - сворачиваемая секция */}
        <MenuSection 
          title="Система и мониторинг" 
          items={systemItems} 
          sectionKey="system"
        />
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-white/10 px-4 py-4 bg-gradient-to-r from-purple-800/40 to-pink-800/40 backdrop-blur-sm">
        <Link
          to="/admin/profile"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 group ${
            isActive('/admin/profile')
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-purple-100 hover:bg-white/10 hover:text-white'
          }`}
        >
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Администратор</p>
            <p className="text-xs text-purple-200 truncate">admin@hydroatlas.kz</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-purple-100 hover:bg-red-500/20 hover:text-white transition-all duration-200 group"
        >
          <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-red-500/30 transition-all">
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-medium text-sm">Выход</span>
        </button>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
      `}</style>
    </div>
  );
};

export default AdminDesktopSidebar;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MinimalHeader from '../../components/layout/MinimalHeader';
import BottomNavigation from '../../components/layout/BottomNavigation';
import EmergencyDesktopSidebar from '../../components/layout/EmergencyDesktopSidebar';
import EmergencyDesktopTopHeader from '../../components/layout/EmergencyDesktopTopHeader';
import { useAuth } from '../../hooks/useAuth';

const EmergencyProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info'); // info, stats, schedule

  const profileData = {
    fullName: user?.fullName || 'Петров Петр Петрович',
    position: user?.position || 'Начальник смены МЧС',
    rank: 'Майор',
    badgeNumber: user?.badgeNumber || 'МЧС-12345',
    department: 'Отдел ЧС Петропавловск',
    phone: '+7 777 765 4321',
    email: 'petrov@mchs.kz',
    experience: '12 лет',
    joinDate: '15.03.2012',
    certifications: ['Спасатель 1 класса', 'Инструктор по ГО и ЧС', 'Водитель категории C, D'],
    photo: null
  };

  const stats = [
    { label: 'Завершено смен', value: '348', icon: '📅' },
    { label: 'Проведено эвакуаций', value: '127', icon: '🚨' },
    { label: 'Спасено людей', value: '412', icon: '👥' },
    { label: 'Уведомлений отправлено', value: '1,254', icon: '📢' }
  ];

  const schedule = [
    { date: '26 ноября', shift: 'Дневная смена', time: '08:00 - 20:00', status: 'active' },
    { date: '27 ноября', shift: 'Выходной', time: '-', status: 'off' },
    { date: '28 ноября', shift: 'Ночная смена', time: '20:00 - 08:00', status: 'scheduled' },
    { date: '29 ноября', shift: 'Выходной', time: '-', status: 'off' },
    { date: '30 ноября', shift: 'Дневная смена', time: '08:00 - 20:00', status: 'scheduled' }
  ];

  const recentActivity = [
    { action: 'Отправлено уведомление', details: 'Критический уровень воды', time: '30 мин назад', type: 'notification' },
    { action: 'Эвакуация завершена', details: 'Иванов И.И., ул. Конституции 45', time: '2 часа назад', type: 'evacuation' },
    { action: 'Обновлен статус датчика', details: 'Датчик №3 - Критический', time: '3 часа назад', type: 'sensor' },
    { action: 'Начало смены', details: 'Дневная смена 08:00', time: '5 часов назад', type: 'shift' }
  ];

  const handleLogout = () => {
    if (window.confirm('Вы уверены что хотите выйти?')) {
      logout();
      navigate('/login');
    }
  };

  const getShiftStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-300';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'off': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'notification': return '📢';
      case 'evacuation': return '🚨';
      case 'sensor': return '📊';
      case 'shift': return '⏰';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MinimalHeader title="Профиль" showBack />
      </div>

      {/* Desktop Sidebar */}
      <EmergencyDesktopSidebar />

      {/* Desktop Top Header */}
      <EmergencyDesktopTopHeader />

      {/* Main Content */}
      <main className="pt-16 pb-24 px-4 lg:ml-72 lg:pt-24 lg:pb-8">
        <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl lg:rounded-2xl shadow-lg p-6 lg:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl lg:text-5xl font-bold">
                {profileData.fullName.charAt(0)}
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">{profileData.fullName}</h2>
                <p className="text-white/90 text-lg mb-3">{profileData.position}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {profileData.rank}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    ID: {profileData.badgeNumber}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Стаж: {profileData.experience}
                  </span>
                  <span className="px-3 py-1 bg-green-400/80 backdrop-blur-sm rounded-full text-sm font-medium flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>На смене</span>
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button className="hidden sm:flex items-center space-x-2 px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Редактировать</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'info'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Информация
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'schedule'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              График смен
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'activity'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Активность
            </button>
          </div>

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Personal Info */}
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Личные данные</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">ФИО</p>
                    <p className="font-medium text-gray-900">{profileData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Звание</p>
                    <p className="font-medium text-gray-900">{profileData.rank}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Должность</p>
                    <p className="font-medium text-gray-900">{profileData.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Номер удостоверения</p>
                    <p className="font-medium text-gray-900">{profileData.badgeNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Дата приема</p>
                    <p className="font-medium text-gray-900">{profileData.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Контакты</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Отдел</p>
                    <p className="font-medium text-gray-900">{profileData.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Телефон</p>
                    <p className="font-medium text-gray-900">{profileData.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{profileData.email}</p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Сертификаты и квалификации</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.certifications.map((cert, index) => (
                    <span key={index} className="px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200">
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">График смен на неделю</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {schedule.map((item, index) => (
                  <div key={index} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{item.date}</p>
                        <p className="text-sm text-gray-600">{item.shift}</p>
                        {item.time !== '-' && (
                          <p className="text-xs text-gray-500 mt-1">⏰ {item.time}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getShiftStatusColor(item.status)}`}>
                        {item.status === 'active' ? 'Активна' : item.status === 'scheduled' ? 'Запланирована' : 'Выходной'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Последняя активность</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivity.map((item, index) => (
                  <div key={index} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getActivityIcon(item.type)}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.action}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-6 py-4 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Выйти из системы</span>
          </button>

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default EmergencyProfile;
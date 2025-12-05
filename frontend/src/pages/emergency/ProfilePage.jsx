import React, { useState } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Building, Shield, Key, Bell, Globe, Save } from 'lucide-react';

const EmergencyProfile = () => {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || 'Иван',
    lastName: user?.name?.split(' ')[1] || 'Иванов',
    email: user?.email || 'ivanov@mchs.kz',
    phone: '+7 (701) 234-56-78',
    organization: 'МЧС Казахстана',
    position: 'Оперативный дежурный',
    department: 'Центр управления',
    region: 'Павлодарская область',
    employeeId: 'MChS-2024-0156',
    certifications: ['Управление ЧС', 'Эвакуация', 'Первая помощь']
  });

  const [settings, setSettings] = useState({
    language: 'ru',
    notifications: {
      email: true,
      sms: true,
      push: true,
      critical: true
    },
    theme: 'light',
    mapDefault: 'satellite'
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Профиль сохранён!');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert('Настройки сохранены!');
  };

  const activityLog = [
    { action: 'Начата эвакуация', location: 'Павлодар, Иртыш', time: '2 часа назад' },
    { action: 'Отправлено массовое уведомление', location: 'Алматинская обл.', time: '5 часов назад' },
    { action: 'Создан отчёт', location: 'Система', time: '1 день назад' },
    { action: 'Обновлены данные объекта', location: 'Бухтарминская ГЭС', time: '2 дня назад' }
  ];

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                👤
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profileData.firstName} {profileData.lastName}</h1>
                <p className="text-red-100">{profileData.position} • {profileData.department}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Sidebar - Quick Info */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Role Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                  <h3 className="font-bold text-lg">Роль в системе</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Роль:</p>
                    <p className="font-semibold text-red-600">МЧС / Emergency</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ID сотрудника:</p>
                    <p className="font-semibold">{profileData.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Регион:</p>
                    <p className="font-semibold">{profileData.region}</p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-4">Сертификации</h3>
                <div className="space-y-2">
                  {profileData.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-3">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-4">Последняя активность</h3>
                <div className="space-y-3">
                  {activityLog.map((log, idx) => (
                    <div key={idx} className="border-l-2 border-gray-300 pl-3">
                      <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-600">{log.location}</p>
                      <p className="text-xs text-gray-400">{log.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                
                {/* Tabs */}
                <div className="border-b flex">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-4 font-semibold transition-colors ${
                      activeTab === 'profile' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'
                    }`}
                  >
                    Профиль
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-4 font-semibold transition-colors ${
                      activeTab === 'settings' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'
                    }`}
                  >
                    Настройки
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`px-6 py-4 font-semibold transition-colors ${
                      activeTab === 'security' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'
                    }`}
                  >
                    Безопасность
                  </button>
                </div>

                <div className="p-6">
                  
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Имя
                          </label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Фамилия
                          </label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Телефон
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Building className="w-4 h-4 inline mr-2" />
                            Организация
                          </label>
                          <input
                            type="text"
                            value={profileData.organization}
                            onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Должность
                          </label>
                          <input
                            type="text"
                            value={profileData.position}
                            onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Отдел
                          </label>
                          <input
                            type="text"
                            value={profileData.department}
                            onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Регион
                          </label>
                          <select
                            value={profileData.region}
                            onChange={(e) => setProfileData({...profileData, region: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          >
                            <option>Алматинская область</option>
                            <option>Павлодарская область</option>
                            <option>ВКО</option>
                            <option>ЗКО</option>
                            <option>СКО</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        <Save className="w-5 h-5" />
                        <span>Сохранить изменения</span>
                      </button>
                    </form>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                      
                      {/* Language */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Globe className="w-4 h-4 inline mr-2" />
                          Язык интерфейса
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => setSettings({...settings, language: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                          <option value="ru">Русский</option>
                          <option value="kz">Қазақша</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      {/* Notifications */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          <Bell className="w-4 h-4 inline mr-2" />
                          Уведомления
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={settings.notifications.email}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {...settings.notifications, email: e.target.checked}
                              })}
                              className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm">Email уведомления</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={settings.notifications.sms}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {...settings.notifications, sms: e.target.checked}
                              })}
                              className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm">SMS уведомления</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={settings.notifications.push}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {...settings.notifications, push: e.target.checked}
                              })}
                              className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm">Push уведомления</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={settings.notifications.critical}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {...settings.notifications, critical: e.target.checked}
                              })}
                              className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm font-semibold text-red-600">Критические алерты (всегда активно)</span>
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        <Save className="w-5 h-5" />
                        <span>Сохранить настройки</span>
                      </button>
                    </form>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-yellow-800">
                          <Key className="w-5 h-5" />
                          <p className="font-semibold">Смена пароля</p>
                        </div>
                        <p className="text-sm text-yellow-700 mt-2">
                          Для смены пароля обратитесь к системному администратору
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-bold">Активные сессии</h3>
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">Текущая сессия</p>
                              <p className="text-sm text-gray-600">Chrome на Windows • Павлодар, KZ</p>
                              <p className="text-xs text-gray-400">Последняя активность: только что</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              Активна
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default EmergencyProfile;
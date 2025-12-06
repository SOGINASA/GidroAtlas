import React, { useState, useEffect } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { User, Mail, Phone, Building, Shield, Key, Bell, Globe, Save, Loader2, AlertCircle } from 'lucide-react';
import { getUserFromStorage } from '../../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../../services/userService';

const EmergencyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: ''
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

  // Загрузка данных профиля при монтировании
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = getUserFromStorage();
      console.log('Current user from localStorage:', currentUser);

      if (!currentUser) {
        setError('Пользователь не авторизован');
        return;
      }

      const userId = currentUser.id;
      console.log('User ID:', userId);

      if (!userId) {
        setError('ID пользователя не найден');
        return;
      }

      const response = await getUserProfile(userId);

      if (response.success && response.data) {
        setProfileData({
          full_name: response.data.full_name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || ''
        });
      }
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      setError(err.message || 'Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const currentUser = getUserFromStorage();
      if (!currentUser || !currentUser.id) {
        setError('Пользователь не авторизован');
        return;
      }

      const updateData = {
        full_name: profileData.full_name,
        phone: profileData.phone,
        address: profileData.address
      };

      const response = await updateUserProfile(currentUser.id, updateData);

      if (response.success) {
        setSuccessMessage('Профиль успешно обновлён!');
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
      setError(err.message || 'Не удалось обновить профиль');
    } finally {
      setSaving(false);
    }
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

  // Показываем индикатор загрузки
  if (loading) {
    return (
      <EmergencyLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Загрузка профиля...</p>
          </div>
        </div>
      </EmergencyLayout>
    );
  }

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profileData.full_name || 'Сотрудник МЧС'}</h1>
                <p className="text-red-100">{profileData.email}</p>
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
                    <p className="text-gray-600">Email:</p>
                    <p className="font-semibold">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Телефон:</p>
                    <p className="font-semibold">{profileData.phone || 'Не указан'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-4">Адрес</h3>
                <p className="text-sm text-gray-700">
                  {profileData.address || 'Адрес не указан'}
                </p>
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

                      {/* Сообщения об ошибках и успехе */}
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800">Ошибка</p>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                          </div>
                        </div>
                      )}

                      {successMessage && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">{successMessage}</p>
                        </div>
                      )}

                      <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            ФИО
                          </label>
                          <input
                            type="text"
                            value={profileData.full_name}
                            onChange={(e) => {
                              setProfileData({...profileData, full_name: e.target.value});
                              setError(null);
                              setSuccessMessage(null);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            placeholder="Введите полное имя"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Mail className="w-4 h-4 inline mr-2" />
                              Email
                            </label>
                            <input
                              type="email"
                              value={profileData.email}
                              disabled
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                              title="Email нельзя изменить"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email нельзя изменить</p>
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Phone className="w-4 h-4 inline mr-2" />
                              Телефон
                            </label>
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => {
                                setProfileData({...profileData, phone: e.target.value});
                                setError(null);
                                setSuccessMessage(null);
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                              placeholder="+7 (777) 123-45-67"
                            />
                          </div>
                        </div>

                        {/* Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Building className="w-4 h-4 inline mr-2" />
                            Адрес
                          </label>
                          <textarea
                            value={profileData.address}
                            onChange={(e) => {
                              setProfileData({...profileData, address: e.target.value});
                              setError(null);
                              setSuccessMessage(null);
                            }}
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            placeholder="Введите адрес"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Сохранение...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Сохранить изменения</span>
                          </>
                        )}
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
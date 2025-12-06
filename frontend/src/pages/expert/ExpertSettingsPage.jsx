import React, { useState } from 'react';
import MinimalHeader from '../../components/layout/MinimalHeader';
import BottomNavigation from '../../components/layout/BottomNavigation';
import DesktopSidebar from '../../components/layout/DesktopSidebar';
import DesktopTopHeader from '../../components/layout/DesktopTopHeader';

const ResidentSettingsPage = () => {
  const [settings, setSettings] = useState({
    // Notifications
    pushNotifications: true,
    smsNotifications: false,
    emailNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Danger Levels
    notifyOnSafe: false,
    notifyOnAttention: true,
    notifyOnDanger: true,
    notifyOnCritical: true,
    
    // Map
    showSatelliteLayer: true,
    showRiskZones: true,
    autoUpdateLocation: false,
    
    // App
    language: 'ru',
    theme: 'light',
    dataUsage: 'standard',
    
    // Privacy
    shareLocation: true,
    shareWithEmergency: true,
    analyticsEnabled: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSelect = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      alert('Настройки сохранены!');
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm('Вы уверены что хотите сбросить все настройки к значениям по умолчанию?')) {
      setSettings({
        pushNotifications: true,
        smsNotifications: false,
        emailNotifications: true,
        soundEnabled: true,
        vibrationEnabled: true,
        notifyOnSafe: false,
        notifyOnAttention: true,
        notifyOnDanger: true,
        notifyOnCritical: true,
        showSatelliteLayer: true,
        showRiskZones: true,
        autoUpdateLocation: false,
        language: 'ru',
        theme: 'light',
        dataUsage: 'standard',
        shareLocation: true,
        shareWithEmergency: true,
        analyticsEnabled: true,
      });
    }
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={enabled}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MinimalHeader title="Настройки" showBack />
      </div>

      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Desktop Top Header */}
      <DesktopTopHeader />

      {/* Main Content */}
      <main className="pt-16 pb-24 px-4 lg:ml-72 lg:pt-24 lg:pb-8">
        <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6">

          {/* Section 1: Notifications */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 lg:p-6">
              {/* Section Header */}
              <div className="flex items-center space-x-3 mb-4 lg:mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-bold text-gray-900">Уведомления</h3>
                  <p className="text-xs lg:text-sm text-gray-600">Настройте способы получения оповещений</p>
                </div>
              </div>

              {/* Settings Items */}
              <div className="space-y-1">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Push-уведомления</p>
                      <p className="text-xs text-gray-500">Мгновенные оповещения на устройство</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.pushNotifications} onChange={() => handleToggle('pushNotifications')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">SMS-уведомления</p>
                      <p className="text-xs text-gray-500">Важные сообщения по SMS</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.smsNotifications} onChange={() => handleToggle('smsNotifications')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Email-уведомления</p>
                      <p className="text-xs text-gray-500">Получать на электронную почту</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Звук</p>
                      <p className="text-xs text-gray-500">Звуковые оповещения</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.soundEnabled} onChange={() => handleToggle('soundEnabled')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Вибрация</p>
                      <p className="text-xs text-gray-500">Вибрация при уведомлениях</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.vibrationEnabled} onChange={() => handleToggle('vibrationEnabled')} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Danger Levels */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-3 mb-4 lg:mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-bold text-gray-900">Уровни опасности</h3>
                  <p className="text-xs lg:text-sm text-gray-600">Выберите когда получать уведомления</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Безопасно</p>
                      <p className="text-xs text-gray-500">Уровень воды &lt; 3.0м</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.notifyOnSafe} onChange={() => handleToggle('notifyOnSafe')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Внимание</p>
                      <p className="text-xs text-gray-500">Уровень воды 3.0-4.0м</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.notifyOnAttention} onChange={() => handleToggle('notifyOnAttention')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Опасно</p>
                      <p className="text-xs text-gray-500">Уровень воды 4.0-5.0м</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.notifyOnDanger} onChange={() => handleToggle('notifyOnDanger')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Критично</p>
                      <p className="text-xs text-gray-500">Уровень воды &gt; 5.0м</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.notifyOnCritical} onChange={() => handleToggle('notifyOnCritical')} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Map Settings */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-3 mb-4 lg:mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-bold text-gray-900">Карта</h3>
                  <p className="text-xs lg:text-sm text-gray-600">Настройки отображения карты</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Спутниковый слой</p>
                      <p className="text-xs text-gray-500">Показывать спутниковые снимки</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.showSatelliteLayer} onChange={() => handleToggle('showSatelliteLayer')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Зоны риска</p>
                      <p className="text-xs text-gray-500">Отображать зоны затопления</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.showRiskZones} onChange={() => handleToggle('showRiskZones')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Автообновление геолокации</p>
                      <p className="text-xs text-gray-500">Отслеживать местоположение</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.autoUpdateLocation} onChange={() => handleToggle('autoUpdateLocation')} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: App Settings */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-3 mb-4 lg:mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-bold text-gray-900">Приложение</h3>
                  <p className="text-xs lg:text-sm text-gray-600">Общие настройки приложения</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Language */}
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-900 mb-2">Язык интерфейса</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSelect('language', e.target.value)}
                    className="w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="ru">Русский</option>
                    <option value="kk">Қазақ</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-900 mb-2">Тема оформления</label>
                  <div className="grid grid-cols-3 gap-2 lg:gap-3">
                    <button
                      onClick={() => handleSelect('theme', 'light')}
                      className={`p-3 lg:p-4 rounded-lg border-2 transition-all ${
                        settings.theme === 'light'
                          ? 'border-[#0A4B78] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-xs font-medium">Светлая</span>
                    </button>
                    <button
                      onClick={() => handleSelect('theme', 'dark')}
                      className={`p-3 lg:p-4 rounded-lg border-2 transition-all ${
                        settings.theme === 'dark'
                          ? 'border-[#0A4B78] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span className="text-xs font-medium">Тёмная</span>
                    </button>
                    <button
                      onClick={() => handleSelect('theme', 'auto')}
                      className={`p-3 lg:p-4 rounded-lg border-2 transition-all ${
                        settings.theme === 'auto'
                          ? 'border-[#0A4B78] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs font-medium">Авто</span>
                    </button>
                  </div>
                </div>

                {/* Data Usage */}
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-900 mb-2">Качество данных</label>
                  <select
                    value={settings.dataUsage}
                    onChange={(e) => handleSelect('dataUsage', e.target.value)}
                    className="w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="low">Экономия трафика</option>
                    <option value="standard">Стандартное</option>
                    <option value="high">Высокое качество</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Privacy */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-3 mb-4 lg:mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-bold text-gray-900">Конфиденциальность</h3>
                  <p className="text-xs lg:text-sm text-gray-600">Управление доступом к данным</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Делиться геолокацией</p>
                      <p className="text-xs text-gray-500">Для точных рекомендаций</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.shareLocation} onChange={() => handleToggle('shareLocation')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Доступ для МЧС</p>
                      <p className="text-xs text-gray-500">В случае эвакуации и ЧС</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.shareWithEmergency} onChange={() => handleToggle('shareWithEmergency')} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900">Аналитика использования</p>
                      <p className="text-xs text-gray-500">Помочь улучшить приложение</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={settings.analyticsEnabled} onChange={() => handleToggle('analyticsEnabled')} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 lg:py-4 bg-gradient-to-r from-[#0A4B78] to-[#1E88E5] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Сохранение...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Сохранить настройки</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleReset}
              className="sm:w-auto px-6 py-3 lg:py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
            >
              Сбросить
            </button>
          </div>

          {/* Version Info */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl lg:rounded-2xl p-4 text-center">
            <p className="text-sm font-semibold text-gray-900">Oracle v1.0.0</p>
            <p className="text-xs text-gray-600 mt-1">Система мониторинга паводков</p>
            <p className="text-xs text-gray-500 mt-2">© 2025 By ITshechka. Все права защищены.</p>
          </div>

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ResidentSettingsPage;
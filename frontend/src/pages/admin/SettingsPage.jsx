import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Mail, 
  Bell, 
  Lock, 
  Globe, 
  Palette,
  Server,
  FileText,
  Shield,
  Clock,
  HardDrive,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Info,
  MapPin,
  Cpu,
  Zap
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Общие настройки
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'GidroAtlas Казахстан',
    siteNameKz: 'Қазақстан ГидроАтласы',
    defaultLanguage: 'ru',
    timezone: 'Asia/Almaty',
    maintenanceMode: false,
    debugMode: false
  });

  // Настройки базы данных
  const [dbSettings, setDbSettings] = useState({
    host: 'localhost',
    port: '5432',
    name: 'hydroatlas_db',
    backupFrequency: 'daily',
    backupRetention: '30',
    autoBackup: true
  });

  // Настройки почты
  const [mailSettings, setMailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'admin@hydroatlas.kz',
    smtpPassword: '••••••••',
    fromEmail: 'noreply@hydroatlas.kz',
    fromName: 'GidroAtlas'
  });

  // Настройки уведомлений
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    criticalAlertsOnly: false,
    notifyAdmins: true,
    notifyExperts: true,
    notifyEmergency: true
  });

  // Настройки безопасности
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    passwordMinLength: '8',
    requireSpecialChars: true,
    twoFactorAuth: false,
    maxLoginAttempts: '5',
    ipWhitelist: '',
    apiRateLimit: '100'
  });

  // Настройки карты
  const [mapSettings, setMapSettings] = useState({
    defaultCenter: { lat: 48.0196, lng: 66.9237 },
    defaultZoom: 6,
    mapProvider: 'OpenStreetMap',
    showSatelliteLayer: true,
    markerClustering: true,
    animationSpeed: 'normal'
  });

  // Настройки хранилища
  const [storageSettings, setStorageSettings] = useState({
    maxUploadSize: '50',
    allowedFileTypes: 'pdf,jpg,png,doc,docx,xls,xlsx',
    storageLimit: '100',
    currentUsage: '34.5',
    autoCleanup: true,
    cleanupDays: '90'
  });

  const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || '';

  // Настройки API
  const [apiSettings, setApiSettings] = useState({
    apiKey: STRIPE_PUBLIC_KEY,
    apiVersion: 'v1',
    enableCors: true,
    allowedOrigins: 'https://hydroatlas.kz',
    rateLimitPerHour: '1000'
  });


  const tabs = [
    { id: 'general', label: 'Общие', icon: Settings },
    { id: 'database', label: 'База данных', icon: Database },
    { id: 'mail', label: 'Почта', icon: Mail },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'security', label: 'Безопасность', icon: Lock },
    { id: 'map', label: 'Карта', icon: MapPin },
    { id: 'storage', label: 'Хранилище', icon: HardDrive },
    { id: 'api', label: 'API', icon: Zap }
  ];

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки?')) {
      setSaveStatus('reset');
      setTimeout(() => setSaveStatus(null), 2000);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Settings className="w-8 h-8 mr-3" />
                  Настройки системы
                </h1>
                <p className="text-purple-100">Управление конфигурацией и параметрами GidroAtlas</p>
              </div>
              {saveStatus && (
                <div className={`px-6 py-3 rounded-xl flex items-center space-x-2 ${
                  saveStatus === 'success' ? 'bg-green-500' :
                  saveStatus === 'saving' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}>
                  {saveStatus === 'success' && <CheckCircle className="w-5 h-5" />}
                  {saveStatus === 'saving' && <RefreshCw className="w-5 h-5 animate-spin" />}
                  <span className="font-semibold">
                    {saveStatus === 'success' ? 'Сохранено' :
                     saveStatus === 'saving' ? 'Сохранение...' :
                     'Сброшено'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar with tabs */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sticky top-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                          activeTab === tab.id
                            ? 'bg-purple-500 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                      <Settings className="w-6 h-6 text-purple-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Общие настройки</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Название сайта (RU)
                        </label>
                        <input
                          type="text"
                          value={generalSettings.siteName}
                          onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Название сайта (KZ)
                        </label>
                        <input
                          type="text"
                          value={generalSettings.siteNameKz}
                          onChange={(e) => setGeneralSettings({...generalSettings, siteNameKz: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Globe className="w-4 h-4 inline mr-1" />
                          Язык по умолчанию
                        </label>
                        <select
                          value={generalSettings.defaultLanguage}
                          onChange={(e) => setGeneralSettings({...generalSettings, defaultLanguage: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="ru">Русский</option>
                          <option value="kz">Қазақша</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Часовой пояс
                        </label>
                        <select
                          value={generalSettings.timezone}
                          onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="Asia/Almaty">Asia/Almaty (UTC+6)</option>
                          <option value="Asia/Aqtobe">Asia/Aqtobe (UTC+5)</option>
                          <option value="Asia/Oral">Asia/Oral (UTC+5)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">Только критические алерты</p>
                          <p className="text-sm text-gray-600">Уведомлять только о важных событиях</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.criticalAlertsOnly}
                            onChange={(e) => setNotificationSettings({...notificationSettings, criticalAlertsOnly: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-bold text-gray-900 mb-4">Уведомлять роли пользователей:</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Администраторов</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.notifyAdmins}
                              onChange={(e) => setNotificationSettings({...notificationSettings, notifyAdmins: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Экспертов</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.notifyExperts}
                              onChange={(e) => setNotificationSettings({...notificationSettings, notifyExperts: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">МЧС</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.notifyEmergency}
                              onChange={(e) => setNotificationSettings({...notificationSettings, notifyEmergency: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                      <Lock className="w-6 h-6 text-purple-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Настройки безопасности</h2>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">Внимание!</p>
                        <p className="text-sm text-red-700">Изменения настроек безопасности могут повлиять на доступ пользователей.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Таймаут сессии (минуты)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Минимальная длина пароля
                        </label>
                        <input
                          type="number"
                          value={securitySettings.passwordMinLength}
                          onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Максимум попыток входа
                        </label>
                        <input
                          type="number"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Лимит API запросов (в час)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.apiRateLimit}
                          onChange={(e) => setSecuritySettings({...securitySettings, apiRateLimit: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Белый список IP адресов (через запятую)
                        </label>
                        <textarea
                          value={securitySettings.ipWhitelist}
                          onChange={(e) => setSecuritySettings({...securitySettings, ipWhitelist: e.target.value})}
                          rows={3}
                          placeholder="192.168.1.1, 10.0.0.1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">Требовать специальные символы в паролях</p>
                          <p className="text-sm text-gray-600">!@#$%^&*()_+-=[]{}|</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.requireSpecialChars}
                            onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialChars: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">Двухфакторная аутентификация</p>
                          <p className="text-sm text-gray-600">Требовать 2FA для всех администраторов</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.twoFactorAuth}
                            onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Map Settings */}
                {activeTab === 'map' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                      <MapPin className="w-6 h-6 text-purple-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Настройки карты</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Широта центра
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={mapSettings.defaultCenter.lat}
                          onChange={(e) => setMapSettings({
                            ...mapSettings, 
                            defaultCenter: {...mapSettings.defaultCenter, lat: parseFloat(e.target.value)}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Долгота центра
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={mapSettings.defaultCenter.lng}
                          onChange={(e) => setMapSettings({
                            ...mapSettings, 
                            defaultCenter: {...mapSettings.defaultCenter, lng: parseFloat(e.target.value)}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Zoom по умолчанию
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="18"
                          value={mapSettings.defaultZoom}
                          onChange={(e) => setMapSettings({...mapSettings, defaultZoom: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Провайдер карты
                        </label>
                        <select
                          value={mapSettings.mapProvider}
                          onChange={(e) => setMapSettings({...mapSettings, mapProvider: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="OpenStreetMap">OpenStreetMap</option>
                          <option value="GoogleMaps">Google Maps</option>
                          <option value="Mapbox">Mapbox</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Скорость анимации
                        </label>
                        <select
                          value={mapSettings.animationSpeed}
                          onChange={(e) => setMapSettings({...mapSettings, animationSpeed: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="slow">Медленная</option>
                          <option value="normal">Нормальная</option>
                          <option value="fast">Быстрая</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">Спутниковый слой</p>
                          <p className="text-sm text-gray-600">Показывать спутниковые снимки</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={mapSettings.showSatelliteLayer}
                            onChange={(e) => setMapSettings({...mapSettings, showSatelliteLayer: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">Кластеризация маркеров</p>
                          <p className="text-sm text-gray-600">Группировать близкие объекты</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={mapSettings.markerClustering}
                            onChange={(e) => setMapSettings({...mapSettings, markerClustering: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Storage Settings */}
                {activeTab === 'storage' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                      <HardDrive className="w-6 h-6 text-purple-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Настройки хранилища</h2>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm opacity-90">Использовано</p>
                          <p className="text-3xl font-bold">{storageSettings.currentUsage} ГБ</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm opacity-90">Лимит</p>
                          <p className="text-3xl font-bold">{storageSettings.storageLimit} ГБ</p>
                        </div>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-500"
                          style={{ width: `${(parseFloat(storageSettings.currentUsage) / parseFloat(storageSettings.storageLimit)) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm mt-2 opacity-90">
                        {((parseFloat(storageSettings.currentUsage) / parseFloat(storageSettings.storageLimit)) * 100).toFixed(1)}% использовано
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Макс. размер файла (МБ)
                        </label>
                        <input
                          type="number"
                          value={storageSettings.maxUploadSize}
                          onChange={(e) => setStorageSettings({...storageSettings, maxUploadSize: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Удалять файлы старше (дни)
                        </label>
                        <input
                          type="number"
                          value={storageSettings.cleanupDays}
                          onChange={(e) => setStorageSettings({...storageSettings, cleanupDays: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Разрешённые типы файлов
                        </label>
                        <input
                          type="text"
                          value={storageSettings.allowedFileTypes}
                          onChange={(e) => setStorageSettings({...storageSettings, allowedFileTypes: e.target.value})}
                          placeholder="pdf,jpg,png,doc"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">Автоматическая очистка</p>
                        <p className="text-sm text-gray-600">Удалять старые файлы автоматически</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={storageSettings.autoCleanup}
                          onChange={(e) => setStorageSettings({...storageSettings, autoCleanup: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <button className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold">
                      <Trash2 className="w-5 h-5" />
                      <span>Очистить временные файлы</span>
                    </button>
                  </div>
                )}

                {/* API Settings */}
                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                      <Zap className="w-6 h-6 text-purple-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Настройки API</h2>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-900">Конфиденциально!</p>
                        <p className="text-sm text-yellow-700">Не передавайте API ключ третьим лицам.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        API Ключ
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiSettings.apiKey}
                          readOnly
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl bg-gray-50 font-mono text-sm"
                        />
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Версия API
                        </label>
                        <select
                          value={apiSettings.apiVersion}
                          onChange={(e) => setApiSettings({...apiSettings, apiVersion: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="v1">v1 (текущая)</option>
                          <option value="v2">v2 (beta)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Лимит запросов в час
                        </label>
                        <input
                          type="number"
                          value={apiSettings.rateLimitPerHour}
                          onChange={(e) => setApiSettings({...apiSettings, rateLimitPerHour: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Разрешённые домены (CORS)
                        </label>
                        <textarea
                          value={apiSettings.allowedOrigins}
                          onChange={(e) => setApiSettings({...apiSettings, allowedOrigins: e.target.value})}
                          rows={3}
                          placeholder="https://example.com, https://app.example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">Включить CORS</p>
                        <p className="text-sm text-gray-600">Разрешить кросс-доменные запросы</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={apiSettings.enableCors}
                          onChange={(e) => setApiSettings({...apiSettings, enableCors: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold">
                        <RefreshCw className="w-5 h-5" />
                        <span>Сгенерировать новый ключ</span>
                      </button>
                      <button className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold">
                        <FileText className="w-5 h-5" />
                        <span>Документация API</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-end">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Сбросить</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  <Save className="w-5 h-5" />
                  <span>Сохранить изменения</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
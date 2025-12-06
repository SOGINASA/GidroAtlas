import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase,
  Shield,
  Settings,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  X,
  Check,
  Clock,
  MapPin,
  Calendar,
  Activity,
  Award,
  TrendingUp,
  BarChart3,
  Database,
  Users
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Данные профиля
  const [profileData, setProfileData] = useState({
    firstName: 'Алексей',
    lastName: 'Смирнов',
    email: 'admin@hydroatlas.kz',
    phone: '+7 (777) 123-45-67',
    organization: 'Комитет по водным ресурсам МСХ РК',
    position: 'Главный системный администратор',
    location: 'Астана, Казахстан',
    timezone: 'UTC+6 (Астана)',
    language: 'ru',
    avatar: null
  });

  // Настройки уведомлений
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    systemAlerts: true,
    userActions: false,
    dataUpdates: true,
    securityAlerts: true,
    weeklyReports: true
  });

  // Статистика активности администратора
  const activityStats = [
    { icon: Users, label: 'Пользователей создано', value: '45', color: 'from-purple-500 to-pink-500' },
    { icon: Settings, label: 'Изменений конфигурации', value: '128', color: 'from-blue-500 to-cyan-500' },
    { icon: Shield, label: 'Проверок безопасности', value: '67', color: 'from-red-500 to-orange-500' },
    { icon: Activity, label: 'Дней активности', value: '234', color: 'from-green-500 to-emerald-500' }
  ];

  // Последние действия
  const recentActions = [
    { 
      action: 'Добавлен новый пользователь', 
      details: 'Иванов А.С. (Эксперт)', 
      time: '2 часа назад',
      icon: User,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      action: 'Обновлены настройки AI', 
      details: 'Модель прогнозирования v2.1', 
      time: '5 часов назад',
      icon: Settings,
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      action: 'Проверка логов безопасности', 
      details: 'Аномалий не обнаружено', 
      time: '8 часов назад',
      icon: Shield,
      color: 'bg-green-100 text-green-600'
    },
    { 
      action: 'Резервное копирование БД', 
      details: 'Успешно завершено (2.4 ГБ)', 
      time: '12 часов назад',
      icon: Database,
      color: 'bg-cyan-100 text-cyan-600'
    }
  ];

  // Достижения
  const achievements = [
    { icon: Award, title: 'Опытный администратор', description: '6+ месяцев работы', earned: true },
    { icon: Shield, title: 'Защитник системы', description: 'Предотвращено 50+ угроз', earned: true },
    { icon: TrendingUp, title: 'Оптимизатор', description: 'Улучшение производительности на 30%', earned: true },
    { icon: Users, title: 'Менеджер команды', description: '100+ пользователей', earned: false }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    alert('Профиль успешно обновлён!');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'security', label: 'Безопасность', icon: Lock },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'activity', label: 'Активность', icon: Activity }
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <User className="w-8 h-8 mr-3" />
                  Профиль администратора
                </h1>
                <p className="text-purple-100">Управление личным профилем и настройками</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    `${profileData.firstName[0]}${profileData.lastName[0]}`
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Администратор
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{profileData.position}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span className="text-sm">{profileData.organization}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{profileData.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-3xl font-bold text-purple-600">234</p>
                  <p className="text-sm text-gray-600">Дней активности</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-3xl font-bold text-blue-600">1,247</p>
                  <p className="text-sm text-gray-600">Действий</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {activityStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`bg-gradient-to-br ${stat.color} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Личная информация</h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Редактировать
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Сохранить
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Отмена
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Фамилия
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Организация
                      </label>
                      <input
                        type="text"
                        value={profileData.organization}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Должность
                      </label>
                      <input
                        type="text"
                        value={profileData.position}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Местоположение
                      </label>
                      <input
                        type="text"
                        value={profileData.location}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Часовой пояс
                      </label>
                      <select
                        value={profileData.timezone}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        <option value="UTC+6 (Астана)">UTC+6 (Астана)</option>
                        <option value="UTC+5 (Алматы)">UTC+5 (Алматы)</option>
                        <option value="UTC+3 (Москва)">UTC+3 (Москва)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Язык интерфейса
                      </label>
                      <select
                        value={profileData.language}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        <option value="ru">Русский</option>
                        <option value="kz">Қазақша</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Безопасность и пароль</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Текущий пароль
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Введите текущий пароль"
                        />
                        <button
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Новый пароль
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Введите новый пароль"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Подтвердите новый пароль
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Повторите новый пароль"
                        />
                        <button
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Изменить пароль
                    </button>
                  </div>

                  <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-800 mb-1">Рекомендации по безопасности</p>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Используйте пароль длиной не менее 12 символов</li>
                          <li>• Включайте буквы в разных регистрах, цифры и специальные символы</li>
                          <li>• Не используйте один и тот же пароль для разных сервисов</li>
                          <li>• Меняйте пароль каждые 3-6 месяцев</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Настройки уведомлений</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center">
                          <Bell className="w-5 h-5 text-purple-600 mr-3" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {key === 'emailNotifications' && 'Email уведомления'}
                              {key === 'systemAlerts' && 'Системные оповещения'}
                              {key === 'userActions' && 'Действия пользователей'}
                              {key === 'dataUpdates' && 'Обновления данных'}
                              {key === 'securityAlerts' && 'Уведомления о безопасности'}
                              {key === 'weeklyReports' && 'Еженедельные отчёты'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {key === 'emailNotifications' && 'Получать уведомления на email'}
                              {key === 'systemAlerts' && 'Критические системные сообщения'}
                              {key === 'userActions' && 'Уведомления о действиях пользователей'}
                              {key === 'dataUpdates' && 'Изменения в базе данных'}
                              {key === 'securityAlerts' && 'Предупреждения системы безопасности'}
                              {key === 'weeklyReports' && 'Еженедельная сводка активности'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setNotificationSettings({...notificationSettings, [key]: !value})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-purple-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    Сохранить настройки
                  </button>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">История активности</h3>
                  
                  <div className="space-y-4 mb-8">
                    {recentActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${action.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{action.action}</p>
                            <p className="text-sm text-gray-600">{action.details}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {action.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-bold mb-4">Достижения</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => {
                        const Icon = achievement.icon;
                        return (
                          <div 
                            key={index} 
                            className={`p-4 rounded-lg flex items-center gap-3 ${
                              achievement.earned 
                                ? 'bg-white/20 backdrop-blur-sm' 
                                : 'bg-white/5 backdrop-blur-sm opacity-50'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              achievement.earned ? 'bg-white/30' : 'bg-white/10'
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{achievement.title}</p>
                              <p className="text-sm text-white/80">{achievement.description}</p>
                            </div>
                            {achievement.earned && (
                              <Check className="w-6 h-6 text-white" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Info Footer */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Информация об аккаунте</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Зарегистрирован: 15 марта 2024</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Последний вход: Сегодня в 09:23</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    <span>Всего действий: 1,247</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold">
                  Экспорт данных
                </button>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold">
                  Деактивировать аккаунт
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
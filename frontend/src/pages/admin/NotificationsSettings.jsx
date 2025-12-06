import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Filter,
  Calendar,
  Target,
  Zap,
  Volume2,
  VolumeX,
  Globe,
  Shield,
  Info,
  XCircle,
  Search,
  User,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

const NotificationsSettings = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Шаблоны уведомлений
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Критическое состояние ГТС',
      type: 'critical',
      channels: ['email', 'sms', 'push'],
      recipients: ['admin', 'emergency'],
      subject: 'КРИТИЧНО: Обнаружена проблема на {facility_name}',
      body: 'Обнаружено критическое состояние на объекте {facility_name} ({region}). Техническое состояние: категория {condition}. Требуется немедленное вмешательство.',
      enabled: true,
      triggerType: 'condition',
      lastSent: '2024-12-06 10:30:00',
      sentCount: 23
    },
    {
      id: 2,
      name: 'Высокий приоритет обследования',
      type: 'warning',
      channels: ['email', 'push'],
      recipients: ['expert', 'admin'],
      subject: 'Требуется обследование: {object_name}',
      body: 'Объект {object_name} имеет высокий приоритет обследования (score: {priority_score}). Рекомендуется провести инспекцию в ближайшее время.',
      enabled: true,
      triggerType: 'priority',
      lastSent: '2024-12-06 09:15:00',
      sentCount: 156
    },
    {
      id: 3,
      name: 'Устаревший паспорт объекта',
      type: 'info',
      channels: ['email'],
      recipients: ['expert'],
      subject: 'Обновите паспорт объекта {object_name}',
      body: 'Паспорт объекта {object_name} устарел (дата: {passport_date}, возраст: {passport_age} лет). Пожалуйста, обновите информацию.',
      enabled: true,
      triggerType: 'passport_age',
      lastSent: '2024-12-05 16:45:00',
      sentCount: 89
    },
    {
      id: 4,
      name: 'Еженедельный отчёт',
      type: 'info',
      channels: ['email'],
      recipients: ['admin', 'expert'],
      subject: 'Еженедельный отчёт GidroAtlas ({date_range})',
      body: 'Добрый день! Высылаем еженедельный отчёт по состоянию водных ресурсов за период {date_range}. Всего объектов: {total_objects}. Требуют внимания: {attention_needed}.',
      enabled: true,
      triggerType: 'schedule',
      lastSent: '2024-12-02 08:00:00',
      sentCount: 12
    },
    {
      id: 5,
      name: 'Новый пользователь зарегистрирован',
      type: 'success',
      channels: ['email'],
      recipients: ['admin'],
      subject: 'Новый пользователь: {user_name}',
      body: 'В системе зарегистрирован новый пользователь {user_name} ({user_email}) с ролью {user_role}.',
      enabled: true,
      triggerType: 'user_created',
      lastSent: '2024-12-04 14:20:00',
      sentCount: 45
    },
    {
      id: 6,
      name: 'Изменение данных объекта',
      type: 'info',
      channels: ['push'],
      recipients: ['expert', 'admin'],
      subject: 'Обновлён объект: {object_name}',
      body: 'Пользователь {user_name} внёс изменения в объект {object_name}. Изменённые поля: {changed_fields}.',
      enabled: false,
      triggerType: 'object_updated',
      lastSent: '2024-12-06 11:50:00',
      sentCount: 234
    }
  ]);

  // История отправленных уведомлений
  const notificationHistory = [
    {
      id: 1,
      template: 'Критическое состояние ГТС',
      recipient: 'admin@hydroatlas.kz',
      channel: 'email',
      status: 'delivered',
      sentAt: '2024-12-06 10:30:00',
      subject: 'КРИТИЧНО: Обнаружена проблема на Бухтарминская ГЭС'
    },
    {
      id: 2,
      template: 'Высокий приоритет обследования',
      recipient: 'expert@hydroatlas.kz',
      channel: 'push',
      status: 'delivered',
      sentAt: '2024-12-06 09:15:00',
      subject: 'Требуется обследование: Озеро Балхаш'
    },
    {
      id: 3,
      template: 'Критическое состояние ГТС',
      recipient: '+77051234567',
      channel: 'sms',
      status: 'failed',
      sentAt: '2024-12-06 08:45:00',
      subject: 'SMS уведомление',
      error: 'Номер недоступен'
    },
    {
      id: 4,
      template: 'Устаревший паспорт объекта',
      recipient: 'expert2@hydroatlas.kz',
      channel: 'email',
      status: 'delivered',
      sentAt: '2024-12-05 16:45:00',
      subject: 'Обновите паспорт объекта Канал Иртыш-Караганда'
    },
    {
      id: 5,
      template: 'Еженедельный отчёт',
      recipient: 'admin@hydroatlas.kz',
      channel: 'email',
      status: 'delivered',
      sentAt: '2024-12-02 08:00:00',
      subject: 'Еженедельный отчёт GidroAtlas (25.11-01.12)'
    }
  ];

  // Общие настройки уведомлений
  const [generalSettings, setGeneralSettings] = useState({
    enableNotifications: true,
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSmsNotifications: false,
    batchNotifications: true,
    batchInterval: 30,
    maxNotificationsPerHour: 100,
    enableQuietHours: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    defaultLanguage: 'ru'
  });

  // Статистика
  const stats = [
    {
      label: 'Отправлено сегодня',
      value: '234',
      change: '+12%',
      icon: Send,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Успешных доставок',
      value: '98.5%',
      change: '+2.1%',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Активных шаблонов',
      value: '5',
      change: '0',
      icon: Bell,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Ошибок доставки',
      value: '3',
      change: '-50%',
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500'
    }
  ];

  const tabs = [
    { id: 'templates', label: 'Шаблоны', icon: MessageSquare, count: templates.length },
    { id: 'history', label: 'История', icon: Clock, count: notificationHistory.length },
    { id: 'settings', label: 'Настройки', icon: Settings, count: 0 },
    { id: 'recipients', label: 'Получатели', icon: Users, count: 0 }
  ];

  const getTypeStyles = (type) => {
    switch (type) {
      case 'critical':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: AlertTriangle };
      case 'warning':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: AlertCircle };
      case 'success':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: CheckCircle };
      case 'info':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: Info };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: Bell };
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'push': return Smartphone;
      default: return Bell;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'delivered':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Доставлено', icon: CheckCircle };
      case 'failed':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Ошибка', icon: XCircle };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Ожидание', icon: Clock };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Неизвестно', icon: Info };
    }
  };

  const handleToggleTemplate = (id) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот шаблон?')) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Bell className="w-8 h-8 mr-3" />
                  Система уведомлений
                </h1>
                <p className="text-purple-100">Управление шаблонами и настройками уведомлений</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors font-semibold shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Создать шаблон</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`bg-gradient-to-br ${stat.color} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                    {stat.change !== '0' && (
                      <div className="mt-3 text-white/90 text-sm font-semibold">
                        {stat.change}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[150px] px-6 py-4 font-semibold transition-colors border-b-4 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600 bg-purple-50'
                        : 'border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Icon className="w-5 h-5 mb-2" />
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                          activeTab === tab.id
                            ? 'bg-purple-200 text-purple-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Поиск шаблонов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Templates List */}
              <div className="grid grid-cols-1 gap-6">
                {filteredTemplates.map((template) => {
                  const typeStyles = getTypeStyles(template.type);
                  const TypeIcon = typeStyles.icon;

                  return (
                    <div key={template.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border ${typeStyles.bg} ${typeStyles.text} ${typeStyles.border}`}>
                              <TypeIcon className="w-4 h-4" />
                              <span className="text-xs font-semibold capitalize">{template.type}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-semibold">Тема:</span> {template.subject}
                          </p>
                        </div>
                        
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={template.enabled}
                            onChange={() => handleToggleTemplate(template.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-700">{template.body}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">Каналы доставки:</p>
                          <div className="flex flex-wrap gap-2">
                            {template.channels.map((channel) => {
                              const ChannelIcon = getChannelIcon(channel);
                              return (
                                <div key={channel} className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">
                                  <ChannelIcon className="w-4 h-4" />
                                  <span className="text-xs font-semibold capitalize">{channel}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">Получатели:</p>
                          <div className="flex flex-wrap gap-2">
                            {template.recipients.map((recipient) => (
                              <div key={recipient} className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-lg">
                                <Users className="w-4 h-4" />
                                <span className="text-xs font-semibold capitalize">{recipient}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Последняя: {template.lastSent}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Send className="w-4 h-4" />
                            <span>Отправлено: {template.sentCount}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedTemplate(template)}
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setSelectedTemplate(template)}
                            className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Время
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Шаблон
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Получатель
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Канал
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Тема
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {notificationHistory.map((notification) => {
                      const ChannelIcon = getChannelIcon(notification.channel);
                      const statusStyles = getStatusStyles(notification.status);
                      const StatusIcon = statusStyles.icon;

                      return (
                        <tr key={notification.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{notification.sentAt}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-gray-900">{notification.template}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{notification.recipient}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <ChannelIcon className="w-4 h-4 text-purple-600" />
                              <span className="text-sm capitalize">{notification.channel}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full ${statusStyles.bg} ${statusStyles.text}`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="text-xs font-semibold">{statusStyles.label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{notification.subject}</span>
                            {notification.error && (
                              <p className="text-xs text-red-600 mt-1">Ошибка: {notification.error}</p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                  <Settings className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Общие настройки</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Включить систему уведомлений</p>
                      <p className="text-sm text-gray-600">Глобальное включение/выключение всех уведомлений</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generalSettings.enableNotifications}
                        onChange={(e) => setGeneralSettings({...generalSettings, enableNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Email уведомления</p>
                      <p className="text-sm text-gray-600">Отправка уведомлений на электронную почту</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generalSettings.enableEmailNotifications}
                        onChange={(e) => setGeneralSettings({...generalSettings, enableEmailNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Push уведомления</p>
                      <p className="text-sm text-gray-600">Браузерные уведомления</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generalSettings.enablePushNotifications}
                        onChange={(e) => setGeneralSettings({...generalSettings, enablePushNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">SMS уведомления</p>
                      <p className="text-sm text-gray-600">Отправка SMS на мобильные номера</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generalSettings.enableSmsNotifications}
                        onChange={(e) => setGeneralSettings({...generalSettings, enableSmsNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Пакетная отправка</p>
                      <p className="text-sm text-gray-600">Группировать похожие уведомления</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generalSettings.batchNotifications}
                        onChange={(e) => setGeneralSettings({...generalSettings, batchNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Тихий режим</p>
                      <p className="text-sm text-gray-600">Не отправлять уведомления в ночное время</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generalSettings.enableQuietHours}
                        onChange={(e) => setGeneralSettings({...generalSettings, enableQuietHours: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Интервал пакетной отправки (минуты)
                    </label>
                    <input
                      type="number"
                      value={generalSettings.batchInterval}
                      onChange={(e) => setGeneralSettings({...generalSettings, batchInterval: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Макс. уведомлений в час
                    </label>
                    <input
                      type="number"
                      value={generalSettings.maxNotificationsPerHour}
                      onChange={(e) => setGeneralSettings({...generalSettings, maxNotificationsPerHour: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Тихий режим: начало
                    </label>
                    <input
                      type="time"
                      value={generalSettings.quietHoursStart}
                      onChange={(e) => setGeneralSettings({...generalSettings, quietHoursStart: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Тихий режим: конец
                    </label>
                    <input
                      type="time"
                      value={generalSettings.quietHoursEnd}
                      onChange={(e) => setGeneralSettings({...generalSettings, quietHoursEnd: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Язык уведомлений по умолчанию
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
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-semibold">
                    <Save className="w-5 h-5" />
                    <span>Сохранить настройки</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recipients Tab */}
          {activeTab === 'recipients' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Группы получателей</h2>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-semibold">
                    <Plus className="w-5 h-5" />
                    <span>Добавить группу</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Admin Group */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Администраторы</h3>
                          <p className="text-sm text-gray-600">3 пользователя</p>
                        </div>
                      </div>
                      <button className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span>admin@hydroatlas.kz</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Активен</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span>admin2@hydroatlas.kz</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Активен</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span>admin3@hydroatlas.kz</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Активен</span>
                      </div>
                    </div>
                  </div>

                  {/* Expert Group */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Эксперты</h3>
                          <p className="text-sm text-gray-600">5 пользователей</p>
                        </div>
                      </div>
                      <button className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span>expert@hydroatlas.kz</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Активен</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span>expert2@hydroatlas.kz</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Активен</span>
                      </div>
                      <div className="text-sm text-gray-500 text-center py-2">
                        +3 ещё...
                      </div>
                    </div>
                  </div>

                  {/* Emergency Group */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">МЧС</h3>
                          <p className="text-sm text-gray-600">2 пользователя</p>
                        </div>
                      </div>
                      <button className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span>mchs@hydroatlas.kz</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Активен</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span>emergency@hydroatlas.kz</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Активен</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Group */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Пользовательская группа</h3>
                          <p className="text-sm text-gray-600">0 пользователей</p>
                        </div>
                      </div>
                      <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Нет пользователей</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Template Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Создать новый шаблон</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="w-10 h-10 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Название шаблона
                  </label>
                  <input
                    type="text"
                    placeholder="Например: Критическое состояние ГТС"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Тип уведомления
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="critical">Критическое</option>
                    <option value="warning">Предупреждение</option>
                    <option value="info">Информация</option>
                    <option value="success">Успех</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Тема письма
                  </label>
                  <input
                    type="text"
                    placeholder="Используйте переменные: {object_name}, {region}"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Текст уведомления
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Напишите текст уведомления. Доступные переменные: {object_name}, {region}, {condition}, {priority_score}"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Каналы доставки
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </label>
                    <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <Smartphone className="w-4 h-4" />
                      <span>Push</span>
                    </label>
                    <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <MessageSquare className="w-4 h-4" />
                      <span>SMS</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Получатели
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <span>Администраторы</span>
                    </label>
                    <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <span>Эксперты</span>
                    </label>
                    <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <span>МЧС</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Отмена
                  </button>
                  <button className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-semibold">
                    <Plus className="w-5 h-5" />
                    <span>Создать шаблон</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NotificationsSettings;
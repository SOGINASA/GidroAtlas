import React, { useState, useEffect } from 'react';
import MinimalHeader from '../../components/layout/MinimalHeader';
import BottomNavigation from '../../components/layout/BottomNavigation';
import EmergencyDesktopSidebar from '../../components/layout/EmergencyDesktopSidebar';
import EmergencyDesktopTopHeader from '../../components/layout/EmergencyDesktopTopHeader';
import { useNotifications } from '../../hooks/useNotifications';
import {
  sendBroadcastNotification,
  getUsersForNotification,
  getNotificationStats,
  getAllNotifications
} from '../../services/notificationService';

const EmergencyNotifications = () => {
  const { notifications, markNotificationAsRead, removeNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('send'); // send or history
  const [filterPriority, setFilterPriority] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    important: 0
  });
  const [sentHistory, setSentHistory] = useState([]);

  // Form state
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    priority: 'high',
    zones: [],
    sendToAll: false
  });

  const zones = ['Центральный', 'Северный', 'Южный', 'Восточный', 'Западный'];

  // Загрузка статистики и истории при монтировании компонента
  useEffect(() => {
    loadStats();
    if (activeTab === 'history') {
      loadSentHistory();
    }
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const result = await getNotificationStats();
      setStats(result.data);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const loadSentHistory = async () => {
    try {
      setLoading(true);
      const result = await getAllNotifications({ limit: 50 });
      // Преобразуем формат данных для истории
      const history = result.data.map(notif => ({
        id: notif.id,
        title: notif.title,
        priority: notif.is_important ? 'critical' : 'high',
        recipients: 1, // TODO: добавить подсчет получателей
        time: formatTime(notif.created_at),
        zones: ['Все районы'] // TODO: добавить информацию о зонах
      }));
      setSentHistory(history);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} мин назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'час' : 'часа'} назад`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'день' : 'дней'} назад`;
    }
  };
  
  const templates = [
    {
      id: 1,
      name: 'Критический уровень воды',
      title: 'Критический уровень воды в реке Ишим',
      message: 'Уровень воды достиг критической отметки. Немедленно следуйте инструкциям МЧС и готовьтесь к эвакуации.',
      priority: 'critical'
    },
    {
      id: 2,
      name: 'Начало эвакуации',
      title: 'Объявлена эвакуация',
      message: 'Началась эвакуация жителей зоны риска. Проверьте ваш статус и следуйте инструкциям спасателей.',
      priority: 'high'
    },
    {
      id: 3,
      name: 'Повышение уровня',
      title: 'Повышение уровня воды',
      message: 'Уровень воды в реке повышается. Рекомендуется подготовиться к возможной эвакуации.',
      priority: 'medium'
    }
  ];

  const handleZoneToggle = (zone) => {
    if (notificationForm.zones.includes(zone)) {
      setNotificationForm({
        ...notificationForm,
        zones: notificationForm.zones.filter(z => z !== zone)
      });
    } else {
      setNotificationForm({
        ...notificationForm,
        zones: [...notificationForm.zones, zone]
      });
    }
  };

  const handleTemplateSelect = (template) => {
    setNotificationForm({
      ...notificationForm,
      title: template.title,
      message: template.message,
      priority: template.priority
    });
  };

  const handleSendNotification = async () => {
    try {
      // Валидация формы
      if (!notificationForm.title.trim()) {
        alert('Пожалуйста, введите заголовок уведомления');
        return;
      }
      if (!notificationForm.message.trim()) {
        alert('Пожалуйста, введите текст уведомления');
        return;
      }
      if (!notificationForm.sendToAll && notificationForm.zones.length === 0) {
        alert('Пожалуйста, выберите хотя бы один район или отметьте "Отправить всем районам"');
        return;
      }

      setLoading(true);

      // Получаем список пользователей для отправки
      let users = [];
      if (notificationForm.sendToAll) {
        users = await getUsersForNotification();
      } else {
        // Получаем пользователей из выбранных зон
        const usersByZone = await Promise.all(
          notificationForm.zones.map(zone => getUsersForNotification({ zone }))
        );
        users = usersByZone.flat();
      }

      if (users.length === 0) {
        alert('Не найдено пользователей для отправки уведомления');
        setLoading(false);
        return;
      }

      // Определяем тип и важность уведомления
      const notificationType = notificationForm.priority === 'critical' ? 'alert' : 'info';
      const isImportant = ['critical', 'high'].includes(notificationForm.priority);

      // Отправляем массовое уведомление
      const result = await sendBroadcastNotification({
        user_ids: users.map(u => u.id),
        type: notificationType,
        title: notificationForm.title,
        message: notificationForm.message,
        is_important: isImportant
      });

      alert(`Уведомление успешно отправлено ${result.data.recipientsCount} получателям!`);

      // Очищаем форму
      setNotificationForm({
        title: '',
        message: '',
        priority: 'high',
        zones: [],
        sendToAll: false
      });

      // Обновляем статистику
      loadStats();

    } catch (error) {
      console.error('Ошибка отправки уведомления:', error);
      alert('Ошибка при отправке уведомления: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical': return 'Критический';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      default: return 'Низкий';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MinimalHeader title="Уведомления" showBack />
      </div>

      {/* Desktop Sidebar */}
      <EmergencyDesktopSidebar />

      {/* Desktop Top Header */}
      <EmergencyDesktopTopHeader />

      {/* Main Content */}
      <main className="pt-16 pb-24 px-4 lg:ml-72 lg:pt-24 lg:pb-8">
        <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">

          {/* Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('send')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'send'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Отправить уведомление
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              История отправок
            </button>
          </div>

          {/* Send Notification Tab */}
          {activeTab === 'send' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Form */}
              <div className="lg:col-span-2 space-y-4">
                {/* Main Form Card */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Создать уведомление</h3>
                  
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                      <input
                        type="text"
                        value={notificationForm.title}
                        onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                        placeholder="Введите заголовок уведомления"
                        className="w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Сообщение</label>
                      <textarea
                        value={notificationForm.message}
                        onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                        placeholder="Введите текст уведомления"
                        rows={5}
                        className="w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">{notificationForm.message.length} / 500 символов</p>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Приоритет</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['critical', 'high', 'medium', 'low'].map((priority) => (
                          <button
                            key={priority}
                            onClick={() => setNotificationForm({ ...notificationForm, priority })}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                              notificationForm.priority === priority
                                ? `${getPriorityColor(priority)} text-white shadow-md`
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {getPriorityLabel(priority)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Zones */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Районы получателей</label>
                      <div className="space-y-2 mb-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.sendToAll}
                            onChange={(e) => setNotificationForm({ ...notificationForm, sendToAll: e.target.checked, zones: e.target.checked ? [] : notificationForm.zones })}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">Отправить всем районам</span>
                        </label>
                      </div>
                      {!notificationForm.sendToAll && (
                        <div className="flex flex-wrap gap-2">
                          {zones.map((zone) => (
                            <button
                              key={zone}
                              onClick={() => handleZoneToggle(zone)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                notificationForm.zones.includes(zone)
                                  ? 'bg-red-600 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {zone}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={handleSendNotification}
                      disabled={loading}
                      className="w-full px-6 py-3 lg:py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Отправка...' : 'Отправить уведомление'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Templates Sidebar */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Шаблоны</h3>
                  <div className="space-y-2">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-gray-900 text-sm">{template.name}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getPriorityColor(template.priority)}`}>
                            {getPriorityLabel(template.priority)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{template.message}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl lg:rounded-2xl shadow-sm border border-red-100 p-4 lg:p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Статистика</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Всего уведомлений</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Непрочитано</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.unread || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Важных</p>
                      <p className="text-2xl font-bold text-red-600">{stats.important || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Filter */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                >
                  <option value="all">Все приоритеты</option>
                  <option value="critical">Критический</option>
                  <option value="high">Высокий</option>
                  <option value="medium">Средний</option>
                  <option value="low">Низкий</option>
                </select>
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              )}

              {/* History List */}
              {!loading && sentHistory.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                  <p className="text-gray-500">История отправленных уведомлений пуста</p>
                </div>
              )}

              {!loading && (
                <div className="space-y-3">
                  {sentHistory.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getPriorityColor(item.priority)}`}>
                              {getPriorityLabel(item.priority)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>{item.recipients} получателей</span>
                            </div>
                            <span>•</span>
                            <span>{item.time}</span>
                            <span>•</span>
                            <span>{item.zones.join(', ')}</span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                          Повторить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default EmergencyNotifications;
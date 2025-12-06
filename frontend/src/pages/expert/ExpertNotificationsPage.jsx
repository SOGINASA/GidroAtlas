import React, { useState } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { Bell, AlertTriangle, Info, CheckCircle, Trash2, Check } from 'lucide-react';

const ExpertNotificationsPage = () => {
  const [filter, setFilter] = useState('all'); // all, unread, read

  // Mock notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Критический уровень воды',
      message: 'Река Иртыш достигла критического уровня 6.2м. Рекомендуется эвакуация прибрежных зон.',
      priority: 'critical',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: 2,
      title: 'Обновление прогноза',
      message: 'AI модель обновила прогноз паводка для Алматинской области. Пик ожидается через 48 часов.',
      priority: 'high',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false
    },
    {
      id: 3,
      title: 'Плановое обследование',
      message: 'Запланировано обследование ГТС "Капшагайская ГЭС" на 15.12.2024',
      priority: 'medium',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    },
    {
      id: 4,
      title: 'Данные датчиков обновлены',
      message: 'Получены новые данные от 12 датчиков. Все показатели в норме.',
      priority: 'low',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true
    }
  ]);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'critical' || priority === 'high') {
      return <AlertTriangle className="w-5 h-5" />;
    }
    return <Info className="w-5 h-5" />;
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">Уведомления</h1>
                <p className="text-sm lg:text-base text-blue-100 mt-1">
                  {unreadCount > 0 ? (
                    <><span className="font-semibold">{unreadCount}</span> непрочитанных</>
                  ) : (
                    'Все уведомления прочитаны'
                  )}
                </p>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all text-sm lg:text-base font-medium backdrop-blur-sm"
                >
                  Отметить все прочитанными
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          
          {/* Filters */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Все ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Непрочитанные ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'read'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Прочитанные ({notifications.length - unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Нет уведомлений
                </h3>
                <p className="text-gray-600">
                  {filter === 'unread'
                    ? 'Все уведомления прочитаны'
                    : filter === 'read'
                    ? 'Нет прочитанных уведомлений'
                    : 'У вас пока нет уведомлений'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border transition-all hover:shadow-md ${
                    notification.read 
                      ? 'border-gray-100' 
                      : 'border-blue-200 bg-blue-50/30'
                  }`}
                >
                  <div className="p-4 lg:p-6">
                    <div className="flex items-start space-x-4">
                      
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white ${getPriorityColor(notification.priority)}`}>
                        {getPriorityIcon(notification.priority)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <span className="text-xs lg:text-sm text-gray-500 ml-4 flex-shrink-0">
                            {new Date(notification.timestamp).toLocaleString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        <p className="text-sm lg:text-base text-gray-700 mb-4">
                          {notification.message}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs lg:text-sm font-medium flex items-center space-x-1"
                            >
                              <Check className="w-4 h-4" />
                              <span>Прочитано</span>
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs lg:text-sm font-medium flex items-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Удалить</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertNotificationsPage;
import React, { useState, useEffect } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { Bell, AlertTriangle, Info, CheckCircle, Trash2, Check } from 'lucide-react';
import {
  getAllNotifications,
  markAsRead as markNotificationAsRead,
  markAllAsRead as markAllNotificationsAsRead,
  deleteNotification
} from '../../services/notificationService';

const ExpertNotificationsPage = () => {
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications({ limit: 100 });
      const notifs = response.data || [];

      setNotifications(notifs);
      setUnreadCount(response.unreadCount || notifs.filter(n => !n.read && !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Если не авторизован, показываем пустой список
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read && !notif.is_read;
    if (filter === 'read') return notif.read || notif.is_read;
    return true;
  });

  const getPriorityColor = (priority) => {
    const type = priority || 'info';
    switch (type) {
      case 'danger':
      case 'critical': return 'bg-red-500';
      case 'warning':
      case 'high': return 'bg-orange-500';
      case 'evacuation':
      case 'medium': return 'bg-yellow-500';
      case 'sensor_update':
        return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityIcon = (priority) => {
    const type = priority || 'info';
    if (type === 'danger' || type === 'critical' || type === 'warning' || type === 'evacuation') {
      return <AlertTriangle className="w-5 h-5" />;
    }
    return <Info className="w-5 h-5" />;
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);
      const notification = notifications.find(n => n.id === id);
      setNotifications(notifications.filter(n => n.id !== id));
      if (notification && !notification.read && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
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

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Загрузка уведомлений...</p>
            </div>
          )}

          {/* Filters */}
          {!loading && (
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
          )}

          {/* Notifications List */}
          {!loading && (
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
          )}
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertNotificationsPage;
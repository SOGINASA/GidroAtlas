import React, { useState, useEffect } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { Bell, Send, Users, MapPin, AlertTriangle, Clock, CheckCircle, Loader } from 'lucide-react';
import { sendBroadcast, getUsersForNotification } from '../../services/notificationService';

const EmergencyNotifications = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sentNotifications, setSentNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [notificationForm, setNotificationForm] = useState({
    type: 'warning',
    title: '',
    message: '',
    roleFilter: 'all',
    is_important: false
  });

  // Загрузка пользователей при монтировании
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userData = await getUsersForNotification();
      setUsers(userData);
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
    }
  };

  const templates = [
    {
      id: 1,
      name: 'Эвакуация - Начало',
      type: 'danger',
      title: 'СРОЧНАЯ ЭВАКУАЦИЯ',
      message: 'Начата экстренная эвакуация в связи с повышением уровня воды. Следуйте указаниям служб МЧС. Пункты сбора: [АДРЕСА]'
    },
    {
      id: 2,
      name: 'Предупреждение о паводке',
      type: 'warning',
      title: 'Предупреждение о возможном паводке',
      message: 'В ближайшие [ЧАСЫ] ожидается повышение уровня воды. Рекомендуется подготовиться к возможной эвакуации.'
    },
    {
      id: 3,
      name: 'Информационное сообщение',
      type: 'info',
      title: 'Информация для населения',
      message: '[ВАШЕ СООБЩЕНИЕ]'
    },
    {
      id: 4,
      name: 'Отбой тревоги',
      type: 'info',
      title: 'Ситуация нормализована',
      message: 'Угроза миновала. Можно вернуться к обычной жизнедеятельности. Благодарим за понимание.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!notificationForm.title || !notificationForm.message) {
        setError('Пожалуйста, заполните заголовок и сообщение');
        setLoading(false);
        return;
      }

      const broadcastData = {
        type: notificationForm.type,
        title: notificationForm.title,
        message: notificationForm.message,
        role_filter: notificationForm.roleFilter,
        is_important: notificationForm.is_important
      };

      const response = await sendBroadcast(broadcastData);

      const newNotification = {
        id: Date.now(),
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type,
        recipients: response.data.recipientsCount || 0,
        delivered: response.data.recipientsCount || 0,
        sentAt: new Date().toLocaleString('ru-RU'),
        status: 'delivered',
        is_important: notificationForm.is_important
      };

      setSentNotifications([newNotification, ...sentNotifications]);
      setSuccess('Уведомление успешно отправлено!');
      
      // Очистка формы
      setNotificationForm({
        type: 'warning',
        title: '',
        message: '',
        roleFilter: 'all',
        is_important: false
      });

      // Переход на вкладку истории через 1 секунду
      setTimeout(() => setActiveTab('history'), 1000);
    } catch (err) {
      setError(err.message || 'Ошибка при отправке уведомления');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'danger': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'evacuation': return 'bg-red-100 text-red-800 border-red-300';
      case 'sensor_update': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'danger': return 'Опасность';
      case 'warning': return 'Предупреждение';
      case 'info': return 'Информация';
      case 'evacuation': return 'Эвакуация';
      case 'sensor_update': return 'Обновление датчика';
      default: return 'Обычное';
    }
  };

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Bell className="w-8 h-8 mr-3" />
              Система массовых уведомлений
            </h1>
            <p className="text-orange-100">Оповещение населения о чрезвычайных ситуациях</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Отправлено сегодня</p>
                  <p className="text-2xl font-bold text-gray-900">{sentNotifications.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Доставлено</p>
                  <p className="text-2xl font-bold text-green-600">
                    {sentNotifications.reduce((sum, n) => sum + n.delivered, 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Получателей</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {sentNotifications.reduce((sum, n) => sum + n.recipients, 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Критических</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {sentNotifications.filter(n => n.type === 'critical').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6">
            <div className="border-b flex">
              <button
                onClick={() => setActiveTab('send')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'send' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'
                }`}
              >
                Отправить уведомление
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'history' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'
                }`}
              >
                История ({sentNotifications.length})
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'templates' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'
                }`}
              >
                Шаблоны ({templates.length})
              </button>
            </div>

            <div className="p-6">
              
              {/* Error & Success Messages */}
              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
                  {success}
                </div>
              )}
              
              {/* Send Form */}
              {activeTab === 'send' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Тип уведомления *
                      </label>
                      <select
                        value={notificationForm.type}
                        onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="danger">🚨 Опасность</option>
                        <option value="warning">⚠️ Предупреждение</option>
                        <option value="info">ℹ️ Информация</option>
                        <option value="evacuation">🚪 Эвакуация</option>
                        <option value="sensor_update">📊 Обновление датчика</option>
                      </select>
                    </div>

                    {/* Target Group */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Целевая группа *
                      </label>
                      <select
                        value={notificationForm.roleFilter}
                        onChange={(e) => setNotificationForm({...notificationForm, roleFilter: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">Все пользователи</option>
                        <option value="resident">Только жители</option>
                        <option value="emergency">Только МЧС</option>
                      </select>
                    </div>
                  </div>

                  {/* Important Flag */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="important"
                      checked={notificationForm.is_important}
                      onChange={(e) => setNotificationForm({...notificationForm, is_important: e.target.checked})}
                      className="w-5 h-5 border border-gray-300 rounded"
                    />
                    <label htmlFor="important" className="text-sm font-medium text-gray-700">
                      ⭐ Отметить как важное
                    </label>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Заголовок *
                    </label>
                    <input
                      type="text"
                      value={notificationForm.title}
                      onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                      placeholder="Краткий заголовок уведомления"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Сообщение *
                    </label>
                    <textarea
                      value={notificationForm.message}
                      onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                      placeholder="Полный текст уведомления для населения"
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {notificationForm.message.length} символов
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Отправка...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Отправить уведомление</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotificationForm({
                        type: 'warning',
                        title: '',
                        message: '',
                        roleFilter: 'all',
                        is_important: false
                      })}
                      className="px-6 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Очистить
                    </button>
                  </div>
                </form>
              )}

              {/* History */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  {sentNotifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Отправленных уведомлений нет</p>
                    </div>
                  ) : (
                    sentNotifications.map((notif) => (
                      <div key={notif.id} className="border-2 rounded-xl p-6 hover:border-orange-300 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getTypeColor(notif.type)}`}>
                                {getTypeLabel(notif.type)}
                              </span>
                              {notif.is_important && <span className="text-lg">⭐</span>}
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {notif.sentAt}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{notif.title}</h3>
                            <p className="text-gray-600 mb-3">{notif.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {notif.recipients.toLocaleString()} получателей
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Статус доставки</span>
                            <span className="text-sm font-bold text-green-600">
                              {notif.recipients > 0 ? '100%' : '0%'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-green-500 h-3 transition-all"
                              style={{ width: notif.recipients > 0 ? '100%' : '0%' }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Доставлено: {notif.delivered.toLocaleString()} из {notif.recipients.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Templates */}
              {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div key={template.id} className="border-2 rounded-xl p-6 hover:border-orange-300 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg">{template.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getTypeColor(template.type)}`}>
                          {getTypeLabel(template.type)}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="font-semibold text-sm text-gray-900 mb-2">{template.title}</p>
                        <p className="text-sm text-gray-600">{template.message}</p>
                      </div>
                      <button
                        onClick={() => {
                          setNotificationForm({
                            ...notificationForm,
                            type: template.type,
                            title: template.title,
                            message: template.message
                          });
                          setActiveTab('send');
                        }}
                        className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                      >
                        Использовать шаблон
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default EmergencyNotifications;
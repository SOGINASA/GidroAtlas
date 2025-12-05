import React, { useState } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { Bell, Send, Users, MapPin, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const EmergencyNotifications = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [notificationForm, setNotificationForm] = useState({
    type: 'warning',
    title: '',
    message: '',
    region: 'all',
    targetGroup: 'all',
    priority: 'medium'
  });

  const sentNotifications = [
    {
      id: 1,
      title: 'Экстренное предупреждение: Иртыш',
      message: 'Превышен критический уровень воды. Рекомендуется эвакуация.',
      type: 'critical',
      region: 'Павлодарская область',
      recipients: 15000,
      delivered: 14850,
      sentAt: '2024-12-05 14:30',
      status: 'delivered'
    },
    {
      id: 2,
      title: 'Предупреждение о подъёме уровня воды',
      message: 'Ожидается повышение уровня воды в Реке Урал в течение 24 часов.',
      type: 'warning',
      region: 'Западно-Казахстанская область',
      recipients: 8000,
      delivered: 7920,
      sentAt: '2024-12-05 12:15',
      status: 'delivered'
    },
    {
      id: 3,
      title: 'Информация о плановом ремонте ГЭС',
      message: 'Капшагайская ГЭС будет на плановом ремонте 10-12 декабря.',
      type: 'info',
      region: 'Алматинская область',
      recipients: 5000,
      delivered: 4980,
      sentAt: '2024-12-05 10:00',
      status: 'delivered'
    },
    {
      id: 4,
      title: 'Завершение эвакуации',
      message: 'Эвакуация в населённом пункте Затобольск завершена успешно.',
      type: 'success',
      region: 'Северо-Казахстанская область',
      recipients: 2500,
      delivered: 2500,
      sentAt: '2024-12-04 18:45',
      status: 'delivered'
    }
  ];

  const templates = [
    {
      id: 1,
      name: 'Эвакуация - Начало',
      type: 'critical',
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
      type: 'success',
      title: 'Ситуация нормализована',
      message: 'Угроза миновала. Можно вернуться к обычной жизнедеятельности. Благодарим за понимание.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Отправка уведомления:', notificationForm);
    alert('Уведомление отправлено!');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'success': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'critical': return 'Критическое';
      case 'warning': return 'Предупреждение';
      case 'info': return 'Информация';
      case 'success': return 'Успешно';
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
                        <option value="critical">🚨 Критическое</option>
                        <option value="warning">⚠️ Предупреждение</option>
                        <option value="info">ℹ️ Информация</option>
                        <option value="success">✅ Успешно</option>
                      </select>
                    </div>

                    {/* Region */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Регион *
                      </label>
                      <select
                        value={notificationForm.region}
                        onChange={(e) => setNotificationForm({...notificationForm, region: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">Вся страна</option>
                        <option value="almaty">Алматинская область</option>
                        <option value="pavlodar">Павлодарская область</option>
                        <option value="vko">ВКО</option>
                        <option value="zko">ЗКО</option>
                        <option value="sko">СКО</option>
                      </select>
                    </div>

                    {/* Target Group */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Целевая группа *
                      </label>
                      <select
                        value={notificationForm.targetGroup}
                        onChange={(e) => setNotificationForm({...notificationForm, targetGroup: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">Все жители</option>
                        <option value="zone">Только в зоне риска</option>
                        <option value="registered">Зарегистрированные</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Приоритет доставки *
                      </label>
                      <select
                        value={notificationForm.priority}
                        onChange={(e) => setNotificationForm({...notificationForm, priority: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="high">Высокий (немедленно)</option>
                        <option value="medium">Средний (в течение 5 мин)</option>
                        <option value="low">Низкий (в течение часа)</option>
                      </select>
                    </div>
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
                      {notificationForm.message.length} / 500 символов
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      <span>Отправить уведомление</span>
                    </button>
                    <button
                      type="button"
                      className="px-6 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Предпросмотр
                    </button>
                  </div>
                </form>
              )}

              {/* History */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  {sentNotifications.map((notif) => (
                    <div key={notif.id} className="border-2 rounded-xl p-6 hover:border-orange-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getTypeColor(notif.type)}`}>
                              {getTypeLabel(notif.type)}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {notif.sentAt}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{notif.title}</h3>
                          <p className="text-gray-600 mb-3">{notif.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {notif.region}
                            </span>
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
                            {Math.round((notif.delivered / notif.recipients) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-green-500 h-3 transition-all"
                            style={{ width: `${(notif.delivered / notif.recipients) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Доставлено: {notif.delivered.toLocaleString()} из {notif.recipients.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
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
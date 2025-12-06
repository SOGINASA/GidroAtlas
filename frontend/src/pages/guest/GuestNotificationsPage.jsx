import React, { useState } from 'react';
import GuestLayout from '../../components/navigation/guest/GuestLayout';
import { Bell, AlertCircle, Info, CheckCircle, X, Lock } from 'lucide-react';

const GuestNotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Mock публичные уведомления (доступные гостям)
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'Плановое обслуживание системы',
      message: 'В период с 02:00 до 04:00 (GMT+6) 10 декабря будет проведено плановое техническое обслуживание. Возможны кратковременные перебои в работе.',
      date: '2024-12-05T14:30:00',
      isPublic: true,
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Повышенный уровень воды - Река Иртыш',
      message: 'Зафиксировано повышение уровня воды в реке Иртыш в Восточно-Казахстанской области. Рекомендуется соблюдать осторожность при посещении прибрежных зон.',
      date: '2024-12-04T09:15:00',
      isPublic: true,
      read: false,
      region: 'Восточно-Казахстанская область'
    },
    {
      id: 3,
      type: 'info',
      title: 'Обновление данных - Озеро Балхаш',
      message: 'Обновлена информация о качестве воды в озере Балхаш по результатам мониторинга за ноябрь 2024 года.',
      date: '2024-12-03T11:20:00',
      isPublic: true,
      read: true,
      region: 'Алматинская область'
    },
    {
      id: 4,
      type: 'success',
      title: 'Завершён ремонт - Капшагайская ГЭС',
      message: 'Успешно завершены плановые ремонтные работы на Капшагайской ГЭС. Объект работает в штатном режиме.',
      date: '2024-12-02T16:45:00',
      isPublic: true,
      read: true,
      region: 'Алматинская область'
    }
  ];

  const lockedNotifications = [
    'Критические предупреждения системы',
    'Персональные уведомления',
    'Отчёты о проведённых обследованиях',
    'AI-прогнозы и предсказания',
    'Уведомления о приоритетных объектах',
    'Технические паспорта и документы'
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeConfig = (type) => {
    const configs = {
      info: {
        icon: Info,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        iconColor: 'text-blue-600',
        borderColor: 'border-blue-200'
      },
      warning: {
        icon: AlertCircle,
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        iconColor: 'text-amber-600',
        borderColor: 'border-amber-200'
      },
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        iconColor: 'text-green-600',
        borderColor: 'border-green-200'
      }
    };
    return configs[type] || configs.info;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Только что';
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <GuestLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">Уведомления</h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm lg:text-base text-gray-300">
              Публичные уведомления и объявления системы
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Всего</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Непрочитанные</p>
              <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Важные</p>
              <p className="text-2xl font-bold text-amber-600">
                {notifications.filter(n => n.type === 'warning').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Информация</p>
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.type === 'info' || n.type === 'success').length}
              </p>
            </div>
          </div>

          {/* Locked Features Notice */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
            <div className="flex items-start space-x-4">
              <Lock className="w-8 h-8 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Ограниченный доступ</h3>
                <p className="text-blue-100 mb-4">
                  Гостевой режим показывает только публичные уведомления. Для доступа к персональным уведомлениям, критическим предупреждениям и AI-прогнозам необходима авторизация.
                </p>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Войти в систему
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Публичные уведомления</h2>
            
            {notifications.map((notification) => {
              const config = getTypeConfig(notification.type);
              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  onClick={() => setSelectedNotification(notification)}
                  className={`bg-white rounded-xl shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                    notification.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'
                  }`}
                >
                  <div className="p-4 lg:p-6">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${config.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                            )}
                          </h3>
                          <span className="text-sm text-gray-500 flex-shrink-0 ml-4">
                            {formatDate(notification.date)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          {notification.region && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              📍 {notification.region}
                            </span>
                          )}
                          <button className="text-sm text-gray-600 hover:text-gray-900 font-medium ml-auto">
                            Подробнее →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Locked Features List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900">Недоступно гостям</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lockedNotifications.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-3 h-3 text-gray-400" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Войдите как эксперт или представитель МЧС для полного доступа
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all"
              >
                Авторизоваться
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Details Modal */}
      {selectedNotification && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
            onClick={() => setSelectedNotification(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 animate-slideUp overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className={`p-6 ${getTypeConfig(selectedNotification.type).bgColor} border-b ${getTypeConfig(selectedNotification.type).borderColor}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-14 h-14 rounded-xl ${getTypeConfig(selectedNotification.type).bgColor} border-2 ${getTypeConfig(selectedNotification.type).borderColor} flex items-center justify-center flex-shrink-0`}>
                    {React.createElement(getTypeConfig(selectedNotification.type).icon, {
                      className: `w-7 h-7 ${getTypeConfig(selectedNotification.type).iconColor}`
                    })}
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-xl font-bold mb-1 ${getTypeConfig(selectedNotification.type).textColor}`}>
                      {selectedNotification.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {formatDate(selectedNotification.date)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/80 transition-colors flex-shrink-0 ml-2"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Region */}
              {selectedNotification.region && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                    📍 {selectedNotification.region}
                  </span>
                  <span className={`px-3 py-1 rounded-full font-medium ${getTypeConfig(selectedNotification.type).bgColor} ${getTypeConfig(selectedNotification.type).textColor}`}>
                    {selectedNotification.type === 'warning' ? 'Важное' : 
                     selectedNotification.type === 'success' ? 'Успешно' : 'Информация'}
                  </span>
                </div>
              )}

              {/* Message */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Для гостей</p>
                    <p className="text-sm text-blue-700">
                      Это публичное уведомление. Авторизованные пользователи имеют доступ к дополнительной информации, техническим деталям и возможности подписки на уведомления.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                >
                  Войти для подробностей
                </button>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </GuestLayout>
  );
};

export default GuestNotificationsPage;
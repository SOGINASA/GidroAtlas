import React, { useState, useEffect } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import {
  Droplets,
  Zap,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Brain,
  Bell,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllSensors, getCriticalSensors } from '../../services/sensorService';
import { getNotifications } from '../../services/notificationService';
import { getPredictions } from '../../services/predictionService';

const ExpertDashboard = () => {
  const [stats, setStats] = useState([
    {
      icon: Droplets,
      label: 'Водоёмов',
      value: '0',
      change: '+0',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      label: 'Датчиков',
      value: '0',
      change: '+0',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: AlertTriangle,
      label: 'Требуют внимания',
      value: '0',
      change: '+0',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      label: 'Прогнозов',
      value: '0',
      change: '+0',
      color: 'from-purple-500 to-indigo-500'
    }
  ]);

  const [recentAlerts, setRecentAlerts] = useState([]);
  const [priorityObjects, setPriorityObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Загрузка датчиков
      const sensorsResponse = await getAllSensors();
      const sensors = sensorsResponse.data || [];

      // Загрузка критических датчиков
      const criticalResponse = await getCriticalSensors();
      const criticalSensors = criticalResponse.data || [];

      // Загрузка прогнозов
      const predictions = await getPredictions();

      // Загрузка уведомлений
      let notifications = [];
      try {
        const notificationsResponse = await getNotifications({ limit: 3 });
        notifications = notificationsResponse.data || [];
      } catch (error) {
        console.log('Notifications not available (requires auth)');
      }

      // Обновление статистики
      setStats([
        {
          icon: Droplets,
          label: 'Датчиков активно',
          value: sensors.length.toString(),
          change: `+${sensors.filter(s => s.status === 'active').length}`,
          color: 'from-blue-500 to-cyan-500'
        },
        {
          icon: Zap,
          label: 'В норме',
          value: sensors.filter(s => s.dangerLevel === 'safe').length.toString(),
          change: `${sensors.filter(s => s.dangerLevel === 'safe').length}`,
          color: 'from-green-500 to-emerald-500'
        },
        {
          icon: AlertTriangle,
          label: 'Требуют внимания',
          value: criticalSensors.length.toString(),
          change: `+${criticalSensors.filter(s => s.dangerLevel === 'critical').length}`,
          color: 'from-red-500 to-pink-500'
        },
        {
          icon: TrendingUp,
          label: 'Прогнозов',
          value: predictions.length.toString(),
          change: `+${predictions.filter(p => p.riskLevel === 'high').length}`,
          color: 'from-purple-500 to-indigo-500'
        }
      ]);

      // Преобразование уведомлений в алерты
      if (notifications.length > 0) {
        const alerts = notifications.slice(0, 3).map(notification => ({
          id: notification.id,
          title: notification.title,
          location: notification.message || 'Системное уведомление',
          severity: notification.type === 'danger' ? 'high' :
                   notification.type === 'warning' ? 'medium' : 'low',
          time: getTimeAgo(notification.createdAt || notification.timestamp)
        }));
        setRecentAlerts(alerts);
      } else {
        // Используем критические датчики как алерты
        const sensorAlerts = criticalSensors.slice(0, 3).map(sensor => ({
          id: sensor.id,
          title: sensor.dangerLevel === 'critical' ? 'Критический уровень воды' : 'Повышенный уровень',
          location: sensor.location || sensor.name,
          severity: sensor.dangerLevel === 'critical' ? 'high' : 'medium',
          time: getTimeAgo(sensor.lastUpdate)
        }));
        setRecentAlerts(sensorAlerts);
      }

      // Создание приоритетных объектов из критических датчиков
      const priority = criticalSensors.slice(0, 3).map((sensor, index) => ({
        id: sensor.id,
        name: sensor.name,
        priority: sensor.dangerLevel === 'critical' ? 'Высокий' : 'Средний',
        score: sensor.dangerLevel === 'critical' ? 18 - index * 2 : 12 - index * 2,
        region: sensor.location || 'Не указан'
      }));
      setPriorityObjects(priority);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'недавно';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) return 'только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} час${diffInHours === 1 ? '' : diffInHours < 5 ? 'а' : 'ов'} назад`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${diffInDays === 1 ? 'день' : diffInDays < 5 ? 'дня' : 'дней'} назад`;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Добро пожаловать!</h1>
            <p className="text-sm lg:text-base text-blue-100">
              Панель управления экспертного мониторинга
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Загрузка данных...</p>
            </div>
          )}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Alerts */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-bold text-gray-900">Последние уведомления</h2>
                  </div>
                  <Link 
                    to="/expert/notifications"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                  >
                    <span>Все</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{alert.title}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{alert.location}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity === 'high' ? 'Высокий' : alert.severity === 'medium' ? 'Средний' : 'Низкий'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Objects */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-bold text-gray-900">Приоритет обследования</h2>
                  </div>
                  <Link 
                    to="/expert/prioritization"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                  >
                    <span>Все</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {priorityObjects.map((obj) => (
                  <div key={obj.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{obj.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{obj.region}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        obj.priority === 'Высокий' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {obj.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Приоритет</span>
                      <span className="font-bold text-gray-900">{obj.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/expert/map"
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Карта мониторинга
                  </p>
                  <p className="text-sm text-gray-600">Интерактивная карта</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>

            <Link
              to="/expert/predictions"
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    AI Прогнозирование
                  </p>
                  <p className="text-sm text-gray-600">Предиктивная аналитика</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>

            <Link
              to="/expert/prioritization"
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Приоритизация
                  </p>
                  <p className="text-sm text-gray-600">Расчёт приоритетов</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertDashboard;
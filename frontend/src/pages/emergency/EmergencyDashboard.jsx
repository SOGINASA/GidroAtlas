import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Droplets, 
  Zap, 
  TrendingUp, 
  Users, 
  Activity,
  MapPin,
  Bell,
  FileText,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const EmergencyDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock данные - статистика
  const stats = [
    {
      icon: Droplets,
      label: 'Водоёмы на контроле',
      value: '156',
      change: '+3',
      changeType: 'increase',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Zap,
      label: 'ГТС под мониторингом',
      value: '47',
      change: '+1',
      changeType: 'increase',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: AlertTriangle,
      label: 'Критические зоны',
      value: '8',
      change: '+2',
      changeType: 'warning',
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: Activity,
      label: 'Активных датчиков',
      value: '234',
      change: '-3',
      changeType: 'decrease',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  // Mock данные - критические уведомления
  const criticalAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Критическое превышение уровня воды',
      location: 'р. Иртыш, Павлодарская область',
      time: '10 минут назад',
      level: 4.8,
      threshold: 4.2,
      status: 'active'
    },
    {
      id: 2,
      type: 'danger',
      title: 'Превышение безопасного уровня',
      location: 'оз. Балхаш, Алматинская область',
      time: '25 минут назад',
      level: 3.9,
      threshold: 3.5,
      status: 'monitoring'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Повышение уровня воды',
      location: 'р. Урал, Западно-Казахстанская область',
      time: '1 час назад',
      level: 3.2,
      threshold: 3.0,
      status: 'monitoring'
    }
  ];

  // Mock данные - активные прогнозы
  const activePredictions = [
    {
      id: 1,
      location: 'Северо-Казахстанская область',
      risk: 'high',
      riskLevel: 'Высокий',
      probability: 87,
      timeframe: '24-48 часов',
      description: 'Вероятность паводка из-за резкого таяния снега'
    },
    {
      id: 2,
      location: 'Акмолинская область',
      risk: 'medium',
      riskLevel: 'Средний',
      probability: 62,
      timeframe: '48-72 часа',
      description: 'Возможное повышение уровня воды в реках'
    },
    {
      id: 3,
      location: 'Костанайская область',
      risk: 'low',
      riskLevel: 'Низкий',
      probability: 34,
      timeframe: '72+ часа',
      description: 'Стабильная ситуация, незначительные колебания'
    }
  ];

  // Mock данные - последние действия
  const recentActions = [
    {
      id: 1,
      type: 'evacuation',
      action: 'Инициирована эвакуация',
      location: 'с. Затобольск',
      user: 'Иванов И.И.',
      time: '15 минут назад'
    },
    {
      id: 2,
      type: 'notification',
      action: 'Отправлено массовое уведомление',
      location: 'Павлодарская область',
      user: 'Петрова М.С.',
      time: '32 минуты назад'
    },
    {
      id: 3,
      type: 'report',
      action: 'Создан отчёт о ситуации',
      location: 'р. Иртыш',
      user: 'Сидоров П.К.',
      time: '1 час назад'
    },
    {
      id: 4,
      type: 'update',
      action: 'Обновлён статус датчика',
      location: 'Датчик #А-234',
      user: 'Система',
      time: '2 часа назад'
    }
  ];

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'danger': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'warning': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'evacuation': return '🚨';
      case 'notification': return '📢';
      case 'report': return '📋';
      case 'update': return '🔄';
      default: return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎛️ Центр управления МЧС</h1>
              <p className="text-red-100">Оперативный мониторинг водных ресурсов Казахстана</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <p className="text-xs text-red-100 mb-1">Текущее время</p>
                <p className="text-xl font-bold">
                  {currentTime.toLocaleTimeString('ru-RU')}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <p className="text-xs text-red-100 mb-1">Оператор</p>
                <p className="text-lg font-semibold">Дежурный МЧС</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  stat.changeType === 'warning' ? 'bg-red-100 text-red-700' :
                  stat.changeType === 'increase' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Critical Alerts - левая колонка */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Критические уведомления */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-white" />
                    <h2 className="text-xl font-bold text-white">Критические уведомления</h2>
                  </div>
                  <Link 
                    to="/emergency/critical-zones"
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-all"
                  >
                    Все зоны
                  </Link>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {criticalAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`border-2 rounded-xl p-4 ${getAlertColor(alert.type)} transition-all hover:scale-102`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg font-bold">{alert.title}</span>
                          {alert.type === 'critical' && (
                            <span className="animate-pulse">🚨</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm opacity-80">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location}</span>
                        </div>
                      </div>
                      <span className="text-xs opacity-70">{alert.time}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="bg-white/50 rounded-lg p-2">
                        <p className="text-xs opacity-70 mb-1">Текущий уровень</p>
                        <p className="text-xl font-bold">{alert.level} м</p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-2">
                        <p className="text-xs opacity-70 mb-1">Порог безопасности</p>
                        <p className="text-xl font-bold">{alert.threshold} м</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-white/70 rounded-full text-xs font-semibold">
                        {alert.status === 'active' ? '⚡ Активно' : '👁️ Мониторинг'}
                      </span>
                      <button className="px-4 py-2 bg-white/70 hover:bg-white rounded-lg text-sm font-semibold transition-all flex items-center space-x-2">
                        <span>Подробнее</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Активные прогнозы */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-white" />
                    <h2 className="text-xl font-bold text-white">AI Прогнозы</h2>
                  </div>
                  <Link 
                    to="/emergency/predictions"
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-all"
                  >
                    Все прогнозы
                  </Link>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {activePredictions.map((prediction) => (
                  <div 
                    key={prediction.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{prediction.location}</h3>
                        <p className="text-sm text-gray-600">{prediction.description}</p>
                      </div>
                      <span className={`px-3 py-1 bg-gradient-to-r ${getRiskColor(prediction.risk)} text-white rounded-full text-xs font-bold`}>
                        {prediction.riskLevel}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Вероятность</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${getRiskColor(prediction.risk)} transition-all`}
                              style={{ width: `${prediction.probability}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold">{prediction.probability}%</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Временной период</p>
                        <p className="text-sm font-bold text-gray-900">{prediction.timeframe}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Быстрые действия</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link 
                  to="/emergency/map"
                  className="block w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5" />
                      <span>Карта мониторинга</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>

                <Link 
                  to="/emergency/notifications"
                  className="block w-full bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5" />
                      <span>Массовые уведомления</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>

                <Link 
                  to="/emergency/reports"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5" />
                      <span>Создать отчёт</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>

                <Link 
                  to="/emergency/critical-zones"
                  className="block w-full bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Критические зоны</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Последние действия</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActions.map((action) => (
                    <div key={action.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="text-2xl">{getActionIcon(action.type)}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm mb-1">{action.action}</p>
                        <p className="text-xs text-gray-600 mb-1">{action.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{action.user}</span>
                          <span className="text-xs text-gray-400">{action.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
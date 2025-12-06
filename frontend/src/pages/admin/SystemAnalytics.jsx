import React, { useState, useEffect } from 'react';
import { 
  BarChart3,
  Activity,
  Cpu,
  HardDrive,
  Database,
  Server,
  Wifi,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Droplets,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Shield,
  Cloud,
  Globe,
  Gauge,
  Layers,
  FileText,
  Bell,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

const SystemAnalytics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Системные метрики в реальном времени
  const systemMetrics = [
    {
      icon: Cpu,
      label: 'Загрузка CPU',
      value: '34%',
      max: '100%',
      percentage: 34,
      status: 'good',
      trend: 'down',
      change: '-2%',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: HardDrive,
      label: 'Использование диска',
      value: '67%',
      max: '100%',
      percentage: 67,
      status: 'warning',
      trend: 'up',
      change: '+3%',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Server,
      label: 'Память (RAM)',
      value: '8.2 ГБ',
      max: '16 ГБ',
      percentage: 51,
      status: 'good',
      trend: 'stable',
      change: '0%',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Database,
      label: 'База данных',
      value: '2.4 ГБ',
      max: '10 ГБ',
      percentage: 24,
      status: 'good',
      trend: 'up',
      change: '+0.1 ГБ',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Wifi,
      label: 'Сетевой трафик',
      value: '124 Мбит/с',
      max: '1 Гбит/с',
      percentage: 12,
      status: 'good',
      trend: 'up',
      change: '+15 Мбит/с',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Cloud,
      label: 'API запросы',
      value: '1,247',
      max: '10,000/ч',
      percentage: 12,
      status: 'good',
      trend: 'up',
      change: '+85',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  // Статистика по пользователям
  const userStats = [
    {
      period: 'Сегодня',
      active: 142,
      new: 8,
      sessions: 234,
      avgDuration: '12 мин'
    },
    {
      period: 'Вчера',
      active: 156,
      new: 12,
      sessions: 278,
      avgDuration: '15 мин'
    },
    {
      period: 'Эта неделя',
      active: 892,
      new: 47,
      sessions: 1543,
      avgDuration: '13 мин'
    },
    {
      period: 'Этот месяц',
      active: 3421,
      new: 234,
      sessions: 6789,
      avgDuration: '14 мин'
    }
  ];

  // Производительность системы по часам
  const performanceData = [
    { time: '00:00', cpu: 25, ram: 45, disk: 65 },
    { time: '02:00', cpu: 22, ram: 43, disk: 65 },
    { time: '04:00', cpu: 20, ram: 42, disk: 66 },
    { time: '06:00', cpu: 28, ram: 48, disk: 66 },
    { time: '08:00', cpu: 45, ram: 62, disk: 67 },
    { time: '10:00', cpu: 52, ram: 68, disk: 67 },
    { time: '12:00', cpu: 48, ram: 65, disk: 67 },
    { time: '14:00', cpu: 55, ram: 70, disk: 68 },
    { time: '16:00', cpu: 42, ram: 58, disk: 68 },
    { time: '18:00', cpu: 38, ram: 54, disk: 67 },
    { time: '20:00', cpu: 35, ram: 52, disk: 67 },
    { time: '22:00', cpu: 30, ram: 48, disk: 67 }
  ];

  // Топ страниц по посещаемости
  const topPages = [
    { path: '/expert/map', views: 1247, users: 342, avgTime: '8 мин' },
    { path: '/expert/dashboard', views: 982, users: 298, avgTime: '5 мин' },
    { path: '/expert/waterbodies', views: 876, users: 245, avgTime: '6 мин' },
    { path: '/expert/facilities', views: 734, users: 198, avgTime: '7 мин' },
    { path: '/expert/prioritization', views: 654, users: 176, avgTime: '9 мин' },
    { path: '/admin/overview', views: 432, users: 24, avgTime: '12 мин' },
    { path: '/emergency/control-center', views: 321, users: 45, avgTime: '15 мин' }
  ];

  // Системные события
  const systemEvents = [
    {
      type: 'success',
      icon: CheckCircle,
      message: 'Автоматическое резервирование завершено успешно',
      time: '5 мин. назад',
      details: 'База данных: 2.4 ГБ'
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      message: 'Использование диска превысило 65%',
      time: '12 мин. назад',
      details: 'Рекомендуется очистка логов'
    },
    {
      type: 'info',
      icon: Activity,
      message: 'Пиковая нагрузка: 234 активных пользователей',
      time: '1 час назад',
      details: 'Все системы работают стабильно'
    },
    {
      type: 'success',
      icon: Shield,
      message: 'Обновление безопасности установлено',
      time: '2 часа назад',
      details: 'Версия 2.4.1'
    },
    {
      type: 'warning',
      icon: Clock,
      message: 'Медленный ответ API /predictions',
      time: '3 часа назад',
      details: 'Среднее время: 2.3 сек'
    }
  ];

  // Статус сервисов
  const services = [
    { name: 'API Gateway', status: 'online', uptime: '99.98%', lastCheck: '30 сек назад' },
    { name: 'База данных PostgreSQL', status: 'online', uptime: '99.99%', lastCheck: '30 сек назад' },
    { name: 'Redis Cache', status: 'online', uptime: '99.95%', lastCheck: '30 сек назад' },
    { name: 'ML Prediction Service', status: 'online', uptime: '99.87%', lastCheck: '30 сек назад' },
    { name: 'Карты (Leaflet)', status: 'online', uptime: '100%', lastCheck: '30 сек назад' },
    { name: 'Storage Service', status: 'warning', uptime: '98.45%', lastCheck: '30 сек назад' },
    { name: 'Email Service', status: 'online', uptime: '99.92%', lastCheck: '30 сек назад' },
    { name: 'WebSocket Server', status: 'online', uptime: '99.78%', lastCheck: '30 сек назад' }
  ];

  // Статистика по операциям
  const operationsStats = [
    {
      operation: 'Запросы к БД',
      total: 45678,
      successful: 45234,
      failed: 444,
      avgTime: '12 мс'
    },
    {
      operation: 'API вызовы',
      total: 23456,
      successful: 23178,
      failed: 278,
      avgTime: '156 мс'
    },
    {
      operation: 'Загрузка файлов',
      total: 234,
      successful: 230,
      failed: 4,
      avgTime: '2.3 сек'
    },
    {
      operation: 'ML предсказания',
      total: 1234,
      successful: 1198,
      failed: 36,
      avgTime: '450 мс'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4" />;
      case 'down':
        return <ArrowDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getEventIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <BarChart3 className="w-8 h-8 mr-3" />
                  Аналитика системы
                </h1>
                <p className="text-purple-100">Мониторинг производительности и статистика в реальном времени</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{currentTime.toLocaleTimeString('ru-RU')}</span>
                </div>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    autoRefresh ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? 'Авто-обновление' : 'Обновить'}
                </button>
                <button
                  onClick={() => alert('Экспорт отчёта...')}
                  className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Экспорт
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">

          {/* Period Selector */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {['1h', '6h', '24h', '7d', '30d'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedPeriod === period
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period === '1h' ? 'Последний час' : 
                   period === '6h' ? '6 часов' :
                   period === '24h' ? '24 часа' :
                   period === '7d' ? '7 дней' :
                   '30 дней'}
                </button>
              ))}
            </div>
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {systemMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`bg-gradient-to-br ${metric.color} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-10 h-10 text-white" />
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                        metric.trend === 'up' ? 'bg-red-500/20 text-white' :
                        metric.trend === 'down' ? 'bg-green-500/20 text-white' :
                        'bg-white/20 text-white'
                      }`}>
                        {getTrendIcon(metric.trend)}
                        <span>{metric.change}</span>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">{metric.value}</p>
                    <p className="text-sm text-white/80 mb-4">{metric.label}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${metric.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/70 mt-2">Из {metric.max}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Activity className="w-6 h-6 text-purple-600 mr-2" />
                Производительность системы (24 часа)
              </h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>CPU</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>RAM</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Диск</span>
                </div>
              </div>
            </div>

            {/* Simple Chart */}
            <div className="space-y-4">
              {performanceData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 w-16">{data.time}</span>
                  <div className="flex-1 flex space-x-2">
                    <div className="flex-1">
                      <div className="w-full bg-blue-100 rounded-full h-6 overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 flex items-center justify-end pr-2 text-xs text-white font-semibold transition-all duration-300"
                          style={{ width: `${data.cpu}%` }}
                        >
                          {data.cpu}%
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-green-100 rounded-full h-6 overflow-hidden">
                        <div 
                          className="h-full bg-green-500 flex items-center justify-end pr-2 text-xs text-white font-semibold transition-all duration-300"
                          style={{ width: `${data.ram}%` }}
                        >
                          {data.ram}%
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-yellow-100 rounded-full h-6 overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 flex items-center justify-end pr-2 text-xs text-white font-semibold transition-all duration-300"
                          style={{ width: `${data.disk}%` }}
                        >
                          {data.disk}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Statistics & Services Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* User Statistics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 text-purple-600 mr-2" />
                Статистика пользователей
              </h2>

              <div className="space-y-4">
                {userStats.map((stat, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-3">{stat.period}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Активных</p>
                        <p className="text-2xl font-bold text-purple-600">{stat.active}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Новых</p>
                        <p className="text-2xl font-bold text-green-600">{stat.new}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Сессий</p>
                        <p className="text-2xl font-bold text-blue-600">{stat.sessions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Ср. время</p>
                        <p className="text-2xl font-bold text-orange-600">{stat.avgDuration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Server className="w-6 h-6 text-purple-600 mr-2" />
                Статус сервисов
              </h2>

              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'online' ? 'bg-green-500 animate-pulse' :
                        service.status === 'warning' ? 'bg-yellow-500 animate-pulse' :
                        'bg-red-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.lastCheck}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(service.status)}`}>
                        {service.status === 'online' ? 'Онлайн' :
                         service.status === 'warning' ? 'Внимание' : 'Офлайн'}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Pages & Operations Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Top Pages */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 text-purple-600 mr-2" />
                Топ страниц
              </h2>

              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-purple-600 font-semibold">{page.path}</span>
                      <span className="text-2xl font-bold text-gray-900">{page.views}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{page.users} пользователей</span>
                      <span>⏱ {page.avgTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operations Statistics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Gauge className="w-6 h-6 text-purple-600 mr-2" />
                Статистика операций
              </h2>

              <div className="space-y-4">
                {operationsStats.map((op, index) => {
                  const successRate = ((op.successful / op.total) * 100).toFixed(1);
                  return (
                    <div key={index} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900">{op.operation}</span>
                        <span className="text-sm text-gray-600">⌀ {op.avgTime}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-2">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Всего</p>
                          <p className="text-lg font-bold text-blue-600">{op.total.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Успешно</p>
                          <p className="text-lg font-bold text-green-600">{op.successful.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Ошибок</p>
                          <p className="text-lg font-bold text-red-600">{op.failed}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${successRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 text-right mt-1">{successRate}% успешных</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* System Events */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Bell className="w-6 h-6 text-purple-600 mr-2" />
              Последние события системы
            </h2>

            <div className="space-y-3">
              {systemEvents.map((event, index) => {
                const Icon = event.icon;
                return (
                  <div key={index} className={`border rounded-xl p-4 ${getEventColor(event.type)}`}>
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        event.type === 'success' ? 'bg-green-100' :
                        event.type === 'warning' ? 'bg-yellow-100' :
                        event.type === 'error' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${getEventIconColor(event.type)}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{event.message}</p>
                        <p className="text-sm text-gray-600 mb-2">{event.details}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Health Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-12 h-12" />
                <span className="text-4xl font-bold">8</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Сервисов онлайн</h3>
              <p className="text-green-100 text-sm">Все основные системы работают</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-12 h-12" />
                <span className="text-4xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Требует внимания</h3>
              <p className="text-yellow-100 text-sm">Storage Service - низкий uptime</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-12 h-12" />
                <span className="text-4xl font-bold">99.8%</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Общий Uptime</h3>
              <p className="text-blue-100 text-sm">За последние 30 дней</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => alert('Очистка логов...')}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
            >
              <FileText className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Очистить логи</h3>
              <p className="text-sm text-gray-600">Освободить дисковое пространство</p>
            </button>

            <button
              onClick={() => alert('Перезапуск сервисов...')}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
            >
              <RefreshCw className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Перезапуск</h3>
              <p className="text-sm text-gray-600">Перезапустить все сервисы</p>
            </button>

            <button
              onClick={() => alert('Резервное копирование...')}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
            >
              <Database className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Бэкап</h3>
              <p className="text-sm text-gray-600">Создать резервную копию БД</p>
            </button>

            <button
              onClick={() => alert('Настройки мониторинга...')}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
            >
              <Settings className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Настройки</h3>
              <p className="text-sm text-gray-600">Конфигурация мониторинга</p>
            </button>
          </div>

          {/* Database Statistics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Database className="w-6 h-6 text-purple-600 mr-2" />
              Статистика базы данных
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Droplets className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">1,247</p>
                <p className="text-sm text-gray-600">Водоёмов</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">456</p>
                <p className="text-sm text-gray-600">ГТС</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">342</p>
                <p className="text-sm text-gray-600">Пользователей</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">1,892</p>
                <p className="text-sm text-gray-600">Датчиков</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Размер БД</p>
                  <p className="font-bold text-gray-900">2.4 ГБ</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Таблиц</p>
                  <p className="font-bold text-gray-900">47</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Индексов</p>
                  <p className="font-bold text-gray-900">124</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Связей</p>
                  <p className="font-bold text-gray-900">89</p>
                </div>
              </div>
            </div>
          </div>

          {/* Network Statistics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="w-6 h-6 text-purple-600 mr-2" />
              Сетевая статистика
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Входящий трафик</h3>
                  <ArrowDown className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-4xl font-bold text-green-600 mb-2">87.3 Мбит/с</p>
                <p className="text-sm text-gray-600">За последний час</p>
                <div className="mt-4 w-full bg-green-100 rounded-full h-2">
                  <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Исходящий трафик</h3>
                  <ArrowUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-4xl font-bold text-blue-600 mb-2">36.8 Мбит/с</p>
                <p className="text-sm text-gray-600">За последний час</p>
                <div className="mt-4 w-full bg-blue-100 rounded-full h-2">
                  <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Общий трафик</h3>
                  <Wifi className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-4xl font-bold text-purple-600 mb-2">124.1 Мбит/с</p>
                <p className="text-sm text-gray-600">За последний час</p>
                <div className="mt-4 w-full bg-purple-100 rounded-full h-2">
                  <div className="w-1/2 h-full bg-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Пакетов отправлено</p>
                <p className="text-2xl font-bold text-gray-900">456.2K</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Пакетов получено</p>
                <p className="text-2xl font-bold text-gray-900">892.7K</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Потерянных пакетов</p>
                <p className="text-2xl font-bold text-red-600">0.03%</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Средний пинг</p>
                <p className="text-2xl font-bold text-green-600">12 мс</p>
              </div>
            </div>
          </div>

          {/* Error Logs Preview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="w-6 h-6 text-purple-600 mr-2" />
                Последние ошибки
              </h2>
              <button
                onClick={() => alert('Открыть все логи...')}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                Все логи →
              </button>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs bg-red-50 border border-red-200 rounded-lg p-3">
                <span className="text-red-600 font-bold">[ERROR]</span>
                <span className="text-gray-600"> 2024-12-06 14:23:45</span>
                <span className="text-gray-900"> - Database connection timeout: /api/predictions</span>
              </div>
              <div className="font-mono text-xs bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <span className="text-yellow-600 font-bold">[WARN]</span>
                <span className="text-gray-600"> 2024-12-06 13:45:12</span>
                <span className="text-gray-900"> - High memory usage detected: 89%</span>
              </div>
              <div className="font-mono text-xs bg-red-50 border border-red-200 rounded-lg p-3">
                <span className="text-red-600 font-bold">[ERROR]</span>
                <span className="text-gray-600"> 2024-12-06 12:34:56</span>
                <span className="text-gray-900"> - Failed to send email notification to user #1247</span>
              </div>
              <div className="font-mono text-xs bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <span className="text-yellow-600 font-bold">[WARN]</span>
                <span className="text-gray-600"> 2024-12-06 11:23:34</span>
                <span className="text-gray-900"> - Slow API response: /expert/waterbodies (3.2s)</span>
              </div>
              <div className="font-mono text-xs bg-red-50 border border-red-200 rounded-lg p-3">
                <span className="text-red-600 font-bold">[ERROR]</span>
                <span className="text-gray-600"> 2024-12-06 10:12:23</span>
                <span className="text-gray-900"> - Authentication failed: Invalid token</span>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Layers className="w-6 h-6 mr-2" />
              Информация о системе
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-purple-100 text-sm mb-1">Версия</p>
                <p className="font-bold text-lg">GidroAtlas v2.4.1</p>
              </div>
              <div>
                <p className="text-purple-100 text-sm mb-1">Окружение</p>
                <p className="font-bold text-lg">Production</p>
              </div>
              <div>
                <p className="text-purple-100 text-sm mb-1">Последнее обновление</p>
                <p className="font-bold text-lg">06.12.2024</p>
              </div>
              <div>
                <p className="text-purple-100 text-sm mb-1">Время работы</p>
                <p className="font-bold text-lg">47 дней 12 часов</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemAnalytics;
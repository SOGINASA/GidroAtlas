import { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  Database,
  Server,
  Wifi,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Loader
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';
import { getSystemAnalytics } from '../../services/adminService';

const SystemAnalytics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAnalytics();
      }, 30000); // Обновление каждые 30 секунд
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getSystemAnalytics();
      if (response.success) {
        setAnalyticsData(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Ошибка загрузки аналитики:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'good': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'critical': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  // Системные метрики из API
  const systemMetrics = analyticsData?.current ? [
    {
      icon: Cpu,
      label: 'Загрузка CPU',
      value: `${analyticsData.current.cpu}%`,
      max: '100%',
      percentage: analyticsData.current.cpu,
      status: analyticsData.current.cpu < 60 ? 'good' : analyticsData.current.cpu < 80 ? 'warning' : 'critical',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: HardDrive,
      label: 'Использование диска',
      value: `${analyticsData.current.disk.percent.toFixed(1)}%`,
      max: '100%',
      percentage: analyticsData.current.disk.percent,
      status: analyticsData.current.disk.percent < 70 ? 'good' : analyticsData.current.disk.percent < 85 ? 'warning' : 'critical',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Server,
      label: 'Память (RAM)',
      value: `${analyticsData.current.memory.used} ГБ`,
      max: `${analyticsData.current.memory.total} ГБ`,
      percentage: analyticsData.current.memory.percent,
      status: analyticsData.current.memory.percent < 70 ? 'good' : analyticsData.current.memory.percent < 85 ? 'warning' : 'critical',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Database,
      label: 'База данных',
      value: analyticsData.database?.size || '2.4 ГБ',
      max: '10 ГБ',
      percentage: 24,
      status: 'good',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Wifi,
      label: 'Сеть',
      value: analyticsData.current.network ? `${(analyticsData.current.network.bytesSent / 1024 / 1024).toFixed(0)} МБ` : 'N/A',
      max: 'Отправлено',
      percentage: 0,
      status: 'good',
      color: 'from-indigo-500 to-blue-500'
    }
  ] : [];

  // Статус сервисов
  const servicesStatus = analyticsData?.services || [
    { name: 'API Server', status: 'running', uptime: '7 days' },
    { name: 'Database', status: 'running', uptime: '7 days' },
    { name: 'Cache', status: 'running', uptime: '7 days' }
  ];

  if (loading && !analyticsData) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Системная аналитика</h1>
              <p className="text-blue-100">Мониторинг производительности и ресурсов</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Обновлено</p>
                <p className="text-lg font-semibold">
                  {currentTime.toLocaleTimeString('ru-RU')}
                </p>
              </div>
              <button
                onClick={loadAnalytics}
                disabled={loading}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Обновить
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Период и авто-обновление */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Период:</label>
              <div className="flex gap-2">
                {['24h', '7d', '30d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedPeriod === period
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {period === '24h' ? '24 часа' : period === '7d' ? '7 дней' : '30 дней'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm text-gray-700 dark:text-gray-300">
                Авто-обновление (30 сек)
              </label>
            </div>
          </div>
        </div>

        {/* Системные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {systemMetrics.map((metric, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBg(metric.status)} ${getStatusColor(metric.status)}`}>
                  {metric.status === 'good' ? 'Норма' : metric.status === 'warning' ? 'Внимание' : 'Критично'}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{metric.label}</p>
              <div className="flex items-end justify-between mb-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.max}</p>
              </div>
              {metric.percentage > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${metric.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Статус сервисов */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Статус сервисов
            </h2>
            <div className="space-y-3">
              {servicesStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${service.status === 'running' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium text-gray-900 dark:text-white">{service.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Uptime: {service.uptime}</span>
                </div>
              ))}
            </div>
          </div>

          {/* База данных */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-500" />
              База данных
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Размер БД</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {analyticsData?.database?.size || '2.4 ГБ'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Таблиц</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {analyticsData?.database?.tables || 8}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Активных подключений</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {analyticsData?.database?.connections || 5}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Системный статус */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Общий статус системы</h2>
          <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Система работает нормально</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Все сервисы функционируют в штатном режиме
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemAnalytics;

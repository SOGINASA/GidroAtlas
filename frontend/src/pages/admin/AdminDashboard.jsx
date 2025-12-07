import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Droplets,
  Zap,
  Users,
  Activity,
  Database,
  TrendingUp,
  Server,
  Shield,
  Bell,
  FileText,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Cpu,
  HardDrive
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';
import { getDashboardStats } from '../../services/adminService';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Ошибка загрузки dashboard:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  // Статистика системы (из API)
  const stats = dashboardData ? [
    {
      icon: Users,
      label: 'Пользователей в системе',
      value: dashboardData.users?.total || 0,
      change: `+${dashboardData.users?.new || 0}`,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Droplets,
      label: 'Водоёмов в БД',
      value: dashboardData.waterbodies?.total || 0,
      change: dashboardData.waterbodies?.critical ? `${dashboardData.waterbodies.critical} критических` : '+0',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      label: 'ГТС в системе',
      value: dashboardData.facilities?.total || 0,
      change: `${dashboardData.facilities?.operational || 0} работают`,
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: Activity,
      label: 'Активных датчиков',
      value: dashboardData.sensors?.total || 0,
      change: `${dashboardData.sensors?.active || 0} активны`,
      color: 'from-green-500 to-emerald-500'
    }
  ] : [];

  // Статистика по ролям пользователей (из API)
  const usersByRole = dashboardData?.users?.roleDistribution ? [
    {
      role: 'Гости',
      count: dashboardData.users.roleDistribution.user || 0,
      color: 'bg-gray-500',
      percentage: Math.round((dashboardData.users.roleDistribution.user / dashboardData.users.total) * 100)
    },
    {
      role: 'Эксперты',
      count: dashboardData.users.roleDistribution.expert || 0,
      color: 'bg-blue-500',
      percentage: Math.round((dashboardData.users.roleDistribution.expert / dashboardData.users.total) * 100)
    },
    {
      role: 'МЧС',
      count: dashboardData.users.roleDistribution.emergency || 0,
      color: 'bg-red-500',
      percentage: Math.round((dashboardData.users.roleDistribution.emergency / dashboardData.users.total) * 100)
    },
    {
      role: 'Администраторы',
      count: dashboardData.users.roleDistribution.admin || 0,
      color: 'bg-purple-500',
      percentage: Math.round((dashboardData.users.roleDistribution.admin / dashboardData.users.total) * 100)
    }
  ] : [];

  // Системные метрики (из API)
  const systemMetrics = dashboardData?.systemMetrics ? [
    {
      icon: Cpu,
      label: 'Загрузка CPU',
      value: `${dashboardData.systemMetrics.cpu}%`,
      status: dashboardData.systemMetrics.cpu < 60 ? 'good' : dashboardData.systemMetrics.cpu < 80 ? 'warning' : 'critical',
      color: dashboardData.systemMetrics.cpu < 60 ? 'text-green-600' : dashboardData.systemMetrics.cpu < 80 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: HardDrive,
      label: 'Использование диска',
      value: `${Math.round(dashboardData.systemMetrics.disk.percent)}%`,
      status: dashboardData.systemMetrics.disk.percent < 70 ? 'good' : 'warning',
      color: dashboardData.systemMetrics.disk.percent < 70 ? 'text-green-600' : 'text-yellow-600'
    },
    {
      icon: Database,
      label: 'База данных',
      value: `${dashboardData.systemMetrics.disk.used} ГБ`,
      status: 'good',
      color: 'text-blue-600'
    },
    {
      icon: Server,
      label: 'Память (RAM)',
      value: `${dashboardData.systemMetrics.memory.used}/${dashboardData.systemMetrics.memory.total} ГБ`,
      status: dashboardData.systemMetrics.memory.percent < 70 ? 'good' : 'warning',
      color: dashboardData.systemMetrics.memory.percent < 70 ? 'text-green-600' : 'text-yellow-600'
    }
  ] : [];

  // Последние действия
  const recentActivities = dashboardData?.recentActivities || [];

  // Быстрые действия
  const quickActions = [
    {
      icon: Users,
      label: 'Управление пользователями',
      description: 'Просмотр и редактирование пользователей',
      link: '/admin/users',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Droplets,
      label: 'Управление водоёмами',
      description: 'Добавление и редактирование объектов',
      link: '/admin/waterbodies',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      label: 'Управление ГТС',
      description: 'Мониторинг сооружений',
      link: '/admin/facilities',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: Settings,
      label: 'Настройки AI',
      description: 'Конфигурация моделей',
      link: '/admin/ai-settings',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Database,
      label: 'Управление БД',
      description: 'Резервное копирование и оптимизация',
      link: '/admin/settings',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Shield,
      label: 'Безопасность',
      description: 'Логи и мониторинг доступа',
      link: '/admin/logs',
      color: 'from-red-500 to-pink-500'
    }
  ];

  // Задачи администратора
  const adminTasks = [
    { id: 1, task: 'Проверить новых пользователей', priority: 'high', completed: false },
    { id: 2, task: 'Обновить паспорта водоёмов', priority: 'medium', completed: false },
    { id: 3, task: 'Запланировать резервное копирование', priority: 'low', completed: true },
    { id: 4, task: 'Просмотреть критические зоны', priority: 'high', completed: false }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <p>{error}</p>
            <button
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Повторить
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Панель администратора</h1>
              <p className="text-blue-100">Обзор системы и управление</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Текущее время</p>
              <p className="text-lg font-semibold">
                {currentTime.toLocaleTimeString('ru-RU')}
              </p>
              <p className="text-sm text-blue-100">
                {currentTime.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Статистические карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Системные метрики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Метрики системы
              </h2>
              <Link to="/admin/system-analytics" className="text-blue-500 hover:text-blue-600 text-sm flex items-center">
                Подробнее <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <metric.icon className={`w-5 h-5 mr-3 ${metric.color}`} />
                    <span className="text-gray-700 dark:text-gray-300">{metric.label}</span>
                  </div>
                  <span className={`font-semibold ${metric.color}`}>{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Распределение пользователей по ролям */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-500" />
              Распределение по ролям
            </h2>
            <div className="space-y-3">
              {usersByRole.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.role}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Последние действия и задачи */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Последние действия */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-500" />
              Последние действия
            </h2>
            <div className="space-y-3">
              {recentActivities.length > 0 ? recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 mr-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{activity.user}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(activity.timestamp).toLocaleString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500">Нет недавних действий</p>
              )}
            </div>
          </div>

          {/* Задачи администратора */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
              Задачи
            </h2>
            <div className="space-y-2">
              {adminTasks.map((task) => (
                <div key={task.id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="w-4 h-4 text-blue-600 rounded mr-3"
                    readOnly
                  />
                  <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {task.task}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

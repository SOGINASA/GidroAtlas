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


const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Статистика системы
  const stats = [
    {
      icon: Users,
      label: 'Пользователей в системе',
      value: '342',
      change: '+12',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Droplets,
      label: 'Водоёмов в БД',
      value: '1,247',
      change: '+8',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      label: 'ГТС в системе',
      value: '456',
      change: '+3',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: Activity,
      label: 'Активных датчиков',
      value: '1,892',
      change: '-15',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  // Статистика по ролям пользователей
  const usersByRole = [
    { role: 'Гости', count: 145, color: 'bg-gray-500', percentage: 42 },
    { role: 'Эксперты', count: 128, color: 'bg-blue-500', percentage: 38 },
    { role: 'МЧС', count: 45, color: 'bg-red-500', percentage: 13 },
    { role: 'Администраторы', count: 24, color: 'bg-purple-500', percentage: 7 }
  ];

  // Системные метрики
  const systemMetrics = [
    { 
      icon: Cpu, 
      label: 'Загрузка CPU', 
      value: '34%', 
      status: 'good',
      color: 'text-green-600'
    },
    { 
      icon: HardDrive, 
      label: 'Использование диска', 
      value: '67%', 
      status: 'warning',
      color: 'text-yellow-600'
    },
    { 
      icon: Database, 
      label: 'База данных', 
      value: '2.4 ГБ', 
      status: 'good',
      color: 'text-blue-600'
    },
    { 
      icon: Server, 
      label: 'Память (RAM)', 
      value: '8.2/16 ГБ', 
      status: 'good',
      color: 'text-green-600'
    }
  ];

  // Последние действия пользователей
  const recentActions = [
    { 
      user: 'Иванов А.С. (Эксперт)', 
      action: 'Добавил новый водоём', 
      target: 'Озеро Кольсай',
      time: '5 мин. назад',
      status: 'success',
      icon: Droplets
    },
    { 
      user: 'Петрова М.И. (Админ)', 
      action: 'Обновил настройки AI', 
      target: 'Модель прогнозирования',
      time: '15 мин. назад',
      status: 'success',
      icon: Settings
    },
    { 
      user: 'Сидоров В.П. (МЧС)', 
      action: 'Создал критический алерт', 
      target: 'Иртыш, Павлодар',
      time: '32 мин. назад',
      status: 'alert',
      icon: AlertTriangle
    },
    { 
      user: 'Система', 
      action: 'Автоматическое резервирование', 
      target: 'База данных',
      time: '1 час назад',
      status: 'success',
      icon: Database
    },
    { 
      user: 'Козлов Д.А. (Эксперт)', 
      action: 'Обновил паспорт ГТС', 
      target: 'Бухтарминская ГЭС',
      time: '2 часа назад',
      status: 'success',
      icon: FileText
    }
  ];

  // Задачи администрирования
  const adminTasks = [
    { 
      id: 1,
      task: 'Проверить обновления системы', 
      priority: 'high',
      dueDate: 'Сегодня',
      status: 'pending'
    },
    { 
      id: 2,
      task: 'Обновить SSL сертификаты', 
      priority: 'medium',
      dueDate: 'Завтра',
      status: 'in_progress'
    },
    { 
      id: 3,
      task: 'Проверить логи безопасности', 
      priority: 'high',
      dueDate: 'Сегодня',
      status: 'pending'
    },
    { 
      id: 4,
      task: 'Резервное копирование БД', 
      priority: 'low',
      dueDate: 'Через 3 дня',
      status: 'completed'
    }
  ];

  // Быстрые действия
  const quickActions = [
    { icon: Users, label: 'Управление пользователями', path: '/admin/users', color: 'bg-purple-500' },
    { icon: Droplets, label: 'Управление водоёмами', path: '/admin/waterbodies', color: 'bg-blue-500' },
    { icon: Zap, label: 'Управление ГТС', path: '/admin/facilities', color: 'bg-orange-500' },
    { icon: Settings, label: 'Настройки AI', path: '/admin/ai-settings', color: 'bg-pink-500' },
    { icon: Database, label: 'Управление БД', path: '/admin/database', color: 'bg-cyan-500' },
    { icon: Shield, label: 'Безопасность', path: '/admin/security', color: 'bg-red-500' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
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
                  <Settings className="w-8 h-8 mr-3" />
                  Панель администратора
                </h1>
                <p className="text-purple-100">Полное управление системой GidroAtlas</p>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-right">
                  <p className="text-2xl font-bold">{currentTime.toLocaleTimeString('ru-RU')}</p>
                  <p className="text-sm text-purple-100">{currentTime.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`bg-gradient-to-br ${stat.color} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                    <div className="mt-3 flex items-center text-white/90 text-sm">
                      {parseFloat(stat.change) > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : null}
                      <span>{stat.change} за неделю</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Metrics & User Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* System Metrics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Server className="w-6 h-6 text-purple-600 mr-2" />
                  Системные метрики
                </h2>
                <Link to="/admin/system-analytics" className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
                  Подробнее →
                </Link>
              </div>

              <div className="space-y-4">
                {systemMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{metric.label}</p>
                          <p className={`text-sm font-bold ${metric.color}`}>{metric.value}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        metric.status === 'good' ? 'bg-green-100 text-green-800' :
                        metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {metric.status === 'good' ? 'ОК' : 
                         metric.status === 'warning' ? 'Внимание' : 'Критично'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Users by Role */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Users className="w-6 h-6 text-purple-600 mr-2" />
                  Пользователи по ролям
                </h2>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  342 всего
                </span>
              </div>

              <div className="space-y-4">
                {usersByRole.map((roleData, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{roleData.role}</span>
                      <span className="text-sm text-gray-600">{roleData.count} ({roleData.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full ${roleData.color} transition-all duration-500`}
                        style={{ width: `${roleData.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                to="/admin/users" 
                className="mt-6 w-full bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center font-semibold"
              >
                Управление пользователями
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Быстрые действия</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.path}
                    className={`${action.color} text-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center text-center`}
                  >
                    <Icon className="w-8 h-8 mb-3" />
                    <span className="font-semibold text-sm">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Admin Tasks & Recent Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Admin Tasks */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <CheckCircle className="w-6 h-6 text-purple-600 mr-2" />
                  Задачи администрирования
                </h2>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                  2 срочных
                </span>
              </div>

              <div className="space-y-3">
                {adminTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{task.task}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                            {task.priority === 'high' ? 'Высокий' : 
                             task.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {task.dueDate}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ml-2 ${getStatusColor(task.status)}`}>
                        {task.status === 'completed' ? 'Готово' :
                         task.status === 'in_progress' ? 'В работе' : 'Ожидает'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Activity className="w-6 h-6 text-purple-600 mr-2" />
                  Последние действия
                </h2>
                <Link to="/admin/logs" className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
                  Все логи →
                </Link>
              </div>

              <div className="space-y-3">
                {recentActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        action.status === 'alert' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          action.status === 'alert' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{action.user}</p>
                        <p className="text-sm text-gray-600">{action.action}</p>
                        <p className="text-xs text-purple-600 font-medium">{action.target}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500">{action.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* System Status Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Система работает нормально</h3>
                  <p className="text-green-100">Все сервисы функционируют штатно. Последняя проверка: {currentTime.toLocaleTimeString('ru-RU')}</p>
                </div>
              </div>
              <Link 
                to="/admin/system-analytics"
                className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Мониторинг
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
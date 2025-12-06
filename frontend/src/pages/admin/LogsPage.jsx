import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  User,
  Database,
  Shield,
  Settings,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Server,
  Zap,
  Mail,
  Bell,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Edit,
  Plus,
  Minus
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

const LogsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const logsPerPage = 20;

  // Mock данные логов
  const allLogs = [
    {
      id: 1,
      timestamp: '2024-12-06 14:32:15',
      level: 'info',
      type: 'auth',
      user: 'Иванов А.С.',
      action: 'Успешный вход в систему',
      details: 'IP: 192.168.1.105, Browser: Chrome 120',
      icon: Lock
    },
    {
      id: 2,
      timestamp: '2024-12-06 14:30:42',
      level: 'success',
      type: 'database',
      user: 'Система',
      action: 'Резервное копирование БД завершено',
      details: 'Размер: 2.4 ГБ, Время: 3м 24с',
      icon: Database
    },
    {
      id: 3,
      timestamp: '2024-12-06 14:28:19',
      level: 'warning',
      type: 'system',
      user: 'Система',
      action: 'Высокая загрузка CPU',
      details: 'CPU: 89%, Рекомендуется мониторинг',
      icon: Server
    },
    {
      id: 4,
      timestamp: '2024-12-06 14:25:33',
      level: 'error',
      type: 'auth',
      user: 'Неизвестный',
      action: 'Неудачная попытка входа',
      details: 'IP: 185.220.101.45, Попыток: 5/5',
      icon: AlertTriangle
    },
    {
      id: 5,
      timestamp: '2024-12-06 14:22:10',
      level: 'success',
      type: 'crud',
      user: 'Петрова М.И.',
      action: 'Добавлен новый водоём',
      details: 'Озеро Кольсай, Алматинская область',
      icon: Plus
    },
    {
      id: 6,
      timestamp: '2024-12-06 14:18:45',
      level: 'info',
      type: 'api',
      user: 'API Client',
      action: 'Запрос к API',
      details: 'GET /api/v1/waterbodies, Status: 200',
      icon: Zap
    },
    {
      id: 7,
      timestamp: '2024-12-06 14:15:22',
      level: 'success',
      type: 'email',
      user: 'Система',
      action: 'Email уведомление отправлено',
      details: 'Кому: admin@hydroatlas.kz, Тема: Еженедельный отчёт',
      icon: Mail
    },
    {
      id: 8,
      timestamp: '2024-12-06 14:12:08',
      level: 'warning',
      type: 'security',
      user: 'Система',
      action: 'Подозрительная активность',
      details: 'IP: 45.142.120.33, Сканирование портов',
      icon: Shield
    },
    {
      id: 9,
      timestamp: '2024-12-06 14:08:55',
      level: 'info',
      type: 'user',
      user: 'Администратор',
      action: 'Создан новый пользователь',
      details: 'Email: novyy.expert@hydroatlas.kz, Роль: Expert',
      icon: UserPlus
    },
    {
      id: 10,
      timestamp: '2024-12-06 14:05:30',
      level: 'success',
      type: 'crud',
      user: 'Сидоров В.П.',
      action: 'Обновлён паспорт ГТС',
      details: 'Бухтарминская ГЭС, Дата: 2024-12-01',
      icon: Edit
    },
    {
      id: 11,
      timestamp: '2024-12-06 14:02:17',
      level: 'error',
      type: 'api',
      user: 'External API',
      action: 'Превышен лимит запросов',
      details: 'API Key: sk_***345, Лимит: 1000/час',
      icon: XCircle
    },
    {
      id: 12,
      timestamp: '2024-12-06 13:58:44',
      level: 'info',
      type: 'auth',
      user: 'Козлов Д.А.',
      action: 'Выход из системы',
      details: 'Длительность сессии: 2ч 15м',
      icon: Unlock
    },
    {
      id: 13,
      timestamp: '2024-12-06 13:55:12',
      level: 'warning',
      type: 'system',
      user: 'Система',
      action: 'Низкое свободное место на диске',
      details: 'Доступно: 8.5 ГБ из 100 ГБ',
      icon: Server
    },
    {
      id: 14,
      timestamp: '2024-12-06 13:50:29',
      level: 'success',
      type: 'notification',
      user: 'Система',
      action: 'Push уведомление доставлено',
      details: 'Пользователей: 145, Успешно: 142',
      icon: Bell
    },
    {
      id: 15,
      timestamp: '2024-12-06 13:45:03',
      level: 'error',
      type: 'database',
      user: 'Система',
      action: 'Ошибка подключения к БД',
      details: 'Connection timeout after 30s',
      icon: Database
    },
    {
      id: 16,
      timestamp: '2024-12-06 13:40:18',
      level: 'info',
      type: 'settings',
      user: 'Администратор',
      action: 'Изменены настройки системы',
      details: 'Раздел: Безопасность, Параметр: Session Timeout',
      icon: Settings
    },
    {
      id: 17,
      timestamp: '2024-12-06 13:35:55',
      level: 'success',
      type: 'crud',
      user: 'Иванов А.С.',
      action: 'Удалён устаревший объект',
      details: 'ID: 892, Причина: Дубликат',
      icon: Trash2
    },
    {
      id: 18,
      timestamp: '2024-12-06 13:30:42',
      level: 'warning',
      type: 'security',
      user: 'Система',
      action: 'Обнаружен устаревший SSL сертификат',
      details: 'Истекает: 2024-12-15',
      icon: AlertTriangle
    },
    {
      id: 19,
      timestamp: '2024-12-06 13:25:11',
      level: 'info',
      type: 'api',
      user: 'Mobile App',
      action: 'Синхронизация данных',
      details: 'Объектов синхронизировано: 234',
      icon: RefreshCw
    },
    {
      id: 20,
      timestamp: '2024-12-06 13:20:33',
      level: 'success',
      type: 'email',
      user: 'Система',
      action: 'Отчёт сгенерирован и отправлен',
      details: 'Тип: Месячная статистика',
      icon: BarChart3
    }
  ];

  const tabs = [
    { id: 'all', label: 'Все логи', count: allLogs.length },
    { id: 'auth', label: 'Авторизация', count: allLogs.filter(l => l.type === 'auth').length },
    { id: 'crud', label: 'CRUD', count: allLogs.filter(l => l.type === 'crud').length },
    { id: 'system', label: 'Система', count: allLogs.filter(l => l.type === 'system').length },
    { id: 'security', label: 'Безопасность', count: allLogs.filter(l => l.type === 'security').length },
    { id: 'api', label: 'API', count: allLogs.filter(l => l.type === 'api').length }
  ];

  const logLevels = [
    { value: 'all', label: 'Все уровни', color: 'gray' },
    { value: 'info', label: 'Информация', color: 'blue' },
    { value: 'success', label: 'Успех', color: 'green' },
    { value: 'warning', label: 'Предупреждение', color: 'yellow' },
    { value: 'error', label: 'Ошибка', color: 'red' }
  ];

  const logTypes = [
    { value: 'all', label: 'Все типы' },
    { value: 'auth', label: 'Авторизация' },
    { value: 'crud', label: 'CRUD операции' },
    { value: 'system', label: 'Система' },
    { value: 'security', label: 'Безопасность' },
    { value: 'api', label: 'API' },
    { value: 'database', label: 'База данных' },
    { value: 'email', label: 'Email' },
    { value: 'notification', label: 'Уведомления' },
    { value: 'settings', label: 'Настройки' },
    { value: 'user', label: 'Пользователи' }
  ];

  // Фильтрация логов
  const filteredLogs = allLogs.filter(log => {
    const matchesTab = activeTab === 'all' || log.type === activeTab;
    const matchesSearch = searchQuery === '' || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesType = selectedType === 'all' || log.type === selectedType;
    
    return matchesTab && matchesSearch && matchesLevel && matchesType;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

  // Авто-обновление
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        console.log('Обновление логов...');
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getLevelStyles = (level) => {
    switch (level) {
      case 'info':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-300',
          icon: Info
        };
      case 'success':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          icon: CheckCircle
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-300',
          icon: AlertTriangle
        };
      case 'error':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-300',
          icon: XCircle
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300',
          icon: Info
        };
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleClearLogs = () => {
    if (window.confirm('Вы уверены, что хотите очистить все логи? Это действие необратимо.')) {
      console.log('Логи очищены');
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
                  <FileText className="w-8 h-8 mr-3" />
                  Логи и аудит системы
                </h1>
                <p className="text-purple-100">Мониторинг всех событий и действий пользователей</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-semibold">Экспорт</span>
                </button>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                    autoRefresh 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                  }`}
                >
                  <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
                  <span>{autoRefresh ? 'Обновление' : 'Авто-обновление'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 min-w-[150px] px-6 py-4 font-semibold transition-colors border-b-4 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span>{tab.label}</span>
                    <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? 'bg-purple-200 text-purple-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Фильтры</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Поиск по логам..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Level filter */}
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {logLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              {/* Type filter */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {logTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Clear filters */}
              <div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLevel('all');
                    setSelectedType('all');
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Сбросить
                </button>
              </div>
            </div>

            {/* Date range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Дата от</label>
                <input
                  type="datetime-local"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Дата до</label>
                <input
                  type="datetime-local"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Results info */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Показано <span className="font-semibold text-gray-900">{currentLogs.length}</span> из <span className="font-semibold text-gray-900">{filteredLogs.length}</span> записей
            </div>
            <button
              onClick={handleClearLogs}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
            >
              <Trash2 className="w-4 h-4" />
              <span>Очистить логи</span>
            </button>
          </div>

          {/* Logs table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Время
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Уровень
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Действие
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Детали
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentLogs.map((log) => {
                    const levelStyles = getLevelStyles(log.level);
                    const LevelIcon = levelStyles.icon;
                    const ActionIcon = log.icon;
                    
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{log.timestamp}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${levelStyles.bg} ${levelStyles.text} ${levelStyles.border}`}>
                            <LevelIcon className="w-4 h-4" />
                            <span className="text-xs font-semibold capitalize">{log.level}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{log.user}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <ActionIcon className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-900">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{log.details}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-xs font-semibold">Подробнее</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Страница <span className="font-semibold">{currentPage}</span> из <span className="font-semibold">{totalPages}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            currentPage === pageNum
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Log details modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Детали лога</h3>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="w-10 h-10 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Основная информация */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-600">ID записи:</span>
                    <span className="text-sm font-bold text-gray-900">#{selectedLog.id}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-600">Время события:</span>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-bold text-gray-900">{selectedLog.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-600">Уровень:</span>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getLevelStyles(selectedLog.level).bg} ${getLevelStyles(selectedLog.level).text} ${getLevelStyles(selectedLog.level).border}`}>
                      {React.createElement(getLevelStyles(selectedLog.level).icon, { className: 'w-4 h-4' })}
                      <span className="text-xs font-semibold capitalize">{selectedLog.level}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-600">Тип:</span>
                    <span className="text-sm font-bold text-gray-900 capitalize">{selectedLog.type}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-600">Пользователь:</span>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-bold text-gray-900">{selectedLog.user}</span>
                    </div>
                  </div>
                </div>

                {/* Действие */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-bold text-gray-600 mb-3">Действие:</h4>
                  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    {React.createElement(selectedLog.icon, { className: 'w-6 h-6 text-purple-600' })}
                    <span className="text-sm font-semibold text-gray-900">{selectedLog.action}</span>
                  </div>
                </div>

                {/* Детали */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-bold text-gray-600 mb-3">Подробности:</h4>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedLog.details}</p>
                  </div>
                </div>

                {/* Дополнительная информация */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-bold text-gray-600 mb-3">Техническая информация:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-xs">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-mono text-gray-900">req_abc123def456</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-xs">
                      <span className="text-gray-600">Session ID:</span>
                      <span className="font-mono text-gray-900">sess_xyz789uvw012</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-xs">
                      <span className="text-gray-600">User Agent:</span>
                      <span className="font-mono text-gray-900">Mozilla/5.0 Chrome/120.0</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-xs">
                      <span className="text-gray-600">Server:</span>
                      <span className="font-mono text-gray-900">server-01.hydroatlas.kz</span>
                    </div>
                  </div>
                </div>

                {/* Действия */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-wrap gap-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold">
                      <Download className="w-5 h-5" />
                      <span>Экспортировать</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold">
                      <Activity className="w-5 h-5" />
                      <span>История</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default LogsPage;
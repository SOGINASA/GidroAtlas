import React, { useState } from 'react';
import { 
  Users,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Upload,
  MoreVertical,
  UserPlus,
  Shield,
  AlertCircle,
  TrendingUp,
  X
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

const UsersManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock данные - пользователи
  const users = [
    {
      id: 1,
      login: 'ivanov_expert',
      firstName: 'Александр',
      lastName: 'Иванов',
      email: 'ivanov@example.kz',
      phone: '+7 701 234 5678',
      role: 'expert',
      organization: 'КазГидроМет',
      position: 'Старший гидролог',
      isActive: true,
      lastLogin: '2024-12-06T10:30:00',
      createdAt: '2023-06-15T09:00:00',
      avatar: null
    },
    {
      id: 2,
      login: 'petrova_mchs',
      firstName: 'Мария',
      lastName: 'Петрова',
      email: 'petrova@mchs.kz',
      phone: '+7 702 345 6789',
      role: 'emergency',
      organization: 'МЧС РК',
      position: 'Начальник отдела',
      isActive: true,
      lastLogin: '2024-12-06T09:15:00',
      createdAt: '2023-08-20T11:00:00',
      avatar: null
    },
    {
      id: 3,
      login: 'sidorov_admin',
      firstName: 'Дмитрий',
      lastName: 'Сидоров',
      email: 'sidorov@hydroatlas.kz',
      phone: '+7 703 456 7890',
      role: 'admin',
      organization: 'GidroAtlas',
      position: 'Системный администратор',
      isActive: true,
      lastLogin: '2024-12-06T11:45:00',
      createdAt: '2023-01-10T08:00:00',
      avatar: null
    },
    {
      id: 4,
      login: 'kozlov_expert',
      firstName: 'Владимир',
      lastName: 'Козлов',
      email: 'kozlov@institute.kz',
      phone: '+7 704 567 8901',
      role: 'expert',
      organization: 'НИИ Водных ресурсов',
      position: 'Научный сотрудник',
      isActive: false,
      lastLogin: '2024-11-28T16:20:00',
      createdAt: '2023-09-05T10:30:00',
      avatar: null
    },
    {
      id: 5,
      login: 'smirnova_expert',
      firstName: 'Елена',
      lastName: 'Смирнова',
      email: 'smirnova@water.kz',
      phone: '+7 705 678 9012',
      role: 'expert',
      organization: 'Водоканал',
      position: 'Инженер-эколог',
      isActive: true,
      lastLogin: '2024-12-05T14:50:00',
      createdAt: '2023-11-12T13:15:00',
      avatar: null
    }
  ];

  // Статистика
  const stats = [
    {
      icon: Users,
      label: 'Всего пользователей',
      value: '342',
      change: '+12',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: CheckCircle,
      label: 'Активных',
      value: '298',
      change: '+8',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: XCircle,
      label: 'Неактивных',
      value: '44',
      change: '+4',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: UserPlus,
      label: 'Новых за неделю',
      value: '12',
      change: '+5',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  // Распределение по ролям
  const roleDistribution = [
    { role: 'guest', label: 'Гости', count: 145, color: 'bg-gray-500', icon: '👤' },
    { role: 'expert', label: 'Эксперты', count: 128, color: 'bg-blue-500', icon: '🎓' },
    { role: 'emergency', label: 'МЧС', count: 45, color: 'bg-red-500', icon: '🚨' },
    { role: 'admin', label: 'Администраторы', count: 24, color: 'bg-purple-500', icon: '⚙️' }
  ];

  const getRoleBadge = (role) => {
    const roles = {
      guest: { label: 'Гость', color: 'bg-gray-100 text-gray-800 border-gray-300' },
      expert: { label: 'Эксперт', color: 'bg-blue-100 text-blue-800 border-blue-300' },
      emergency: { label: 'МЧС', color: 'bg-red-100 text-red-800 border-red-300' },
      admin: { label: 'Админ', color: 'bg-purple-100 text-purple-800 border-purple-300' }
    };
    return roles[role] || roles.guest;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      console.log('Удаление пользователя:', userId);
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    console.log(`${currentStatus ? 'Деактивация' : 'Активация'} пользователя:`, userId);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.login.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && user.isActive) ||
      (selectedStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Users className="w-8 h-8 mr-3" />
                  Управление пользователями
                </h1>
                <p className="text-purple-100">Администрирование учётных записей и доступа</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Добавить пользователя</span>
              </button>
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
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{stat.change} за неделю</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Role Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 text-purple-600 mr-2" />
              Распределение по ролям
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {roleDistribution.map((roleData, index) => (
                <div key={index} className={`${roleData.color} text-white rounded-xl p-6 hover:shadow-lg transition-shadow`}>
                  <div className="text-4xl mb-3">{roleData.icon}</div>
                  <p className="text-3xl font-bold mb-1">{roleData.count}</p>
                  <p className="text-sm text-white/90">{roleData.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Имя, email, логин..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Роль</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Все роли</option>
                  <option value="guest">Гость</option>
                  <option value="expert">Эксперт</option>
                  <option value="emergency">МЧС</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Все</option>
                  <option value="active">Активные</option>
                  <option value="inactive">Неактивные</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Найдено: <span className="font-semibold">{filteredUsers.length}</span> из {users.length}
              </p>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Экспорт</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Импорт</span>
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Контакты
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Организация
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Роль
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Последний вход
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        
                        {/* User Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-gray-500">@{user.login}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contacts */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {user.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {user.phone}
                            </div>
                          </div>
                        </td>

                        {/* Organization */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                              {user.organization}
                            </div>
                            <p className="text-xs text-gray-500 ml-6">{user.position}</p>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${roleBadge.color}`}>
                            {roleBadge.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {user.isActive ? (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                              <CheckCircle className="w-3 h-3" />
                              <span>Активен</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
                              <XCircle className="w-3 h-3" />
                              <span>Неактивен</span>
                            </span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(user.lastLogin)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Просмотреть"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => console.log('Edit user:', user.id)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Редактировать"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleToggleStatus(user.id, user.isActive)}
                              className={`p-2 ${user.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'} rounded-lg transition-colors`}
                              title={user.isActive ? 'Деактивировать' : 'Активировать'}
                            >
                              {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold">Пользователи не найдены</p>
                <p className="text-gray-500 text-sm mt-2">Попробуйте изменить параметры поиска</p>
              </div>
            )}
          </div>
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Детали пользователя</h2>
                  <button 
                    onClick={() => {
                      setShowUserModal(false);
                      setSelectedUser(null);
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* User Avatar & Name */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-gray-600">@{selectedUser.login}</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mt-2 ${getRoleBadge(selectedUser.role).color}`}>
                      {getRoleBadge(selectedUser.role).label}
                    </span>
                  </div>
                </div>

                {/* Info Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Контактная информация</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-700">{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-700">{selectedUser.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Organization Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Организация</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-700">{selectedUser.organization}</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{selectedUser.position}</p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Информация об аккаунте</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">Создан:</span>
                        <span className="text-gray-900 ml-2">{formatDate(selectedUser.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">Последний вход:</span>
                        <span className="text-gray-900 ml-2">{formatDate(selectedUser.lastLogin)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Статус</h4>
                    {selectedUser.isActive ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-700">Аккаунт активен</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-700">Аккаунт деактивирован</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button className="flex-1 bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition-colors font-semibold flex items-center justify-center space-x-2">
                  <Edit3 className="w-5 h-5" />
                  <span>Редактировать</span>
                </button>
                <button 
                  onClick={() => handleToggleStatus(selectedUser.id, selectedUser.isActive)}
                  className={`flex-1 py-3 rounded-xl transition-colors font-semibold flex items-center justify-center space-x-2 ${
                    selectedUser.isActive 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {selectedUser.isActive ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                  <span>{selectedUser.isActive ? 'Деактивировать' : 'Активировать'}</span>
                </button>
                <button 
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Удалить</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersManagement;
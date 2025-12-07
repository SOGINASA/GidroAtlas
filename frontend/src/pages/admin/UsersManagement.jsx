import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  UserPlus,
  AlertCircle,
  X,
  Loader
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';
import { getAllUsers, createUser, updateUserProfile, deleteUser, getUserStats } from '../../services/userService';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Форма нового пользователя
  const [newUserData, setNewUserData] = useState({
    email: '',
    full_name: '',
    password: '',
    phone: '',
    user_type: 'user',
    address: '',
    is_verified: false
  });

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [selectedRole, selectedStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedRole !== 'all') params.user_type = selectedRole;
      // Фильтр по статусу пока не поддерживается в API

      const response = await getAllUsers(params);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getUserStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const response = await createUser(newUserData);
      if (response.success) {
        alert('Пользователь успешно создан');
        setShowAddModal(false);
        setNewUserData({
          email: '',
          full_name: '',
          password: '',
          phone: '',
          user_type: 'user',
          address: '',
          is_verified: false
        });
        loadUsers();
        loadStats();
      }
    } catch (err) {
      alert(`Ошибка: ${err}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

    try {
      setActionLoading(true);
      const response = await deleteUser(userId);
      if (response.success) {
        alert('Пользователь удалён');
        loadUsers();
        loadStats();
      }
    } catch (err) {
      alert(`Ошибка: ${err}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (userId, data) => {
    try {
      setActionLoading(true);
      const response = await updateUserProfile(userId, data);
      if (response.success) {
        alert('Пользователь обновлён');
        loadUsers();
      }
    } catch (err) {
      alert(`Ошибка: ${err}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.user_type === selectedRole;
    const matchesStatus = selectedStatus === 'all' ||
      (selectedStatus === 'active' && user.is_active !== false) ||
      (selectedStatus === 'inactive' && user.is_active === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Статистика
  const statsCards = stats ? [
    {
      icon: Users,
      label: 'Всего пользователей',
      value: stats.total || 0,
      change: stats.total ? '+' + (stats.total - (stats.total - (stats.verified || 0))) : '0',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: CheckCircle,
      label: 'Верифицированных',
      value: stats.verified || 0,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: XCircle,
      label: 'Не верифицированных',
      value: stats.unverified || 0,
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: UserPlus,
      label: 'Экспертов',
      value: stats.experts || 0,
      color: 'from-blue-500 to-cyan-500'
    }
  ] : [];

  const getRoleLabel = (role) => {
    const roles = {
      'user': 'Гость',
      'expert': 'Эксперт',
      'emergency': 'МЧС',
      'admin': 'Администратор'
    };
    return roles[role] || role;
  };

  const getRoleBadge = (role) => {
    const badges = {
      'admin': 'bg-purple-100 text-purple-700',
      'expert': 'bg-blue-100 text-blue-700',
      'emergency': 'bg-red-100 text-red-700',
      'user': 'bg-gray-100 text-gray-700'
    };
    return badges[role] || 'bg-gray-100 text-gray-700';
  };

  if (loading && users.length === 0) {
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Управление пользователями</h1>
              <p className="text-purple-100">Просмотр и редактирование пользователей системы</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Добавить пользователя
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Поиск */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Фильтры */}
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Все роли</option>
                <option value="user">Гости</option>
                <option value="expert">Эксперты</option>
                <option value="emergency">МЧС</option>
                <option value="admin">Администраторы</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="inactive">Неактивные</option>
              </select>
            </div>
          </div>
        </div>

        {/* Таблица пользователей */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Контакты
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.full_name || 'Без имени'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.user_type)}`}>
                        {getRoleLabel(user.user_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 disabled:opacity-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Пользователи не найдены</p>
            </div>
          )}
        </div>

        {/* Модальное окно добавления пользователя */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Добавить пользователя</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ФИО *
                      </label>
                      <input
                        type="text"
                        required
                        value={newUserData.full_name}
                        onChange={(e) => setNewUserData({...newUserData, full_name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Пароль *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newUserData.password}
                        onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        value={newUserData.phone}
                        onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Роль *
                      </label>
                      <select
                        required
                        value={newUserData.user_type}
                        onChange={(e) => setNewUserData({...newUserData, user_type: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="user">Гость</option>
                        <option value="expert">Эксперт</option>
                        <option value="emergency">МЧС</option>
                        <option value="admin">Администратор</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Адрес
                      </label>
                      <input
                        type="text"
                        value={newUserData.address}
                        onChange={(e) => setNewUserData({...newUserData, address: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_verified"
                      checked={newUserData.is_verified}
                      onChange={(e) => setNewUserData({...newUserData, is_verified: e.target.checked})}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <label htmlFor="is_verified" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Верифицированный пользователь
                    </label>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                      Создать
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно просмотра пользователя */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Информация о пользователе</h2>
                  <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {selectedUser.full_name ? selectedUser.full_name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedUser.full_name}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Роль</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{getRoleLabel(selectedUser.user_type)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Телефон</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.phone || 'Не указан'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Дата регистрации</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(selectedUser.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Последний вход</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString('ru-RU') : 'Никогда'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersManagement;

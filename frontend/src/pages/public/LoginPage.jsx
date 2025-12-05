import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Droplets, User, GraduationCap, Siren, Settings, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const userTypes = [
    {
      id: 'guest',
      icon: User,
      title: 'Гость',
      subtitle: 'Базовый доступ',
      description: 'Просмотр карты без регистрации',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      route: '/guest/map',
      needsAuth: false
    },
    {
      id: 'expert',
      icon: GraduationCap,
      title: 'Эксперт',
      subtitle: 'Профессиональный доступ',
      description: 'Полная аналитика и AI-прогнозы',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      route: '/expert/dashboard',
      needsAuth: true
    },
    {
      id: 'emergency',
      icon: Siren,
      title: 'МЧС',
      subtitle: 'Оперативное управление',
      description: 'Мониторинг критических зон',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      route: '/emergency/control-center',
      needsAuth: true
    },
    {
      id: 'admin',
      icon: Settings,
      title: 'Администратор',
      subtitle: 'Полное управление',
      description: 'Управление системой и данными',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      route: '/admin/overview',
      needsAuth: true
    }
  ];

  const handleRoleSelect = (role) => {
    if (role.id === 'guest') {
      // Гость не требует авторизации
      navigate(role.route);
    } else {
      setSelectedRole(role.id);
      setError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock валидация (в реальности будет API запрос)
      if (!email || !password) {
        throw new Error('Заполните все поля');
      }

      if (password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }

      // Mock пользователь
      const mockUser = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
        role: selectedRole
      };

      // Логиним через контекст
      login(mockUser, selectedRole);

      // Редирект на нужную страницу
      const roleData = userTypes.find(r => r.id === selectedRole);
      navigate(roleData.route);

    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    // Быстрый вход с демо данными
    const mockUser = {
      id: Date.now(),
      email: `demo_${role}@gidroatlas.kz`,
      name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role: role
    };

    login(mockUser, role);
    
    const roleData = userTypes.find(r => r.id === role);
    navigate(roleData.route);
  };

  if (!selectedRole) {
    // Выбор роли
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a4275] via-[#0d5a94] to-[#1068a8] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Droplets className="w-9 h-9 text-white" />
              </div>
            </Link>
            <h1 className="text-5xl font-bold text-white mb-4">Добро пожаловать</h1>
            <p className="text-xl text-cyan-100">Выберите тип учётной записи для входа</p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-br ${role.color} p-8 text-center`}>
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{role.title}</h3>
                    <p className="text-white/80 text-sm">{role.subtitle}</p>
                  </div>

                  {/* Body */}
                  <div className="p-6 bg-white/5">
                    <p className="text-white/70 text-sm text-center mb-6 leading-relaxed">
                      {role.description}
                    </p>
                    
                    <button
                      className={`w-full py-3 bg-gradient-to-br ${role.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all group-hover:scale-105`}
                    >
                      {role.needsAuth ? 'Войти' : 'Перейти'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link
              to="/"
              className="text-cyan-300 hover:text-white transition-colors text-lg"
            >
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Форма входа для выбранной роли
  const currentRole = userTypes.find(r => r.id === selectedRole);
  const Icon = currentRole.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a4275] via-[#0d5a94] to-[#1068a8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Droplets className="w-9 h-9 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Вход в систему</h1>
          
          {/* Selected Role Badge */}
          <div className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-br ${currentRole.color} rounded-xl shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
            <div className="text-left">
              <p className="text-white font-bold">{currentRole.title}</p>
              <p className="text-white/80 text-xs">{currentRole.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-medium mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-gradient-to-br ${currentRole.color} text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>

            {/* Quick Demo Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-white/60">или</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleQuickLogin(selectedRole)}
              className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              🚀 Быстрый вход (демо)
            </button>
          </form>

          {/* Back to Role Selection */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setSelectedRole(null)}
              className="text-cyan-300 hover:text-white transition-colors text-sm"
            >
              ← Выбрать другую роль
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-white/70">
            Нет аккаунта?{' '}
            <Link
              to="/register"
              className="text-cyan-300 hover:text-white font-semibold transition-colors"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Droplets, User, GraduationCap, Siren, Settings, Lock, Mail, Eye, EyeOff, UserCircle, Phone, Building } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const userTypes = [
    {
      id: 'expert',
      icon: GraduationCap,
      title: 'Эксперт',
      subtitle: 'Профессиональный доступ',
      description: 'Для специалистов гидротехнической отрасли',
      color: 'from-blue-500 to-blue-600',
      route: '/expert/dashboard'
    },
    {
      id: 'emergency',
      icon: Siren,
      title: 'МЧС',
      subtitle: 'Оперативное управление',
      description: 'Для сотрудников МЧС и экстренных служб',
      color: 'from-red-500 to-red-600',
      route: '/emergency/control-center'
    },
    {
      id: 'admin',
      icon: Settings,
      title: 'Администратор',
      subtitle: 'Полное управление',
      description: 'Для системных администраторов (требуется одобрение)',
      color: 'from-purple-500 to-purple-600',
      route: '/admin/overview'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Валидация
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('Заполните все обязательные поля');
      }

      if (formData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Некорректный email адрес');
      }

      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock пользователь
      const mockUser = {
        id: Date.now(),
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        organization: formData.organization,
        role: selectedRole
      };

      // Автоматический вход после регистрации
      login(mockUser, selectedRole);

      // Редирект на нужную страницу
      const roleData = userTypes.find(r => r.id === selectedRole);
      navigate(roleData.route);

    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    // Выбор роли
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a4275] via-[#0d5a94] to-[#1068a8] flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Droplets className="w-9 h-9 text-white" />
              </div>
            </Link>
            <h1 className="text-5xl font-bold text-white mb-4">Регистрация</h1>
            <p className="text-xl text-cyan-100">Выберите тип учётной записи для регистрации</p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {userTypes.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
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
                      Выбрать
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guest Notice */}
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <User className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-2">Гостевой доступ</h3>
                <p className="text-white/70 text-sm mb-4">
                  Для просмотра карты без регистрации используйте гостевой режим на странице входа.
                </p>
                <Link
                  to="/login"
                  className="text-cyan-300 hover:text-white text-sm font-semibold transition-colors"
                >
                  Перейти к входу →
                </Link>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
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

  // Форма регистрации для выбранной роли
  const currentRole = userTypes.find(r => r.id === selectedRole);
  const Icon = currentRole.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a4275] via-[#0d5a94] to-[#1068a8] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Droplets className="w-9 h-9 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Создание учётной записи</h1>
          
          {/* Selected Role Badge */}
          <div className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-br ${currentRole.color} rounded-xl shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
            <div className="text-left">
              <p className="text-white font-bold">{currentRole.title}</p>
              <p className="text-white/80 text-xs">{currentRole.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Имя *
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Иван"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Фамилия *
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Иванов"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white font-medium mb-2">
                Телефон
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+7 (XXX) XXX-XX-XX"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-white font-medium mb-2">
                Организация
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Название организации"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-medium mb-2">
                Пароль *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-white font-medium mb-2">
                Подтвердите пароль *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Admin Notice */}
            {selectedRole === 'admin' && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-3">
                <p className="text-yellow-200 text-xs text-center">
                  ⚠️ Регистрация администратора требует одобрения. Доступ будет предоставлен после проверки.
                </p>
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
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
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

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-white/70">
            Уже есть аккаунт?{' '}
            <Link
              to="/login"
              className="text-cyan-300 hover:text-white font-semibold transition-colors"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
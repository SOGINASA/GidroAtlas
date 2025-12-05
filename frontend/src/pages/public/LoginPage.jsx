import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../components/api/AuthUtils';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'citizen';
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // После успешного входа редиректим по роли пользователя
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.user_type === 'admin') {
        navigate('/admin/overview');
      } else if (user?.user_type === 'mchs' || user?.role === 'emergency') {
        navigate('/emergency/control-center');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = () => {
    if (role === 'citizen') return { title: 'Вход для граждан', color: 'blue', icon: '👥' };
    if (role === 'emergency') return { title: 'Вход для МЧС', color: 'red', icon: '🚨' };
    if (role === 'admin') return { title: 'Вход для администраторов', color: 'purple', icon: '⚙️' };
    return { title: 'Вход', color: 'blue', icon: '🔐' };
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{roleInfo.icon}</div>
          <h2 className="text-3xl font-bold text-gray-800">{roleInfo.title}</h2>
          <p className="text-gray-600 mt-2">Гидроатлас Казахстана</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@mail.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-${roleInfo.color}-500 text-white py-3 rounded-lg font-semibold hover:bg-${roleInfo.color}-600 transition-colors`}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-gray-600 hover:text-gray-800">
              ← Вернуться на главную
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
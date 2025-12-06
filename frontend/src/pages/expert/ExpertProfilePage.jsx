import React, { useState, useEffect } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { User, Mail, Phone, MapPin, Save, Loader2, AlertCircle } from 'lucide-react';
import { getUserFromStorage } from '../../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../../services/userService';

const ExpertProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [activeTab, setActiveTab] = useState('profile'); // profile, security

  // Загрузка данных профиля при монтировании компонента
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = getUserFromStorage();
      console.log('Current user from localStorage:', currentUser);

      if (!currentUser) {
        setError('Пользователь не авторизован');
        return;
      }

      const userId = currentUser.id;
      console.log('User ID:', userId);

      if (!userId) {
        setError('ID пользователя не найден');
        return;
      }

      const response = await getUserProfile(userId);

      if (response.success && response.data) {
        setFormData({
          full_name: response.data.full_name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || ''
        });
      }
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      setError(err.message || 'Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Сбрасываем сообщения при изменении
    setSuccessMessage(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const currentUser = getUserFromStorage();
      if (!currentUser || !currentUser.id) {
        setError('Пользователь не авторизован');
        return;
      }

      // Отправляем только измененные данные
      const updateData = {
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address
      };

      const response = await updateUserProfile(currentUser.id, updateData);

      if (response.success) {
        setSuccessMessage('Профиль успешно обновлён!');
        // Обновляем данные пользователя в localStorage
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user_data', JSON.stringify(updatedUser));

        // Автоматически скрываем сообщение через 3 секунды
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
      setError(err.message || 'Не удалось обновить профиль');
    } finally {
      setSaving(false);
    }
  };

  // Показываем индикатор загрузки
  if (loading) {
    return (
      <ExpertLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Загрузка профиля...</p>
          </div>
        </div>
      </ExpertLayout>
    );
  }

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                <User className="w-10 h-10 lg:w-12 lg:h-12" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">
                  {formData.full_name || 'Эксперт'}
                </h1>
                <p className="text-sm lg:text-base text-blue-100 mt-1">
                  {formData.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          
          {/* Tabs */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm mb-6 border border-gray-100">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 text-sm lg:text-base font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Профиль
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 px-6 py-4 text-sm lg:text-base font-medium transition-all ${
                  activeTab === 'security'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Безопасность
              </button>
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-100">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                Личная информация
              </h2>

              {/* Сообщения об ошибках и успехе */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Ошибка</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    ФИО
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите полное имя"
                  />
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                      title="Email нельзя изменить"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email нельзя изменить
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Телефон
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+7 (777) 123-45-67"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Адрес
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите адрес"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Сохранение...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Сохранить изменения</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-100">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                Безопасность
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Для изменения пароля обратитесь к администратору системы.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Активные сессии
                  </h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Текущая сессия</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Chrome на Windows • Алматы, Казахстан
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Последняя активность: только что
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Активна
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertProfilePage;
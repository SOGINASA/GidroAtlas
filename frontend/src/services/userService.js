import api from './api';

/**
 * Получить данные профиля текущего пользователя
 * @param {number} userId - ID пользователя
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    throw error.response?.data?.error || 'Не удалось загрузить профиль';
  }
};

/**
 * Обновить данные профиля пользователя
 * @param {number} userId - ID пользователя
 * @param {Object} userData - Данные для обновления
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    throw error.response?.data?.error || 'Не удалось обновить профиль';
  }
};

/**
 * Получить статистику пользователей (только для admin/mchs)
 */
export const getUserStats = async () => {
  try {
    const response = await api.get('/users/stats');
    return response.data;
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    throw error.response?.data?.error || 'Не удалось загрузить статистику';
  }
};

/**
 * Получить всех пользователей (только для admin/mchs)
 * @param {Object} params - Параметры фильтрации
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get('/users', { params });
    return response.data;
  } catch (error) {
    console.error('Ошибка получения списка пользователей:', error);
    throw error.response?.data?.error || 'Не удалось загрузить пользователей';
  }
};

/**
 * Получить список жителей (только для admin/mchs)
 * @param {string} search - Поисковый запрос
 */
export const getResidents = async (search = '') => {
  try {
    const response = await api.get('/users/residents', {
      params: { search }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка получения списка жителей:', error);
    throw error.response?.data?.error || 'Не удалось загрузить жителей';
  }
};

/**
 * Создать нового пользователя (только для admin)
 * @param {Object} userData - Данные нового пользователя
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
    throw error.response?.data?.error || 'Не удалось создать пользователя';
  }
};

/**
 * Удалить пользователя (только для admin)
 * @param {number} userId - ID пользователя
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    throw error.response?.data?.error || 'Не удалось удалить пользователя';
  }
};

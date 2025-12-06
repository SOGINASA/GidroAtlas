import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getAccessToken } from './authService';

// Настройка axios для notifications
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/notifications`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Получить все уведомления текущего пользователя
 * @param {Object} params - { unread_only?: boolean, limit?: number }
 * @returns {Promise<Object>}
 */
export const getAllNotifications = async (params = {}) => {
  try {
    const response = await api.get('', { params });
    return {
      data: response.data.data,
      count: response.data.count,
      unreadCount: response.data.unreadCount
    };
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить уведомления');
  }
};

/**
 * Получить все уведомления (алиас для getAllNotifications)
 */
export const getNotifications = async (params = {}) => {
  return getAllNotifications(params);
};

/**
 * Получить только непрочитанные уведомления
 * @returns {Promise<Object>}
 */
export const getUnreadNotifications = async () => {
  try {
    const response = await api.get('', {
      params: { unread_only: true }
    });
    return {
      data: response.data.data,
      count: response.data.count
    };
  } catch (error) {
    console.error('Ошибка получения непрочитанных уведомлений:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить уведомления');
  }
};

/**
 * Получить количество непрочитанных уведомлений
 * @returns {Promise<Object>}
 */
export const getUnreadCount = async () => {
  try {
    const response = await api.get('', {
      params: { unread_only: true }
    });
    return {
      data: { count: response.data.count }
    };
  } catch (error) {
    console.error('Ошибка получения счетчика уведомлений:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить счетчик');
  }
};

/**
 * Получить статистику уведомлений
 * @returns {Promise<Object>}
 */
export const getNotificationStats = async () => {
  try {
    const response = await api.get('/stats');
    return { data: response.data.data };
  } catch (error) {
    console.error('Ошибка получения статистики уведомлений:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить статистику');
  }
};

/**
 * Получить конкретное уведомление
 * @param {number} notificationId
 * @returns {Promise<Object>}
 */
export const getNotificationById = async (notificationId) => {
  try {
    const response = await api.get(`/${notificationId}`);
    return { data: response.data.data };
  } catch (error) {
    console.error('Ошибка получения уведомления:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить уведомление');
  }
};

/**
 * Отметить уведомление как прочитанное
 * @param {number} notificationId
 * @returns {Promise<Object>}
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/${notificationId}/read`);
    return { data: response.data.data };
  } catch (error) {
    console.error('Ошибка обновления уведомления:', error);
    throw new Error(error.response?.data?.error || 'Не удалось обновить уведомление');
  }
};

/**
 * Отметить все уведомления как прочитанные
 * @returns {Promise<Object>}
 */
export const markAllAsRead = async () => {
  try {
    const response = await api.put('/mark-all-read');
    return {
      data: { success: true },
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка обновления уведомлений:', error);
    throw new Error(error.response?.data?.error || 'Не удалось обновить уведомления');
  }
};

/**
 * Удалить уведомление
 * @param {number} notificationId
 * @returns {Promise<Object>}
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/${notificationId}`);
    return {
      data: { success: true },
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка удаления уведомления:', error);
    throw new Error(error.response?.data?.error || 'Не удалось удалить уведомление');
  }
};

/**
 * Создать уведомление (admin/mchs)
 * @param {Object} notificationData - { user_id, type, title, message, sensor_id?, evacuation_id?, is_important? }
 * @returns {Promise<Object>}
 */
export const createNotification = async (notificationData) => {
  try {
    const response = await api.post('', notificationData);
    return {
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка создания уведомления:', error);
    throw new Error(error.response?.data?.error || 'Не удалось создать уведомление');
  }
};

/**
 * Отправить массовое уведомление (broadcast)
 * Создает уведомления для нескольких пользователей
 * @param {Object} broadcastData - { user_ids: number[], type, title, message, is_important? }
 * @returns {Promise<Object>}
 */
export const sendBroadcastNotification = async (broadcastData) => {
  try {
    const { user_ids, ...notificationData } = broadcastData;

    // Создаем уведомления для каждого пользователя
    const promises = user_ids.map(user_id =>
      createNotification({ ...notificationData, user_id })
    );

    const results = await Promise.all(promises);

    return {
      data: {
        success: true,
        recipientsCount: results.length,
        notifications: results.map(r => r.data)
      }
    };
  } catch (error) {
    console.error('Ошибка отправки массового уведомления:', error);
    throw new Error(error.response?.data?.error || 'Не удалось отправить уведомления');
  }
};

/**
 * Получить всех пользователей для отправки уведомлений
 * @param {Object} filters - { zone?, role? }
 * @returns {Promise<Array>}
 */
export const getUsersForNotification = async (filters = {}) => {
  try {
    const usersApi = axios.create({
      baseURL: `${API_BASE_URL}/api/users`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });

    const response = await usersApi.get('', { params: filters });
    return response.data.data || [];
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить пользователей');
  }
};

/**
 * Отправить уведомление всем пользователям (broadcast)
 * @param {Object} broadcastData - { type, title, message, sensor_id?, is_important?, role_filter? }
 * @returns {Promise<Object>}
 */
export const sendBroadcast = async (broadcastData) => {
  try {
    const response = await api.post('/broadcast', broadcastData);
    return {
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка отправки broadcast уведомления:', error);
    throw new Error(error.response?.data?.error || 'Не удалось отправить уведомление');
  }
};

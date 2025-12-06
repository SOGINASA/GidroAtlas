import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Настройка axios для auth
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ключи для localStorage
const AUTH_STORAGE_KEY = 'access_token';
const REFRESH_STORAGE_KEY = 'refresh_token';
const USER_STORAGE_KEY = 'user_data';

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истёк или недействителен - очищаем localStorage
      removeUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Получение текущего пользователя из localStorage
 */
export const getCurrentUser = () => {
  const userJson = localStorage.getItem(USER_STORAGE_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Сохранение пользователя и токенов в localStorage
 */
const saveUser = (userData, accessToken, refreshToken) => {
  localStorage.setItem(AUTH_STORAGE_KEY, accessToken);
  localStorage.setItem(REFRESH_STORAGE_KEY, refreshToken);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
};

/**
 * Удаление пользователя и токенов из localStorage
 */
const removeUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(REFRESH_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

/**
 * Вход в систему
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Данные пользователя
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });

    const { user, access_token, refresh_token } = response.data;

    // Сохраняем токены и данные пользователя
    saveUser(user, access_token, refresh_token);

    return { success: true, data: user };
  } catch (error) {
    console.error('Ошибка входа:', error);
    throw new Error(error.response?.data?.error || 'Не удалось войти в систему');
  }
};

/**
 * Регистрация пользователя
 * @param {Object} userData - { email, password, full_name, phone, address }
 * @returns {Promise<Object>} Данные пользователя
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);

    const { user, access_token, refresh_token } = response.data;

    // Сохраняем токены и данные пользователя
    saveUser(user, access_token, refresh_token);

    return { success: true, data: user };
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw new Error(error.response?.data?.error || 'Не удалось зарегистрироваться');
  }
};

/**
 * Выход из системы
 */
export const logout = async () => {
  try {
    // Удаляем данные из localStorage
    removeUser();

    return { success: true, message: 'Успешный выход' };
  } catch (error) {
    console.error('Ошибка выхода:', error);
    // Даже при ошибке очищаем localStorage
    removeUser();
    throw error;
  }
};

/**
 * Проверка авторизации
 * @returns {boolean}
 */
export const checkAuth = () => {
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Получение роли пользователя
 * @returns {string|null}
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.user_type : null;
};

/**
 * Получение токена доступа
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return localStorage.getItem(AUTH_STORAGE_KEY);
};

/**
 * Обновление токена
 * @returns {Promise<string>} Новый access token
 */
export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem(REFRESH_STORAGE_KEY);

    if (!refresh) {
      throw new Error('Refresh token отсутствует');
    }

    const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
      refresh_token: refresh
    });

    const { access_token } = response.data;
    localStorage.setItem(AUTH_STORAGE_KEY, access_token);

    return access_token;
  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    removeUser();
    throw error;
  }
};

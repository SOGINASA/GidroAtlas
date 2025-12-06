import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для добавления токена авторизации к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки ответов и ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истёк или недействителен
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Утилиты для тестирования (оставляем для совместимости)
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockRequest = async (data, delayMs = 500) => {
  await delay(delayMs);
  return {
    success: true,
    data: data
  };
};

export const mockError = async (message, delayMs = 500) => {
  await delay(delayMs);
  throw new Error(message);
};
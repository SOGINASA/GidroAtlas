import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Настройка axios
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/sensors`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для добавления токена авторизации
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

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Требуется авторизация');
    }
    return Promise.reject(error);
  }
);

/**
 * Получение всех датчиков
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getAllSensors = async () => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Ошибка получения датчиков:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить датчики');
  }
};

/**
 * Получение датчика по ID
 * @param {string} id - ID датчика
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getSensorById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения датчика ${id}:`, error);
    throw new Error(error.response?.data?.error || 'Датчик не найден');
  }
};

/**
 * Получение критических датчиков
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getCriticalSensors = async () => {
  try {
    const response = await api.get('/critical');
    return response.data;
  } catch (error) {
    console.error('Ошибка получения критических датчиков:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить критические датчики');
  }
};

/**
 * Получение зон риска
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getRiskZones = async () => {
  try {
    const response = await api.get('/zones');
    return response.data;
  } catch (error) {
    console.error('Ошибка получения зон риска:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить зоны риска');
  }
};

/**
 * Получение среднего уровня воды
 * @returns {Promise<{success: boolean, data: {average: number, total: number}}>}
 */
export const getAverageWaterLevel = async () => {
  try {
    const response = await api.get('/average');
    return response.data;
  } catch (error) {
    console.error('Ошибка получения среднего уровня:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить средний уровень');
  }
};

/**
 * Получение истории показаний датчика
 * @param {string} sensorId - ID датчика
 * @param {number} hours - Количество часов истории (по умолчанию 24)
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getSensorHistory = async (sensorId, hours = 24) => {
  try {
    const response = await api.get(`/${sensorId}/readings`, {
      params: { hours }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения истории датчика ${sensorId}:`, error);
    throw new Error(error.response?.data?.error || 'Не удалось получить историю показаний');
  }
};

/**
 * ADMIN: Создание нового датчика
 * @param {Object} sensorData - Данные датчика
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const createSensor = async (sensorData) => {
  try {
    const response = await api.post('', sensorData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания датчика:', error);
    throw new Error(error.response?.data?.error || 'Не удалось создать датчик');
  }
};

/**
 * ADMIN: Обновление датчика
 * @param {string} sensorId - ID датчика
 * @param {Object} updateData - Данные для обновления
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const updateSensor = async (sensorId, updateData) => {
  try {
    const response = await api.put(`/${sensorId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Ошибка обновления датчика ${sensorId}:`, error);
    throw new Error(error.response?.data?.error || 'Не удалось обновить датчик');
  }
};

/**
 * ADMIN: Удаление датчика
 * @param {string} sensorId - ID датчика
 * @returns {Promise<{success: boolean}>}
 */
export const deleteSensor = async (sensorId) => {
  try {
    const response = await api.delete(`/${sensorId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка удаления датчика ${sensorId}:`, error);
    throw new Error(error.response?.data?.error || 'Не удалось удалить датчик');
  }
};

/**
 * ADMIN/MCHS: Добавление показания датчика
 * @param {string} sensorId - ID датчика
 * @param {Object} readingData - Данные показания
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const addSensorReading = async (sensorId, readingData) => {
  try {
    const response = await api.post(`/${sensorId}/readings`, readingData);
    return response.data;
  } catch (error) {
    console.error(`Ошибка добавления показания для ${sensorId}:`, error);
    throw new Error(error.response?.data?.error || 'Не удалось добавить показание');
  }
};

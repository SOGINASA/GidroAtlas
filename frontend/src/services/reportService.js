import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getAccessToken } from './authService';

// Настройка axios для reports
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/reports`,
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
 * Получить все отчёты
 * @param {Object} params - { type?: string, status?: string }
 * @returns {Promise<Object>}
 */
export const getAllReports = async (params = {}) => {
  try {
    const response = await api.get('', { params });
    return {
      data: response.data.data,
      count: response.data.count
    };
  } catch (error) {
    console.error('Ошибка получения отчётов:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить отчёты');
  }
};

/**
 * Получить конкретный отчёт
 * @param {number} reportId
 * @returns {Promise<Object>}
 */
export const getReportById = async (reportId) => {
  try {
    const response = await api.get(`/${reportId}`);
    return { data: response.data.data };
  } catch (error) {
    console.error('Ошибка получения отчёта:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить отчёт');
  }
};

/**
 * Создать новый отчёт (admin/mchs)
 * @param {Object} reportData - {
 *   title: string,
 *   period: string,
 *   period_start?: string (ISO date),
 *   period_end?: string (ISO date),
 *   type: 'weekly' | 'monthly' | 'incident' | 'evacuation',
 *   status?: 'draft' | 'completed',
 *   stats?: { incidents: number, critical: number, evacuations: number },
 *   content?: string,
 *   file_size?: string,
 *   related_sensor_ids?: string[],
 *   related_evacuation_ids?: number[],
 *   related_zone_ids?: string[]
 * }
 * @returns {Promise<Object>}
 */
export const createReport = async (reportData) => {
  try {
    const response = await api.post('', reportData);
    return {
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка создания отчёта:', error);
    throw new Error(error.response?.data?.error || 'Не удалось создать отчёт');
  }
};

/**
 * Обновить отчёт (admin/mchs)
 * @param {number} reportId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
export const updateReport = async (reportId, updateData) => {
  try {
    const response = await api.put(`/${reportId}`, updateData);
    return {
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка обновления отчёта:', error);
    throw new Error(error.response?.data?.error || 'Не удалось обновить отчёт');
  }
};

/**
 * Обновить статус отчёта (admin/mchs)
 * @param {number} reportId
 * @param {string} status - 'draft' | 'completed'
 * @returns {Promise<Object>}
 */
export const updateReportStatus = async (reportId, status) => {
  return updateReport(reportId, { status });
};

/**
 * Удалить отчёт (admin)
 * @param {number} reportId
 * @returns {Promise<Object>}
 */
export const deleteReport = async (reportId) => {
  try {
    const response = await api.delete(`/${reportId}`);
    return {
      data: { success: true },
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка удаления отчёта:', error);
    throw new Error(error.response?.data?.error || 'Не удалось удалить отчёт');
  }
};

/**
 * Получить статистику отчётов (admin/mchs)
 * @returns {Promise<Object>}
 */
export const getReportStats = async () => {
  try {
    const response = await api.get('/stats');
    return { data: response.data.data };
  } catch (error) {
    console.error('Ошибка получения статистики отчётов:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить статистику');
  }
};

/**
 * Получить шаблоны отчётов (admin/mchs)
 * @returns {Promise<Object>}
 */
export const getReportTemplates = async () => {
  try {
    const response = await api.get('/templates');
    return { data: response.data.data };
  } catch (error) {
    console.error('Ошибка получения шаблонов отчётов:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить шаблоны');
  }
};

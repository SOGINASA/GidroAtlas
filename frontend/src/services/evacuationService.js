import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getAccessToken } from './authService';

// Настройка axios для evacuations
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/evacuations`,
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
 * Получить все эвакуации
 * @param {Object} params - { status?: string, priority?: string }
 * @returns {Promise<Object>}
 */
export const getAllEvacuations = async (params = {}) => {
  try {
    const response = await api.get('', { params });
    return {
      data: response.data.data,
      count: response.data.count
    };
  } catch (error) {
    console.error('Ошибка получения эвакуаций:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить эвакуации');
  }
};

/**
 * Получить конкретную эвакуацию
 * @param {number} evacuationId
 * @returns {Promise<Object>}
 */
export const getEvacuationById = async (evacuationId) => {
  try {
    const response = await api.get(`/${evacuationId}`);
    return { data: response.data.data };
  } catch (error) {
    console.error('Ошибка получения эвакуации:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить эвакуацию');
  }
};

/**
 * Получить активные эвакуации (pending и in_progress)
 * @returns {Promise<Object>}
 */
export const getActiveEvacuations = async () => {
  try {
    // Получаем pending
    const pendingResponse = await api.get('', {
      params: { status: 'pending' }
    });

    // Получаем in_progress
    const inProgressResponse = await api.get('', {
      params: { status: 'in_progress' }
    });

    const allActive = [
      ...pendingResponse.data.data,
      ...inProgressResponse.data.data
    ];

    return {
      data: allActive,
      count: allActive.length
    };
  } catch (error) {
    console.error('Ошибка получения активных эвакуаций:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить эвакуации');
  }
};

/**
 * Создать новую эвакуацию (admin/mchs)
 * @param {Object} evacuationData - {
 *   user_id: number,
 *   evacuation_point?: string,
 *   assigned_team?: string,
 *   priority?: string,
 *   family_members?: number,
 *   has_disabilities?: boolean,
 *   has_pets?: boolean,
 *   special_needs?: string,
 *   notes?: string
 * }
 * @returns {Promise<Object>}
 */
export const createEvacuation = async (evacuationData) => {
  try {
    const response = await api.post('', evacuationData);
    return {
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка создания эвакуации:', error);
    throw new Error(error.response?.data?.error || 'Не удалось создать эвакуацию');
  }
};

/**
 * Обновить эвакуацию (admin/mchs)
 * @param {number} evacuationId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
export const updateEvacuation = async (evacuationId, updateData) => {
  try {
    const response = await api.put(`/${evacuationId}`, updateData);
    return {
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка обновления эвакуации:', error);
    throw new Error(error.response?.data?.error || 'Не удалось обновить эвакуацию');
  }
};

/**
 * Обновить статус эвакуации (admin/mchs)
 * @param {number} evacuationId
 * @param {string} status - 'pending' | 'in_progress' | 'completed' | 'cancelled'
 * @returns {Promise<Object>}
 */
export const updateEvacuationStatus = async (evacuationId, status) => {
  return updateEvacuation(evacuationId, { status });
};

/**
 * Удалить эвакуацию (admin)
 * @param {number} evacuationId
 * @returns {Promise<Object>}
 */
export const deleteEvacuation = async (evacuationId) => {
  try {
    const response = await api.delete(`/${evacuationId}`);
    return {
      data: { success: true },
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка удаления эвакуации:', error);
    throw new Error(error.response?.data?.error || 'Не удалось удалить эвакуацию');
  }
};

/**
 * Получить статистику эвакуаций (admin/mchs)
 * @returns {Promise<Object>}
 */
export const getEvacuationStats = async () => {
  try {
    const response = await api.get('/stats');
    return { data: response.data.data };
  } catch (error) {
    console.error('Ошибка получения статистики эвакуаций:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить статистику');
  }
};

/**
 * Получить агрегированные операции эвакуаций (admin/mchs)
 * @returns {Promise<Object>}
 */
export const getEvacuationOperations = async () => {
  try {
    const response = await api.get('/operations');
    return {
      data: response.data.data,
      count: response.data.count
    };
  } catch (error) {
    console.error('Ошибка получения операций эвакуаций:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить операции эвакуаций');
  }
};

/**
 * Инициировать операцию эвакуации (создать записи для жителей)
 * @param {Object} operationData - { location, evacuation_point?, region?, user_ids?: number[], demo_count?: number }
 * @returns {Promise<Object>}
 */
export const initiateEvacuationOperation = async (operationData) => {
  try {
    const response = await api.post('/initiate', operationData);
    return {
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Ошибка инициирования эвакуации:', error);
    throw new Error(error.response?.data?.error || 'Не удалось инициировать эвакуацию');
  }
};

// ===== Функции для работы с жителями через users API =====

const usersApi = axios.create({
  baseURL: `${API_BASE_URL}/api/users`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

usersApi.interceptors.request.use(
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
 * Получить всех жителей (user_type='user')
 * @param {Object} params - { search?: string }
 * @returns {Promise<Object>}
 */
export const getAllResidents = async (params = {}) => {
  try {
    const response = await usersApi.get('/residents', { params });
    return {
      data: response.data.data,
      count: response.data.count
    };
  } catch (error) {
    console.error('Ошибка получения жителей:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить жителей');
  }
};

/**
 * Получить жителей по зоне риска
 * Требует дополнительной фильтрации на клиенте, т.к. backend не имеет прямого эндпоинта
 * @param {string} riskZone
 * @returns {Promise<Object>}
 */
export const getResidentsByRiskZone = async (riskZone) => {
  try {
    const { data } = await getAllResidents();
    // Фильтруем на клиенте по risk_zone если это поле есть
    const filtered = data.filter(resident => resident.risk_zone === riskZone);
    return {
      data: filtered,
      count: filtered.length
    };
  } catch (error) {
    console.error('Ошибка получения жителей по зоне:', error);
    throw error;
  }
};

/**
 * Получить жителей, требующих эвакуации
 * Получаем всех жителей и фильтруем тех, у кого высокая зона риска и нет активной эвакуации
 * @returns {Promise<Object>}
 */
export const getResidentsNeedingEvacuation = async () => {
  try {
    // Получаем всех жителей
    const { data: residents } = await getAllResidents();

    // Получаем все эвакуации
    const { data: evacuations } = await getAllEvacuations();

    // Создаем мапу user_id -> evacuation для быстрого поиска
    const evacuationMap = {};
    evacuations.forEach(evac => {
      if (evac.status === 'pending' || evac.status === 'in_progress') {
        const uid = evac.userId ?? evac.user_id;
        if (uid != null) evacuationMap[uid] = evac;
      }
    });

    // Фильтруем жителей в высокой зоне риска без активной эвакуации
    const needingEvacuation = residents.filter(resident => {
      const hasActiveEvacuation = !!evacuationMap[resident.id];
      // Здесь можно добавить проверку risk_zone если это поле будет добавлено в User модель
      return !hasActiveEvacuation;
    });

    return {
      data: needingEvacuation,
      count: needingEvacuation.length
    };
  } catch (error) {
    console.error('Ошибка получения жителей для эвакуации:', error);
    throw error;
  }
};

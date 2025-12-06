/**
 * API сервис для работы с картами
 * Все эндпоинты для получения данных водных объектов, ГТС, критических зон и датчиков
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5252/api';

/**
 * Универсальная функция для API запросов
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Если 401 - токен истёк или невалиден
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Можно редиректить на /login
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    // Если 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// =====================
// PUBLIC API (для всех пользователей)
// =====================

/**
 * Получить все водные объекты
 * @param {Object} params - query параметры { region, condition }
 */
export const getWaterBodies = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/map/waterbodies?${queryString}` : '/map/waterbodies';
  return apiRequest(endpoint);
};

/**
 * Получить детали водного объекта по ID
 * @param {number} id - ID водного объекта
 */
export const getWaterBodyDetails = async (id) => {
  return apiRequest(`/map/waterbodies/${id}`);
};

/**
 * Получить все ГТС
 * @param {Object} params - query параметры { region, condition }
 */
export const getHydroFacilities = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/map/facilities?${queryString}` : '/map/facilities';
  return apiRequest(endpoint);
};

/**
 * Получить детали ГТС по ID
 * @param {number} id - ID ГТС
 */
export const getHydroFacilityDetails = async (id) => {
  return apiRequest(`/map/facilities/${id}`);
};

/**
 * Получить критические зоны рек
 * @param {Object} params - query параметры { region }
 */
export const getCriticalZones = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/map/critical-zones?${queryString}` : '/map/critical-zones';
  return apiRequest(endpoint);
};

/**
 * Получить датчики IoT для карты
 * @param {Object} params - query параметры { region, status }
 */
export const getMapSensors = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/map/sensors?${queryString}` : '/map/sensors';
  return apiRequest(endpoint);
};

/**
 * Получить статистику для карты
 */
export const getMapStats = async () => {
  return apiRequest('/map/stats');
};

// =====================
// ADMIN API (требуют авторизации)
// =====================

/**
 * Создать новый водный объект (только для admin/emergency)
 * @param {Object} data - данные объекта { name, region, lat, lng, type, description }
 */
export const createWaterBody = async (data) => {
  return apiRequest('/map/admin/waterbodies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Обновить водный объект (только для admin/emergency)
 * @param {number} id - ID объекта
 * @param {Object} data - обновляемые данные
 */
export const updateWaterBody = async (id, data) => {
  return apiRequest(`/map/admin/waterbodies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Удалить водный объект (только для admin)
 * @param {number} id - ID объекта
 */
export const deleteWaterBody = async (id) => {
  return apiRequest(`/map/admin/waterbodies/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Создать новое ГТС (только для admin/emergency)
 * @param {Object} data - данные ГТС { name, region, lat, lng, type, condition, description }
 */
export const createHydroFacility = async (data) => {
  return apiRequest('/map/admin/facilities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Обновить ГТС (только для admin/emergency)
 * @param {number} id - ID ГТС
 * @param {Object} data - обновляемые данные
 */
export const updateHydroFacility = async (id, data) => {
  return apiRequest(`/map/admin/facilities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Удалить ГТС (только для admin)
 * @param {number} id - ID ГТС
 */
export const deleteHydroFacility = async (id) => {
  return apiRequest(`/map/admin/facilities/${id}`, {
    method: 'DELETE',
  });
};

// =====================
// UTILITY FUNCTIONS
// =====================

/**
 * Получить все данные для карты одним запросом
 * @param {Object} params - фильтры
 */
export const getAllMapData = async (params = {}) => {
  try {
    const [waterBodies, facilities, criticalZones, sensors] = await Promise.all([
      getWaterBodies(params),
      getHydroFacilities(params),
      getCriticalZones(params),
      getMapSensors(params),
    ]);

    return {
      waterBodies,
      facilities,
      criticalZones,
      sensors,
    };
  } catch (error) {
    console.error('Error fetching all map data:', error);
    throw error;
  }
};

/**
 * Экспорт данных карты в JSON
 */
export const exportMapData = async () => {
  const data = await getAllMapData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `gidroatlas-map-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

export default {
  // Public API
  getWaterBodies,
  getWaterBodyDetails,
  getHydroFacilities,
  getHydroFacilityDetails,
  getCriticalZones,
  getMapSensors,
  getMapStats,
  getAllMapData,

  // Admin API
  createWaterBody,
  updateWaterBody,
  deleteWaterBody,
  createHydroFacility,
  updateHydroFacility,
  deleteHydroFacility,

  // Utilities
  exportMapData,
};

import api from './api';

/**
 * Получить все водные объекты
 * @param {Object} params - Параметры фильтрации (region, type)
 */
export const getWaterBodies = async (params = {}) => {
  try {
    const response = await api.get('/facilities/water-bodies', { params });
    return response.data;
  } catch (error) {
    console.error('Ошибка получения водных объектов:', error);
    throw error.response?.data?.error || 'Не удалось загрузить водные объекты';
  }
};

/**
 * Получить водный объект по ID
 * @param {number} id - ID водного объекта
 */
export const getWaterBodyById = async (id) => {
  try {
    const response = await api.get(`/facilities/water-bodies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка получения водного объекта:', error);
    throw error.response?.data?.error || 'Не удалось загрузить водный объект';
  }
};

/**
 * Создать новый водный объект (admin/emergency)
 * @param {Object} waterBodyData - Данные водного объекта
 */
export const createWaterBody = async (waterBodyData) => {
  try {
    const response = await api.post('/facilities/water-bodies', waterBodyData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания водного объекта:', error);
    throw error.response?.data?.error || 'Не удалось создать водный объект';
  }
};

/**
 * Обновить водный объект (admin/emergency)
 * @param {number} id - ID водного объекта
 * @param {Object} waterBodyData - Данные для обновления
 */
export const updateWaterBody = async (id, waterBodyData) => {
  try {
    const response = await api.put(`/facilities/water-bodies/${id}`, waterBodyData);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления водного объекта:', error);
    throw error.response?.data?.error || 'Не удалось обновить водный объект';
  }
};

/**
 * Удалить водный объект (admin)
 * @param {number} id - ID водного объекта
 */
export const deleteWaterBody = async (id) => {
  try {
    const response = await api.delete(`/facilities/water-bodies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка удаления водного объекта:', error);
    throw error.response?.data?.error || 'Не удалось удалить водный объект';
  }
};

/**
 * Получить статистику водных объектов
 */
export const getWaterBodiesStats = async () => {
  try {
    const response = await api.get('/facilities/water-bodies');
    if (response.data.success && response.data.data) {
      const bodies = response.data.data;
      return {
        total: bodies.length,
        critical: bodies.filter(b => b.technicalCondition >= 4).length,
        warning: bodies.filter(b => b.technicalCondition === 3).length,
        safe: bodies.filter(b => b.technicalCondition <= 2).length
      };
    }
    return { total: 0, critical: 0, warning: 0, safe: 0 };
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    throw error;
  }
};

const waterBodyService = {
  getWaterBodies,
  getWaterBodyById,
  createWaterBody,
  updateWaterBody,
  deleteWaterBody,
  getWaterBodiesStats,
};

export default waterBodyService;

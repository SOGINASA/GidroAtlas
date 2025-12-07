import api from './api';

/**
 * Сервис для работы с админскими эндпоинтами
 */

// Dashboard
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

// System Analytics
export const getSystemAnalytics = async () => {
  const response = await api.get('/admin/analytics/system');
  return response.data;
};

// AI Models
export const getAIModels = async () => {
  const response = await api.get('/admin/ai/models');
  return response.data;
};

export const getAIModelById = async (modelId) => {
  const response = await api.get(`/admin/ai/models/${modelId}`);
  return response.data;
};

// Notification Templates
export const getNotificationTemplates = async () => {
  const response = await api.get('/admin/notifications/templates');
  return response.data;
};

export const getNotificationTemplateById = async (templateId) => {
  const response = await api.get(`/admin/notifications/templates/${templateId}`);
  return response.data;
};

export const createNotificationTemplate = async (templateData) => {
  const response = await api.post('/admin/notifications/templates', templateData);
  return response.data;
};

export const updateNotificationTemplate = async (templateId, templateData) => {
  const response = await api.put(`/admin/notifications/templates/${templateId}`, templateData);
  return response.data;
};

export const deleteNotificationTemplate = async (templateId) => {
  const response = await api.delete(`/admin/notifications/templates/${templateId}`);
  return response.data;
};

// Logs
export const getLogs = async (params = {}) => {
  const response = await api.get('/admin/logs', { params });
  return response.data;
};

export const exportLogs = async (params = {}) => {
  const response = await api.get('/admin/logs/export', { params, responseType: 'blob' });
  return response.data;
};

const adminService = {
  getDashboardStats,
  getSystemAnalytics,
  getAIModels,
  getAIModelById,
  getNotificationTemplates,
  getNotificationTemplateById,
  createNotificationTemplate,
  updateNotificationTemplate,
  deleteNotificationTemplate,
  getLogs,
  exportLogs,
};

export default adminService;

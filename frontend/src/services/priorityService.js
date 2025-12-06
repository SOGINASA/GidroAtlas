import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/facilities`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use((res) => res, (err) => {
  if (err.response?.status === 401) console.error('Unauthorized - facilities API');
  return Promise.reject(err);
});

// ===== @8>@8B870F8O >1A;54>20=89 =====

export const getInspectionPriorities = async (params = {}) => {
  try {
    const response = await api.get('', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching inspection priorities:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch inspection priorities');
  }
};

export const getPriorityById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching priority ${id}:`, error);
    throw new Error(error.response?.data?.error || 'Failed to fetch priority');
  }
};

export const createPriority = async (priorityData) => {
  try {
    const response = await api.post('', priorityData);
    return response.data;
  } catch (error) {
    console.error('Error creating priority:', error);
    throw new Error(error.response?.data?.error || 'Failed to create priority');
  }
};

export const updatePriority = async (id, updateData) => {
  try {
    const response = await api.put(`/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating priority ${id}:`, error);
    throw new Error(error.response?.data?.error || 'Failed to update priority');
  }
};

export const deletePriority = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting priority ${id}:`, error);
    throw new Error(error.response?.data?.error || 'Failed to delete priority');
  }
};

// ===== >4=K5 >1J5:BK =====

export const getWaterBodies = async (params = {}) => {
  try {
    const response = await api.get('/water-bodies', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching water bodies:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch water bodies');
  }
};

export const getWaterBodyById = async (id) => {
  try {
    const response = await api.get(`/water-bodies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching water body ${id}:`, error);
    throw new Error(error.response?.data?.error || 'Failed to fetch water body');
  }
};

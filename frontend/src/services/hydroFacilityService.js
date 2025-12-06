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
  if (err.response?.status === 401) console.error('Unauthorized - facility API');
  return Promise.reject(err);
});

export const getHydroFacilities = async (params = {}) => {
  try {
    const response = await api.get('', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch facilities');
  }
};

export const getFacilityById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching facility ${id}:`, error);
    throw new Error(error.response?.data?.error || 'Failed to fetch facility');
  }
};

export const createFacility = async (facilityData) => {
  try {
    const response = await api.post('', facilityData);
    return response.data;
  } catch (error) {
    console.error('Error creating facility:', error);
    throw new Error(error.response?.data?.error || 'Failed to create facility');
  }
};

export const updateFacility = async (id, updateData) => {
  try {
    const response = await api.put(`/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating facility ${id}:`, error);
    throw new Error(error.response?.data?.error || 'Failed to update facility');
  }
};

export const deleteFacility = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting facility ${id}:`, error);
    throw new Error(error.response?.data?.error || 'Failed to delete facility');
  }
};

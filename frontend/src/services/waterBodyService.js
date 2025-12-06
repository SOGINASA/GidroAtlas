import { apiRequest } from '../contexts/AuthContext';

// Get all water bodies - maps from sensor data
export const getWaterBodies = async () => {
  try {
    const res = await apiRequest('/api/sensors');
    if (!res || !res.ok) throw new Error('Failed to fetch sensors');
    const data = await res.json();
    
    // Transform sensors to water body format
    if (data.success && data.data) {
      return data.data.map(sensor => ({
        id: sensor.id,
        name: sensor.name,
        location: sensor.location,
        region: sensor.location,
        type: 'Водоём',
        status: sensor.dangerLevel === 'critical' ? 'critical' : sensor.dangerLevel === 'danger' ? 'warning' : 'safe',
        waterLevel: sensor.waterLevel,
        currentLevel: sensor.waterLevel,
        normalLevel: 5.0,
        temperature: sensor.temperature,
        trend: 'stable',
        riskLevel: sensor.dangerLevel,
        sensors: 1,
        coordinates: sensor.coordinates
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching sensors:', error);
    throw error;
  }
};

// Get water body by ID
export const getWaterBodyById = async (id) => {
  try {
    const res = await apiRequest(`/api/sensors/${id}`);
    if (!res || !res.ok) throw new Error('Failed to fetch sensor');
    const data = await res.json();
    
    if (data.success && data.data) {
      const sensor = data.data;
      return {
        id: sensor.id,
        name: sensor.name,
        location: sensor.location,
        region: sensor.location,
        type: 'Водоём',
        status: sensor.dangerLevel === 'critical' ? 'critical' : sensor.dangerLevel === 'danger' ? 'warning' : 'safe',
        waterLevel: sensor.waterLevel,
        currentLevel: sensor.waterLevel,
        normalLevel: 5.0,
        temperature: sensor.temperature,
        riskLevel: sensor.dangerLevel,
        coordinates: sensor.coordinates
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching sensor:', error);
    throw error;
  }
};

// Get water bodies statistics
export const getWaterBodiesStats = async () => {
  try {
    const res = await apiRequest('/api/sensors');
    if (!res || !res.ok) throw new Error('Failed to fetch sensors');
    const data = await res.json();
    
    if (data.success && data.data) {
      const sensors = data.data;
      return {
        total: sensors.length,
        critical: sensors.filter(s => s.dangerLevel === 'critical').length,
        warning: sensors.filter(s => s.dangerLevel === 'danger').length,
        safe: sensors.filter(s => s.dangerLevel === 'safe').length
      };
    }
    return { total: 0, critical: 0, warning: 0, safe: 0 };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

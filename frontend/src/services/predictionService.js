import { apiRequest } from '../contexts/AuthContext';

// Get predictions - computes from sensor critical zones since no dedicated prediction endpoint exists
export const getPredictions = async () => {
  try {
    const res = await apiRequest('/api/sensors');
    if (!res || !res.ok) throw new Error('Failed to fetch sensor data');
    const data = await res.json();

    if (data.success && data.data) {
      // Filter critical and danger level sensors to create predictions
      const criticalSensors = data.data.filter(s =>
        s.dangerLevel === 'critical' || s.dangerLevel === 'danger'
      );

      console.warn('[WARNING] Using mock predictions based on sensor data - no dedicated Prediction model in backend exists');

      // Map sensor objects to the prediction shape expected by the UI
      return criticalSensors.map(sensor => ({
        id: sensor.id,
        location: sensor.location || sensor.name || 'Неизвестно',
        type: sensor.waterLevel !== undefined ? 'water_level' : 'operational',
        currentValue: sensor.waterLevel !== undefined ? sensor.waterLevel : null,
        predictedValue: sensor.waterLevel !== undefined ? +(sensor.waterLevel + (Math.random() * 0.5 + 0.1)).toFixed(2) : null,
        timeframe: sensor.timeToRisk || (sensor.dangerLevel === 'critical' ? '1-2 часа' : '4-6 часов'),
        confidence: sensor.dangerLevel === 'critical' ? 95 : 75,
        risk: sensor.dangerLevel === 'critical' ? 'high' : 'medium',
        factors: {
          dangerLevel: sensor.dangerLevel,
          lastUpdated: sensor.lastUpdated || sensor.updatedAt || new Date().toISOString(),
          note: sensor.note || sensor.status || ''
        },
        recommendations: sensor.recommendedActions || (sensor.dangerLevel === 'critical'
          ? ['Срочно эвакуировать', 'Закрыть переезды', 'Активировать защиту']
          : ['Подготовить средства защиты', 'Предупредить население']),
        createdAt: sensor.createdAt || new Date().toISOString(),
        coordinates: sensor.coordinates || null,
        affectedPopulation: sensor.affectedPopulation || 0
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};

// Get high-risk predictions
export const getHighRiskPredictions = async () => {
  try {
    const predictions = await getPredictions();
    return predictions.filter(p => p.risk === 'high' || (p.confidence || 0) > 85);
  } catch (error) {
    console.error('Error fetching high-risk predictions:', error);
    throw error;
  }
};

// Get prediction by ID
export const getPredictionById = async (id) => {
  try {
    const predictions = await getPredictions();
    return predictions.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};

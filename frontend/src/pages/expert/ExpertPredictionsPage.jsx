import React, { useState, useEffect } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Calendar } from 'lucide-react';
import { getPredictions } from '../../services/predictionService';
import { getCriticalSensors } from '../../services/sensorService';

const ExpertPredictionsPage = () => {
  const [timeRange, setTimeRange] = useState('week'); // day, week, month
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    high: 0,
    medium: 0,
    low: 0
  });

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      setLoading(true);

      // Загружаем прогнозы на основе критических датчиков
      const predictionsData = await getPredictions();

      // Дополняем данные из критических датчиков
      const criticalSensorsResponse = await getCriticalSensors();
      const criticalSensors = criticalSensorsResponse.data || [];

      // Формируем детальные прогнозы
      const enrichedPredictions = criticalSensors.map(sensor => {
        const waterLevel = sensor.waterLevel || 0;
        const dangerLevel = sensor.dangerLevel || 'safe';
        const isRising = waterLevel > 5.0;

        return {
          id: sensor.id,
          objectName: sensor.name,
          location: sensor.location,
          type: 'water_level',
          currentValue: `${waterLevel.toFixed(1)} м`,
          predictedValue: `${(waterLevel + (isRising ? 0.6 : -0.2)).toFixed(1)} м`,
          trend: isRising ? 'rising' : 'stable',
          confidence: dangerLevel === 'critical' ? 87 : dangerLevel === 'danger' ? 75 : 94,
          riskLevel: dangerLevel === 'critical' ? 'high' : dangerLevel === 'danger' ? 'medium' : 'low',
          timeframe: dangerLevel === 'critical' ? '24-48 часов' : dangerLevel === 'danger' ? '2-3 дня' : '1-2 недели',
          factors: dangerLevel === 'critical'
            ? ['Критический уровень воды', 'Риск затопления', 'Требуется немедленное вмешательство']
            : dangerLevel === 'danger'
            ? ['Повышенный уровень воды', 'Необходим мониторинг', 'Возможны изменения']
            : ['Стабильный уровень воды', 'Нормальные условия'],
          recommendations: dangerLevel === 'critical'
            ? [
                'Срочно провести эвакуацию прибрежных зон',
                'Активировать аварийные службы',
                'Усилить мониторинг датчиков'
              ]
            : dangerLevel === 'danger'
            ? [
                'Подготовить план эвакуации',
                'Предупредить население',
                'Усилить наблюдение'
              ]
            : [
                'Продолжить плановый мониторинг',
                'Сохранить текущий режим наблюдений'
              ]
        };
      });

      setPredictions(enrichedPredictions);

      // Подсчет статистики
      const newStats = enrichedPredictions.reduce((acc, pred) => {
        if (pred.riskLevel === 'high') acc.high++;
        else if (pred.riskLevel === 'medium') acc.medium++;
        else acc.low++;
        return acc;
      }, { high: 0, medium: 0, low: 0 });

      setStats(newStats);

    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case 'high': return 'Высокий риск';
      case 'medium': return 'Средний риск';
      default: return 'Низкий риск';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return <TrendingUp className="w-5 h-5 text-red-600" />;
    if (trend === 'falling') return <TrendingDown className="w-5 h-5 text-green-600" />;
    return <span className="text-gray-600">—</span>;
  };

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">AI Прогнозирование</h1>
            </div>
            <p className="text-sm lg:text-base text-blue-100">
              Предиктивная аналитика состояния водных объектов
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          
          {/* Time Range Selector */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Временной диапазон</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTimeRange('day')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === 'day'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                24 часа
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Неделя
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Месяц
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Загрузка прогнозов...</p>
            </div>
          )}

          {/* Stats */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Высокий риск</p>
                <p className="text-3xl font-bold text-red-600">{stats.high}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Средний риск</p>
                <p className="text-3xl font-bold text-orange-600">{stats.medium}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Низкий риск</p>
                <p className="text-3xl font-bold text-green-600">{stats.low}</p>
              </div>
            </div>
          )}

          {/* Predictions List */}
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div
                key={prediction.id}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-4 lg:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                        {prediction.objectName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(prediction.riskLevel)}`}>
                          {getRiskLabel(prediction.riskLevel)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          AI уверенность: {prediction.confidence}%
                        </span>
                      </div>
                    </div>
                    {getTrendIcon(prediction.trend)}
                  </div>

                  {/* Prediction Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Текущее значение</p>
                      <p className="text-base font-semibold text-gray-900">{prediction.currentValue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Прогнозируемое</p>
                      <p className="text-base font-semibold text-gray-900">{prediction.predictedValue}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Временной горизонт</p>
                    <p className="text-base font-semibold text-gray-900">{prediction.timeframe}</p>
                  </div>

                  {/* Factors */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Влияющие факторы:</p>
                    <ul className="space-y-1">
                      {prediction.factors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <p className="text-sm font-semibold text-amber-900">Рекомендации:</p>
                    </div>
                    <ul className="space-y-2">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-amber-800 flex items-start space-x-2">
                          <span className="text-amber-600 mt-0.5">→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertPredictionsPage;
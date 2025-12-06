import React, { useState, useEffect } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { Brain, TrendingUp, AlertTriangle, Calendar, Target } from 'lucide-react';
import { getPredictions } from '../../services/predictionService';

const EmergencyPredictions = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch predictions on mount
  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPredictions();
      setPredictions(data || []);
    } catch (err) {
      console.error('Error loading predictions:', err);
      console.warn('[WARNING] Using mock data for PredictionsPage - API request failed');
      setError('Ошибка загрузки прогнозов');
      // Set default mock data on error
      setDefaultMockData();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultMockData = () => {
    setPredictions([
    {
      id: 1,
      location: 'Река Иртыш (Павлодар)',
      type: 'water_level',
      currentValue: 8.2,
      predictedValue: 9.5,
      timeframe: '24-48 часов',
      confidence: 87,
      risk: 'high',
      factors: {
        precipitation: '+85% осадков выше нормы',
        snowmelt: 'Интенсивное таяние в верховьях',
        upstream: 'Сброс с ГЭС +20%'
      },
      recommendations: [
        'Немедленная подготовка к эвакуации',
        'Усиление дамб в критических участках',
        'Оповещение населения'
      ],
      affectedPopulation: 15000
    },
    {
      id: 2,
      location: 'Бухтарминское водохранилище',
      type: 'maintenance',
      currentCondition: 3,
      predictedCondition: 4,
      timeframe: '2-3 месяца',
      confidence: 72,
      risk: 'medium',
      factors: {
        age: 'Возраст сооружения: 58 лет',
        inspection: 'Обнаружены микротрещины',
        load: 'Повышенная нагрузка зимой'
      },
      recommendations: [
        'Плановое обследование в ближайший месяц',
        'Укрепление проблемных участков',
        'Мониторинг каждые 2 недели'
      ],
      affectedPopulation: 0
    },
    {
      id: 3,
      location: 'Озеро Балхаш',
      type: 'quality',
      currentQuality: 'moderate',
      predictedQuality: 'poor',
      timeframe: '1-2 месяца',
      confidence: 65,
      risk: 'medium',
      factors: {
        pollution: 'Увеличение промышленных стоков',
        temperature: 'Повышение температуры воды',
        algae: 'Риск цветения водорослей'
      },
      recommendations: [
        'Контроль промышленных стоков',
        'Усиленный мониторинг качества',
        'Ограничение рекреационной активности'
      ],
      affectedPopulation: 8000
    },
    {
      id: 4,
      location: 'Капшагайская ГЭС',
      type: 'operational',
      currentStatus: 'operational',
      predictedStatus: 'operational',
      timeframe: '6+ месяцев',
      confidence: 94,
      risk: 'low',
      factors: {
        maintenance: 'Плановое ТО выполнено',
        equipment: 'Оборудование в отличном состоянии',
        load: 'Нормальная нагрузка'
      },
      recommendations: [
        'Продолжать плановый мониторинг',
        'Следующее ТО через 6 месяцев'
      ],
      affectedPopulation: 0
    }
  ]);
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBg = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-100 border-red-300';
      case 'medium': return 'bg-yellow-100 border-yellow-300';
      case 'low': return 'bg-green-100 border-green-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'water_level': return '💧';
      case 'maintenance': return '🔧';
      case 'quality': return '🧪';
      case 'operational': return '⚙️';
      default: return '📊';
    }
  };

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Brain className="w-8 h-8 mr-3" />
                  AI Прогнозирование
                </h1>
                <p className="text-purple-100">Предиктивная аналитика рисков и состояний объектов</p>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                {['day', 'week', 'month', 'quarter'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      timeRange === range ? 'bg-white text-purple-600 font-semibold' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {range === 'day' ? 'День' : range === 'week' ? 'Неделя' : range === 'month' ? 'Месяц' : 'Квартал'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white border-b border-gray-200 px-4 py-6">
            <p className="text-gray-600">Загрузка прогнозов...</p>
          </div>
        )}

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Высокий риск</p>
                  <p className="text-2xl font-bold text-red-600">
                    {predictions.filter(p => p.risk === 'high').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Средний риск</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {predictions.filter(p => p.risk === 'medium').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Низкий риск</p>
                  <p className="text-2xl font-bold text-green-600">
                    {predictions.filter(p => p.risk === 'low').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ср. точность</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {predictions.length ? Math.round(predictions.reduce((sum, p) => sum + (p.confidence || 0), 0) / predictions.length) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            {predictions.map((pred) => (
              <div key={pred.id} className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${getRiskBg(pred.risk)}`}>
                
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                        {getTypeIcon(pred.type)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{pred.location}</h3>
                        <p className="text-purple-100">
                          Тип прогноза: {pred.type === 'water_level' ? 'Уровень воды' : 
                                        pred.type === 'maintenance' ? 'Техническое состояние' :
                                        pred.type === 'quality' ? 'Качество воды' : 'Операционный статус'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-purple-100 mb-1">Уверенность AI</div>
                      <div className="text-4xl font-bold">{pred.confidence}%</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    
                    {/* Prediction Details */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Risk Level */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900 flex items-center">
                            <Target className="w-5 h-5 mr-2" />
                            Уровень риска
                          </h4>
                          <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                            pred.risk === 'high' ? 'bg-red-500 text-white' :
                            pred.risk === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'
                          }`}>
                            {pred.risk === 'high' ? 'ВЫСОКИЙ' : pred.risk === 'medium' ? 'СРЕДНИЙ' : 'НИЗКИЙ'}
                          </span>
                        </div>
                        
                        {pred.type === 'water_level' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600 mb-1">Текущий уровень</p>
                              <p className="text-2xl font-bold text-gray-900">{pred.currentValue} м</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600 mb-1">Прогноз</p>
                              <p className="text-2xl font-bold text-red-600">{pred.predictedValue} м</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Factors */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Факторы влияния</h4>
                        <div className="space-y-2">
                          {Object.entries(pred.factors || {}).map(([key, value]) => (
                            <div key={key} className="flex items-start space-x-3 text-sm">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                              <span className="text-gray-700">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Рекомендации МЧС</h4>
                        <div className="space-y-2">
                          {pred.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex items-start space-x-3 bg-blue-50 rounded-lg p-3">
                              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {idx + 1}
                              </div>
                              <span className="text-sm text-gray-900">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Stats */}
                    <div className="space-y-4">
                      
                      {/* Timeframe */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center space-x-2 text-gray-600 mb-2">
                          <Calendar className="w-5 h-5" />
                          <span className="text-sm font-medium">Временные рамки</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{pred.timeframe}</p>
                      </div>

                      {/* Confidence Meter */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-600 mb-3">Точность прогноза</p>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div 
                              className={`h-4 transition-all ${
                                pred.confidence >= 80 ? 'bg-green-500' :
                                pred.confidence >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${pred.confidence}%` }}
                            />
                          </div>
                          <p className="text-center text-2xl font-bold text-gray-900 mt-2">
                            {pred.confidence}%
                          </p>
                        </div>
                      </div>

                      {/* Affected Population */}
                      {pred.affectedPopulation > 0 && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                          <p className="text-sm font-medium text-red-700 mb-2">⚠️ Под угрозой</p>
                          <p className="text-3xl font-bold text-red-600">
                            {pred.affectedPopulation.toLocaleString()}
                          </p>
                          <p className="text-sm text-red-700">человек</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                      Подробный анализ
                    </button>
                    {pred.risk === 'high' && (
                      <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                        Начать реагирование
                      </button>
                    )}
                    <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                      Экспорт отчёта
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default EmergencyPredictions;
import React, { useState } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Calendar } from 'lucide-react';

const ExpertPredictionsPage = () => {
  const [timeRange, setTimeRange] = useState('week'); // day, week, month

  // Mock predictions
  const predictions = [
    {
      id: 1,
      objectName: 'Река Иртыш',
      type: 'water_level',
      currentValue: 5.8,
      predictedValue: 6.4,
      trend: 'rising',
      confidence: 87,
      riskLevel: 'high',
      timeframe: '24-48 часов',
      factors: ['Таяние снега', 'Осадки выше нормы', 'Сброс воды с ГЭС'],
      recommendations: [
        'Провести эвакуацию прибрежных зон',
        'Усилить мониторинг датчиков',
        'Подготовить аварийные службы'
      ]
    },
    {
      id: 2,
      objectName: 'Капшагайская ГЭС',
      type: 'maintenance',
      currentValue: 'Удовлетворительное',
      predictedValue: 'Требует обследования',
      trend: 'stable',
      confidence: 72,
      riskLevel: 'medium',
      timeframe: '3-6 месяцев',
      factors: ['Возраст сооружения', 'Износ оборудования', 'История эксплуатации'],
      recommendations: [
        'Запланировать техническое обследование',
        'Провести диагностику турбин',
        'Обновить план ТО'
      ]
    },
    {
      id: 3,
      objectName: 'Озеро Балхаш',
      type: 'quality',
      currentValue: 'Хорошее',
      predictedValue: 'Хорошее',
      trend: 'stable',
      confidence: 94,
      riskLevel: 'low',
      timeframe: '1-2 месяца',
      factors: ['Стабильные метео условия', 'Нормальный уровень воды'],
      recommendations: [
        'Продолжить плановый мониторинг',
        'Сохранить текущий режим наблюдений'
      ]
    }
  ];

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

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Высокий риск</p>
              <p className="text-3xl font-bold text-red-600">1</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Средний риск</p>
              <p className="text-3xl font-bold text-orange-600">1</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Низкий риск</p>
              <p className="text-3xl font-bold text-green-600">1</p>
            </div>
          </div>

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
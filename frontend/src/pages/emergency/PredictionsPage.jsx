import React, { useState } from 'react';
import MinimalHeader from '../../components/layout/MinimalHeader';
import BottomNavigation from '../../components/layout/BottomNavigation';
import EmergencyDesktopSidebar from '../../components/layout/EmergencyDesktopSidebar';
import EmergencyDesktopTopHeader from '../../components/layout/EmergencyDesktopTopHeader';

const EmergencyPredictionPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Mock prediction data
  const predictions = [
    {
      id: 1,
      district: 'Центральный район',
      currentLevel: 3.8,
      predictedLevel: 4.5,
      probability: 85,
      timeframe: '24 часа',
      riskLevel: 'high',
      affectedPopulation: 1200,
      timestamp: '2024-11-26 18:00'
    },
    {
      id: 2,
      district: 'Северный район',
      currentLevel: 4.2,
      predictedLevel: 5.1,
      probability: 92,
      timeframe: '24 часа',
      riskLevel: 'critical',
      affectedPopulation: 850,
      timestamp: '2024-11-26 18:00'
    },
    {
      id: 3,
      district: 'Южный район',
      currentLevel: 3.2,
      predictedLevel: 3.7,
      probability: 65,
      timeframe: '48 часов',
      riskLevel: 'medium',
      affectedPopulation: 600,
      timestamp: '2024-11-26 18:00'
    }
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'green';
    }
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case 'critical': return 'Критический';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      default: return 'Низкий';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MinimalHeader title="Прогноз паводков" showBack />
      </div>

      {/* Desktop Sidebar */}
      <EmergencyDesktopSidebar />

      {/* Desktop Top Header */}
      <EmergencyDesktopTopHeader />

      {/* Main Content */}
      <main className="pt-16 pb-24 px-4 lg:ml-72 lg:pt-24 lg:pb-8">
        <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">

          {/* AI Model Info Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl lg:rounded-2xl p-6 text-white">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">Прогноз на основе AI</h3>
                <p className="text-white/90 text-sm mb-3">
                  Система использует машинное обучение для анализа исторических данных, текущих показателей датчиков, метеопрогноза и спутниковых снимков для предсказания уровня воды.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Точность: 87%</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Обновлено: 2 мин назад</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Модель: LSTM v2.1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Период прогноза</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="24h">Следующие 24 часа</option>
                  <option value="48h">Следующие 48 часов</option>
                  <option value="72h">Следующие 72 часа</option>
                  <option value="week">Следующая неделя</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Район</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Все районы</option>
                  <option value="central">Центральный</option>
                  <option value="north">Северный</option>
                  <option value="south">Южный</option>
                  <option value="east">Восточный</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-gray-600">Районов в зоне риска</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">2,650</p>
                  <p className="text-xs text-gray-600">Жителей затронуто</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-xs text-gray-600">Точность модели</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">24ч</p>
                  <p className="text-xs text-gray-600">Горизонт прогноза</p>
                </div>
              </div>
            </div>
          </div>

          {/* Predictions List */}
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{prediction.district}</h3>
                          <p className="text-sm text-gray-600">Прогноз на {prediction.timeframe}</p>
                        </div>
                        <span className={`px-3 py-1 bg-${getRiskColor(prediction.riskLevel)}-100 text-${getRiskColor(prediction.riskLevel)}-700 rounded-full text-xs font-bold`}>
                          {getRiskLabel(prediction.riskLevel)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Текущий уровень</p>
                          <p className="text-xl font-bold text-blue-600">{prediction.currentLevel}м</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Прогноз</p>
                          <p className="text-xl font-bold text-red-600">{prediction.predictedLevel}м</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Вероятность</p>
                          <p className="text-xl font-bold text-purple-600">{prediction.probability}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Затронуто</p>
                          <p className="text-xl font-bold text-orange-600">{prediction.affectedPopulation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <button className="flex-1 lg:w-auto px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg font-semibold text-sm hover:from-red-700 hover:to-orange-600 transition-all">
                        Начать эвакуацию
                      </button>
                      <button className="flex-1 lg:w-auto px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all">
                        Подробнее
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Уровень риска</span>
                      <span>{prediction.probability}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-${getRiskColor(prediction.riskLevel)}-500 to-${getRiskColor(prediction.riskLevel)}-600`}
                        style={{ width: `${prediction.probability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gray-50 px-4 lg:px-6 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Обновлено: {prediction.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Модель активна</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Model Info */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl lg:rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">О модели прогнозирования</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold mb-2">Входные данные:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Показатели датчиков (реальное время)</li>
                  <li>• Исторические данные паводков</li>
                  <li>• Метеорологический прогноз</li>
                  <li>• Спутниковые снимки реки Ишим</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Характеристики:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Архитектура: LSTM нейронная сеть</li>
                  <li>• Точность: 87% на тестовых данных</li>
                  <li>• Обновление: каждые 5 минут</li>
                  <li>• Горизонт: до 7 дней</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default EmergencyPredictionPage;
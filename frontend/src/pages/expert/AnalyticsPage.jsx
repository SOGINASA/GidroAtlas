import React, { useState } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const ExpertAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">Аналитика</h1>
            </div>
            <p className="text-sm lg:text-base text-blue-100">
              Статистика и тренды по водным объектам
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          
          {/* Time Range Selector */}
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Период анализа</h3>
            </div>
            <div className="flex flex-wrap gap-2">
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
              <button
                onClick={() => setTimeRange('quarter')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === 'quarter'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Квартал
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Год
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +12%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Общий мониторинг</p>
              <p className="text-3xl font-bold text-gray-900">156</p>
              <p className="text-xs text-gray-500 mt-1">водных объектов</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  +5
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Критических</p>
              <p className="text-3xl font-bold text-red-600">12</p>
              <p className="text-xs text-gray-500 mt-1">требуют внимания</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  94%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">AI Уверенность</p>
              <p className="text-3xl font-bold text-purple-600">87%</p>
              <p className="text-xs text-gray-500 mt-1">средняя точность</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +8
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Обследований</p>
              <p className="text-3xl font-bold text-green-600">24</p>
              <p className="text-xs text-gray-500 mt-1">за текущий период</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Распределение по приоритетам
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Высокий приоритет</span>
                    <span className="text-sm font-bold text-red-600">18 объектов</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Средний приоритет</span>
                    <span className="text-sm font-bold text-orange-600">24 объекта</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{ width: '47%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Низкий приоритет</span>
                    <span className="text-sm font-bold text-green-600">9 объектов</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Condition */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Техническое состояние
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(category => {
                  const counts = {
                    1: 8,
                    2: 15,
                    3: 12,
                    4: 9,
                    5: 7
                  };
                  const colors = {
                    1: 'bg-green-500',
                    2: 'bg-lime-500',
                    3: 'bg-yellow-500',
                    4: 'bg-orange-500',
                    5: 'bg-red-500'
                  };
                  const widths = {
                    1: '16%',
                    2: '30%',
                    3: '24%',
                    4: '18%',
                    5: '12%'
                  };

                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Категория {category}</span>
                        <span className="text-sm font-bold text-gray-900">{counts[category]} объектов</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className={`${colors[category]} h-3 rounded-full`} style={{ width: widths[category] }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Распределение по регионам
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { region: 'Восточно-Казахстанская область', count: 42, percentage: 27 },
                { region: 'Алматинская область', count: 38, percentage: 24 },
                { region: 'Павлодарская область', count: 28, percentage: 18 },
                { region: 'Карагандинская область', count: 24, percentage: 15 },
                { region: 'Северо-Казахстанская область', count: 16, percentage: 10 },
                { region: 'Другие регионы', count: 8, percentage: 6 }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">{item.region}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                    <span className="text-sm text-gray-600">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-1.5 mt-2">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Тренды и изменения
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Улучшения</span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-700 mb-1">+8</p>
                <p className="text-xs text-green-600">объектов улучшили состояние</p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-900">Стабильно</span>
                  <Activity className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-yellow-700 mb-1">142</p>
                <p className="text-xs text-yellow-600">без изменений</p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-900">Ухудшения</span>
                  <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                </div>
                <p className="text-3xl font-bold text-red-700 mb-1">6</p>
                <p className="text-xs text-red-600">требуют внимания</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertAnalyticsPage;
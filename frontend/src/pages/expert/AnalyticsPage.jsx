import React, { useState, useEffect } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import { getAllAnalytics } from '../../services/analyticsService';

const ExpertAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAllAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

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
          
          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Загрузка аналитики...</p>
            </div>
          )}

          {/* Time Range Selector */}
          {!loading && (
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
          )}

          {/* Key Metrics */}
          {!loading && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +{analytics.overallStats.totalWaterBodies}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Общий мониторинг</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.overallStats.totalObjects}</p>
              <p className="text-xs text-gray-500 mt-1">водных объектов</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  +{analytics.overallStats.criticalCount}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Критических</p>
              <p className="text-3xl font-bold text-red-600">{analytics.overallStats.criticalCount}</p>
              <p className="text-xs text-gray-500 mt-1">требуют внимания</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  {analytics.overallStats.averageConfidence}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">AI Уверенность</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.overallStats.averageConfidence}%</p>
              <p className="text-xs text-gray-500 mt-1">средняя точность</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +{analytics.overallStats.safeCount}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">В норме</p>
              <p className="text-3xl font-bold text-green-600">{analytics.overallStats.safeCount}</p>
              <p className="text-xs text-gray-500 mt-1">датчиков безопасно</p>
            </div>
          </div>
          )}

          {/* Charts Row 1 */}
          {!loading && analytics && (
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
                    <span className="text-sm font-bold text-red-600">{analytics.priorityDistribution.high} объектов</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: `${analytics.priorityDistribution.total > 0 ? (analytics.priorityDistribution.high / analytics.priorityDistribution.total * 100) : 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Средний приоритет</span>
                    <span className="text-sm font-bold text-orange-600">{analytics.priorityDistribution.medium} объекта</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{ width: `${analytics.priorityDistribution.total > 0 ? (analytics.priorityDistribution.medium / analytics.priorityDistribution.total * 100) : 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Низкий приоритет</span>
                    <span className="text-sm font-bold text-green-600">{analytics.priorityDistribution.low} объектов</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: `${analytics.priorityDistribution.total > 0 ? (analytics.priorityDistribution.low / analytics.priorityDistribution.total * 100) : 0}%` }}></div>
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
                  const count = analytics.technicalCondition[category];
                  const total = Object.values(analytics.technicalCondition).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? (count / total * 100) : 0;

                  const colors = {
                    1: 'bg-green-500',
                    2: 'bg-lime-500',
                    3: 'bg-yellow-500',
                    4: 'bg-orange-500',
                    5: 'bg-red-500'
                  };

                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Категория {category}</span>
                        <span className="text-sm font-bold text-gray-900">{count} объектов</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className={`${colors[category]} h-3 rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          )}

          {/* Regional Distribution */}
          {!loading && analytics && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Распределение по регионам
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.regionalDistribution.slice(0, 6).map((item, index) => (
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
          )}

          {/* Trends */}
          {!loading && analytics && (
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
                <p className="text-3xl font-bold text-green-700 mb-1">+{analytics.trends.improved}</p>
                <p className="text-xs text-green-600">объектов улучшили состояние</p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-900">Стабильно</span>
                  <Activity className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-yellow-700 mb-1">{analytics.trends.stable}</p>
                <p className="text-xs text-yellow-600">без изменений</p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-900">Ухудшения</span>
                  <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                </div>
                <p className="text-3xl font-bold text-red-700 mb-1">{analytics.trends.worsened}</p>
                <p className="text-xs text-red-600">требуют внимания</p>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertAnalyticsPage;
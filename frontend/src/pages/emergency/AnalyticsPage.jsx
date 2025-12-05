import React, { useState } from 'react';
import { TrendingUp, Calendar, Download, Filter, BarChart3, PieChart, LineChart as LineChartIcon } from 'lucide-react';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('week'); // week, month, quarter, year
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Mock данные - статистика по регионам
  const regionalStats = [
    { region: 'Павлодарская область', incidents: 12, critical: 3, evacuations: 2, affected: 15000 },
    { region: 'Алматинская область', incidents: 8, critical: 2, evacuations: 1, affected: 8000 },
    { region: 'Восточно-Казахстанская область', incidents: 6, critical: 1, evacuations: 0, affected: 3000 },
    { region: 'Западно-Казахстанская область', incidents: 4, critical: 1, evacuations: 0, affected: 5000 },
    { region: 'Северо-Казахстанская область', incidents: 3, critical: 0, evacuations: 0, affected: 1000 }
  ];

  // Mock данные - динамика по времени
  const timeSeriesData = {
    week: [
      { date: 'Пн', incidents: 2, level: 3.2 },
      { date: 'Вт', incidents: 3, level: 3.5 },
      { date: 'Ср', incidents: 4, level: 3.8 },
      { date: 'Чт', incidents: 5, level: 4.1 },
      { date: 'Пт', incidents: 6, level: 4.5 },
      { date: 'Сб', incidents: 4, level: 4.3 },
      { date: 'Вс', incidents: 3, level: 4.0 }
    ],
    month: [
      { date: 'Нед 1', incidents: 8, level: 3.3 },
      { date: 'Нед 2', incidents: 12, level: 3.7 },
      { date: 'Нед 3', incidents: 15, level: 4.0 },
      { date: 'Нед 4', incidents: 18, level: 4.3 }
    ]
  };

  // Mock данные - типы инцидентов
  const incidentTypes = [
    { type: 'Превышение уровня', count: 15, percent: 45, color: 'bg-red-500' },
    { type: 'Паводок', count: 10, percent: 30, color: 'bg-orange-500' },
    { type: 'Технические проблемы', count: 5, percent: 15, color: 'bg-yellow-500' },
    { type: 'Другое', count: 3, percent: 10, color: 'bg-blue-500' }
  ];

  // Mock данные - эффективность реагирования
  const responseMetrics = [
    { metric: 'Среднее время реакции', value: '12 мин', trend: 'down', improvement: -15 },
    { metric: 'Эвакуировано людей', value: '23,500', trend: 'up', improvement: null },
    { metric: 'Задействовано ресурсов', value: '47', trend: 'up', improvement: null },
    { metric: 'Процент успешных операций', value: '94%', trend: 'up', improvement: +5 }
  ];

  // Mock данные - топ проблемных объектов
  const topRiskyObjects = [
    { name: 'Река Иртыш', type: 'Река', region: 'Павлодарская обл.', riskScore: 95, incidents: 8 },
    { name: 'Озеро Балхаш', type: 'Озеро', region: 'Алматинская обл.', riskScore: 82, incidents: 5 },
    { name: 'Усть-Каменогорская ГЭС', type: 'ГЭС', region: 'ВКО', riskScore: 78, incidents: 4 },
    { name: 'Река Урал', type: 'Река', region: 'ЗКО', riskScore: 71, incidents: 3 },
    { name: 'Каратомарская плотина', type: 'Плотина', region: 'Алматинская обл.', riskScore: 88, incidents: 6 }
  ];

  const getTrendIcon = (trend, improvement) => {
    if (trend === 'down' && improvement < 0) return '📉';
    if (trend === 'up') return '📈';
    return '➡️';
  };

  const getTrendColor = (trend, improvement) => {
    if (trend === 'down' && improvement < 0) return 'text-green-600';
    if (trend === 'up' && improvement > 0) return 'text-green-600';
    if (trend === 'up' && improvement === null) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">📊 Аналитика и статистика</h1>
              <p className="text-purple-100">Комплексный анализ ситуации с водными ресурсами</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="week" className="text-gray-900">Неделя</option>
                <option value="month" className="text-gray-900">Месяц</option>
                <option value="quarter" className="text-gray-900">Квартал</option>
                <option value="year" className="text-gray-900">Год</option>
              </select>
              <button className="flex items-center justify-center space-x-2 bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all">
                <Download className="w-5 h-5" />
                <span>Экспорт</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Key Metrics */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ключевые показатели</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {responseMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
                <p className="text-sm text-gray-600 mb-2">{metric.metric}</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <div className={`text-2xl ${getTrendColor(metric.trend, metric.improvement)}`}>
                    {getTrendIcon(metric.trend, metric.improvement)}
                  </div>
                </div>
                {metric.improvement !== null && (
                  <p className={`text-sm mt-2 ${getTrendColor(metric.trend, metric.improvement)}`}>
                    {metric.improvement > 0 ? '+' : ''}{metric.improvement}% за период
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Time Series Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <LineChartIcon className="w-6 h-6 text-blue-600" />
                <span>Динамика инцидентов</span>
              </h3>
              <span className="text-sm text-gray-600">За {timeRange === 'week' ? 'неделю' : 'месяц'}</span>
            </div>
            
            <div className="space-y-4">
              {(timeSeriesData[timeRange] || timeSeriesData.week).map((point, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{point.date}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">Инциденты: <strong>{point.incidents}</strong></span>
                      <span className="text-blue-600">Уровень: <strong>{point.level}м</strong></span>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden flex">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: `${(point.incidents / 10) * 100}%` }}
                    >
                      {point.incidents > 2 && point.incidents}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Types */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <PieChart className="w-6 h-6 text-purple-600" />
                <span>Типы инцидентов</span>
              </h3>
              <span className="text-sm text-gray-600">Всего: {incidentTypes.reduce((sum, t) => sum + t.count, 0)}</span>
            </div>
            
            <div className="space-y-4">
              {incidentTypes.map((type, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{type.type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{type.count}</span>
                      <span className="text-gray-400">({type.percent}%)</span>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className={`h-full ${type.color} flex items-center px-3`}
                      style={{ width: `${type.percent}%` }}
                    >
                      {type.percent > 15 && (
                        <span className="text-white text-xs font-bold">{type.percent}%</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Statistics */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <span>Статистика по регионам</span>
            </h3>
            <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <Filter className="w-4 h-4" />
              <span>Фильтры</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Регион</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Инциденты</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Критичные</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Эвакуации</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Затронуто людей</th>
                </tr>
              </thead>
              <tbody>
                {regionalStats.map((stat, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{stat.region}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-lg font-bold">
                        {stat.incidents}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold ${
                        stat.critical > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {stat.critical}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold ${
                        stat.evacuations > 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {stat.evacuations}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-gray-900">
                        {stat.affected.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Risky Objects */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-red-600" />
              <span>Топ проблемных объектов</span>
            </h3>
          </div>

          <div className="space-y-3">
            {topRiskyObjects
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((obj, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{obj.name}</h4>
                    <p className="text-sm text-gray-600">{obj.region} • {obj.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Инциденты</p>
                    <p className="text-lg font-bold text-gray-900">{obj.incidents}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold ${getRiskColor(obj.riskScore)}`}>
                    {obj.riskScore}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Экспорт данных</h3>
              <p className="text-sm text-gray-600">Выгрузите аналитические данные в удобном формате</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-md">
                📊 Excel
              </button>
              <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-md">
                📄 PDF
              </button>
              <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-md">
                📈 CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
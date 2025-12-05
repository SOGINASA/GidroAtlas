import React, { useState } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { TrendingUp, TrendingDown, Download, BarChart3 } from 'lucide-react';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');

  const metrics = [
    { label: 'Среднее время реакции', value: '12 мин', change: -15, positive: true },
    { label: 'Эвакуировано людей', value: '23,500', change: 0, positive: true },
    { label: 'Задействовано ресурсов', value: '47', change: 12, positive: true },
    { label: 'Успешность операций', value: '94%', change: 5, positive: true }
  ];

  const incidentsByRegion = [
    { region: 'Алматинская обл.', incidents: 45, critical: 8, evacuations: 3, affected: 12500 },
    { region: 'ВКО', incidents: 38, critical: 12, evacuations: 5, affected: 18000 },
    { region: 'Павлодарская обл.', incidents: 32, critical: 15, evacuations: 7, affected: 22000 },
    { region: 'ЗКО', incidents: 28, critical: 6, evacuations: 2, affected: 8000 },
    { region: 'СКО', incidents: 22, critical: 4, evacuations: 2, affected: 6500 }
  ];

  const topRiskyObjects = [
    { name: 'Усть-Каменогорская ГЭС', risk: 95 },
    { name: 'Каратомарская плотина', risk: 92 },
    { name: 'Бухтарминская ГЭС', risk: 88 },
    { name: 'Иртыш (Павлодар)', risk: 85 },
    { name: 'Шульбинская ГЭС', risk: 71 }
  ];

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">📊 Аналитика</h1>
                <p className="text-purple-100">Статистика и отчётность МЧС</p>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                {['week', 'month', 'quarter', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      timeRange === range ? 'bg-white text-purple-600 font-semibold' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {range === 'week' ? 'Неделя' : range === 'month' ? 'Месяц' : range === 'quarter' ? 'Квартал' : 'Год'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg border p-6">
                <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
                <div className={`flex items-center text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : metric.change < 0 ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
                  <span>{Math.abs(metric.change) > 0 ? `${metric.change > 0 ? '+' : ''}${metric.change}%` : 'Без изменений'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <BarChart3 className="w-6 h-6 text-purple-600 mr-2" />
                  Инциденты по неделям
                </h2>
              </div>
              <div className="space-y-3">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, idx) => {
                  const value = [12, 8, 15, 11, 9, 6, 4][idx];
                  return (
                    <div key={day}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{day}</span>
                        <span className="text-sm font-bold">{value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(value/15)*100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h2 className="text-xl font-bold mb-6">Топ-5 рискованных объектов</h2>
              <div className="space-y-4">
                {topRiskyObjects.map((obj, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                        idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="font-medium">{obj.name}</span>
                    </div>
                    <span className="text-xl font-bold text-red-600">{obj.risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Статистика по регионам</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Download className="w-5 h-5" />
                <span>Экспорт</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Регион</th>
                    <th className="text-center py-3 px-4 font-semibold">Инциденты</th>
                    <th className="text-center py-3 px-4 font-semibold">Критические</th>
                    <th className="text-center py-3 px-4 font-semibold">Эвакуации</th>
                    <th className="text-center py-3 px-4 font-semibold">Пострадавших</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentsByRegion.map((region, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{region.region}</td>
                      <td className="py-3 px-4 text-center">{region.incidents}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                          {region.critical}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">{region.evacuations}</td>
                      <td className="py-3 px-4 text-center font-semibold">{region.affected.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default AnalyticsPage;
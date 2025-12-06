import React, { useState, useEffect } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { Search, Filter, Download, TrendingUp, AlertTriangle, Calendar, Info } from 'lucide-react';
import { getInspectionPriorities } from '../../services/priorityService';

const PrioritizationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('priority_desc');
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });

  // Загрузка данных из API
  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        setLoading(true);
        const params = {
          region: selectedRegion,
          priority: selectedPriority,
          sortBy: sortBy
        };

        const response = await getInspectionPriorities(params);

        if (response.success) {
          setObjects(response.data || []);
          setStats(response.stats || { total: 0, high: 0, medium: 0, low: 0 });
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch priorities:', err);
        setError(err.message);
        setObjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPriorities();
  }, [selectedRegion, selectedPriority, sortBy]);

  // Фильтрация по поисковому запросу (на клиенте)
  const filteredObjects = objects.filter(obj => {
    const matchesSearch = obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         obj.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const regions = ['Все регионы', 'Алматинская область', 'Восточно-Казахстанская область', 'Павлодарская область', 'Западно-Казахстанская область', 'Северо-Казахстанская область'];

  const getPriorityColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getConditionColor = (condition) => {
    if (condition >= 4) return 'text-red-600';
    if (condition === 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">📊 Приоритизация обследований</h1>
                <p className="text-orange-100">Система определения приоритетности инспекций объектов</p>
              </div>
              <button className="flex items-center justify-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-lg">
                <Download className="w-5 h-5" />
                <span>Экспорт таблицы</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-b border-blue-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Формула расчёта приоритета:</p>
                <p className="mb-2">
                  <code className="bg-blue-100 px-2 py-1 rounded">PriorityScore = (6 - Состояние) × 3 + Возраст паспорта</code>
                </p>
                <p className="text-xs text-blue-700">
                  <strong>Классификация:</strong> ≥12 — Высокий | 6-11 — Средний | &lt;6 — Низкий
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Всего объектов</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Высокий приоритет</p>
                  <p className="text-2xl font-bold text-red-600">{stats.high}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Средний приоритет</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Низкий приоритет</p>
                  <p className="text-2xl font-bold text-green-600">{stats.low}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="w-4 h-4 inline mr-2" />
                  Поиск
                </label>
                <input
                  type="text"
                  placeholder="Название объекта..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-2" />
                  Регион
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {regions.map(region => (
                    <option key={region} value={region === 'Все регионы' ? 'all' : region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Приоритет
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Все уровни</option>
                  <option value="high">Высокий</option>
                  <option value="medium">Средний</option>
                  <option value="low">Низкий</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Сортировка
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="priority_desc">Приоритет (высокий→низкий)</option>
                  <option value="priority_asc">Приоритет (низкий→высокий)</option>
                  <option value="condition_desc">Состояние (хуже→лучше)</option>
                  <option value="condition_asc">Состояние (лучше→хуже)</option>
                  <option value="passport_old">Паспорт (старые→новые)</option>
                  <option value="passport_new">Паспорт (новые→старые)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">#</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Объект</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Состояние</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Дата паспорта</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Возраст</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Score</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Приоритет</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                          <p className="text-gray-600">Загрузка данных...</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center">
                        <div className="text-red-600">
                          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                          <p className="font-semibold">Ошибка загрузки данных</p>
                          <p className="text-sm text-gray-600 mt-2">{error}</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredObjects.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Объекты не найдены</h3>
                        <p className="text-gray-600">Попробуйте изменить параметры фильтров</p>
                      </td>
                    </tr>
                  ) : (
                    filteredObjects.map((obj, idx) => (
                      <tr key={obj.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${obj.priorityLevel === 'high' ? 'bg-red-50/30' : ''}`}>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white ${idx < 3 ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gray-400'}`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">{obj.name}</p>
                            <p className="text-xs text-gray-600">{obj.region}</p>
                            <p className="text-xs text-gray-500">{obj.type} • {obj.waterBody}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-2xl ${getConditionColor(obj.technicalCondition)}`}>
                            {obj.technicalCondition}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className="text-sm font-medium text-gray-900">{obj.passportYear}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 rounded-lg">
                            <p className="text-lg font-bold text-gray-900">{obj.passportAge}</p>
                            <p className="text-xs text-gray-600 ml-1">лет</p>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">{obj.priorityScore}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            (6-{obj.technicalCondition})×3+{obj.passportAge}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getPriorityColor(obj.priorityLevel)}`}>
                            <span className={`w-2 h-2 rounded-full ${obj.priorityLevel === 'high' ? 'bg-red-500' : obj.priorityLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'} mr-2`} />
                            {obj.priorityLevel === 'high' ? 'Высокий' : obj.priorityLevel === 'medium' ? 'Средний' : 'Низкий'}
                          </span>
                          {obj.priorityLevel === 'high' && (
                            <p className="text-xs text-red-600 font-semibold mt-2">⚠️ Требует обследования</p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                            Подробнее
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default PrioritizationPage;
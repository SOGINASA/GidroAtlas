import React, { useState, useEffect } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { Droplets, Search, Filter, MapPin, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getWaterBodies, getWaterBodiesStats } from '../../services/waterBodyService';

const ExpertWaterBodiesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [waterBodies, setWaterBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, critical: 0, warning: 0, safe: 0 });

  useEffect(() => {
    loadWaterBodies();
  }, []);

  const loadWaterBodies = async () => {
    try {
      setLoading(true);

      // Загружаем водоёмы и статистику
      const [bodies, statsData] = await Promise.all([
        getWaterBodies(),
        getWaterBodiesStats()
      ]);

      // Обогащаем данные приоритетами и дополнительной информацией
      const enrichedBodies = bodies.map(wb => {
        // Расчёт приоритета
        const condition = wb.riskLevel === 'critical' ? 5 : wb.riskLevel === 'danger' ? 4 : 2;
        const passportAge = wb.passportDate
          ? new Date().getFullYear() - new Date(wb.passportDate).getFullYear()
          : 3;
        const priorityScore = (6 - condition) * 3 + passportAge;
        const priorityLevel = priorityScore >= 12 ? 'high' : priorityScore >= 6 ? 'medium' : 'low';

        return {
          ...wb,
          technicalCondition: condition,
          passportDate: wb.passportDate || new Date(Date.now() - passportAge * 365 * 24 * 60 * 60 * 1000).toISOString(),
          priority: { level: priorityLevel, score: priorityScore },
          type: 'river',
          waterType: 'fresh',
          fauna: true
        };
      });

      setWaterBodies(enrichedBodies);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading water bodies:', error);
    } finally {
      setLoading(false);
    }
  };

  const regions = ['all', ...new Set(waterBodies.map(w => w.region).filter(Boolean))];

  const filteredWaterBodies = waterBodies.filter(wb => {
    const matchesSearch = wb.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = filterRegion === 'all' || wb.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  const getConditionColor = (condition) => {
    const colors = {
      1: 'bg-green-100 text-green-700 border-green-200',
      2: 'bg-lime-100 text-lime-700 border-lime-200',
      3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      4: 'bg-orange-100 text-orange-700 border-orange-200',
      5: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[condition] || colors[3];
  };

  const getPriorityColor = (level) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-orange-100 text-orange-700 border-orange-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[level] || colors.medium;
  };

  const getTypeLabel = (type) => {
    const labels = {
      river: 'Река',
      lake: 'Озеро',
      reservoir: 'Водохранилище',
      canal: 'Канал'
    };
    return labels[type] || type;
  };

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <Droplets className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">Водоёмы</h1>
            </div>
            <p className="text-sm lg:text-base text-blue-100">
              Мониторинг и управление водными объектами
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Загрузка водоёмов...</p>
            </div>
          )}

          {/* Filters */}
          {!loading && (
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="w-4 h-4 inline mr-2" />
                  Поиск
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Название водоёма..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-2" />
                  Регион
                </label>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Все регионы</option>
                  {regions.filter(r => r !== 'all').map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          )}

          {/* Stats */}
          {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Всего</p>
              <p className="text-2xl font-bold text-gray-900">{waterBodies.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Высокий приоритет</p>
              <p className="text-2xl font-bold text-red-600">
                {waterBodies.filter(w => w.priority.level === 'high').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Средний приоритет</p>
              <p className="text-2xl font-bold text-orange-600">
                {waterBodies.filter(w => w.priority.level === 'medium').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Низкий приоритет</p>
              <p className="text-2xl font-bold text-green-600">
                {waterBodies.filter(w => w.priority.level === 'low').length}
              </p>
            </div>
          </div>
          )}

          {/* Water Bodies List */}
          {!loading && (
            <>
              {filteredWaterBodies.length > 0 ? (
                <div className="space-y-4">
                  {filteredWaterBodies.map((wb) => (
                    <div
                      key={wb.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                <div className="p-4 lg:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                        {wb.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {getTypeLabel(wb.type)}
                        </span>
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
                          {wb.waterType === 'fresh' ? 'Пресная' : 'Непресная'}
                        </span>
                        {wb.fauna && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Есть фауна
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(wb.priority.level)}`}>
                      Приоритет: {wb.priority.level === 'high' ? 'Высокий' : wb.priority.level === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{wb.region}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Паспорт: {new Date(wb.passportDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 mr-2">Состояние:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getConditionColor(wb.technicalCondition)}`}>
                        Категория {wb.technicalCondition}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Оценка приоритета: <span className="font-bold text-gray-900">{wb.priority.score}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/expert/map?id=${wb.id}`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        На карте
                      </Link>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>Паспорт</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ничего не найдено
                  </h3>
                  <p className="text-gray-600">
                    Попробуйте изменить параметры поиска
                  </p>
                </div>
              )}
            </>
          )}
          )}
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertWaterBodiesPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { Search, Filter, MapPin, TrendingUp, TrendingDown, Droplets, AlertTriangle } from 'lucide-react';
import { getWaterBodies } from '../../services/waterBodyService';
import { getAllSensors } from '../../services/sensorService';

const WaterBodiesManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [waterBodies, setWaterBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch water bodies on mount
  useEffect(() => {
    fetchWaterBodies();
  }, []);

  const fetchWaterBodies = async () => {
    try {
      setLoading(true);
      setError('');

      let data = await getWaterBodies();

      // Если нет водоемов, используем датчики как водоемы
      if (!data || data.length === 0) {
        console.log('No water bodies found, using sensors as water bodies');
        const sensorsResponse = await getAllSensors();
        const sensors = sensorsResponse.data || [];

        // Преобразуем датчики в формат водоемов
        data = sensors.map(sensor => ({
          id: sensor.id,
          name: sensor.name,
          region: sensor.location || 'Не указан',
          type: 'Датчик мониторинга',
          area: 0,
          currentLevel: sensor.waterLevel,
          normalLevel: 4.0,
          trend: sensor.waterLevel > 5.0 ? 'rising' : sensor.waterLevel < 3.0 ? 'falling' : 'stable',
          status: sensor.dangerLevel,
          riskLevel: sensor.dangerLevel === 'critical' ? 'high' : sensor.dangerLevel === 'danger' ? 'medium' : 'low',
          sensors: 1,
          fauna: false,
          lastUpdate: sensor.lastUpdate
        }));
      }

      setWaterBodies(data || []);
    } catch (err) {
      console.error('Error loading water bodies:', err);
      console.warn('[WARNING] Using mock data for WaterBodiesManagement - API request failed');
      setError('Ошибка загрузки данных');
      // Set default mock data on error
      setDefaultMockData();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultMockData = () => {
    setWaterBodies([
    {
      id: 1,
      name: 'Озеро Балхаш',
      region: 'Алматинская область',
      type: 'Озеро',
      area: 16400,
      currentLevel: 340.65,
      normalLevel: 342.0,
      trend: 'falling',
      status: 'warning',
      riskLevel: 'medium',
      sensors: 12,
      fauna: true
    },
    {
      id: 2,
      name: 'Река Иртыш (участок Павлодар)',
      region: 'Павлодарская область',
      type: 'Река',
      area: 2500,
      currentLevel: 8.2,
      normalLevel: 7.0,
      trend: 'rising',
      status: 'critical',
      riskLevel: 'high',
      sensors: 8,
      fauna: true
    },
    {
      id: 3,
      name: 'Капшагайское водохранилище',
      region: 'Алматинская область',
      type: 'Водохранилище',
      area: 1847,
      currentLevel: 485.5,
      normalLevel: 485.0,
      trend: 'stable',
      status: 'safe',
      riskLevel: 'low',
      sensors: 15,
      fauna: true
    },
    {
      id: 4,
      name: 'Река Урал',
      region: 'Западно-Казахстанская область',
      type: 'Река',
      area: 1200,
      currentLevel: 5.4,
      normalLevel: 4.5,
      trend: 'rising',
      status: 'warning',
      riskLevel: 'medium',
      sensors: 6,
      fauna: true
    },
    {
      id: 5,
      name: 'Озеро Зайсан',
      region: 'Восточно-Казахстанская область',
      type: 'Озеро',
      area: 1810,
      currentLevel: 420.3,
      normalLevel: 420.5,
      trend: 'stable',
      status: 'safe',
      riskLevel: 'low',
      sensors: 10,
      fauna: true
    },
    {
      id: 6,
      name: 'Бухтарминское водохранилище',
      region: 'Восточно-Казахстанская область',
      type: 'Водохранилище',
      area: 5490,
      currentLevel: 320.0,
      normalLevel: 320.0,
      trend: 'stable',
      status: 'safe',
      riskLevel: 'low',
      sensors: 18,
      fauna: true
    }
  ]);
  };

  const filteredBodies = waterBodies.filter(body => {
    const matchesSearch = body.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         body.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || body.region === selectedRegion;
    const matchesStatus = selectedStatus === 'all' || body.status === selectedStatus;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const stats = {
    total: waterBodies.length,
    critical: waterBodies.filter(b => b.status === 'critical').length,
    warning: waterBodies.filter(b => b.status === 'warning').length,
    safe: waterBodies.filter(b => b.status === 'safe').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'safe': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">💧 Управление водоёмами</h1>
            <p className="text-blue-100">Мониторинг состояния водных ресурсов</p>
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
            <p className="text-gray-600">Загрузка данных...</p>
          </div>
        )}

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Всего</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Критические</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Предупреждение</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Безопасно</p>
                  <p className="text-2xl font-bold text-green-600">{stats.safe}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="w-4 h-4 inline mr-2" />
                  Поиск
                </label>
                <input
                  type="text"
                  placeholder="Название или регион..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Все регионы</option>
                  <option value="Алматинская область">Алматинская область</option>
                  <option value="Павлодарская область">Павлодарская область</option>
                  <option value="Восточно-Казахстанская область">ВКО</option>
                  <option value="Западно-Казахстанская область">ЗКО</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Статус
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Все статусы</option>
                  <option value="critical">Критический</option>
                  <option value="warning">Предупреждение</option>
                  <option value="safe">Безопасно</option>
                </select>
              </div>
            </div>
          </div>

          {/* Water Bodies Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBodies.map((body) => (
              <div key={body.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{body.name}</h3>
                      <p className="text-blue-100 text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {body.region}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(body.status)}`}>
                      {body.status === 'critical' ? 'Критический' : 
                       body.status === 'warning' ? 'Предупр.' : 'Безопасно'}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Тип</p>
                      <p className="font-semibold text-gray-900">{body.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Площадь</p>
                      <p className="font-semibold text-gray-900">{body.area} км²</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Текущий уровень</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        {body.currentLevel} м
                        {body.trend === 'rising' && <TrendingUp className="w-4 h-4 text-red-500 ml-1" />}
                        {body.trend === 'falling' && <TrendingDown className="w-4 h-4 text-blue-500 ml-1" />}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Норма</p>
                      <p className="font-semibold text-gray-900">{body.normalLevel} м</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Датчики</p>
                      <p className="font-semibold text-gray-900">{body.sensors} шт</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Фауна</p>
                      <p className="font-semibold text-gray-900">{body.fauna ? 'Да' : 'Нет'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/detail/waterbody/${body.id}`)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBodies.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Водоёмы не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить параметры фильтров</p>
            </div>
          )}
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default WaterBodiesManagement;
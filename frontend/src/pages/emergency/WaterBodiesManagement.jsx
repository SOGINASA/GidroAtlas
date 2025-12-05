import React, { useState } from 'react';
import { Search, Filter, Download, Eye, MapPin, TrendingUp, AlertCircle, Droplets } from 'lucide-react';

const WaterBodiesManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock данные - водоёмы
  const waterBodies = [
    {
      id: 1,
      name: 'Озеро Балхаш',
      region: 'Алматинская область',
      type: 'Озеро',
      waterType: 'Пресная',
      area: 16400,
      currentLevel: 341.8,
      normalLevel: 342.0,
      status: 'warning',
      statusText: 'Внимание',
      trend: 'falling',
      lastUpdate: '2024-12-05 14:30',
      riskLevel: 'medium',
      coordinates: { lat: 46.0, lng: 74.5 },
      fauna: true,
      technicalCondition: 3,
      sensors: 12
    },
    {
      id: 2,
      name: 'Река Иртыш',
      region: 'Павлодарская область',
      type: 'Река',
      waterType: 'Пресная',
      area: 8500,
      currentLevel: 4.8,
      normalLevel: 4.2,
      status: 'critical',
      statusText: 'Критично',
      trend: 'rising',
      lastUpdate: '2024-12-05 15:00',
      riskLevel: 'high',
      coordinates: { lat: 52.3, lng: 76.9 },
      fauna: true,
      technicalCondition: 5,
      sensors: 8
    },
    {
      id: 3,
      name: 'Капшагайское водохранилище',
      region: 'Алматинская область',
      type: 'Водохранилище',
      waterType: 'Пресная',
      area: 1850,
      currentLevel: 485.2,
      normalLevel: 485.0,
      status: 'safe',
      statusText: 'Безопасно',
      trend: 'stable',
      lastUpdate: '2024-12-05 14:45',
      riskLevel: 'low',
      coordinates: { lat: 43.9, lng: 77.1 },
      fauna: true,
      technicalCondition: 2,
      sensors: 6
    },
    {
      id: 4,
      name: 'Река Урал',
      region: 'Западно-Казахстанская область',
      type: 'Река',
      waterType: 'Пресная',
      area: 6200,
      currentLevel: 3.2,
      normalLevel: 3.0,
      status: 'warning',
      statusText: 'Внимание',
      trend: 'rising',
      lastUpdate: '2024-12-05 13:20',
      riskLevel: 'medium',
      coordinates: { lat: 51.2, lng: 51.4 },
      fauna: true,
      technicalCondition: 3,
      sensors: 5
    },
    {
      id: 5,
      name: 'Озеро Зайсан',
      region: 'Восточно-Казахстанская область',
      type: 'Озеро',
      waterType: 'Пресная',
      area: 1810,
      currentLevel: 386.5,
      normalLevel: 386.0,
      status: 'safe',
      statusText: 'Безопасно',
      trend: 'stable',
      lastUpdate: '2024-12-05 14:00',
      riskLevel: 'low',
      coordinates: { lat: 48.0, lng: 84.5 },
      fauna: true,
      technicalCondition: 2,
      sensors: 4
    },
    {
      id: 6,
      name: 'Бухтарминское водохранилище',
      region: 'Восточно-Казахстанская область',
      type: 'Водохранилище',
      waterType: 'Пресная',
      area: 5490,
      currentLevel: 450.8,
      normalLevel: 450.0,
      status: 'warning',
      statusText: 'Внимание',
      trend: 'rising',
      lastUpdate: '2024-12-05 14:15',
      riskLevel: 'medium',
      coordinates: { lat: 48.5, lng: 83.5 },
      fauna: true,
      technicalCondition: 3,
      sensors: 7
    }
  ];

  const regions = [
    'Все регионы',
    'Алматинская область',
    'Павлодарская область',
    'Западно-Казахстанская область',
    'Восточно-Казахстанская область',
    'Северо-Казахстанская область',
    'Акмолинская область'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'safe': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'safe': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredWaterBodies = waterBodies
    .filter(wb => {
      const matchesSearch = wb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wb.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || wb.region === selectedRegion;
      const matchesStatus = selectedStatus === 'all' || wb.status === selectedStatus;
      return matchesSearch && matchesRegion && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'level': return b.currentLevel - a.currentLevel;
        case 'risk': 
          const riskOrder = { high: 3, medium: 2, low: 1 };
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        default: return 0;
      }
    });

  const stats = {
    total: waterBodies.length,
    critical: waterBodies.filter(wb => wb.status === 'critical').length,
    warning: waterBodies.filter(wb => wb.status === 'warning').length,
    safe: waterBodies.filter(wb => wb.status === 'safe').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">💧 Управление водоёмами</h1>
              <p className="text-blue-100">Мониторинг и контроль водных ресурсов</p>
            </div>
            <button className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all">
              <Download className="w-5 h-5" />
              <span>Экспорт данных</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего водоёмов</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Критичные</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Внимание</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Безопасные</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Поиск
              </label>
              <input
                type="text"
                placeholder="Название водоёма или регион..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Регион
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Все регионы</option>
                {regions.slice(1).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Статус
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Все статусы</option>
                <option value="critical">Критично</option>
                <option value="warning">Внимание</option>
                <option value="safe">Безопасно</option>
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Сортировка:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSortBy('name')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  По названию
                </button>
                <button
                  onClick={() => setSortBy('level')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === 'level' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  По уровню
                </button>
                <button
                  onClick={() => setSortBy('risk')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === 'risk' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  По риску
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Найдено: <span className="font-bold">{filteredWaterBodies.length}</span> водоёмов
            </p>
          </div>
        </div>

        {/* Water Bodies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWaterBodies.map((wb) => (
            <div 
              key={wb.id}
              className={`bg-white rounded-2xl shadow-lg border-2 ${getStatusColor(wb.status)} p-6 hover:shadow-xl transition-all`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{wb.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{wb.region}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(wb.status)}`}>
                    {wb.statusText}
                  </span>
                  <span className={`text-2xl ${getTrendIcon(wb.trend)}`}>
                    {getTrendIcon(wb.trend)}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Тип</p>
                  <p className="text-sm font-bold text-gray-900">{wb.type}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Площадь</p>
                  <p className="text-sm font-bold text-gray-900">{wb.area.toLocaleString()} км²</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 mb-1">Текущий уровень</p>
                  <p className="text-lg font-bold text-blue-700">{wb.currentLevel} м</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Норма</p>
                  <p className="text-lg font-bold text-gray-700">{wb.normalLevel} м</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center space-x-1">
                    <span>🐟</span>
                    <span className="text-gray-600">{wb.fauna ? 'Есть фауна' : 'Нет фауны'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>📡</span>
                    <span className="text-gray-600">{wb.sensors} датчиков</span>
                  </span>
                </div>
                <span className={`text-sm font-semibold ${getRiskColor(wb.riskLevel)}`}>
                  Риск: {wb.riskLevel === 'high' ? 'Высокий' : wb.riskLevel === 'medium' ? 'Средний' : 'Низкий'}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Обновлено: {wb.lastUpdate}
                </p>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Подробнее</span>
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>На карте</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWaterBodies.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Водоёмы не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterBodiesManagement;
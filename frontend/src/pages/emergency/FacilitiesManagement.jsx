import React, { useState } from 'react';
import { Search, Filter, Download, Eye, MapPin, Zap, AlertTriangle, Settings } from 'lucide-react';

const FacilitiesManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock данные - ГТС
  const facilities = [
    {
      id: 1,
      name: 'Бухтарминская ГЭС',
      region: 'Восточно-Казахстанская область',
      type: 'Гидроэлектростанция',
      status: 'operational',
      statusText: 'В работе',
      capacity: 675,
      year: 1966,
      condition: 3,
      riskLevel: 'medium',
      lastInspection: '2024-10-15',
      nextInspection: '2025-04-15',
      waterBody: 'Река Иртыш',
      coordinates: { lat: 48.5, lng: 83.5 },
      issues: 2,
      alerts: 0
    },
    {
      id: 2,
      name: 'Капшагайская ГЭС',
      region: 'Алматинская область',
      type: 'Гидроэлектростанция',
      status: 'operational',
      statusText: 'В работе',
      capacity: 364,
      year: 1970,
      condition: 2,
      riskLevel: 'low',
      lastInspection: '2024-11-20',
      nextInspection: '2025-05-20',
      waterBody: 'Река Или',
      coordinates: { lat: 43.9, lng: 77.1 },
      issues: 0,
      alerts: 0
    },
    {
      id: 3,
      name: 'Шульбинская ГЭС',
      region: 'Восточно-Казахстанская область',
      type: 'Гидроэлектростанция',
      status: 'maintenance',
      statusText: 'Обслуживание',
      capacity: 702,
      year: 1987,
      condition: 3,
      riskLevel: 'medium',
      lastInspection: '2024-09-10',
      nextInspection: '2025-03-10',
      waterBody: 'Река Иртыш',
      coordinates: { lat: 50.1, lng: 82.2 },
      issues: 3,
      alerts: 1
    },
    {
      id: 4,
      name: 'Усть-Каменогорская ГЭС',
      region: 'Восточно-Казахстанская область',
      type: 'Гидроэлектростанция',
      status: 'operational',
      statusText: 'В работе',
      capacity: 331,
      year: 1952,
      condition: 4,
      riskLevel: 'high',
      lastInspection: '2024-08-05',
      nextInspection: '2025-02-05',
      waterBody: 'Река Иртыш',
      coordinates: { lat: 50.0, lng: 82.6 },
      issues: 5,
      alerts: 2
    },
    {
      id: 5,
      name: 'Сергеевское водохранилище',
      region: 'Северо-Казахстанская область',
      type: 'Водохранилище',
      status: 'operational',
      statusText: 'В работе',
      capacity: 0,
      year: 1968,
      condition: 2,
      riskLevel: 'low',
      lastInspection: '2024-11-01',
      nextInspection: '2025-05-01',
      waterBody: 'Река Ишим',
      coordinates: { lat: 54.3, lng: 69.4 },
      issues: 1,
      alerts: 0
    },
    {
      id: 6,
      name: 'Каратомарская плотина',
      region: 'Алматинская область',
      type: 'Плотина',
      status: 'emergency',
      statusText: 'Критично',
      capacity: 0,
      year: 1975,
      condition: 5,
      riskLevel: 'high',
      lastInspection: '2024-12-01',
      nextInspection: '2025-01-15',
      waterBody: 'Река Каратомар',
      coordinates: { lat: 43.2, lng: 76.8 },
      issues: 8,
      alerts: 3
    }
  ];

  const regions = [
    'Все регионы',
    'Восточно-Казахстанская область',
    'Алматинская область',
    'Северо-Казахстанская область',
    'Павлодарская область'
  ];

  const facilityTypes = [
    'Все типы',
    'Гидроэлектростанция',
    'Водохранилище',
    'Плотина',
    'Канал',
    'Насосная станция'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'operational': return 'bg-green-100 text-green-800 border-green-300';
      case 'decommissioned': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getConditionColor = (condition) => {
    if (condition >= 4) return 'text-red-600';
    if (condition === 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getConditionText = (condition) => {
    switch (condition) {
      case 1: return 'Отличное';
      case 2: return 'Хорошее';
      case 3: return 'Удовлетворительное';
      case 4: return 'Плохое';
      case 5: return 'Критическое';
      default: return 'Неизвестно';
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredFacilities = facilities
    .filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || f.region === selectedRegion;
      const matchesType = selectedType === 'all' || f.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || f.status === selectedStatus;
      return matchesSearch && matchesRegion && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'condition': return b.condition - a.condition;
        case 'risk':
          const riskOrder = { high: 3, medium: 2, low: 1 };
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        default: return 0;
      }
    });

  const stats = {
    total: facilities.length,
    operational: facilities.filter(f => f.status === 'operational').length,
    maintenance: facilities.filter(f => f.status === 'maintenance').length,
    emergency: facilities.filter(f => f.status === 'emergency').length,
    totalAlerts: facilities.reduce((sum, f) => sum + f.alerts, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">⚡ Управление ГТС</h1>
              <p className="text-purple-100">Мониторинг гидротехнических сооружений</p>
            </div>
            <button className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all">
              <Download className="w-5 h-5" />
              <span>Экспорт данных</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего ГТС</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">В работе</p>
                <p className="text-2xl font-bold text-green-600">{stats.operational}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Обслуживание</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Критичные</p>
                <p className="text-2xl font-bold text-red-600">{stats.emergency}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔔</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего алертов</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalAlerts}</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Поиск
              </label>
              <input
                type="text"
                placeholder="Название ГТС..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {regions.map(region => (
                  <option key={region} value={region === 'Все регионы' ? 'all' : region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="w-4 h-4 inline mr-2" />
                Тип
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {facilityTypes.map(type => (
                  <option key={type} value={type === 'Все типы' ? 'all' : type}>
                    {type}
                  </option>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Все статусы</option>
                <option value="operational">В работе</option>
                <option value="maintenance">Обслуживание</option>
                <option value="emergency">Критично</option>
                <option value="decommissioned">Выведено</option>
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
                    sortBy === 'name' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  По названию
                </button>
                <button
                  onClick={() => setSortBy('condition')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === 'condition' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  По состоянию
                </button>
                <button
                  onClick={() => setSortBy('risk')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === 'risk' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  По риску
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Найдено: <span className="font-bold">{filteredFacilities.length}</span> объектов
            </p>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFacilities.map((facility) => (
            <div 
              key={facility.id}
              className={`bg-white rounded-2xl shadow-lg border-2 ${getStatusColor(facility.status)} p-6 hover:shadow-xl transition-all`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{facility.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{facility.region}</span>
                  </div>
                  <span className="text-sm text-gray-500">{facility.waterBody}</span>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(facility.status)}`}>
                    {facility.statusText}
                  </span>
                  {facility.alerts > 0 && (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                      🔔 {facility.alerts} алерта
                    </span>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Тип</p>
                  <p className="text-sm font-bold text-gray-900">{facility.type}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Год постройки</p>
                  <p className="text-sm font-bold text-gray-900">{facility.year}</p>
                </div>
                {facility.capacity > 0 && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-600 mb-1">Мощность</p>
                    <p className="text-lg font-bold text-purple-700">{facility.capacity} МВт</p>
                  </div>
                )}
                <div className={`rounded-lg p-3 ${
                  facility.condition >= 4 ? 'bg-red-50' : 
                  facility.condition === 3 ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                  <p className="text-xs text-gray-600 mb-1">Состояние</p>
                  <p className={`text-lg font-bold ${getConditionColor(facility.condition)}`}>
                    {getConditionText(facility.condition)}
                  </p>
                </div>
              </div>

              {/* Inspection Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-600 mb-1">Последнее обследование</p>
                    <p className="font-semibold text-gray-900">{facility.lastInspection}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Следующее обследование</p>
                    <p className="font-semibold text-gray-900">{facility.nextInspection}</p>
                  </div>
                </div>
              </div>

              {/* Issues & Risk */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-4 text-sm">
                  {facility.issues > 0 && (
                    <span className="flex items-center space-x-1 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-semibold">{facility.issues} проблем</span>
                    </span>
                  )}
                  {facility.issues === 0 && (
                    <span className="flex items-center space-x-1 text-green-600">
                      <span>✅</span>
                      <span className="font-semibold">Без проблем</span>
                    </span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskBadge(facility.riskLevel)}`}>
                  Риск: {facility.riskLevel === 'high' ? 'Высокий' : facility.riskLevel === 'medium' ? 'Средний' : 'Низкий'}
                </span>
              </div>

              {/* Footer */}
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all flex items-center justify-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Подробнее</span>
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>На карте</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFacilities.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ГТС не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilitiesManagement;
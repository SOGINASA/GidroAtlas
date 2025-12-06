import React, { useState } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { Zap, Search, Filter, MapPin, Calendar, FileText, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpertFacilitiesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock data
  const facilities = [
    {
      id: 1,
      name: 'Бухтарминская ГЭС',
      region: 'Восточно-Казахстанская область',
      type: 'hydropower',
      status: 'operational',
      capacity: 675,
      commissionedYear: 1966,
      technicalCondition: 3,
      passportDate: '2019-05-12',
      coordinates: { lat: 49.0833, lng: 83.5 },
      priority: { level: 'high', score: 15 }
    },
    {
      id: 2,
      name: 'Шульбинская ГЭС',
      region: 'Восточно-Казахстанская область',
      type: 'hydropower',
      status: 'operational',
      capacity: 702,
      commissionedYear: 1987,
      technicalCondition: 2,
      passportDate: '2020-08-22',
      coordinates: { lat: 50.1667, lng: 82.1833 },
      priority: { level: 'medium', score: 9 }
    },
    {
      id: 3,
      name: 'Капшагайская ГЭС',
      region: 'Алматинская область',
      type: 'hydropower',
      status: 'operational',
      capacity: 364,
      commissionedYear: 1970,
      technicalCondition: 4,
      passportDate: '2017-03-15',
      coordinates: { lat: 43.8833, lng: 77.0833 },
      priority: { level: 'high', score: 18 }
    },
    {
      id: 4,
      name: 'Плотина Сорг',
      region: 'Алматинская область',
      type: 'dam',
      status: 'operational',
      capacity: 0,
      commissionedYear: 1978,
      technicalCondition: 2,
      passportDate: '2021-11-08',
      coordinates: { lat: 43.1833, lng: 77.1833 },
      priority: { level: 'low', score: 6 }
    }
  ];

  const regions = ['all', ...new Set(facilities.map(f => f.region))];
  const types = [
    { value: 'all', label: 'Все типы' },
    { value: 'hydropower', label: 'ГЭС' },
    { value: 'dam', label: 'Плотина' },
    { value: 'canal', label: 'Канал' },
    { value: 'pumping_station', label: 'Насосная станция' }
  ];

  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = filterRegion === 'all' || f.region === filterRegion;
    const matchesType = filterType === 'all' || f.type === filterType;
    return matchesSearch && matchesRegion && matchesType;
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

  const getStatusColor = (status) => {
    const colors = {
      operational: 'bg-green-100 text-green-700',
      maintenance: 'bg-yellow-100 text-yellow-700',
      emergency: 'bg-red-100 text-red-700',
      decommissioned: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || colors.operational;
  };

  const getTypeLabel = (type) => {
    const labels = {
      hydropower: 'ГЭС',
      dam: 'Плотина',
      canal: 'Канал',
      pumping_station: 'Насосная станция'
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status) => {
    const labels = {
      operational: 'Работает',
      maintenance: 'На ТО',
      emergency: 'Аварийная',
      decommissioned: 'Выведена'
    };
    return labels[status] || status;
  };

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">Гидротехнические сооружения</h1>
            </div>
            <p className="text-sm lg:text-base text-blue-100">
              Мониторинг и управление ГТС
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  placeholder="Название сооружения..."
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

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип ГТС
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {types.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Всего</p>
              <p className="text-2xl font-bold text-gray-900">{facilities.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Высокий приоритет</p>
              <p className="text-2xl font-bold text-red-600">
                {facilities.filter(f => f.priority.level === 'high').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Средний приоритет</p>
              <p className="text-2xl font-bold text-orange-600">
                {facilities.filter(f => f.priority.level === 'medium').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Низкий приоритет</p>
              <p className="text-2xl font-bold text-green-600">
                {facilities.filter(f => f.priority.level === 'low').length}
              </p>
            </div>
          </div>

          {/* Facilities List */}
          <div className="space-y-4">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="p-4 lg:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                        {facility.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {getTypeLabel(facility.type)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(facility.status)}`}>
                          {getStatusLabel(facility.status)}
                        </span>
                        {facility.capacity > 0 && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <Activity className="w-3 h-3" />
                            <span>{facility.capacity} МВт</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(facility.priority.level)}`}>
                      Приоритет: {facility.priority.level === 'high' ? 'Высокий' : facility.priority.level === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{facility.region}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Год ввода: {facility.commissionedYear}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 mr-2">Состояние:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getConditionColor(facility.technicalCondition)}`}>
                        Категория {facility.technicalCondition}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Оценка приоритета: <span className="font-bold text-gray-900">{facility.priority.score}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/expert/map?id=${facility.id}`}
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

          {filteredFacilities.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ничего не найдено
              </h3>
              <p className="text-gray-600">
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertFacilitiesPage;
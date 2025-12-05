import React, { useState } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { Search, Filter, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const FacilitiesManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const facilities = [
    {
      id: 1,
      name: 'Бухтарминская ГЭС',
      type: 'ГЭС',
      region: 'Восточно-Казахстанская область',
      capacity: 675,
      yearBuilt: 1966,
      status: 'operational',
      technicalCondition: 3,
      riskScore: 71,
      lastInspection: '2024-10-15',
      nextInspection: '2025-01-15',
      issues: 2,
      alerts: 1
    },
    {
      id: 2,
      name: 'Капшагайская ГЭС',
      type: 'ГЭС',
      region: 'Алматинская область',
      capacity: 364,
      yearBuilt: 1970,
      status: 'operational',
      technicalCondition: 2,
      riskScore: 45,
      lastInspection: '2024-11-20',
      nextInspection: '2025-02-20',
      issues: 0,
      alerts: 0
    },
    {
      id: 3,
      name: 'Шульбинская ГЭС',
      type: 'ГЭС',
      region: 'Восточно-Казахстанская область',
      capacity: 702,
      yearBuilt: 1987,
      status: 'operational',
      technicalCondition: 3,
      riskScore: 68,
      lastInspection: '2024-09-10',
      nextInspection: '2024-12-10',
      issues: 3,
      alerts: 2
    },
    {
      id: 4,
      name: 'Усть-Каменогорская ГЭС',
      type: 'ГЭС',
      region: 'Восточно-Казахстанская область',
      capacity: 331,
      yearBuilt: 1952,
      status: 'maintenance',
      technicalCondition: 4,
      riskScore: 85,
      lastInspection: '2024-08-05',
      nextInspection: '2024-12-05',
      issues: 5,
      alerts: 3
    },
    {
      id: 5,
      name: 'Сергеевское водохранилище',
      type: 'Водохранилище',
      region: 'Северо-Казахстанская область',
      capacity: 0,
      yearBuilt: 1958,
      status: 'operational',
      technicalCondition: 2,
      riskScore: 38,
      lastInspection: '2024-11-01',
      nextInspection: '2025-02-01',
      issues: 1,
      alerts: 0
    },
    {
      id: 6,
      name: 'Каратомарская плотина',
      type: 'Плотина',
      region: 'Алматинская область',
      capacity: 0,
      yearBuilt: 1975,
      status: 'emergency',
      technicalCondition: 5,
      riskScore: 95,
      lastInspection: '2024-12-01',
      nextInspection: '2024-12-08',
      issues: 8,
      alerts: 5
    }
  ];

  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || f.region === selectedRegion;
    const matchesType = selectedType === 'all' || f.type === selectedType;
    return matchesSearch && matchesRegion && matchesType;
  });

  const stats = {
    total: facilities.length,
    operational: facilities.filter(f => f.status === 'operational').length,
    maintenance: facilities.filter(f => f.status === 'maintenance').length,
    emergency: facilities.filter(f => f.status === 'emergency').length,
    alerts: facilities.reduce((sum, f) => sum + f.alerts, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">⚡ Управление ГТС</h1>
            <p className="text-purple-100">Мониторинг гидротехнических сооружений</p>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Всего</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Работают</p>
                  <p className="text-2xl font-bold text-green-600">{stats.operational}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">На ремонте</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Аварийно</p>
                  <p className="text-2xl font-bold text-red-600">{stats.emergency}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🚨</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Алертов</p>
                  <p className="text-2xl font-bold text-red-600">{stats.alerts}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-3 border rounded-lg"
              />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border rounded-lg"
              >
                <option value="all">Все регионы</option>
                <option value="Восточно-Казахстанская область">ВКО</option>
                <option value="Алматинская область">Алматинская</option>
                <option value="Северо-Казахстанская область">СКО</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border rounded-lg"
              >
                <option value="all">Все типы</option>
                <option value="ГЭС">ГЭС</option>
                <option value="Плотина">Плотина</option>
                <option value="Водохранилище">Водохранилище</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFacilities.map((facility) => (
              <div key={facility.id} className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{facility.name}</h3>
                      <p className="text-purple-100 text-sm">{facility.region}</p>
                    </div>
                    {facility.alerts > 0 && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {facility.alerts} 🚨
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Тип</p>
                      <p className="font-semibold">{facility.type}</p>
                    </div>
                    {facility.capacity > 0 && (
                      <div>
                        <p className="text-gray-600">Мощность</p>
                        <p className="font-semibold">{facility.capacity} МВт</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Год постройки</p>
                      <p className="font-semibold">{facility.yearBuilt}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Состояние</p>
                      <p className={`font-bold text-2xl ${getConditionColor(facility.technicalCondition)}`}>
                        {facility.technicalCondition}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Риск-балл</p>
                      <p className={`font-semibold ${facility.riskScore >= 80 ? 'text-red-600' : facility.riskScore >= 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {facility.riskScore}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Статус</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusColor(facility.status)}`}>
                        {facility.status === 'operational' ? 'Работает' :
                         facility.status === 'maintenance' ? 'Ремонт' : 'Авария'}
                      </span>
                    </div>
                  </div>

                  {facility.issues > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Обнаружено проблем: {facility.issues}
                      </p>
                    </div>
                  )}

                  <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default FacilitiesManagement;
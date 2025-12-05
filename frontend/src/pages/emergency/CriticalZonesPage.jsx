import React, { useState } from 'react';
import { AlertTriangle, MapPin, Users, Clock, Phone, Navigation, Shield, ChevronRight } from 'lucide-react';

const CriticalZonesPage = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTab, setActiveTab] = useState('zones'); // zones | evacuations

  // Mock данные - критические зоны
  const criticalZones = [
    {
      id: 1,
      name: 'Павлодарская область - р. Иртыш',
      level: 'critical',
      levelText: 'Критично',
      waterLevel: 4.8,
      threshold: 4.2,
      trend: 'rising',
      affectedPopulation: 15000,
      evacuationStatus: 'active',
      evacuated: 3500,
      shelters: 4,
      lastUpdate: '2024-12-05 15:30',
      description: 'Критическое превышение уровня воды. Активная эвакуация населения.',
      coordinates: { lat: 52.3, lng: 76.9 },
      sensors: ['А-234', 'А-235', 'А-236'],
      emergencyContacts: [
        { name: 'Дежурный МЧС', phone: '+7 (777) 123-45-67' },
        { name: 'Местная администрация', phone: '+7 (777) 234-56-78' }
      ]
    },
    {
      id: 2,
      name: 'Алматинская область - оз. Балхаш',
      level: 'danger',
      levelText: 'Опасно',
      waterLevel: 3.9,
      threshold: 3.5,
      trend: 'rising',
      affectedPopulation: 8000,
      evacuationStatus: 'prepared',
      evacuated: 0,
      shelters: 3,
      lastUpdate: '2024-12-05 14:45',
      description: 'Превышение безопасного уровня. Подготовка к возможной эвакуации.',
      coordinates: { lat: 46.0, lng: 74.5 },
      sensors: ['Б-112', 'Б-113'],
      emergencyContacts: [
        { name: 'Дежурный МЧС', phone: '+7 (777) 345-67-89' },
        { name: 'Местная администрация', phone: '+7 (777) 456-78-90' }
      ]
    },
    {
      id: 3,
      name: 'Западно-Казахстанская область - р. Урал',
      level: 'warning',
      levelText: 'Внимание',
      waterLevel: 3.2,
      threshold: 3.0,
      trend: 'rising',
      affectedPopulation: 5000,
      evacuationStatus: 'monitoring',
      evacuated: 0,
      shelters: 2,
      lastUpdate: '2024-12-05 13:15',
      description: 'Повышение уровня воды. Усиленный мониторинг ситуации.',
      coordinates: { lat: 51.2, lng: 51.4 },
      sensors: ['У-087'],
      emergencyContacts: [
        { name: 'Дежурный МЧС', phone: '+7 (777) 567-89-01' }
      ]
    }
  ];

  // Mock данные - активные эвакуации
  const evacuations = [
    {
      id: 1,
      location: 'с. Затобольск, Павлодарская область',
      status: 'active',
      statusText: 'Активна',
      totalPeople: 2500,
      evacuated: 1800,
      remaining: 700,
      shelters: [
        { name: 'Школа №5', capacity: 800, occupied: 750 },
        { name: 'Спорткомплекс "Жастар"', capacity: 1000, occupied: 850 },
        { name: 'Детский сад №12', capacity: 200, occupied: 200 }
      ],
      transportUnits: 12,
      medicalTeams: 3,
      startTime: '2024-12-05 10:00',
      coordinator: 'Иванов И.И.',
      contactPhone: '+7 (777) 123-45-67'
    },
    {
      id: 2,
      location: 'с. Лебяжье, Павлодарская область',
      status: 'active',
      statusText: 'Активна',
      totalPeople: 1200,
      evacuated: 700,
      remaining: 500,
      shelters: [
        { name: 'Дом культуры', capacity: 500, occupied: 450 },
        { name: 'Школа №3', capacity: 400, occupied: 250 }
      ],
      transportUnits: 6,
      medicalTeams: 2,
      startTime: '2024-12-05 11:30',
      coordinator: 'Петров П.П.',
      contactPhone: '+7 (777) 234-56-78'
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'from-red-600 to-red-700';
      case 'danger': return 'from-orange-500 to-orange-600';
      case 'warning': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'danger': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getEvacuationStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'prepared': return 'bg-yellow-100 text-yellow-800';
      case 'monitoring': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (evacuated, total) => {
    return Math.round((evacuated / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Критические зоны</h1>
              <p className="text-red-100">Мониторинг опасных участков и управление эвакуацией</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('zones')}
              className={`py-4 px-2 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'zones'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Критические зоны ({criticalZones.length})
            </button>
            <button
              onClick={() => setActiveTab('evacuations')}
              className={`py-4 px-2 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'evacuations'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Активные эвакуации ({evacuations.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        
        {/* Critical Zones Tab */}
        {activeTab === 'zones' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Всего зон</span>
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{criticalZones.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Критичных</span>
                  <span className="text-2xl">🚨</span>
                </div>
                <p className="text-3xl font-bold text-red-600">
                  {criticalZones.filter(z => z.level === 'critical').length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Население</span>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {criticalZones.reduce((sum, z) => sum + z.affectedPopulation, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Эвакуировано</span>
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {criticalZones.reduce((sum, z) => sum + z.evacuated, 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Zones List */}
            <div className="space-y-4">
              {criticalZones.map((zone) => (
                <div 
                  key={zone.id}
                  className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                >
                  {/* Zone Header */}
                  <div className={`bg-gradient-to-r ${getLevelColor(zone.level)} text-white p-6`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <AlertTriangle className="w-6 h-6" />
                          <h3 className="text-2xl font-bold">{zone.name}</h3>
                        </div>
                        <p className="text-sm opacity-90">{zone.description}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getLevelBadge(zone.level)} bg-white`}>
                        {zone.levelText}
                      </span>
                    </div>
                  </div>

                  {/* Zone Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Water Levels */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span>📊</span>
                          <span>Уровень воды</span>
                        </h4>
                        <div className="bg-red-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Текущий уровень</p>
                          <p className="text-3xl font-bold text-red-600 mb-3">{zone.waterLevel} м</p>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 transition-all"
                              style={{ width: `${(zone.waterLevel / zone.threshold) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Порог: {zone.threshold} м
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">Активные датчики</p>
                          <div className="flex flex-wrap gap-2">
                            {zone.sensors.map(sensor => (
                              <span key={sensor} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                                📡 {sensor}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Population & Evacuation */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span>👥</span>
                          <span>Население</span>
                        </h4>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Затронуто людей</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {zone.affectedPopulation.toLocaleString()}
                          </p>
                        </div>
                        <div className={`rounded-lg p-4 ${getEvacuationStatusColor(zone.evacuationStatus)}`}>
                          <p className="text-sm font-semibold mb-2">
                            Статус эвакуации: {
                              zone.evacuationStatus === 'active' ? 'Активна' :
                              zone.evacuationStatus === 'prepared' ? 'Готовность' :
                              'Мониторинг'
                            }
                          </p>
                          {zone.evacuationStatus === 'active' && (
                            <>
                              <p className="text-2xl font-bold mb-2">
                                {zone.evacuated.toLocaleString()} чел.
                              </p>
                              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-500 transition-all"
                                  style={{ width: `${getProgressPercentage(zone.evacuated, zone.affectedPopulation)}%` }}
                                />
                              </div>
                              <p className="text-xs mt-2">
                                {getProgressPercentage(zone.evacuated, zone.affectedPopulation)}% эвакуировано
                              </p>
                            </>
                          )}
                          <p className="text-xs mt-2">
                            Пунктов размещения: {zone.shelters}
                          </p>
                        </div>
                      </div>

                      {/* Contacts & Actions */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span>📞</span>
                          <span>Контакты</span>
                        </h4>
                        <div className="space-y-2">
                          {zone.emergencyContacts.map((contact, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm font-semibold text-gray-900 mb-1">{contact.name}</p>
                              <a 
                                href={`tel:${contact.phone}`}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                              >
                                <Phone className="w-4 h-4" />
                                <span>{contact.phone}</span>
                              </a>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                            <MapPin className="w-5 h-5" />
                            <span>Показать на карте</span>
                          </button>
                          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Управление эвакуацией</span>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          Обновлено: {zone.lastUpdate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evacuations Tab */}
        {activeTab === 'evacuations' && (
          <div className="space-y-6">
            {evacuations.map((evac) => (
              <div key={evac.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                {/* Evacuation Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Navigation className="w-6 h-6 text-red-600" />
                      <h3 className="text-2xl font-bold text-gray-900">{evac.location}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Начало: {evac.startTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{evac.contactPhone}</span>
                      </span>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                    {evac.statusText}
                  </span>
                </div>

                {/* Progress */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Прогресс эвакуации</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {getProgressPercentage(evac.evacuated, evac.totalPeople)}%
                    </span>
                  </div>
                  <div className="h-4 bg-white rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                      style={{ width: `${getProgressPercentage(evac.evacuated, evac.totalPeople)}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Всего</p>
                      <p className="text-2xl font-bold text-gray-900">{evac.totalPeople}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Эвакуировано</p>
                      <p className="text-2xl font-bold text-green-600">{evac.evacuated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Осталось</p>
                      <p className="text-2xl font-bold text-orange-600">{evac.remaining}</p>
                    </div>
                  </div>
                </div>

                {/* Shelters */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Пункты временного размещения</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {evac.shelters.map((shelter, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <p className="font-semibold text-gray-900 mb-3">{shelter.name}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Вместимость:</span>
                            <span className="font-semibold">{shelter.capacity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Размещено:</span>
                            <span className="font-semibold text-blue-600">{shelter.occupied}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                shelter.occupied >= shelter.capacity ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${(shelter.occupied / shelter.capacity) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 text-right">
                            {shelter.occupied >= shelter.capacity ? 'Заполнено' : `Свободно: ${shelter.capacity - shelter.occupied}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Транспорт</p>
                      <p className="text-xl font-bold text-gray-900">🚌 {evac.transportUnits}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Медгруппы</p>
                      <p className="text-xl font-bold text-gray-900">🏥 {evac.medicalTeams}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Координатор</p>
                      <p className="text-sm font-semibold text-gray-900">{evac.coordinator}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Контакт</p>
                      <a href={`tel:${evac.contactPhone}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        {evac.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CriticalZonesPage;
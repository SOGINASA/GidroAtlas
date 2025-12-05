import React, { useState } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { AlertTriangle, Users, TrendingUp, MapPin, Phone } from 'lucide-react';

const CriticalZonesPage = () => {
  const [activeTab, setActiveTab] = useState('zones');

  const zones = [
    {
      id: 1,
      location: 'Павлодар, Река Иртыш',
      region: 'Павлодарская область',
      waterLevel: 8.2,
      threshold: 7.0,
      trend: 'rising',
      affectedPopulation: 15000,
      evacuated: 3500,
      status: 'critical',
      sensors: ['S-001', 'S-002', 'S-003']
    },
    {
      id: 2,
      location: 'Алматы, Малая Алматинка',
      region: 'Алматинская область',
      waterLevel: 4.5,
      threshold: 4.0,
      trend: 'rising',
      affectedPopulation: 8000,
      evacuated: 0,
      status: 'warning',
      sensors: ['S-045', 'S-046']
    },
    {
      id: 3,
      location: 'Уральск, Река Урал',
      region: 'ЗКО',
      waterLevel: 5.4,
      threshold: 4.5,
      trend: 'stable',
      affectedPopulation: 5000,
      evacuated: 0,
      status: 'monitoring',
      sensors: ['S-078', 'S-079']
    }
  ];

  const evacuations = [
    {
      id: 1,
      location: 'Затобольск',
      region: 'Северо-Казахстанская область',
      totalPeople: 2500,
      evacuated: 1800,
      inProgress: true,
      shelters: [
        { name: 'Школа №5', capacity: 500, occupied: 480 },
        { name: 'Спорткомплекс', capacity: 1000, occupied: 850 },
        { name: 'Гостиница "Северная"', capacity: 300, occupied: 250 }
      ],
      transport: { buses: 15, active: 8 },
      medicalTeams: 4,
      contact: '+7 (715) 234-56-78'
    },
    {
      id: 2,
      location: 'Лебяжье',
      region: 'Павлодарская область',
      totalPeople: 1200,
      evacuated: 700,
      inProgress: true,
      shelters: [
        { name: 'Культурный центр', capacity: 600, occupied: 450 },
        { name: 'Школа-интернат', capacity: 400, occupied: 250 }
      ],
      transport: { buses: 8, active: 5 },
      medicalTeams: 2,
      contact: '+7 (718) 345-67-89'
    }
  ];

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">⚠️ Критические зоны</h1>
            <p className="text-red-100">Мониторинг и управление эвакуациями</p>
          </div>
        </div>

        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Критич. зоны</p>
                  <p className="text-2xl font-bold text-red-600">{zones.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Под угрозой</p>
                  <p className="text-2xl font-bold">{zones.reduce((sum, z) => sum + z.affectedPopulation, 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Эвакуировано</p>
                  <p className="text-2xl font-bold text-green-600">{zones.reduce((sum, z) => sum + z.evacuated, 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚍</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Активных эвакуаций</p>
                  <p className="text-2xl font-bold text-blue-600">{evacuations.filter(e => e.inProgress).length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-lg border mb-6">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('zones')}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'zones' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'
                  }`}
                >
                  Критические зоны ({zones.length})
                </button>
                <button
                  onClick={() => setActiveTab('evacuations')}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'evacuations' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'
                  }`}
                >
                  Активные эвакуации ({evacuations.length})
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'zones' && (
                <div className="space-y-6">
                  {zones.map((zone) => (
                    <div key={zone.id} className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{zone.location}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {zone.region}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                          zone.status === 'critical' ? 'bg-red-600 text-white' :
                          zone.status === 'warning' ? 'bg-yellow-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {zone.status === 'critical' ? 'КРИТИЧНО' :
                           zone.status === 'warning' ? 'ПРЕДУПР.' : 'НАБЛЮДЕНИЕ'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600">Уровень воды</p>
                          <p className="text-2xl font-bold text-red-600">{zone.waterLevel}м</p>
                          <p className="text-xs text-gray-500">Порог: {zone.threshold}м</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600">Тренд</p>
                          <div className="flex items-center text-2xl font-bold">
                            {zone.trend === 'rising' && <><TrendingUp className="w-6 h-6 text-red-600 mr-2" /><span className="text-red-600">↑</span></>}
                            {zone.trend === 'stable' && <span className="text-gray-600">→</span>}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600">Под угрозой</p>
                          <p className="text-2xl font-bold text-orange-600">{zone.affectedPopulation.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">человек</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600">Эвакуировано</p>
                          <p className="text-2xl font-bold text-green-600">{zone.evacuated.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">человек</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Датчики: {zone.sensors.join(', ')}
                        </div>
                        <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
                          Начать эвакуацию
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'evacuations' && (
                <div className="space-y-6">
                  {evacuations.map((evac) => (
                    <div key={evac.id} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{evac.location}</h3>
                          <p className="text-sm text-gray-600">{evac.region}</p>
                        </div>
                        <span className="px-4 py-2 rounded-full bg-green-500 text-white font-bold text-sm animate-pulse">
                          В ПРОЦЕССЕ
                        </span>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Прогресс эвакуации</span>
                          <span className="text-lg font-bold">{Math.round((evac.evacuated/evac.totalPeople)*100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div 
                            className="bg-green-500 h-4 transition-all duration-500"
                            style={{ width: `${(evac.evacuated/evac.totalPeople)*100}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {evac.evacuated} из {evac.totalPeople} человек
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        {evac.shelters.map((shelter, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4">
                            <p className="font-semibold mb-2">{shelter.name}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Заполнено:</span>
                              <span className="font-bold">{shelter.occupied}/{shelter.capacity}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className={`h-2 rounded-full ${shelter.occupied/shelter.capacity > 0.9 ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${(shelter.occupied/shelter.capacity)*100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-2xl mb-1">🚍</p>
                          <p className="text-xl font-bold">{evac.transport.active}/{evac.transport.buses}</p>
                          <p className="text-xs text-gray-600">Автобусов</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-2xl mb-1">⚕️</p>
                          <p className="text-xl font-bold">{evac.medicalTeams}</p>
                          <p className="text-xs text-gray-600">Мед. бригад</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-2xl mb-1">📞</p>
                          <p className="text-sm font-bold">{evac.contact}</p>
                          <p className="text-xs text-gray-600">Контакт</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default CriticalZonesPage;
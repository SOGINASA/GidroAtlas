import React, { useState } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { Layers, Filter, MapPin, AlertTriangle, Droplets, Zap } from 'lucide-react';

const EmergencyMap = () => {
  const [activeLayer, setActiveLayer] = useState({
    waterbodies: true,
    facilities: true,
    critical: true,
    sensors: false
  });

  const [selectedRegion, setSelectedRegion] = useState('all');

  const toggleLayer = (layer) => {
    setActiveLayer(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Mock markers data
  const criticalZones = [
    { id: 1, name: 'Иртыш (Павлодар)', lat: 52.3, lng: 76.9, level: 'critical' },
    { id: 2, name: 'Урал (Уральск)', lat: 51.2, lng: 51.4, level: 'warning' }
  ];

  const waterBodies = [
    { id: 1, name: 'Озеро Балхаш', lat: 46.8, lng: 74.9, status: 'warning' },
    { id: 2, name: 'Капшагайское вдхр', lat: 43.9, lng: 77.1, status: 'safe' }
  ];

  const facilities = [
    { id: 1, name: 'Бухтарминская ГЭС', lat: 47.4, lng: 83.1, condition: 3 },
    { id: 2, name: 'Капшагайская ГЭС', lat: 43.9, lng: 77.1, condition: 2 }
  ];

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">🗺️ Карта мониторинга</h1>
            <p className="text-blue-100">Интерактивная карта водных ресурсов и ГТС Казахстана</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* Layers Control */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-blue-600" />
                  Слои карты
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeLayer.waterbodies}
                      onChange={() => toggleLayer('waterbodies')}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Водоёмы</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeLayer.facilities}
                      onChange={() => toggleLayer('facilities')}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">ГТС</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeLayer.critical}
                      onChange={() => toggleLayer('critical')}
                      className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium">Критические зоны</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeLayer.sensors}
                      onChange={() => toggleLayer('sensors')}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="w-5 h-5 flex items-center justify-center text-green-500">📡</span>
                    <span className="text-sm font-medium">Датчики</span>
                  </label>
                </div>
              </div>

              {/* Region Filter */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-blue-600" />
                  Фильтр региона
                </h3>
                
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Вся страна</option>
                  <option value="almaty">Алматинская обл.</option>
                  <option value="vko">ВКО</option>
                  <option value="pavlodar">Павлодарская обл.</option>
                  <option value="zko">ЗКО</option>
                  <option value="sko">СКО</option>
                </select>
              </div>

              {/* Legend */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Легенда</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>Критично</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span>Предупреждение</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Безопасно</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>Норма</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Статистика</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Водоёмов:</span>
                    <span className="font-bold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ГТС:</span>
                    <span className="font-bold">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Критич. зон:</span>
                    <span className="font-bold text-red-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Датчиков:</span>
                    <span className="font-bold text-green-600">234</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Map */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                {/* Map Placeholder */}
                <div className="relative w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 flex items-center justify-center">
                  
                  {/* Mock Map Content */}
                  <div className="absolute inset-0 p-8">
                    
                    {/* Critical Zones */}
                    {activeLayer.critical && criticalZones.map((zone) => (
                      <div
                        key={zone.id}
                        className="absolute w-16 h-16 bg-red-500/30 rounded-full animate-pulse cursor-pointer hover:scale-110 transition-transform"
                        style={{ 
                          top: `${zone.lat}%`, 
                          left: `${zone.lng}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <AlertTriangle className="w-8 h-8 text-red-700" />
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg">
                          {zone.name}
                        </div>
                      </div>
                    ))}

                    {/* Water Bodies */}
                    {activeLayer.waterbodies && waterBodies.map((wb) => (
                      <div
                        key={wb.id}
                        className="absolute cursor-pointer hover:scale-110 transition-transform"
                        style={{ 
                          top: `${wb.lat}%`, 
                          left: `${wb.lng}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          wb.status === 'critical' ? 'bg-red-500' :
                          wb.status === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}>
                          <Droplets className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                          {wb.name}
                        </div>
                      </div>
                    ))}

                    {/* Facilities */}
                    {activeLayer.facilities && facilities.map((fac) => (
                      <div
                        key={fac.id}
                        className="absolute cursor-pointer hover:scale-110 transition-transform"
                        style={{ 
                          top: `${fac.lat}%`, 
                          left: `${fac.lng}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${
                          fac.condition >= 4 ? 'bg-red-500' :
                          fac.condition === 3 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}>
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-purple-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                          {fac.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Map Info Overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">Карта Казахстана</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Интеграция с Leaflet будет добавлена
                    </p>
                  </div>

                  {/* Zoom Controls */}
                  <div className="absolute right-4 top-4 flex flex-col space-y-2">
                    <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 font-bold text-xl">
                      +
                    </button>
                    <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 font-bold text-xl">
                      −
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default EmergencyMap;
import React, { useState } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { MapPin, Layers, Satellite } from 'lucide-react';

const ExpertMapPage = () => {
  const [filters, setFilters] = useState({
    showSensors: true,
    showRiskZones: true,
    showSatellite: false
  });

  // Mock sensors count
  const sensorsCount = 24;

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-8 py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Карта мониторинга</h1>
          <p className="text-sm lg:text-base text-blue-100 mt-1">
            Интерактивная карта водных объектов Казахстана
          </p>
        </div>

        {/* Map Container */}
        <div className="relative h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)]">
          
          {/* Map Placeholder - здесь будет Leaflet */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-700">Интерактивная карта</p>
                <p className="text-sm text-gray-500 mt-2">Leaflet будет интегрирован здесь</p>
              </div>
            </div>
          </div>

          {/* Map Controls - Top Right */}
          <div className="absolute top-4 right-4 z-50 max-w-sm">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-3 lg:p-4 border border-gray-200">
              
              {/* Sensors Count */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Датчики</p>
                  <p className="text-base lg:text-lg font-bold text-gray-900">{sensorsCount} активных</p>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setFilters({ ...filters, showSensors: !filters.showSensors })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    filters.showSensors
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Датчики</span>
                  </span>
                  <div className={`w-4 h-4 rounded-full ${filters.showSensors ? 'bg-blue-600' : 'bg-gray-400'}`} />
                </button>
                
                <button
                  onClick={() => setFilters({ ...filters, showRiskZones: !filters.showRiskZones })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    filters.showRiskZones
                      ? 'bg-red-100 text-red-700 border-2 border-red-200'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Layers className="w-4 h-4" />
                    <span>Зоны риска</span>
                  </span>
                  <div className={`w-4 h-4 rounded-full ${filters.showRiskZones ? 'bg-red-600' : 'bg-gray-400'}`} />
                </button>

                <button
                  onClick={() => setFilters({ ...filters, showSatellite: !filters.showSatellite })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    filters.showSatellite
                      ? 'bg-green-100 text-green-700 border-2 border-green-200'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Satellite className="w-4 h-4" />
                    <span>Спутник</span>
                  </span>
                  <div className={`w-4 h-4 rounded-full ${filters.showSatellite ? 'bg-green-600' : 'bg-gray-400'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Legend - Bottom Right */}
          <div className="absolute bottom-4 right-4 z-50 hidden lg:block">
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 max-w-xs">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Легенда</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-700">Безопасно (&lt; 3.0м)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-xs text-gray-700">Внимание (3.0-4.5м)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-700">Опасно (4.5-6.0м)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-700"></div>
                  <span className="text-xs text-gray-700">Критично (&gt;= 6.0м)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertMapPage;
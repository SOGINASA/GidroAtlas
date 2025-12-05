import React, { useState } from 'react';
import MinimalHeader from '../../components/layout/MinimalHeader';
import BottomNavigation from '../../components/layout/BottomNavigation';
import EmergencyDesktopSidebar from '../../components/layout/EmergencyDesktopSidebar';
import EmergencyDesktopTopHeader from '../../components/layout/EmergencyDesktopTopHeader';
import MapView from '../../components/map/MapView';
import { WATER_LEVEL_THRESHOLDS } from '../../utils/constants';
import { useSensors } from '../../hooks/useSensors';

const EmergencyMap = () => {
  const { sensors } = useSensors();
  const [showSensors, setShowSensors] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showSatellite, setShowSatellite] = useState(false);
  const [showEvacuationPoints, setShowEvacuationPoints] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'danger': return 'bg-orange-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'critical': return 'Критично';
      case 'danger': return 'Опасно';
      case 'warning': return 'Внимание';
      default: return 'Норма';
    }
  };

  const filteredSensors = sensors?.filter(sensor =>
    sensor.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MinimalHeader title="Карта датчиков" showBack />
      </div>

      {/* Desktop Sidebar */}
      <EmergencyDesktopSidebar />

      {/* Desktop Top Header */}
      <EmergencyDesktopTopHeader />

      {/* Main Content */}
      <main className="pt-16 pb-24 lg:ml-72 lg:pt-24 lg:pb-8">
        <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-4 p-4">
          
          {/* Left Sidebar - Sensor List (Desktop only) */}
          <div className="hidden lg:block w-80 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex-shrink-0">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск датчиков..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Всего датчиков</p>
                  <p className="text-2xl font-bold text-gray-900">{sensors?.length || 5}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Критические</p>
                  <p className="text-2xl font-bold text-red-600">
                    {sensors?.filter(s => s.status === 'critical').length || 2}
                  </p>
                </div>
              </div>
            </div>

            {/* Sensor List */}
            <div className="overflow-y-auto" style={{ height: 'calc(100% - 200px)' }}>
              <div className="p-4 space-y-2">
                {filteredSensors.map((sensor) => (
                  <button
                    key={sensor.id}
                    onClick={() => setSelectedSensor(sensor)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedSensor?.id === sensor.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm mb-1">{sensor.location}</p>
                        <p className="text-xs text-gray-600">ID: {sensor.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(sensor.status)}`}>
                        {getStatusLabel(sensor.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-600">Уровень</p>
                        <p className="text-lg font-bold text-red-600">{sensor.waterLevel}м</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Обновлено</p>
                        <p className="text-xs font-medium text-gray-900">{sensor.lastUpdate}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Map Controls */}
              <div className="absolute top-4 left-4 right-4 lg:top-6 lg:left-20 lg:right-auto z-10 space-y-3">
                {/* Filter Buttons */}
                <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowSensors(!showSensors)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                        showSensors
                          ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Датчики</span>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                        {sensors?.length || 5}
                      </span>
                    </button>

                    <button
                      onClick={() => setShowRiskZones(!showRiskZones)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                        showRiskZones
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Зоны риска</span>
                    </button>

                    <button
                      onClick={() => setShowEvacuationPoints(!showEvacuationPoints)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                        showEvacuationPoints
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="hidden sm:inline">Пункты эвакуации</span>
                      <span className="sm:hidden">Эвакуация</span>
                    </button>

                    <button
                      onClick={() => setShowSatellite(!showSatellite)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                        showSatellite
                          ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Спутник</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Sensor Counter */}
                <div className="lg:hidden bg-white rounded-xl shadow-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Активных датчиков</p>
                        <p className="text-lg font-bold text-gray-900">{sensors?.length || 5}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Критические</p>
                      <p className="text-lg font-bold text-red-600">
                        {sensors?.filter(s => s.status === 'critical').length || 2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200 z-10">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Уровень опасности</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-700">Безопасно (&lt; {WATER_LEVEL_THRESHOLDS.SAFE.toFixed(1)}м)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-700">Внимание ({WATER_LEVEL_THRESHOLDS.SAFE.toFixed(1)}-{WATER_LEVEL_THRESHOLDS.ATTENTION.toFixed(1)}м)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-gray-700">Опасно ({WATER_LEVEL_THRESHOLDS.ATTENTION.toFixed(1)}-{WATER_LEVEL_THRESHOLDS.DANGER.toFixed(1)}м)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-700">Критично (&gt;= {WATER_LEVEL_THRESHOLDS.CRITICAL.toFixed(1)}м)</span>
                  </div>
                </div>
              </div>

              {/* Map */}
              <MapView
                showSensors={showSensors}
                showRiskZones={showRiskZones}
                showSatellite={showSatellite}
                showEvacuationPoints={showEvacuationPoints}
                selectedSensor={selectedSensor}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default EmergencyMap;
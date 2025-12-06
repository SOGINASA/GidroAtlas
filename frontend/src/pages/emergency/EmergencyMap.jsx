import React, { useState, useEffect, useRef } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { 
  Layers, 
  Filter, 
  MapPin, 
  AlertTriangle, 
  Droplets, 
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass
} from 'lucide-react';

// API Configuration
const API_KEY = '6f92f492-dc8f-4a23-a6ab-3addf4714b98';
const API_BASE_URL = 'https://api.maptiler.com/maps';

// Leaflet Map Component
const LeafletMap = ({ activeLayer, selectedRegion, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Mock data
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

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current && window.L) {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [activeLayer]);

  const initializeMap = () => {
    const L = window.L;
    
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [48.0196, 66.9237],
      zoom: 6,
      zoomControl: false
    });

    // Добавление базового слоя с MapTiler API
    L.tileLayer(`${API_BASE_URL}/streets-v2/{z}/{x}/{y}.png?key=${API_KEY}`, {
      attribution: '© MapTiler © OpenStreetMap contributors',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1
    }).addTo(mapInstanceRef.current);
  };

  const updateMarkers = () => {
    if (!window.L || !mapInstanceRef.current) return;
    
    const L = window.L;
    
    // Удаление старых маркеров
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Критические зоны
    if (activeLayer.critical) {
      criticalZones.forEach(zone => {
        const color = zone.level === 'critical' ? '#EF4444' : '#F59E0B';
        
        const marker = L.marker([zone.lat, zone.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative">
                <div class="w-16 h-16 rounded-full flex items-center justify-center animate-pulse" 
                     style="background-color: ${color}40">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center" 
                       style="background-color: ${color}">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            `,
            className: 'custom-critical-marker',
            iconSize: [64, 64],
            iconAnchor: [32, 32]
          })
        });

        marker.bindPopup(`
          <div class="p-3">
            <h3 class="font-bold text-lg mb-2 text-red-700">${zone.name}</h3>
            <p class="text-sm mb-2">Уровень: ${zone.level === 'critical' ? 'Критический' : 'Предупреждение'}</p>
            <button class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold">
              Подробнее
            </button>
          </div>
        `);

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick({ type: 'critical', data: zone });
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    // Водоёмы
    if (activeLayer.waterbodies) {
      waterBodies.forEach(wb => {
        const colors = {
          critical: '#EF4444',
          warning: '#F59E0B',
          safe: '#3B82F6'
        };
        const color = colors[wb.status] || '#3B82F6';

        const marker = L.marker([wb.lat, wb.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative">
                <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white" 
                     style="background-color: ${color}">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                  </svg>
                </div>
              </div>
            `,
            className: 'custom-waterbody-marker',
            iconSize: [48, 48],
            iconAnchor: [24, 24]
          })
        });

        marker.bindPopup(`
          <div class="p-3">
            <h3 class="font-bold text-lg mb-2">${wb.name}</h3>
            <p class="text-sm mb-2">Статус: ${
              wb.status === 'critical' ? 'Критический' :
              wb.status === 'warning' ? 'Предупреждение' : 'Безопасно'
            }</p>
            <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold">
              Подробнее
            </button>
          </div>
        `);

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick({ type: 'waterbody', data: wb });
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    // ГТС
    if (activeLayer.facilities) {
      facilities.forEach(fac => {
        const colors = {
          5: '#EF4444',
          4: '#F97316',
          3: '#F59E0B',
          2: '#84CC16',
          1: '#10B981'
        };
        const color = colors[fac.condition] || '#10B981';

        const marker = L.marker([fac.lat, fac.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg border-2 border-white" 
                     style="background-color: ${color}">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
            `,
            className: 'custom-facility-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          })
        });

        marker.bindPopup(`
          <div class="p-3">
            <h3 class="font-bold text-lg mb-2">${fac.name}</h3>
            <p class="text-sm mb-2">Категория: ${fac.condition}</p>
            <button class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-semibold">
              Подробнее
            </button>
          </div>
        `);

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick({ type: 'facility', data: fac });
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }
  };

  const zoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([48.0196, 66.9237], 6);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0 bg-gray-200" />
      
      {!window.L && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl max-w-md">
            <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-700 text-lg font-semibold mb-2">Загрузка карты...</p>
            <p className="text-gray-500 text-sm mb-4">
              Подключите Leaflet для отображения интерактивной карты
            </p>
            <div className="text-left bg-gray-100 rounded-lg p-4 text-xs font-mono">
              <p className="text-blue-600 mb-1">{`<!-- В index.html -->`}</p>
              <p className="text-gray-700 mb-2">{`<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />`}</p>
              <p className="text-gray-700">{`<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>`}</p>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute right-4 top-4 flex flex-col space-y-2 z-[1000]">
        <button 
          onClick={zoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button 
          onClick={zoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button 
          onClick={resetView}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Compass className="w-5 h-5 text-gray-700" />
        </button>
        <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Map Info Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000]">
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="font-semibold">Карта мониторинга МЧС</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          MapTiler API интегрирован
        </p>
      </div>
    </div>
  );
};

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

  const handleMarkerClick = (markerData) => {
    console.log('Marker clicked:', markerData);
    // Здесь можно открыть модальное окно с деталями
  };

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <MapPin className="w-8 h-8 mr-3" />
              Карта мониторинга
            </h1>
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
                    <Compass className="w-5 h-5 text-green-500" />
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
                <LeafletMap 
                  activeLayer={activeLayer}
                  selectedRegion={selectedRegion}
                  onMarkerClick={handleMarkerClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default EmergencyMap;
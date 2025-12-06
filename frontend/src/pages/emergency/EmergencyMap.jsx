import React, { useState, useEffect, useRef } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { 
  Layers, 
  Filter, 
  MapPin, 
  AlertTriangle, 
  Droplets, 
  Zap,
  Compass
} from 'lucide-react';

// Mock данные - расширенные и реалистичные
const MOCK_WATER_BODIES = [
  { id: 1, name: 'Озеро Балхаш', lat: 46.8, lng: 74.9, status: 'warning', condition: 3, region: 'Карагандинская обл.' },
  { id: 2, name: 'Капшагайское вдхр', lat: 43.9, lng: 77.1, status: 'safe', condition: 2, region: 'Алматинская обл.' },
  { id: 3, name: 'Бухтарминское вдхр', lat: 47.4, lng: 83.1, status: 'critical', condition: 5, region: 'ВКО' },
  { id: 4, name: 'Шардаринское вдхр', lat: 41.2, lng: 68.3, status: 'safe', condition: 2, region: 'Туркестанская обл.' },
  { id: 5, name: 'Жайсан (озеро)', lat: 47.5, lng: 84.8, status: 'warning', condition: 3, region: 'ВКО' },
  { id: 6, name: 'Алаколь (озеро)', lat: 46.2, lng: 81.8, status: 'safe', condition: 1, region: 'Алматинская обл.' },
  { id: 7, name: 'Тенгиз (озеро)', lat: 50.5, lng: 69.0, status: 'warning', condition: 4, region: 'Карагандинская обл.' },
  { id: 8, name: 'Сорбулак (вдхр)', lat: 43.4, lng: 77.3, status: 'safe', condition: 2, region: 'Алматинская обл.' }
];

const MOCK_FACILITIES = [
  { id: 1, name: 'Бухтарминская ГЭС', lat: 47.4, lng: 83.1, condition: 3, region: 'ВКО', type: 'ГЭС' },
  { id: 2, name: 'Капшагайская ГЭС', lat: 43.9, lng: 77.1, condition: 2, region: 'Алматинская обл.', type: 'ГЭС' },
  { id: 3, name: 'Шардаринская ГЭС', lat: 41.2, lng: 68.3, condition: 4, region: 'Туркестанская обл.', type: 'ГЭС' },
  { id: 4, name: 'Усть-Каменогорская ГЭС', lat: 49.9, lng: 82.6, condition: 2, region: 'ВКО', type: 'ГЭС' },
  { id: 5, name: 'Плотина Коктерек', lat: 43.2, lng: 76.8, condition: 5, region: 'Алматинская обл.', type: 'Плотина' },
  { id: 6, name: 'Плотина Сорбулак', lat: 43.4, lng: 77.3, condition: 1, region: 'Алматинская обл.', type: 'Плотина' }
];

const MOCK_CRITICAL_ZONES = [
  { id: 1, name: 'Иртыш (Павлодар)', lat: 52.3, lng: 76.9, level: 'critical', description: 'Высокий уровень воды' },
  { id: 2, name: 'Урал (Уральск)', lat: 51.2, lng: 51.4, level: 'warning', description: 'Повышенный уровень' },
  { id: 3, name: 'Сырдарья (Кызылорда)', lat: 44.8, lng: 65.5, level: 'critical', description: 'Критический уровень' }
];

// Leaflet Map Component
const LeafletMap = ({ activeLayer, selectedRegion, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current && window.L && !loading) {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading]);

  useEffect(() => {
    if (mapInstanceRef.current && !loading) {
      updateMarkers();
    }
  }, [activeLayer, loading, selectedRegion]);

  const initializeMap = () => {
    const L = window.L;
    
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [48.0196, 66.9237],
      zoom: 6,
      zoomControl: false
    });

    // БЕСПЛАТНЫЕ OpenStreetMap тайлы - БЕЗ API КЛЮЧЕЙ!
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    // Добавляем кастомные контролы зума
    const zoomControl = L.control({ position: 'topright' });
    zoomControl.onAdd = function() {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      div.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <button class="zoom-in-btn w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 transition-colors">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
          <button class="zoom-out-btn w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
            </svg>
          </button>
        </div>
      `;
      
      L.DomEvent.disableClickPropagation(div);
      
      div.querySelector('.zoom-in-btn').onclick = () => {
        mapInstanceRef.current.zoomIn();
      };
      
      div.querySelector('.zoom-out-btn').onclick = () => {
        mapInstanceRef.current.zoomOut();
      };
      
      return div;
    };
    zoomControl.addTo(mapInstanceRef.current);

    // Инициализируем маркеры сразу
    updateMarkers();
  };

  const filterByRegion = (items) => {
    if (selectedRegion === 'all') return items;
    return items.filter(item => 
      item.region && item.region.toLowerCase().includes(selectedRegion.toLowerCase())
    );
  };

  const updateMarkers = () => {
    if (!window.L || !mapInstanceRef.current) return;
    
    const L = window.L;
    
    // Удаление старых маркеров
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Критические зоны
    if (activeLayer.critical) {
      const zones = filterByRegion(MOCK_CRITICAL_ZONES);
      zones.forEach(zone => {
        const color = zone.level === 'critical' ? '#EF4444' : '#F59E0B';
        
        const marker = L.marker([zone.lat, zone.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative">
                <div class="w-16 h-16 rounded-full flex items-center justify-center animate-pulse" 
                     style="background-color: ${color}40">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" 
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
          <div class="p-3 min-w-[200px]">
            <div class="flex items-center mb-2">
              <div class="w-3 h-3 rounded-full animate-pulse mr-2" style="background-color: ${color}"></div>
              <h3 class="font-bold text-lg">${zone.name}</h3>
            </div>
            <p class="text-sm text-gray-600 mb-2">${zone.description}</p>
            <div class="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
              <p class="text-xs font-semibold text-red-800">
                ${zone.level === 'critical' ? '⚠️ КРИТИЧЕСКИЙ УРОВЕНЬ' : '⚡ ПРЕДУПРЕЖДЕНИЕ'}
              </p>
            </div>
            <button onclick="alert('Открываем детали зоны...')" class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold transition-colors">
              Подробнее
            </button>
          </div>
        `, { maxWidth: 250 });

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick({ type: 'critical', data: zone });
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    // Водоёмы
    if (activeLayer.waterbodies) {
      const waterBodies = filterByRegion(MOCK_WATER_BODIES);
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
                <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-3 border-white" 
                     style="background-color: ${color}">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"></path>
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
          <div class="p-3 min-w-[220px]">
            <h3 class="font-bold text-lg mb-1">${wb.name}</h3>
            <p class="text-xs text-gray-500 mb-3">${wb.region}</p>
            <div class="space-y-2 mb-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Состояние:</span>
                <span class="px-2 py-1 rounded-full text-xs font-semibold" style="background-color: ${color}20; color: ${color}">
                  Категория ${wb.condition}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Статус:</span>
                <span class="text-sm font-medium">
                  ${wb.status === 'critical' ? '🔴 Критично' : wb.status === 'warning' ? '🟡 Внимание' : '🟢 Норма'}
                </span>
              </div>
            </div>
            <button onclick="alert('Открываем детали водоёма...')" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors">
              Подробнее
            </button>
          </div>
        `, { maxWidth: 250 });

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick({ type: 'waterbody', data: wb });
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    // ГТС (Гидротехнические сооружения)
    if (activeLayer.facilities) {
      const facilities = filterByRegion(MOCK_FACILITIES);
      facilities.forEach(facility => {
        const conditionColors = {
          1: '#10B981',
          2: '#84CC16',
          3: '#F59E0B',
          4: '#F97316',
          5: '#EF4444'
        };
        const color = conditionColors[facility.condition] || '#6B7280';

        const marker = L.marker([facility.lat, facility.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg border-3 border-white" 
                     style="background-color: ${color}">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
            `,
            className: 'custom-facility-marker',
            iconSize: [48, 48],
            iconAnchor: [24, 24]
          })
        });

        marker.bindPopup(`
          <div class="p-3 min-w-[220px]">
            <h3 class="font-bold text-lg mb-1">${facility.name}</h3>
            <p class="text-xs text-gray-500 mb-3">${facility.region}</p>
            <div class="space-y-2 mb-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Тип:</span>
                <span class="text-sm font-medium">${facility.type}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Категория:</span>
                <span class="px-2 py-1 rounded-full text-xs font-semibold text-white" style="background-color: ${color}">
                  ${facility.condition}
                </span>
              </div>
            </div>
            <button onclick="alert('Открываем детали ГТС...')" class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-semibold transition-colors">
              Подробнее
            </button>
          </div>
        `, { maxWidth: 250 });

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick({ type: 'facility', data: facility });
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Загрузка карты...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
};

const EmergencyMap = () => {
  const [activeLayer, setActiveLayer] = useState({
    waterbodies: true,
    facilities: true,
    critical: true,
    sensors: false
  });

  const [selectedRegion, setSelectedRegion] = useState('all');

  // Считаем статистику из mock данных
  const stats = {
    waterbodies: MOCK_WATER_BODIES.length,
    facilities: MOCK_FACILITIES.length,
    critical: MOCK_WATER_BODIES.filter(wb => wb.status === 'critical').length + MOCK_CRITICAL_ZONES.length,
    sensors: 234
  };

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
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <MapPin className="w-8 h-8 mr-3" />
              Карта мониторинга МЧС
            </h1>
            <p className="text-red-100">Интерактивная карта водных ресурсов и ГТС Казахстана</p>
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
                  <Layers className="w-5 h-5 mr-2 text-red-600" />
                  Слои карты
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.waterbodies}
                      onChange={() => toggleLayer('waterbodies')}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <Droplets className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Водоёмы ({MOCK_WATER_BODIES.length})</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.facilities}
                      onChange={() => toggleLayer('facilities')}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <Zap className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">ГТС ({MOCK_FACILITIES.length})</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.critical}
                      onChange={() => toggleLayer('critical')}
                      className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <AlertTriangle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Критические зоны ({MOCK_CRITICAL_ZONES.length})</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.sensors}
                      onChange={() => toggleLayer('sensors')}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <Compass className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Датчики</span>
                  </label>
                </div>
              </div>

              {/* Region Filter */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-red-600" />
                  Фильтр региона
                </h3>
                
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                >
                  <option value="all">Вся страна</option>
                  <option value="алматинская">Алматинская обл.</option>
                  <option value="вко">ВКО</option>
                  <option value="карагандинская">Карагандинская обл.</option>
                  <option value="павлодарская">Павлодарская обл.</option>
                  <option value="туркестанская">Туркестанская обл.</option>
                </select>
              </div>

              {/* Legend */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Легенда</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>Критично (Кат. 5)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span>Опасно (Кат. 4)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span>Внимание (Кат. 3)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                    <span>Хорошо (Кат. 2)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Отлично (Кат. 1)</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Статистика</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Водоёмов:</span>
                    <span className="font-bold text-lg">{stats.waterbodies}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ГТС:</span>
                    <span className="font-bold text-lg">{stats.facilities}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Критич. зон:</span>
                    <span className="font-bold text-lg text-red-600">{stats.critical}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Датчиков:</span>
                    <span className="font-bold text-lg text-green-600">{stats.sensors}</span>
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
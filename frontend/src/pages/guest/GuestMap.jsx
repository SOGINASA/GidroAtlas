import React, { useState, useEffect, useRef } from 'react';
import GuestLayout from '../../components/navigation/guest/GuestLayout';
import { 
  MapPin, 
  Droplets, 
  Zap, 
  X, 
  Info, 
  AlertCircle, 
  Loader2,
  Layers,
  Filter as FilterIcon,
  Compass,
  AlertTriangle
} from 'lucide-react';

// =====================
// CONFIG / HELPERS
// =====================

// API Integration
import { getAllMapData } from '../../services/mapApi';

// Мок критических зон (как на странице МЧС)
const MOCK_CRITICAL_ZONES = [
  { id: 1, name: 'Иртыш (Павлодар)', lat: 52.3, lng: 76.9, level: 'critical', description: 'Высокий уровень воды', region: 'Павлодарская обл.' },
  { id: 2, name: 'Урал (Уральск)', lat: 51.2, lng: 51.4, level: 'warning', description: 'Повышенный уровень', region: 'ЗКО' },
  { id: 3, name: 'Сырдарья (Кызылорда)', lat: 44.8, lng: 65.5, level: 'critical', description: 'Критический уровень', region: 'Кызылординская обл.' }
];

// Мок датчиков (для слоя "Датчики")
const MOCK_SENSORS = [
  { id: 1, name: 'Датчик #101', lat: 49.9, lng: 82.6, status: 'online', region: 'ВКО', type: 'level' },
  { id: 2, name: 'Датчик #102', lat: 46.8, lng: 74.9, status: 'online', region: 'Алматинская обл.', type: 'quality' },
  { id: 3, name: 'Датчик #103', lat: 51.2, lng: 71.4, status: 'offline', region: 'Акмолинская обл.', type: 'level' },
  { id: 4, name: 'Датчик #104', lat: 43.3, lng: 76.9, status: 'online', region: 'Алматы', type: 'flow' },
];

// Цвета и подписи категорий состояния
const getConditionColor = (condition) => {
  const colors = { 
    1: '#10B981', // зелёный
    2: '#84CC16', // лаймовый
    3: '#F59E0B', // жёлто-оранжевый
    4: '#F97316', // оранжевый
    5: '#EF4444'  // красный
  };
  return colors[condition] || colors[3];
};

const getConditionLabel = (condition) => {
  const labels = { 
    1: 'Отличное', 
    2: 'Хорошее', 
    3: 'Удовлетворительное', 
    4: 'Плохое', 
    5: 'Критическое' 
  };
  return labels[condition] || 'Неизвестно';
};

const getTypeLabel = (type) => {
  const labels = {
    river: 'Река',
    lake: 'Озеро',
    reservoir: 'Водохранилище',
    canal: 'Канал',
    hydropower: 'ГЭС',
    dam: 'Плотина',
    lock: 'Шлюз',
    pumping_station: 'Насосная станция'
  };
  return labels[type] || type;
};

// Вычисляем статус по категории (для красивой подписи)
const getStatusFromCondition = (condition) => {
  if (condition >= 5) return 'critical';
  if (condition === 4) return 'warning';
  if (condition <= 2) return 'safe';
  return 'warning';
};

// =====================
// LEAFLET MAP COMPONENT
// =====================

const GuestLeafletMap = ({
  activeLayer,
  selectedRegion,
  waterBodies,
  facilities,
  criticalZones,
  sensors,
  onObjectClick,
  loading
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Инициализация карты
  useEffect(() => {
    if (!loading && mapRef.current && !mapInstanceRef.current && window.L) {
      const L = window.L;

      mapInstanceRef.current = L.map(mapRef.current, {
        center: [48.0196, 66.9237], // Казахстан
        zoom: 6,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Кастомные кнопки зума (как на EmergencyMap)
      const zoomControl = L.control({ position: 'topright' });
      zoomControl.onAdd = function () {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
          <div class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <button class="guest-zoom-in w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 transition-colors">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
            <button class="guest-zoom-out w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
          </div>
        `;

        L.DomEvent.disableClickPropagation(div);

        div.querySelector('.guest-zoom-in').onclick = () => {
          mapInstanceRef.current && mapInstanceRef.current.zoomIn();
        };

        div.querySelector('.guest-zoom-out').onclick = () => {
          mapInstanceRef.current && mapInstanceRef.current.zoomOut();
        };

        return div;
      };
      zoomControl.addTo(mapInstanceRef.current);

      updateMarkers();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Обновление маркеров при смене данных / фильтров
  useEffect(() => {
    if (mapInstanceRef.current && !loading) {
      updateMarkers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waterBodies, facilities, criticalZones, sensors, activeLayer, selectedRegion, loading]);

  const filterByRegion = (items) => {
    if (selectedRegion === 'all') return items;
    return (items || []).filter(item =>
      item.region && item.region.toLowerCase().includes(selectedRegion.toLowerCase())
    );
  };

  const updateMarkers = () => {
    if (!window.L || !mapInstanceRef.current) return;

    const L = window.L;

    // Сначала удаляем старые маркеры
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // ---------- Критические зоны ----------
    if (activeLayer.critical) {
      const zones = filterByRegion(criticalZones || []);
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
            className: 'guest-critical-marker',
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
            <button onclick="alert('Для детальной информации войдите в систему')" class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold transition-colors">
              Подробнее
            </button>
          </div>
        `, { maxWidth: 260 });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    // ---------- Водоёмы ----------
    if (activeLayer.waterbodies) {
      const filteredWaterBodies = filterByRegion(waterBodies || []);
      filteredWaterBodies.forEach(wb => {
        if (!wb.lat || !wb.lng) return;

        const condition = wb.condition || 3;
        const color = getConditionColor(condition);
        const status = getStatusFromCondition(condition);

        const statusLabel =
          status === 'critical'
            ? '🔴 Критично'
            : status === 'warning'
            ? '🟡 Внимание'
            : '🟢 Норма';

        const marker = L.marker([wb.lat, wb.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative">
                <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white" 
                     style="background-color: ${color}">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"></path>
                  </svg>
                </div>
              </div>
            `,
            className: 'guest-waterbody-marker',
            iconSize: [48, 48],
            iconAnchor: [24, 24]
          })
        });

        marker.bindPopup(`
          <div class="p-3 min-w-[220px]">
            <h3 class="font-bold text-lg mb-1">${wb.name}</h3>
            <p class="text-xs text-gray-500 mb-3">${wb.region || 'Регион не указан'}</p>
            <div class="space-y-2 mb-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Состояние:</span>
                <span class="px-2 py-1 rounded-full text-xs font-semibold" 
                      style="background-color: ${color}20; color: ${color}">
                  Категория ${condition}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Статус:</span>
                <span class="text-sm font-medium">${statusLabel}</span>
              </div>
            </div>
            <button onclick="alert('Для детальной информации войдите в систему')" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors">
              Подробнее
            </button>
          </div>
        `, { maxWidth: 260 });

        marker.on('click', () => {
          if (onObjectClick) onObjectClick(wb, 'waterbody');
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    // ---------- ГТС ----------
    if (activeLayer.facilities) {
      const filteredFacilities = filterByRegion(facilities || []);
      filteredFacilities.forEach(f => {
        if (!f.lat || !f.lng) return;

        const condition = f.condition || 3;
        const color = getConditionColor(condition);

        const marker = L.marker([f.lat, f.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg border-4 border-white" 
                     style="background-color: ${color}">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
            `,
            className: 'guest-facility-marker',
            iconSize: [48, 48],
            iconAnchor: [24, 24]
          })
        });

        marker.bindPopup(`
          <div class="p-3 min-w-[220px]">
            <h3 class="font-bold text-lg mb-1">${f.name}</h3>
            <p class="text-xs text-gray-500 mb-3">${f.region || 'Регион не указан'}</p>
            <div class="space-y-2 mb-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Тип:</span>
                <span class="text-sm font-medium">${getTypeLabel(f.type)}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Категория:</span>
                <span class="px-2 py-1 rounded-full text-xs font-semibold text-white" 
                      style="background-color: ${color}">
                  ${condition}
                </span>
              </div>
              ${
                f.capacity
                  ? `<div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">Мощность:</span>
                      <span class="text-sm font-semibold">${f.capacity} МВт</span>
                    </div>`
                  : ''
              }
            </div>
            <button onclick="alert('Для детальной информации войдите в систему')" class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-semibold transition-colors">
              Подробнее
            </button>
          </div>
        `, { maxWidth: 260 });

        marker.on('click', () => {
          if (onObjectClick) onObjectClick(f, 'facility');
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    // ---------- Датчики ----------
    if (activeLayer.sensors) {
      const filteredSensors = filterByRegion(sensors || []);
      filteredSensors.forEach(s => {
        if (!s.lat || !s.lng) return;

        const isOnline = s.status === 'online';
        const color = isOnline ? '#22C55E' : '#6B7280';

        const marker = L.marker([s.lat, s.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white" 
                     style="background-color: ${color}">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
              </div>
            `,
            className: 'guest-sensor-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          })
        });

        marker.bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-lg mb-1">${s.name}</h3>
            <p class="text-xs text-gray-500 mb-2">${s.region || 'Регион не указан'}</p>
            <div class="space-y-2 mb-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Тип:</span>
                <span class="text-sm font-medium">
                  ${s.type === 'level' ? 'Уровень воды' : s.type === 'flow' ? 'Расход' : 'Качество воды'}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Статус:</span>
                <span class="text-sm font-semibold">
                  ${isOnline ? '🟢 Онлайн' : '⚫ Офлайн'}
                </span>
              </div>
            </div>
            <button onclick="alert('Подробные данные датчика доступны авторизованным пользователям')" class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold transition-colors">
              Открыть данные
            </button>
          </div>
        `, { maxWidth: 240 });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }
  };

  return <div ref={mapRef} className="w-full h-full" />;
};

// =====================
// MAIN PAGE COMPONENT
// =====================

const GuestMapPage = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [showLegendOverlay, setShowLegendOverlay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waterBodies, setWaterBodies] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [criticalZones] = useState(MOCK_CRITICAL_ZONES);
  const [sensors] = useState(MOCK_SENSORS);

  const [activeLayer, setActiveLayer] = useState({
    waterbodies: true,
    facilities: true,
    critical: true,
    sensors: true
  });

  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загрузка всех данных через API
      const data = await getAllMapData({ region: selectedRegion });

      // Фильтруем объекты с валидными координатами
      const waterBodies = (data.waterBodies || []).filter(wb => {
        const lat = wb.coordinates?.lat || wb.lat || wb.latitude;
        const lng = wb.coordinates?.lng || wb.lng || wb.longitude;
        return lat && lng;
      }).map(wb => ({
        ...wb,
        lat: wb.coordinates?.lat || wb.lat || wb.latitude,
        lng: wb.coordinates?.lng || wb.lng || wb.longitude,
        condition: wb.condition || wb.technicalCondition || 3
      }));

      const facilities = (data.facilities || []).filter(fac => {
        const lat = fac.coordinates?.lat || fac.lat || fac.latitude;
        const lng = fac.coordinates?.lng || fac.lng || fac.longitude;
        return lat && lng;
      }).map(fac => ({
        ...fac,
        lat: fac.coordinates?.lat || fac.lat || fac.latitude,
        lng: fac.coordinates?.lng || fac.lng || fac.longitude,
        condition: fac.condition || fac.technicalCondition || 3
      }));

      setWaterBodies(waterBodies);
      setFacilities(facilities);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить данные с сервера.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLayer = (layer) => {
    setActiveLayer(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleObjectClick = async (object, objectType) => {
    // Просто показываем базовую информацию (детали уже загружены)
    setSelectedObject({ ...object, objectType });
  };

  // Статистика
  const totalWaterBodies = waterBodies.length;
  const totalFacilities = facilities.length;
  const totalCriticalZones =
    criticalZones.length +
    waterBodies.filter(wb => (wb.condition || 3) >= 4).length +
    facilities.filter(f => (f.condition || 3) >= 4).length;
  const totalSensors = sensors.length;

  const goodObjectsCount = [...waterBodies, ...facilities].filter(o => (o.condition || 3) <= 2).length;
  const needAttentionCount = [...waterBodies, ...facilities].filter(o => (o.condition || 3) >= 4).length;

  return (
    <GuestLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">Карта объектов</h1>
            </div>
            <p className="text-sm lg:text-base text-gray-300">
              Интерактивная карта водоёмов, гидротехнических сооружений и датчиков мониторинга
            </p>
          </div>
        </div>

        {/* Main Content: Sidebar + Map */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-1 space-y-4">
              {/* Layers Control */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-gray-700" />
                  Слои карты
                </h3>

                <div className="space-y-3 text-sm">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.waterbodies}
                      onChange={() => toggleLayer('waterbodies')}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <Droplets className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium flex-1">
                      Водоёмы <span className="text-gray-400 ml-1">({totalWaterBodies})</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.facilities}
                      onChange={() => toggleLayer('facilities')}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <Zap className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium flex-1">
                      ГТС <span className="text-gray-400 ml-1">({totalFacilities})</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.critical}
                      onChange={() => toggleLayer('critical')}
                      className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <AlertTriangle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium flex-1">
                      Критические зоны <span className="text-gray-400 ml-1">({criticalZones.length})</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.sensors}
                      onChange={() => toggleLayer('sensors')}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <Compass className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium flex-1">
                      Датчики <span className="text-gray-400 ml-1">({totalSensors})</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Region Filter */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <FilterIcon className="w-5 h-5 mr-2 text-gray-700" />
                  Фильтр региона
                </h3>

                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition-all text-sm"
                >
                  <option value="all">Вся страна</option>
                  <option value="алматинская">Алматинская обл.</option>
                  <option value="вко">ВКО</option>
                  <option value="карагандинская">Карагандинская обл.</option>
                  <option value="павлодарская">Павлодарская обл.</option>
                  <option value="кызылординская">Кызылординская обл.</option>
                  <option value="зко">ЗКО</option>
                  <option value="акмолинская">Акмолинская обл.</option>
                  <option value="алматы">Алматы</option>
                </select>
              </div>

              {/* Legend */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Легенда категорий</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                    <span>Критично (Кат. 5)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full" />
                    <span>Опасно (Кат. 4)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                    <span>Внимание (Кат. 3)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-lime-500 rounded-full" />
                    <span>Хорошо (Кат. 2)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full" />
                    <span>Отлично (Кат. 1)</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats (дублируем, но в компактном виде в сайдбаре) */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Статистика</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Водоёмов:</span>
                    <span className="font-bold text-lg">{totalWaterBodies}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ГТС:</span>
                    <span className="font-bold text-lg">{totalFacilities}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Критич. объектов:</span>
                    <span className="font-bold text-lg text-red-600">{totalCriticalZones}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Датчиков:</span>
                    <span className="font-bold text-lg text-green-600">{totalSensors}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: MAP */}
            <div className="lg:col-span-3">
              <div
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative"
                style={{ height: 'calc(100vh - 220px)' }}
              >
                {/* Loading Overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-white/80 z-30 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">Загрузка данных...</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-red-50 border border-red-200 text-red-800 px-6 py-3 rounded-xl shadow-lg max-w-md">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Leaflet Map */}
                <GuestLeafletMap
                  activeLayer={activeLayer}
                  selectedRegion={selectedRegion}
                  waterBodies={waterBodies}
                  facilities={facilities}
                  criticalZones={criticalZones}
                  sensors={sensors}
                  onObjectClick={handleObjectClick}
                  loading={loading}
                />

                {/* Доп. легенда поверх карты (как раньше) */}
                {showLegendOverlay && (
                  <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-xl p-4 max-w-xs z-20">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">Обозначения</h3>
                      <button
                        onClick={() => setShowLegendOverlay(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span>Водоёмы</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                        <span>ГТС</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span>Критические зоны</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Compass className="w-5 h-5 text-green-500" />
                        <span>Датчики</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Техническое состояние:</p>
                        {[1, 2, 3, 4, 5].map((cat) => (
                          <div key={cat} className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: getConditionColor(cat) }}
                              />
                              <span className="text-xs">Кат. {cat}</span>
                            </div>
                            <span className="text-xs text-gray-500">{getConditionLabel(cat)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!showLegendOverlay && (
                  <button
                    onClick={() => setShowLegendOverlay(true)}
                    className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 z-20 flex items-center space-x-2"
                  >
                    <Info className="w-5 h-5" />
                    <span>Легенда</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar (как у тебя было) */}
        <div className="bg-white border-t border-gray-200 px-4 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : totalWaterBodies}
              </p>
              <p className="text-sm text-gray-600">Водоёмов</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : totalFacilities}
              </p>
              <p className="text-sm text-gray-600">ГТС</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : goodObjectsCount}
              </p>
              <p className="text-sm text-gray-600">Хорошее состояние</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : needAttentionCount}
              </p>
              <p className="text-sm text-gray-600">Требуют внимания</p>
            </div>
          </div>
        </div>
      </div>

      {/* Object Details Modal - GUEST VERSION (Limited Access) */}
      {selectedObject && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSelectedObject(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div
              className="px-6 py-4 text-white"
              style={{
                background: `linear-gradient(135deg, ${getConditionColor(
                  selectedObject.condition || 3
                )} 0%, ${getConditionColor(selectedObject.condition || 3)}dd 100%)`
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {selectedObject.objectType === 'waterbody' ? (
                      <Droplets className="w-6 h-6" />
                    ) : (
                      <Zap className="w-6 h-6" />
                    )}
                    <span className="text-sm font-medium opacity-90">
                      {getTypeLabel(selectedObject.type || selectedObject.resourceType)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedObject.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedObject(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Регион</p>
                  <p className="font-semibold text-gray-900">{selectedObject.region || 'Не указан'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Техн. состояние</p>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getConditionColor(selectedObject.condition || 3) }}
                    />
                    <span className="font-semibold text-gray-900">
                      Категория {selectedObject.condition || 3}
                    </span>
                  </div>
                </div>
              </div>

              {/* Дополнительная информация для водоёмов */}
              {selectedObject.objectType === 'waterbody' && selectedObject.waterType && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1">Тип воды</p>
                  <p className="text-lg font-bold text-blue-900">
                    {selectedObject.waterType === 'fresh' ? 'Пресная' : 'Непресная'}
                  </p>
                </div>
              )}

              {/* Мощность для ГТС */}
              {selectedObject.capacity && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-purple-700 mb-1">Мощность</p>
                  <p className="text-2xl font-bold text-purple-900">{selectedObject.capacity} МВт</p>
                </div>
              )}

              {/* Дата паспорта */}
              {selectedObject.passportDate && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Дата паспорта</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedObject.passportDate).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              )}

              {/* Guest Access Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 mb-1">Ограниченный доступ</p>
                  <p className="text-sm text-amber-700">
                    Войдите в систему для просмотра подробной информации, технических характеристик и паспорта объекта.
                  </p>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={() => (window.location.href = '/login')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
              >
                Войти для полного доступа
              </button>
            </div>
          </div>
        </>
      )}
    </GuestLayout>
  );
};

export default GuestMapPage;

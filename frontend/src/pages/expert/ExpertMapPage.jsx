import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Droplets,
  Zap,
  X,
  FileText,
  Calendar,
  Waves,
  Fish,
  AlertTriangle,
  TrendingUp,
  Filter,
  Search,
  Layers,
  ExternalLink,
} from 'lucide-react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { getAllMapData } from '../../services/mapApi';

/* ===================== ДАННЫЕ (будут загружены из API) ===================== */

// Fallback данные (используются при ошибке загрузки)
const FALLBACK_WATER_OBJECTS = [
  {
    id: 'balhash',
    name: 'Озеро Балхаш',
    region: 'Карагандинская область',
    resourceType: 'Озеро',
    waterType: 'Смешанная (пресная/солоноватая)',
    hasFauna: true,
    passportYear: 2022,
    condition: 3, // technicalCategory
    lat: 46.8,
    lng: 74.9,
  },
  {
    id: 'kapshagai-reservoir',
    name: 'Капшагайское водохранилище',
    region: 'Алматинская область',
    resourceType: 'Водохранилище',
    waterType: 'Пресная',
    hasFauna: true,
    passportYear: 2021,
    condition: 2,
    lat: 43.9,
    lng: 77.1,
  },
  {
    id: 'bukhtarma-reservoir',
    name: 'Бухтарминское водохранилище',
    region: 'Восточно-Казахстанская область',
    resourceType: 'Водохранилище',
    waterType: 'Пресная',
    hasFauna: true,
    passportYear: 2020,
    condition: 5,
    lat: 47.4,
    lng: 83.1,
  },
  {
    id: 'shardara-reservoir',
    name: 'Шардаринское водохранилище',
    region: 'Туркестанская область',
    resourceType: 'Водохранилище',
    waterType: 'Пресная',
    hasFauna: true,
    passportYear: 2019,
    condition: 2,
    lat: 41.2,
    lng: 68.3,
  },
  {
    id: 'zhaysan-lake',
    name: 'Озеро Жайсан',
    region: 'Восточно-Казахстанская область',
    resourceType: 'Озеро',
    waterType: 'Пресная',
    hasFauna: true,
    passportYear: 2018,
    condition: 3,
    lat: 47.5,
    lng: 84.8,
  },
  {
    id: 'alakol-lake',
    name: 'Озеро Алаколь',
    region: 'Жетысуская область',
    resourceType: 'Озеро',
    waterType: 'Солоноватая',
    hasFauna: true,
    passportYear: 2023,
    condition: 1,
    lat: 46.2,
    lng: 81.8,
  },
  {
    id: 'tengiz-lake',
    name: 'Озеро Тенгиз',
    region: 'Акмолинская область',
    resourceType: 'Озеро',
    waterType: 'Солёная',
    hasFauna: false,
    passportYear: 2017,
    condition: 4,
    lat: 50.5,
    lng: 69.0,
  },
  {
    id: 'sorbulak-reservoir',
    name: 'Водохранилище Сорбулак',
    region: 'Алматинская область',
    resourceType: 'Водохранилище',
    waterType: 'Слабо минерализованная',
    hasFauna: false,
    passportYear: 2020,
    condition: 2,
    lat: 43.4,
    lng: 77.3,
  },
];

// ГТС (HYDRO_FACILITIES_KZ из Swift)
const HYDRO_FACILITIES_KZ = [
  {
    id: 'bukhtarma-hpp',
    name: 'Бухтарминская ГЭС',
    region: 'Восточно-Казахстанская область',
    facilityType: 'ГЭС',
    condition: 3, // conditionCategory
    lat: 47.4,
    lng: 83.1,
  },
  {
    id: 'kapshagai-hpp',
    name: 'Капшагайская ГЭС',
    region: 'Алматинская область',
    facilityType: 'ГЭС',
    condition: 2,
    lat: 43.9,
    lng: 77.1,
  },
  {
    id: 'shardara-hpp',
    name: 'Шардаринская ГЭС',
    region: 'Туркестанская область',
    facilityType: 'ГЭС',
    condition: 4,
    lat: 41.2,
    lng: 68.3,
  },
  {
    id: 'oskemen-hpp',
    name: 'Усть-Каменогорская ГЭС',
    region: 'Восточно-Казахстанская область',
    facilityType: 'ГЭС',
    condition: 2,
    lat: 49.9,
    lng: 82.6,
  },
  {
    id: 'kokterek-dam',
    name: 'Плотина Коктерек',
    region: 'Алматинская область',
    facilityType: 'Плотина',
    condition: 5,
    lat: 43.2,
    lng: 76.8,
  },
  {
    id: 'sorbulak-dam',
    name: 'Плотина Сорбулак',
    region: 'Алматинская область',
    facilityType: 'Плотина',
    condition: 1,
    lat: 43.4,
    lng: 77.3,
  },
];

// Критические зоны рек (CRITICAL_ZONES_KZ из Swift)
const CRITICAL_ZONES_KZ = [
  {
    id: 'irtysh-pavlodar',
    name: 'Иртыш (Павлодар)',
    region: 'Павлодарская область',
    level: 'critical', // .critical
    description: 'Высокий уровень воды, риск выходa на пойму',
    condition: 5, // маппим level -> условную категорию
    lat: 52.3,
    lng: 76.9,
  },
  {
    id: 'ural-uralsk',
    name: 'Урал (Уральск)',
    region: 'Западно-Казахстанская область',
    level: 'warning',
    description: 'Повышенный уровень, требуется мониторинг',
    condition: 4,
    lat: 51.2,
    lng: 51.4,
  },
  {
    id: 'syrdarya-kyzylorda',
    name: 'Сырдарья (Кызылорда)',
    region: 'Кызылординская область',
    level: 'critical',
    description: 'Критический уровень, возможен выход воды на пойму',
    condition: 5,
    lat: 44.8,
    lng: 65.5,
  },
];

/* ===================== Leaflet карта ===================== */

const LeafletMap = ({
  waterObjects,
  facilities,
  criticalZones,
  activeLayer,
  onObjectClick,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [loadingMap, setLoadingMap] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingMap(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current && window.L && !loadingMap) {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMap]);

  useEffect(() => {
    if (mapInstanceRef.current && !loadingMap) {
      updateMarkers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waterObjects, facilities, criticalZones, activeLayer, loadingMap]);

  const initializeMap = () => {
    const L = window.L;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: [48.0, 68.0], // центр по Казахстану, как в iOS
      zoom: 5,
      zoomControl: false,
    });

    // OSM тайлы
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Кастомный зум
    const zoomControl = L.control({ position: 'topright' });
    zoomControl.onAdd = function () {
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

    updateMarkers();
  };

  const updateMarkers = () => {
    if (!window.L || !mapInstanceRef.current) return;
    const L = window.L;

    // удаляем старые маркеры
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const conditionColors = {
      1: '#10B981',
      2: '#84CC16',
      3: '#F59E0B',
      4: '#F97316',
      5: '#EF4444',
    };

    // Водоёмы
    if (activeLayer.waterObjects) {
      (waterObjects || []).forEach((w) => {
        const color = conditionColors[w.condition] || '#3B82F6';

        const marker = L.marker([w.lat, w.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative group">
                <div class="w-11 h-11 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-transform group-hover:scale-110"
                     style="background-color: ${color}">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"></path>
                  </svg>
                </div>
              </div>
            `,
            className: 'custom-water-marker',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          }),
        });

        marker.on('click', () => {
          onObjectClick && onObjectClick(w, 'water');
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    // ГТС
    if (activeLayer.facilities) {
      (facilities || []).forEach((f) => {
        const color = conditionColors[f.condition] || '#6B7280';

        const marker = L.marker([f.lat, f.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative group">
                <div class="w-11 h-11 rounded-lg border-4 border-white shadow-xl flex items-center justify-center transition-transform group-hover:scale-110"
                     style="background-color: ${color}">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
            `,
            className: 'custom-facility-marker',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          }),
        });

        marker.on('click', () => {
          onObjectClick && onObjectClick(f, 'facility');
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    // Критические зоны рек
    if (activeLayer.criticalZones) {
      (criticalZones || []).forEach((z) => {
        const color = z.level === 'critical' ? '#EF4444' : '#F97316';

        const marker = L.marker([z.lat, z.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative group">
                <div class="w-14 h-14 rounded-full bg-[${color}] bg-opacity-20 flex items-center justify-center animate-ping-slow"></div>
                <div class="w-10 h-10 rounded-full border-4 border-white shadow-xl flex items-center justify-center"
                     style="background-color: ${color}">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 22h20L12 2zm0 14v-4m0 6h.01"></path>
                  </svg>
                </div>
              </div>
            `,
            className: 'custom-critical-marker',
            iconSize: [48, 48],
            iconAnchor: [24, 24],
          }),
        });

        marker.on('click', () => {
          onObjectClick && onObjectClick(z, 'critical');
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }
  };

  if (loadingMap) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Загрузка карты…</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
};

/* ===================== Страница эксперта ===================== */

const ExpertMapPage = () => {
  const navigate = useNavigate();
  const [selectedObject, setSelectedObject] = useState(null);
  const [waterObjects, setWaterObjects] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [criticalZones, setCriticalZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');

  const [activeLayer, setActiveLayer] = useState({
    waterObjects: true,
    facilities: true,
    criticalZones: true,
  });

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const data = await getAllMapData();

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

      setWaterObjects(waterBodies);
      setFacilities(facilities);
      setCriticalZones(data.criticalZones || []);
    } catch (error) {
      console.error('Ошибка загрузки данных карты:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition) => {
    const colors = {
      1: '#10B981',
      2: '#84CC16',
      3: '#F59E0B',
      4: '#F97316',
      5: '#EF4444',
    };
    return colors[condition] || colors[3];
  };

  const getConditionLabel = (condition) => {
    const labels = {
      1: 'Отличное',
      2: 'Хорошее',
      3: 'Удовлетворительное',
      4: 'Плохое',
      5: 'Критическое',
    };
    return labels[condition] || 'Неизвестно';
  };

  const getTypeLabel = (object, objectType) => {
    if (objectType === 'water') {
      return object.resourceType || 'Водный объект';
    }
    if (objectType === 'facility') {
      return object.facilityType || 'ГТС';
    }
    if (objectType === 'critical') {
      return 'Критическая зона реки';
    }
    return 'Объект';
  };

  const calculatePriority = (condition, passportYear) => {
    if (!passportYear) return { score: 0, level: 'low' };
    const currentYear = new Date().getFullYear();
    const passportAge = currentYear - passportYear;
    const score = (6 - condition) * 3 + passportAge;

    let level;
    if (score >= 12) level = 'high';
    else if (score >= 6) level = 'medium';
    else level = 'low';

    return { score, level, passportAge };
  };

  const handleObjectClick = (object, objectType) => {
    const priority = calculatePriority(object.condition, object.passportYear);
    setSelectedObject({ ...object, objectType, priority });
  };

  // Фильтры
  const filteredWaterObjects = waterObjects.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition =
      filterCondition === 'all' || w.condition === parseInt(filterCondition);
    const matchesRegion = filterRegion === 'all' || w.region === filterRegion;
    return matchesSearch && matchesCondition && matchesRegion;
  });

  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition =
      filterCondition === 'all' || f.condition === parseInt(filterCondition);
    const matchesRegion = filterRegion === 'all' || f.region === filterRegion;
    return matchesSearch && matchesCondition && matchesRegion;
  });

  const filteredCriticalZones = criticalZones.filter((z) => {
    const matchesSearch = z.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition =
      filterCondition === 'all' || z.condition === parseInt(filterCondition);
    const matchesRegion = filterRegion === 'all' || z.region === filterRegion;
    return matchesSearch && matchesCondition && matchesRegion;
  });

  const regions = [
    ...new Set(
      [...waterObjects, ...facilities, ...criticalZones].map((o) => o.region),
    ),
  ]
    .filter(Boolean)
    .sort();

  const toggleLayer = (layer) => {
    setActiveLayer((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return null;

    const styles = {
      high: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        label: 'Высокий',
      },
      medium: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
        label: 'Средний',
      },
      low: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
        label: 'Низкий',
      },
    };

    const style = styles[priority.level] || styles.low;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}
      >
        <span className="font-semibold text-sm">{style.label}</span>
        <span className="text-xs">({priority.score})</span>
      </div>
    );
  };

  const totalGood = [
    ...filteredWaterObjects,
    ...filteredFacilities,
    ...filteredCriticalZones,
  ].filter((o) => o.condition <= 2).length;
  const totalMedium = [
    ...filteredWaterObjects,
    ...filteredFacilities,
    ...filteredCriticalZones,
  ].filter((o) => o.condition === 3).length;
  const totalBad = [
    ...filteredWaterObjects,
    ...filteredFacilities,
    ...filteredCriticalZones,
  ].filter((o) => o.condition >= 4).length;

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-slate-50">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-sky-700 to-cyan-600 text-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
              <MapPin className="w-8 h-8" />
              Карта объектов (Эксперт)
            </h1>
            <p className="text-sm lg:text-base text-sky-100 mt-2">
              Водоёмы, ГТС и критические зоны по Казахстану — данные синхронны с
              мобильным приложением
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-1 space-y-4">
              {/* ФИЛЬТРЫ */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-sky-600" />
                  Фильтры
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Поиск по названию…"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-gray-500 mb-1">
                      Регион
                    </span>
                    <select
                      value={filterRegion}
                      onChange={(e) => setFilterRegion(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-white"
                    >
                      <option value="all">Все регионы</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-gray-500 mb-1">
                      Категория состояния
                    </span>
                    <select
                      value={filterCondition}
                      onChange={(e) => setFilterCondition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-white"
                    >
                      <option value="all">Все</option>
                      <option value="1">Категория 1</option>
                      <option value="2">Категория 2</option>
                      <option value="3">Категория 3</option>
                      <option value="4">Категория 4</option>
                      <option value="5">Категория 5</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterRegion('all');
                      setFilterCondition('all');
                    }}
                    className="w-full mt-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>

              {/* СЛОИ */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-sky-600" />
                  Слои карты
                </h3>

                <div className="space-y-3 text-sm">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.waterObjects}
                      onChange={() => toggleLayer('waterObjects')}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <Droplets className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      Водоёмы ({filteredWaterObjects.length})
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.facilities}
                      onChange={() => toggleLayer('facilities')}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <Zap className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      ГТС ({filteredFacilities.length})
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeLayer.criticalZones}
                      onChange={() => toggleLayer('criticalZones')}
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <AlertTriangle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      Критические зоны ({filteredCriticalZones.length})
                    </span>
                  </label>
                </div>
              </div>

              {/* ЛЕГЕНДА */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Легенда</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getConditionColor(5) }}
                    />
                    <span>Критическое (Кат. 5)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getConditionColor(4) }}
                    />
                    <span>Плохое (Кат. 4)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getConditionColor(3) }}
                    />
                    <span>Удовлетворительное (Кат. 3)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getConditionColor(2) }}
                    />
                    <span>Хорошее (Кат. 2)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getConditionColor(1) }}
                    />
                    <span>Отличное (Кат. 1)</span>
                  </div>
                </div>
              </div>

              {/* СТАТИСТИКА */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Статистика</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Водоёмов:</span>
                    <span className="font-bold text-lg text-sky-600">
                      {filteredWaterObjects.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ГТС:</span>
                    <span className="font-bold text-lg text-purple-600">
                      {filteredFacilities.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Критические зоны:</span>
                    <span className="font-bold text-lg text-red-600">
                      {filteredCriticalZones.length}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Кат. 1–2:</span>
                    <span className="font-bold text-lg text-green-600">
                      {totalGood}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Кат. 3:</span>
                    <span className="font-bold text-lg text-orange-500">
                      {totalMedium}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Кат. 4–5:</span>
                    <span className="font-bold text-lg text-red-600">
                      {totalBad}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: MAP */}
            <div className="lg:col-span-3">
              <div
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                style={{ height: 'calc(100vh - 220px)' }}
              >
                <div className="relative w-full h-full">
                  <LeafletMap
                    waterObjects={filteredWaterObjects}
                    facilities={filteredFacilities}
                    criticalZones={filteredCriticalZones}
                    activeLayer={activeLayer}
                    onObjectClick={handleObjectClick}
                  />

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-slate-300 text-center">
                      <MapPin className="w-20 h-20 mx-auto mb-2 opacity-20" />
                      <p className="text-lg font-semibold opacity-40">
                        Интерактивная карта Казахстана
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL - Компактная версия */}
      {selectedObject && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSelectedObject(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* header */}
            <div
              className="px-6 py-4 text-white"
              style={{
                background: `linear-gradient(135deg, ${getConditionColor(
                  selectedObject.condition,
                )} 0%, ${getConditionColor(selectedObject.condition)}dd 100%)`,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {selectedObject.objectType === 'water' && (
                      <Droplets className="w-5 h-5" />
                    )}
                    {selectedObject.objectType === 'facility' && (
                      <Zap className="w-5 h-5" />
                    )}
                    {selectedObject.objectType === 'critical' && (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                    <span className="text-xs font-medium opacity-90">
                      {getTypeLabel(selectedObject, selectedObject.objectType)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-1">
                    {selectedObject.name}
                  </h2>
                  <p className="text-xs opacity-80">
                    {selectedObject.region || 'Регион не указан'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedObject(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* body - компактная информация */}
            <div className="p-6 space-y-4">
              {/* Основная информация */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Состояние</p>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getConditionColor(
                          selectedObject.condition,
                        ),
                      }}
                    />
                    <span className="font-semibold text-sm text-gray-900">
                      Кат. {selectedObject.condition}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Приоритет</p>
                  {getPriorityBadge(selectedObject.priority)}
                </div>
              </div>

              {/* Тип-специфичная информация (кратко) */}
              {selectedObject.objectType === 'water' && selectedObject.resourceType && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">Тип ресурса</p>
                  <p className="text-sm font-semibold text-blue-900">
                    {selectedObject.resourceType}
                  </p>
                </div>
              )}

              {selectedObject.objectType === 'facility' && selectedObject.facilityType && (
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-700 mb-1">Тип ГТС</p>
                  <p className="text-sm font-semibold text-purple-900">
                    {selectedObject.facilityType}
                  </p>
                </div>
              )}

              {selectedObject.objectType === 'critical' && (
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-xs text-red-700 mb-1">
                    {selectedObject.level === 'critical'
                      ? '⚠️ Критический уровень'
                      : '⚡ Предупреждение'}
                  </p>
                  <p className="text-sm text-red-900">
                    {selectedObject.description}
                  </p>
                </div>
              )}

              {/* Кнопки действий */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setSelectedObject(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm"
                >
                  Закрыть
                </button>
                {selectedObject.id && (
                  <button
                    onClick={() => {
                      const route = selectedObject.objectType === 'water'
                        ? `/detail/waterbody/${selectedObject.id}`
                        : selectedObject.objectType === 'facility'
                        ? `/detail/facility/${selectedObject.id}`
                        : `/detail/critical-zone/${selectedObject.id}`;
                      navigate(route);
                    }}
                    className="flex-1 bg-sky-600 text-white py-3 rounded-xl hover:bg-sky-700 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Подробнее</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </ExpertLayout>
  );
};

export default ExpertMapPage;

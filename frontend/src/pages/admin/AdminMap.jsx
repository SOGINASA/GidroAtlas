/* global L */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe,
  Droplets, 
  Zap, 
  Search,
  Filter,
  Layers,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  Grid3x3,
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  AlertCircle,
  Info,
  Menu,
  ChevronLeft,
  Settings
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';
import {
  getAllMapData,
  createWaterBody,
  updateWaterBody,
  deleteWaterBody,
  createHydroFacility,
  updateHydroFacility,
  deleteHydroFacility
} from '../../services/mapApi';

// =============================
// MAP TILES CONFIG
// =============================
const MAPTILER_BASE_URL = 'https://api.maptiler.com/maps';
const MAPTILER_API_KEY = process.env.REACT_APP_MAPTILER_API_KEY;
const HAS_MAPTILER_KEY = Boolean(MAPTILER_API_KEY);

// =============================
// HYDRO API CONFIG
// =============================
const HYDRO_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
const HYDRO_API_TOKEN = process.env.REACT_APP_API_TOKEN || '';

// Водоёмы Казахстана
const WATER_OBJECTS_KZ = [
  {
    id: 'balhash',
    name: 'Озеро Балхаш',
    region: 'Карагандинская область',
    condition: 3,
    lat: 46.8,
    lng: 74.9
  },
  {
    id: 'kapshagai-reservoir',
    name: 'Капшагайское водохранилище',
    region: 'Алматинская область',
    condition: 2,
    lat: 43.9,
    lng: 77.1
  },
  {
    id: 'bukhtarma-reservoir',
    name: 'Бухтарминское водохранилище',
    region: 'Восточно-Казахстанская область',
    condition: 5,
    lat: 47.4,
    lng: 83.1
  },
  {
    id: 'shardara-reservoir',
    name: 'Шардаринское водохранилище',
    region: 'Туркестанская область',
    condition: 2,
    lat: 41.2,
    lng: 68.3
  },
  {
    id: 'zhaysan-lake',
    name: 'Озеро Жайсан',
    region: 'Восточно-Казахстанская область',
    condition: 3,
    lat: 47.5,
    lng: 84.8
  },
  {
    id: 'alakol-lake',
    name: 'Озеро Алаколь',
    region: 'Жетысуская область',
    condition: 1,
    lat: 46.2,
    lng: 81.8
  },
  {
    id: 'tengiz-lake',
    name: 'Озеро Тенгиз',
    region: 'Акмолинская область',
    condition: 4,
    lat: 50.5,
    lng: 69.0
  },
  {
    id: 'sorbulak-reservoir',
    name: 'Водохранилище Сорбулак',
    region: 'Алматинская область',
    condition: 2,
    lat: 43.4,
    lng: 77.3
  }
];

// Гидротехнические сооружения
const HYDRO_FACILITIES_KZ = [
  {
    id: 'bukhtarma-hpp',
    name: 'Бухтарминская ГЭС',
    type: 'hydropower',
    region: 'Восточно-Казахстанская область',
    condition: 3,
    lat: 47.4,
    lng: 83.1
  },
  {
    id: 'kapshagai-hpp',
    name: 'Капшагайская ГЭС',
    type: 'hydropower',
    region: 'Алматинская область',
    condition: 2,
    lat: 43.9,
    lng: 77.1
  },
  {
    id: 'shardara-hpp',
    name: 'Шардаринская ГЭС',
    type: 'hydropower',
    region: 'Туркестанская область',
    condition: 4,
    lat: 41.2,
    lng: 68.3
  },
  {
    id: 'u-kamenogorsk-hpp',
    name: 'Усть-Каменогорская ГЭС',
    type: 'hydropower',
    region: 'Восточно-Казахстанская область',
    condition: 2,
    lat: 49.9,
    lng: 82.6
  },
  {
    id: 'kokterek-dam',
    name: 'Плотина Коктерек',
    type: 'dam',
    region: 'Алматинская область',
    condition: 5,
    lat: 43.2,
    lng: 76.8
  },
  {
    id: 'sorbulak-dam',
    name: 'Плотина Сорбулак',
    type: 'dam',
    region: 'Алматинская область',
    condition: 1,
    lat: 43.4,
    lng: 77.3
  }
];

// Критические зоны
const CRITICAL_ZONES_KZ = [
  {
    id: 'irtysh-pavlodar',
    name: 'Иртыш (Павлодар)',
    region: 'Павлодарская область',
    level: 'critical',
    lat: 52.3,
    lng: 76.9
  },
  {
    id: 'ural-uralsk',
    name: 'Урал (Уральск)',
    region: 'Западно-Казахстанская область',
    level: 'warning',
    lat: 51.2,
    lng: 51.4
  },
  {
    id: 'syrdarya-kyzylorda',
    name: 'Сырдарья (Кызылорда)',
    region: 'Кызылординская область',
    level: 'critical',
    lat: 44.8,
    lng: 65.5
  }
];

const apiFetch = async (endpoint, options = {}) => {
  const url = `${HYDRO_API_BASE_URL}${endpoint}`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(HYDRO_API_TOKEN ? { Authorization: `Bearer ${HYDRO_API_TOKEN}` } : {})
    },
    ...options
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`API error ${resp.status}: ${text || resp.statusText}`);
  }

  if (resp.status === 204) return null;
  return resp.json();
};

const getTileLayerConfig = (view = 'standard') => {
  if (!HAS_MAPTILER_KEY) {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }
    };
  }

  let tileUrl;
  switch (view) {
    case 'satellite':
      tileUrl = `${MAPTILER_BASE_URL}/satellite/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`;
      break;
    case 'hybrid':
      tileUrl = `${MAPTILER_BASE_URL}/hybrid/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`;
      break;
    default:
      tileUrl = `${MAPTILER_BASE_URL}/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`;
  }

  return {
    url: tileUrl,
    options: {
      attribution: '© MapTiler © OpenStreetMap contributors',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1
    }
  };
};

// =============================
// Leaflet Map Component
// =============================
const LeafletMap = ({ 
  mapObjects, 
  activeLayers, 
  onObjectClick, 
  editMode, 
  mapView,
  onMapClick 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapObjects, activeLayers]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      changeMapView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapView]);

  const initializeMap = () => {
    const L = window.L;
    
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [48.0196, 66.9237],
      zoom: 6,
      zoomControl: false
    });

    const { url, options } = getTileLayerConfig('standard');
    L.tileLayer(url, options).addTo(mapInstanceRef.current);

    mapInstanceRef.current.on('click', (e) => {
      if (editMode && onMapClick) {
        onMapClick(e.latlng);
      }
    });
  };

  const updateMarkers = () => {
    if (!window.L || !mapInstanceRef.current) return;
    
    const L = window.L;
    
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const getConditionColorHex = (condition) => {
      const colors = {
        1: '#10B981',
        2: '#84CC16',
        3: '#F59E0B',
        4: '#F97316',
        5: '#EF4444'
      };
      return colors[condition] || '#6B7280';
    };

    const createIcon = (type, condition, iconSymbol) => {
      const color = getConditionColorHex(condition);
      return L.divIcon({
        html: `
          <div class="relative">
            <div class="w-10 h-10 rounded-lg border-2 border-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
                 style="background-color: ${color}">
              <span class="text-xl">${iconSymbol}</span>
            </div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
    };

    if (activeLayers.waterBodies && mapObjects.waterBodies) {
      mapObjects.waterBodies.forEach(wb => {
        if (!wb.lat || !wb.lng) return;

        const marker = L.marker([wb.lat, wb.lng], {
          icon: createIcon('waterBody', wb.condition, '💧')
        });

        marker.bindPopup(`
          <div class="p-2 min-w-[180px]">
            <h3 class="font-bold text-base mb-1">${wb.name}</h3>
            <p class="text-xs text-gray-500 mb-2">${wb.region || ''}</p>
            <p class="text-sm mb-1"><span class="font-semibold">Категория:</span> ${wb.condition}</p>
          </div>
        `);

        marker.on('click', () => {
          onObjectClick({ ...wb, type: 'waterBody' });
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    if (activeLayers.hydroFacilities && mapObjects.facilities) {
      mapObjects.facilities.forEach(fac => {
        if (!fac.lat || !fac.lng) return;

        const marker = L.marker([fac.lat, fac.lng], {
          icon: createIcon('facility', fac.condition, '⚡')
        });

        marker.bindPopup(`
          <div class="p-2 min-w-[180px]">
            <h3 class="font-bold text-base mb-1">${fac.name}</h3>
            <p class="text-xs text-gray-500 mb-2">${fac.region || ''}</p>
            <p class="text-sm mb-1"><span class="font-semibold">Тип:</span> ${fac.type || '—'}</p>
            <p class="text-sm"><span class="font-semibold">Категория:</span> ${fac.condition}</p>
          </div>
        `);

        marker.on('click', () => {
          onObjectClick({ ...fac, type: 'facility' });
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }

    if (activeLayers.criticalZones && mapObjects.criticalZones) {
      mapObjects.criticalZones.forEach(zone => {
        if (!zone.lat || !zone.lng) return;
    
        const color = zone.level === 'critical' ? '#EF4444' : '#F97316';
    
        const marker = L.marker([zone.lat, zone.lng], {
          icon: L.divIcon({
            html: `
              <div class="relative">
                <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                     style="background-color: ${color}">
                  <span class="text-xl">⚠️</span>
                </div>
              </div>
            `,
            className: 'custom-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          })
        });
    
        marker.bindPopup(`
          <div class="p-2 min-w-[180px]">
            <h3 class="font-bold text-base mb-1">${zone.name}</h3>
            <p class="text-xs text-gray-500 mb-2">${zone.region || ''}</p>
            <p class="text-sm mb-1">
              <span class="font-semibold">Уровень:</span>
              ${zone.level === 'critical' ? 'Критический' : 'Предупреждение'}
            </p>
          </div>
        `);
    
        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });
    }
  };

  const changeMapView = () => {
    if (!window.L || !mapInstanceRef.current) return;
    const L = window.L;
  
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
  
    const { url, options } = getTileLayerConfig(mapView);
    L.tileLayer(url, options).addTo(mapInstanceRef.current);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0 bg-gray-200" />
      
      {!window.L && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-xl mx-4">
            <Globe className="w-16 h-16 text-purple-400 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold mb-1">Загрузка карты...</p>
            <p className="text-gray-500 text-xs">Подключите Leaflet</p>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================
// AdminMap (главный компонент)
// =============================
const AdminMap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showLayersModal, setShowLayersModal] = useState(false);
  const [showObjectsModal, setShowObjectsModal] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [mapView, setMapView] = useState('standard');
  const mapComponentRef = useRef(null);
  
  const [activeLayers, setActiveLayers] = useState({
    waterBodies: true,
    hydroFacilities: true,
    regions: true,
    sensors: false,
    criticalZones: false,
    heatmap: false
  });

  const [filters, setFilters] = useState({
    region: '',
    waterType: '',
    condition: '',
    priority: ''
  });

  const [mapObjects, setMapObjects] = useState({
    waterBodies: [],
    facilities: [],
    criticalZones: [] 
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [pendingCoords, setPendingCoords] = useState(null);
  const [newObject, setNewObject] = useState({
    objectKind: 'waterBody',
    name: '',
    region: '',
    condition: 3,
    lat: '',
    lng: '',
    facilityType: 'hydropower'
  });

  useEffect(() => {
    loadMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadMapData = async () => {
    try {
      const data = await getAllMapData(filters);

      if (data) {
        const waterBodiesList = (data.waterBodies || [])
          .filter(wb => {
            const lat = wb.coordinates?.lat || wb.lat || wb.latitude;
            const lng = wb.coordinates?.lng || wb.lng || wb.longitude;
            return lat && lng;
          })
          .map(wb => ({
            id: wb.id,
            name: wb.name,
            region: wb.region || wb.area || '',
            condition: wb.condition || wb.technicalCondition || 3,
            lat: wb.coordinates?.lat || wb.lat || wb.latitude,
            lng: wb.coordinates?.lng || wb.lng || wb.longitude
          }));

        const facilitiesList = (data.facilities || [])
          .filter(fac => {
            const lat = fac.coordinates?.lat || fac.lat || fac.latitude;
            const lng = fac.coordinates?.lng || fac.lng || fac.longitude;
            return lat && lng;
          })
          .map(fac => ({
            id: fac.id,
            name: fac.name,
            type: fac.type || fac.facilityType || 'hydropower',
            region: fac.region || fac.area || '',
            condition: fac.condition || fac.technicalCondition || 3,
            lat: fac.coordinates?.lat || fac.lat || fac.latitude,
            lng: fac.coordinates?.lng || fac.lng || fac.longitude
          }));

        setMapObjects({
          waterBodies: waterBodiesList,
          facilities: facilitiesList,
          criticalZones: data.criticalZones || CRITICAL_ZONES_KZ
        });

      } else {
        setMapObjects({
          waterBodies: WATER_OBJECTS_KZ,
          facilities: HYDRO_FACILITIES_KZ,
          criticalZones: CRITICAL_ZONES_KZ
        });
      }
      
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setMapObjects({
        waterBodies: WATER_OBJECTS_KZ,
        facilities: HYDRO_FACILITIES_KZ,
        criticalZones: CRITICAL_ZONES_KZ
      });
    }
  };

  const stats = [
    { label: 'Водоёмы', value: mapObjects.waterBodies.length.toString(), icon: Droplets, color: 'bg-blue-500' },
    { label: 'ГТС', value: mapObjects.facilities.length.toString(), icon: Zap, color: 'bg-orange-500' },
    { label: 'На карте', value: (mapObjects.waterBodies.length + mapObjects.facilities.length).toString(), icon: MapPin, color: 'bg-purple-500' },
    { label: 'Требуют внимания', value: mapObjects.waterBodies.filter(w => w.condition >= 4).length.toString(), icon: AlertCircle, color: 'bg-red-500' }
  ];

  const layerOptions = [
    { id: 'waterBodies', label: 'Водоёмы', icon: Droplets, color: 'text-blue-600' },
    { id: 'hydroFacilities', label: 'ГТС', icon: Zap, color: 'text-orange-600' },
    { id: 'regions', label: 'Границы регионов', icon: Grid3x3, color: 'text-gray-600' },
    { id: 'sensors', label: 'Датчики IoT', icon: Navigation, color: 'text-green-600' },
    { id: 'criticalZones', label: 'Критические зоны', icon: AlertCircle, color: 'text-red-600' },
    { id: 'heatmap', label: 'Тепловая карта', icon: Layers, color: 'text-purple-600' }
  ];

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const handleObjectClick = (object) => {
    setSelectedObject(object);
    // На мобильных закрываем другие модалки
    setShowObjectsModal(false);
    setShowFiltersModal(false);
    setShowLayersModal(false);
  };

  const handleDeleteObject = async (object) => {
    if (!object) return;
    if (!window.confirm('Вы уверены, что хотите удалить этот объект?')) return;

    try {
      if (object.type === 'waterBody') {
        await deleteWaterBody(object.id);
        setMapObjects(prev => ({
          ...prev,
          waterBodies: prev.waterBodies.filter(w => w.id !== object.id)
        }));
      } else {
        await deleteHydroFacility(object.id);
        setMapObjects(prev => ({
          ...prev,
          facilities: prev.facilities.filter(f => f.id !== object.id)
        }));
      }
      setSelectedObject(null);
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить объект.');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(mapObjects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'map-data.json';
    link.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setMapObjects(data);
        } catch (error) {
          console.error('Ошибка импорта:', error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const getConditionColor = (condition) => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-lime-500',
      3: 'bg-yellow-500',
      4: 'bg-orange-500',
      5: 'bg-red-500'
    };
    return colors[condition] || 'bg-gray-500';
  };

  const handleMapClick = (latlng) => {
    setPendingCoords(latlng);
    if (showCreateForm) {
      setNewObject(prev => ({
        ...prev,
        lat: latlng.lat.toFixed(6),
        lng: latlng.lng.toFixed(6)
      }));
    }
  };

  const openCreateForm = () => {
    setCreateError(null);
    setShowCreateForm(true);
    setEditMode(true);
    setShowMobileMenu(false);
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);
    setCreateError(null);
    setEditMode(false);
    setNewObject({
      objectKind: 'waterBody',
      name: '',
      region: '',
      condition: 3,
      lat: '',
      lng: '',
      facilityType: 'hydropower'
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError(null);

    if (!newObject.name || !newObject.region || !newObject.lat || !newObject.lng) {
      setCreateError('Заполните имя, регион и координаты.');
      return;
    }

    const payload = {
      name: newObject.name,
      region: newObject.region,
      condition: Number(newObject.condition) || 3,
      lat: parseFloat(newObject.lat),
      lng: parseFloat(newObject.lng)
    };

    if (newObject.objectKind === 'facility') {
      payload.type = newObject.facilityType || 'hydropower';
    }

    try {
      let created;
      if (newObject.objectKind === 'waterBody') {
        created = await createWaterBody(payload);
        setMapObjects(prev => ({
          ...prev,
          waterBodies: [...prev.waterBodies, created]
        }));
      } else {
        created = await createHydroFacility(payload);
        setMapObjects(prev => ({
          ...prev,
          facilities: [...prev.facilities, created]
        }));
      }

      closeCreateForm();
    } catch (error) {
      console.error('Ошибка создания объекта:', error);
      setCreateError('Не удалось сохранить объект. Проверьте API.');
    }
  };

  return (
    <AdminLayout>
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* MOBILE HEADER */}
        <div className="lg:hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6" />
              <div>
                <h1 className="text-lg font-bold">Админ карта</h1>
                <p className="text-purple-100 text-xs">Управление объектами</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DESKTOP HEADER */}
        <div className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Globe className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Административная карта</h1>
                <p className="text-purple-100 text-sm">Полный контроль и управление объектами</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <div>
                        <p className="text-xs text-purple-100">{stat.label}</p>
                        <p className="text-lg font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* DESKTOP LEFT SIDEBAR */}
          <div className="hidden lg:block w-80 bg-white border-r border-gray-200 flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск объектов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => setShowFiltersModal(!showFiltersModal)}
                  className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Фильтры</span>
                </button>
                
                <button
                  onClick={() => setShowLayersModal(!showLayersModal)}
                  className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Layers className="w-4 h-4" />
                  <span className="text-sm font-medium">Слои</span>
                </button>

                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    editMode ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Редактор</span>
                </button>

                <button
                  onClick={openCreateForm}
                  className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Добавить</span>
                </button>
              </div>
              {editMode && (
                <p className="mt-2 text-xs text-orange-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Режим редактора активен
                </p>
              )}
            </div>

            {/* Desktop Filters Panel */}
            {showFiltersModal && (
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <Filter className="w-5 h-5 text-blue-600 mr-2" />
                  Фильтрация
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Область</label>
                    <select 
                      value={filters.region}
                      onChange={(e) => setFilters({...filters, region: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Все области</option>
                      <option value="almaty">Алматинская</option>
                      <option value="pavlodar">Павлодарская</option>
                      <option value="vko">ВКО</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Состояние</label>
                    <select 
                      value={filters.condition}
                      onChange={(e) => setFilters({...filters, condition: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Все</option>
                      <option value="1">Категория 1</option>
                      <option value="2">Категория 2</option>
                      <option value="3">Категория 3</option>
                      <option value="4">Категория 4</option>
                      <option value="5">Категория 5</option>
                    </select>
                  </div>

                  <button 
                    onClick={loadMapData}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Применить фильтры
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Layers Panel */}
            {showLayersModal && (
              <div className="p-4 border-b border-gray-200 bg-purple-50">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <Layers className="w-5 h-5 text-purple-600 mr-2" />
                  Слои карты
                </h3>
                <div className="space-y-2">
                  {layerOptions.map((layer) => {
                    const Icon = layer.icon;
                    return (
                      <label
                        key={layer.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={activeLayers[layer.id]}
                          onChange={() => toggleLayer(layer.id)}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <Icon className={`w-5 h-5 ${layer.color}`} />
                        <span className="text-sm font-medium text-gray-700">{layer.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Desktop Objects List */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                Объекты на карте
              </h3>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
                  <Droplets className="w-4 h-4 mr-1" />
                  Водоёмы ({mapObjects.waterBodies.length})
                </p>
                <div className="space-y-2">
                  {mapObjects.waterBodies
                    .filter(wb => !searchQuery || wb.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((wb) => (
                      <div
                        key={wb.id}
                        onClick={() => handleObjectClick({...wb, type: 'waterBody'})}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedObject?.id === wb.id && selectedObject?.type === 'waterBody'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{wb.name}</p>
                            <p className="text-xs text-gray-600">{wb.region}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${getConditionColor(wb.condition)}`} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  ГТС ({mapObjects.facilities.length})
                </p>
                <div className="space-y-2">
                  {mapObjects.facilities
                    .filter(fac => !searchQuery || fac.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((fac) => (
                      <div
                        key={fac.id}
                        onClick={() => handleObjectClick({...fac, type: 'facility'})}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedObject?.id === fac.id && selectedObject?.type === 'facility'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{fac.name}</p>
                            <p className="text-xs text-gray-600">{fac.region}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${getConditionColor(fac.condition)}`} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Desktop Export/Import */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleExport}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Экспорт</span>
                </button>
                <button 
                  onClick={handleImport}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Импорт</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAP AREA */}
          <div className="flex-1 relative bg-gray-200">
            <LeafletMap 
              ref={mapComponentRef}
              mapObjects={mapObjects}
              activeLayers={activeLayers}
              onObjectClick={handleObjectClick}
              editMode={editMode}
              mapView={mapView}
              onMapClick={handleMapClick}
            />

            {/* Map controls */}
            <div className="absolute top-4 right-4 space-y-2 z-[1000]">
              <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
                <button className="w-10 h-10 flex items-center justify-center bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  <Navigation className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Legend - скрываем на маленьких экранах */}
            <div className="hidden md:block absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[1000]">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                <Info className="w-5 h-5 text-purple-600 mr-2" />
                Легенда
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Категория 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                  <span>Категория 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Категория 3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>Категория 4</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Категория 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP RIGHT PANEL: selected object */}
          {selectedObject && (
            <div className="hidden lg:block w-96 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-purple-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{selectedObject.name}</h3>
                    <p className="text-sm text-gray-600">{selectedObject.region}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedObject(null)}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Состояние</p>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full ${getConditionColor(selectedObject.condition)} flex items-center justify-center text-white font-bold text-lg`}>
                      {selectedObject.condition}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Категория {selectedObject.condition}</p>
                      <p className="text-sm text-gray-600">
                        {selectedObject.condition === 1 ? 'Отличное' :
                        selectedObject.condition === 2 ? 'Хорошее' :
                        selectedObject.condition === 3 ? 'Среднее' :
                        selectedObject.condition === 4 ? 'Плохое' : 'Критическое'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Координаты</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Широта:</span>
                      <span className="font-mono font-semibold">{selectedObject.lat}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Долгота:</span>
                      <span className="font-mono font-semibold">{selectedObject.lng}°</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold">
                  <Eye className="w-5 h-5" />
                  <span>Просмотреть</span>
                </button>
                
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                  <Edit3 className="w-5 h-5" />
                  <span>Редактировать</span>
                </button>
                
                <button 
                  onClick={() => handleDeleteObject(selectedObject)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Удалить</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-[1000] safe-area-bottom">
          <div className="grid grid-cols-5 gap-1">
            <button
              onClick={() => {
                setShowFiltersModal(true);
                setShowLayersModal(false);
                setShowObjectsModal(false);
              }}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Filter className="w-5 h-5 text-purple-600 mb-1" />
              <span className="text-xs font-medium text-gray-700">Фильтры</span>
            </button>

            <button
              onClick={() => {
                setShowLayersModal(true);
                setShowFiltersModal(false);
                setShowObjectsModal(false);
              }}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Layers className="w-5 h-5 text-purple-600 mb-1" />
              <span className="text-xs font-medium text-gray-700">Слои</span>
            </button>

            <button
              onClick={() => {
                setShowObjectsModal(true);
                setShowFiltersModal(false);
                setShowLayersModal(false);
              }}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MapPin className="w-5 h-5 text-purple-600 mb-1" />
              <span className="text-xs font-medium text-gray-700">Объекты</span>
            </button>

            <button
              onClick={openCreateForm}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
            >
              <Plus className="w-5 h-5 text-green-600 mb-1" />
              <span className="text-xs font-medium text-green-700">Добавить</span>
            </button>

            <button
              onClick={() => setShowMobileMenu(true)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 mb-1" />
              <span className="text-xs font-medium text-gray-700">Ещё</span>
            </button>
          </div>
        </div>

        {/* MOBILE MODALS */}
        
        {/* Mobile Menu Modal */}
        {showMobileMenu && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-[2000]"
              onClick={() => setShowMobileMenu(false)}
            />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[2100] pb-safe animate-slide-up">
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Дополнительно</h3>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    setEditMode(!editMode);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    editMode ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Edit3 className="w-5 h-5" />
                  <span className="font-medium">Режим редактора</span>
                </button>

                <button
                  onClick={() => {
                    handleExport();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-500 text-white rounded-lg"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Экспорт данных</span>
                </button>

                <button
                  onClick={() => {
                    handleImport();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-green-500 text-white rounded-lg"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Импорт данных</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Mobile Filters Modal */}
        {showFiltersModal && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-[2000]"
              onClick={() => setShowFiltersModal(false)}
            />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[2100] max-h-[80vh] overflow-y-auto pb-safe">
              <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Filter className="w-5 h-5 text-blue-600 mr-2" />
                    Фильтры
                  </h3>
                  <button
                    onClick={() => setShowFiltersModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Область</label>
                  <select 
                    value={filters.region}
                    onChange={(e) => setFilters({...filters, region: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Все области</option>
                    <option value="almaty">Алматинская</option>
                    <option value="pavlodar">Павлодарская</option>
                    <option value="vko">ВКО</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Состояние</label>
                  <select 
                    value={filters.condition}
                    onChange={(e) => setFilters({...filters, condition: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Все</option>
                    <option value="1">Категория 1</option>
                    <option value="2">Категория 2</option>
                    <option value="3">Категория 3</option>
                    <option value="4">Категория 4</option>
                    <option value="5">Категория 5</option>
                  </select>
                </div>

                <button 
                  onClick={() => {
                    loadMapData();
                    setShowFiltersModal(false);
                  }}
                  className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition-colors text-base font-semibold"
                >
                  Применить фильтры
                </button>
              </div>
            </div>
          </>
        )}

        {/* Mobile Layers Modal */}
        {showLayersModal && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-[2000]"
              onClick={() => setShowLayersModal(false)}
            />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[2100] max-h-[80vh] overflow-y-auto pb-safe">
              <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Layers className="w-5 h-5 text-purple-600 mr-2" />
                    Слои карты
                  </h3>
                  <button
                    onClick={() => setShowLayersModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {layerOptions.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <label
                      key={layer.id}
                      className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={activeLayers[layer.id]}
                        onChange={() => toggleLayer(layer.id)}
                        className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <Icon className={`w-6 h-6 ${layer.color}`} />
                      <span className="text-base font-medium text-gray-700">{layer.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Mobile Objects Modal */}
        {showObjectsModal && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-[2000]"
              onClick={() => setShowObjectsModal(false)}
            />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[2100] max-h-[80vh] overflow-y-auto pb-safe">
              <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                    Объекты
                  </h3>
                  <button
                    onClick={() => setShowObjectsModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Поиск объектов..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Водоёмы */}
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center">
                    <Droplets className="w-4 h-4 mr-1" />
                    Водоёмы ({mapObjects.waterBodies.length})
                  </p>
                  <div className="space-y-2">
                    {mapObjects.waterBodies
                      .filter(wb => !searchQuery || wb.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((wb) => (
                        <div
                          key={wb.id}
                          onClick={() => handleObjectClick({...wb, type: 'waterBody'})}
                          className="p-4 rounded-xl border-2 border-gray-200 bg-white active:bg-purple-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{wb.name}</p>
                              <p className="text-sm text-gray-600">{wb.region}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full ${getConditionColor(wb.condition)}`} />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* ГТС */}
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    ГТС ({mapObjects.facilities.length})
                  </p>
                  <div className="space-y-2">
                    {mapObjects.facilities
                      .filter(fac => !searchQuery || fac.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((fac) => (
                        <div
                          key={fac.id}
                          onClick={() => handleObjectClick({...fac, type: 'facility'})}
                          className="p-4 rounded-xl border-2 border-gray-200 bg-white active:bg-purple-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{fac.name}</p>
                              <p className="text-sm text-gray-600">{fac.region}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full ${getConditionColor(fac.condition)}`} />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile Selected Object Modal */}
        {selectedObject && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-[2000]"
              onClick={() => setSelectedObject(null)}
            />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[2100] max-h-[85vh] overflow-y-auto pb-safe">
              <div className="sticky top-0 bg-purple-50 px-4 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-xl mb-1">{selectedObject.name}</h3>
                    <p className="text-sm text-gray-600">{selectedObject.region}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedObject(null)}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Состояние</p>
                  <div className="flex items-center space-x-3">
                    <div className={`w-14 h-14 rounded-full ${getConditionColor(selectedObject.condition)} flex items-center justify-center text-white font-bold text-xl`}>
                      {selectedObject.condition}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Категория {selectedObject.condition}</p>
                      <p className="text-sm text-gray-600">
                        {selectedObject.condition === 1 ? 'Отличное' :
                        selectedObject.condition === 2 ? 'Хорошее' :
                        selectedObject.condition === 3 ? 'Среднее' :
                        selectedObject.condition === 4 ? 'Плохое' : 'Критическое'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Координаты</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Широта:</span>
                      <span className="font-mono font-semibold">{selectedObject.lat}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Долгота:</span>
                      <span className="font-mono font-semibold">{selectedObject.lng}°</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-semibold">
                    <Eye className="w-5 h-5" />
                    <span>Просмотреть детали</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold">
                    <Edit3 className="w-5 h-5" />
                    <span>Редактировать</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      handleDeleteObject(selectedObject);
                      setSelectedObject(null);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Удалить объект</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CREATE OBJECT FORM - адаптивная версия */}
        {showCreateForm && (
          <>
            <div 
              className="fixed inset-0 bg-black/40 z-[2000]"
              onClick={closeCreateForm}
            />
            <div className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-4 md:top-16 w-auto md:w-full md:max-w-xl bg-white rounded-2xl shadow-2xl z-[2100] overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-gray-900">Добавление объекта</h2>
                  <p className="text-xs text-gray-500">
                    Кликните по карте для координат
                  </p>
                </div>
                <button
                  onClick={closeCreateForm}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-4 md:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewObject(prev => ({ ...prev, objectKind: 'waterBody' }))}
                    className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl text-sm font-medium border ${
                      newObject.objectKind === 'waterBody'
                        ? 'bg-blue-50 text-blue-700 border-blue-400'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Droplets className="w-5 h-5" />
                    <span>Водоём</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewObject(prev => ({ ...prev, objectKind: 'facility' }))}
                    className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl text-sm font-medium border ${
                      newObject.objectKind === 'facility'
                        ? 'bg-orange-50 text-orange-700 border-orange-400'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                    <span>ГТС</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Название</label>
                  <input
                    type="text"
                    value={newObject.name}
                    onChange={(e) => setNewObject(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Озеро Балхаш"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Регион</label>
                  <input
                    type="text"
                    value={newObject.region}
                    onChange={(e) => setNewObject(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Алматинская область"
                    required
                  />
                </div>

                {newObject.objectKind === 'facility' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Тип ГТС</label>
                    <select
                      value={newObject.facilityType}
                      onChange={(e) => setNewObject(prev => ({ ...prev, facilityType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="hydropower">ГЭС</option>
                      <option value="dam">Плотина</option>
                      <option value="lock">Шлюз</option>
                      <option value="pumping_station">Насосная станция</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Категория</label>
                    <select
                      value={newObject.condition}
                      onChange={(e) => setNewObject(prev => ({ ...prev, condition: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Широта</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={newObject.lat}
                      onChange={(e) => setNewObject(prev => ({ ...prev, lat: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      placeholder="48.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Долгота</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={newObject.lng}
                      onChange={(e) => setNewObject(prev => ({ ...prev, lng: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      placeholder="66.92"
                      required
                    />
                  </div>
                </div>

                {pendingCoords && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800">
                    <span>
                      Клик по карте: {pendingCoords.lat.toFixed(6)}, {pendingCoords.lng.toFixed(6)}
                    </span>
                  </div>
                )}

                {createError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{createError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={closeCreateForm}
                    className="px-5 py-3 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMap;
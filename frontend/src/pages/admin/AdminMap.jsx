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
  Info
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

// API Configuration
const API_KEY = '6f92f492-dc8f-4a23-a6ab-3addf4714b98';
const API_BASE_URL = 'https://api.maptiler.com/maps';

// Компонент для интеграции с Leaflet
const LeafletMap = ({ mapObjects, activeLayers, onObjectClick, editMode, mapView }) => {
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
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [mapObjects, activeLayers]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      changeMapView();
    }
  }, [mapView]);

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

    mapInstanceRef.current.on('click', (e) => {
      if (editMode) {
        console.log('Клик на карте:', e.latlng);
      }
    });
  };

  const updateMarkers = () => {
    if (!window.L) return;
    
    const L = window.L;
    
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const getConditionColor = (condition) => {
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
      const color = getConditionColor(condition);
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
        const marker = L.marker([wb.lat, wb.lng], {
          icon: createIcon('waterBody', wb.condition, '💧')
        });

        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg mb-2">${wb.name}</h3>
            <p class="text-sm text-gray-600 mb-1">${wb.region}</p>
            <p class="text-sm">Категория: ${wb.condition}</p>
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
        const marker = L.marker([fac.lat, fac.lng], {
          icon: createIcon('facility', fac.condition, '⚡')
        });

        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg mb-2">${fac.name}</h3>
            <p class="text-sm text-gray-600 mb-1">${fac.region}</p>
            <p class="text-sm">Тип: ${fac.type}</p>
            <p class="text-sm">Категория: ${fac.condition}</p>
          </div>
        `);

        marker.on('click', () => {
          onObjectClick({ ...fac, type: 'facility' });
        });

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

    let tileUrl;
    switch (mapView) {
      case 'satellite':
        tileUrl = `${API_BASE_URL}/satellite/{z}/{x}/{y}.jpg?key=${API_KEY}`;
        break;
      case 'hybrid':
        tileUrl = `${API_BASE_URL}/hybrid/{z}/{x}/{y}.jpg?key=${API_KEY}`;
        break;
      default:
        tileUrl = `${API_BASE_URL}/streets-v2/{z}/{x}/{y}.png?key=${API_KEY}`;
    }

    L.tileLayer(tileUrl, {
      attribution: '© MapTiler © OpenStreetMap contributors',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1
    }).addTo(mapInstanceRef.current);
  };

  const zoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const fitBounds = () => {
    if (mapInstanceRef.current && markersRef.current.length > 0 && window.L) {
      const group = window.L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
            <Globe className="w-24 h-24 text-purple-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold mb-2">Загрузка карты...</p>
            <p className="text-gray-500 text-sm mb-4">
              Подключите Leaflet для отображения карты
            </p>
            <div className="text-left bg-gray-100 rounded-lg p-4 text-xs font-mono">
              <p className="text-purple-600 mb-1">{`<!-- В index.html -->`}</p>
              <p className="text-gray-700 mb-2">{`<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />`}</p>
              <p className="text-gray-700">{`<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>`}</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'none' }}>
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
        <button onClick={fitBounds}>Fit Bounds</button>
        <button onClick={resetView}>Reset</button>
      </div>
    </div>
  );
};

const AdminMap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
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
    waterBodies: [
      { id: 1, name: 'Озеро Балхаш', region: 'Алматинская область', condition: 3, lat: 46.8, lng: 75.0 },
      { id: 2, name: 'Река Иртыш', region: 'Павлодарская область', condition: 5, lat: 52.3, lng: 76.9 },
      { id: 3, name: 'Капшагайское вдхр.', region: 'Алматинская область', condition: 2, lat: 43.9, lng: 77.1 }
    ],
    facilities: [
      { id: 1, name: 'Бухтарминская ГЭС', type: 'hydropower', region: 'ВКО', condition: 2, lat: 47.5, lng: 83.1 },
      { id: 2, name: 'Капшагай ГЭС', type: 'hydropower', region: 'Алматинская область', condition: 3, lat: 43.9, lng: 77.1 },
      { id: 3, name: 'Плотина Сорбулак', type: 'dam', region: 'Алматинская область', condition: 4, lat: 43.3, lng: 77.0 }
    ]
  });

  useEffect(() => {
    loadMapData();
  }, [filters]);

  const loadMapData = async () => {
    try {
      console.log('Загрузка данных карты с фильтрами:', filters);
      // Здесь данные уже загружены в mock формате
      // При подключении бэкенда замените на реальный API вызов
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
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
  };

  const handleDeleteObject = async (objectId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот объект?')) {
      try {
        console.log('Удаление объекта:', objectId);
        setSelectedObject(null);
        loadMapData();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
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
          console.log('Данные импортированы:', data);
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

  return (
    <AdminLayout>
      <div className="h-screen bg-gray-50 flex flex-col">
      
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Globe className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Административная карта</h1>
              <p className="text-purple-100 text-sm">Полный контроль и управление объектами</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
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

      <div className="flex-1 flex overflow-hidden">
        
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск объектов на карте..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Фильтры</span>
              </button>
              
              <button
                onClick={() => setShowLayers(!showLayers)}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showLayers ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="text-sm font-medium">Слои</span>
              </button>

              <button
                onClick={() => setEditMode(!editMode)}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  editMode ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Редактор</span>
              </button>

              <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Добавить</span>
              </button>
            </div>
          </div>

          {showLayers && (
            <div className="p-4 border-b border-gray-200 bg-purple-50">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <Layers className="w-5 h-5 text-purple-600 mr-2" />
                Управление слоями
              </h3>
              <div className="space-y-2">
                {layerOptions.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <label key={layer.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors">
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

          {showFilters && (
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <Filter className="w-5 h-5 text-blue-600 mr-2" />
                Фильтрация объектов
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
                {mapObjects.waterBodies.map((wb) => (
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
                {mapObjects.facilities.map((fac) => (
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

        <div className="flex-1 relative bg-gray-200">
          
          <LeafletMap 
            ref={mapComponentRef}
            mapObjects={mapObjects}
            activeLayers={activeLayers}
            onObjectClick={handleObjectClick}
            editMode={editMode}
            mapView={mapView}
          />

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

            <div className="bg-white rounded-lg shadow-lg p-2">
              <button 
                onClick={() => setMapView('hybrid')}
                className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                  mapView === 'hybrid' ? 'bg-purple-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                Гибрид
              </button>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[1000]">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
              <Info className="w-5 h-5 text-purple-600 mr-2" />
              Легенда
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Категория 1 - Отличное</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                <span>Категория 2 - Хорошее</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Категория 3 - Среднее</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Категория 4 - Плохое</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Категория 5 - Критическое</span>
              </div>
            </div>
          </div>
        </div>

        {selectedObject && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Административная информация</p>
                    <p className="text-sm text-blue-800">
                      Вы можете редактировать, удалять или просматривать детальную информацию об этом объекте.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 space-y-2">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold">
                <Eye className="w-5 h-5" />
                <span>Просмотреть детали</span>
              </button>
              
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                <Edit3 className="w-5 h-5" />
                <span>Редактировать</span>
              </button>
              
              <button 
                onClick={() => handleDeleteObject(selectedObject.id)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                <Trash2 className="w-5 h-5" />
                <span>Удалить объект</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminMap;
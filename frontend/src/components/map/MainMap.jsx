import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { 
  Droplets, 
  Zap, 
  MapPin, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Locate,
  Filter,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Фикс для иконок Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Компонент для управления картой
const MapController = ({ center, zoom, onMoveEnd }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  useEffect(() => {
    map.on('moveend', () => {
      if (onMoveEnd) {
        onMoveEnd({
          center: map.getCenter(),
          zoom: map.getZoom()
        });
      }
    });
  }, [map, onMoveEnd]);

  return null;
};

// Компонент маркера водоёма
const WaterBodyMarker = ({ data, onClick }) => {
  const getColorByCondition = (condition) => {
    const colors = {
      1: '#10B981',
      2: '#84CC16',
      3: '#F59E0B',
      4: '#F97316',
      5: '#EF4444'
    };
    return colors[condition] || '#6B7280';
  };

  const icon = L.divIcon({
    html: `
      <div class="relative">
        <div class="w-10 h-10 rounded-full border-3 border-white shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform"
             style="background-color: ${getColorByCondition(data.technicalCondition)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
        </div>
        ${data.priority?.level === 'high' ? `
          <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full animate-pulse border-2 border-white flex items-center justify-center">
            <span class="text-white text-xs font-bold">!</span>
          </div>
        ` : ''}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  return (
    <Marker
      position={[data.coordinates.lat, data.coordinates.lng]}
      icon={icon}
      eventHandlers={{ click: () => onClick(data) }}
    >
      <Popup maxWidth={300}>
        <div className="p-2">
          <h3 className="font-bold text-lg mb-2 flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-blue-600" />
            {data.name}
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Область:</span>
              <span className="font-medium">{data.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Тип:</span>
              <span className="font-medium">{data.resourceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Состояние:</span>
              <span className="font-semibold" style={{ color: getColorByCondition(data.technicalCondition) }}>
                Категория {data.technicalCondition}
              </span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Компонент маркера ГТС
const HydroFacilityMarker = ({ data, onClick }) => {
  const getColorByCondition = (condition) => {
    const colors = {
      1: '#10B981',
      2: '#84CC16',
      3: '#F59E0B',
      4: '#F97316',
      5: '#EF4444'
    };
    return colors[condition] || '#6B7280';
  };

  const icon = L.divIcon({
    html: `
      <div class="relative">
        <div class="w-10 h-10 rounded-lg border-3 border-white shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform"
             style="background-color: ${getColorByCondition(data.technicalCondition)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        ${data.priority?.level === 'high' ? `
          <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full animate-pulse border-2 border-white flex items-center justify-center">
            <span class="text-white text-xs font-bold">!</span>
          </div>
        ` : ''}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  return (
    <Marker
      position={[data.coordinates.lat, data.coordinates.lng]}
      icon={icon}
      eventHandlers={{ click: () => onClick(data) }}
    >
      <Popup maxWidth={300}>
        <div className="p-2">
          <h3 className="font-bold text-lg mb-2 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-600" />
            {data.name}
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Область:</span>
              <span className="font-medium">{data.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Тип:</span>
              <span className="font-medium">{data.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Состояние:</span>
              <span className="font-semibold" style={{ color: getColorByCondition(data.technicalCondition) }}>
                Категория {data.technicalCondition}
              </span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Главный компонент карты
const MainMap = ({ 
  waterBodies = [], 
  hydroFacilities = [], 
  onObjectClick,
  initialCenter = [48.0196, 66.9237], // Казахстан
  initialZoom = 6,
  showControls = true,
  showLegend = true,
  showFilters = true,
  className = ''
}) => {
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [mapZoom, setMapZoom] = useState(initialZoom);
  const [showWaterBodies, setShowWaterBodies] = useState(true);
  const [showHydroFacilities, setShowHydroFacilities] = useState(true);
  const [selectedObject, setSelectedObject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Моковые данные для демонстрации
  const mockWaterBodies = waterBodies.length > 0 ? waterBodies : [
    {
      id: '1',
      name: 'Озеро Балхаш',
      region: 'Карагандинская область',
      resourceType: 'Озеро',
      coordinates: { lat: 46.8, lng: 74.9 },
      technicalCondition: 2,
      priority: { level: 'medium', score: 8 }
    },
    {
      id: '2',
      name: 'Капшагайское водохранилище',
      region: 'Алматинская область',
      resourceType: 'Водохранилище',
      coordinates: { lat: 43.8, lng: 77.0 },
      technicalCondition: 3,
      priority: { level: 'high', score: 13 }
    },
    {
      id: '3',
      name: 'Озеро Зайсан',
      region: 'Восточно-Казахстанская область',
      resourceType: 'Озеро',
      coordinates: { lat: 47.5, lng: 84.8 },
      technicalCondition: 1,
      priority: { level: 'low', score: 4 }
    }
  ];

  const mockHydroFacilities = hydroFacilities.length > 0 ? hydroFacilities : [
    {
      id: '1',
      name: 'Бухтарминская ГЭС',
      region: 'Восточно-Казахстанская область',
      type: 'ГЭС',
      coordinates: { lat: 47.1, lng: 83.5 },
      technicalCondition: 3,
      priority: { level: 'high', score: 12 }
    },
    {
      id: '2',
      name: 'Шульбинская ГЭС',
      region: 'Восточно-Казахстанская область',
      type: 'ГЭС',
      coordinates: { lat: 50.2, lng: 82.2 },
      technicalCondition: 2,
      priority: { level: 'medium', score: 9 }
    },
    {
      id: '3',
      name: 'Капшагайская ГЭС',
      region: 'Алматинская область',
      type: 'ГЭС',
      coordinates: { lat: 43.9, lng: 77.1 },
      technicalCondition: 4,
      priority: { level: 'high', score: 14 }
    }
  ];

  const handleObjectClick = (object) => {
    setSelectedObject(object);
    if (onObjectClick) {
      onObjectClick(object);
    }
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 4));
  };

  const handleResetView = () => {
    setMapCenter(initialCenter);
    setMapZoom(initialZoom);
  };

  const filteredWaterBodies = mockWaterBodies.filter(wb =>
    wb.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHydroFacilities = mockHydroFacilities.filter(hf =>
    hf.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Поисковая панель */}
      {showFilters && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg p-4 max-w-md">
          <div className="flex items-center space-x-2 mb-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск объектов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <span className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры слоёв
            </span>
            {isFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isFiltersOpen && (
            <div className="mt-3 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWaterBodies}
                  onChange={(e) => setShowWaterBodies(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <Droplets className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Водоёмы ({filteredWaterBodies.length})</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHydroFacilities}
                  onChange={(e) => setShowHydroFacilities(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-sm">ГТС ({filteredHydroFacilities.length})</span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Элементы управления картой */}
      {showControls && (
        <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
            title="Приблизить"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
            title="Отдалить"
          >
            <ZoomOut className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleResetView}
            className="bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
            title="Вернуться к обзору"
          >
            <Locate className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Легенда */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-xl shadow-lg p-4 max-w-xs">
          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className="flex items-center justify-between w-full mb-2 font-semibold text-gray-800"
          >
            <span className="flex items-center">
              <Layers className="w-5 h-5 mr-2" />
              Легенда
            </span>
            {isLegendOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isLegendOpen && (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Техническое состояние:</p>
                <div className="space-y-1">
                  {[
                    { level: 1, color: '#10B981', label: 'Отличное' },
                    { level: 2, color: '#84CC16', label: 'Хорошее' },
                    { level: 3, color: '#F59E0B', label: 'Удовлетворительное' },
                    { level: 4, color: '#F97316', label: 'Плохое' },
                    { level: 5, color: '#EF4444', label: 'Критическое' }
                  ].map(item => (
                    <div key={item.level} className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Типы объектов:</p>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span className="text-xs">Водоёмы</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-orange-600" />
                    <span className="text-xs">ГТС</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="text-xs">Высокий приоритет</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Карта */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full rounded-xl"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController 
          center={mapCenter} 
          zoom={mapZoom}
          onMoveEnd={(state) => {
            setMapCenter([state.center.lat, state.center.lng]);
            setMapZoom(state.zoom);
          }}
        />

        {/* Маркеры водоёмов */}
        {showWaterBodies && filteredWaterBodies.map(wb => (
          <WaterBodyMarker 
            key={wb.id} 
            data={wb} 
            onClick={handleObjectClick}
          />
        ))}

        {/* Маркеры ГТС */}
        {showHydroFacilities && filteredHydroFacilities.map(hf => (
          <HydroFacilityMarker 
            key={hf.id} 
            data={hf} 
            onClick={handleObjectClick}
          />
        ))}
      </MapContainer>

      {/* Информационная панель выбранного объекта */}
      {selectedObject && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-xl p-4 max-w-sm">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg flex items-center">
              {selectedObject.type ? (
                <Zap className="w-5 h-5 mr-2 text-orange-600" />
              ) : (
                <Droplets className="w-5 h-5 mr-2 text-blue-600" />
              )}
              {selectedObject.name}
            </h3>
            <button onClick={() => setSelectedObject(null)}>
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Область:</span>
              <span className="font-medium">{selectedObject.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Тип:</span>
              <span className="font-medium">{selectedObject.resourceType || selectedObject.type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Приоритет:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                selectedObject.priority?.level === 'high' ? 'bg-red-100 text-red-800' :
                selectedObject.priority?.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {selectedObject.priority?.level === 'high' ? 'Высокий' :
                 selectedObject.priority?.level === 'medium' ? 'Средний' : 'Низкий'}
              </span>
            </div>
          </div>

          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Info className="w-4 h-4 mr-2" />
            Подробнее
          </button>
        </div>
      )}
    </div>
  );
};

export default MainMap;
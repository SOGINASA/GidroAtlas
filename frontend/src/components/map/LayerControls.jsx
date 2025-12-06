import React, { useState } from 'react';
import { 
  Layers, 
  Droplets, 
  Zap, 
  MapPin,
  Waves,
  Mountain,
  Wind,
  CloudRain,
  Thermometer,
  Navigation,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Grid3x3,
  Satellite,
  Map
} from 'lucide-react';

const LayerControls = ({ 
  activeLayers = {},
  onLayerToggle,
  position = 'topright',
  userRole = 'guest'
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('objects');

  // Базовые слои карты
  const baseLayers = [
    {
      id: 'osm',
      name: 'OpenStreetMap',
      icon: Map,
      description: 'Стандартная карта',
      active: activeLayers.osm !== false
    },
    {
      id: 'satellite',
      name: 'Спутник',
      icon: Satellite,
      description: 'Спутниковые снимки',
      active: activeLayers.satellite === true
    },
    {
      id: 'terrain',
      name: 'Рельеф',
      icon: Mountain,
      description: 'Карта рельефа',
      active: activeLayers.terrain === true
    }
  ];

  // Слои объектов
  const objectLayers = [
    {
      id: 'waterBodies',
      name: 'Водоёмы',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Озёра, каналы, водохранилища',
      count: activeLayers.waterBodiesCount || 1247,
      active: activeLayers.waterBodies !== false,
      allowedRoles: ['guest', 'expert', 'emergency', 'admin']
    },
    {
      id: 'facilities',
      name: 'ГТС',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Гидротехнические сооружения',
      count: activeLayers.facilitiesCount || 456,
      active: activeLayers.facilities !== false,
      allowedRoles: ['guest', 'expert', 'emergency', 'admin']
    },
    {
      id: 'regions',
      name: 'Границы регионов',
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Административные границы',
      active: activeLayers.regions !== false,
      allowedRoles: ['guest', 'expert', 'emergency', 'admin']
    },
    {
      id: 'rivers',
      name: 'Реки',
      icon: Waves,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      description: 'Речная сеть',
      active: activeLayers.rivers === true,
      allowedRoles: ['expert', 'emergency', 'admin']
    }
  ];

  // Слои данных (доступны только экспертам и выше)
  const dataLayers = [
    {
      id: 'waterQuality',
      name: 'Качество воды',
      icon: CloudRain,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Показатели качества воды',
      active: activeLayers.waterQuality === true,
      allowedRoles: ['expert', 'emergency', 'admin']
    },
    {
      id: 'temperature',
      name: 'Температура',
      icon: Thermometer,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Температурные данные',
      active: activeLayers.temperature === true,
      allowedRoles: ['expert', 'emergency', 'admin']
    },
    {
      id: 'windData',
      name: 'Ветер',
      icon: Wind,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      description: 'Направление и скорость ветра',
      active: activeLayers.windData === true,
      allowedRoles: ['expert', 'emergency', 'admin']
    },
    {
      id: 'criticalZones',
      name: 'Критические зоны',
      icon: Navigation,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Зоны повышенного риска',
      active: activeLayers.criticalZones === true,
      allowedRoles: ['emergency', 'admin']
    }
  ];

  // Проверка доступа к слою
  const hasAccess = (layer) => {
    if (!layer.allowedRoles) return true;
    return layer.allowedRoles.includes(userRole);
  };

  // Переключение слоя
  const handleToggle = (layerId) => {
    if (onLayerToggle) {
      onLayerToggle(layerId, !activeLayers[layerId]);
    }
  };

  // Включить/выключить все слои в категории
  const toggleAllInCategory = (layers, enable) => {
    layers.forEach(layer => {
      if (hasAccess(layer) && onLayerToggle) {
        onLayerToggle(layer.id, enable);
      }
    });
  };

  // Рендер переключателя слоя
  const LayerToggle = ({ layer }) => {
    const Icon = layer.icon;
    const isAccessible = hasAccess(layer);

    if (!isAccessible) return null;

    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
          layer.active
            ? `${layer.bgColor} ${layer.borderColor}`
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleToggle(layer.id)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            layer.active ? layer.bgColor : 'bg-gray-100'
          }`}>
            <Icon className={`w-5 h-5 ${layer.active ? layer.color : 'text-gray-400'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className={`font-semibold text-sm ${
                layer.active ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {layer.name}
              </p>
              {layer.count && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  layer.active ? `${layer.bgColor} ${layer.color}` : 'bg-gray-100 text-gray-500'
                }`}>
                  {layer.count}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{layer.description}</p>
          </div>
        </div>
        <div className="ml-2">
          {layer.active ? (
            <Eye className={`w-5 h-5 ${layer.color}`} />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    );
  };

  // Рендер базового слоя (радио-кнопки)
  const BaseLayerToggle = ({ layer }) => {
    const Icon = layer.icon;
    
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
          layer.active
            ? 'bg-blue-50 border-blue-300'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleToggle(layer.id)}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            layer.active ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Icon className={`w-5 h-5 ${layer.active ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className={`font-semibold text-sm ${
              layer.active ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {layer.name}
            </p>
            <p className="text-xs text-gray-500">{layer.description}</p>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          layer.active ? 'border-blue-600' : 'border-gray-300'
        }`}>
          {layer.active && (
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`leaflet-${position}`}>
      <div className="leaflet-control bg-white rounded-xl shadow-xl m-4 overflow-hidden" style={{ maxWidth: '380px' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-6 h-6" />
              <h3 className="font-bold text-lg">Слои карты</h3>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-4">
            {/* Tabs */}
            <div className="flex space-x-2 mb-4 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('base')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'base'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                <span>Базовый</span>
              </button>
              <button
                onClick={() => setActiveTab('objects')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'objects'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Объекты</span>
              </button>
              {['expert', 'emergency', 'admin'].includes(userRole) && (
                <button
                  onClick={() => setActiveTab('data')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    activeTab === 'data'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Данные</span>
                </button>
              )}
            </div>

            {/* Base Layers Tab */}
            {activeTab === 'base' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">Тип карты</p>
                </div>
                {baseLayers.map(layer => (
                  <BaseLayerToggle key={layer.id} layer={layer} />
                ))}
              </div>
            )}

            {/* Object Layers Tab */}
            {activeTab === 'objects' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Объекты на карте
                  </p>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => toggleAllInCategory(objectLayers, true)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
                    >
                      Все
                    </button>
                    <button
                      onClick={() => toggleAllInCategory(objectLayers, false)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Нет
                    </button>
                  </div>
                </div>
                {objectLayers.map(layer => (
                  <LayerToggle key={layer.id} layer={layer} />
                ))}
              </div>
            )}

            {/* Data Layers Tab */}
            {activeTab === 'data' && ['expert', 'emergency', 'admin'].includes(userRole) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Данные и аналитика
                  </p>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => toggleAllInCategory(dataLayers, true)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
                    >
                      Все
                    </button>
                    <button
                      onClick={() => toggleAllInCategory(dataLayers, false)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Нет
                    </button>
                  </div>
                </div>
                {dataLayers.map(layer => (
                  <LayerToggle key={layer.id} layer={layer} />
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Активных слоёв:</span>
                <span className="font-bold text-blue-600">
                  {Object.values(activeLayers).filter(v => v === true).length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed State */}
        {!isExpanded && (
          <div className="p-3 text-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              Развернуть панель →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayerControls;
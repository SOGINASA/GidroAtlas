import React, { useState } from 'react';
import { GeoJSON, Popup } from 'react-leaflet';
import { 
  MapPin, 
  Droplets, 
  Zap, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const RegionBoundaries = ({ 
  regions, 
  selectedRegion, 
  onRegionClick, 
  showLabels = true,
  showStatistics = true 
}) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Областные данные Казахстана (моковые координаты границ)
  const kazakhstanRegions = {
    'Акмолинская': {
      center: [51.1694, 71.4491],
      stats: { waterBodies: 87, facilities: 23, priority: 'medium' }
    },
    'Актюбинская': {
      center: [50.2839, 57.1670],
      stats: { waterBodies: 64, facilities: 18, priority: 'low' }
    },
    'Алматинская': {
      center: [45.0000, 78.0000],
      stats: { waterBodies: 156, facilities: 42, priority: 'high' }
    },
    'Атырауская': {
      center: [47.1164, 51.8830],
      stats: { waterBodies: 92, facilities: 31, priority: 'high' }
    },
    'Восточно-Казахстанская': {
      center: [49.9484, 82.6283],
      stats: { waterBodies: 203, facilities: 67, priority: 'medium' }
    },
    'Жамбылская': {
      center: [43.3000, 71.3700],
      stats: { waterBodies: 78, facilities: 26, priority: 'medium' }
    },
    'Западно-Казахстанская': {
      center: [51.2167, 51.3667],
      stats: { waterBodies: 71, facilities: 19, priority: 'low' }
    },
    'Карагандинская': {
      center: [49.8047, 73.0894],
      stats: { waterBodies: 134, facilities: 38, priority: 'high' }
    },
    'Костанайская': {
      center: [53.2144, 63.6246],
      stats: { waterBodies: 95, facilities: 28, priority: 'medium' }
    },
    'Кызылординская': {
      center: [44.8528, 62.6350],
      stats: { waterBodies: 112, facilities: 34, priority: 'high' }
    },
    'Мангистауская': {
      center: [44.6058, 54.1139],
      stats: { waterBodies: 45, facilities: 15, priority: 'low' }
    },
    'Павлодарская': {
      center: [52.2873, 76.9674],
      stats: { waterBodies: 118, facilities: 41, priority: 'high' }
    },
    'Северо-Казахстанская': {
      center: [54.8667, 69.1500],
      stats: { waterBodies: 89, facilities: 25, priority: 'medium' }
    },
    'Туркестанская': {
      center: [43.3667, 68.4167],
      stats: { waterBodies: 98, facilities: 29, priority: 'medium' }
    },
    'Улытауская': {
      center: [48.0000, 66.0000],
      stats: { waterBodies: 56, facilities: 17, priority: 'low' }
    },
    'Абайская': {
      center: [49.5000, 78.5000],
      stats: { waterBodies: 73, facilities: 22, priority: 'medium' }
    },
    'Жетісуская': {
      center: [45.0000, 80.0000],
      stats: { waterBodies: 84, facilities: 24, priority: 'medium' }
    }
  };

  // Получить цвет границы региона в зависимости от приоритета
  const getRegionColor = (priority, isSelected, isHovered) => {
    if (isSelected) return '#8B5CF6'; // Фиолетовый для выбранного
    if (isHovered) return '#3B82F6'; // Синий при наведении
    
    const colors = {
      high: '#EF4444',    // Красный - высокий приоритет
      medium: '#F59E0B',  // Жёлтый - средний приоритет
      low: '#10B981'      // Зелёный - низкий приоритет
    };
    return colors[priority] || '#6B7280';
  };

  // Получить прозрачность заливки
  const getFillOpacity = (isSelected, isHovered) => {
    if (isSelected) return 0.3;
    if (isHovered) return 0.2;
    return 0.1;
  };

  // Стиль для GeoJSON
  const getRegionStyle = (regionName) => {
    const regionData = kazakhstanRegions[regionName];
    const isSelected = selectedRegion === regionName;
    const isHovered = hoveredRegion === regionName;

    return {
      fillColor: getRegionColor(regionData?.stats?.priority, isSelected, isHovered),
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: 1,
      color: getRegionColor(regionData?.stats?.priority, isSelected, isHovered),
      fillOpacity: getFillOpacity(isSelected, isHovered)
    };
  };

  // Обработчики событий для региона
  const onEachRegion = (feature, layer) => {
    const regionName = feature.properties.name;
    const regionData = kazakhstanRegions[regionName];

    layer.on({
      mouseover: (e) => {
        setHoveredRegion(regionName);
        e.target.setStyle({
          weight: 3,
          fillOpacity: 0.25
        });
      },
      mouseout: (e) => {
        setHoveredRegion(null);
        layer.setStyle(getRegionStyle(regionName));
      },
      click: () => {
        if (onRegionClick) {
          onRegionClick(regionName, regionData);
        }
      }
    });

    // Popup со статистикой региона
    if (showStatistics && regionData) {
      layer.bindPopup(() => {
        const stats = regionData.stats;
        const priorityConfig = {
          high: { 
            bg: 'bg-red-100', 
            text: 'text-red-800', 
            border: 'border-red-300', 
            label: 'Высокий',
            icon: AlertTriangle 
          },
          medium: { 
            bg: 'bg-yellow-100', 
            text: 'text-yellow-800', 
            border: 'border-yellow-300', 
            label: 'Средний',
            icon: TrendingUp 
          },
          low: { 
            bg: 'bg-green-100', 
            text: 'text-green-800', 
            border: 'border-green-300', 
            label: 'Низкий',
            icon: CheckCircle 
          }
        };

        const config = priorityConfig[stats.priority];
        const PriorityIcon = config.icon;

        return `
          <div class="p-3 min-w-[280px]">
            <div class="mb-3">
              <h3 class="font-bold text-lg text-gray-900 mb-1">${regionName}</h3>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border}">
                <span class="font-semibold text-sm">Приоритет: ${config.label}</span>
              </div>
            </div>

            <div class="space-y-3 mb-4">
              <div class="flex items-center justify-between py-2 border-b border-gray-100">
                <div class="flex items-center text-gray-600">
                  <span class="text-sm mr-2">💧</span>
                  <span class="text-sm">Водоёмов</span>
                </div>
                <span class="font-bold text-blue-600 text-lg">${stats.waterBodies}</span>
              </div>

              <div class="flex items-center justify-between py-2 border-b border-gray-100">
                <div class="flex items-center text-gray-600">
                  <span class="text-sm mr-2">⚡</span>
                  <span class="text-sm">ГТС</span>
                </div>
                <span class="font-bold text-orange-600 text-lg">${stats.facilities}</span>
              </div>

              <div class="flex items-center justify-between py-2">
                <div class="flex items-center text-gray-600">
                  <span class="text-sm mr-2">📊</span>
                  <span class="text-sm">Всего объектов</span>
                </div>
                <span class="font-bold text-purple-600 text-lg">${stats.waterBodies + stats.facilities}</span>
              </div>
            </div>

            <button 
              onclick="window.dispatchEvent(new CustomEvent('region-select', { detail: '${regionName}' }))"
              class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm"
            >
              Показать объекты региона →
            </button>
          </div>
        `;
      }, { 
        maxWidth: 300,
        className: 'custom-region-popup'
      });
    }

    // Tooltip с названием региона
    if (showLabels) {
      layer.bindTooltip(regionName, {
        permanent: false,
        direction: 'center',
        className: 'region-label-tooltip'
      });
    }
  };

  // Статистика по всем регионам
  const StatisticsLegend = () => {
    const totalWaterBodies = Object.values(kazakhstanRegions).reduce(
      (sum, r) => sum + r.stats.waterBodies, 0
    );
    const totalFacilities = Object.values(kazakhstanRegions).reduce(
      (sum, r) => sum + r.stats.facilities, 0
    );
    const highPriorityRegions = Object.values(kazakhstanRegions).filter(
      r => r.stats.priority === 'high'
    ).length;

    return (
      <div className="leaflet-bottom leaflet-right">
        <div className="leaflet-control bg-white rounded-lg shadow-lg p-4 m-4 max-w-xs">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Статистика по регионам
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                <span>Всего водоёмов</span>
              </div>
              <span className="font-bold text-blue-600">{totalWaterBodies}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <Zap className="w-4 h-4 mr-2 text-orange-500" />
                <span>Всего ГТС</span>
              </div>
              <span className="font-bold text-orange-600">{totalFacilities}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2 text-purple-500" />
                <span>Регионов</span>
              </div>
              <span className="font-bold text-purple-600">{Object.keys(kazakhstanRegions).length}</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center text-gray-600">
                <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                <span>Высокий приоритет</span>
              </div>
              <span className="font-bold text-red-600">{highPriorityRegions}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-semibold">Легенда приоритетов:</p>
            <div className="space-y-1.5">
              <div className="flex items-center text-xs">
                <div className="w-4 h-4 rounded mr-2 border-2 border-red-500" style={{ backgroundColor: '#EF4444' }}></div>
                <span className="text-gray-700">Высокий приоритет</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-4 h-4 rounded mr-2 border-2 border-yellow-500" style={{ backgroundColor: '#F59E0B' }}></div>
                <span className="text-gray-700">Средний приоритет</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-4 h-4 rounded mr-2 border-2 border-green-500" style={{ backgroundColor: '#10B981' }}></div>
                <span className="text-gray-700">Низкий приоритет</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // В реальном приложении regions должен быть GeoJSON с границами областей
  // Здесь показана структура компонента
  if (!regions || !regions.features) {
    return showStatistics ? <StatisticsLegend /> : null;
  }

  return (
    <>
      <GeoJSON
        data={regions}
        style={(feature) => getRegionStyle(feature.properties.name)}
        onEachFeature={onEachRegion}
      />
      
      {showStatistics && <StatisticsLegend />}

      <style jsx>{`
        .custom-region-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        .custom-region-popup .leaflet-popup-content {
          margin: 0;
        }
        .region-label-tooltip {
          background-color: rgba(0, 0, 0, 0.75);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 600;
          font-size: 13px;
          padding: 6px 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .region-label-tooltip::before {
          border-top-color: rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </>
  );
};

export default RegionBoundaries;
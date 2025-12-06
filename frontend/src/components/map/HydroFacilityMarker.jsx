import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { 
  Zap, 
  MapPin, 
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  Info,
  TrendingUp,
  Settings,
  Factory,
  Dam,
  Waves
} from 'lucide-react';

const HydroFacilityMarker = ({ data, onClick, showTooltip = true, showPopup = true }) => {
  // Цвета по категории технического состояния
  const getColorByCondition = (condition) => {
    const colors = {
      1: '#10B981',  // Категория 1 - Зелёный
      2: '#84CC16',  // Категория 2 - Салатовый
      3: '#F59E0B',  // Категория 3 - Жёлтый
      4: '#F97316',  // Категория 4 - Оранжевый
      5: '#EF4444'   // Категория 5 - Красный
    };
    return colors[condition] || '#6B7280';
  };

  // Получение иконки по типу ГТС
  const getIconByType = (type) => {
    const icons = {
      hydropower: '⚡',      // ГЭС
      dam: '🏗️',            // Плотина
      canal: '〰️',          // Канал
      lock: '🚪',           // Шлюз
      reservoir: '💧',      // Водохранилище
      pumping_station: '⬆️' // Насосная станция
    };
    return icons[type] || '⚙️';
  };

  // Получение SVG иконки для маркера
  const getSvgIcon = (type) => {
    const svgIcons = {
      hydropower: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
      dam: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      canal: '<path d="M3 12h18M3 6h18M3 18h18"/>',
      lock: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 10h10M7 14h10"/>',
      reservoir: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
      pumping_station: '<path d="m5 12 5-5 5 5M12 19V7"/>'
    };
    return svgIcons[type] || '<circle cx="12" cy="12" r="10"/>';
  };

  // Получение текстового названия типа
  const getTypeLabel = (type) => {
    const labels = {
      hydropower: 'ГЭС',
      dam: 'Плотина',
      canal: 'Канал',
      lock: 'Шлюз',
      reservoir: 'Водохранилище',
      pumping_station: 'Насосная станция'
    };
    return labels[type] || 'ГТС';
  };

  // Получение статуса объекта
  const getStatusInfo = (condition) => {
    const statuses = {
      1: { label: 'Отличное', icon: 'check', color: '#10B981' },
      2: { label: 'Хорошее', icon: 'check', color: '#84CC16' },
      3: { label: 'Удовлетворительное', icon: 'alert', color: '#F59E0B' },
      4: { label: 'Плохое', icon: 'alert', color: '#F97316' },
      5: { label: 'Критическое', icon: 'x', color: '#EF4444' }
    };
    return statuses[condition] || { label: 'Неизвестно', icon: 'help', color: '#6B7280' };
  };

  // Создание кастомной иконки маркера
  const createCustomIcon = () => {
    const color = getColorByCondition(data.technicalCondition);
    const svgPath = getSvgIcon(data.type);
    const hasHighPriority = data.priority?.level === 'high';

    return L.divIcon({
      html: `
        <div class="relative">
          <div class="hydro-marker-container" style="background-color: ${color}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              ${svgPath}
            </svg>
          </div>
          ${hasHighPriority ? `
            <div class="priority-badge">
              <span class="priority-exclamation">!</span>
            </div>
          ` : ''}
        </div>
        <style>
          .hydro-marker-container {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            border: 3px solid white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            cursor: pointer;
          }
          .hydro-marker-container:hover {
            transform: scale(1.15);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          .priority-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 18px;
            height: 18px;
            background-color: #EF4444;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          .priority-exclamation {
            color: white;
            font-size: 11px;
            font-weight: bold;
            line-height: 1;
          }
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            50% {
              box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
            }
          }
        </style>
      `,
      className: 'custom-hydro-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Получение бейджа приоритета
  const getPriorityBadge = (priority) => {
    if (!priority) return null;

    const styles = {
      high: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Высокий' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: 'Средний' },
      low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Низкий' }
    };

    const style = styles[priority.level] || styles.low;

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
        <span className="text-xs font-semibold">{style.label}</span>
        {priority.score && (
          <span className="text-xs">({priority.score})</span>
        )}
      </div>
    );
  };

  const statusInfo = getStatusInfo(data.technicalCondition);

  return (
    <Marker
      position={[data.coordinates.lat, data.coordinates.lng]}
      icon={createCustomIcon()}
      eventHandlers={{
        click: () => onClick && onClick(data)
      }}
    >
      {/* Tooltip - краткая информация при наведении */}
      {showTooltip && (
        <Tooltip 
          direction="top" 
          offset={[0, -28]} 
          opacity={0.95}
          className="custom-tooltip"
        >
          <div className="min-w-[220px]">
            <div className="font-bold text-base mb-1 flex items-center">
              <Zap className="w-4 h-4 mr-1" style={{ color: getColorByCondition(data.technicalCondition) }} />
              {data.name}
            </div>
            <div className="text-xs text-gray-600 mb-2">{data.region}</div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Тип:</span>
                <span className="text-xs font-medium">{getTypeLabel(data.type)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Состояние:</span>
                <span 
                  className="text-xs font-semibold" 
                  style={{ color: statusInfo.color }}
                >
                  Категория {data.technicalCondition}
                </span>
              </div>
              {data.priority && (
                <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Приоритет:</span>
                  {getPriorityBadge(data.priority)}
                </div>
              )}
            </div>
          </div>
        </Tooltip>
      )}

      {/* Popup - подробная информация при клике */}
      {showPopup && (
        <Popup maxWidth={380} className="custom-popup">
          <div className="p-3">
            {/* Заголовок */}
            <div className="mb-4">
              <h3 className="font-bold text-xl mb-2 flex items-center">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-md"
                  style={{ backgroundColor: getColorByCondition(data.technicalCondition) }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div>{data.name}</div>
                  <div className="text-sm text-gray-500 font-normal">{data.name_kz}</div>
                </div>
              </h3>
            </div>

            {/* Основная информация */}
            <div className="space-y-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      Область
                    </div>
                    <div className="font-semibold text-sm">{data.region}</div>
                  </div>
                  <div>
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <Factory className="w-3 h-3 mr-1" />
                      Тип
                    </div>
                    <div className="font-semibold text-sm">{getTypeLabel(data.type)}</div>
                  </div>
                </div>
              </div>

              {/* Техническое состояние */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    Техническое состояние
                  </span>
                  <div 
                    className="px-3 py-1 rounded-full text-white font-bold text-sm shadow-md"
                    style={{ backgroundColor: statusInfo.color }}
                  >
                    Категория {data.technicalCondition}
                  </div>
                </div>
                <div className="text-xs text-gray-600">{statusInfo.label}</div>
              </div>

              {/* Дата паспорта */}
              {data.passportDate && (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Дата паспорта:</span>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatDate(data.passportDate)}
                    {data.passportAge && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({data.passportAge} {data.passportAge === 1 ? 'год' : data.passportAge < 5 ? 'года' : 'лет'})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Год ввода в эксплуатацию */}
              {data.commissionedYear && (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-xs text-gray-600">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Год ввода:</span>
                  </div>
                  <div className="text-sm font-semibold">{data.commissionedYear}</div>
                </div>
              )}

              {/* Приоритет обследования */}
              {data.priority && (
                <div className="bg-white border-2 rounded-lg p-3" style={{ 
                  borderColor: data.priority.level === 'high' ? '#EF4444' : 
                               data.priority.level === 'medium' ? '#F59E0B' : '#10B981' 
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Приоритет обследования
                    </span>
                    {getPriorityBadge(data.priority)}
                  </div>
                  {data.priority.mlProbability && (
                    <div className="text-xs text-gray-600 mt-1">
                      ML вероятность: <span className="font-semibold">
                        {(data.priority.mlProbability * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                  {data.priority.needsInspection && (
                    <div className="mt-2 flex items-center text-xs text-red-700 bg-red-50 px-2 py-1 rounded">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Требует обследования
                    </div>
                  )}
                </div>
              )}

              {/* Технические характеристики */}
              {data.technicalSpecs && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    Технические характеристики
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {data.technicalSpecs.capacity && (
                      <div>
                        <span className="text-gray-600">Мощность:</span>
                        <div className="font-semibold">{data.technicalSpecs.capacity} МВт</div>
                      </div>
                    )}
                    {data.technicalSpecs.height && (
                      <div>
                        <span className="text-gray-600">Высота:</span>
                        <div className="font-semibold">{data.technicalSpecs.height} м</div>
                      </div>
                    )}
                    {data.technicalSpecs.turbines && (
                      <div>
                        <span className="text-gray-600">Турбин:</span>
                        <div className="font-semibold">{data.technicalSpecs.turbines}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Действия */}
            <div className="flex gap-2">
              {data.pdfUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(data.pdfUrl, '_blank');
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-semibold shadow-md hover:shadow-lg"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Паспорт
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick && onClick(data);
                }}
                className="flex-1 bg-gray-100 text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm font-semibold"
              >
                <Info className="w-4 h-4 mr-2" />
                Подробнее
              </button>
            </div>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default HydroFacilityMarker;
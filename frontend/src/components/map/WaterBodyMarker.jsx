import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { 
  Droplets, 
  MapPin, 
  Calendar, 
  FileText, 
  AlertCircle,
  Fish,
  Waves
} from 'lucide-react';

const WaterBodyMarker = ({ data, onClick }) => {
  // Цвета по категории технического состояния (из ТЗ)
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

  // Иконки по типу водного ресурса
  const getResourceIcon = (resourceType) => {
    const icons = {
      lake: '🏞️',        // Озеро
      canal: '〰️',       // Канал
      reservoir: '💧'    // Водохранилище
    };
    return icons[resourceType] || '💧';
  };

  // Название типа водного ресурса
  const getResourceTypeLabel = (resourceType) => {
    const labels = {
      lake: 'Озеро',
      canal: 'Канал',
      reservoir: 'Водохранилище'
    };
    return labels[resourceType] || resourceType;
  };

  // Создание кастомной иконки маркера
  const getIcon = (resourceType, condition, priority) => {
    const color = getColorByCondition(condition);
    const icon = getResourceIcon(resourceType);

    return L.divIcon({
      html: `
        <div class="relative">
          <div class="w-12 h-12 rounded-full border-3 border-white shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer"
               style="background-color: ${color}">
            <span class="text-2xl">${icon}</span>
          </div>
          ${priority.level === 'high' ? `
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full animate-pulse border-2 border-white flex items-center justify-center">
              <span class="text-white text-xs font-bold">!</span>
            </div>
          ` : ''}
        </div>
      `,
      className: 'custom-waterbody-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24]
    });
  };

  // Бейдж приоритета
  const PriorityBadge = ({ level, score }) => {
    const styles = {
      high: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Высокий' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: 'Средний' },
      low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Низкий' }
    }[level] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', label: 'Не определён' };

    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-semibold ${styles.bg} ${styles.text} ${styles.border}`}>
        <span>{styles.label}</span>
        <span className="opacity-75">({score})</span>
      </div>
    );
  };

  return (
    <Marker
      position={[data.coordinates.lat, data.coordinates.lng]}
      icon={getIcon(data.resourceType, data.technicalCondition, data.priority)}
      eventHandlers={{
        click: () => onClick && onClick(data)
      }}
    >
      {/* Tooltip при наведении */}
      <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
        <div className="text-sm min-w-[220px]">
          <div className="font-bold text-base mb-1 text-gray-900">{data.name}</div>
          <div className="text-xs text-gray-600 mb-2">{data.region}</div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Тип:</span>
              <span className="font-medium text-gray-900">{getResourceTypeLabel(data.resourceType)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Состояние:</span>
              <span 
                className="px-2 py-0.5 rounded-full text-white text-xs font-semibold"
                style={{ backgroundColor: getColorByCondition(data.technicalCondition) }}
              >
                Категория {data.technicalCondition}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-gray-200">
              <span className="text-gray-600">Приоритет:</span>
              <PriorityBadge level={data.priority.level} score={data.priority.score} />
            </div>
          </div>
        </div>
      </Tooltip>

      {/* Popup при клике */}
      <Popup maxWidth={380} className="custom-popup">
        <div className="p-1">
          {/* Заголовок */}
          <div className="mb-4">
            <h3 className="font-bold text-xl mb-1 text-gray-900">{data.name}</h3>
            {data.name_kz && (
              <p className="text-sm text-gray-600 italic">{data.name_kz}</p>
            )}
          </div>

          {/* Основная информация */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Область</span>
              </div>
              <span className="font-semibold text-gray-900">{data.region}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <Droplets className="w-4 h-4 mr-2" />
                <span className="text-sm">Тип</span>
              </div>
              <span className="font-semibold text-gray-900">{getResourceTypeLabel(data.resourceType)}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <Waves className="w-4 h-4 mr-2" />
                <span className="text-sm">Тип воды</span>
              </div>
              <span className="font-semibold text-gray-900">
                {data.waterType === 'fresh' ? 'Пресная' : 'Непресная'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <Fish className="w-4 h-4 mr-2" />
                <span className="text-sm">Фауна</span>
              </div>
              <span className={`font-semibold ${data.fauna ? 'text-green-600' : 'text-gray-400'}`}>
                {data.fauna ? 'Есть' : 'Нет'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Дата паспорта</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900 block">
                  {new Date(data.passportDate).toLocaleDateString('ru-RU')}
                </span>
                <span className="text-xs text-gray-500">
                  ({data.passportAge} {data.passportAge === 1 ? 'год' : data.passportAge < 5 ? 'года' : 'лет'} назад)
                </span>
              </div>
            </div>
          </div>

          {/* Техническое состояние */}
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Техническое состояние</span>
              <div 
                className="px-3 py-1.5 rounded-full text-white font-bold text-sm shadow-sm"
                style={{ backgroundColor: getColorByCondition(data.technicalCondition) }}
              >
                Категория {data.technicalCondition}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  backgroundColor: getColorByCondition(data.technicalCondition),
                  width: `${(6 - data.technicalCondition) * 20}%`
                }}
              />
            </div>
          </div>

          {/* Приоритет обследования */}
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-gray-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Приоритет обследования</span>
              </div>
              <PriorityBadge level={data.priority.level} score={data.priority.score} />
            </div>
            {data.priority.needsInspection && (
              <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-800 font-semibold flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1.5" />
                  Требуется обследование
                </p>
              </div>
            )}
            {data.priority.mlProbability && (
              <div className="mt-2 text-xs text-gray-600">
                <span className="font-medium">ML вероятность внимания:</span> {(data.priority.mlProbability * 100).toFixed(0)}%
              </div>
            )}
          </div>

          {/* Координаты */}
          <div className="mb-4 text-xs text-gray-500 font-mono bg-gray-50 rounded-lg p-2">
            📍 {data.coordinates.lat.toFixed(6)}, {data.coordinates.lng.toFixed(6)}
          </div>

          {/* Кнопки действий */}
          <div className="space-y-2">
            {data.pdfUrl && (
              <button
                onClick={() => window.open(data.pdfUrl, '_blank')}
                className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-semibold shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Открыть паспорт (PDF)
              </button>
            )}

            <button
              onClick={() => onClick && onClick(data)}
              className="w-full bg-gray-100 text-gray-800 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              Подробная информация
              <span>→</span>
            </button>
          </div>

          {/* Дополнительная информация */}
          {(data.area || data.volume || data.maxDepth) && (
            <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
              {data.area && (
                <div>
                  <p className="text-xs text-gray-500">Площадь</p>
                  <p className="text-sm font-semibold text-gray-900">{data.area} км²</p>
                </div>
              )}
              {data.volume && (
                <div>
                  <p className="text-xs text-gray-500">Объём</p>
                  <p className="text-sm font-semibold text-gray-900">{data.volume} км³</p>
                </div>
              )}
              {data.maxDepth && (
                <div>
                  <p className="text-xs text-gray-500">Макс. глубина</p>
                  <p className="text-sm font-semibold text-gray-900">{data.maxDepth} м</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default WaterBodyMarker;
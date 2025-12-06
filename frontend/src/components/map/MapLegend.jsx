import React, { useState } from 'react';
import { 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Droplets,
  Zap,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Circle,
  Info,
  MapPin,
  TrendingUp,
  Activity
} from 'lucide-react';

const MapLegend = ({ 
  position = 'bottom-left',
  isCollapsible = true,
  defaultExpanded = true,
  showTechnicalCondition = true,
  showObjectTypes = true,
  showPriority = true,
  showStatistics = false,
  waterBodiesCount = 0,
  hydroFacilitiesCount = 0,
  highPriorityCount = 0,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Позиционирование легенды
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  // Данные о техническом состоянии
  const technicalConditions = [
    { 
      level: 1, 
      color: '#10B981', 
      label: 'Категория 1 - Отличное',
      icon: CheckCircle2,
      description: 'Объект в идеальном состоянии'
    },
    { 
      level: 2, 
      color: '#84CC16', 
      label: 'Категория 2 - Хорошее',
      icon: CheckCircle2,
      description: 'Минимальный износ'
    },
    { 
      level: 3, 
      color: '#F59E0B', 
      label: 'Категория 3 - Удовлетворительное',
      icon: AlertCircle,
      description: 'Требует внимания'
    },
    { 
      level: 4, 
      color: '#F97316', 
      label: 'Категория 4 - Плохое',
      icon: AlertTriangle,
      description: 'Необходим ремонт'
    },
    { 
      level: 5, 
      color: '#EF4444', 
      label: 'Категория 5 - Критическое',
      icon: XCircle,
      description: 'Срочное вмешательство'
    }
  ];

  // Типы объектов
  const objectTypes = [
    {
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: 'Водоёмы',
      description: 'Озёра, водохранилища, каналы',
      shape: 'rounded-full'
    },
    {
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      label: 'Гидротехнические сооружения',
      description: 'ГЭС, плотины, шлюзы',
      shape: 'rounded-lg'
    }
  ];

  // Уровни приоритета
  const priorityLevels = [
    {
      level: 'high',
      color: 'bg-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-100',
      label: 'Высокий приоритет',
      icon: AlertCircle,
      description: 'Требует немедленного обследования',
      badge: true
    },
    {
      level: 'medium',
      color: 'bg-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      label: 'Средний приоритет',
      icon: AlertTriangle,
      description: 'Планируется обследование',
      badge: false
    },
    {
      level: 'low',
      color: 'bg-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Низкий приоритет',
      icon: CheckCircle2,
      description: 'Находится под наблюдением',
      badge: false
    }
  ];

  return (
    <div 
      className={`absolute z-[1000] ${positionClasses[position]} ${className}`}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <button
            onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full group"
            disabled={!isCollapsible}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Легенда карты</span>
            </div>
            {isCollapsible && (
              <div className="p-1 rounded-lg group-hover:bg-white/50 transition-colors">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
            )}
          </button>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="px-4 py-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* Статистика */}
            {showStatistics && (waterBodiesCount > 0 || hydroFacilitiesCount > 0) && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Статистика
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Водоёмы</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{waterBodiesCount}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-600">ГТС</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{hydroFacilitiesCount}</p>
                  </div>
                </div>
                {highPriorityCount > 0 && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-800">
                      <span className="font-bold">{highPriorityCount}</span> объектов высокого приоритета
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Техническое состояние */}
            {showTechnicalCondition && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Техническое состояние
                  </span>
                </div>
                <div className="space-y-2">
                  {technicalConditions.map(condition => {
                    const Icon = condition.icon;
                    return (
                      <div 
                        key={condition.level} 
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div 
                            className="w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                            style={{ backgroundColor: condition.color }}
                          >
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {condition.level}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900">
                            {condition.label}
                          </p>
                          <p className="text-xs text-gray-500 truncate group-hover:text-clip">
                            {condition.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Типы объектов */}
            {showObjectTypes && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Типы объектов
                  </span>
                </div>
                <div className="space-y-2">
                  {objectTypes.map((type, index) => {
                    const Icon = type.icon;
                    return (
                      <div 
                        key={index} 
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-10 h-10 ${type.bgColor} ${type.shape} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <Icon className={`w-5 h-5 ${type.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {type.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Уровни приоритета */}
            {showPriority && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Приоритет обследования
                  </span>
                </div>
                <div className="space-y-2">
                  {priorityLevels.map(priority => {
                    const Icon = priority.icon;
                    return (
                      <div 
                        key={priority.level} 
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div className={`w-5 h-5 ${priority.color} rounded-full flex items-center justify-center shadow-md`}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          {priority.badge && (
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse border-2 border-white shadow-md flex items-center justify-center">
                              <span className="text-white text-xs font-bold leading-none">!</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900">
                            {priority.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {priority.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Информация о формуле приоритета */}
            <div className="pt-3 border-t border-gray-200 bg-blue-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-900 mb-1">
                    Расчёт приоритета
                  </p>
                  <p className="text-xs text-blue-800">
                    <span className="font-mono bg-blue-100 px-1 rounded">
                      (6 - категория) × 3 + возраст паспорта
                    </span>
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    ≥12 - высокий, 6-11 - средний, &lt;6 - низкий
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer - если свёрнуто */}
        {!isExpanded && (
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <p className="text-xs text-gray-500 text-center">
              Нажмите для просмотра легенды
            </p>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
        }
      `}</style>
    </div>
  );
};

export default MapLegend;
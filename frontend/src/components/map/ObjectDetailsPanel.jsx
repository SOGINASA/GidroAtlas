import React, { useState } from 'react';
import { 
  X,
  MapPin,
  Calendar,
  Droplets,
  Zap,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Fish,
  Waves,
  ThermometerSun,
  Wind,
  Activity,
  BarChart3,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Info,
  Gauge,
  Database
} from 'lucide-react';

const ObjectDetailsPanel = ({ 
  object, 
  objectType = 'waterBody', // 'waterBody' или 'facility'
  onClose,
  userRole = 'guest'
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    technical: true,
    priority: true,
    characteristics: true
  });

  if (!object) return null;

  // Переключение секций
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Цвет по категории технического состояния
  const getConditionColor = (condition) => {
    const colors = {
      1: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' },
      2: { bg: 'bg-lime-500', text: 'text-lime-600', light: 'bg-lime-50' },
      3: { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-50' },
      4: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50' },
      5: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50' }
    };
    return colors[condition] || colors[3];
  };

  // Бейдж приоритета
  const PriorityBadge = ({ level, score }) => {
    const styles = {
      high: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Высокий', icon: AlertCircle },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: 'Средний', icon: TrendingUp },
      low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Низкий', icon: TrendingDown }
    }[level] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', label: 'Не определён', icon: Minus };

    const Icon = styles.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 font-semibold ${styles.bg} ${styles.text} ${styles.border}`}>
        <Icon className="w-4 h-4" />
        <span>{styles.label}</span>
        <span className="opacity-75">({score})</span>
      </div>
    );
  };

  // Индикатор состояния
  const ConditionIndicator = ({ condition }) => {
    const colorConfig = getConditionColor(condition);
    const percentage = ((6 - condition) / 5) * 100;

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Техническое состояние</span>
          <div className={`px-3 py-1 rounded-full text-white font-bold text-sm ${colorConfig.bg}`}>
            Категория {condition}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${colorConfig.bg}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Критическое</span>
          <span>Отличное</span>
        </div>
      </div>
    );
  };

  // Секция с возможностью сворачивания
  const CollapsibleSection = ({ title, icon: Icon, children, sectionKey }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">{title}</h3>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );

  // Информационная строка
  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center text-gray-600">
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-semibold text-gray-900 text-sm">{value}</span>
    </div>
  );

  // Получить название типа объекта
  const getObjectTypeName = () => {
    if (objectType === 'waterBody') {
      const types = {
        lake: 'Озеро',
        canal: 'Канал',
        reservoir: 'Водохранилище'
      };
      return types[object.resourceType] || object.resourceType;
    } else {
      const types = {
        hydropower: 'ГЭС',
        dam: 'Плотина',
        canal: 'Канал',
        lock: 'Шлюз',
        reservoir: 'Водохранилище',
        pumping_station: 'Насосная станция'
      };
      return types[object.type] || object.type;
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-[1000] overflow-hidden flex flex-col animate-slide-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {objectType === 'waterBody' ? (
                <Droplets className="w-6 h-6" />
              ) : (
                <Zap className="w-6 h-6" />
              )}
              <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">
                {getObjectTypeName()}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{object.name}</h2>
            {object.name_kz && (
              <p className="text-blue-100 text-sm italic">{object.name_kz}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center ml-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{object.region}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Обзор
        </button>
        {userRole !== 'guest' && (
          <>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Аналитика
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              История
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Техническое состояние */}
            <CollapsibleSection 
              title="Техническое состояние" 
              icon={Gauge}
              sectionKey="technical"
            >
              <ConditionIndicator condition={object.technicalCondition} />
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Дата паспорта</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900 block">
                      {new Date(object.passportDate).toLocaleDateString('ru-RU')}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({object.passportAge} {object.passportAge === 1 ? 'год' : object.passportAge < 5 ? 'года' : 'лет'})
                    </span>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Приоритет обследования */}
            {userRole !== 'guest' && (
              <CollapsibleSection 
                title="Приоритет обследования" 
                icon={AlertCircle}
                sectionKey="priority"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Уровень приоритета</span>
                    <PriorityBadge level={object.priority.level} score={object.priority.score} />
                  </div>

                  {object.priority.needsInspection && (
                    <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-red-900">Требуется обследование</p>
                          <p className="text-xs text-red-700 mt-1">
                            Объект имеет высокий приоритет и требует срочного обследования
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {object.priority.mlProbability && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">ML вероятность внимания</span>
                        <span className="font-bold text-blue-600">
                          {(object.priority.mlProbability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${object.priority.mlProbability * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {object.priority.details && (
                    <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                      Расчёт: {object.priority.details.calculation}
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {/* Основная информация */}
            <CollapsibleSection 
              title="Основная информация" 
              icon={Info}
              sectionKey="characteristics"
            >
              <div className="space-y-0">
                {objectType === 'waterBody' ? (
                  <>
                    <InfoRow label="Тип водного ресурса" value={getObjectTypeName()} icon={Droplets} />
                    <InfoRow 
                      label="Тип воды" 
                      value={object.waterType === 'fresh' ? 'Пресная' : 'Непресная'} 
                      icon={Waves} 
                    />
                    <InfoRow 
                      label="Наличие фауны" 
                      value={object.fauna ? 'Есть' : 'Нет'} 
                      icon={Fish} 
                    />
                    {object.area && (
                      <InfoRow label="Площадь" value={`${object.area} км²`} icon={Activity} />
                    )}
                    {object.volume && (
                      <InfoRow label="Объём" value={`${object.volume} км³`} icon={Database} />
                    )}
                    {object.maxDepth && (
                      <InfoRow label="Макс. глубина" value={`${object.maxDepth} м`} />
                    )}
                    {object.avgDepth && (
                      <InfoRow label="Средняя глубина" value={`${object.avgDepth} м`} />
                    )}
                  </>
                ) : (
                  <>
                    <InfoRow label="Тип ГТС" value={getObjectTypeName()} icon={Zap} />
                    <InfoRow 
                      label="Статус" 
                      value={object.status === 'operational' ? 'Работает' : 
                             object.status === 'maintenance' ? 'Обслуживание' :
                             object.status === 'emergency' ? 'Авария' : 'Выведен'} 
                    />
                    {object.commissionedYear && (
                      <InfoRow label="Год ввода" value={object.commissionedYear} icon={Calendar} />
                    )}
                    {object.operator && (
                      <InfoRow label="Оператор" value={object.operator} />
                    )}
                    {object.technicalSpecs?.capacity && (
                      <InfoRow label="Мощность" value={`${object.technicalSpecs.capacity} МВт`} />
                    )}
                    {object.technicalSpecs?.height && (
                      <InfoRow label="Высота" value={`${object.technicalSpecs.height} м`} />
                    )}
                  </>
                )}
                <InfoRow 
                  label="Координаты" 
                  value={`${object.coordinates.lat.toFixed(6)}, ${object.coordinates.lng.toFixed(6)}`}
                  icon={MapPin}
                />
              </div>
            </CollapsibleSection>

            {/* Дополнительные данные для экспертов */}
            {userRole !== 'guest' && object.waterQuality && (
              <CollapsibleSection 
                title="Качество воды" 
                icon={ThermometerSun}
                sectionKey="waterQuality"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">pH</p>
                    <p className="text-lg font-bold text-gray-900">{object.waterQuality.pH}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Мутность</p>
                    <p className="text-lg font-bold text-gray-900">{object.waterQuality.turbidity}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Кислород</p>
                    <p className="text-lg font-bold text-gray-900">{object.waterQuality.dissolvedOxygen} мг/л</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Статус</p>
                    <p className="text-sm font-bold text-green-600">
                      {object.waterQuality.status === 'excellent' ? 'Отлично' :
                       object.waterQuality.status === 'good' ? 'Хорошо' :
                       object.waterQuality.status === 'moderate' ? 'Удовл.' : 'Плохо'}
                    </p>
                  </div>
                </div>
              </CollapsibleSection>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && userRole !== 'guest' && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Аналитические данные в разработке</p>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && userRole !== 'guest' && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">История изменений в разработке</p>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="border-t border-gray-200 bg-white p-4 space-y-2">
        {object.pdfUrl && (
          <button
            onClick={() => window.open(object.pdfUrl, '_blank')}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 font-semibold"
          >
            <FileText className="w-5 h-5" />
            <span>Открыть паспорт (PDF)</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <button
            className="py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 font-semibold text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Скачать</span>
          </button>
          <button
            className="py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 font-semibold text-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Поделиться</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ObjectDetailsPanel;
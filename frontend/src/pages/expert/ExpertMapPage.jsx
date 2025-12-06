import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Droplets, 
  Zap, 
  X, 
  Info, 
  AlertCircle, 
  Loader2,
  FileText,
  Calendar,
  Waves,
  Fish,
  AlertTriangle,
  TrendingUp,
  Filter,
  Search,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

// Mock ExpertLayout component
const ExpertLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {children}
  </div>
);

// API Configuration from ENV
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

const fetchAPI = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

const ExpertMapPage = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [showLegend, setShowLegend] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waterBodies, setWaterBodies] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [showLayers, setShowLayers] = useState({
    waterBodies: true,
    facilities: true,
    regions: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [waterBodiesData, facilitiesData] = await Promise.all([
        fetchAPI('/waterbodies'),
        fetchAPI('/facilities')
      ]);

      const processedWaterBodies = (waterBodiesData || []).map(wb => ({
        ...wb,
        lat: wb.coordinates?.lat || wb.latitude || (46 + Math.random() * 8),
        lng: wb.coordinates?.lng || wb.longitude || (50 + Math.random() * 40),
        condition: wb.technicalCondition || wb.condition || 3
      }));

      const processedFacilities = (facilitiesData || []).map(f => ({
        ...f,
        lat: f.coordinates?.lat || f.latitude || (46 + Math.random() * 8),
        lng: f.coordinates?.lng || f.longitude || (50 + Math.random() * 40),
        condition: f.technicalCondition || f.condition || 3,
        capacity: f.technicalSpecs?.capacity || f.capacity
      }));

      setWaterBodies(processedWaterBodies);
      setFacilities(processedFacilities);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить данные. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition) => {
    const colors = { 1: '#10B981', 2: '#84CC16', 3: '#F59E0B', 4: '#F97316', 5: '#EF4444' };
    return colors[condition] || colors[3];
  };

  const getConditionLabel = (condition) => {
    const labels = { 1: 'Отличное', 2: 'Хорошее', 3: 'Удовлетворительное', 4: 'Плохое', 5: 'Критическое' };
    return labels[condition] || 'Неизвестно';
  };

  const getTypeLabel = (type) => {
    const labels = {
      river: 'Река', 
      lake: 'Озеро', 
      reservoir: 'Водохранилище',
      canal: 'Канал',
      hydropower: 'ГЭС', 
      dam: 'Плотина',
      lock: 'Шлюз',
      pumping_station: 'Насосная станция'
    };
    return labels[type] || type;
  };

  const calculatePriority = (condition, passportDate) => {
    if (!passportDate) return { score: 0, level: 'low' };
    
    const currentYear = new Date().getFullYear();
    const passportYear = new Date(passportDate).getFullYear();
    const passportAge = currentYear - passportYear;
    
    const score = (6 - condition) * 3 + passportAge;
    
    let level;
    if (score >= 12) level = 'high';
    else if (score >= 6) level = 'medium';
    else level = 'low';
    
    return { score, level, passportAge };
  };

  const handleObjectClick = async (object, objectType) => {
    try {
      let fullData;
      if (objectType === 'waterbody') {
        fullData = await fetchAPI(`/waterbodies/${object.id}`);
      } else {
        fullData = await fetchAPI(`/facilities/${object.id}`);
      }
      
      const priority = calculatePriority(
        fullData.technicalCondition || object.condition,
        fullData.passportDate
      );
      
      setSelectedObject({
        ...object,
        ...fullData,
        objectType,
        lat: fullData.coordinates?.lat || object.lat,
        lng: fullData.coordinates?.lng || object.lng,
        condition: fullData.technicalCondition || object.condition,
        priority
      });
    } catch (err) {
      console.error('Ошибка загрузки деталей:', err);
      const priority = calculatePriority(object.condition, object.passportDate);
      setSelectedObject({ ...object, objectType, priority });
    }
  };

  // Фильтрация объектов
  const filteredWaterBodies = waterBodies.filter(wb => {
    const matchesSearch = wb.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition = filterCondition === 'all' || wb.condition === parseInt(filterCondition);
    const matchesRegion = filterRegion === 'all' || wb.region === filterRegion;
    return matchesSearch && matchesCondition && matchesRegion;
  });

  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition = filterCondition === 'all' || f.condition === parseInt(filterCondition);
    const matchesRegion = filterRegion === 'all' || f.region === filterRegion;
    return matchesSearch && matchesCondition && matchesRegion;
  });

  // Получаем уникальные регионы
  const regions = [...new Set([...waterBodies, ...facilities].map(o => o.region))].filter(Boolean).sort();

  const getPriorityBadge = (priority) => {
    if (!priority) return null;
    
    const styles = {
      high: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Высокий' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: 'Средний' },
      low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Низкий' }
    };
    
    const style = styles[priority.level] || styles.low;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
        <span className="font-semibold text-sm">{style.label}</span>
        <span className="text-xs">({priority.score})</span>
      </div>
    );
  };

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">Карта объектов (Эксперт)</h1>
            </div>
            <p className="text-sm lg:text-base text-blue-100">
              Полный доступ к данным водоёмов и ГТС с приоритизацией обследований
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Region Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Все регионы</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Все состояния</option>
                  <option value="1">Категория 1</option>
                  <option value="2">Категория 2</option>
                  <option value="3">Категория 3</option>
                  <option value="4">Категория 4</option>
                  <option value="5">Категория 5</option>
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRegion('all');
                  setFilterCondition('all');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-30 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">Загрузка данных...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-red-50 border border-red-200 text-red-800 px-6 py-3 rounded-xl shadow-lg max-w-md">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Map */}
          <div className="w-full h-[calc(100vh-300px)] bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 relative overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }} />
            </div>

            {/* Kazakhstan outline mockup */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-300 text-center">
                <MapPin className="w-24 h-24 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-semibold opacity-50">Карта Казахстана</p>
              </div>
            </div>

            {/* Water Bodies Markers */}
            {!loading && showLayers.waterBodies && filteredWaterBodies.map((wb) => (
              <button
                key={`wb-${wb.id}`}
                onClick={() => handleObjectClick(wb, 'waterbody')}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ 
                  left: `${(wb.lng - 45) * 8}%`, 
                  top: `${(55 - wb.lat) * 10}%` 
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-125 relative"
                  style={{ backgroundColor: getConditionColor(wb.condition) }}
                >
                  <Droplets className="w-6 h-6 text-white" />
                  {wb.condition >= 4 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full animate-pulse border-2 border-white" />
                  )}
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {wb.name}
                </div>
              </button>
            ))}

            {/* Facilities Markers */}
            {!loading && showLayers.facilities && filteredFacilities.map((f) => (
              <button
                key={`f-${f.id}`}
                onClick={() => handleObjectClick(f, 'facility')}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ 
                  left: `${(f.lng - 45) * 8}%`, 
                  top: `${(55 - f.lat) * 10}%` 
                }}
              >
                <div 
                  className="w-12 h-12 rounded-lg border-4 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-125 relative"
                  style={{ backgroundColor: getConditionColor(f.condition) }}
                >
                  <Zap className="w-6 h-6 text-white" />
                  {f.condition >= 4 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full animate-pulse border-2 border-white" />
                  )}
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {f.name}
                </div>
              </button>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2 z-20">
              <button
                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Приблизить"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              <button
                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Отдалить"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <button
                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Моё местоположение"
              >
                <Navigation className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setShowLayers(prev => ({ ...prev, waterBodies: !prev.waterBodies, facilities: !prev.facilities }))}
                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Слои карты"
              >
                <Layers className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Legend */}
            {showLegend && (
              <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-xl p-4 max-w-xs z-20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">Легенда</h3>
                  <button
                    onClick={() => setShowLegend(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <span>Водоёмы</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span>ГТС</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Техническое состояние:</p>
                    {[1, 2, 3, 4, 5].map((cat) => (
                      <div key={cat} className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: getConditionColor(cat) }}
                          />
                          <span className="text-xs">Кат. {cat}</span>
                        </div>
                        <span className="text-xs text-gray-500">{getConditionLabel(cat)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!showLegend && (
              <button
                onClick={() => setShowLegend(true)}
                className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 z-20 flex items-center space-x-2"
              >
                <Info className="w-5 h-5" />
                <span>Легенда</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-t border-gray-200 px-4 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : filteredWaterBodies.length}
              </p>
              <p className="text-sm text-gray-600">Водоёмов</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : filteredFacilities.length}
              </p>
              <p className="text-sm text-gray-600">ГТС</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 
                  [...filteredWaterBodies, ...filteredFacilities].filter(o => o.condition <= 2).length}
              </p>
              <p className="text-sm text-gray-600">Хорошее</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 
                  [...filteredWaterBodies, ...filteredFacilities].filter(o => o.condition === 3).length}
              </p>
              <p className="text-sm text-gray-600">Удовлетворит.</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 
                  [...filteredWaterBodies, ...filteredFacilities].filter(o => o.condition >= 4).length}
              </p>
              <p className="text-sm text-gray-600">Критическое</p>
            </div>
          </div>
        </div>
      </div>

      {/* Object Details Modal */}
      {selectedObject && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSelectedObject(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh]">
            <div 
              className="px-6 py-4 text-white"
              style={{ background: `linear-gradient(135deg, ${getConditionColor(selectedObject.condition)} 0%, ${getConditionColor(selectedObject.condition)}dd 100%)` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {selectedObject.objectType === 'waterbody' ? (
                      <Droplets className="w-6 h-6" />
                    ) : (
                      <Zap className="w-6 h-6" />
                    )}
                    <span className="text-sm font-medium opacity-90">
                      {getTypeLabel(selectedObject.type || selectedObject.resourceType)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{selectedObject.name}</h2>
                  {selectedObject.name_kz && (
                    <p className="text-sm opacity-80">{selectedObject.name_kz}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedObject(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Регион</p>
                  <p className="font-semibold text-gray-900">{selectedObject.region || 'Не указан'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Техн. состояние</p>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getConditionColor(selectedObject.condition) }}
                    />
                    <span className="font-semibold text-gray-900">Кат. {selectedObject.condition}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-600 mb-1">Приоритет</p>
                  {getPriorityBadge(selectedObject.priority)}
                </div>
              </div>

              {selectedObject.waterType && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Waves className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-700">Тип воды</p>
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {selectedObject.waterType === 'fresh' ? 'Пресная' : 'Непресная'}
                  </p>
                </div>
              )}

              {selectedObject.fauna !== undefined && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Fish className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-semibold text-green-700">Наличие фауны</p>
                  </div>
                  <p className="text-lg font-bold text-green-900">
                    {selectedObject.fauna ? 'Да' : 'Нет'}
                  </p>
                </div>
              )}

              {selectedObject.capacity && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-semibold text-purple-700">Мощность</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{selectedObject.capacity} МВт</p>
                </div>
              )}

              {selectedObject.passportDate && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <p className="text-sm font-semibold text-amber-700">Паспорт объекта</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-amber-900">
                        {new Date(selectedObject.passportDate).toLocaleDateString('ru-RU')}
                      </p>
                      <p className="text-sm text-amber-700">
                        Возраст: {new Date().getFullYear() - new Date(selectedObject.passportDate).getFullYear()} лет
                      </p>
                    </div>
                    {selectedObject.pdfUrl && (
                      <button
                        onClick={() => window.open(selectedObject.pdfUrl, '_blank')}
                        className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">Открыть PDF</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-700">Координаты</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Широта</p>
                    <p className="font-semibold text-gray-900">{selectedObject.lat?.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Долгота</p>
                    <p className="font-semibold text-gray-900">{selectedObject.lng?.toFixed(6)}</p>
                  </div>
                </div>
              </div>

              {selectedObject.priority && selectedObject.priority.score > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-700">Расчёт приоритета обследования</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-900">
                        (6 - {selectedObject.condition}) × 3 + {selectedObject.priority.passportAge} = {selectedObject.priority.score}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p>• Высокий приоритет: ≥12 баллов</p>
                    <p>• Средний приоритет: 6-11 баллов</p>
                    <p>• Низкий приоритет: &lt;6 баллов</p>
                  </div>
                  {selectedObject.priority.level === 'high' && (
                    <div className="mt-3 bg-red-100 border border-red-300 rounded-lg p-3 flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">Требуется срочное обследование</p>
                        <p className="text-xs text-red-700 mt-1">
                          Объект имеет высокий приоритет и требует внимания специалистов
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedObject.description && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Описание</p>
                  <p className="text-sm text-gray-600">{selectedObject.description}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedObject(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Закрыть
                </button>
                <button
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Подробнее</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </ExpertLayout>
  );
};

export default ExpertMapPage;
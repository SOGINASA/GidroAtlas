import React, { useState } from 'react';
import { 
  Radio, Search, Plus, Edit3, Trash2, Power, PowerOff, Activity, AlertTriangle,
  CheckCircle, XCircle, MapPin, Thermometer, Droplets, Wind, Gauge, TrendingUp,
  TrendingDown, Wifi, WifiOff, Battery, BatteryLow, Calendar, Clock, Download,
  Upload, RefreshCw, Eye, Settings, X, BarChart3
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

const SensorsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sensors = [
    {
      id: 'SNS-001', name: 'Датчик уровня воды #1', type: 'water_level',
      location: 'Озеро Балхаш', status: 'active', signal: 95, battery: 87,
      lastReading: { value: 342.5, unit: 'см', timestamp: '2024-12-06T11:45:00' },
      trend: 'rising', installDate: '2023-05-15'
    },
    {
      id: 'SNS-002', name: 'Метеостанция #4', type: 'weather',
      location: 'Река Иртыш, Павлодар', status: 'active', signal: 88, battery: 45,
      lastReading: { value: 24.3, unit: '°C', timestamp: '2024-12-06T11:40:00' },
      trend: 'stable', installDate: '2023-08-20'
    },
    {
      id: 'SNS-003', name: 'Датчик качества воды #7', type: 'water_quality',
      location: 'Капшагайское вдхр.', status: 'warning', signal: 72, battery: 92,
      lastReading: { value: 7.8, unit: 'pH', timestamp: '2024-12-06T11:30:00' },
      trend: 'falling', installDate: '2023-11-10'
    },
    {
      id: 'SNS-004', name: 'Датчик давления #12', type: 'pressure',
      location: 'Бухтарминская ГЭС', status: 'error', signal: 0, battery: 12,
      lastReading: { value: 0, unit: 'кПа', timestamp: '2024-12-05T08:20:00' },
      trend: 'stable', installDate: '2023-03-12'
    }
  ];

  const stats = [
    { icon: Radio, label: 'Всего датчиков', value: '1,892', change: '+34', color: 'from-purple-500 to-pink-500' },
    { icon: CheckCircle, label: 'Активных', value: '1,654', change: '+28', color: 'from-green-500 to-emerald-500' },
    { icon: AlertTriangle, label: 'Требуют внимания', value: '156', change: '+12', color: 'from-yellow-500 to-orange-500' },
    { icon: XCircle, label: 'Неисправны', value: '82', change: '-6', color: 'from-red-500 to-rose-500' }
  ];

  const sensorTypes = [
    { id: 'water_level', label: 'Уровень воды', icon: Gauge, count: 542, color: 'bg-blue-500' },
    { id: 'water_quality', label: 'Качество воды', icon: Droplets, count: 387, color: 'bg-cyan-500' },
    { id: 'temperature', label: 'Температура', icon: Thermometer, count: 421, color: 'bg-orange-500' },
    { id: 'pressure', label: 'Давление', icon: Activity, count: 298, color: 'bg-purple-500' },
    { id: 'weather', label: 'Метеостанции', icon: Wind, count: 244, color: 'bg-green-500' }
  ];

  const getSensorTypeInfo = (type) => {
    const types = {
      water_level: { label: 'Уровень воды', icon: Gauge, color: 'bg-blue-100 text-blue-800 border-blue-300' },
      water_quality: { label: 'Качество воды', icon: Droplets, color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
      temperature: { label: 'Температура', icon: Thermometer, color: 'bg-orange-100 text-orange-800 border-orange-300' },
      pressure: { label: 'Давление', icon: Activity, color: 'bg-purple-100 text-purple-800 border-purple-300' },
      weather: { label: 'Метеостанция', icon: Wind, color: 'bg-green-100 text-green-800 border-green-300' }
    };
    return types[type] || types.water_level;
  };

  const getStatusInfo = (status) => {
    const statuses = {
      active: { label: 'Активен', icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-300' },
      warning: { label: 'Внимание', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      error: { label: 'Ошибка', icon: XCircle, color: 'bg-red-100 text-red-800 border-red-300' }
    };
    return statuses[status] || statuses.active;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'falling') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredSensors = sensors.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || s.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Radio className="w-8 h-8 mr-3" />
                  Управление датчиками IoT
                </h1>
                <p className="text-purple-100">Мониторинг и администрирование сенсорной сети</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5" />
                  <span>Обновить</span>
                </button>
                <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Добавить</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className={`bg-gradient-to-br ${stat.color} p-6`}>
                    <Icon className="w-10 h-10 text-white mb-4" />
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                    <div className="mt-3 flex items-center text-white/90 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{stat.change} за неделю</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Types */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 text-purple-600 mr-2" />
              Типы датчиков
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {sensorTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.id} className={`${type.color} text-white rounded-xl p-6`}>
                    <Icon className="w-8 h-8 mb-3" />
                    <p className="text-2xl font-bold mb-1">{type.count}</p>
                    <p className="text-sm text-white/90">{type.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Название, локация..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тип</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                  <option value="all">Все типы</option>
                  <option value="water_level">Уровень воды</option>
                  <option value="water_quality">Качество воды</option>
                  <option value="temperature">Температура</option>
                  <option value="pressure">Давление</option>
                  <option value="weather">Метеостанция</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                  <option value="all">Все</option>
                  <option value="active">Активные</option>
                  <option value="warning">Требуют внимания</option>
                  <option value="error">Ошибка</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Найдено: <span className="font-semibold">{filteredSensors.length}</span> из {sensors.length}
              </p>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Экспорт</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Импорт</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sensors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSensors.map((sensor) => {
              const typeInfo = getSensorTypeInfo(sensor.type);
              const statusInfo = getStatusInfo(sensor.status);
              const TypeIcon = typeInfo.icon;
              const StatusIcon = statusInfo.icon;
              const statusBg = sensor.status === 'active' ? 'from-green-500 to-emerald-500' : 
                               sensor.status === 'warning' ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-rose-500';

              return (
                <div key={sensor.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className={`p-4 bg-gradient-to-r ${statusBg} text-white`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{sensor.name}</h3>
                        <p className="text-sm text-white/80 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {sensor.location}
                        </p>
                      </div>
                      <TypeIcon className="w-8 h-8" />
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg inline-block">
                      <span className="text-xs font-mono font-semibold">{sensor.id}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Последнее измерение</p>
                        {getTrendIcon(sensor.trend)}
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-gray-900">{sensor.lastReading.value}</p>
                        <p className="text-lg text-gray-600">{sensor.lastReading.unit}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(sensor.lastReading.timestamp)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Статус</p>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusInfo.label}</span>
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Тип</p>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${typeInfo.color}`}>
                          <TypeIcon className="w-3 h-3" />
                          <span>{typeInfo.label}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Сигнал</span>
                          {sensor.signal > 0 ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
                        </div>
                        <span className={`text-lg font-bold ${sensor.signal > 70 ? 'text-green-600' : sensor.signal > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {sensor.signal}%
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Батарея</span>
                          {sensor.battery > 20 ? <Battery className="w-4 h-4 text-green-600" /> : <BatteryLow className="w-4 h-4 text-red-600" />}
                        </div>
                        <span className={`text-lg font-bold ${sensor.battery > 50 ? 'text-green-600' : sensor.battery > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {sensor.battery}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Установлен: {new Date(sensor.installDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 flex space-x-2">
                    <button 
                      onClick={() => { setSelectedSensor(sensor); setShowModal(true); }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Детали</span>
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className={`px-4 py-2 rounded-lg text-white ${sensor.status === 'active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}>
                      {sensor.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedSensor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedSensor.name}</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-white/20 rounded-lg hover:bg-white/30">
                  <X className="w-5 h-5 mx-auto" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600">ID: {selectedSensor.id}</p>
                <p className="text-gray-600">Локация: {selectedSensor.location}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SensorsManagement;
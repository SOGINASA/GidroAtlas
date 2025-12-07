import { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  MapPin,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical,
  FileText,
  Settings,
  TrendingUp,
  BarChart3,
  Layers,
  Info,
  Save,
  X,
  Loader
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';
import {
  getHydroFacilities,
  createFacility,
  updateFacility,
  deleteFacility
} from '../../services/hydroFacilityService';

const FacilitiesManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Form data for create/edit
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    type: '',
    status: '',
    technical_condition: '',
    water_type: '',
    has_fauna: '',
    passport_date: '',
    commissioned_year: '',
    capacity: '',
    latitude: '',
    longitude: '',
    description: ''
  });

  useEffect(() => {
    loadFacilities();
  }, [selectedRegion, selectedType]);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedRegion && selectedRegion !== 'Все регионы') {
        params.region = selectedRegion;
      }
      if (selectedType) {
        params.type = selectedType;
      }

      const response = await getHydroFacilities(params);
      if (response.success) {
        setFacilities(response.data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Ошибка загрузки ГТС:', err);
      setError('Не удалось загрузить ГТС');
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Регионы Казахстана
  const regions = [
    'Все регионы',
    'Акмолинская',
    'Актюбинская',
    'Алматинская',
    'Атырауская',
    'Восточно-Казахстанская',
    'Жамбылская',
    'Западно-Казахстанская',
    'Карагандинская',
    'Костанайская',
    'Кызылординская',
    'Мангистауская',
    'Павлодарская',
    'Северо-Казахстанская',
    'Туркестанская'
  ];

  // Типы ГТС
  const facilityTypes = [
    { value: '', label: 'Все типы' },
    { value: 'hydropower', label: 'Гидроэлектростанция' },
    { value: 'dam', label: 'Плотина' },
    { value: 'canal', label: 'Канал' },
    { value: 'lock', label: 'Шлюз' },
    { value: 'reservoir', label: 'Водохранилище' },
    { value: 'pumping_station', label: 'Насосная станция' }
  ];

  // Статусы
  const statuses = [
    { value: '', label: 'Все статусы' },
    { value: 'operational', label: 'Работает' },
    { value: 'maintenance', label: 'На обслуживании' },
    { value: 'emergency', label: 'Аварийное' },
    { value: 'decommissioned', label: 'Выведено из эксплуатации' }
  ];

  // Статистика
  const stats = [
    {
      icon: Zap,
      label: 'Всего ГТС',
      value: facilities.length.toString(),
      change: '+3',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: CheckCircle,
      label: 'Работают',
      value: facilities.filter(f => f.status === 'operational').length.toString(),
      change: '+2',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: AlertTriangle,
      label: 'Требуют внимания',
      value: facilities.filter(f => f.technicalCondition >= 4).length.toString(),
      change: '0',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Activity,
      label: 'На обслуживании',
      value: facilities.filter(f => f.status === 'maintenance').length.toString(),
      change: '+1',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  // Вспомогательные функции
  const getConditionColor = (condition) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-lime-100 text-lime-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-orange-100 text-orange-800',
      5: 'bg-red-100 text-red-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      operational: 'bg-green-100 text-green-800',
      maintenance: 'bg-blue-100 text-blue-800',
      emergency: 'bg-red-100 text-red-800',
      decommissioned: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      operational: 'Работает',
      maintenance: 'Обслуживание',
      emergency: 'Аварийное',
      decommissioned: 'Не работает'
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type) => {
    const labels = {
      hydropower: 'ГЭС',
      dam: 'Плотина',
      canal: 'Канал',
      lock: 'Шлюз',
      reservoir: 'Водохранилище',
      pumping_station: 'Насосная станция'
    };
    return labels[type] || type;
  };

  // Фильтрация на клиенте
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = !selectedCondition || facility.technicalCondition === parseInt(selectedCondition);

    return matchesSearch && matchesCondition;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      region: '',
      type: '',
      status: '',
      technical_condition: '',
      water_type: '',
      has_fauna: '',
      passport_date: '',
      commissioned_year: '',
      capacity: '',
      latitude: '',
      longitude: '',
      description: ''
    });
  };

  const handleAddFacility = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditFacility = (facility) => {
    setSelectedFacility(facility);
    setFormData({
      name: facility.name || '',
      region: facility.region || '',
      type: facility.type || '',
      status: facility.status || '',
      technical_condition: facility.technicalCondition?.toString() || '',
      water_type: facility.waterType || '',
      has_fauna: facility.hasFauna ? 'true' : 'false',
      passport_date: facility.passportDate || '',
      commissioned_year: facility.commissionedYear?.toString() || '',
      capacity: facility.capacity?.toString() || '',
      latitude: facility.latitude?.toString() || '',
      longitude: facility.longitude?.toString() || '',
      description: facility.description || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteFacility = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это ГТС?')) {
      try {
        const response = await deleteFacility(id);
        if (response.success) {
          showAlertMessage('ГТС успешно удалено', 'success');
          loadFacilities();
        }
      } catch (err) {
        console.error('Ошибка удаления ГТС:', err);
        showAlertMessage(err.message || 'Не удалось удалить ГТС', 'error');
      }
    }
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    try {
      const facilityData = {
        name: formData.name,
        region: formData.region,
        type: formData.type,
        status: formData.status,
        technical_condition: parseInt(formData.technical_condition),
        water_type: formData.water_type,
        has_fauna: formData.has_fauna === 'true',
        passport_date: formData.passport_date,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      if (formData.commissioned_year) facilityData.commissioned_year = parseInt(formData.commissioned_year);
      if (formData.capacity) facilityData.capacity = parseFloat(formData.capacity);
      if (formData.description) facilityData.description = formData.description;

      const response = await createFacility(facilityData);
      if (response.success) {
        showAlertMessage('ГТС успешно создано', 'success');
        setShowAddModal(false);
        resetForm();
        loadFacilities();
      }
    } catch (err) {
      console.error('Ошибка создания ГТС:', err);
      showAlertMessage(err.message || 'Не удалось создать ГТС', 'error');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      const facilityData = {
        name: formData.name,
        region: formData.region,
        type: formData.type,
        status: formData.status,
        technical_condition: parseInt(formData.technical_condition),
        water_type: formData.water_type,
        has_fauna: formData.has_fauna === 'true',
        passport_date: formData.passport_date,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      if (formData.commissioned_year) facilityData.commissioned_year = parseInt(formData.commissioned_year);
      if (formData.capacity) facilityData.capacity = parseFloat(formData.capacity);
      if (formData.description) facilityData.description = formData.description;

      const response = await updateFacility(selectedFacility.id, facilityData);
      if (response.success) {
        showAlertMessage('ГТС успешно обновлено', 'success');
        setShowEditModal(false);
        setSelectedFacility(null);
        resetForm();
        loadFacilities();
      }
    } catch (err) {
      console.error('Ошибка обновления ГТС:', err);
      showAlertMessage(err.message || 'Не удалось обновить ГТС', 'error');
    }
  };

  const handleExport = () => {
    showAlertMessage('Функция экспорта в разработке', 'info');
  };

  const handleImport = () => {
    showAlertMessage('Функция импорта в разработке', 'info');
  };

  if (loading && facilities.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Alert */}
        {showAlert && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
            alertType === 'success' ? 'bg-green-500 text-white' :
            alertType === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {alertType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {alertMessage}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Zap className="w-8 h-8 mr-3" />
                  Управление ГТС
                </h1>
                <p className="text-purple-100">Полное управление гидротехническими сооружениями</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleImport}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Импорт
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Экспорт
                </button>
                <button
                  onClick={handleAddFacility}
                  className="flex items-center px-4 py-2 bg-white text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Добавить ГТС
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`bg-gradient-to-br ${stat.color} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                    <div className="mt-3 flex items-center text-white/90 text-sm">
                      {parseFloat(stat.change) > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : null}
                      <span>{stat.change} за неделю</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию ГТС..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5 mr-2" />
                Фильтры
              </button>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow text-purple-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'cards' ? 'bg-white shadow text-purple-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layers className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Регион
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {regions.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тип ГТС
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {facilityTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Категория состояния
                    </label>
                    <select
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Все категории</option>
                      <option value="1">Категория 1</option>
                      <option value="2">Категория 2</option>
                      <option value="3">Категория 3</option>
                      <option value="4">Категория 4</option>
                      <option value="5">Категория 5</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedRegion('');
                      setSelectedType('');
                      setSelectedCondition('');
                    }}
                    className="px-4 py-2 text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4 text-gray-600">
            Найдено: <span className="font-semibold text-gray-900">{filteredFacilities.length}</span> из {facilities.length} ГТС
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Название</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Регион</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Тип</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Статус</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Состояние</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredFacilities.map((facility) => (
                      <tr key={facility.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                              <Zap className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{facility.name}</p>
                              <p className="text-sm text-gray-500">ID: {facility.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{facility.region}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            {getTypeLabel(facility.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(facility.status)}`}>
                            {getStatusLabel(facility.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(facility.technicalCondition)}`}>
                            Категория {facility.technicalCondition}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditFacility(facility)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Редактировать"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFacility(facility.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cards View */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <div key={facility.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(facility.status)}`}>
                        {getStatusLabel(facility.status)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{facility.name}</h3>
                    <p className="text-white/80 text-sm">{facility.region}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Тип:</span>
                        <span className="font-semibold text-gray-900">{getTypeLabel(facility.type)}</span>
                      </div>
                      {facility.commissionedYear && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Год ввода:</span>
                          <span className="font-semibold text-gray-900">{facility.commissionedYear}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Состояние:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(facility.technicalCondition)}`}>
                          Категория {facility.technicalCondition}
                        </span>
                      </div>
                      {facility.capacity && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Мощность:</span>
                          <span className="font-semibold text-gray-900">{facility.capacity} МВт</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditFacility(facility)}
                        className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDeleteFacility(facility.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredFacilities.length === 0 && !loading && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ГТС не найдены</h3>
              <p className="text-gray-600 mb-6">Попробуйте изменить параметры поиска или добавьте новое ГТС</p>
              <button
                onClick={handleAddFacility}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Добавить ГТС
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <Plus className="w-6 h-6 mr-3" />
                  Добавить новое ГТС
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitCreate} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Введите название ГТС"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Регион <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Выберите регион</option>
                    {regions.filter(r => r !== 'Все регионы').map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип ГТС <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Выберите тип</option>
                    {facilityTypes.filter(t => t.value).map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Выберите статус</option>
                    {statuses.filter(s => s.value).map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Техническое состояние (1-5) <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.technical_condition}
                    onChange={(e) => setFormData({...formData, technical_condition: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Выберите категорию</option>
                    <option value="1">Категория 1 (Отличное)</option>
                    <option value="2">Категория 2 (Хорошее)</option>
                    <option value="3">Категория 3 (Удовлетворительное)</option>
                    <option value="4">Категория 4 (Плохое)</option>
                    <option value="5">Категория 5 (Критическое)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип воды <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.water_type}
                    onChange={(e) => setFormData({...formData, water_type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Выберите тип</option>
                    <option value="fresh">Пресная</option>
                    <option value="non-fresh">Непресная</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Наличие фауны <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.has_fauna}
                    onChange={(e) => setFormData({...formData, has_fauna: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Выберите</option>
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата паспорта <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.passport_date}
                    onChange={(e) => setFormData({...formData, passport_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Год ввода в эксплуатацию
                  </label>
                  <input
                    type="number"
                    value={formData.commissioned_year}
                    onChange={(e) => setFormData({...formData, commissioned_year: e.target.value})}
                    placeholder="1980"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Мощность (МВт)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="675"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Широта <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    placeholder="47.0833"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Долгота <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    placeholder="83.3333"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Дополнительная информация о ГТС..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold flex items-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedFacility && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <Edit className="w-6 h-6 mr-3" />
                  Редактировать ГТС
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedFacility(null);
                    resetForm();
                  }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-purple-100 mt-2">ID: {selectedFacility.id} • {selectedFacility.name}</p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitEdit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Регион <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {regions.filter(r => r !== 'Все регионы').map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип ГТС <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {facilityTypes.filter(t => t.value).map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {statuses.filter(s => s.value).map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Техническое состояние (1-5) <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.technical_condition}
                    onChange={(e) => setFormData({...formData, technical_condition: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="1">Категория 1 (Отличное)</option>
                    <option value="2">Категория 2 (Хорошее)</option>
                    <option value="3">Категория 3 (Удовлетворительное)</option>
                    <option value="4">Категория 4 (Плохое)</option>
                    <option value="5">Категория 5 (Критическое)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип воды <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.water_type}
                    onChange={(e) => setFormData({...formData, water_type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="fresh">Пресная</option>
                    <option value="non-fresh">Непресная</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Наличие фауны <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.has_fauna}
                    onChange={(e) => setFormData({...formData, has_fauna: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата паспорта <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.passport_date}
                    onChange={(e) => setFormData({...formData, passport_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Год ввода в эксплуатацию
                  </label>
                  <input
                    type="number"
                    value={formData.commissioned_year}
                    onChange={(e) => setFormData({...formData, commissioned_year: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Мощность (МВт)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Широта <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Долгота <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedFacility(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold flex items-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default FacilitiesManagement;

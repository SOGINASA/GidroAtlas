import { useState, useEffect } from 'react';
import {
  Droplets,
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
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Layers,
  Save,
  X,
  Fish,
  Waves,
  Loader
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';
import {
  getWaterBodies,
  createWaterBody,
  updateWaterBody,
  deleteWaterBody
} from '../../services/waterBodyService';

const WaterBodiesManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const [selectedWaterType, setSelectedWaterType] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWaterBody, setSelectedWaterBody] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [waterBodies, setWaterBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Данные формы для создания/редактирования
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    type: '',
    water_type: '',
    has_fauna: '',
    technical_condition: '',
    passport_date: '',
    area: '',
    volume: '',
    max_depth: '',
    latitude: '',
    longitude: '',
    passport_pdf_url: ''
  });

  useEffect(() => {
    loadWaterBodies();
  }, [selectedRegion, selectedResourceType]);

  const loadWaterBodies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedRegion && selectedRegion !== 'Все регионы') {
        params.region = selectedRegion;
      }
      if (selectedResourceType) {
        params.type = selectedResourceType;
      }

      const response = await getWaterBodies(params);
      if (response.success) {
        setWaterBodies(response.data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Ошибка загрузки водоёмов:', err);
      setError('Не удалось загрузить водоёмы');
      setWaterBodies([]);
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

  // Типы водных ресурсов
  const resourceTypes = [
    { value: '', label: 'Все типы' },
    { value: 'lake', label: 'Озеро' },
    { value: 'canal', label: 'Канал' },
    { value: 'reservoir', label: 'Водохранилище' }
  ];

  // Типы воды
  const waterTypes = [
    { value: '', label: 'Все типы воды' },
    { value: 'fresh', label: 'Пресная' },
    { value: 'non-fresh', label: 'Непресная' }
  ];

  // Статистика
  const stats = [
    {
      icon: Droplets,
      label: 'Всего водоёмов',
      value: waterBodies.length.toString(),
      change: '+8',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Waves,
      label: 'Пресная вода',
      value: waterBodies.filter(w => w.waterType === 'fresh').length.toString(),
      change: '+6',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: AlertTriangle,
      label: 'Требуют внимания',
      value: waterBodies.filter(w => w.technicalCondition >= 4).length.toString(),
      change: '+1',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Fish,
      label: 'С фауной',
      value: waterBodies.filter(w => w.hasFauna).length.toString(),
      change: '0',
      color: 'from-purple-500 to-pink-500'
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

  const getResourceTypeLabel = (type) => {
    const labels = {
      lake: 'Озеро',
      canal: 'Канал',
      reservoir: 'Водохранилище'
    };
    return labels[type] || type;
  };

  const getWaterTypeLabel = (type) => {
    const labels = {
      fresh: 'Пресная',
      'non-fresh': 'Непресная'
    };
    return labels[type] || type;
  };

  // Фильтрация на клиенте
  const filteredWaterBodies = waterBodies.filter(waterBody => {
    const matchesSearch = waterBody.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWaterType = !selectedWaterType || waterBody.waterType === selectedWaterType;
    const matchesCondition = !selectedCondition || waterBody.technicalCondition === parseInt(selectedCondition);

    return matchesSearch && matchesWaterType && matchesCondition;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      region: '',
      type: '',
      water_type: '',
      has_fauna: '',
      technical_condition: '',
      passport_date: '',
      area: '',
      volume: '',
      max_depth: '',
      latitude: '',
      longitude: '',
      passport_pdf_url: ''
    });
  };

  const handleAddWaterBody = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditWaterBody = (waterBody) => {
    setSelectedWaterBody(waterBody);
    setFormData({
      name: waterBody.name || '',
      region: waterBody.region || '',
      type: waterBody.type || '',
      water_type: waterBody.waterType || '',
      has_fauna: waterBody.hasFauna ? 'true' : 'false',
      technical_condition: waterBody.technicalCondition?.toString() || '',
      passport_date: waterBody.passportDate || '',
      area: waterBody.area?.toString() || '',
      volume: waterBody.volume?.toString() || '',
      max_depth: waterBody.maxDepth?.toString() || '',
      latitude: waterBody.latitude?.toString() || '',
      longitude: waterBody.longitude?.toString() || '',
      passport_pdf_url: waterBody.passportPdfUrl || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteWaterBody = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот водоём?')) {
      try {
        const response = await deleteWaterBody(id);
        if (response.success) {
          showAlertMessage('Водоём успешно удалён', 'success');
          loadWaterBodies();
        }
      } catch (err) {
        console.error('Ошибка удаления водоёма:', err);
        showAlertMessage(typeof err === 'string' ? err : 'Не удалось удалить водоём', 'error');
      }
    }
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    try {
      const waterBodyData = {
        name: formData.name,
        region: formData.region,
        type: formData.type,
        water_type: formData.water_type,
        has_fauna: formData.has_fauna === 'true',
        technical_condition: parseInt(formData.technical_condition),
        passport_date: formData.passport_date,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      if (formData.area) waterBodyData.area = parseFloat(formData.area);
      if (formData.volume) waterBodyData.volume = parseFloat(formData.volume);
      if (formData.max_depth) waterBodyData.max_depth = parseFloat(formData.max_depth);
      if (formData.passport_pdf_url) waterBodyData.passport_pdf_url = formData.passport_pdf_url;

      const response = await createWaterBody(waterBodyData);
      if (response.success) {
        showAlertMessage('Водоём успешно создан', 'success');
        setShowAddModal(false);
        resetForm();
        loadWaterBodies();
      }
    } catch (err) {
      console.error('Ошибка создания водоёма:', err);
      showAlertMessage(typeof err === 'string' ? err : 'Не удалось создать водоём', 'error');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      const waterBodyData = {
        name: formData.name,
        region: formData.region,
        type: formData.type,
        water_type: formData.water_type,
        has_fauna: formData.has_fauna === 'true',
        technical_condition: parseInt(formData.technical_condition),
        passport_date: formData.passport_date,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      if (formData.area) waterBodyData.area = parseFloat(formData.area);
      if (formData.volume) waterBodyData.volume = parseFloat(formData.volume);
      if (formData.max_depth) waterBodyData.max_depth = parseFloat(formData.max_depth);
      if (formData.passport_pdf_url) waterBodyData.passport_pdf_url = formData.passport_pdf_url;

      const response = await updateWaterBody(selectedWaterBody.id, waterBodyData);
      if (response.success) {
        showAlertMessage('Водоём успешно обновлён', 'success');
        setShowEditModal(false);
        setSelectedWaterBody(null);
        resetForm();
        loadWaterBodies();
      }
    } catch (err) {
      console.error('Ошибка обновления водоёма:', err);
      showAlertMessage(typeof err === 'string' ? err : 'Не удалось обновить водоём', 'error');
    }
  };

  const handleExport = () => {
    showAlertMessage('Функция экспорта в разработке', 'info');
  };

  const handleImport = () => {
    showAlertMessage('Функция импорта в разработке', 'info');
  };

  if (loading && waterBodies.length === 0) {
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
                  <Droplets className="w-8 h-8 mr-3" />
                  Управление водоёмами
                </h1>
                <p className="text-purple-100">Полное управление водными ресурсами Казахстана</p>
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
                  onClick={handleAddWaterBody}
                  className="flex items-center px-4 py-2 bg-white text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Добавить водоём
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
                  placeholder="Поиск по названию водоёма..."
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      Тип водного ресурса
                    </label>
                    <select
                      value={selectedResourceType}
                      onChange={(e) => setSelectedResourceType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {resourceTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тип воды
                    </label>
                    <select
                      value={selectedWaterType}
                      onChange={(e) => setSelectedWaterType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {waterTypes.map((type) => (
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
                      setSelectedResourceType('');
                      setSelectedWaterType('');
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
            Найдено: <span className="font-semibold text-gray-900">{filteredWaterBodies.length}</span> из {waterBodies.length} водоёмов
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Тип ресурса</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Тип воды</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Фауна</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Состояние</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredWaterBodies.map((waterBody) => (
                      <tr key={waterBody.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                              <Droplets className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{waterBody.name}</p>
                              <p className="text-sm text-gray-500">ID: {waterBody.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{waterBody.region}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            {getResourceTypeLabel(waterBody.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            waterBody.waterType === 'fresh' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {getWaterTypeLabel(waterBody.waterType)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {waterBody.hasFauna ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-400" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(waterBody.technicalCondition)}`}>
                            Категория {waterBody.technicalCondition}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditWaterBody(waterBody)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Редактировать"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteWaterBody(waterBody.id)}
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
              {filteredWaterBodies.map((waterBody) => (
                <div key={waterBody.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Droplets className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        {waterBody.hasFauna && (
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center" title="Есть фауна">
                            <Fish className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{waterBody.name}</h3>
                    <p className="text-white/80 text-sm">{waterBody.region}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Тип:</span>
                        <span className="font-semibold text-gray-900">{getResourceTypeLabel(waterBody.type)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Тип воды:</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          waterBody.waterType === 'fresh' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {getWaterTypeLabel(waterBody.waterType)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Состояние:</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getConditionColor(waterBody.technicalCondition)}`}>
                          Категория {waterBody.technicalCondition}
                        </span>
                      </div>
                      {waterBody.area && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Площадь:</span>
                          <span className="font-semibold text-gray-900">{waterBody.area.toLocaleString('ru-RU')} км²</span>
                        </div>
                      )}
                      {waterBody.maxDepth && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Макс. глубина:</span>
                          <span className="font-semibold text-gray-900">{waterBody.maxDepth} м</span>
                        </div>
                      )}
                      {waterBody.passportDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Дата паспорта:</span>
                          <span className="text-gray-900">{new Date(waterBody.passportDate).toLocaleDateString('ru-RU')}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Stats */}
                    {(waterBody.latitude && waterBody.longitude) && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-center mb-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <p className="text-xs text-gray-600 text-center">Координаты</p>
                        <p className="text-sm font-semibold text-gray-900 text-center">
                          {waterBody.latitude.toFixed(2)}, {waterBody.longitude.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEditWaterBody(waterBody)}
                        className="flex items-center justify-center px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDeleteWaterBody(waterBody.id)}
                        className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredWaterBodies.length === 0 && !loading && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Водоёмы не найдены</h3>
              <p className="text-gray-600 mb-6">Попробуйте изменить параметры фильтрации или добавьте новый водоём</p>
              <button
                onClick={handleAddWaterBody}
                className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Добавить водоём
              </button>
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <Plus className="w-6 h-6 mr-3" />
                  Добавить новый водоём
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

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
                      placeholder="Озеро Балхаш"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      Тип водного ресурса <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Выберите тип</option>
                      {resourceTypes.filter(t => t.value).map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
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
                      <option value="">Выберите тип воды</option>
                      {waterTypes.filter(t => t.value).map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
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
                      Дата паспорта <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.passport_date}
                      onChange={(e) => setFormData({...formData, passport_date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Площадь (км²)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      placeholder="16400"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Объём (км³)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.volume}
                      onChange={(e) => setFormData({...formData, volume: e.target.value})}
                      placeholder="112"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Максимальная глубина (м)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.max_depth}
                      onChange={(e) => setFormData({...formData, max_depth: e.target.value})}
                      placeholder="26"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      placeholder="46.8333"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      placeholder="74.9833"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ссылка на PDF паспорт
                    </label>
                    <input
                      type="url"
                      value={formData.passport_pdf_url}
                      onChange={(e) => setFormData({...formData, passport_pdf_url: e.target.value})}
                      placeholder="https://example.com/passport.pdf"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedWaterBody && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <Edit className="w-6 h-6 mr-3" />
                  Редактировать: {selectedWaterBody.name}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedWaterBody(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      Тип водного ресурса <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {resourceTypes.filter(t => t.value).map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
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
                      {waterTypes.filter(t => t.value).map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
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
                      Дата паспорта <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.passport_date}
                      onChange={(e) => setFormData({...formData, passport_date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Площадь (км²)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Объём (км³)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.volume}
                      onChange={(e) => setFormData({...formData, volume: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Максимальная глубина (м)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.max_depth}
                      onChange={(e) => setFormData({...formData, max_depth: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ссылка на PDF паспорт
                    </label>
                    <input
                      type="url"
                      value={formData.passport_pdf_url}
                      onChange={(e) => setFormData({...formData, passport_pdf_url: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Сохранить изменения
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedWaterBody(null);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default WaterBodiesManagement;

import React, { useState } from 'react';
import GuestLayout from '../../components/navigation/guest/GuestLayout';
import { Zap, Search, MapPin, X, Lock, Activity, Calendar } from 'lucide-react';

const GuestFacilitiesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);

  const facilities = [
    {
      id: 1,
      name: 'Бухтарминская ГЭС',
      region: 'Восточно-Казахстанская область',
      type: 'hydropower',
      status: 'operational',
      capacity: 675,
      commissionedYear: 1966,
      technicalCondition: 3,
      description: 'Одна из крупнейших гидроэлектростанций Казахстана на реке Иртыш.',
      image: '⚡'
    },
    {
      id: 2,
      name: 'Шульбинская ГЭС',
      region: 'Восточно-Казахстанская область',
      type: 'hydropower',
      status: 'operational',
      capacity: 702,
      commissionedYear: 1987,
      technicalCondition: 2,
      description: 'Современная ГЭС с высокой эффективностью генерации.',
      image: '🔋'
    },
    {
      id: 3,
      name: 'Капшагайская ГЭС',
      region: 'Алматинская область',
      type: 'hydropower',
      status: 'operational',
      capacity: 364,
      commissionedYear: 1970,
      technicalCondition: 4,
      description: 'ГЭС на реке Или, обеспечивающая электроэнергией южные регионы.',
      image: '💡'
    },
    {
      id: 4,
      name: 'Плотина Сорг',
      region: 'Алматинская область',
      type: 'dam',
      status: 'operational',
      capacity: 0,
      commissionedYear: 1978,
      technicalCondition: 2,
      description: 'Защитная плотина для регулирования водных потоков.',
      image: '🏗️'
    }
  ];

  const filteredFacilities = facilities.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConditionColor = (condition) => {
    const colors = {
      1: 'bg-green-100 text-green-700 border-green-200',
      2: 'bg-lime-100 text-lime-700 border-lime-200',
      3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      4: 'bg-orange-100 text-orange-700 border-orange-200',
      5: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[condition] || colors[3];
  };

  const getTypeLabel = (type) => {
    const labels = {
      hydropower: 'ГЭС',
      dam: 'Плотина',
      canal: 'Канал',
      pumping_station: 'Насосная станция'
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status) => {
    const labels = {
      operational: 'Работает',
      maintenance: 'На ТО',
      emergency: 'Авария',
      decommissioned: 'Выведена'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      operational: 'bg-green-100 text-green-700',
      maintenance: 'bg-yellow-100 text-yellow-700',
      emergency: 'bg-red-100 text-red-700',
      decommissioned: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || colors.operational;
  };

  return (
    <GuestLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">Гидротехнические сооружения</h1>
            </div>
            <p className="text-sm lg:text-base text-gray-300">
              ГЭС, плотины и другие сооружения
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          
          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск ГТС..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Всего</p>
              <p className="text-2xl font-bold text-gray-900">{facilities.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">ГЭС</p>
              <p className="text-2xl font-bold text-purple-600">
                {facilities.filter(f => f.type === 'hydropower').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Работают</p>
              <p className="text-2xl font-bold text-green-600">
                {facilities.filter(f => f.status === 'operational').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Общая мощность</p>
              <p className="text-2xl font-bold text-blue-600">
                {facilities.reduce((sum, f) => sum + f.capacity, 0)} МВт
              </p>
            </div>
          </div>

          {/* Facilities List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden cursor-pointer"
                onClick={() => setSelectedFacility(facility)}
              >
                {/* Image Header */}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 h-32 flex items-center justify-center text-6xl">
                  {facility.image}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{facility.name}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      {getTypeLabel(facility.type)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(facility.status)}`}>
                      {getStatusLabel(facility.status)}
                    </span>
                    {facility.capacity > 0 && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <Activity className="w-3 h-3" />
                        <span>{facility.capacity} МВт</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{facility.region}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Год ввода: {facility.commissionedYear}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-600">Состояние: </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getConditionColor(facility.technicalCondition)}`}>
                        Кат. {facility.technicalCondition}
                      </span>
                    </div>
                    <button
                      onClick={() => window.location.href = `/guest/facility/${facility.id}`}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Подробнее →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFacilities.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ничего не найдено</h3>
              <p className="text-gray-600">Попробуйте изменить поисковый запрос</p>
            </div>
          )}
        </div>
      </div>

      {/* Facility Details Modal */}
      {selectedFacility && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
            onClick={() => setSelectedFacility(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 animate-slideUp overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header with Image */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-6 text-white relative">
              <button
                onClick={() => setSelectedFacility(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-6xl mb-3">{selectedFacility.image}</div>
              <h2 className="text-2xl font-bold mb-1">{selectedFacility.name}</h2>
              <p className="text-purple-100">{getTypeLabel(selectedFacility.type)}</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{selectedFacility.description}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Регион</p>
                  <p className="font-semibold text-gray-900 text-sm">{selectedFacility.region}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Статус</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedFacility.status)}`}>
                    {getStatusLabel(selectedFacility.status)}
                  </span>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Год ввода</p>
                  <p className="font-semibold text-gray-900">{selectedFacility.commissionedYear}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Состояние</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getConditionColor(selectedFacility.technicalCondition)}`}>
                    Категория {selectedFacility.technicalCondition}
                  </span>
                </div>
              </div>

              {/* Capacity */}
              {selectedFacility.capacity > 0 && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-100 mb-1">Установленная мощность</p>
                      <p className="text-4xl font-bold">{selectedFacility.capacity}</p>
                      <p className="text-sm text-blue-100">МВт</p>
                    </div>
                    <Activity className="w-16 h-16 text-white/30" />
                  </div>
                </div>
              )}

              {/* Locked Features */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Детальная информация</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Технические спецификации, история обслуживания, паспорт объекта и данные мониторинга доступны только авторизованным пользователям.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                  <div>• История генерации</div>
                  <div>• Техническая документация</div>
                  <div>• Графики работы турбин</div>
                  <div>• PDF Паспорт</div>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg"
              >
                Войти для полного доступа
              </button>
            </div>
          </div>
        </>
      )}
    </GuestLayout>
  );
};

export default GuestFacilitiesPage;
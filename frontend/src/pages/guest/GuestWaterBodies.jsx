import React, { useState } from 'react';
import GuestLayout from '../../components/navigation/guest/GuestLayout';
import { Droplets, Search, MapPin, X, Lock, Calendar, FileText } from 'lucide-react';

const GuestWaterBodiesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWaterBody, setSelectedWaterBody] = useState(null);

  const waterBodies = [
    {
      id: 1,
      name: 'Река Иртыш',
      region: 'Восточно-Казахстанская область',
      type: 'river',
      waterType: 'fresh',
      fauna: true,
      technicalCondition: 4,
      description: 'Одна из крупнейших рек Казахстана, протекающая через восточные регионы страны.',
      image: '🏞️'
    },
    {
      id: 2,
      name: 'Озеро Балхаш',
      region: 'Алматинская область',
      type: 'lake',
      waterType: 'fresh',
      fauna: true,
      technicalCondition: 2,
      description: 'Уникальное озеро, одна часть которого пресная, а другая - солоноватая.',
      image: '🌊'
    },
    {
      id: 3,
      name: 'Бухтарминское водохранилище',
      region: 'Восточно-Казахстанская область',
      type: 'reservoir',
      waterType: 'fresh',
      fauna: true,
      technicalCondition: 3,
      description: 'Крупное водохранилище на реке Иртыш, созданное для нужд ГЭС.',
      image: '💧'
    },
    {
      id: 4,
      name: 'Капшагайское водохранилище',
      region: 'Алматинская область',
      type: 'reservoir',
      waterType: 'fresh',
      fauna: true,
      technicalCondition: 2,
      description: 'Водохранилище на реке Или, популярное место отдыха.',
      image: '🏖️'
    }
  ];

  const filteredWaterBodies = waterBodies.filter(wb =>
    wb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wb.region.toLowerCase().includes(searchQuery.toLowerCase())
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
      river: 'Река',
      lake: 'Озеро',
      reservoir: 'Водохранилище',
      canal: 'Канал'
    };
    return labels[type] || type;
  };

  return (
    <GuestLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <Droplets className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">Водоёмы Казахстана</h1>
            </div>
            <p className="text-sm lg:text-base text-gray-300">
              Реки, озёра и водохранилища
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
                placeholder="Поиск водоёмов..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Всего</p>
              <p className="text-2xl font-bold text-gray-900">{waterBodies.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Рек</p>
              <p className="text-2xl font-bold text-blue-600">
                {waterBodies.filter(w => w.type === 'river').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Озёр</p>
              <p className="text-2xl font-bold text-cyan-600">
                {waterBodies.filter(w => w.type === 'lake').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Водохранилищ</p>
              <p className="text-2xl font-bold text-purple-600">
                {waterBodies.filter(w => w.type === 'reservoir').length}
              </p>
            </div>
          </div>

          {/* Water Bodies List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWaterBodies.map((wb) => (
              <div
                key={wb.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden cursor-pointer"
                onClick={() => setSelectedWaterBody(wb)}
              >
                {/* Image Header */}
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 h-32 flex items-center justify-center text-6xl">
                  {wb.image}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{wb.name}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {getTypeLabel(wb.type)}
                    </span>
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
                      {wb.waterType === 'fresh' ? 'Пресная' : 'Непресная'}
                    </span>
                    {wb.fauna && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Есть фауна
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{wb.region}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-600">Состояние: </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getConditionColor(wb.technicalCondition)}`}>
                        Кат. {wb.technicalCondition}
                      </span>
                    </div>
                    <button
                      onClick={() => window.location.href = `/guest/waterbody/${wb.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Подробнее →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredWaterBodies.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ничего не найдено</h3>
              <p className="text-gray-600">Попробуйте изменить поисковый запрос</p>
            </div>
          )}
        </div>
      </div>

      {/* Water Body Details Modal */}
      {selectedWaterBody && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
            onClick={() => setSelectedWaterBody(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 animate-slideUp overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header with Image */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white relative">
              <button
                onClick={() => setSelectedWaterBody(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-6xl mb-3">{selectedWaterBody.image}</div>
              <h2 className="text-2xl font-bold mb-1">{selectedWaterBody.name}</h2>
              <p className="text-blue-100">{getTypeLabel(selectedWaterBody.type)}</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{selectedWaterBody.description}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Регион</p>
                  <p className="font-semibold text-gray-900">{selectedWaterBody.region}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Тип воды</p>
                  <p className="font-semibold text-gray-900">
                    {selectedWaterBody.waterType === 'fresh' ? 'Пресная' : 'Непресная'}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Фауна</p>
                  <p className="font-semibold text-gray-900">
                    {selectedWaterBody.fauna ? '✓ Присутствует' : '✗ Отсутствует'}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Состояние</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getConditionColor(selectedWaterBody.technicalCondition)}`}>
                    Категория {selectedWaterBody.technicalCondition}
                  </span>
                </div>
              </div>

              {/* Locked Features */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Дополнительная информация</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Технические характеристики, исторические данные, качество воды и паспорт объекта доступны только авторизованным пользователям.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>История уровня воды</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>PDF Паспорт</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
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

export default GuestWaterBodiesPage;
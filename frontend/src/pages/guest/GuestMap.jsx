import React, { useState } from 'react';
import GuestLayout from '../../components/navigation/guest/GuestLayout';
import { MapPin, Droplets, Zap, X, Info, AlertCircle } from 'lucide-react';

const GuestMapPage = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [showLegend, setShowLegend] = useState(true);

  // Mock data для объектов на карте
  const waterBodies = [
    { id: 1, name: 'Река Иртыш', type: 'river', region: 'ВКО', condition: 4, lat: 49.9, lng: 82.6 },
    { id: 2, name: 'Озеро Балхаш', type: 'lake', region: 'Алматинская', condition: 2, lat: 46.8, lng: 74.9 },
    { id: 3, name: 'Бухтарминское в-ще', type: 'reservoir', region: 'ВКО', condition: 3, lat: 49.0, lng: 83.5 }
  ];

  const facilities = [
    { id: 1, name: 'Бухтарминская ГЭС', type: 'hydropower', region: 'ВКО', condition: 3, capacity: 675, lat: 49.1, lng: 83.4 },
    { id: 2, name: 'Капшагайская ГЭС', type: 'hydropower', region: 'Алматинская', condition: 4, capacity: 364, lat: 43.9, lng: 77.1 }
  ];

  const getConditionColor = (condition) => {
    const colors = { 1: '#10B981', 2: '#84CC16', 3: '#F59E0B', 4: '#F97316', 5: '#EF4444' };
    return colors[condition] || colors[3];
  };

  const getTypeLabel = (type) => {
    const labels = {
      river: 'Река', lake: 'Озеро', reservoir: 'Водохранилище',
      hydropower: 'ГЭС', dam: 'Плотина'
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
              <MapPin className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">Карта объектов</h1>
            </div>
            <p className="text-sm lg:text-base text-gray-300">
              Интерактивная карта водоёмов и гидротехнических сооружений
            </p>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          {/* Fake Map */}
          <div className="w-full h-[calc(100vh-200px)] bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 relative overflow-hidden">
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
            {waterBodies.map((wb) => (
              <button
                key={`wb-${wb.id}`}
                onClick={() => setSelectedObject({ ...wb, objectType: 'waterbody' })}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ 
                  left: `${(wb.lng - 45) * 8}%`, 
                  top: `${(55 - wb.lat) * 10}%` 
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-125"
                  style={{ backgroundColor: getConditionColor(wb.condition) }}
                >
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {wb.name}
                </div>
              </button>
            ))}

            {/* Facilities Markers */}
            {facilities.map((f) => (
              <button
                key={`f-${f.id}`}
                onClick={() => setSelectedObject({ ...f, objectType: 'facility' })}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ 
                  left: `${(f.lng - 45) * 8}%`, 
                  top: `${(55 - f.lat) * 10}%` 
                }}
              >
                <div 
                  className="w-12 h-12 rounded-lg border-4 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-125"
                  style={{ backgroundColor: getConditionColor(f.condition) }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {f.name}
                </div>
              </button>
            ))}

            {/* Legend */}
            {showLegend && (
              <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-xl p-4 max-w-xs">
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
                    <p className="text-xs font-semibold text-gray-700 mb-2">Состояние:</p>
                    {[1, 2, 3, 4, 5].map((cat) => (
                      <div key={cat} className="flex items-center space-x-2 mb-1">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: getConditionColor(cat) }}
                        />
                        <span className="text-xs">Категория {cat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!showLegend && (
              <button
                onClick={() => setShowLegend(true)}
                className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Info className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-t border-gray-200 px-4 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{waterBodies.length}</p>
              <p className="text-sm text-gray-600">Водоёмов</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{facilities.length}</p>
              <p className="text-sm text-gray-600">ГТС</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {[...waterBodies, ...facilities].filter(o => o.condition <= 2).length}
              </p>
              <p className="text-sm text-gray-600">Хорошее</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {[...waterBodies, ...facilities].filter(o => o.condition >= 4).length}
              </p>
              <p className="text-sm text-gray-600">Требуют внимания</p>
            </div>
          </div>
        </div>
      </div>

      {/* Object Details Modal */}
      {selectedObject && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
            onClick={() => setSelectedObject(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 animate-slideUp overflow-hidden">
            {/* Header */}
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
                      {getTypeLabel(selectedObject.type)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedObject.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedObject(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Регион</p>
                  <p className="font-semibold text-gray-900">{selectedObject.region}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Состояние</p>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getConditionColor(selectedObject.condition) }}
                    />
                    <span className="font-semibold text-gray-900">Категория {selectedObject.condition}</span>
                  </div>
                </div>
              </div>

              {selectedObject.capacity && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1">Мощность</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedObject.capacity} МВт</p>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 mb-1">Ограниченный доступ</p>
                  <p className="text-sm text-amber-700">
                    Войдите в систему для просмотра подробной информации, технических характеристик и паспорта объекта.
                  </p>
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

export default GuestMapPage;
import React, { useState } from 'react';
import {
  ArrowLeft,
  Droplets,
  MapPin,
  Compass,
  Calendar,
  FileText,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

// Мок-данные по объекту (Озеро Балхаш)
const mockWaterBody = {
  id: 1,
  name: 'Озеро Балхаш',
  region: 'Карагандинская область',
  resourceType: 'озеро',          // enum: озеро / канал / водохранилище
  waterType: 'пресная',           // enum: пресная / непресная
  hasFauna: true,                 // да / нет
  passportDate: '2022-09-15',     // дата паспорта
  technicalCondition: 3,          // 1–5
  latitude: 46.800000,            // широта
  longitude: 74.900000,           // долгота
  passportUrl: null               // если будет PDF – сюда положишь ссылку
};

const statusColorByCondition = (condition) => {
  switch (condition) {
    case 1:
      return 'bg-green-500';
    case 2:
      return 'bg-lime-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-orange-500';
    case 5:
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

const statusTextByCondition = (condition) => {
  switch (condition) {
    case 1:
      return 'Отличное';
    case 2:
      return 'Хорошее';
    case 3:
      return 'Среднее';
    case 4:
      return 'Плохое';
    case 5:
      return 'Критическое';
    default:
      return 'Неизвестно';
  }
};

const WaterBodyDetail = () => {
  const [showPassportModal, setShowPassportModal] = useState(false);
  const w = mockWaterBody;

  const handleOpenPassport = () => {
    if (w.passportUrl) {
      // Когда появится реальный PDF – просто подставишь ссылку в паспортUrl
      window.open(w.passportUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Пока нет реальных данных – показываем заглушку
      setShowPassportModal(true);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* HEADER */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Назад
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-6 h-6 text-blue-500" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    {w.name}
                  </h1>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                  <span className="inline-flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {w.region}
                  </span>
                  <span>•</span>
                  <span className="capitalize">Тип ресурса: {w.resourceType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Тех. состояние</p>
                <p className="text-sm font-semibold text-gray-900">
                  {statusTextByCondition(w.technicalCondition)}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${statusColorByCondition(
                  w.technicalCondition
                )}`}
              >
                {w.technicalCondition}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6 flex items-center">
                <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                Карточка объекта
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Левая колонка */}
                <div className="space-y-4 text-sm">
                  <InfoRow label="Название" value={w.name} />
                  <InfoRow label="Область" value={w.region} />
                  <InfoRow
                    label="Тип водного ресурса"
                    value={capitalizeRus(w.resourceType)}
                  />
                  <InfoRow
                    label="Тип воды"
                    value={capitalizeRus(w.waterType)}
                  />
                  <InfoRow
                    label="Наличие фауны"
                    value={w.hasFauna ? 'Да, есть' : 'Нет данных / отсутствует'}
                  />
                </div>

                {/* Правая колонка */}
                <div className="space-y-4 text-sm">
                  <InfoRow
                    label="Дата паспорта"
                    value={w.passportDate || 'Не указана'}
                    icon={Calendar}
                  />
                  <InfoRow
                    label="Техническое состояние (1–5)"
                    value={
                      <>
                        <span className="font-semibold mr-2">
                          {w.technicalCondition}
                        </span>
                        <span className="text-gray-500">
                          — {statusTextByCondition(w.technicalCondition)}
                        </span>
                      </>
                    }
                  />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 mb-1">Координаты</p>
                    <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <Compass className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Широта:</span>
                      </div>
                      <span className="font-mono font-semibold text-gray-900">
                        {w.latitude.toFixed(6)}°
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <Compass className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Долгота:</span>
                      </div>
                      <span className="font-mono font-semibold text-gray-900">
                        {w.longitude.toFixed(6)}°
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Кнопка "Открыть паспорт" */}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <p className="text-xs text-gray-500 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mr-1" />
                  Паспорт может быть загружен в виде PDF-файла или открываться как
                  модальное окно с подробной информацией.
                </p>
                <button
                  type="button"
                  onClick={handleOpenPassport}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Открыть паспорт
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Модалка-заглушка для паспорта */}
        {showPassportModal && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-[2000]"
              onClick={() => setShowPassportModal(false)}
            />
            <div className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-24 w-auto md:w-full md:max-w-xl bg-white rounded-2xl shadow-2xl z-[2100] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h2 className="text-sm font-semibold text-gray-900">
                    Паспорт объекта
                  </h2>
                </div>
                <button
                  onClick={() => setShowPassportModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border border-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 text-sm text-gray-700 space-y-3">
                <p>
                  Сейчас для объекта <span className="font-semibold">{w.name}</span> нет
                  прикреплённого PDF-паспорта.
                </p>
                <p className="text-xs text-gray-500">
                  Когда на бэке появится загрузка паспорта, в поле{' '}
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">
                    passportUrl
                  </code>{' '}
                  можно будет хранить ссылку на файл и открывать его в новой вкладке.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 mb-0.5 flex items-center">
      {Icon && <Icon className="w-3 h-3 text-gray-400 mr-1" />}
      {label}
    </span>
    <span className="text-sm font-medium text-gray-900 break-words">
      {value}
    </span>
  </div>
);

const capitalizeRus = (str) =>
  typeof str === 'string' && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : str;

export default WaterBodyDetail;

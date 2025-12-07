import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Droplets,
  MapPin,
  Compass,
  Calendar,
  FileText,
  AlertTriangle
} from 'lucide-react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { getWaterBodyDetails } from '../../services/mapApi';

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
  const { id } = useParams();
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [waterBody, setWaterBody] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWaterBody();
  }, [id]);

  const loadWaterBody = async () => {
    try {
      setLoading(true);
      const data = await getWaterBodyDetails(id);
      setWaterBody(data);
    } catch (err) {
      console.error('Ошибка загрузки водного объекта:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPassport = () => {
    if (waterBody?.passportUrl) {
      window.open(waterBody.passportUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowPassportModal(true);
    }
  };

  if (loading) {
    return (
      <EmergencyLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка данных...</p>
          </div>
        </div>
      </EmergencyLayout>
    );
  }

  if (error || !waterBody) {
    return (
      <EmergencyLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-2">Ошибка загрузки</p>
            <p className="text-gray-600">{error || 'Объект не найден'}</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Назад
            </button>
          </div>
        </div>
      </EmergencyLayout>
    );
  }

  const w = waterBody;

  return (
    <EmergencyLayout>
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
                    value={capitalizeRus(w.type || w.resourceType)}
                  />
                  <InfoRow
                    label="Тип воды"
                    value={capitalizeRus(w.waterType)}
                  />
                  <InfoRow
                    label="Наличие фауны"
                    value={w.hasFauna ? 'Да, есть' : 'Нет данных / отсутствует'}
                  />
                  {w.maxDepth && (
                    <InfoRow
                      label="Максимальная глубина"
                      value={`${w.maxDepth} м`}
                    />
                  )}
                  {w.area && (
                    <InfoRow
                      label="Площадь"
                      value={`${w.area} км²`}
                    />
                  )}
                </div>

                {/* Правая колонка */}
                <div className="space-y-4 text-sm">
                  <InfoRow
                    label="Год паспорта"
                    value={w.passportYear ? w.passportYear : (w.passportDate ? new Date(w.passportDate).getFullYear() : 'Не указан')}
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
                  {w.description && (
                    <InfoRow
                      label="Описание"
                      value={w.description}
                    />
                  )}
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 mb-1">Координаты</p>
                    {(w.coordinates?.lat || w.latitude) && (
                      <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <Compass className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Широта:</span>
                        </div>
                        <span className="font-mono font-semibold text-gray-900">
                          {(w.coordinates?.lat || w.latitude).toFixed(6)}°
                        </span>
                      </div>
                    )}
                    {(w.coordinates?.lng || w.longitude) && (
                      <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <Compass className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Долгота:</span>
                        </div>
                        <span className="font-mono font-semibold text-gray-900">
                          {(w.coordinates?.lng || w.longitude).toFixed(6)}°
                        </span>
                      </div>
                    )}
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
                
              </div>
            </div>
          </>
        )}
      </div>
    </EmergencyLayout>
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

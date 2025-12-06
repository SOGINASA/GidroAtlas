import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  MapPin,
  Compass,
  Calendar,
  FileText,
  AlertTriangle,
  Settings
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';
import { getHydroFacilityDetails } from '../../services/mapApi';

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

const FacilityDetail = () => {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFacility();
  }, [id]);

  const loadFacility = async () => {
    try {
      setLoading(true);
      const data = await getHydroFacilityDetails(id);
      setFacility(data);
    } catch (err) {
      console.error('Ошибка загрузки ГТС:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка данных...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !facility) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-2">Ошибка загрузки</p>
            <p className="text-gray-600">{error || 'ГТС не найдено'}</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Назад
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const f = facility;

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
                  <Zap className="w-6 h-6 text-purple-500" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    {f.name}
                  </h1>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                  <span className="inline-flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {f.region}
                  </span>
                  <span>•</span>
                  <span className="capitalize">Тип: {f.type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Тех. состояние</p>
                <p className="text-sm font-semibold text-gray-900">
                  {statusTextByCondition(f.technicalCondition || f.condition)}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${statusColorByCondition(
                  f.technicalCondition || f.condition
                )}`}
              >
                {f.technicalCondition || f.condition}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6 flex items-center">
                <Settings className="w-4 h-4 text-purple-500 mr-2" />
                Карточка объекта
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Левая колонка */}
                <div className="space-y-4 text-sm">
                  <InfoRow label="Название" value={f.name} />
                  <InfoRow label="Область" value={f.region} />
                  <InfoRow label="Тип ГТС" value={f.type} />
                  {f.status && (
                    <InfoRow label="Статус" value={f.status} />
                  )}
                  {f.capacity && (
                    <InfoRow label="Мощность" value={`${f.capacity} МВт`} />
                  )}
                  {f.yearBuilt && (
                    <InfoRow label="Год постройки" value={f.yearBuilt} />
                  )}
                  {f.waterBody && (
                    <InfoRow label="Водный объект" value={f.waterBody} />
                  )}
                </div>

                {/* Правая колонка */}
                <div className="space-y-4 text-sm">
                  <InfoRow
                    label="Год паспорта"
                    value={f.passportYear ? f.passportYear : (f.passportDate ? new Date(f.passportDate).getFullYear() : 'Не указан')}
                    icon={Calendar}
                  />
                  <InfoRow
                    label="Техническое состояние (1–5)"
                    value={
                      <>
                        <span className="font-semibold mr-2">
                          {f.technicalCondition || f.condition}
                        </span>
                        <span className="text-gray-500">
                          — {statusTextByCondition(f.technicalCondition || f.condition)}
                        </span>
                      </>
                    }
                  />
                  {f.description && (
                    <InfoRow label="Описание" value={f.description} />
                  )}
                  {(f.issues !== undefined || f.alerts !== undefined) && (
                    <div className="space-y-2">
                      {f.issues !== undefined && (
                        <InfoRow label="Количество проблем" value={f.issues} />
                      )}
                      {f.alerts !== undefined && (
                        <InfoRow label="Количество предупреждений" value={f.alerts} />
                      )}
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 mb-1">Координаты</p>
                    {(f.coordinates?.lat || f.latitude) && (
                      <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <Compass className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Широта:</span>
                        </div>
                        <span className="font-mono font-semibold text-gray-900">
                          {(f.coordinates?.lat || f.latitude).toFixed(6)}°
                        </span>
                      </div>
                    )}
                    {(f.coordinates?.lng || f.longitude) && (
                      <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <Compass className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Долгота:</span>
                        </div>
                        <span className="font-mono font-semibold text-gray-900">
                          {(f.coordinates?.lng || f.longitude).toFixed(6)}°
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default FacilityDetail;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Compass,
  Calendar,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/navigation/admin/AdminLayout';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import GuestLayout from '../../components/navigation/guest/GuestLayout';

const CriticalZoneDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);

  // Определяем Layout в зависимости от роли пользователя
  const LayoutComponent = {
    admin: AdminLayout,
    expert: ExpertLayout,
    emergency: EmergencyLayout,
    guest: GuestLayout,
  }[user?.role] || GuestLayout;

  useEffect(() => {
    loadZone();
  }, [id]);

  const loadZone = async () => {
    try {
      setLoading(true);
      // В будущем здесь будет API вызов
      // Пока используем заглушку
      setTimeout(() => {
        setZone({
          id,
          name: `Критическая зона #${id}`,
          description: 'Данные критической зоны временно недоступны',
          level: 'warning',
          region: 'Неизвестно'
        });
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Ошибка загрузки критической зоны:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка данных...</p>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  if (!zone) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-2">Критическая зона не найдена</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Назад
            </button>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
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
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    {zone.name}
                  </h1>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                  <span className="inline-flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {zone.region}
                  </span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    zone.level === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {zone.level === 'critical' ? 'КРИТИЧЕСКИЙ' : 'ПРЕДУПРЕЖДЕНИЕ'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6 flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                Информация о критической зоне
              </h2>

              <div className="space-y-4 text-sm">
                <InfoRow label="ID зоны" value={zone.id} />
                <InfoRow label="Название" value={zone.name} />
                <InfoRow label="Описание" value={zone.description} />
                <InfoRow label="Область" value={zone.region} />
                <InfoRow
                  label="Уровень опасности"
                  value={zone.level === 'critical' ? 'Критический' : 'Предупреждение'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
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

export default CriticalZoneDetailPage;

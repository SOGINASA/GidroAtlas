import React from 'react';
import { useAuth } from '../../components/api/AuthUtils';

const CitizenDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Дашборд гражданина
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Добро пожаловать, {user?.email}!</p>
        <p className="text-gray-500 mt-2">Здесь будет основной контент...</p>
      </div>
    </div>
  );
};

export default CitizenDashboard;
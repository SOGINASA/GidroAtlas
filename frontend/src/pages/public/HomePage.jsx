import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">
            🌊 Гидроатлас Казахстана
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Интерактивная система мониторинга водных ресурсов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-blue-600 mb-3">Гражданин</h3>
            <p className="text-gray-600 mb-6">
              Доступ к информации о водных ресурсах региона
            </p>
            <Link 
              to="/login?role=citizen"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Войти
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🚨</div>
            <h3 className="text-2xl font-bold text-red-600 mb-3">МЧС</h3>
            <p className="text-gray-600 mb-6">
              Панель мониторинга и прогнозирования
            </p>
            <Link 
              to="/login?role=emergency"
              className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Войти
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">⚙️</div>
            <h3 className="text-2xl font-bold text-purple-600 mb-3">Администратор</h3>
            <p className="text-gray-600 mb-6">
              Управление системой и настройки
            </p>
            <Link 
              to="/login?role=admin"
              className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Droplets } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a4275] via-[#0d5a94] to-[#1068a8] flex items-center justify-center px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* Animated Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-bounce">
              <Droplets className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-white mb-4 animate-pulse">404</h1>
        
        <h2 className="text-4xl font-bold text-white mb-4">Страница не найдена</h2>
        
        <p className="text-xl text-white/70 mb-8 max-w-lg mx-auto">
          К сожалению, запрашиваемая вами страница не существует или была перемещена.
        </p>

        {/* Search Icon Animation */}
        <div className="mb-8">
          <Search className="w-16 h-16 text-cyan-300/50 mx-auto animate-bounce" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group flex items-center space-x-2 px-8 py-3 bg-white text-[#0a4275] rounded-xl font-bold hover:bg-cyan-50 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>На главную</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center space-x-2 px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Назад</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 mb-4">Или перейдите к:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/guest/map"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-lg text-sm transition-all duration-300"
            >
              Карта
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-lg text-sm transition-all duration-300"
            >
              Вход
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-lg text-sm transition-all duration-300"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
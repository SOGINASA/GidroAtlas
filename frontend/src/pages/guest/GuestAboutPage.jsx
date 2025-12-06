import React, { useState } from 'react';
import GuestLayout from '../../components/navigation/guest/GuestLayout';
import { Info, Droplets, MapPin, Brain, Shield, Users, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';

const GuestAboutPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const features = [
    {
      icon: MapPin,
      title: 'Интерактивная карта',
      description: 'Визуализация всех водных объектов и ГТС на единой карте Казахстана с детальной информацией.'
    },
    {
      icon: Brain,
      title: 'AI-прогнозирование',
      description: 'Система искусственного интеллекта для предсказания состояния водных ресурсов и приоритизации обследований.'
    },
    {
      icon: Shield,
      title: 'Система безопасности',
      description: 'Многоуровневая система доступа с разграничением прав для различных типов пользователей.'
    },
    {
      icon: Users,
      title: 'Мониторинг 24/7',
      description: 'Круглосуточный мониторинг состояния водных объектов и оперативное реагирование на изменения.'
    }
  ];

  const stats = [
    { number: '2500+', label: 'Водных объектов' },
    { number: '24/7', label: 'Мониторинг' },
    { number: '17', label: 'Регионов' },
    { number: '1000+', label: 'Пользователей' }
  ];

  const faqs = [
    {
      question: 'Что такое GidroAtlas?',
      answer: 'GidroAtlas - это комплексная система мониторинга и управления водными ресурсами Казахстана. Платформа объединяет информацию о водоёмах, гидротехнических сооружениях и использует AI для прогнозирования и приоритизации обследований.'
    },
    {
      question: 'Какая информация доступна гостям?',
      answer: 'Гостевой доступ позволяет просматривать базовую информацию о водных объектах: название, расположение, тип, состояние. Для доступа к детальным техническим характеристикам, паспортам и AI-прогнозам необходима авторизация.'
    },
    {
      question: 'Как получить полный доступ?',
      answer: 'Для получения полного доступа необходимо зарегистрироваться в системе как эксперт, представитель МЧС или администратор. Обратитесь к администратору системы для получения учётных данных.'
    },
    {
      question: 'Что такое система приоритизации?',
      answer: 'Система приоритизации использует формулу (6 - состояние) × 3 + возраст_паспорта для определения объектов, требующих первоочередного обследования. Объекты с оценкой ≥12 имеют высокий приоритет.'
    },
    {
      question: 'Как работает AI-прогнозирование?',
      answer: 'AI-система анализирует исторические данные, текущее состояние объектов, метеорологические условия и другие факторы для предсказания уровня воды, качества и потенциальных рисков на период от 24 часов до нескольких месяцев.'
    },
    {
      question: 'Какие регионы охватывает система?',
      answer: 'GidroAtlas охватывает все 17 регионов Казахстана: 14 областей и 3 города республиканского значения (Алматы, Астана, Шымкент), обеспечивая комплексный мониторинг водных ресурсов по всей стране.'
    }
  ];

  const userRoles = [
    {
      icon: '👤',
      title: 'Гость',
      access: 'Базовый просмотр',
      features: ['Карта объектов', 'Базовая информация', 'Без регистрации']
    },
    {
      icon: '🎓',
      title: 'Эксперт',
      access: 'Полный аналитический',
      features: ['Вся аналитика', 'AI-прогнозы', 'Приоритизация', 'PDF паспорта']
    },
    {
      icon: '🚨',
      title: 'МЧС',
      access: 'Оперативное управление',
      features: ['Критические зоны', 'Массовые уведомления', 'Отчёты', 'Эвакуации']
    },
    {
      icon: '⚙️',
      title: 'Администратор',
      access: 'Полное управление',
      features: ['CRUD операции', 'Управление пользователями', 'Настройка AI', 'Логи системы']
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <GuestLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 lg:px-8 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Droplets className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">GidroAtlas Kazakhstan</h1>
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
              Современная система мониторинга и управления водными ресурсами Казахстана
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-16">
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                <p className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ключевые возможности</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Roles */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Типы пользователей</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userRoles.map((role, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-6 text-center text-white">
                    <div className="text-5xl mb-3">{role.icon}</div>
                    <h3 className="text-xl font-bold mb-1">{role.title}</h3>
                    <p className="text-sm text-gray-200">{role.access}</p>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {role.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Часто задаваемые вопросы</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4 pt-2 text-gray-600 border-t border-gray-100 animate-slideDown">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl p-8 lg:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Остались вопросы?</h2>
              <p className="text-gray-300 mb-8">
                Свяжитесь с нами для получения дополнительной информации о системе GidroAtlas
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <Mail className="w-8 h-8 mx-auto mb-3" />
                  <p className="font-semibold mb-1">Email</p>
                  <a href="mailto:info@gidroatlas.kz" className="text-sm text-gray-300 hover:text-white">
                    info@gidroatlas.kz
                  </a>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <Phone className="w-8 h-8 mx-auto mb-3" />
                  <p className="font-semibold mb-1">Телефон</p>
                  <a href="tel:+77001234567" className="text-sm text-gray-300 hover:text-white">
                    +7 (700) 123-45-67
                  </a>
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-8 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                Войти в систему
              </button>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default GuestAboutPage;
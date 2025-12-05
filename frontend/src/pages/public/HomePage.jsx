import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Droplets,
  Zap,
  TrendingUp,
  Shield,
  Brain,
  Users,
  Database,
  Activity,
  BarChart3,
  Eye,
  Layers,
  Target,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Waves,
  Cloud,
  Sun
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const HomePage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    objects: 0,
    regions: 0,
    users: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animated counters
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    const targets = {
      objects: 2500,
      regions: 17,
      users: 1000
    };
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounters({
        objects: Math.floor((targets.objects / steps) * step),
        regions: Math.floor((targets.regions / steps) * step),
        users: Math.floor((targets.users / steps) * step)
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Database,
      number: counters.objects.toLocaleString('ru-RU') + '+',
      label: 'Водных объектов',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: Activity,
      number: '24/7',
      label: 'Мониторинг',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Shield,
      number: counters.regions,
      label: 'Регионов',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Users,
      number: counters.users.toLocaleString('ru-RU') + '+',
      label: 'Пользователей',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const features = [
    {
      icon: MapPin,
      title: 'Интерактивная карта',
      description:
        'Просмотр всех водоёмов и гидротехнических сооружений Казахстана на единой карте с детальной информацией и цветовой индикацией состояния',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      icon: Brain,
      title: 'AI Прогнозирование',
      description:
        'Система искусственного интеллекта для предсказания состояния водных ресурсов и автоматической приоритизации обследований объектов',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: TrendingUp,
      title: 'Аналитика и отчёты',
      description:
        'Комплексная аналитика состояния водных ресурсов с визуализацией трендов, статистики и автоматической генерацией отчётов',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Безопасность данных',
      description:
        'Многоуровневая система доступа с разграничением прав для разных типов пользователей и полное шифрование данных',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const capabilities = [
    {
      icon: Eye,
      title: 'Визуализация',
      items: ['Интерактивные карты', 'Графики и диаграммы', '3D модели объектов']
    },
    {
      icon: Layers,
      title: 'Многослойность',
      items: ['Водоёмы', 'ГТС', 'Границы регионов', 'Критические зоны']
    },
    {
      icon: Target,
      title: 'Приоритизация',
      items: ['AI расчёт приоритетов', 'Автоматические алерты', 'Рекомендации']
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      items: ['Real-time мониторинг', 'Исторические данные', 'Прогнозы']
    }
  ];

  const userTypes = [
    {
      icon: Eye,
      iconColor: 'text-gray-400',
      role: 'guest',
      title: 'Гость',
      subtitle: 'Базовый доступ',
      description:
        'Просмотр карты и основной информации о водных объектах без регистрации',
      color: 'from-gray-500 to-gray-600',
      link: '/guest/map',
      features: ['Просмотр карты', 'Базовая информация', 'Без регистрации', 'Поиск объектов']
    },
    {
      icon: Brain,
      iconColor: 'text-blue-400',
      role: 'expert',
      title: 'Эксперт',
      subtitle: 'Профессиональный доступ',
      description:
        'Полный доступ к аналитике, приоритизации и AI-прогнозам для специалистов',
      color: 'from-blue-500 to-blue-600',
      link: '/login?role=expert',
      features: ['Полная аналитика', 'AI прогнозы', 'Приоритизация', 'PDF паспорта']
    },
    {
      icon: Activity,
      iconColor: 'text-red-400',
      role: 'emergency',
      title: 'МЧС',
      subtitle: 'Оперативное управление',
      description:
        'Мониторинг критических зон, прогнозирование рисков и управление уведомлениями',
      color: 'from-red-500 to-red-600',
      link: '/login?role=emergency',
      features: ['Центр управления', 'Критические зоны', 'Массовые уведомления', 'Отчёты']
    },
    {
      icon: Shield,
      iconColor: 'text-purple-400',
      role: 'admin',
      title: 'Администратор',
      subtitle: 'Полное управление',
      description: 'Управление системой, пользователями, данными и настройка AI моделей',
      color: 'from-purple-500 to-purple-600',
      link: '/login?role=admin',
      features: ['CRUD операции', 'Управление пользователями', 'Настройка AI', 'Логи системы']
    }
  ];

  const benefits = [
    {
      icon: CheckCircle2,
      title: 'Повышение эффективности',
      description: 'Автоматизация процессов мониторинга экономит до 70% времени специалистов'
    },
    {
      icon: CheckCircle2,
      title: 'Снижение рисков',
      description: 'Система раннего предупреждения помогает предотвращать аварийные ситуации'
    },
    {
      icon: CheckCircle2,
      title: 'Оптимизация ресурсов',
      description: 'AI приоритизация обследований снижает затраты на обслуживание на 40%'
    },
    {
      icon: CheckCircle2,
      title: 'Прозрачность данных',
      description: 'Открытый доступ к информации для всех заинтересованных сторон'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a4275] via-[#0d5a94] to-[#1068a8]">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <Waves className="absolute top-40 left-20 w-32 h-32 text-cyan-300/5 animate-bounce" />
          <Cloud className="absolute top-60 right-40 w-40 h-40 text-blue-300/5 animate-pulse" />
        </div>

        <div className="container mx-auto relative z-10">
          <div
            className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-cyan-400/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-cyan-400/30 hover:bg-cyan-400/30 transition-all duration-300 group">
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span className="text-cyan-100 text-sm font-medium">
                Система мониторинга водных ресурсов
              </span>
            </div>

            {/* Main Heading with Animation */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="inline-flex items-center">
                Gidro
                <Droplets className="inline-block mx-3 text-cyan-300 animate-bounce" />
                Atlas
              </span>
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-8 animate-gradient">
              Мониторинг водных ресурсов Казахстана
            </h2>

            {/* Description */}
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Современная система мониторинга и управления водными ресурсами. Интерактивная
              карта, AI-прогнозирование и система приоритизации обследований для эффективного
              управления гидротехническими сооружениями
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/guest/map"
                className="group w-full sm:w-auto px-8 py-4 bg-white text-[#0a4275] rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Начать использование</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center space-x-2 group"
              >
                <span>Узнать больше</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-cyan-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-cyan-400/30">
              <Zap className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-100 text-sm font-medium">Ключевые возможности</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Что делает GidroAtlas особенным
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Современные технологии для эффективного управления водными ресурсами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 group cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-cyan-400 shadow-2xl shadow-cyan-500/20' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group"
              >
                <capability.icon className="w-10 h-10 text-cyan-300 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                <h4 className="text-lg font-semibold text-white mb-3">{capability.title}</h4>
                <ul className="space-y-2">
                  {capability.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-white/60 text-sm">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-green-400/30">
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              <span className="text-green-100 text-sm font-medium">Преимущества</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Почему выбирают GidroAtlas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-white/70">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-400/30">
              <Users className="w-4 h-4 text-purple-300" />
              <span className="text-purple-100 text-sm font-medium">Роли пользователей</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Для кого создан GidroAtlas
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Различные уровни доступа для разных типов пользователей
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {userTypes.map((user, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 group"
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-br ${user.color} p-6 text-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <user.icon className={`w-8 h-8 ${user.iconColor}`} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{user.title}</h3>
                    <p className="text-white/80 text-sm">{user.subtitle}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-white/70 text-sm mb-6 leading-relaxed min-h-[60px]">
                    {user.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-2 mb-6">
                    {user.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-white/60 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Link
                    to={user.link}
                    className={`block w-full py-3 bg-gradient-to-br ${user.color} text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105 flex items-center justify-center space-x-2`}
                  >
                    <span>{user.role === 'guest' ? 'Открыть карту' : 'Войти в систему'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm"
      >
        <div className="container mx-auto text-center max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <Sparkles className="w-16 h-16 text-cyan-300 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Готовы начать?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Присоединяйтесь к современной системе мониторинга водных ресурсов Казахстана
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/guest/map"
                className="w-full sm:w-auto px-10 py-4 bg-white text-[#0a4275] rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all duration-300 shadow-2xl hover:scale-105 flex items-center justify-center space-x-2 group"
              >
                <span>Попробовать бесплатно</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/login?role=expert"
                className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Войти как эксперт
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
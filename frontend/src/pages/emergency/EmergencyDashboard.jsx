import React, { useState, useEffect } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Droplets, 
  Zap, 
  TrendingUp, 
  Users, 
  Activity,
  MapPin,
  Bell,
  FileText,
  ChevronRight,
  AlertCircle,
  Map
} from 'lucide-react';
import { getWaterBodies, getWaterBodiesStats } from '../../services/waterBodyService';
import { getHydroFacilities } from '../../services/hydroFacilityService';
import { getHighRiskPredictions } from '../../services/predictionService';
import { getAllSensors, getCriticalSensors } from '../../services/sensorService';

const EmergencyDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all data
      const sensorsResponse = await getAllSensors();
      const sensors = sensorsResponse.data || [];
      const criticalSensorsResponse = await getCriticalSensors();
      const criticalSensors = criticalSensorsResponse.data || [];

      const waterBodiesStats = await getWaterBodiesStats();
      const facilitiesResp = await getHydroFacilities();
      const facilities = facilitiesResp?.data || [];
      const highRiskPreds = await getHighRiskPredictions();
      const waterBodies = await getWaterBodies();

      // Build stats from real data
      const activeSensors = sensors.filter(s => s.status === 'active');
      const newStats = [
        {
          icon: Droplets,
          label: 'Водоёмы на контроле',
          value: waterBodiesStats?.total?.toString() || '0',
          change: '+3',
          color: 'from-blue-500 to-cyan-500'
        },
        {
          icon: Zap,
          label: 'ГТС в системе',
          value: (facilities && facilities.length)?.toString() || '0',
          change: '0',
          color: 'from-purple-500 to-pink-500'
        },
        {
          icon: AlertTriangle,
          label: 'Критические зоны',
          value: criticalSensors.length.toString(),
          change: `+${criticalSensors.filter(s => s.dangerLevel === 'critical').length}`,
          color: 'from-orange-500 to-red-500',
          alert: true
        },
        {
          icon: Activity,
          label: 'Активные датчики',
          value: activeSensors.length.toString(),
          change: `+${sensors.filter(s => s.dangerLevel === 'safe').length}`,
          color: 'from-green-500 to-emerald-500'
        }
      ];
      setStats(newStats);

      // Use critical sensors as alerts if no water bodies alerts
      const criticalWaterBodies = (waterBodies || [])
        .filter(wb => wb.status === 'critical' || wb.status === 'danger' || wb.status === 'warning')
        .slice(0, 3);

      if (criticalWaterBodies.length > 0) {
        setCriticalAlerts(criticalWaterBodies);
      } else {
        // Convert critical sensors to alerts format
        const sensorAlerts = criticalSensors.slice(0, 3).map(sensor => ({
          id: sensor.id,
          name: sensor.name,
          location: sensor.location,
          waterLevel: sensor.waterLevel,
          status: sensor.dangerLevel,
          lastUpdate: sensor.lastUpdate
        }));
        setCriticalAlerts(sensorAlerts);
      }

      // Set high-risk predictions
      setPredictions(highRiskPreds?.slice(0, 3) || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      console.warn('[WARNING] Using mock data for EmergencyDashboard - API request failed');
      setError('Ошибка при загрузке данных. Используются демо-данные.');
      // Set default mock data on error
      setDefaultMockData();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultMockData = () => {
    setStats([
      {
        icon: Droplets,
        label: 'Водоёмы на контроле',
        value: '156',
        change: '+3',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        icon: Zap,
        label: 'ГТС в системе',
        value: '47',
        change: '0',
        color: 'from-purple-500 to-pink-500'
      },
      {
        icon: AlertTriangle,
        label: 'Критические зоны',
        value: '8',
        change: '+2',
        color: 'from-orange-500 to-red-500',
        alert: true
      },
      {
        icon: Activity,
        label: 'Активные датчики',
        value: '234',
        change: '-5',
        color: 'from-green-500 to-emerald-500'
      }
    ]);
  };

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Default mock alerts if API data unavailable
  const defaultMockAlerts = [
    {
      id: 1,
      location: 'Река Иртыш, Павлодарская область',
      level: 'critical',
      message: 'Превышение критического уровня воды на 1.2м',
      waterLevel: 8.2,
      normalLevel: 7.0,
      time: '10 минут назад',
      affected: '~15,000 человек'
    },
    {
      id: 2,
      location: 'Озеро Балхаш, Алматинская область',
      level: 'warning',
      message: 'Приближение к критическому уровню',
      waterLevel: 6.8,
      normalLevel: 7.0,
      time: '25 минут назад',
      affected: '~8,000 человек'
    },
    {
      id: 3,
      location: 'Река Урал, ЗКО',
      level: 'danger',
      message: 'Быстрый подъём уровня воды',
      waterLevel: 5.4,
      normalLevel: 4.5,
      time: '1 час назад',
      affected: '~5,000 человек'
    }
  ];

  // Use predictions from state or defaults
  const displayPredictions = predictions.length > 0 ? predictions : [
    {
      id: 1,
      location: 'Иртыш (Павлодар)',
      risk: 'high',
      probability: 87,
      timeframe: '24-48 часов',
      recommendation: 'Готовность эвакуации'
    },
    {
      id: 2,
      location: 'Бухтарминское вдхр.',
      risk: 'medium',
      probability: 62,
      timeframe: '3-5 дней',
      recommendation: 'Усиленный мониторинг'
    },
    {
      id: 3,
      location: 'Капшагай ГЭС',
      risk: 'low',
      probability: 34,
      timeframe: '7+ дней',
      recommendation: 'Плановый контроль'
    }
  ];

  // Quick actions
  const quickActions = [
    { icon: Map, label: 'Открыть карту', path: '/emergency/map', color: 'bg-blue-500' },
    { icon: Bell, label: 'Отправить уведомление', path: '/emergency/notifications', color: 'bg-orange-500' },
    { icon: FileText, label: 'Создать отчёт', path: '/emergency/reports', color: 'bg-purple-500' },
    { icon: AlertTriangle, label: 'Критические зоны', path: '/emergency/critical-zones', color: 'bg-red-500' }
  ];

  // Recent actions
  const recentActions = [
    { icon: Users, action: 'Эвакуация начата', location: 'Павлодар, Иртыш', time: '15 мин. назад', status: 'active' },
    { icon: Bell, action: 'Массовое уведомление', location: 'Алматинская обл.', time: '1 час назад', status: 'sent' },
    { icon: FileText, action: 'Отчёт сформирован', location: 'Недельный анализ', time: '2 часа назад', status: 'completed' },
    { icon: Activity, action: 'Обновление данных', location: 'Все регионы', time: '3 часа назад', status: 'completed' }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'danger': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">🎛️ Центр управления МЧС</h1>
                <p className="text-red-100">Оперативное управление и мониторинг чрезвычайных ситуаций</p>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-right">
                  <p className="text-2xl font-bold">{currentTime.toLocaleTimeString('ru-RU')}</p>
                  <p className="text-sm text-red-100">{currentTime.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`bg-gradient-to-br ${stat.color} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-10 h-10 text-white" />
                      {stat.alert && (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                    <div className="mt-3 flex items-center text-white/90 text-sm">
                      {parseFloat(stat.change) > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : parseFloat(stat.change) < 0 ? <div className="w-4 h-4 mr-1" /> : null}
                      <span>{stat.change} за сегодня</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Critical Alerts & AI Predictions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Critical Alerts */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                  Критические алерты
                </h2>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                  {criticalAlerts.length}
                </span>
              </div>

              <div className="space-y-4">
                {(criticalAlerts.length > 0 ? criticalAlerts : defaultMockAlerts).map((alert) => (
                  <div key={alert.id} className={`border-2 rounded-xl p-4 ${getLevelColor(alert.level)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{alert.location}</h3>
                        <p className="text-sm mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-xs">
                          <span>💧 {alert.waterLevel}м (норма: {alert.normalLevel}м)</span>
                          <span>👥 {alert.affected}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs opacity-70 mt-2">{alert.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Predictions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Activity className="w-6 h-6 text-purple-600 mr-2" />
                  AI Прогнозирование
                </h2>
                <Link to="/emergency/predictions" className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
                  Все →
                </Link>
              </div>

              <div className="space-y-4">
                {displayPredictions.map((pred) => (
                  <div key={pred.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{pred.location}</h3>
                        <p className={`text-sm font-semibold ${getRiskColor(pred.risk)}`}>
                          Риск: {pred.risk === 'high' ? 'Высокий' : pred.risk === 'medium' ? 'Средний' : 'Низкий'} ({pred.probability}%)
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                        <span className={`text-xl font-bold ${getRiskColor(pred.risk)}`}>{pred.probability}%</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>⏱ Прогноз: {pred.timeframe}</div>
                      <div>💡 {pred.recommendation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Быстрые действия</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.path}
                    className={`${action.color} text-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center text-center`}
                  >
                    <Icon className="w-10 h-10 mb-3" />
                    <span className="font-semibold">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Последние действия</h2>
            <div className="space-y-3">
              {recentActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{action.action}</p>
                      <p className="text-sm text-gray-600">{action.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{action.time}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${
                        action.status === 'active' ? 'bg-green-100 text-green-800' :
                        action.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {action.status === 'active' ? 'Активно' :
                         action.status === 'sent' ? 'Отправлено' : 'Выполнено'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default EmergencyDashboard;
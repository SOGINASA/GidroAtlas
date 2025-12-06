import React, { useState, useEffect } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { AlertTriangle, Users, TrendingUp, MapPin, Phone } from 'lucide-react';
import { getRiskZones } from '../../services/sensorService';
import { getEvacuationOperations, updateEvacuationStatus, initiateEvacuationOperation } from '../../services/evacuationService';

const CriticalZonesPage = () => {
  const [activeTab, setActiveTab] = useState('zones');
  const [zones, setZones] = useState([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const [zonesError, setZonesError] = useState(null);
  const [evacuations, setEvacuations] = useState([]);
  const [loadingEvacuations, setLoadingEvacuations] = useState(false);
  const [evacError, setEvacError] = useState(null);
  const [startingEvacIds, setStartingEvacIds] = useState({});
  const [initiatingIds, setInitiatingIds] = useState({});

  useEffect(() => {
    let mountedEv = true;
    const loadEvacuations = async () => {
      setLoadingEvacuations(true);
      try {
        const res = await getEvacuationOperations();
        if (mountedEv && res && res.data) {
          setEvacuations(res.data || []);
        }
      } catch (err) {
        console.error('Ошибка загрузки операций эвакуаций', err);
        setEvacError(err.message || 'Ошибка получения эвакуаций');
      } finally {
        setLoadingEvacuations(false);
      }
    };

    loadEvacuations();
    return () => { mountedEv = false; };
  }, []);

  const refreshEvacuations = async () => {
    setLoadingEvacuations(true);
    try {
      const res = await getEvacuationOperations();
      setEvacuations(res.data || []);
    } catch (err) {
      setEvacError(err.message || 'Ошибка получения эвакуаций');
    } finally {
      setLoadingEvacuations(false);
    }
  };

  const handleStartEvacuation = async (operation) => {
    if (!operation || !operation.evacuations || operation.evacuations.length === 0) {
      // Нет индивидуальных записей — предлагаем создать
      const confirm = window.confirm('Нет существующих заявок на эвакуацию. Хотите создать их для всех жителей в этой зоне?');
      if (confirm) {
        await handleInitiateEvacuation(operation);
      }
      return;
    }

    // Помечаем, что операция стартует
    setStartingEvacIds(prev => ({ ...prev, [operation.id]: true }));

    try {
      const promises = operation.evacuations.map(ev => {
        if (ev.status === 'in_progress' || ev.status === 'completed') return Promise.resolve();
        return updateEvacuationStatus(ev.id, 'in_progress');
      });

      await Promise.all(promises);
      // Обновим список операций
      await refreshEvacuations();
    } catch (err) {
      console.error('Ошибка при старте эвакуации', err);
      alert(err.message || 'Не удалось начать эвакуацию');
    } finally {
      setStartingEvacIds(prev => {
        const next = { ...prev };
        delete next[operation.id];
        return next;
      });
    }
  };

  const handleInitiateEvacuation = async (operation) => {
    if (!operation || !operation.location) {
      alert('Не удалось определить место эвакуации');
      return;
    }

    setInitiatingIds(prev => ({ ...prev, [operation.id]: true }));

    try {
      await initiateEvacuationOperation({
        location: operation.location,
        evacuation_point: operation.location,
        region: operation.region,
        demo_count: 5  // Создаем 5 демонстрационных заявок для тестирования
      });

      // Обновим список операций после создания
      await refreshEvacuations();
    } catch (err) {
      console.error('Ошибка при создании заявок на эвакуацию', err);
      alert(err.message || 'Не удалось создать заявки на эвакуацию');
    } finally {
      setInitiatingIds(prev => {
        const next = { ...prev };
        delete next[operation.id];
        return next;
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingZones(true);
      try {
        const res = await getRiskZones();
        if (mounted && res && res.data) {
          // Ensure array format and map to expected UI fields if necessary
          const mapped = (res.data || []).map((z, idx) => ({
            id: z.id || idx,
            location: z.location || z.name,
            region: z.region,
            waterLevel: z.waterLevel,
            threshold: z.threshold,
            trend: z.trend,
            affectedPopulation: z.affectedPopulation,
            evacuated: z.evacuated,
            status: z.status,
            sensors: z.sensors || z.relatedSensors || []
          }));
          setZones(mapped);
        }
      } catch (err) {
        console.error('Ошибка загрузки зон риска', err);
        setZonesError(err.message || 'Ошибка получения зон');
      } finally {
        setLoadingZones(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">⚠️ Критические зоны</h1>
            <p className="text-red-100">Мониторинг и управление эвакуациями</p>
          </div>
        </div>

          <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Критич. зоны</p>
                  <p className="text-2xl font-bold text-red-600">{zones.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Под угрозой</p>
                  <p className="text-2xl font-bold">{zones.reduce((sum, z) => sum + z.affectedPopulation, 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Эвакуировано</p>
                  <p className="text-2xl font-bold text-green-600">{zones.reduce((sum, z) => sum + z.evacuated, 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚍</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Активных эвакуаций</p>
                  <p className="text-2xl font-bold text-blue-600">{(evacuations || []).filter(e => e.inProgress).length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-lg border mb-6">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('zones')}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'zones' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'
                  }`}
                >
                  Критические зоны ({zones.length})
                </button>
                <button
                  onClick={() => setActiveTab('evacuations')}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'evacuations' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'
                  }`}
                >
                  Активные эвакуации ({evacuations.length})
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'zones' && (
                <div className="space-y-6">
                  {loadingZones && <div className="p-6">Загрузка критических зон...</div>}
                  {zonesError && <div className="p-6 text-red-600">Ошибка: {zonesError}</div>}
                  {!loadingZones && zones.length === 0 && !zonesError && (
                    <div className="p-6 text-gray-600">Критические зоны не найдены</div>
                  )}

                  {zones.map((zone) => (
                    <div key={zone.id} className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{zone.location}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {zone.region}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                          zone.status === 'critical' ? 'bg-red-600 text-white' :
                          zone.status === 'warning' ? 'bg-yellow-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {zone.status === 'critical' ? 'КРИТИЧНО' :
                           zone.status === 'warning' ? 'ПРЕДУПР.' : 'НАБЛЮДЕНИЕ'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600">Уровень воды</p>
                          <p className="text-2xl font-bold text-red-600">{zone.waterLevel}м</p>
                          <p className="text-xs text-gray-500">Порог: {zone.threshold}м</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600">Тренд</p>
                          <div className="flex items-center text-2xl font-bold">
                            {zone.trend === 'rising' && <><TrendingUp className="w-6 h-6 text-red-600 mr-2" /><span className="text-red-600">↑</span></>}
                            {zone.trend === 'stable' && <span className="text-gray-600">→</span>}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600">Под угрозой</p>
                          <p className="text-2xl font-bold text-orange-600">{zone.affectedPopulation.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">человек</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600">Эвакуировано</p>
                          <p className="text-2xl font-bold text-green-600">{zone.evacuated.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">человек</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Датчики: {(zone.sensors || []).join(', ')}
                        </div>
                        <button
                          onClick={() => handleStartEvacuation(evacuations.find(op => op.location === zone.location) || { location: zone.location, region: zone.region })}
                          disabled={startingEvacIds[evacuations.find(op => op.location === zone.location)?.id] || initiatingIds[evacuations.find(op => op.location === zone.location)?.id] || false}
                          className={`px-6 py-2 rounded-lg font-semibold ${(startingEvacIds[evacuations.find(op => op.location === zone.location)?.id] || initiatingIds[evacuations.find(op => op.location === zone.location)?.id]) ? 'bg-gray-400 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
                        >
                          {initiatingIds[evacuations.find(op => op.location === zone.location)?.id] ? 'Создание...' : startingEvacIds[evacuations.find(op => op.location === zone.location)?.id] ? 'Запуск...' : 'Начать эвакуацию'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'evacuations' && (
                <div className="space-y-6">
                  {loadingEvacuations && <div className="p-4">Загрузка эвакуаций...</div>}
                  {!loadingEvacuations && (evacuations || []).map((evac) => (
                    <div key={evac.id} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{evac.location}</h3>
                          <p className="text-sm text-gray-600">{evac.region}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-bold text-sm ${evac.inProgress ? 'bg-green-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700'}`}>
                          {evac.inProgress ? 'В ПРОЦЕССЕ' : 'ОЖИДАНИЕ'}
                        </span>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Прогресс эвакуации</span>
                          <span className="text-lg font-bold">{Math.round((evac.evacuated/evac.totalPeople)*100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div 
                            className="bg-green-500 h-4 transition-all duration-500"
                            style={{ width: `${(evac.evacuated/evac.totalPeople)*100}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {evac.evacuated} из {evac.totalPeople} человек
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        {evac.shelters.map((shelter, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4">
                            <p className="font-semibold mb-2">{shelter.name}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Заполнено:</span>
                              <span className="font-bold">{shelter.occupied}/{shelter.capacity}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className={`h-2 rounded-full ${shelter.occupied/shelter.capacity > 0.9 ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${(shelter.occupied/shelter.capacity)*100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-2xl mb-1">🚍</p>
                          <p className="text-xl font-bold">{evac.transport.active}/{evac.transport.buses}</p>
                          <p className="text-xs text-gray-600">Автобусов</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-2xl mb-1">⚕️</p>
                          <p className="text-xl font-bold">{evac.medicalTeams}</p>
                          <p className="text-xs text-gray-600">Мед. бригад</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-2xl mb-1">📞</p>
                          <p className="text-sm font-bold">{evac.contact}</p>
                          <p className="text-xs text-gray-600">Контакт</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default CriticalZonesPage;
import React, { useState } from 'react';
import { 
  Brain, 
  Cpu, 
  Zap,
  TrendingUp,
  Activity,
  Settings,
  BarChart3,
  LineChart,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Save,
  Play,
  Pause,
  StopCircle,
  Upload,
  Download,
  Database,
  Clock,
  Gauge,
  Sliders,
  Eye,
  Code,
  Terminal,
  FileText,
  Shield,
  Layers,
  GitBranch,
  Server,
  HardDrive,
  Clipboard,
  Award,
  TrendingDown
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

const AISettings = () => {
  const [activeTab, setActiveTab] = useState('models');
  const [selectedModel, setSelectedModel] = useState(null);

  // AI модели
  const [models, setModels] = useState([
    {
      id: 1,
      name: 'Прогнозирование уровня воды',
      type: 'LSTM',
      version: '2.1.0',
      status: 'active',
      accuracy: 94.2,
      lastTrained: '2024-11-28',
      trainingTime: '3ч 24м',
      datasetSize: '125,000',
      parameters: {
        epochs: 100,
        batchSize: 32,
        learningRate: 0.001,
        hiddenLayers: 3,
        neurons: [128, 64, 32]
      },
      metrics: {
        mse: 0.0234,
        rmse: 0.153,
        mae: 0.112,
        r2: 0.942
      },
      lastPrediction: '2024-12-06 14:30:00',
      predictionsCount: 15678,
      resources: {
        cpu: 45,
        memory: 2.3,
        gpu: 0
      }
    },
    {
      id: 2,
      name: 'Классификация технического состояния',
      type: 'Random Forest',
      version: '1.8.3',
      status: 'active',
      accuracy: 89.7,
      lastTrained: '2024-11-15',
      trainingTime: '1ч 52м',
      datasetSize: '45,000',
      parameters: {
        nEstimators: 200,
        maxDepth: 15,
        minSamplesSplit: 5,
        minSamplesLeaf: 2
      },
      metrics: {
        precision: 0.897,
        recall: 0.883,
        f1Score: 0.890,
        auc: 0.945
      },
      lastPrediction: '2024-12-06 13:15:00',
      predictionsCount: 8945,
      resources: {
        cpu: 28,
        memory: 1.2,
        gpu: 0
      }
    },
    {
      id: 3,
      name: 'Обнаружение аномалий',
      type: 'Isolation Forest',
      version: '1.5.1',
      status: 'training',
      accuracy: 91.3,
      lastTrained: '2024-12-04',
      trainingTime: '45м',
      datasetSize: '78,000',
      parameters: {
        nEstimators: 100,
        contamination: 0.1,
        maxSamples: 256
      },
      metrics: {
        precision: 0.913,
        recall: 0.865,
        f1Score: 0.888,
        falsePositiveRate: 0.087
      },
      lastPrediction: '2024-12-06 12:00:00',
      predictionsCount: 12340,
      resources: {
        cpu: 62,
        memory: 3.8,
        gpu: 0
      }
    },
    {
      id: 4,
      name: 'Приоритизация обследований',
      type: 'Gradient Boosting',
      version: '2.0.5',
      status: 'active',
      accuracy: 92.8,
      lastTrained: '2024-11-20',
      trainingTime: '2ч 10м',
      datasetSize: '32,000',
      parameters: {
        nEstimators: 150,
        learningRate: 0.05,
        maxDepth: 8,
        subsample: 0.8
      },
      metrics: {
        accuracy: 0.928,
        precision: 0.935,
        recall: 0.921,
        f1Score: 0.928
      },
      lastPrediction: '2024-12-06 14:45:00',
      predictionsCount: 23456,
      resources: {
        cpu: 35,
        memory: 1.8,
        gpu: 0
      }
    },
    {
      id: 5,
      name: 'Прогноз качества воды',
      type: 'Neural Network',
      version: '1.3.2',
      status: 'inactive',
      accuracy: 87.4,
      lastTrained: '2024-10-15',
      trainingTime: '4ч 15м',
      datasetSize: '95,000',
      parameters: {
        layers: [64, 32, 16, 8],
        activation: 'relu',
        optimizer: 'adam',
        dropout: 0.3
      },
      metrics: {
        mse: 0.045,
        rmse: 0.212,
        mae: 0.165,
        r2: 0.874
      },
      lastPrediction: '2024-11-30 10:20:00',
      predictionsCount: 5678,
      resources: {
        cpu: 0,
        memory: 0,
        gpu: 0
      }
    }
  ]);

  // Общие настройки AI
  const [aiSettings, setAiSettings] = useState({
    autoRetrain: true,
    retrainInterval: 7, // дни
    minDatasetSize: 1000,
    maxPredictionsPerHour: 1000,
    enableGPU: false,
    maxMemoryUsage: 8, // GB
    enableLogging: true,
    logLevel: 'info',
    enableMonitoring: true,
    alertThreshold: 80, // accuracy %
    autoScaling: true
  });

  // Статистика
  const stats = [
    {
      label: 'Активных моделей',
      value: '3',
      change: '+1',
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Средняя точность',
      value: '91.0%',
      change: '+2.3%',
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Прогнозов сегодня',
      value: '1,234',
      change: '+15%',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Использование CPU',
      value: '42%',
      change: '-5%',
      icon: Cpu,
      color: 'from-orange-500 to-yellow-500'
    }
  ];

  const tabs = [
    { id: 'models', label: 'Модели', icon: Brain, count: models.length },
    { id: 'training', label: 'Обучение', icon: Activity, count: 0 },
    { id: 'datasets', label: 'Датасеты', icon: Database, count: 0 },
    { id: 'settings', label: 'Настройки', icon: Settings, count: 0 }
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'active':
        return { 
          bg: 'bg-green-100', 
          text: 'text-green-800', 
          border: 'border-green-300',
          label: 'Активна',
          icon: CheckCircle 
        };
      case 'training':
        return { 
          bg: 'bg-blue-100', 
          text: 'text-blue-800', 
          border: 'border-blue-300',
          label: 'Обучение',
          icon: RefreshCw 
        };
      case 'inactive':
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-800', 
          border: 'border-gray-300',
          label: 'Неактивна',
          icon: Pause 
        };
      case 'error':
        return { 
          bg: 'bg-red-100', 
          text: 'text-red-800', 
          border: 'border-red-300',
          label: 'Ошибка',
          icon: AlertTriangle 
        };
      default:
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-800', 
          border: 'border-gray-300',
          label: 'Неизвестно',
          icon: Info 
        };
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleToggleModel = (id) => {
    setModels(models.map(m => 
      m.id === id 
        ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
        : m
    ));
  };

  const handleRetrainModel = (id) => {
    setModels(models.map(m => 
      m.id === id 
        ? { ...m, status: 'training' }
        : m
    ));
    setTimeout(() => {
      setModels(models.map(m => 
        m.id === id 
          ? { ...m, status: 'active' }
          : m
      ));
    }, 3000);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Brain className="w-8 h-8 mr-3" />
                  Настройки AI и машинного обучения
                </h1>
                <p className="text-purple-100">Управление моделями прогнозирования и анализа данных</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span className="font-semibold">Загрузить модель</span>
                </button>
                <button className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors font-semibold shadow-lg">
                  <Play className="w-5 h-5" />
                  <span>Запустить все</span>
                </button>
              </div>
            </div>
          </div>
        </div>

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
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                    <div className="mt-3 text-white/90 text-sm font-semibold">
                      {stat.change}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[150px] px-6 py-4 font-semibold transition-colors border-b-4 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600 bg-purple-50'
                        : 'border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Icon className="w-5 h-5 mb-2" />
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                          activeTab === tab.id
                            ? 'bg-purple-200 text-purple-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Models Tab */}
          {activeTab === 'models' && (
            <div className="space-y-6">
              {models.map((model) => {
                const statusStyles = getStatusStyles(model.status);
                const StatusIcon = statusStyles.icon;

                return (
                  <div key={model.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{model.name}</h3>
                          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                            <StatusIcon className={`w-4 h-4 ${model.status === 'training' ? 'animate-spin' : ''}`} />
                            <span className="text-xs font-semibold">{statusStyles.label}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Code className="w-4 h-4" />
                            <span>{model.type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitBranch className="w-4 h-4" />
                            <span>v{model.version}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Обучена: {model.lastTrained}</span>
                          </div>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={model.status === 'active'}
                          onChange={() => handleToggleModel(model.id)}
                          disabled={model.status === 'training'}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                      </label>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <span className={`text-2xl font-bold ${getAccuracyColor(model.accuracy)}`}>
                            {model.accuracy}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Точность</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="text-2xl font-bold text-blue-600">
                            {model.predictionsCount.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Прогнозов</p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <Database className="w-5 h-5 text-green-600" />
                          <span className="text-2xl font-bold text-green-600">
                            {model.datasetSize}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Записей</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <Clock className="w-5 h-5 text-orange-600" />
                          <span className="text-2xl font-bold text-orange-600">
                            {model.trainingTime}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Обучение</p>
                      </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                          Метрики производительности
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(model.metrics).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 uppercase">{key}:</span>
                              <span className="font-semibold text-gray-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <Sliders className="w-5 h-5 text-purple-600 mr-2" />
                          Параметры модели
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(model.parameters).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{key}:</span>
                              <span className="font-semibold text-gray-900">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border border-purple-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <Server className="w-5 h-5 text-purple-600 mr-2" />
                        Использование ресурсов
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">CPU</span>
                            <span className="text-sm font-bold text-gray-900">{model.resources.cpu}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                              style={{ width: `${model.resources.cpu}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Memory</span>
                            <span className="text-sm font-bold text-gray-900">{model.resources.memory} GB</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                              style={{ width: `${(model.resources.memory / 8) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">GPU</span>
                            <span className="text-sm font-bold text-gray-900">{model.resources.gpu}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500"
                              style={{ width: `${model.resources.gpu}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleRetrainModel(model.id)}
                        disabled={model.status === 'training'}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>Переобучить</span>
                      </button>
                      <button
                        onClick={() => setSelectedModel(model)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                      >
                        <Eye className="w-5 h-5" />
                        <span>Подробнее</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold">
                        <Download className="w-5 h-5" />
                        <span>Экспорт</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold">
                        <Terminal className="w-5 h-5" />
                        <span>Логи</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold">
                        <Clipboard className="w-5 h-5" />
                        <span>Тест</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                  <Activity className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Обучение моделей</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-blue-900 mb-2">Процесс обучения</h3>
                      <p className="text-sm text-blue-700 mb-4">
                        Обучение моделей выполняется автоматически согласно расписанию. 
                        Вы можете запустить обучение вручную или настроить параметры для каждой модели отдельно.
                      </p>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold">
                        <Play className="w-5 h-5" />
                        <span>Запустить обучение</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Training Queue */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Очередь обучения</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                        <div>
                          <p className="font-semibold text-gray-900">Обнаружение аномалий</p>
                          <p className="text-sm text-gray-600">Epoch 45/100 • 23 минуты осталось</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mb-2">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">45%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl opacity-60">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-semibold text-gray-900">Прогнозирование уровня воды</p>
                          <p className="text-sm text-gray-600">В очереди • Начало через ~2 часа</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">Ожидание</span>
                    </div>
                  </div>
                </div>

                {/* Training History */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">История обучения</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Модель</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Дата</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Время</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Точность</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Статус</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">Прогнозирование уровня воды</td>
                          <td className="px-4 py-3 text-sm text-gray-600">2024-11-28</td>
                          <td className="px-4 py-3 text-sm text-gray-600">3ч 24м</td>
                          <td className="px-4 py-3 text-sm font-bold text-green-600">94.2%</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Успешно</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">Приоритизация обследований</td>
                          <td className="px-4 py-3 text-sm text-gray-600">2024-11-20</td>
                          <td className="px-4 py-3 text-sm text-gray-600">2ч 10м</td>
                          <td className="px-4 py-3 text-sm font-bold text-green-600">92.8%</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Успешно</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">Классификация состояния</td>
                          <td className="px-4 py-3 text-sm text-gray-600">2024-11-15</td>
                          <td className="px-4 py-3 text-sm text-gray-600">1ч 52м</td>
                          <td className="px-4 py-3 text-sm font-bold text-green-600">89.7%</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Успешно</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Datasets Tab */}
          {activeTab === 'datasets' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Database className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Датасеты для обучения</h2>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-semibold">
                    <Upload className="w-5 h-5" />
                    <span>Загрузить датасет</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dataset 1 */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Исторические данные уровня воды</h3>
                        <p className="text-sm text-gray-600">125,000 записей • 45 признаков</p>
                      </div>
                      <Award className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Размер:</span>
                        <span className="font-semibold">2.4 ГБ</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Обновлён:</span>
                        <span className="font-semibold">2024-11-28</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Используется в:</span>
                        <span className="font-semibold">2 моделях</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold">
                        Просмотр
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-semibold">
                        Скачать
                      </button>
                    </div>
                  </div>

                  {/* Dataset 2 */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Данные технического состояния</h3>
                        <p className="text-sm text-gray-600">45,000 записей • 28 признаков</p>
                      </div>
                      <Award className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Размер:</span>
                        <span className="font-semibold">850 МБ</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Обновлён:</span>
                        <span className="font-semibold">2024-11-15</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Используется в:</span>
                        <span className="font-semibold">1 модели</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold">
                        Просмотр
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-semibold">
                        Скачать
                      </button>
                    </div>
                  </div>

                  {/* Dataset 3 */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Данные аномалий и инцидентов</h3>
                        <p className="text-sm text-gray-600">78,000 записей • 35 признаков</p>
                      </div>
                      <Award className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Размер:</span>
                        <span className="font-semibold">1.6 ГБ</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Обновлён:</span>
                        <span className="font-semibold">2024-12-04</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Используется в:</span>
                        <span className="font-semibold">1 модели</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold">
                        Просмотр
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-semibold">
                        Скачать
                      </button>
                    </div>
                  </div>

                  {/* Dataset 4 */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Данные качества воды</h3>
                        <p className="text-sm text-gray-600">95,000 записей • 42 признака</p>
                      </div>
                      <Award className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Размер:</span>
                        <span className="font-semibold">1.8 ГБ</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Обновлён:</span>
                        <span className="font-semibold">2024-10-15</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Используется в:</span>
                        <span className="font-semibold">0 моделей</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold">
                        Просмотр
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-semibold">
                        Скачать
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                  <Settings className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Общие настройки AI</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Автоматическое переобучение</p>
                      <p className="text-sm text-gray-600">Регулярно обновлять модели с новыми данными</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiSettings.autoRetrain}
                        onChange={(e) => setAiSettings({...aiSettings, autoRetrain: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Использование GPU</p>
                      <p className="text-sm text-gray-600">Ускорение вычислений с помощью видеокарты</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiSettings.enableGPU}
                        onChange={(e) => setAiSettings({...aiSettings, enableGPU: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Логирование</p>
                      <p className="text-sm text-gray-600">Записывать все действия моделей в логи</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiSettings.enableLogging}
                        onChange={(e) => setAiSettings({...aiSettings, enableLogging: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Мониторинг производительности</p>
                      <p className="text-sm text-gray-600">Отслеживать метрики моделей в реальном времени</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiSettings.enableMonitoring}
                        onChange={(e) => setAiSettings({...aiSettings, enableMonitoring: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">Автомасштабирование</p>
                      <p className="text-sm text-gray-600">Автоматически выделять ресурсы при необходимости</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiSettings.autoScaling}
                        onChange={(e) => setAiSettings({...aiSettings, autoScaling: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Интервал переобучения (дни)
                    </label>
                    <input
                      type="number"
                      value={aiSettings.retrainInterval}
                      onChange={(e) => setAiSettings({...aiSettings, retrainInterval: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Мин. размер датасета
                    </label>
                    <input
                      type="number"
                      value={aiSettings.minDatasetSize}
                      onChange={(e) => setAiSettings({...aiSettings, minDatasetSize: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Макс. прогнозов в час
                    </label>
                    <input
                      type="number"
                      value={aiSettings.maxPredictionsPerHour}
                      onChange={(e) => setAiSettings({...aiSettings, maxPredictionsPerHour: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Макс. использование памяти (ГБ)
                    </label>
                    <input
                      type="number"
                      value={aiSettings.maxMemoryUsage}
                      onChange={(e) => setAiSettings({...aiSettings, maxMemoryUsage: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Уровень логирования
                    </label>
                    <select
                      value={aiSettings.logLevel}
                      onChange={(e) => setAiSettings({...aiSettings, logLevel: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="debug">Debug</option>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Порог алертов точности (%)
                    </label>
                    <input
                      type="number"
                      value={aiSettings.alertThreshold}
                      onChange={(e) => setAiSettings({...aiSettings, alertThreshold: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-semibold">
                    <Save className="w-5 h-5" />
                    <span>Сохранить настройки</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AISettings;
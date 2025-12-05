import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, Filter, Plus, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('list'); // list | create
  const [reportType, setReportType] = useState('incident');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock данные - существующие отчёты
  const existingReports = [
    {
      id: 1,
      title: 'Еженедельный отчёт по паводковой ситуации',
      type: 'weekly',
      period: '27.11.2024 - 03.12.2024',
      created: '2024-12-04 10:30',
      author: 'Иванов И.И.',
      status: 'completed',
      statusText: 'Завершён',
      incidents: 12,
      criticalZones: 3,
      evacuations: 2,
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      title: 'Отчёт об инциденте: Критическое превышение уровня р. Иртыш',
      type: 'incident',
      period: '05.12.2024',
      created: '2024-12-05 14:00',
      author: 'Петрова М.С.',
      status: 'completed',
      statusText: 'Завершён',
      incidents: 1,
      criticalZones: 1,
      evacuations: 1,
      fileSize: '1.8 MB'
    },
    {
      id: 3,
      title: 'Месячный отчёт - Ноябрь 2024',
      type: 'monthly',
      period: '01.11.2024 - 30.11.2024',
      created: '2024-12-01 09:00',
      author: 'Сидоров П.К.',
      status: 'completed',
      statusText: 'Завершён',
      incidents: 45,
      criticalZones: 8,
      evacuations: 5,
      fileSize: '5.2 MB'
    },
    {
      id: 4,
      title: 'Отчёт по эвакуации - с. Затобольск',
      type: 'evacuation',
      period: '05.12.2024',
      created: '2024-12-05 16:00',
      author: 'Иванов И.И.',
      status: 'draft',
      statusText: 'Черновик',
      incidents: 0,
      criticalZones: 1,
      evacuations: 1,
      fileSize: '0.8 MB'
    }
  ];

  // Mock данные - шаблоны отчётов
  const reportTemplates = [
    {
      id: 'incident',
      name: 'Отчёт об инциденте',
      description: 'Детальный отчёт о конкретном происшествии',
      icon: '⚠️',
      fields: ['Дата и время', 'Локация', 'Тип инцидента', 'Описание', 'Действия', 'Результат']
    },
    {
      id: 'weekly',
      name: 'Еженедельный отчёт',
      description: 'Сводка за неделю по всем объектам',
      icon: '📅',
      fields: ['Период', 'Общая статистика', 'Инциденты', 'Критические зоны', 'Рекомендации']
    },
    {
      id: 'monthly',
      name: 'Месячный отчёт',
      description: 'Комплексный анализ за месяц',
      icon: '📊',
      fields: ['Период', 'Статистика', 'Анализ трендов', 'Прогноз', 'Выводы']
    },
    {
      id: 'evacuation',
      name: 'Отчёт по эвакуации',
      description: 'Детали проведённой эвакуации',
      icon: '🚨',
      fields: ['Локация', 'Причина', 'Кол-во людей', 'Пункты размещения', 'Ресурсы', 'Итоги']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'incident': return '⚠️';
      case 'weekly': return '📅';
      case 'monthly': return '📊';
      case 'evacuation': return '🚨';
      default: return '📄';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'incident': return 'from-red-500 to-orange-500';
      case 'weekly': return 'from-blue-500 to-cyan-500';
      case 'monthly': return 'from-purple-500 to-pink-500';
      case 'evacuation': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">📋 Отчёты и документация</h1>
              <p className="text-indigo-100">Создание и управление отчётами по ситуации</p>
            </div>
            <button 
              onClick={() => setActiveTab('create')}
              className="flex items-center justify-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Создать отчёт</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-2 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'list'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Список отчётов ({existingReports.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-2 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'create'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Новый отчёт
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        
        {/* List Tab */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Filter className="w-4 h-4 inline mr-2" />
                    Тип отчёта
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="all">Все типы</option>
                    <option value="incident">Инциденты</option>
                    <option value="weekly">Еженедельные</option>
                    <option value="monthly">Месячные</option>
                    <option value="evacuation">Эвакуация</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Период
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="week">Последняя неделя</option>
                    <option value="month">Последний месяц</option>
                    <option value="quarter">Последний квартал</option>
                    <option value="year">Последний год</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Статус
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="all">Все статусы</option>
                    <option value="completed">Завершённые</option>
                    <option value="draft">Черновики</option>
                    <option value="processing">В обработке</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {existingReports.map((report) => (
                <div 
                  key={report.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(report.type)} rounded-xl flex items-center justify-center text-2xl`}>
                        {getTypeIcon(report.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{report.period}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Создан: {report.created}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{report.author}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(report.status)}`}>
                      {report.statusText}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">Инциденты</p>
                      <p className="text-2xl font-bold text-red-600">{report.incidents}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">Критические зоны</p>
                      <p className="text-2xl font-bold text-orange-600">{report.criticalZones}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">Эвакуации</p>
                      <p className="text-2xl font-bold text-blue-600">{report.evacuations}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Размер файла: {report.fileSize}</span>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Просмотр</span>
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Скачать</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            
            {/* Template Selection */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Выберите тип отчёта</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setReportType(template.id)}
                    className={`text-left p-6 rounded-2xl border-2 transition-all ${
                      reportType === template.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-4xl mb-3">{template.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.slice(0, 3).map((field, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {field}
                        </span>
                      ))}
                      {template.fields.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          +{template.fields.length - 3}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Параметры отчёта</h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название отчёта *
                  </label>
                  <input
                    type="text"
                    placeholder="Введите название отчёта..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Период (от) *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Период (до) *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Регион
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="">Все регионы</option>
                    <option value="pavlodar">Павлодарская область</option>
                    <option value="almaty">Алматинская область</option>
                    <option value="vko">Восточно-Казахстанская область</option>
                    <option value="zko">Западно-Казахстанская область</option>
                  </select>
                </div>

                {/* Include sections */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Включить разделы
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                      <span className="text-gray-900">Общая статистика</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                      <span className="text-gray-900">Детали инцидентов</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                      <span className="text-gray-900">Критические зоны</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                      <span className="text-gray-900">Графики и диаграммы</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                      <span className="text-gray-900">Рекомендации</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дополнительные комментарии
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Добавьте комментарии или специальные указания..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => setActiveTab('list')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    Отмена
                  </button>
                  <div className="flex space-x-3">
                    <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all">
                      Сохранить черновик
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Создать отчёт
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
import React, { useState } from 'react';
import { Search, Filter, Download, TrendingUp, AlertTriangle, Calendar, Info } from 'lucide-react';

const PrioritizationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('priority_desc');

  // Функция расчёта приоритета (из ТЗ хакатона)
  // PriorityScore = (6 - состояние) * 3 + возраст паспорта в годах
  const calculatePriority = (condition, passportYear) => {
    const currentYear = new Date().getFullYear();
    const passportAge = currentYear - passportYear;
    const score = (6 - condition) * 3 + passportAge;
    
    let level;
    if (score >= 12) level = 'high';
    else if (score >= 6) level = 'medium';
    else level = 'low';
    
    return { score, level, passportAge };
  };

  // Mock данные - объекты для обследования
  const objects = [
    {
      id: 1,
      name: 'Каратомарская плотина',
      type: 'Плотина',
      region: 'Алматинская область',
      technicalCondition: 5, // Категория 1-5
      passportDate: '2010-06-15',
      passportYear: 2010,
      waterBody: 'Река Каратомар',
      lastInspection: '2024-12-01',
      issues: 8,
      riskLevel: 'high'
    },
    {
      id: 2,
      name: 'Усть-Каменогорская ГЭС',
      type: 'ГЭС',
      region: 'Восточно-Казахстанская область',
      technicalCondition: 4,
      passportDate: '2015-03-20',
      passportYear: 2015,
      waterBody: 'Река Иртыш',
      lastInspection: '2024-08-05',
      issues: 5,
      riskLevel: 'high'
    },
    {
      id: 3,
      name: 'Река Иртыш (участок Павлодар)',
      type: 'Река',
      region: 'Павлодарская область',
      technicalCondition: 4,
      passportDate: '2016-09-10',
      passportYear: 2016,
      waterBody: 'Река Иртыш',
      lastInspection: '2024-11-20',
      issues: 4,
      riskLevel: 'high'
    },
    {
      id: 4,
      name: 'Бухтарминская ГЭС',
      type: 'ГЭС',
      region: 'Восточно-Казахстанская область',
      technicalCondition: 3,
      passportDate: '2012-05-15',
      passportYear: 2012,
      waterBody: 'Река Иртыш',
      lastInspection: '2024-10-15',
      issues: 2,
      riskLevel: 'medium'
    },
    {
      id: 5,
      name: 'Шульбинская ГЭС',
      type: 'ГЭС',
      region: 'Восточно-Казахстанская область',
      technicalCondition: 3,
      passportDate: '2013-07-20',
      passportYear: 2013,
      waterBody: 'Река Иртыш',
      lastInspection: '2024-09-10',
      issues: 3,
      riskLevel: 'medium'
    },
    {
      id: 6,
      name: 'Озеро Балхаш',
      type: 'Озеро',
      region: 'Алматинская область',
      technicalCondition: 3,
      passportDate: '2018-04-10',
      passportYear: 2018,
      waterBody: 'Озеро Балхаш',
      lastInspection: '2024-11-01',
      issues: 1,
      riskLevel: 'medium'
    },
    {
      id: 7,
      name: 'Капшагайская ГЭС',
      type: 'ГЭС',
      region: 'Алматинская область',
      technicalCondition: 2,
      passportDate: '2019-08-25',
      passportYear: 2019,
      waterBody: 'Река Или',
      lastInspection: '2024-11-20',
      issues: 0,
      riskLevel: 'low'
    },
    {
      id: 8,
      name: 'Сергеевское водохранилище',
      type: 'Водохранилище',
      region: 'Северо-Казахстанская область',
      technicalCondition: 2,
      passportDate: '2020-03-15',
      passportYear: 2020,
      waterBody: 'Река Ишим',
      lastInspection: '2024-11-01',
      issues: 1,
      riskLevel: 'low'
    },
    {
      id: 9,
      name: 'Река Урал (участок Уральск)',
      type: 'Река',
      region: 'Западно-Казахстанская область',
      technicalCondition: 3,
      passportDate: '2017-11-30',
      passportYear: 2017,
      waterBody: 'Река Урал',
      lastInspection: '2024-10-20',
      issues: 2,
      riskLevel: 'medium'
    },
    {
      id: 10,
      name: 'Озеро Зайсан',
      type: 'Озеро',
      region: 'Восточно-Казахстанская область',
      technicalCondition: 2,
      passportDate: '2021-06-05',
      passportYear: 2021,
      waterBody: 'Озеро Зайсан',
      lastInspection: '2024-11-15',
      issues: 0,
      riskLevel: 'low'
    }
  ];

  // Добавляем расчёт приоритета к каждому объекту
  const objectsWithPriority = objects.map(obj => ({
    ...obj,
    priority: calculatePriority(obj.technicalCondition, obj.passportYear)
  }));

  // Фильтрация
  const filteredObjects = objectsWithPriority
    .filter(obj => {
      const matchesSearch = obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          obj.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || obj.region === selectedRegion;
      const matchesPriority = selectedPriority === 'all' || obj.priority.level === selectedPriority;
      return matchesSearch && matchesRegion && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority_desc': return b.priority.score - a.priority.score;
        case 'priority_asc': return a.priority.score - b.priority.score;
        case 'condition_desc': return b.technicalCondition - a.technicalCondition;
        case 'condition_asc': return a.technicalCondition - b.technicalCondition;
        case 'passport_old': return a.passportYear - b.passportYear;
        case 'passport_new': return b.passportYear - a.passportYear;
        default: return b.priority.score - a.priority.score;
      }
    });

  const regions = [
    'Все регионы',
    'Алматинская область',
    'Восточно-Казахстанская область',
    'Павлодарская область',
    'Западно-Казахстанская область',
    'Северо-Казахстанская область'
  ];

  const getPriorityColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityBadge = (level) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (level) => {
    switch (level) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Не определён';
    }
  };

  const getConditionColor = (condition) => {
    if (condition >= 4) return 'text-red-600';
    if (condition === 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const stats = {
    total: filteredObjects.length,
    high: filteredObjects.filter(o => o.priority.level === 'high').length,
    medium: filteredObjects.filter(o => o.priority.level === 'medium').length,
    low: filteredObjects.filter(o => o.priority.level === 'low').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">📊 Приоритизация обследований</h1>
              <p className="text-orange-100">Система определения приоритетности инспекций объектов</p>
            </div>
            <button className="flex items-center justify-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-lg">
              <Download className="w-5 h-5" />
              <span>Экспорт таблицы</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Формула расчёта приоритета:</p>
              <p className="mb-2">
                <code className="bg-blue-100 px-2 py-1 rounded">PriorityScore = (6 - Состояние) × 3 + Возраст паспорта</code>
              </p>
              <p className="text-xs text-blue-700">
                <strong>Классификация:</strong> ≥12 — Высокий | 6-11 — Средний | &lt;6 — Низкий
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего объектов</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Высокий приоритет</p>
                <p className="text-2xl font-bold text-red-600">{stats.high}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Средний приоритет</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Низкий приоритет</p>
                <p className="text-2xl font-bold text-green-600">{stats.low}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Поиск
              </label>
              <input
                type="text"
                placeholder="Название объекта..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Регион
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {regions.map(region => (
                  <option key={region} value={region === 'Все регионы' ? 'all' : region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Приоритет
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Все уровни</option>
                <option value="high">Высокий</option>
                <option value="medium">Средний</option>
                <option value="low">Низкий</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Сортировка
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="priority_desc">Приоритет (высокий→низкий)</option>
                <option value="priority_asc">Приоритет (низкий→высокий)</option>
                <option value="condition_desc">Состояние (хуже→лучше)</option>
                <option value="condition_asc">Состояние (лучше→хуже)</option>
                <option value="passport_old">Паспорт (старые→новые)</option>
                <option value="passport_new">Паспорт (новые→старые)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Priority Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">#</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Объект</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Состояние</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Дата паспорта</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Возраст</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Score</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Приоритет</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredObjects.map((obj, idx) => (
                  <tr 
                    key={obj.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      obj.priority.level === 'high' ? 'bg-red-50/30' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white ${
                        idx < 3 ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gray-400'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>

                    {/* Object Info */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">{obj.name}</p>
                        <p className="text-xs text-gray-600">{obj.region}</p>
                        <p className="text-xs text-gray-500">{obj.type} • {obj.waterBody}</p>
                      </div>
                    </td>

                    {/* Technical Condition */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-2xl ${getConditionColor(obj.technicalCondition)}`}>
                        {obj.technicalCondition}
                      </span>
                    </td>

                    {/* Passport Date */}
                    <td className="py-4 px-4 text-center">
                      <p className="text-sm font-medium text-gray-900">{obj.passportDate}</p>
                    </td>

                    {/* Passport Age */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 rounded-lg">
                        <p className="text-lg font-bold text-gray-900">{obj.priority.passportAge}</p>
                        <p className="text-xs text-gray-600 ml-1">лет</p>
                      </span>
                    </td>

                    {/* Priority Score */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{obj.priority.score}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        (6-{obj.technicalCondition})×3+{obj.priority.passportAge}
                      </p>
                    </td>

                    {/* Priority Level */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getPriorityColor(obj.priority.level)}`}>
                        <span className={`w-2 h-2 rounded-full ${getPriorityBadge(obj.priority.level)} mr-2`} />
                        {getPriorityText(obj.priority.level)}
                      </span>
                      {obj.priority.level === 'high' && (
                        <p className="text-xs text-red-600 font-semibold mt-2">⚠️ Требует обследования</p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                        Подробнее
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredObjects.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Объекты не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить параметры фильтров</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrioritizationPage;
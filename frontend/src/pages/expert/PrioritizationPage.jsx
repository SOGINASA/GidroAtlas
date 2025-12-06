import React, { useState } from 'react';
import ExpertLayout from '../../components/navigation/expert/ExpertLayout';
import { ListOrdered, Filter, ArrowUpDown, Download } from 'lucide-react';

const ExpertPrioritizationPage = () => {
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('priority_desc');

  // Mock combined data (water bodies + facilities)
  const allObjects = [
    {
      id: 'wb1',
      name: 'Бухтарминское водохранилище',
      type: 'waterbody',
      region: 'ВКО',
      technicalCondition: 5,
      passportDate: '2015-03-15',
      passportAge: 9,
      priority: { score: 18, level: 'high' }
    },
    {
      id: 'f1',
      name: 'Капшагайская ГЭС',
      type: 'facility',
      region: 'Алматинская область',
      technicalCondition: 4,
      passportDate: '2017-06-20',
      passportAge: 7,
      priority: { score: 15, level: 'high' }
    },
    {
      id: 'f2',
      name: 'Шульбинская ГЭС',
      type: 'facility',
      region: 'ВКО',
      technicalCondition: 3,
      passportDate: '2018-09-10',
      passportAge: 6,
      priority: { score: 12, level: 'high' }
    },
    {
      id: 'wb2',
      name: 'Река Иртыш',
      type: 'waterbody',
      region: 'ВКО',
      technicalCondition: 3,
      passportDate: '2019-01-22',
      passportAge: 5,
      priority: { score: 10, level: 'medium' }
    },
    {
      id: 'wb3',
      name: 'Озеро Балхаш',
      type: 'waterbody',
      region: 'Алматинская область',
      technicalCondition: 2,
      passportDate: '2020-05-15',
      passportAge: 4,
      priority: { score: 8, level: 'medium' }
    },
    {
      id: 'f3',
      name: 'Плотина Сорг',
      type: 'facility',
      region: 'Алматинская область',
      technicalCondition: 2,
      passportDate: '2021-11-08',
      passportAge: 3,
      priority: { score: 6, level: 'medium' }
    },
    {
      id: 'wb4',
      name: 'Капшагайское водохранилище',
      type: 'waterbody',
      region: 'Алматинская область',
      technicalCondition: 2,
      passportDate: '2021-03-20',
      passportAge: 3,
      priority: { score: 5, level: 'low' }
    },
    {
      id: 'wb5',
      name: 'Озеро Зайсан',
      type: 'waterbody',
      region: 'ВКО',
      technicalCondition: 1,
      passportDate: '2022-08-12',
      passportAge: 2,
      priority: { score: 3, level: 'low' }
    }
  ];

  const filterAndSort = () => {
    let filtered = allObjects;

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(obj => obj.priority.level === filterPriority);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priority_desc':
          return b.priority.score - a.priority.score;
        case 'priority_asc':
          return a.priority.score - b.priority.score;
        case 'name_asc':
          return a.name.localeCompare(b.name, 'ru');
        case 'name_desc':
          return b.name.localeCompare(a.name, 'ru');
        case 'condition_desc':
          return b.technicalCondition - a.technicalCondition;
        case 'condition_asc':
          return a.technicalCondition - b.technicalCondition;
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredObjects = filterAndSort();

  const getPriorityColor = (level) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-orange-100 text-orange-700 border-orange-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[level] || colors.medium;
  };

  const getConditionColor = (condition) => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-lime-500',
      3: 'bg-yellow-500',
      4: 'bg-orange-500',
      5: 'bg-red-500'
    };
    return colors[condition] || colors[3];
  };

  const exportToCSV = () => {
    // Mock export
    alert('Экспорт в CSV (функция будет реализована)');
  };

  return (
    <ExpertLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <ListOrdered className="w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold">Приоритизация обследований</h1>
            </div>
            <p className="text-sm lg:text-base text-blue-100">
              Расчёт и управление приоритетами инспекций
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          
          {/* Formula Info */}
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Формула расчёта приоритета</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="font-mono text-lg text-center text-blue-900">
                PriorityScore = (6 - Состояние) × 3 + Возраст_паспорта
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="font-semibold text-red-700 mb-1">Высокий приоритет</p>
                <p className="text-gray-600">Оценка ≥ 12</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="font-semibold text-orange-700 mb-1">Средний приоритет</p>
                <p className="text-gray-600">Оценка 6-11</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-700 mb-1">Низкий приоритет</p>
                <p className="text-gray-600">Оценка &lt; 6</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Всего объектов</p>
              <p className="text-2xl font-bold text-gray-900">{allObjects.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Высокий</p>
              <p className="text-2xl font-bold text-red-600">
                {allObjects.filter(o => o.priority.level === 'high').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Средний</p>
              <p className="text-2xl font-bold text-orange-600">
                {allObjects.filter(o => o.priority.level === 'medium').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Низкий</p>
              <p className="text-2xl font-bold text-green-600">
                {allObjects.filter(o => o.priority.level === 'low').length}
              </p>
            </div>
          </div>

          {/* Filters & Sort */}
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Filter className="w-4 h-4 inline mr-2" />
                    Приоритет
                  </label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Все приоритеты</option>
                    <option value="high">Высокий</option>
                    <option value="medium">Средний</option>
                    <option value="low">Низкий</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ArrowUpDown className="w-4 h-4 inline mr-2" />
                    Сортировка
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="priority_desc">Приоритет (высокий→низкий)</option>
                    <option value="priority_asc">Приоритет (низкий→высокий)</option>
                    <option value="name_asc">Название (А→Я)</option>
                    <option value="name_desc">Название (Я→А)</option>
                    <option value="condition_desc">Состояние (5→1)</option>
                    <option value="condition_asc">Состояние (1→5)</option>
                  </select>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Экспорт CSV</span>
              </button>
            </div>
          </div>

          {/* Priority Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Объект
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Регион
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Состояние
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Возраст паспорта
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Оценка
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Приоритет
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredObjects.map((obj, index) => (
                    <tr key={obj.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{obj.name}</p>
                          <p className="text-sm text-gray-500">
                            {obj.type === 'waterbody' ? '💧 Водоём' : '⚡ ГТС'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {obj.region}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div className={`w-8 h-8 rounded-full ${getConditionColor(obj.technicalCondition)} flex items-center justify-center text-white font-bold text-sm`}>
                            {obj.technicalCondition}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="font-semibold text-gray-900">{obj.passportAge} лет</p>
                        <p className="text-xs text-gray-500">{new Date(obj.passportDate).toLocaleDateString('ru-RU')}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{obj.priority.score}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPriorityColor(obj.priority.level)}`}>
                            {obj.priority.level === 'high' ? 'Высокий' : obj.priority.level === 'medium' ? 'Средний' : 'Низкий'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredObjects.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <ListOrdered className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Нет объектов
              </h3>
              <p className="text-gray-600">
                Измените фильтры для просмотра данных
              </p>
            </div>
          )}
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertPrioritizationPage;
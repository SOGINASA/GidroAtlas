import React, { useState } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { FileText, Download, Eye, Plus } from 'lucide-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('list');

  const reports = [
    {
      id: 1,
      title: 'Еженедельный отчёт МЧС',
      period: '27 нояб. - 3 дек. 2024',
      type: 'weekly',
      author: 'Иванов И.И.',
      createdAt: '2024-12-03',
      status: 'completed',
      stats: { incidents: 45, critical: 8, evacuations: 3 },
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      title: 'Отчёт по инциденту: Иртыш',
      period: '1 дек. 2024',
      type: 'incident',
      author: 'Петров П.П.',
      createdAt: '2024-12-01',
      status: 'completed',
      stats: { incidents: 1, critical: 1, evacuations: 1 },
      fileSize: '1.8 MB'
    },
    {
      id: 3,
      title: 'Месячный отчёт - Ноябрь 2024',
      period: '1-30 ноября 2024',
      type: 'monthly',
      author: 'Сидоров С.С.',
      createdAt: '2024-11-30',
      status: 'completed',
      stats: { incidents: 182, critical: 34, evacuations: 15 },
      fileSize: '5.2 MB'
    },
    {
      id: 4,
      title: 'Отчёт по эвакуации: Затобольск',
      period: '25 нояб. 2024',
      type: 'evacuation',
      author: 'Козлов К.К.',
      createdAt: '2024-11-25',
      status: 'draft',
      stats: { incidents: 1, critical: 0, evacuations: 1 },
      fileSize: '0.8 MB'
    }
  ];

  const templates = [
    {
      id: 1,
      name: 'Отчёт по инциденту',
      description: 'Детальный отчёт о произошедшем инциденте',
      fields: ['Дата', 'Локация', 'Описание', 'Действия', 'Результат']
    },
    {
      id: 2,
      name: 'Еженедельный отчёт',
      description: 'Сводка за неделю',
      fields: ['Период', 'Статистика', 'Критические случаи', 'Рекомендации']
    },
    {
      id: 3,
      name: 'Месячный отчёт',
      description: 'Полный отчёт за месяц',
      fields: ['Период', 'Общая статистика', 'Анализ', 'Планы']
    },
    {
      id: 4,
      name: 'Отчёт по эвакуации',
      description: 'Детали проведённой эвакуации',
      fields: ['Дата', 'Локация', 'Эвакуировано', 'Ресурсы', 'Итоги']
    }
  ];

  return (
    <EmergencyLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-2">📋 Отчёты</h1>
            <p className="text-indigo-100">Управление документацией и отчётностью</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-lg border mb-6">
            <div className="border-b flex">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'list' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'
                }`}
              >
                Список отчётов ({reports.length})
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'new' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'
                }`}
              >
                Новый отчёт
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'list' && (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border-2 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{report.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{report.period}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Автор: {report.author}</span>
                              <span>•</span>
                              <span>{report.createdAt}</span>
                              <span>•</span>
                              <span>{report.fileSize}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status === 'completed' ? 'Готов' : 'Черновик'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-sm text-gray-600">Инциденты</p>
                          <p className="text-xl font-bold text-gray-900">{report.stats.incidents}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 text-center">
                          <p className="text-sm text-gray-600">Критические</p>
                          <p className="text-xl font-bold text-red-600">{report.stats.critical}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <p className="text-sm text-gray-600">Эвакуации</p>
                          <p className="text-xl font-bold text-blue-600">{report.stats.evacuations}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                          <Eye className="w-5 h-5" />
                          <span>Просмотр</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                          <Download className="w-5 h-5" />
                          <span>Скачать</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'new' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Выберите шаблон отчёта</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {templates.map((template) => (
                      <div key={template.id} className="border-2 rounded-xl p-6 hover:border-indigo-400 transition-colors cursor-pointer">
                        <h4 className="font-bold text-lg mb-2">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {template.fields.map((field, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">{field}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Или создайте свой отчёт</h3>
                    <div className="space-y-4">
                      <input type="text" placeholder="Название отчёта" className="w-full px-4 py-3 border rounded-lg" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="date" className="px-4 py-3 border rounded-lg" />
                        <input type="date" className="px-4 py-3 border rounded-lg" />
                      </div>
                      <textarea placeholder="Описание..." rows="4" className="w-full px-4 py-3 border rounded-lg" />
                      <div className="flex space-x-3">
                        <button className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                          Сохранить черновик
                        </button>
                        <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                          <Plus className="w-5 h-5" />
                          <span>Создать отчёт</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmergencyLayout>
  );
};

export default ReportsPage;
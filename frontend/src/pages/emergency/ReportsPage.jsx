import React, { useState, useEffect } from 'react';
import EmergencyLayout from '../../components/navigation/emergency/EmergencyLayout';
import { FileText, Download, Eye, Plus } from 'lucide-react';
import { getAllReports, getReportTemplates, createReport } from '../../services/reportService';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [reports, setReports] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Форма создания отчёта
  const [newReport, setNewReport] = useState({
    title: '',
    period_start: '',
    period_end: '',
    content: '',
    type: 'weekly',
    status: 'draft'
  });

  // Загрузка отчётов
  useEffect(() => {
    loadReports();
  }, []);

  // Загрузка шаблонов при переходе на вкладку создания
  useEffect(() => {
    if (activeTab === 'new' && templates.length === 0) {
      loadTemplates();
    }
  }, [activeTab]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getAllReports();
      setReports(data);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка загрузки отчётов:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data } = await getReportTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Ошибка загрузки шаблонов:', err);
    }
  };

  const handleCreateReport = async (e, isDraft = false) => {
    e.preventDefault();

    if (!newReport.title || !newReport.period_start || !newReport.period_end) {
      alert('Заполните все обязательные поля');
      return;
    }

    try {
      const periodStart = new Date(newReport.period_start);
      const periodEnd = new Date(newReport.period_end);

      const reportData = {
        title: newReport.title,
        period: `${periodStart.toLocaleDateString('ru-RU')} - ${periodEnd.toLocaleDateString('ru-RU')}`,
        period_start: newReport.period_start,
        period_end: newReport.period_end,
        type: newReport.type,
        status: isDraft ? 'draft' : 'completed',
        content: newReport.content,
        stats: { incidents: 0, critical: 0, evacuations: 0 },
        file_size: '0 MB'
      };

      await createReport(reportData);

      // Сбрасываем форму
      setNewReport({
        title: '',
        period_start: '',
        period_end: '',
        content: '',
        type: 'weekly',
        status: 'draft'
      });

      // Переключаемся на список и обновляем
      setActiveTab('list');
      loadReports();

      alert(isDraft ? 'Черновик сохранён' : 'Отчёт создан');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTemplateClick = (template) => {
    setNewReport(prev => ({
      ...prev,
      type: template.type,
      title: template.name
    }));
  };

  const handleViewReport = (report) => {
    // Открываем модальное окно с подробной информацией об отчёте
    alert(`Отчёт: ${report.title}\n\nПериод: ${report.period}\nАвтор: ${report.author}\nТип: ${report.type}\nСтатус: ${report.status === 'completed' ? 'Готов' : 'Черновик'}\n\nСтатистика:\n- Инциденты: ${report.stats.incidents}\n- Критические: ${report.stats.critical}\n- Эвакуации: ${report.stats.evacuations}\n\nСодержание:\n${report.content || 'Содержание отсутствует'}`);
  };

  const handleDownloadReport = (report) => {
    // Создаём текстовое содержимое отчёта
    const reportContent = `
ОТЧЁТ МЧС
=========================================

Название: ${report.title}
Период: ${report.period}
Автор: ${report.author}
Тип: ${report.type}
Статус: ${report.status === 'completed' ? 'Готов' : 'Черновик'}
Дата создания: ${new Date(report.createdAt).toLocaleString('ru-RU')}

СТАТИСТИКА
=========================================
Инциденты: ${report.stats.incidents}
Критические случаи: ${report.stats.critical}
Эвакуации: ${report.stats.evacuations}

СОДЕРЖАНИЕ
=========================================
${report.content || 'Содержание отсутствует'}

=========================================
Размер файла: ${report.fileSize || 'N/A'}
`;

    // Создаём Blob и скачиваем файл
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${report.id}_${report.type}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

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
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

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
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <p className="mt-2 text-gray-600">Загрузка отчётов...</p>
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Отчёты не найдены</p>
                    </div>
                  ) : (
                    reports.map((report) => (
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
                    ))
                  )}
                </div>
              )}

              {activeTab === 'new' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Выберите шаблон отчёта</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateClick(template)}
                        className="border-2 rounded-xl p-6 hover:border-indigo-400 transition-colors cursor-pointer"
                      >
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
                    <form className="space-y-4">
                      <input
                        type="text"
                        placeholder="Название отчёта"
                        className="w-full px-4 py-3 border rounded-lg"
                        value={newReport.title}
                        onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          className="px-4 py-3 border rounded-lg"
                          value={newReport.period_start}
                          onChange={(e) => setNewReport({ ...newReport, period_start: e.target.value })}
                          placeholder="Дата начала"
                        />
                        <input
                          type="date"
                          className="px-4 py-3 border rounded-lg"
                          value={newReport.period_end}
                          onChange={(e) => setNewReport({ ...newReport, period_end: e.target.value })}
                          placeholder="Дата окончания"
                        />
                      </div>
                      <select
                        className="w-full px-4 py-3 border rounded-lg"
                        value={newReport.type}
                        onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                      >
                        <option value="weekly">Еженедельный</option>
                        <option value="monthly">Месячный</option>
                        <option value="incident">По инциденту</option>
                        <option value="evacuation">По эвакуации</option>
                      </select>
                      <textarea
                        placeholder="Описание..."
                        rows="4"
                        className="w-full px-4 py-3 border rounded-lg"
                        value={newReport.content}
                        onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                      />
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={(e) => handleCreateReport(e, true)}
                          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          Сохранить черновик
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleCreateReport(e, false)}
                          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          <Plus className="w-5 h-5" />
                          <span>Создать отчёт</span>
                        </button>
                      </div>
                    </form>
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
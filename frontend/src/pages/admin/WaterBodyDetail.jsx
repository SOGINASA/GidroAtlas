import React from 'react';
import {
  ArrowLeft,
  Droplets,
  MapPin,
  AlertTriangle,
  Shield,
  Activity,
  Calendar,
  FileText,
  Compass,
  Info,
  CheckCircle2
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

const mockWaterBody = {
  id: 1,
  name: 'Озеро Балхаш',
  region: 'Карагандинская область',
  type: 'Озеро',
  waterType: 'Смешанная (пресная / солоноватая)',
  category: 3,
  status: 'Среднее состояние',
  lat: 46.800000,
  lng: 74.900000,
  areaKm2: 16400,
  maxDepth: 26,
  avgDepth: 6,
  hasFauna: true,
  mainSpecies: ['Судак', 'Сазан', 'Лещ', 'Сом'],
  passportYear: 2022,
  priorityLevel: 'Высокий',
  priorityReason: 'Крупный водный объект стратегического значения, риск деградации экосистемы.',
  responsibleAgency: 'Министерство экологии и природных ресурсов РК',
  lastInspectionDate: '2025-03-12',
  nextInspectionDate: '2026-03-15'
};

const inspections = [
  {
    id: 1,
    date: '2025-03-12',
    type: 'Плановый осмотр',
    result: 'Выявлено повышение минерализации в восточной части, рекомендовано усилить мониторинг.',
    severity: 'warning'
  },
  {
    id: 2,
    date: '2024-09-05',
    type: 'Целевая проверка',
    result: 'Нарушений по гидротехническим сооружениям не выявлено.',
    severity: 'ok'
  },
  {
    id: 3,
    date: '2023-11-20',
    type: 'Плановый осмотр',
    result: 'Зафиксировано снижение уровня воды на 12 см ниже среднемноголетнего.',
    severity: 'warning'
  }
];

const actions = [
  {
    id: 1,
    title: 'Усиление мониторинга уровня и минерализации',
    status: 'В процессе',
    owner: 'Комитет водных ресурсов',
    deadline: '2025-12-01'
  },
  {
    id: 2,
    title: 'Обновление паспорта водного объекта',
    status: 'Запланировано',
    owner: 'Управление природных ресурсов Карагандинской области',
    deadline: '2026-02-15'
  }
];

const documents = [
  {
    id: 1,
    name: 'Паспорт водного объекта (ред. 2022 г.)',
    type: 'passport',
    size: '1.8 MB'
  },
  {
    id: 2,
    name: 'Отчёт гидрохимического анализа (март 2025)',
    type: 'report',
    size: '950 KB'
  },
  {
    id: 3,
    name: 'Схема зон наблюдения и постов',
    type: 'scheme',
    size: '620 KB'
  }
];

const statusColorByCategory = (category) => {
  switch (category) {
    case 1:
      return 'bg-green-500';
    case 2:
      return 'bg-lime-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-orange-500';
    case 5:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const badgeColorBySeverity = (severity) => {
  if (severity === 'ok') return 'bg-emerald-100 text-emerald-700';
  if (severity === 'warning') return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-700';
};

const statusTextByCategory = (category) => {
  switch (category) {
    case 1:
      return 'Отличное состояние';
    case 2:
      return 'Хорошее состояние';
    case 3:
      return 'Среднее состояние';
    case 4:
      return 'Плохое состояние';
    case 5:
      return 'Критическое состояние';
    default:
      return 'Неизвестно';
  }
};

const WaterBodyDetail = () => {
  const w = mockWaterBody;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* HEADER */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Назад к карте
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-6 h-6 text-blue-500" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    {w.name}
                  </h1>
                </div>
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                  <span className="inline-flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {w.region}
                  </span>
                  <span>•</span>
                  <span>{w.type}</span>
                  <span>•</span>
                  <span>{w.waterType}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${statusColorByCategory(
                    w.category
                  )}`}
                >
                  {w.category}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Категория</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {statusTextByCategory(w.category)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Верхний блок: основные карточки */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Основная информация */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 col-span-1 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                    <Info className="w-4 h-4 text-blue-500 mr-2" />
                    Основная информация
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Приоритет: {w.priorityLevel}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Тип объекта" value={`${w.type}, поверхностный водоём`} />
                    <InfoRow label="Тип воды" value={w.waterType} />
                    <InfoRow
                      label="Наличие фауны"
                      value={w.hasFauna ? 'Есть рыбные ресурсы' : 'Биоресурсы ограничены'}
                    />
                    <InfoRow
                      label="Ключевые виды"
                      value={w.mainSpecies.join(', ')}
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Площадь зеркала" value={`${w.areaKm2.toLocaleString('ru-RU')} км²`} />
                    <InfoRow label="Максимальная глубина" value={`${w.maxDepth} м`} />
                    <InfoRow label="Средняя глубина" value={`${w.avgDepth} м`} />
                    <InfoRow label="Год паспорта" value={`${w.passportYear} г.`} />
                  </div>
                </div>

                <div className="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start space-x-3 text-xs text-purple-900">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                  <p>{w.priorityReason}</p>
                </div>
              </div>

              {/* Мини-карта / координаты */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                  <Compass className="w-4 h-4 text-emerald-500 mr-2" />
                  Положение на карте
                </h2>
                <div className="relative flex-1 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 overflow-hidden mb-4">
                  <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_center,_#38bdf8_0,_transparent_55%)]" />
                  <div className="relative h-40 flex flex-col items-center justify-center text-center px-4">
                    <p className="text-xs font-semibold text-sky-900 mb-1">
                      Здесь будет встроенная мини-карта
                    </p>
                    <p className="text-xs text-sky-800">
                      Сейчас показан заглушечный блок. На бэке можно подключить Leaflet / MapTiler
                      и центрировать карту по координатам объекта.
                    </p>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Широта (lat)</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {w.lat.toFixed(6)}°
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Долгота (lng)</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {w.lng.toFixed(6)}°
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Средний блок: паспорт + осмотры */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Паспорт объекта */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 col-span-1 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                    <FileText className="w-4 h-4 text-indigo-500 mr-2" />
                    Паспорт водного объекта
                  </h2>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                    ID в системе: #{w.id.toString().padStart(4, '0')}
                  </span>
                </div>

                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <InfoRow label="Ответственный орган" value={w.responsibleAgency} asDt />
                  <InfoRow label="Приоритет мониторинга" value={w.priorityLevel} asDt />
                  <InfoRow label="Дата последнего осмотра" value={w.lastInspectionDate} asDt />
                  <InfoRow label="Дата следующего осмотра" value={w.nextInspectionDate} asDt />
                </dl>

                <div className="mt-4 flex items-start space-x-3 text-xs text-gray-600 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-3">
                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p>
                    При интеграции с бэкендом сюда можно добавить ссылки на реальный паспорт, схемы,
                    заключения экспертиз и историю изменений параметров (уровень, минерализация и т.д.).
                  </p>
                </div>
              </div>

              {/* Краткий статус */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
                  <Activity className="w-4 h-4 text-emerald-500 mr-2" />
                  Текущее состояние
                </h2>

                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${statusColorByCategory(
                      w.category
                    )}`}
                  >
                    {w.category}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {statusTextByCategory(w.category)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Оценка по данным последнего осмотра
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Риск деградации экосистемы</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                      Повышенный
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Нагрузка на ресурс</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-sky-100 text-sky-700 font-medium">
                      Средняя
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Наличие конфликтов по использованию</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                      Не зафиксировано
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Нижний блок: история и мероприятия */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* История осмотров */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 col-span-1 lg:col-span-2">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
                  <Calendar className="w-4 h-4 text-rose-500 mr-2" />
                  История осмотров
                </h2>

                <div className="space-y-3">
                  {inspections.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-100 rounded-xl p-3 hover:border-purple-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                            {item.type}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {item.date}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${badgeColorBySeverity(
                            item.severity
                          )}`}
                        >
                          {item.severity === 'ok' ? 'Без нарушений' : 'Есть замечания'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">{item.result}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Мероприятия и документы */}
              <div className="space-y-6">
                {/* Мероприятия */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
                    <Shield className="w-4 h-4 text-emerald-500 mr-2" />
                    Мероприятия
                  </h2>
                  <div className="space-y-3 text-xs">
                    {actions.map((act) => (
                      <div
                        key={act.id}
                        className="border border-gray-100 rounded-xl p-3 hover:border-emerald-200 transition-all"
                      >
                        <p className="font-semibold text-gray-900 mb-1">{act.title}</p>
                        <p className="text-gray-600 mb-1">Ответственный: {act.owner}</p>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {act.status}
                          </span>
                          <span className="text-gray-500">
                            Срок: <span className="font-mono">{act.deadline}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Документы */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
                    <FileText className="w-4 h-4 text-indigo-500 mr-2" />
                    Документы
                  </h2>
                  <ul className="space-y-2 text-xs">
                    {documents.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-gray-900">{doc.name}</p>
                            <p className="text-[11px] text-gray-500">
                              Тип: {doc.type} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] text-indigo-600 font-medium">
                          Открыть
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const InfoRow = ({ label, value, asDt = false }) => {
  const content = (
    <>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </>
  );

  if (asDt) {
    return (
      <div>
        {content}
      </div>
    );
  }

  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right ml-4">{value}</span>
    </div>
  );
};

export default WaterBodyDetail;

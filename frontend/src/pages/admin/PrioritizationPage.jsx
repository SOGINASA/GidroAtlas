import React, { useState } from 'react';
import { 
  AlertTriangle, Target, TrendingUp, Filter, Search, Download, RefreshCw,
  Calendar, MapPin, Droplets, Zap, CheckCircle, Clock, AlertCircle, Info,
  BarChart3, Eye, FileText, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import AdminLayout from '../../components/navigation/admin/AdminLayout';

const PrioritizationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('priority_desc');
  const [showFilters, setShowFilters] = useState(true);

  const objects = [
    { id: 1, name: 'Плотина Каратал', type: 'facility', region: 'Алматинская область', technicalCondition: 5, passportDate: '2015-03-15', passportAge: 9, priorityScore: 18, priorityLevel: 'high', needsInspection: true, mlProbability: 0.92 },
    { id: 2, name: 'Озеро Балхаш', type: 'waterbody', region: 'Карагандинская область', technicalCondition: 4, passportDate: '2017-06-10', passportAge: 7, priorityScore: 13, priorityLevel: 'high', needsInspection: true, mlProbability: 0.85 },
    { id: 3, name: 'Канал Иртыш-Караганда', type: 'waterbody', region: 'Павлодарская область', technicalCondition: 3, passportDate: '2019-04-22', passportAge: 5, priorityScore: 14, priorityLevel: 'high', needsInspection: true, mlProbability: 0.78 },
    { id: 4, name: 'Бухтарминская ГЭС', type: 'facility', region: 'Восточно-Казахстанская область', technicalCondition: 2, passportDate: '2021-09-05', passportAge: 3, priorityScore: 15, priorityLevel: 'high', needsInspection: true, mlProbability: 0.81 },
    { id: 5, name: 'Озеро Зайсан', type: 'waterbody', region: 'Восточно-Казахстанская область', technicalCondition: 2, passportDate: '2022-04-08', passportAge: 2, priorityScore: 10, priorityLevel: 'medium', needsInspection: false, mlProbability: 0.45 },
    { id: 6, name: 'ГЭС Шульбинская', type: 'facility', region: 'Восточно-Казахстанская область', technicalCondition: 2, passportDate: '2021-12-03', passportAge: 3, priorityScore: 9, priorityLevel: 'medium', needsInspection: false, mlProbability: 0.52 },
    { id: 7, name: 'Озеро Маркаколь', type: 'waterbody', region: 'Восточно-Казахстанская область', technicalCondition: 1, passportDate: '2023-03-15', passportAge: 1, priorityScore: 4, priorityLevel: 'low', needsInspection: false, mlProbability: 0.18 }
  ];

  const stats = [
    { label: 'Высокий приоритет', value: objects.filter(o => o.priorityLevel === 'high').length, total: objects.length, color: 'from-red-500 to-orange-500', icon: AlertTriangle },
    { label: 'Средний приоритет', value: objects.filter(o => o.priorityLevel === 'medium').length, total: objects.length, color: 'from-yellow-500 to-amber-500', icon: AlertCircle },
    { label: 'Низкий приоритет', value: objects.filter(o => o.priorityLevel === 'low').length, total: objects.length, color: 'from-green-500 to-emerald-500', icon: CheckCircle },
    { label: 'Требуют обследования', value: objects.filter(o => o.needsInspection).length, total: objects.length, color: 'from-purple-500 to-pink-500', icon: Target }
  ];

  const regions = ['Алматинская область', 'Карагандинская область', 'Павлодарская область', 'Восточно-Казахстанская область'];

  const getPriorityStyles = (level) => {
    const styles = {
      high: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Высокий' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: 'Средний' },
      low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Низкий' }
    };
    return styles[level] || styles.low;
  };

  const getConditionColor = (condition) => {
    const colors = { 1: 'bg-green-500', 2: 'bg-lime-500', 3: 'bg-yellow-500', 4: 'bg-orange-500', 5: 'bg-red-500' };
    return colors[condition] || 'bg-gray-500';
  };

  const filteredObjects = objects.filter(obj => {
    const matchesSearch = searchQuery === '' || obj.name.toLowerCase().includes(searchQuery.toLowerCase()) || obj.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || obj.region === selectedRegion;
    const matchesType = selectedType === 'all' || obj.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || obj.priorityLevel === selectedPriority;
    const matchesCondition = selectedCondition === 'all' || obj.technicalCondition === parseInt(selectedCondition);
    return matchesSearch && matchesRegion && matchesType && matchesPriority && matchesCondition;
  });

  const sortedObjects = [...filteredObjects].sort((a, b) => {
    switch (sortBy) {
      case 'priority_desc': return b.priorityScore - a.priorityScore;
      case 'priority_asc': return a.priorityScore - b.priorityScore;
      case 'condition_desc': return b.technicalCondition - a.technicalCondition;
      case 'condition_asc': return a.technicalCondition - b.technicalCondition;
      case 'passport_old': return b.passportAge - a.passportAge;
      case 'passport_new': return a.passportAge - b.passportAge;
      case 'name_asc': return a.name.localeCompare(b.name);
      case 'name_desc': return b.name.localeCompare(a.name);
      default: return 0;
    }
  });

  const handleExport = () => {
    const dataStr = JSON.stringify(sortedObjects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prioritization_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Target className="w-8 h-8 mr-3" />
                  Приоритизация обследований
                </h1>
                <p className="text-purple-100">Определение объектов, требующих первоочередного внимания</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={handleExport} className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30">
                  <Download className="w-5 h-5" />
                  <span className="font-semibold">Экспорт</span>
                </button>
                <button className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 font-semibold">
                  <RefreshCw className="w-5 h-5" />
                  <span>Обновить</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              const percentage = ((stat.value / stat.total) * 100).toFixed(1);
              return (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className={`bg-gradient-to-br ${stat.color} p-6`}>
                    <Icon className="w-10 h-10 text-white mb-4" />
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm text-white/80 mb-3">{stat.label}</p>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="h-full bg-white" style={{ width: `${percentage}%` }} />
                    </div>
                    <p className="text-xs text-white/80 mt-2">{percentage}% от общего числа</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Formula */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Формула расчёта приоритета</h3>
                <p className="text-blue-100 mb-3">PriorityScore = (6 - Техническое состояние) × 3 + Возраст паспорта в годах</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold mb-1">Высокий приоритет</p>
                    <p className="text-blue-100">Score ≥ 12</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold mb-1">Средний приоритет</p>
                    <p className="text-blue-100">Score 6-11</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold mb-1">Низкий приоритет</p>
                    <p className="text-blue-100">Score &lt; 6</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6">
            <button onClick={() => setShowFilters(!showFilters)} className="w-full flex items-center justify-between p-6 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Filter className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Фильтры и поиск</h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">{sortedObjects.length} объектов</span>
              </div>
              {showFilters ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
            </button>

            {showFilters && (
              <div className="p-6 pt-0 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="lg:col-span-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Область</label>
                    <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                      <option value="all">Все области</option>
                      {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Тип</label>
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                      <option value="all">Все типы</option>
                      <option value="waterbody">Водоёмы</option>
                      <option value="facility">ГТС</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Приоритет</label>
                    <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                      <option value="all">Все</option>
                      <option value="high">Высокий</option>
                      <option value="medium">Средний</option>
                      <option value="low">Низкий</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Состояние</label>
                    <select value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                      <option value="all">Все</option>
                      {[1,2,3,4,5].map(c => <option key={c} value={c}>Категория {c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Сортировка</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                      <option value="priority_desc">Приоритет (↓)</option>
                      <option value="priority_asc">Приоритет (↑)</option>
                      <option value="condition_desc">Состояние (5→1)</option>
                      <option value="name_asc">Название (А→Я)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => { setSearchQuery(''); setSelectedRegion('all'); setSelectedType('all'); setSelectedPriority('all'); setSelectedCondition('all'); setSortBy('priority_desc'); }} className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold">Сбросить</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Объект</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Тип</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Состояние</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Возраст паспорта</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Score</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Приоритет</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">ML</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedObjects.map(obj => {
                    const priorityStyles = getPriorityStyles(obj.priorityLevel);
                    return (
                      <tr key={obj.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {obj.type === 'waterbody' ? <Droplets className="w-5 h-5 text-blue-600" /> : <Zap className="w-5 h-5 text-orange-600" />}
                            <div>
                              <p className="font-semibold text-gray-900">{obj.name}</p>
                              <p className="text-sm text-gray-500 flex items-center"><MapPin className="w-3 h-3 mr-1" />{obj.region}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${obj.type === 'waterbody' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{obj.type === 'waterbody' ? 'Водоём' : 'ГТС'}</span></td>
                        <td className="px-6 py-4 text-center"><div className={`w-10 h-10 rounded-full ${getConditionColor(obj.technicalCondition)} flex items-center justify-center text-white font-bold mx-auto`}>{obj.technicalCondition}</div></td>
                        <td className="px-6 py-4 text-center"><div className="flex items-center justify-center space-x-1"><Calendar className="w-4 h-4 text-gray-400" /><span className="font-semibold">{obj.passportAge} лет</span></div></td>
                        <td className="px-6 py-4 text-center"><span className="text-2xl font-bold text-purple-600">{obj.priorityScore}</span></td>
                        <td className="px-6 py-4 text-center"><span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${priorityStyles.bg} ${priorityStyles.text} ${priorityStyles.border}`}>{priorityStyles.label}</span></td>
                        <td className="px-6 py-4 text-center"><div className="flex items-center justify-center"><div className="relative w-16 h-16"><svg className="transform -rotate-90 w-16 h-16"><circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" /><circle cx="32" cy="32" r="28" stroke={obj.mlProbability >= 0.7 ? '#ef4444' : obj.mlProbability >= 0.5 ? '#f59e0b' : '#10b981'} strokeWidth="6" fill="none" strokeDasharray={`${obj.mlProbability * 176} 176`} strokeLinecap="round" /></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-bold">{Math.round(obj.mlProbability * 100)}%</span></div></div></div></td>
                        <td className="px-6 py-4"><div className="flex items-center justify-center space-x-2"><button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"><Eye className="w-4 h-4" /></button><button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FileText className="w-4 h-4" /></button><button className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><ExternalLink className="w-4 h-4" /></button></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PrioritizationPage;
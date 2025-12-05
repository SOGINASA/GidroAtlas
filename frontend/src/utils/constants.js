export const USER_ROLES = {
  GUEST: 'guest',
  EXPERT: 'expert',
  EMERGENCY: 'emergency',
  ADMIN: 'admin'
};

export const WATER_BODY_TYPES = {
  LAKE: 'lake',
  CANAL: 'canal',
  RESERVOIR: 'reservoir'
};

export const FACILITY_TYPES = {
  HYDROPOWER: 'hydropower',
  DAM: 'dam',
  CANAL: 'canal',
  LOCK: 'lock',
  RESERVOIR: 'reservoir',
  PUMPING_STATION: 'pumping_station'
};

export const REGIONS = [
  'Акмолинская область',
  'Актюбинская область',
  'Алматинская область',
  'Атырауская область',
  'Восточно-Казахстанская область',
  'Жамбылская область',
  'Западно-Казахстанская область',
  'Карагандинская область',
  'Костанайская область',
  'Кызылординская область',
  'Мангистауская область',
  'Павлодарская область',
  'Северо-Казахстанская область',
  'Туркестанская область',
  'Алматы',
  'Астана',
  'Шымкент'
];

export const WATER_TYPES = {
  FRESH: 'fresh',
  NON_FRESH: 'non-fresh'
};

export const TECHNICAL_CONDITIONS = {
  CATEGORY_1: 1,
  CATEGORY_2: 2,
  CATEGORY_3: 3,
  CATEGORY_4: 4,
  CATEGORY_5: 5
};

export const CONDITION_COLORS = {
  1: '#10B981',
  2: '#84CC16',
  3: '#F59E0B',
  4: '#F97316',
  5: '#EF4444'
};

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const FILTER_OPTIONS = {
  regions: REGIONS,
  resourceTypes: [
    { value: 'lake', label: 'Озеро' },
    { value: 'canal', label: 'Канал' },
    { value: 'reservoir', label: 'Водохранилище' }
  ],
  waterTypes: [
    { value: 'fresh', label: 'Пресная' },
    { value: 'non-fresh', label: 'Непресная' }
  ],
  faunaOptions: [
    { value: true, label: 'Да' },
    { value: false, label: 'Нет' }
  ],
  conditionCategories: [
    { value: 1, label: 'Категория 1', color: '#10B981' },
    { value: 2, label: 'Категория 2', color: '#84CC16' },
    { value: 3, label: 'Категория 3', color: '#F59E0B' },
    { value: 4, label: 'Категория 4', color: '#F97316' },
    { value: 5, label: 'Категория 5', color: '#EF4444' }
  ]
};

export const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Название (А-Я)' },
  { value: 'name_desc', label: 'Название (Я-А)' },
  { value: 'region_asc', label: 'Область (А-Я)' },
  { value: 'region_desc', label: 'Область (Я-А)' },
  { value: 'condition_asc', label: 'Состояние (1→5)' },
  { value: 'condition_desc', label: 'Состояние (5→1)' },
  { value: 'passport_new', label: 'Паспорт (новые)' },
  { value: 'passport_old', label: 'Паспорт (старые)' },
  { value: 'priority_high', label: 'Приоритет (высокий→низкий)' },
  { value: 'priority_low', label: 'Приоритет (низкий→высокий)' }
];

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
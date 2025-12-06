# 🌊 Гидроатлас Казахстана - Полная объединённая структура фронтенда

## 📋 Общая информация

**Название проекта**: GidroAtlas (Гидроатлас Казахстана)

**Описание**: Интерактивная веб-платформа для мониторинга водных ресурсов и гидротехнических сооружений Казахстана с использованием AI-прогнозирования, системой ролевого доступа и приоритизации обследований.

**Цель MVP**: Дать пользователю простую карту, на которой отображаются водоёмы и гидротехнические сооружения. Система позволяет искать объекты, смотреть их характеристики, показывать уровень технического состояния и определять приоритет обследования.

**Технологический стек**:
- React 18.3.1
- React Router DOM 6.x
- Tailwind CSS 3.4.1
- Leaflet 1.9.4 + React-Leaflet
- Axios
- Lucide React (иконки)

---

## 👥 Типы пользователей и роли

### 1. **GUEST** (Гость) - Базовый доступ
- **Цвет темы**: Серый (#6B7280)
- **Иконка**: 👤
- **Доступ**: 
  - Просмотр карты и объектов
  - Базовая информация о водоёмах и ГТС
  - НЕТ доступа к приоритетам и таблицам
  - НЕТ возможности редактировать данные
- **Главная страница**: `/guest/map`
- **Авторизация**: Не требуется

**Навигация Desktop**:
- 🗺️ Карта
- 💧 Водоёмы
- ⚡ ГТС
- 📖 О проекте
- 🔐 Войти

**Навигация Mobile (Bottom Nav)**:
- 🗺️ Карта
- 💧 Водоёмы
- ⚡ ГТС
- ⋮ Ещё

---

### 2. **EXPERT** (Эксперт) - Полный доступ к аналитике
- **Цвет темы**: Синий (#3B82F6)
- **Иконка**: 🎓
- **Доступ**: 
  - Полный доступ ко всем данным
  - Просмотр состояния объектов
  - Доступ к приоритетам и таблицам
  - Открытие паспортов объектов (PDF)
  - Использование поиска и фильтров в полном объёме
  - Просмотр AI-прогнозов
- **Главная страница**: `/expert/dashboard`
- **Авторизация**: Логин/пароль

**Навигация Desktop**:
- 🏠 Дашборд
- 🗺️ Карта
- 💧 Водоёмы
- ⚡ ГТС
- 📊 Приоритизация
- 🔮 Прогнозирование
- 📈 Аналитика
- 🔔 Уведомления
- 👤 Профиль
- 🚪 Выход

**Навигация Mobile (Bottom Nav)**:
- 🏠 Дашборд
- 🗺️ Карта
- 📊 Приоритеты
- 🔮 Прогноз
- ⋮ Ещё

---

### 3. **EMERGENCY** (МЧС/Спасательные службы)
- **Цвет темы**: Красный (#EF4444)
- **Иконка**: 🚨
- **Доступ**: 
  - Все возможности эксперта
  - Мониторинг критических объектов
  - Управление эвакуациями (если применимо)
  - Отправка массовых уведомлений
  - Генерация отчётов
- **Главная страница**: `/emergency/control-center`

**Навигация Desktop**:
- 🎛️ Центр управления
- 🗺️ Карта мониторинга
- 💧 Водоёмы
- ⚡ ГТС
- 🔮 Прогнозирование
- ⚠️ Критические зоны
- 📊 Приоритизация
- 📈 Аналитика
- 📢 Уведомления
- 📋 Отчёты
- 👤 Профиль
- 🚪 Выход

**Навигация Mobile (Bottom Nav)**:
- 🎛️ Центр
- 🗺️ Карта
- ⚠️ Критич.
- 📊 Приорит.
- ⋮ Ещё

---

### 4. **ADMIN** (Администраторы)
- **Цвет темы**: Фиолетовый (#8B5CF6)
- **Иконка**: ⚙️
- **Доступ**: 
  - Полное управление системой
  - CRUD операции для всех объектов
  - Управление пользователями
  - Настройка AI моделей
  - Управление датчиками и IoT
  - Просмотр логов и аудита
- **Главная страница**: `/admin/overview`

**Навигация Desktop**:
- 📊 Обзор системы
- 👥 Управление пользователями
- 💧 Управление водоёмами
- ⚡ Управление ГТС
- 🗺️ Карта (полный доступ)
- 🤖 Настройка AI
- 📡 Датчики и IoT
- 📊 Приоритизация
- 📢 Система уведомлений
- 📋 Логи и аудит
- 📊 Аналитика системы
- ⚙️ Настройки
- 👤 Профиль
- 🚪 Выход

**Навигация Mobile (Bottom Nav)**:
- 📊 Обзор
- 👥 Пользов.
- 💧 Водоёмы
- ⚡ ГТС
- ⋮ Ещё

---

## 📂 Полная структура файлов и папок

```
hydroatlas-kz/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── passports/        # Папка для PDF паспортов
│
├── src/
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── guest/
│   │   │   │   ├── GuestDesktopSidebar.jsx
│   │   │   │   ├── GuestBottomNav.jsx
│   │   │   │   └── GuestHeader.jsx
│   │   │   ├── expert/
│   │   │   │   ├── ExpertDesktopSidebar.jsx
│   │   │   │   ├── ExpertBottomNav.jsx
│   │   │   │   └── ExpertHeader.jsx
│   │   │   ├── emergency/
│   │   │   │   ├── EmergencyDesktopSidebar.jsx
│   │   │   │   ├── EmergencyBottomNav.jsx
│   │   │   │   └── EmergencyHeader.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDesktopSidebar.jsx
│   │   │   │   ├── AdminBottomNav.jsx
│   │   │   │   └── AdminHeader.jsx
│   │   │   └── common/
│   │   │       ├── NavigationWrapper.jsx
│   │   │       └── MobileMenu.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── MainDashboard.jsx
│   │   │   ├── StatisticsPanel.jsx
│   │   │   ├── WaterBodyCard.jsx
│   │   │   ├── HydroFacilityCard.jsx
│   │   │   └── PriorityDashboard.jsx      # Новое - дашборд приоритизации
│   │   │
│   │   ├── map/
│   │   │   ├── MainMap.jsx
│   │   │   ├── WaterBodyMarker.jsx
│   │   │   ├── HydroFacilityMarker.jsx
│   │   │   ├── RegionBoundaries.jsx
│   │   │   ├── LayerControls.jsx
│   │   │   ├── MapLegend.jsx
│   │   │   └── ObjectDetailsPanel.jsx      # Новое - панель деталей объекта
│   │   │
│   │   ├── waterbody/
│   │   │   ├── WaterBodyDetails.jsx
│   │   │   ├── WaterBodyList.jsx
│   │   │   ├── WaterBodyCard.jsx           # Новое - карточка объекта
│   │   │   ├── WaterQualityIndicator.jsx
│   │   │   ├── WaterLevelChart.jsx
│   │   │   └── PassportViewer.jsx          # Новое - просмотр PDF паспорта
│   │   │
│   │   ├── hydrofacility/
│   │   │   ├── FacilityDetails.jsx
│   │   │   ├── FacilityList.jsx
│   │   │   ├── FacilityCard.jsx            # Новое - карточка ГТС
│   │   │   ├── FacilityStatusCard.jsx
│   │   │   ├── TechnicalSpecs.jsx
│   │   │   ├── TechnicalConditionIndicator.jsx  # Новое - индикатор состояния 1-5
│   │   │   └── PassportViewer.jsx          # Новое - просмотр PDF паспорта
│   │   │
│   │   ├── prediction/
│   │   │   ├── PredictionPanel.jsx
│   │   │   ├── PredictionChart.jsx
│   │   │   ├── RiskAssessment.jsx
│   │   │   ├── ForecastTimeline.jsx
│   │   │   └── MLModelInfo.jsx             # Новое - информация о ML модели
│   │   │
│   │   ├── prioritization/                  # Новая папка - приоритизация
│   │   │   ├── PriorityTable.jsx           # Таблица с приоритетами
│   │   │   ├── PriorityCalculator.jsx      # Калькулятор приоритета
│   │   │   ├── PriorityBadge.jsx           # Бейдж приоритета (высокий/средний/низкий)
│   │   │   └── PriorityFilters.jsx         # Фильтры для таблицы приоритизации
│   │   │
│   │   ├── filters/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── RegionFilter.jsx
│   │   │   ├── TypeFilter.jsx
│   │   │   ├── WaterTypeFilter.jsx         # Новое - фильтр по типу воды
│   │   │   ├── FaunaFilter.jsx             # Новое - фильтр по наличию фауны
│   │   │   ├── DateRangeFilter.jsx         # Новое - фильтр по дате паспорта
│   │   │   ├── ConditionFilter.jsx         # Новое - фильтр по категории 1-5
│   │   │   ├── AdvancedFilters.jsx
│   │   │   └── SortControls.jsx            # Новое - контролы сортировки
│   │   │
│   │   ├── analytics/
│   │   │   ├── StatisticsCharts.jsx
│   │   │   ├── ComparisonView.jsx
│   │   │   ├── TrendAnalysis.jsx
│   │   │   └── PriorityStatistics.jsx      # Новое - статистика по приоритетам
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── RequireAuth.jsx
│   │   │   └── RoleSelector.jsx            # Новое - выбор роли при входе
│   │   │
│   │   └── common/
│   │       ├── Loader.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── Modal.jsx
│   │       ├── Tooltip.jsx
│   │       ├── InfoCard.jsx
│   │       ├── PDFViewer.jsx               # Новое - просмотр PDF
│   │       └── ColorIndicator.jsx          # Новое - цветовой индикатор состояния
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── AboutPage.jsx               # Новое - о проекте
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── guest/                           # Новая папка - страницы гостя
│   │   │   ├── GuestMap.jsx
│   │   │   ├── GuestWaterBodies.jsx
│   │   │   ├── GuestFacilities.jsx
│   │   │   └── GuestObjectDetails.jsx
│   │   │
│   │   ├── expert/                          # Новая папка - страницы эксперта
│   │   │   ├── ExpertDashboard.jsx
│   │   │   ├── ExpertMap.jsx
│   │   │   ├── WaterBodiesPage.jsx
│   │   │   ├── FacilitiesPage.jsx
│   │   │   ├── PrioritizationPage.jsx      # Новое - страница приоритизации
│   │   │   ├── PredictionsPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   │
│   │   ├── emergency/
│   │   │   ├── EmergencyDashboard.jsx
│   │   │   ├── EmergencyMap.jsx
│   │   │   ├── WaterBodiesManagement.jsx
│   │   │   ├── FacilitiesManagement.jsx
│   │   │   ├── PrioritizationPage.jsx      # Новое
│   │   │   ├── PredictionsPage.jsx
│   │   │   ├── CriticalZonesPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── NotificationsManagement.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── UsersManagement.jsx
│   │       ├── WaterBodiesManagement.jsx
│   │       ├── FacilitiesManagement.jsx
│   │       ├── AdminMap.jsx
│   │       ├── AISettings.jsx
│   │       ├── SensorsManagement.jsx
│   │       ├── PrioritizationPage.jsx      # Новое
│   │       ├── NotificationsSettings.jsx
│   │       ├── LogsPage.jsx
│   │       ├── SystemAnalytics.jsx
│   │       ├── SettingsPage.jsx
│   │       └── ProfilePage.jsx
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── MapContext.jsx
│   │   ├── FilterContext.jsx
│   │   └── DataContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useWaterBodies.js
│   │   ├── useHydroFacilities.js
│   │   ├── usePredictions.js
│   │   ├── usePrioritization.js            # Новое - хук для приоритизации
│   │   ├── useMapControls.js
│   │   ├── useFilters.js
│   │   └── useSorting.js                   # Новое - хук для сортировки
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── waterBodyService.js
│   │   ├── hydroFacilityService.js
│   │   ├── predictionService.js
│   │   ├── priorityService.js              # Новое - сервис приоритизации
│   │   ├── analyticsService.js
│   │   └── geoService.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── mapUtils.js
│   │   ├── dataFormatters.js
│   │   ├── validators.js
│   │   ├── priorityCalculator.js           # Новое - расчёт приоритета
│   │   └── sortingHelpers.js               # Новое - функции сортировки
│   │
│   ├── data/
│   │   ├── regions.js
│   │   ├── waterBodyTypes.js
│   │   ├── facilityTypes.js
│   │   ├── mapLayers.js
│   │   └── mockData.js                     # Новое - моковые данные для разработки
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── map.css
│   │   └── animations.css
│   │
│   ├── App.js
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 📊 Расширенные структуры данных

### Водоём (Water Body) - С учётом ТЗ хакатона

```javascript
{
  id: string,                    // Уникальный идентификатор
  name: string,                  // Название объекта
  name_kz: string,               // Название на казахском
  region: string,                // Область/регион (enum из REGIONS)
  
  // ТИП ВОДНОГО РЕСУРСА (из ТЗ)
  resourceType: 'lake' | 'canal' | 'reservoir',  // enum: озеро/канал/водохранилище
  
  // ТИП ВОДЫ (из ТЗ)
  waterType: 'fresh' | 'non-fresh',  // enum: пресная/непресная
  
  // НАЛИЧИЕ ФАУНЫ (из ТЗ)
  fauna: boolean,                // да/нет
  
  // ДАТА ПАСПОРТА (из ТЗ)
  passportDate: string,          // Дата паспорта (ISO format)
  passportAge: number,           // Возраст паспорта в годах (вычисляется)
  
  // ТЕХНИЧЕСКОЕ СОСТОЯНИЕ (из ТЗ)
  technicalCondition: 1 | 2 | 3 | 4 | 5,  // Категория 1-5
  
  // КООРДИНАТЫ (из ТЗ)
  coordinates: {
    lat: number,                 // Широта
    lng: number                  // Долгота
  },
  
  // PDF ПАСПОРТ (из ТЗ)
  pdfUrl: string,                // Ссылка на PDF паспорта
  
  // ПРИОРИТЕТ (из ТЗ - рассчитывается)
  priority: {
    score: number,               // PriorityScore = (6 - состояние) * 3 + возраст паспорта
    level: 'high' | 'medium' | 'low',  // ≥12 высокий, 6-11 средний, <6 низкий
    needsInspection: boolean,    // Требует обследования
    mlProbability: number        // ML вероятность необходимости внимания (опционально)
  },
  
  // ДОПОЛНИТЕЛЬНЫЕ ХАРАКТЕРИСТИКИ
  area: number,                  // км²
  volume: number,                // км³
  maxDepth: number,              // метров
  avgDepth: number,              // метров
  
  waterQuality: {
    status: 'excellent' | 'good' | 'moderate' | 'poor' | 'bad',
    pH: number,
    turbidity: number,
    dissolvedOxygen: number,
    lastUpdated: string
  },
  
  currentLevel: {
    value: number,               // метров
    percentage: number,          // от нормы
    trend: 'rising' | 'falling' | 'stable',
    lastUpdated: string
  },
  
  characteristics: {
    salinity: 'fresh' | 'brackish' | 'saline',
    isNavigable: boolean,
    fishingAllowed: boolean,
    protectedArea: boolean
  },
  
  tributaries: string[],
  connectedFacilities: string[],
  images: string[],
  description: string,
  historicalData: array,
  predictions: object,
  
  // МЕТАДАННЫЕ
  createdAt: string,
  updatedAt: string,
  createdBy: string,
  lastModifiedBy: string
}
```

### Гидротехническое сооружение (Hydro Facility) - С учётом ТЗ хакатона

```javascript
{
  id: string,
  name: string,
  name_kz: string,
  region: string,
  
  // ТИП ГТС
  type: 'hydropower' | 'dam' | 'canal' | 'lock' | 'reservoir' | 'pumping_station',
  
  // ТИП ВОДЫ (из ТЗ)
  waterType: 'fresh' | 'non-fresh',
  
  // НАЛИЧИЕ ФАУНЫ (из ТЗ)
  fauna: boolean,
  
  // ДАТА ПАСПОРТА (из ТЗ)
  passportDate: string,
  passportAge: number,
  
  // ТЕХНИЧЕСКОЕ СОСТОЯНИЕ (из ТЗ)
  technicalCondition: 1 | 2 | 3 | 4 | 5,
  
  // КООРДИНАТЫ (из ТЗ)
  coordinates: {
    lat: number,
    lng: number
  },
  
  // PDF ПАСПОРТ (из ТЗ)
  pdfUrl: string,
  
  // ПРИОРИТЕТ (из ТЗ - рассчитывается)
  priority: {
    score: number,
    level: 'high' | 'medium' | 'low',
    needsInspection: boolean,
    mlProbability: number
  },
  
  // СТАТУС
  status: 'operational' | 'maintenance' | 'emergency' | 'decommissioned',
  commissionedYear: number,
  operator: string,
  
  technicalSpecs: {
    capacity: number,            // МВт для ГЭС
    height: number,              // метров для плотин
    length: number,              // метров
    reservoirVolume: number,     // км³
    turbines: number,
    annualGeneration: number     // ГВт·ч/год
  },
  
  condition: {
    overallStatus: 'excellent' | 'good' | 'satisfactory' | 'poor' | 'critical',
    structuralIntegrity: number, // %
    equipmentCondition: number,  // %
    lastInspection: string,
    nextInspection: string
  },
  
  waterBody: string,
  downstreamFacilities: string[],
  upstreamFacilities: string[],
  riskLevel: 'low' | 'medium' | 'high' | 'critical',
  emergencyContacts: array,
  documents: array,
  images: array,
  predictions: object,
  
  createdAt: string,
  updatedAt: string,
  createdBy: string,
  lastModifiedBy: string
}
```

### Пользователь (User) - С учётом ТЗ хакатона

```javascript
{
  id: string,                    // Уникальный идентификатор
  login: string,                 // Логин
  passwordHash: string,          // Хэш пароля
  
  // РОЛЬ (из ТЗ)
  role: 'guest' | 'expert' | 'emergency' | 'admin',
  
  // ПРОФИЛЬ
  profile: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    organization: string,        // Для экспертов/МЧС/админов
    position: string,            // Должность
    avatar: string
  },
  
  // НАСТРОЙКИ
  settings: {
    language: 'ru' | 'kz' | 'en',
    notifications: boolean,
    theme: 'light' | 'dark'
  },
  
  // СТАТИСТИКА
  lastLogin: string,
  createdAt: string,
  isActive: boolean
}
```

---

## 🎯 Система приоритизации (из ТЗ хакатона)

### Формула расчёта приоритета

```javascript
// utils/priorityCalculator.js

/**
 * Расчёт приоритета обследования объекта
 * PriorityScore = (6 - состояние) * 3 + возраст паспорта в годах
 * 
 * Логика:
 * - Чем хуже состояние (5) → тем выше приоритет
 * - Чем старее паспорт → тем выше приоритет
 * 
 * Классификация:
 * - ≥ 12 → Высокий приоритет
 * - 6-11 → Средний приоритет
 * - < 6  → Низкий приоритет
 */

export const calculatePriority = (technicalCondition, passportDate) => {
  // Вычисляем возраст паспорта в годах
  const currentYear = new Date().getFullYear();
  const passportYear = new Date(passportDate).getFullYear();
  const passportAge = currentYear - passportYear;
  
  // Формула из ТЗ
  const score = (6 - technicalCondition) * 3 + passportAge;
  
  // Определяем уровень приоритета
  let level;
  if (score >= 12) {
    level = 'high';
  } else if (score >= 6) {
    level = 'medium';
  } else {
    level = 'low';
  }
  
  return {
    score,
    level,
    needsInspection: score >= 12,
    details: {
      technicalCondition,
      passportAge,
      calculation: `(6 - ${technicalCondition}) * 3 + ${passportAge} = ${score}`
    }
  };
};

/**
 * ML модель для предсказания необходимости обследования (опционально)
 * Простая логистическая регрессия
 */
export const mlPredictNeedsAttention = (object) => {
  // Упрощённая ML логика (можно заменить на реальную модель)
  const features = {
    condition: object.technicalCondition,
    age: object.passportAge,
    hasIssues: object.condition?.overallStatus === 'poor' || object.condition?.overallStatus === 'critical'
  };
  
  // Простая формула (замените на реальную ML модель)
  let probability = 0;
  probability += (6 - features.condition) * 0.15;  // Влияние состояния
  probability += features.age * 0.02;              // Влияние возраста
  probability += features.hasIssues ? 0.3 : 0;     // Наличие проблем
  
  return Math.min(1, probability);  // Вероятность от 0 до 1
};
```

### Компонент PriorityBadge

```javascript
// components/prioritization/PriorityBadge.jsx

import React from 'react';

const PriorityBadge = ({ level, score }) => {
  const getStyles = () => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-300',
          label: 'Высокий'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-300',
          label: 'Средний'
        };
      case 'low':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          label: 'Низкий'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300',
          label: 'Не определён'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${styles.bg} ${styles.text} ${styles.border}`}>
      <span className="font-semibold">{styles.label}</span>
      <span className="text-sm">({score})</span>
    </div>
  );
};

export default PriorityBadge;
```

---

## 🔍 Система фильтрации и сортировки (из ТЗ хакатона)

### Доступные фильтры

```javascript
// utils/constants.js

export const FILTER_OPTIONS = {
  // Область (select)
  regions: REGIONS,
  
  // Тип водного ресурса
  resourceTypes: [
    { value: 'lake', label: 'Озеро' },
    { value: 'canal', label: 'Канал' },
    { value: 'reservoir', label: 'Водохранилище' }
  ],
  
  // Тип воды
  waterTypes: [
    { value: 'fresh', label: 'Пресная' },
    { value: 'non-fresh', label: 'Непресная' }
  ],
  
  // Наличие фауны
  faunaOptions: [
    { value: true, label: 'Да' },
    { value: false, label: 'Нет' }
  ],
  
  // Категория состояния (1-5)
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
```

### Компонент AdvancedFilters

```javascript
// components/filters/AdvancedFilters.jsx

import React, { useState } from 'react';
import { FILTER_OPTIONS } from '../../utils/constants';

const AdvancedFilters = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState({
    region: '',
    resourceType: '',
    waterType: '',
    fauna: null,
    conditionFrom: 1,
    conditionTo: 5,
    passportDateFrom: '',
    passportDateTo: ''
  });

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      region: '',
      resourceType: '',
      waterType: '',
      fauna: null,
      conditionFrom: 1,
      conditionTo: 5,
      passportDateFrom: '',
      passportDateTo: ''
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Фильтры</h3>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Сбросить все
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Область */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Область
          </label>
          <select
            value={filters.region}
            onChange={(e) => handleChange('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все области</option>
            {FILTER_OPTIONS.regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Тип водного ресурса */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип водного ресурса
          </label>
          <select
            value={filters.resourceType}
            onChange={(e) => handleChange('resourceType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все типы</option>
            {FILTER_OPTIONS.resourceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Тип воды */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип воды
          </label>
          <select
            value={filters.waterType}
            onChange={(e) => handleChange('waterType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все типы</option>
            {FILTER_OPTIONS.waterTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Наличие фауны */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Наличие фауны
          </label>
          <select
            value={filters.fauna === null ? '' : filters.fauna.toString()}
            onChange={(e) => handleChange('fauna', e.target.value === '' ? null : e.target.value === 'true')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Не важно</option>
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        </div>

        {/* Категория состояния (от) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категория от
          </label>
          <select
            value={filters.conditionFrom}
            onChange={(e) => handleChange('conditionFrom', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>Категория {num}</option>
            ))}
          </select>
        </div>

        {/* Категория состояния (до) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категория до
          </label>
          <select
            value={filters.conditionTo}
            onChange={(e) => handleChange('conditionTo', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>Категория {num}</option>
            ))}
          </select>
        </div>

        {/* Дата паспорта (от) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата паспорта от
          </label>
          <input
            type="date"
            value={filters.passportDateFrom}
            onChange={(e) => handleChange('passportDateFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Дата паспорта (до) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата паспорта до
          </label>
          <input
            type="date"
            value={filters.passportDateTo}
            onChange={(e) => handleChange('passportDateTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
```

---

## 🗺️ Цветовая индикация на карте (из ТЗ хакатона)

### Маркеры с цветовой индикацией по техническому состоянию

```javascript
// components/map/HydroFacilityMarker.jsx

import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import PriorityBadge from '../prioritization/PriorityBadge';

const HydroFacilityMarker = ({ data, onClick }) => {
  // Цвета по категории технического состояния (из ТЗ)
  const getColorByCondition = (condition) => {
    const colors = {
      1: '#10B981',  // Категория 1 - Зелёный
      2: '#84CC16',  // Категория 2 - Салатовый
      3: '#F59E0B',  // Категория 3 - Жёлтый
      4: '#F97316',  // Категория 4 - Оранжевый
      5: '#EF4444'   // Категория 5 - Красный
    };
    return colors[condition] || '#6B7280';
  };

  const getIcon = (type, condition, priority) => {
    const icons = {
      hydropower: '⚡',
      dam: '🏗️',
      canal: '〰️',
      reservoir: '💧',
      pumping_station: '⬆️'
    };

    const color = getColorByCondition(condition);

    return L.divIcon({
      html: `
        <div class="relative">
          <div class="w-12 h-12 rounded-lg border-3 border-white shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform"
               style="background-color: ${color}">
            <span class="text-2xl">${icons[type]}</span>
          </div>
          ${priority.level === 'high' ? `
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full animate-pulse border-2 border-white">
              <span class="text-white text-xs font-bold">!</span>
            </div>
          ` : ''}
        </div>
      `,
      className: 'custom-facility-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });
  };

  return (
    <Marker
      position={[data.coordinates.lat, data.coordinates.lng]}
      icon={getIcon(data.type, data.technicalCondition, data.priority)}
      eventHandlers={{
        click: onClick
      }}
    >
      <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
        <div className="text-sm min-w-[200px]">
          <div className="font-bold text-base mb-1">{data.name}</div>
          <div className="text-xs text-gray-600 mb-2">{data.region}</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Состояние:</span>
              <span className="font-semibold">Категория {data.technicalCondition}</span>
            </div>
            <div className="flex justify-between">
              <span>Приоритет:</span>
              <PriorityBadge level={data.priority.level} score={data.priority.score} />
            </div>
          </div>
        </div>
      </Tooltip>

      <Popup maxWidth={350}>
        <div className="p-2">
          <h3 className="font-bold text-lg mb-3">{data.name}</h3>
          
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Область:</span>
              <span className="font-medium">{data.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Тип:</span>
              <span className="font-medium">{data.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Год ввода:</span>
              <span className="font-medium">{data.commissionedYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Дата паспорта:</span>
              <span className="font-medium">
                {new Date(data.passportDate).toLocaleDateString('ru-RU')}
                <span className="text-xs text-gray-500 ml-1">
                  ({data.passportAge} лет)
                </span>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Техническое состояние:</span>
              <div 
                className="px-3 py-1 rounded-full text-white font-semibold text-sm"
                style={{ backgroundColor: getColorByCondition(data.technicalCondition) }}
              >
                Категория {data.technicalCondition}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Приоритет обследования:</span>
              <PriorityBadge level={data.priority.level} score={data.priority.score} />
            </div>
            {data.priority.mlProbability && (
              <div className="text-xs text-gray-500 mt-1">
                ML вероятность: {(data.priority.mlProbability * 100).toFixed(0)}%
              </div>
            )}
          </div>

          {data.pdfUrl && (
            <button
              onClick={() => window.open(data.pdfUrl, '_blank')}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-2 flex items-center justify-center gap-2"
            >
              <span>📄</span>
              <span>Открыть паспорт</span>
            </button>
          )}

          <button
            onClick={onClick}
            className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <span>Подробнее</span>
            <span>→</span>
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default HydroFacilityMarker;
```

---

## 🔐 Обновлённые маршруты с учётом всех ролей

```javascript
// App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/auth/RequireAuth';

// Public pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import AboutPage from './pages/public/AboutPage';

// Guest pages
import GuestMap from './pages/guest/GuestMap';
import GuestWaterBodies from './pages/guest/GuestWaterBodies';
import GuestFacilities from './pages/guest/GuestFacilities';

// Expert pages
import ExpertDashboard from './pages/expert/ExpertDashboard';
import ExpertMap from './pages/expert/ExpertMap';
import ExpertWaterBodies from './pages/expert/WaterBodiesPage';
import ExpertFacilities from './pages/expert/FacilitiesPage';
import ExpertPrioritization from './pages/expert/PrioritizationPage';
import ExpertPredictions from './pages/expert/PredictionsPage';
import ExpertAnalytics from './pages/expert/AnalyticsPage';

// Emergency pages
import EmergencyDashboard from './pages/emergency/EmergencyDashboard';
import EmergencyMap from './pages/emergency/EmergencyMap';
import EmergencyPrioritization from './pages/emergency/PrioritizationPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/UsersManagement';
import AdminWaterBodies from './pages/admin/WaterBodiesManagement';
import AdminFacilities from './pages/admin/FacilitiesManagement';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Маршруты гостя (без авторизации) */}
          <Route path="/guest/map" element={<GuestMap />} />
          <Route path="/guest/waterbodies" element={<GuestWaterBodies />} />
          <Route path="/guest/facilities" element={<GuestFacilities />} />

          {/* Защищённые маршруты для экспертов */}
          <Route element={<RequireAuth allowedRoles={['expert']} />}>
            <Route path="/expert/dashboard" element={<ExpertDashboard />} />
            <Route path="/expert/map" element={<ExpertMap />} />
            <Route path="/expert/waterbodies" element={<ExpertWaterBodies />} />
            <Route path="/expert/facilities" element={<ExpertFacilities />} />
            <Route path="/expert/prioritization" element={<ExpertPrioritization />} />
            <Route path="/expert/predictions" element={<ExpertPredictions />} />
            <Route path="/expert/analytics" element={<ExpertAnalytics />} />
          </Route>

          {/* Защищённые маршруты для МЧС */}
          <Route element={<RequireAuth allowedRoles={['emergency']} />}>
            <Route path="/emergency/control-center" element={<EmergencyDashboard />} />
            <Route path="/emergency/map" element={<EmergencyMap />} />
            <Route path="/emergency/prioritization" element={<EmergencyPrioritization />} />
          </Route>

          {/* Защищённые маршруты для админов */}
          <Route element={<RequireAuth allowedRoles={['admin']} />}>
            <Route path="/admin/overview" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/waterbodies" element={<AdminWaterBodies />} />
            <Route path="/admin/facilities" element={<AdminFacilities />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 📊 Ожидаемый результат от MVP (из ТЗ хакатона)

К концу разработки система должна предоставить:

✅ **Рабочее веб-приложение с картой**
- Интерактивная карта Казахстана
- Маркеры водоёмов и ГТС с цветовой индикацией
- Клик на маркер → карточка объекта

✅ **Фильтрация и поиск**
- Фильтр по области
- Фильтр по типу водного ресурса
- Фильтр по типу воды
- Фильтр по наличию фауны
- Фильтр по дате паспорта (диапазон)
- Фильтр по категории состояния (1-5)
- Поиск по названию объекта

✅ **Карточки объектов**
- Название, область, тип
- Координаты
- Дата паспорта
- Техническое состояние (1-5)
- Кнопка "Открыть паспорт" (PDF)

✅ **Цветовая индикация состояния**
- Зелёный → Категория 1
- Салатовый → Категория 2
- Жёлтый → Категория 3
- Оранжевый → Категория 4
- Красный → Категория 5

✅ **Дашборд приоритизации**
- Таблица с расчётом приоритета
- Сортировка по приоритету
- Фильтрация применяется к таблице
- Возможность изменить формулу приоритета

✅ **Две роли пользователей**
- Гость: только просмотр
- Эксперт: полный доступ

---

Это полная объединённая структура проекта GidroAtlas с учётом ТЗ хакатона! 🌊
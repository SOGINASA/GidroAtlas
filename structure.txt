# 🌊 Гидроатлас Казахстана - Полная структура фронтенда

## 📋 Общая информация

**Название проекта**: Гидроатлас Казахстана (HydroAtlas KZ)

**Описание**: Интерактивная веб-платформа для мониторинга водных ресурсов и гидротехнических сооружений Казахстана с использованием AI-прогнозирования и системы ролевого доступа.

**Технологический стек**:
- React 18.3.1
- React Router DOM 6.x
- Tailwind CSS 3.4.1
- Leaflet 1.9.4 + React-Leaflet
- Axios
- Lucide React (иконки)

---

## 👥 Типы пользователей и роли

### 1. **CITIZEN** (Граждане)
- **Цвет темы**: Синий (#3B82F6)
- **Иконка**: 👥
- **Доступ**: Просмотр информации о водоёмах и ГТС, карта, статистика
- **Главная страница**: `/citizen/dashboard`

**Навигация Desktop**:
- 🏠 Главная
- 🗺️ Карта
- 💧 Водоёмы
- ⚡ ГТС
- 📊 Статистика
- 🔔 Уведомления
- 👤 Профиль
- ❓ Справка
- 🚪 Выход

**Навигация Mobile (Bottom Nav)**:
- 🏠 Главная
- 🗺️ Карта
- 🔔 Уведомления
- 📊 Статистика
- ⋮ Ещё (выпадающее меню с остальными пунктами)

### 2. **EMERGENCY** (МЧС/Спасательные службы)
- **Цвет темы**: Красный (#EF4444)
- **Иконка**: 🚨
- **Доступ**: Полный мониторинг, прогнозирование, управление критическими зонами
- **Главная страница**: `/emergency/control-center`

**Навигация Desktop**:
- 🎛️ Центр управления
- 🗺️ Карта мониторинга
- 💧 Водоёмы
- ⚡ ГТС
- 🔮 Прогнозирование
- ⚠️ Критические зоны
- 📊 Аналитика
- 📢 Массовые уведомления
- 📋 Отчёты
- 👤 Профиль
- 🚪 Выход

**Навигация Mobile (Bottom Nav)**:
- 🎛️ Центр
- 🗺️ Карта
- 🔮 Прогноз
- ⚠️ Критические
- ⋮ Ещё

### 3. **ADMIN** (Администраторы)
- **Цвет темы**: Фиолетовый (#8B5CF6)
- **Иконка**: ⚙️
- **Доступ**: Полное управление системой, пользователями, данными
- **Главная страница**: `/admin/overview`

**Навигация Desktop**:
- 📊 Обзор системы
- 👥 Управление пользователями
- 💧 Управление водоёмами
- ⚡ Управление ГТС
- 🗺️ Карта (полный доступ)
- 🤖 Настройка AI
- 📡 Датчики и IoT
- 📢 Система уведомлений
- 📋 Логи и аудит
- 📊 Аналитика системы
- ⚙️ Настройки
- 👤 Профиль
- 🚪 Выход

**Навигация Mobile (Bottom Nav)**:
- 📊 Обзор
- 👥 Пользователи
- 💧 Водоёмы
- ⚡ ГТС
- ⋮ Ещё

---

## 📂 Структура файлов и папок

```
hydroatlas-kz/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       └── icons/
│
├── src/
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── citizen/
│   │   │   │   ├── CitizenDesktopSidebar.jsx
│   │   │   │   ├── CitizenBottomNav.jsx
│   │   │   │   └── CitizenHeader.jsx
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
│   │   │   └── HydroFacilityCard.jsx
│   │   │
│   │   ├── map/
│   │   │   ├── MainMap.jsx
│   │   │   ├── WaterBodyMarker.jsx
│   │   │   ├── HydroFacilityMarker.jsx
│   │   │   ├── RegionBoundaries.jsx
│   │   │   ├── LayerControls.jsx
│   │   │   └── MapLegend.jsx
│   │   │
│   │   ├── waterbody/
│   │   │   ├── WaterBodyDetails.jsx
│   │   │   ├── WaterBodyList.jsx
│   │   │   ├── WaterQualityIndicator.jsx
│   │   │   └── WaterLevelChart.jsx
│   │   │
│   │   ├── hydrofacility/
│   │   │   ├── FacilityDetails.jsx
│   │   │   ├── FacilityList.jsx
│   │   │   ├── FacilityStatusCard.jsx
│   │   │   └── TechnicalSpecs.jsx
│   │   │
│   │   ├── prediction/
│   │   │   ├── PredictionPanel.jsx
│   │   │   ├── PredictionChart.jsx
│   │   │   ├── RiskAssessment.jsx
│   │   │   └── ForecastTimeline.jsx
│   │   │
│   │   ├── filters/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── RegionFilter.jsx
│   │   │   ├── TypeFilter.jsx
│   │   │   └── AdvancedFilters.jsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── StatisticsCharts.jsx
│   │   │   ├── ComparisonView.jsx
│   │   │   └── TrendAnalysis.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── RequireAuth.jsx
│   │   │
│   │   └── common/
│   │       ├── Loader.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── Modal.jsx
│   │       └── Tooltip.jsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── citizen/
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── CitizenMap.jsx
│   │   │   ├── WaterBodiesPage.jsx
│   │   │   ├── FacilitiesPage.jsx
│   │   │   ├── StatisticsPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── HelpPage.jsx
│   │   │
│   │   ├── emergency/
│   │   │   ├── EmergencyDashboard.jsx (Control Center)
│   │   │   ├── EmergencyMap.jsx
│   │   │   ├── WaterBodiesManagement.jsx
│   │   │   ├── FacilitiesManagement.jsx
│   │   │   ├── PredictionsPage.jsx
│   │   │   ├── CriticalZonesPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── NotificationsManagement.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx (Overview)
│   │       ├── UsersManagement.jsx
│   │       ├── WaterBodiesManagement.jsx
│   │       ├── FacilitiesManagement.jsx
│   │       ├── AdminMap.jsx
│   │       ├── AISettings.jsx
│   │       ├── SensorsManagement.jsx
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
│   │   ├── useMapControls.js
│   │   └── useFilters.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── waterBodyService.js
│   │   ├── hydroFacilityService.js
│   │   ├── predictionService.js
│   │   ├── analyticsService.js
│   │   └── geoService.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── mapUtils.js
│   │   ├── dataFormatters.js
│   │   └── validators.js
│   │
│   ├── data/
│   │   ├── regions.js
│   │   ├── waterBodyTypes.js
│   │   ├── facilityTypes.js
│   │   └── mapLayers.js
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

## 🎨 Дизайн-система

### Цветовая палитра

```javascript
// Цвета по ролям
ROLE_COLORS = {
  citizen: {
    primary: '#3B82F6',      // Синий
    secondary: '#60A5FA',
    dark: '#1E3A8A',
    light: '#DBEAFE',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
  },
  emergency: {
    primary: '#EF4444',      // Красный
    secondary: '#F97316',
    dark: '#991B1B',
    light: '#FEE2E2',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
  },
  admin: {
    primary: '#8B5CF6',      // Фиолетовый
    secondary: '#A78BFA',
    dark: '#6D28D9',
    light: '#EDE9FE',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
  }
};

// Статусные цвета
STATUS_COLORS = {
  safe: '#10B981',           // Зеленый - безопасно
  warning: '#F59E0B',        // Желтый - предупреждение
  danger: '#EF4444',         // Красный - опасно
  critical: '#DC2626',       // Темно-красный - критично
  info: '#06B6D4'            // Бирюзовый - информация
};
```

### Брейкпоинты (Tailwind CSS)

```javascript
BREAKPOINTS = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop (переключение навигации)
  xl: '1280px',   // Large desktop
  '2xl': '1536px' // Extra large
};
```

### Адаптивная навигация

**Desktop (≥ 1024px)**:
- DesktopSidebar слева (280px ширина, фиксированная)
- Основной контент справа (flex-1)
- BottomNavigation скрыта

**Mobile/Tablet (< 1024px)**:
- DesktopSidebar скрыта
- BottomNavigation внизу (70px высота, фиксированная)
- Основной контент занимает всю ширину

---

## 📊 Структуры данных

### Водоём (Water Body)

```javascript
{
  id: string,
  name: string,
  name_kz: string,
  type: 'lake' | 'river' | 'reservoir' | 'canal',
  region: string,
  coordinates: { lat: number, lng: number },
  area: number,              // км²
  volume: number,            // км³
  maxDepth: number,          // метров
  avgDepth: number,          // метров
  waterQuality: {
    status: 'excellent' | 'good' | 'moderate' | 'poor' | 'bad',
    pH: number,
    turbidity: number,
    dissolvedOxygen: number,
    lastUpdated: string
  },
  currentLevel: {
    value: number,           // метров
    percentage: number,      // от нормы
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
  predictions: object
}
```

### Гидротехническое сооружение (Hydro Facility)

```javascript
{
  id: string,
  name: string,
  name_kz: string,
  type: 'hydropower' | 'dam' | 'canal' | 'lock' | 'reservoir' | 'pumping_station',
  region: string,
  coordinates: { lat: number, lng: number },
  status: 'operational' | 'maintenance' | 'emergency' | 'decommissioned',
  commissionedYear: number,
  operator: string,
  technicalSpecs: {
    capacity: number,        // МВт для ГЭС
    height: number,          // метров для плотин
    length: number,          // метров
    reservoirVolume: number, // км³
    turbines: number,
    annualGeneration: number // ГВт·ч/год
  },
  condition: {
    overallStatus: 'excellent' | 'good' | 'satisfactory' | 'poor' | 'critical',
    structuralIntegrity: number,  // %
    equipmentCondition: number,   // %
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
  predictions: object
}
```

### AI Предикт (Prediction)

```javascript
{
  id: string,
  targetId: string,
  targetType: 'waterbody' | 'facility',
  predictionType: 'water_level' | 'quality' | 'risk' | 'maintenance',
  generatedAt: string,
  forecastPeriod: {
    start: string,
    end: string
  },
  confidence: number,       // %
  model: string,
  predictions: [
    {
      date: string,
      value: number,
      confidence: number,
      trend: string,
      riskLevel: string
    }
  ],
  factors: {
    precipitation: string,
    snowmelt: string,
    upstreamDischarge: string,
    temperature: string
  },
  recommendations: string[],
  alerts: array
}
```

---

## 🔐 Аутентификация и роутинг

### AuthContext

```javascript
{
  user: object | null,
  userRole: 'citizen' | 'emergency' | 'admin' | null,
  isAuthenticated: boolean,
  loading: boolean,
  login: (userData, role) => void,
  logout: () => void
}
```

### Защищённые маршруты

```javascript
// Публичные
/ - HomePage
/login - LoginPage
/register - RegisterPage

// Citizen routes (требует role: 'citizen')
/citizen/dashboard
/citizen/map
/citizen/waterbodies
/citizen/waterbodies/:id
/citizen/facilities
/citizen/facilities/:id
/citizen/statistics
/citizen/notifications
/citizen/profile
/citizen/help

// Emergency routes (требует role: 'emergency')
/emergency/control-center
/emergency/map
/emergency/waterbodies
/emergency/waterbodies/:id
/emergency/facilities
/emergency/facilities/:id
/emergency/predictions
/emergency/critical-zones
/emergency/analytics
/emergency/notifications
/emergency/reports
/emergency/profile

// Admin routes (требует role: 'admin')
/admin/overview
/admin/users
/admin/users/:id
/admin/waterbodies
/admin/waterbodies/new
/admin/waterbodies/:id/edit
/admin/facilities
/admin/facilities/new
/admin/facilities/:id/edit
/admin/map
/admin/ai-settings
/admin/sensors
/admin/notifications
/admin/logs
/admin/analytics
/admin/settings
/admin/profile
```

---

## 🗺️ Картографические компоненты

### Маркеры на карте

**WaterBodyMarker**:
- Круглая иконка с эмодзи по типу водоёма
- Цвет по статусу качества воды
- Tooltip с базовой информацией
- Popup с кратким описанием и кнопкой "Подробнее"
- Пульсирующий индикатор при наличии алертов

**HydroFacilityMarker**:
- Квадратная иконка с эмодзи по типу ГТС
- Цвет по операционному статусу
- Tooltip с базовой информацией
- Popup с техническими характеристиками
- Красный индикатор при высоком уровне риска

### Слои карты

1. **Базовый слой**: OpenStreetMap tiles
2. **Водоёмы**: Маркеры всех водоёмов
3. **ГТС**: Маркеры всех сооружений
4. **Границы регионов**: Полигоны областей
5. **Реки**: Линии основных рек (опционально)
6. **Heatmap**: Тепловая карта рисков (опционально)

### Легенда карты

- 🌊 Озеро
- 〰️ Река
- 💧 Водохранилище
- ⚡ ГЭС
- 🏗️ Плотина
- 〰️ Канал

Цветовые индикаторы:
- 🟢 Отлично/Безопасно
- 🔵 Хорошо/Нормально
- 🟡 Умеренно/Внимание
- 🟠 Плохо/Повышенный риск
- 🔴 Критично/Высокий риск

---

## 🔧 API Endpoints (будущий backend)

### Аутентификация
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/profile
```

### Водоёмы
```
GET    /api/waterbodies
GET    /api/waterbodies/:id
POST   /api/waterbodies (admin only)
PUT    /api/waterbodies/:id (admin only)
DELETE /api/waterbodies/:id (admin only)
GET    /api/waterbodies/:id/history
GET    /api/waterbodies/region/:region
```

### ГТС
```
GET    /api/facilities
GET    /api/facilities/:id
POST   /api/facilities (admin only)
PUT    /api/facilities/:id (admin only)
DELETE /api/facilities/:id (admin only)
GET    /api/facilities/:id/history
GET    /api/facilities/region/:region
```

### Прогнозирование
```
GET  /api/predictions/:targetId
POST /api/predictions/analyze (emergency/admin)
GET  /api/predictions/region/:region
```

### Аналитика
```
GET /api/analytics/overview
GET /api/analytics/waterbodies
GET /api/analytics/facilities
GET /api/analytics/trends
```

### Пользователи (admin only)
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

---

## 📦 Установленные зависимости

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x.x",
    "react-scripts": "5.0.1",
    "axios": "^1.x.x",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.x.x",
    "lucide-react": "^0.x.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "postcss": "^8.x.x",
    "autoprefixer": "^10.x.x"
  }
}
```

---

## 🚀 Текущий статус проекта

### ✅ Реализовано:
- Базовая структура React приложения
- Tailwind CSS настроен
- AuthContext с системой ролей
- Роутинг с защищёнными маршрутами
- HomePage с выбором роли
- LoginPage с переключением ролей
- Базовые дашборды для всех трёх ролей
- RequireAuth компонент для защиты маршрутов
- Loader компонент

### 🔄 В процессе:
- Создание компонентов навигации (Desktop Sidebar и Bottom Nav)
- Интеграция Leaflet карты
- Компоненты для отображения водоёмов и ГТС

### 📝 Запланировано:
- Все остальные компоненты из структуры
- API интеграция
- Фильтры и поиск
- AI прогнозирование
- Аналитика и отчёты
- Админ панель для управления

---

## 🎯 Следующие шаги разработки

1. **Навигация**: Создать компоненты Desktop Sidebar и Bottom Navigation для всех ролей
2. **Карта**: Интегрировать Leaflet и создать MainMap компонент
3. **Маркеры**: Создать компоненты для отображения водоёмов и ГТС на карте
4. **Детальные страницы**: Страницы с подробной информацией об объектах
5. **API сервисы**: Создать service layer для работы с backend
6. **Фильтры**: Компоненты для фильтрации и поиска
7. **Прогнозирование**: Интеграция AI предиктов
8. **Аналитика**: Графики и визуализация данных
9. **Админка**: CRUD операции для управления данными

---

## 💡 Важные особенности проекта

### Адаптивный дизайн
- **Desktop**: Sidebar слева + основной контент
- **Mobile**: Bottom navigation + основной контент
- Переключение происходит на брейкпоинте `lg` (1024px)

### Ролевая система
- Три типа пользователей с разными правами доступа
- Каждая роль имеет свою цветовую тему
- Разные наборы функций и страниц для каждой роли

### Интерактивная карта
- Clickable маркеры для водоёмов и ГТС
- Разные слои (водоёмы, сооружения, границы)
- Легенда и контролы слоёв
- Адаптивная под мобильные устройства

### AI прогнозирование
- Предикты уровня воды
- Оценка рисков
- Рекомендации по действиям
- Визуализация трендов

---

Это полная структура фронтенд части проекта Гидроатлас Казахстана! 🌊
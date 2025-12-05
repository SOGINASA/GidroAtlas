# GidroAtlas

Веб-приложение для мониторинга гидрологических объектов с системой ролей (обычные пользователи, МЧС, администраторы).

## Описание проекта

GidroAtlas - это полнофункциональное приложение на базе React (frontend) и Flask (backend), предназначенное для отслеживания и управления гидрологическими объектами с интерактивной картой.

### Основные возможности

- Интерактивная карта с гидрологическими объектами
- Система аутентификации с JWT
- Разделение ролей: пользователь, администратор, МЧС
- Адаптивный дизайн для мобильных и десктопных устройств
- Docker-контейнеризация для простого развертывания

## Технологический стек

### Backend
- Python 3.x
- Flask
- SQLAlchemy (SQLite)
- Flask-JWT-Extended
- Flask-CORS
- Flask-Migrate

### Frontend
- React 19.2
- React Router
- Leaflet (интерактивные карты)
- Axios
- Tailwind CSS
- Lucide React (иконки)

## Требования

### Для запуска с Docker (рекомендуется)
- Docker
- Docker Compose

### Для запуска без Docker
- Python 3.8+
- Node.js 16+
- npm или yarn

## Установка и запуск

### Вариант 1: Запуск с Docker (рекомендуется)

1. Клонируйте репозиторий:
```bash
git clone <url-репозитория>
cd GidroAtlas
```

2. Настройте переменные окружения в файле [backend/.env](backend/.env):
```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
FLASK_ENV=production
```

3. Запустите Docker Compose:
```bash
docker-compose up --build
```

4. Приложение будет доступно по адресам:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5252/api

### Вариант 2: Запуск без Docker

#### Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Создайте виртуальное окружение:
```bash
python -m venv venv
```

3. Активируйте виртуальное окружение:
- Windows:
```bash
venv\Scripts\activate
```
- Linux/macOS:
```bash
source venv/bin/activate
```

4. Установите зависимости:
```bash
pip install -r requirements.txt
```

5. Создайте файл [.env](backend/.env) с необходимыми переменными:
```env
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=dev-jwt-secret
FLASK_ENV=development
```

6. Запустите сервер:
```bash
python app.py
```

Backend будет доступен на http://localhost:5252

#### Frontend

1. Откройте новый терминал и перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите dev-сервер:
```bash
npm start
```

Frontend будет доступен на http://localhost:3000

## Тестовые пользователи

После первого запуска автоматически создаются следующие тестовые пользователи:

| Email | Пароль | Роль |
|-------|--------|------|
| user1@example.com | password123 | Пользователь |
| user2@example.com | password123 | Пользователь |
| user3@example.com | password123 | Пользователь |
| admin@example.com | admin123 | Администратор |
| mchs@example.com | mchs123 | МЧС |

## Структура проекта

```
GidroAtlas/
├── backend/                  # Flask API
│   ├── routes/              # API маршруты
│   ├── database/            # SQLite база данных
│   ├── app.py              # Главный файл приложения
│   ├── models.py           # Модели базы данных
│   ├── config.py           # Конфигурация
│   ├── seed_data.py        # Начальные данные
│   ├── requirements.txt    # Python зависимости
│   └── Dockerfile          # Docker образ backend
│
├── frontend/                # React приложение
│   ├── public/             # Статические файлы
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── contexts/      # React контексты
│   │   ├── hooks/         # Custom хуки
│   │   ├── data/          # Константы и данные
│   │   └── App.js         # Главный компонент
│   ├── package.json       # Node зависимости
│   └── Dockerfile         # Docker образ frontend
│
└── docker-compose.yml     # Docker Compose конфигурация
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Получить информацию о текущем пользователе
- `POST /api/auth/logout` - Выход из системы

## Роли пользователей

### User (Обычный пользователь)
- Просмотр карты и объектов
- Доступ к личному кабинету
- Маршрут: `/citizen/dashboard`

### MCHS (МЧС)
- Расширенный доступ к данным
- Центр управления чрезвычайными ситуациями
- Маршрут: `/emergency/control-center`

### Admin (Администратор)
- Полный доступ ко всем функциям
- Управление пользователями и системой
- Маршрут: `/admin/overview`

## Разработка

### Backend

Для создания миграций базы данных:
```bash
flask db init
flask db migrate -m "описание изменений"
flask db upgrade
```

Для создания администратора:
```bash
flask create-admin
```

Для инициализации базы данных с тестовыми данными:
```bash
flask init-db
```

### Frontend

Запуск тестов:
```bash
npm test
```

Сборка production версии:
```bash
npm run build
```

## Docker команды

Запуск контейнеров:
```bash
docker-compose up
```

Пересборка контейнеров:
```bash
docker-compose up --build
```

Остановка контейнеров:
```bash
docker-compose down
```

Просмотр логов:
```bash
docker-compose logs -f
```

## Порты

- **3000** - Frontend (React)
- **5252** - Backend (Flask API)

## Конфигурация

### Backend переменные окружения

Основные переменные в [backend/.env](backend/.env):

```env
# Flask
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
FLASK_ENV=development|production

# База данных
DATABASE_URL=sqlite:///database/database.db

# Email (опционально)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-password
```

### Frontend переменные окружения

В Docker Compose API URL настраивается автоматически.

Для локальной разработки создайте `.env` в папке frontend:
```env
REACT_APP_API_URL=http://localhost:5252/api
```

## Решение проблем

### Backend не запускается
- Проверьте, что порт 5252 свободен
- Убедитесь, что установлены все зависимости из requirements.txt
- Проверьте наличие папки database/

### Frontend не подключается к API
- Убедитесь, что backend запущен
- Проверьте CORS настройки в [backend/app.py](backend/app.py)
- При использовании Docker проверьте сетевые настройки

### База данных не создается
- Убедитесь в наличии прав на запись в папку database/
- Удалите старую базу и перезапустите приложение

## Поддержка и контакты

Для вопросов и предложений создавайте issue в репозитории проекта.

## Лицензия

Проект разработан для образовательных целей.

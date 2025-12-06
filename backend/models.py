from flask import json
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date

db = SQLAlchemy()


# models.py (фрагмент)
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    full_name = db.Column(db.String(100))
    user_type = db.Column(db.String(20), default='user') # user, expert, emergency, admin
    address = db.Column(db.String(255))
    phone = db.Column(db.String(20))

    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # токены восстановления/верификации — уже были
    reset_token = db.Column(db.String(100), unique=True)
    reset_token_expires = db.Column(db.DateTime)
    verification_token = db.Column(db.String(100), unique=True)


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'fullName': self.full_name,  # Дублируем для camelCase
            'user_type': self.user_type,
            'role': self.user_type,  # role совпадает с user_type
            'is_verified': self.is_verified,
            'phone': self.phone,
            'address': self.address,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }
        if include_sensitive:
            data['is_active'] = self.is_active
        return data
    
class Sensor(db.Model):
    """Модель датчика мониторинга уровня воды"""
    __tablename__ = 'sensors'

    # Идентификация
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(255), nullable=False)

    # Геолокация
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    # Текущие показания
    water_level = db.Column(db.Float, default=0.0)
    temperature = db.Column(db.Float, nullable=True)

    # Статус датчика
    status = db.Column(db.String(20), default='active')  # active, inactive, maintenance, error
    is_active = db.Column(db.Boolean, default=True)

    # Временные метки
    last_update = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Дополнительная информация
    description = db.Column(db.Text, nullable=True)

    # Связи
    readings = db.relationship('SensorReading', backref='sensor', lazy='dynamic',
                               cascade='all, delete-orphan', order_by='SensorReading.timestamp.desc()')

    def get_danger_level(self):
        """Вычисляет уровень опасности на основе water_level"""
        if self.water_level >= 6.0:
            return 'critical'
        elif self.water_level >= 5.0:
            return 'danger'
        elif self.water_level >= 4.0:
            return 'attention'
        else:
            return 'safe'

    def to_dict(self):
        """Преобразует модель в словарь (формат фронтенда)"""
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'coordinates': {
                'lat': self.latitude,
                'lng': self.longitude
            },
            'waterLevel': self.water_level,
            'temperature': self.temperature,
            'status': self.status,
            'lastUpdate': self.last_update.isoformat() if self.last_update else None,
            'dangerLevel': self.get_danger_level(),
            'description': self.description,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<Sensor {self.id}: {self.name}>'


class SensorReading(db.Model):
    """Модель истории показаний датчика"""
    __tablename__ = 'sensor_readings'

    id = db.Column(db.Integer, primary_key=True)
    sensor_id = db.Column(db.String(50), db.ForeignKey('sensors.id'), nullable=False, index=True)

    # Показания
    water_level = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=True)

    # Временная метка
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Дополнительные данные (для будущего расширения)
    extra_data = db.Column(db.JSON, nullable=True)

    def to_dict(self):
        """Преобразует показание в словарь"""
        return {
            'id': self.id,
            'sensorId': self.sensor_id,
            'waterLevel': self.water_level,
            'temperature': self.temperature,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'extraData': self.extra_data
        }

    def __repr__(self):
        return f'<SensorReading sensor={self.sensor_id} level={self.water_level}m at {self.timestamp}>'


class RiskZone(db.Model):
    """Модель зоны риска затопления"""
    __tablename__ = 'risk_zones'

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(200), nullable=False)

    type = db.Column(db.String(20), nullable=False)  # low, medium, high

    # Читаемое местоположение/регион для UI
    location = db.Column(db.String(255), nullable=True)
    region = db.Column(db.String(150), nullable=True)

    # Координаты полигона (храним как JSON)
    coordinates = db.Column(db.JSON, nullable=False)

    # Текущие вычисляемые/сохранённые показатели, необходимые для UI
    water_level = db.Column(db.Float, default=0.0)
    threshold = db.Column(db.Float, default=0.0)
    trend = db.Column(db.String(20), default='stable')  # rising, stable, falling

    # Информация о населении
    residents_count = db.Column(db.Integer, default=0)
    affected_population = db.Column(db.Integer, default=0)
    evacuated_count = db.Column(db.Integer, default=0)

    # Связанные датчики (опционально)
    related_sensor_ids = db.Column(db.JSON, nullable=True)

    # Статус зоны (monitoring, warning, critical)
    status = db.Column(db.String(20), default='monitoring')

    # Метаданные
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Преобразует зону в словарь (формат фронтенда)"""
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'location': self.location or self.name,
            'region': self.region,
            'coordinates': self.coordinates,
            'waterLevel': self.water_level,
            'threshold': self.threshold,
            'trend': self.trend,
            'affectedPopulation': self.affected_population or self.residents_count,
            'residentsCount': self.residents_count,
            'evacuated': self.evacuated_count,
            'sensors': self.related_sensor_ids,
            'status': self.status,
            'description': self.description
        }

    def __repr__(self):
        return f'<RiskZone {self.id}: {self.name} ({self.type})>'


class Notification(db.Model):
    """Модель уведомлений для пользователей"""
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)

    # Тип уведомления
    type = db.Column(db.String(20), nullable=False)  # info, warning, danger, evacuation, sensor_update

    # Контент
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)

    # Связанные сущности (опционально)
    sensor_id = db.Column(db.String(50), db.ForeignKey('sensors.id'), nullable=True)
    evacuation_id = db.Column(db.Integer, db.ForeignKey('evacuations.id'), nullable=True)

    # Статус
    is_read = db.Column(db.Boolean, default=False)
    is_important = db.Column(db.Boolean, default=False)

    # Временные метки
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    read_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        """Преобразует уведомление в словарь"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'sensor_id': self.sensor_id,
            'evacuation_id': self.evacuation_id,
            'is_read': self.is_read,
            'read': self.is_read,  # Дублируем для совместимости с фронтендом
            'is_important': self.is_important,
            'priority': 'critical' if self.is_important else 'medium',  # Для совместимости
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'timestamp': self.created_at.isoformat() if self.created_at else None,  # Для NotificationItem
            'read_at': self.read_at.isoformat() if self.read_at else None
        }

    def __repr__(self):
        return f'<Notification {self.id}: {self.type} for user={self.user_id}>'


class Evacuation(db.Model):
    """Модель эвакуации жителей"""
    __tablename__ = 'evacuations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)

    # Статус эвакуации
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed, cancelled

    # Детали эвакуации
    evacuation_point = db.Column(db.String(255), nullable=True)
    assigned_team = db.Column(db.String(100), nullable=True)
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, critical

    # Информация о жителе
    family_members = db.Column(db.Integer, default=1)
    has_disabilities = db.Column(db.Boolean, default=False)
    has_pets = db.Column(db.Boolean, default=False)
    special_needs = db.Column(db.Text, nullable=True)

    # Заметки и комментарии
    notes = db.Column(db.Text, nullable=True)

    # Временные метки
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    # Связи
    notifications = db.relationship('Notification', backref='evacuation', lazy='dynamic')

    def to_dict(self):
        """Преобразует эвакуацию в словарь"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'status': self.status,
            'evacuationPoint': self.evacuation_point,
            'assignedTeam': self.assigned_team,
            'priority': self.priority,
            'familyMembers': self.family_members,
            'hasDisabilities': self.has_disabilities,
            'hasPets': self.has_pets,
            'specialNeeds': self.special_needs,
            'notes': self.notes,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
            'completedAt': self.completed_at.isoformat() if self.completed_at else None
        }

    def __repr__(self):
        return f'<Evacuation {self.id}: user={self.user_id} status={self.status}>'

class HydroFacility(db.Model):
    """Модель гидротехнического сооружения (ГТС) — соответствует UI страницы FacilitiesManagement
    Поля отражают информацию в интерфейсе: название, тип (ГЭС/Плотина/Водохранилище), регион,
    мощность/ёмкость, год постройки, статус, техническое состояние, риск-скор, даты инспекций,
    количество проблем/алертов и доп.метаданные.
    """
    __tablename__ = 'hydro_facilities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, index=True)
    type = db.Column(db.String(50), nullable=False)  # ГЭС, Плотина, Водохранилище и т.п.
    region = db.Column(db.String(150), nullable=True, index=True)

    # Ёмкость / мощность (МВт или m3) — хранится числом, единицы описаны в документации/фронте
    capacity = db.Column(db.Float, default=0.0)
    year_built = db.Column(db.Integer, nullable=True)

    # Связь с водным объектом
    water_body = db.Column(db.String(255), nullable=True)
    water_body_id = db.Column(db.Integer, db.ForeignKey('water_bodies.id'), nullable=True)

    # Данные для приоритизации
    passport_year = db.Column(db.Integer, nullable=True)  # год паспортизации

    # Статус и состояние
    status = db.Column(db.String(50), default='operational')  # operational, maintenance, emergency
    technical_condition = db.Column(db.Integer, default=1)  # 1..5 (1 = хорошее, 5 = критическое)
    risk_score = db.Column(db.Integer, default=0)  # 0..100
    risk_level = db.Column(db.String(20), default='medium')  # high, medium, low

    # Даты инспекций
    last_inspection = db.Column(db.DateTime, nullable=True)
    next_inspection = db.Column(db.DateTime, nullable=True)

    # Количественные показатели
    issues = db.Column(db.Integer, default=0)
    alerts = db.Column(db.Integer, default=0)

    # Геоданные (опционально) — хранить как JSON или отдельные поля lat/lng
    coordinates = db.Column(db.JSON, nullable=True)

    # Связи/метаданные
    related_sensor_ids = db.Column(db.JSON, nullable=True)  # список id датчиков, связанных с объектом
    description = db.Column(db.Text, nullable=True)

    # Метаданные времени
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def calculate_priority(self):
        """Вычисляет приоритетный балл и уровень на основе технического состояния и возраста паспорта"""
        if not self.passport_year:
            return {'score': 0, 'level': 'low', 'passportAge': 0}

        current_year = datetime.now().year
        passport_age = current_year - self.passport_year

        # Формула: (6 - Состояние) × 3 + Возраст паспорта
        priority_score = (6 - self.technical_condition) * 3 + passport_age

        # Определение уровня приоритета
        if priority_score >= 12:
            priority_level = 'high'
        elif priority_score >= 6:
            priority_level = 'medium'
        else:
            priority_level = 'low'

        return {
            'score': priority_score,
            'level': priority_level,
            'passportAge': passport_age
        }

    def to_dict(self):
        priority = self.calculate_priority()

        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'region': self.region,
            'waterBody': self.water_body,
            'waterBodyId': self.water_body_id,
            'capacity': self.capacity,
            'yearBuilt': self.year_built,
            'passportYear': self.passport_year,
            'status': self.status,
            'technicalCondition': self.technical_condition,
            'riskScore': self.risk_score,
            'riskLevel': self.risk_level,
            'lastInspection': self.last_inspection.isoformat() if self.last_inspection else None,
            'nextInspection': self.next_inspection.isoformat() if self.next_inspection else None,
            'issues': self.issues,
            'alerts': self.alerts,
            'coordinates': self.coordinates,
            'relatedSensors': self.related_sensor_ids,
            'description': self.description,
            # Вычисляемые поля приоритета
            'priority': priority,
            'priorityScore': priority['score'],
            'priorityLevel': priority['level'],
            'passportAge': priority['passportAge'],
            # Метаданные
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f'<HydroFacility {self.id}: {self.name} ({self.type})>'


class WaterBody(db.Model):
    """Модель водного объекта (река, озеро, водохранилище)
    Представляет естественные и искусственные водные объекты для системы мониторинга.
    """
    __tablename__ = 'water_bodies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, index=True)
    type = db.Column(db.String(50), nullable=False)  # Река, Озеро, Водохранилище
    region = db.Column(db.String(150), nullable=True, index=True)

    # Геоданные
    coordinates = db.Column(db.JSON, nullable=True)  # полигон или точка
    length = db.Column(db.Float, nullable=True)  # для рек (км)
    area = db.Column(db.Float, nullable=True)  # для озёр/водохранилищ (км²)

    # Характеристики
    max_depth = db.Column(db.Float, nullable=True)  # максимальная глубина (м)
    average_depth = db.Column(db.Float, nullable=True)  # средняя глубина (м)
    volume = db.Column(db.Float, nullable=True)  # объём воды (м³)

    # Техническое состояние и паспорт
    technical_condition = db.Column(db.Integer, default=3)  # 1..5 (1 = отлично, 5 = критично)
    passport_year = db.Column(db.Integer, nullable=True)  # год паспортизации
    passport_date = db.Column(db.DateTime, nullable=True)  # дата паспортизации

    # Дополнительные характеристики для водоёмов
    water_type = db.Column(db.String(50), nullable=True)  # fresh, salt, mixed
    has_fauna = db.Column(db.Boolean, default=True)  # есть ли биоресурсы

    # Связи
    related_sensor_ids = db.Column(db.JSON, nullable=True)
    related_facility_ids = db.Column(db.JSON, nullable=True)

    description = db.Column(db.Text, nullable=True)

    # Метаданные
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def calculate_priority(self):
        """Вычисляет приоритетный балл (аналогично HydroFacility)"""
        if not self.passport_year:
            return {'score': 0, 'level': 'low', 'passportAge': 0}

        current_year = datetime.now().year
        passport_age = current_year - self.passport_year
        priority_score = (6 - self.technical_condition) * 3 + passport_age

        if priority_score >= 12:
            priority_level = 'high'
        elif priority_score >= 6:
            priority_level = 'medium'
        else:
            priority_level = 'low'

        return {
            'score': priority_score,
            'level': priority_level,
            'passportAge': passport_age
        }

    def to_dict(self):
        priority = self.calculate_priority()

        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'resourceType': self.type,
            'region': self.region,
            'coordinates': self.coordinates,
            'length': self.length,
            'area': self.area,
            'maxDepth': self.max_depth,
            'averageDepth': self.average_depth,
            'volume': self.volume,
            'technicalCondition': self.technical_condition,
            'condition': self.technical_condition,
            'passportYear': self.passport_year,
            'passportDate': self.passport_date.isoformat() if self.passport_date else None,
            'waterType': self.water_type,
            'hasFauna': self.has_fauna,
            'priority': priority,
            'relatedSensors': self.related_sensor_ids,
            'relatedFacilities': self.related_facility_ids,
            'description': self.description,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f'<WaterBody {self.id}: {self.name} ({self.type})>'


class Report(db.Model):
    """Модель отчёта МЧС
    Представляет различные типы отчётов: еженедельные, месячные, по инцидентам, по эвакуациям.
    """
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    period = db.Column(db.String(255), nullable=False)  # Период отчёта (текстовое представление)

    # Даты периода (для фильтрации и сортировки)
    period_start = db.Column(db.Date, nullable=True)
    period_end = db.Column(db.Date, nullable=True)

    # Тип отчёта
    type = db.Column(db.String(50), nullable=False)  # weekly, monthly, incident, evacuation

    # Автор отчёта
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    author_name = db.Column(db.String(100), nullable=False)  # Кэшируем имя для быстрого доступа

    # Статус отчёта
    status = db.Column(db.String(20), default='draft')  # draft, completed

    # Статистика (JSON объект)
    stats = db.Column(db.JSON, nullable=True)  # {incidents: int, critical: int, evacuations: int}

    # Содержание отчёта
    content = db.Column(db.Text, nullable=True)  # Основной текст отчёта

    # Файл отчёта (если есть)
    file_path = db.Column(db.String(500), nullable=True)  # Путь к файлу
    file_size = db.Column(db.String(20), nullable=True)  # Размер файла (текст, напр. "2.4 MB")

    # Связанные сущности
    related_sensor_ids = db.Column(db.JSON, nullable=True)
    related_evacuation_ids = db.Column(db.JSON, nullable=True)
    related_zone_ids = db.Column(db.JSON, nullable=True)

    # Метаданные
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'period': self.period,
            'periodStart': self.period_start.isoformat() if self.period_start else None,
            'periodEnd': self.period_end.isoformat() if self.period_end else None,
            'type': self.type,
            'author': self.author_name,
            'authorId': self.author_id,
            'status': self.status,
            'stats': self.stats or {'incidents': 0, 'critical': 0, 'evacuations': 0},
            'content': self.content,
            'filePath': self.file_path,
            'fileSize': self.file_size,
            'relatedSensors': self.related_sensor_ids,
            'relatedEvacuations': self.related_evacuation_ids,
            'relatedZones': self.related_zone_ids,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
            'completedAt': self.completed_at.isoformat() if self.completed_at else None,
        }

    def __repr__(self):
        return f'<Report {self.id}: {self.title} ({self.type})>'


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
    user_type = db.Column(db.String(20), default='user') # user, admin, mchs
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
        # Мапим user_type к role для фронтенда
        role_mapping = {
            'user': 'resident',
            'mchs': 'emergency',
            'admin': 'admin'
        }
        role = role_mapping.get(self.user_type, self.user_type)

        data = {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'fullName': self.full_name,  # Дублируем для camelCase
            'user_type': self.user_type,
            'role': role,  # Добавляем для совместимости с фронтендом
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

    # Координаты полигона (храним как JSON)
    coordinates = db.Column(db.JSON, nullable=False)

    # Информация о населении
    residents_count = db.Column(db.Integer, default=0)

    # Связанные датчики (опционально)
    related_sensor_ids = db.Column(db.JSON, nullable=True)

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
            'coordinates': self.coordinates,
            'residentsCount': self.residents_count,
            'relatedSensors': self.related_sensor_ids,
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


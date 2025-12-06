from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models import db, Sensor, SensorReading, RiskZone, User
from datetime import datetime, timedelta
from sqlalchemy import desc, func

sensor_bp = Blueprint('sensor', __name__)


def validate_sensor_data(data, partial=False):
    """Валидация данных датчика"""
    errors = []

    if not partial:
        required = ['name', 'location', 'latitude', 'longitude']
        for field in required:
            if field not in data:
                errors.append(f'Поле {field} обязательно')

    # Валидация координат
    if 'latitude' in data:
        if not isinstance(data['latitude'], (int, float)) or not (-90 <= data['latitude'] <= 90):
            errors.append('Некорректная широта')

    if 'longitude' in data:
        if not isinstance(data['longitude'], (int, float)) or not (-180 <= data['longitude'] <= 180):
            errors.append('Некорректная долгота')

    # Валидация уровня воды
    if 'water_level' in data:
        if not isinstance(data['water_level'], (int, float)) or data['water_level'] < 0:
            errors.append('Некорректный уровень воды')

    # Валидация статуса
    if 'status' in data:
        valid_statuses = ['active', 'inactive', 'maintenance', 'error']
        if data['status'] not in valid_statuses:
            errors.append(f'Статус должен быть одним из: {", ".join(valid_statuses)}')

    return errors


# ============================================
# ЭНДПОИНТЫ ДЛЯ ДАТЧИКОВ
# ============================================

@sensor_bp.route('', methods=['GET'])
def get_all_sensors():
    """
    Получить список всех датчиков
    Доступ: PUBLIC (без авторизации)
    """
    try:
        query = Sensor.query.filter_by(is_active=True)

        # Фильтр по статусу
        status = request.args.get('status')
        if status:
            query = query.filter_by(status=status)

        sensors = query.all()

        # Фильтр по уровню опасности (после загрузки, т.к. это вычисляемое поле)
        danger_level = request.args.get('danger_level')
        if danger_level:
            sensors = [s for s in sensors if s.get_danger_level() == danger_level]

        return jsonify({
            'success': True,
            'data': [sensor.to_dict() for sensor in sensors],
            'count': len(sensors)
        }), 200

    except Exception as e:
        print(f"Ошибка получения датчиков: {e}")
        return jsonify({'error': 'Ошибка при получении датчиков'}), 500


@sensor_bp.route('/<sensor_id>', methods=['GET'])
def get_sensor_by_id(sensor_id):
    """
    Получить датчик по ID
    Доступ: PUBLIC
    """
    try:
        sensor = Sensor.query.filter_by(id=sensor_id, is_active=True).first()

        if not sensor:
            return jsonify({'error': 'Датчик не найден'}), 404

        return jsonify({
            'success': True,
            'data': sensor.to_dict()
        }), 200

    except Exception as e:
        print(f"Ошибка получения датчика: {e}")
        return jsonify({'error': 'Ошибка при получении датчика'}), 500


@sensor_bp.route('/critical', methods=['GET'])
def get_critical_sensors():
    """
    Получить датчики с критическим или опасным уровнем воды
    Доступ: PUBLIC
    """
    try:
        # Получаем все активные датчики
        sensors = Sensor.query.filter_by(is_active=True, status='active').all()

        # Фильтруем по уровню опасности
        critical = [s for s in sensors if s.get_danger_level() in ['danger', 'critical']]

        return jsonify({
            'success': True,
            'data': [sensor.to_dict() for sensor in critical],
            'count': len(critical)
        }), 200

    except Exception as e:
        print(f"Ошибка получения критических датчиков: {e}")
        return jsonify({'error': 'Ошибка при получении критических датчиков'}), 500


@sensor_bp.route('/average', methods=['GET'])
def get_average_water_level():
    """
    Получить средний уровень воды по всем датчикам
    Доступ: PUBLIC
    """
    try:
        # Используем SQLAlchemy для вычисления среднего
        result = db.session.query(
            func.avg(Sensor.water_level).label('average'),
            func.count(Sensor.id).label('total')
        ).filter_by(is_active=True, status='active').first()

        average = round(float(result.average), 2) if result.average else 0.0
        total = result.total or 0

        return jsonify({
            'success': True,
            'data': {
                'average': average,
                'total': total
            }
        }), 200

    except Exception as e:
        print(f"Ошибка получения среднего уровня: {e}")
        return jsonify({'error': 'Ошибка при получении среднего уровня'}), 500


@sensor_bp.route('', methods=['POST'])
@jwt_required()
def create_sensor():
    """
    Создать новый датчик
    Доступ: ADMIN, MCHS
    """
    try:
        # Проверка прав
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'mchs']:
            return jsonify({'error': 'Требуются права администратора'}), 403

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        # Валидация
        errors = validate_sensor_data(data, partial=False)
        if errors:
            return jsonify({'error': 'Ошибка валидации', 'details': errors}), 400

        # Проверка уникальности ID
        if 'id' in data and Sensor.query.filter_by(id=data['id']).first():
            return jsonify({'error': 'Датчик с таким ID уже существует'}), 400

        # Создание датчика
        sensor = Sensor(
            id=data.get('id', f"sensor-{int(datetime.utcnow().timestamp())}"),
            name=data['name'],
            location=data['location'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            water_level=data.get('water_level', 0.0),
            temperature=data.get('temperature'),
            status=data.get('status', 'active'),
            description=data.get('description')
        )

        db.session.add(sensor)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Датчик успешно создан',
            'data': sensor.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка создания датчика: {e}")
        return jsonify({'error': 'Ошибка при создании датчика'}), 500


@sensor_bp.route('/<sensor_id>', methods=['PUT'])
@jwt_required()
def update_sensor(sensor_id):
    """
    Обновить датчик
    Доступ: ADMIN, MCHS
    """
    try:
        # Проверка прав
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'mchs']:
            return jsonify({'error': 'Требуются права администратора'}), 403

        sensor = Sensor.query.filter_by(id=sensor_id).first()
        if not sensor:
            return jsonify({'error': 'Датчик не найден'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        # Валидация
        errors = validate_sensor_data(data, partial=True)
        if errors:
            return jsonify({'error': 'Ошибка валидации', 'details': errors}), 400

        # Обновление полей
        if 'name' in data:
            sensor.name = data['name']
        if 'location' in data:
            sensor.location = data['location']
        if 'latitude' in data:
            sensor.latitude = data['latitude']
        if 'longitude' in data:
            sensor.longitude = data['longitude']
        if 'water_level' in data:
            sensor.water_level = data['water_level']
            sensor.last_update = datetime.utcnow()
        if 'temperature' in data:
            sensor.temperature = data['temperature']
        if 'status' in data:
            sensor.status = data['status']
        if 'description' in data:
            sensor.description = data['description']
        if 'is_active' in data:
            sensor.is_active = data['is_active']

        sensor.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Датчик обновлен',
            'data': sensor.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка обновления датчика: {e}")
        return jsonify({'error': 'Ошибка при обновлении датчика'}), 500


@sensor_bp.route('/<sensor_id>', methods=['DELETE'])
@jwt_required()
def delete_sensor(sensor_id):
    """
    Удалить датчик (soft delete - меняем is_active на False)
    Доступ: ADMIN
    """
    try:
        # Проверка прав (только админ)
        claims = get_jwt()
        if claims.get('user_type') != 'admin':
            return jsonify({'error': 'Требуются права администратора'}), 403

        sensor = Sensor.query.filter_by(id=sensor_id).first()
        if not sensor:
            return jsonify({'error': 'Датчик не найден'}), 404

        # Soft delete
        sensor.is_active = False
        sensor.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Датчик удален'
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка удаления датчика: {e}")
        return jsonify({'error': 'Ошибка при удалении датчика'}), 500


# ============================================
# ЭНДПОИНТЫ ДЛЯ ПОКАЗАНИЙ (ИСТОРИЯ)
# ============================================

@sensor_bp.route('/<sensor_id>/readings', methods=['GET'])
def get_sensor_readings(sensor_id):
    """
    Получить историю показаний датчика
    Доступ: PUBLIC

    Query параметры:
    - hours: количество часов истории (по умолчанию 24)
    - limit: максимальное количество записей (по умолчанию 100)
    """
    try:
        sensor = Sensor.query.filter_by(id=sensor_id, is_active=True).first()
        if not sensor:
            return jsonify({'error': 'Датчик не найден'}), 404

        # Параметры запроса
        hours = int(request.args.get('hours', 24))
        limit = int(request.args.get('limit', 100))

        # Вычисляем временную границу
        time_threshold = datetime.utcnow() - timedelta(hours=hours)

        # Получаем показания
        readings = SensorReading.query.filter(
            SensorReading.sensor_id == sensor_id,
            SensorReading.timestamp >= time_threshold
        ).order_by(SensorReading.timestamp.asc()).limit(limit).all()

        return jsonify({
            'success': True,
            'data': [reading.to_dict() for reading in readings],
            'count': len(readings),
            'sensorId': sensor_id,
            'hours': hours
        }), 200

    except ValueError:
        return jsonify({'error': 'Некорректные параметры запроса'}), 400
    except Exception as e:
        print(f"Ошибка получения истории: {e}")
        return jsonify({'error': 'Ошибка при получении истории показаний'}), 500


@sensor_bp.route('/<sensor_id>/readings', methods=['POST'])
@jwt_required()
def add_sensor_reading(sensor_id):
    """
    Добавить новое показание датчика
    Доступ: ADMIN, MCHS

    Автоматически обновляет текущие показания в модели Sensor
    """
    try:
        # Проверка прав
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'mchs']:
            return jsonify({'error': 'Требуются права администратора'}), 403

        sensor = Sensor.query.filter_by(id=sensor_id, is_active=True).first()
        if not sensor:
            return jsonify({'error': 'Датчик не найден'}), 404

        data = request.get_json()
        if not data or 'water_level' not in data:
            return jsonify({'error': 'Уровень воды обязателен'}), 400

        # Валидация
        if not isinstance(data['water_level'], (int, float)) or data['water_level'] < 0:
            return jsonify({'error': 'Некорректный уровень воды'}), 400

        # Создание показания
        timestamp = datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00')) if 'timestamp' in data else datetime.utcnow()

        reading = SensorReading(
            sensor_id=sensor_id,
            water_level=data['water_level'],
            temperature=data.get('temperature'),
            timestamp=timestamp
        )

        # Обновляем текущие показания в датчике
        sensor.water_level = data['water_level']
        sensor.temperature = data.get('temperature')
        sensor.last_update = timestamp

        db.session.add(reading)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Показание добавлено',
            'data': reading.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка добавления показания: {e}")
        return jsonify({'error': 'Ошибка при добавлении показания'}), 500


# ============================================
# ЭНДПОИНТЫ ДЛЯ ЗОН РИСКА
# ============================================

@sensor_bp.route('/zones', methods=['GET'])
def get_risk_zones():
    """
    Получить все зоны риска
    Доступ: PUBLIC
    """
    try:
        query = RiskZone.query.filter_by(is_active=True)

        # Фильтр по типу
        zone_type = request.args.get('type')
        if zone_type:
            query = query.filter_by(type=zone_type)

        zones = query.all()

        return jsonify({
            'success': True,
            'data': [zone.to_dict() for zone in zones],
            'count': len(zones)
        }), 200

    except Exception as e:
        print(f"Ошибка получения зон риска: {e}")
        return jsonify({'error': 'Ошибка при получении зон риска'}), 500


@sensor_bp.route('/zones/<zone_id>', methods=['GET'])
def get_risk_zone_by_id(zone_id):
    """
    Получить зону риска по ID
    Доступ: PUBLIC
    """
    try:
        zone = RiskZone.query.filter_by(id=zone_id, is_active=True).first()

        if not zone:
            return jsonify({'error': 'Зона не найдена'}), 404

        return jsonify({
            'success': True,
            'data': zone.to_dict()
        }), 200

    except Exception as e:
        print(f"Ошибка получения зоны: {e}")
        return jsonify({'error': 'Ошибка при получении зоны'}), 500


@sensor_bp.route('/zones', methods=['POST'])
@jwt_required()
def create_risk_zone():
    """
    Создать новую зону риска
    Доступ: ADMIN
    """
    try:
        # Проверка прав (только админ)
        claims = get_jwt()
        if claims.get('user_type') != 'admin':
            return jsonify({'error': 'Требуются права администратора'}), 403

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        # Валидация обязательных полей
        required = ['name', 'type', 'coordinates']
        missing = [f for f in required if f not in data]
        if missing:
            return jsonify({'error': f'Отсутствуют поля: {", ".join(missing)}'}), 400

        # Валидация типа зоны
        if data['type'] not in ['low', 'medium', 'high']:
            return jsonify({'error': 'Тип должен быть: low, medium или high'}), 400

        # Создание зоны
        zone = RiskZone(
            id=data.get('id', f"zone-{int(datetime.utcnow().timestamp())}"),
            name=data['name'],
            type=data['type'],
            location=data.get('location'),
            region=data.get('region'),
            coordinates=data['coordinates'],
            water_level=data.get('water_level', 0.0),
            threshold=data.get('threshold', 0.0),
            trend=data.get('trend', 'stable'),
            residents_count=data.get('residents_count', 0),
            affected_population=data.get('affected_population', data.get('residents_count', 0)),
            evacuated_count=data.get('evacuated_count', 0),
            related_sensor_ids=data.get('related_sensor_ids'),
            status=data.get('status', 'monitoring'),
            description=data.get('description')
        )

        db.session.add(zone)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Зона риска создана',
            'data': zone.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Ошибка создания зоны: {e}")
        return jsonify({'error': 'Ошибка при создании зоны'}), 500

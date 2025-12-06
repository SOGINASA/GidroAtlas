from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, WaterBody, HydroFacility, Sensor, User
from datetime import datetime

map_bp = Blueprint('map', __name__)

# =====================
# PUBLIC ENDPOINTS (для гостей)
# =====================

@map_bp.route('/waterbodies', methods=['GET'])
def get_waterbodies():
    """
    Получить все водные объекты для карты

    Query параметры:
    - region: фильтр по региону (опционально)
    - condition: фильтр по техническому состоянию (опционально)
    """
    region = request.args.get('region')
    condition = request.args.get('condition', type=int)

    query = WaterBody.query

    # Фильтрация
    if region and region != 'all':
        query = query.filter(WaterBody.region.ilike(f'%{region}%'))

    water_bodies = query.all()

    # Преобразуем в формат для карты
    result = []
    for wb in water_bodies:
        data = {
            'id': wb.id,
            'name': wb.name,
            'type': wb.type,
            'resourceType': wb.type,  # alias для совместимости
            'region': wb.region,
            'area': wb.region,  # alias для совместимости
            'waterType': 'fresh' if 'озеро' in wb.type.lower() or 'река' in wb.type.lower() else 'salt',
            'hasFauna': True,  # по умолчанию
            'passportYear': 2023,  # заглушка, можно добавить в модель
            'coordinates': wb.coordinates or {},
            'lat': wb.coordinates.get('lat') if wb.coordinates else None,
            'lng': wb.coordinates.get('lng') if wb.coordinates else None,
            'latitude': wb.coordinates.get('lat') if wb.coordinates else None,
            'longitude': wb.coordinates.get('lng') if wb.coordinates else None,
            'condition': 3,  # заглушка, нужно добавить в модель WaterBody
            'technicalCondition': 3,
            'description': wb.description,
            'maxDepth': wb.max_depth,
            'averageDepth': wb.average_depth,
            'volume': wb.volume,
            'length': wb.length,
            'relatedSensors': wb.related_sensor_ids or [],
            'relatedFacilities': wb.related_facility_ids or [],
        }

        # Фильтр по condition (если указан)
        if condition and data['condition'] != condition:
            continue

        result.append(data)

    return jsonify(result), 200


@map_bp.route('/waterbodies/<int:id>', methods=['GET'])
def get_waterbody_details(id):
    """Получить детальную информацию о водном объекте"""
    wb = WaterBody.query.get_or_404(id)

    return jsonify({
        'id': wb.id,
        'name': wb.name,
        'type': wb.type,
        'resourceType': wb.type,
        'region': wb.region,
        'waterType': 'fresh' if 'озеро' in wb.type.lower() or 'река' in wb.type.lower() else 'salt',
        'coordinates': wb.coordinates,
        'lat': wb.coordinates.get('lat') if wb.coordinates else None,
        'lng': wb.coordinates.get('lng') if wb.coordinates else None,
        'condition': 3,  # TODO: добавить в модель
        'technicalCondition': 3,
        'passportDate': '2023-01-01',  # TODO: добавить в модель
        'description': wb.description,
        'maxDepth': wb.max_depth,
        'averageDepth': wb.average_depth,
        'volume': wb.volume,
        'length': wb.length,
        'area': wb.area,
        'relatedSensors': wb.related_sensor_ids or [],
        'relatedFacilities': wb.related_facility_ids or []
    }), 200


@map_bp.route('/facilities', methods=['GET'])
def get_facilities():
    """
    Получить все гидротехнические сооружения для карты

    Query параметры:
    - region: фильтр по региону (опционально)
    - condition: фильтр по техническому состоянию (опционально)
    """
    region = request.args.get('region')
    condition = request.args.get('condition', type=int)

    query = HydroFacility.query

    # Фильтрация
    if region and region != 'all':
        query = query.filter(HydroFacility.region.ilike(f'%{region}%'))

    if condition:
        query = query.filter(HydroFacility.technical_condition == condition)

    facilities = query.all()

    # Преобразуем в формат для карты
    result = []
    for f in facilities:
        priority = f.calculate_priority()

        data = {
            'id': f.id,
            'name': f.name,
            'type': f.type,
            'facilityType': f.type,  # alias
            'region': f.region,
            'area': f.region,  # alias
            'capacity': f.capacity,
            'yearBuilt': f.year_built,
            'passportYear': f.passport_year,
            'coordinates': f.coordinates or {},
            'lat': f.coordinates.get('lat') if f.coordinates else None,
            'lng': f.coordinates.get('lng') if f.coordinates else None,
            'latitude': f.coordinates.get('lat') if f.coordinates else None,
            'longitude': f.coordinates.get('lng') if f.coordinates else None,
            'condition': f.technical_condition,
            'technicalCondition': f.technical_condition,
            'conditionCategory': f.technical_condition,  # alias для iOS
            'status': f.status,
            'riskScore': f.risk_score,
            'riskLevel': f.risk_level,
            'priority': priority,
            'lastInspection': f.last_inspection.isoformat() if f.last_inspection else None,
            'nextInspection': f.next_inspection.isoformat() if f.next_inspection else None,
            'description': f.description,
            'waterBody': f.water_body,
            'relatedSensors': f.related_sensor_ids or []
        }

        result.append(data)

    return jsonify(result), 200


@map_bp.route('/facilities/<int:id>', methods=['GET'])
def get_facility_details(id):
    """Получить детальную информацию о ГТС"""
    facility = HydroFacility.query.get_or_404(id)
    priority = facility.calculate_priority()

    return jsonify({
        'id': facility.id,
        'name': facility.name,
        'type': facility.type,
        'region': facility.region,
        'capacity': facility.capacity,
        'yearBuilt': facility.year_built,
        'passportYear': facility.passport_year,
        'coordinates': facility.coordinates,
        'lat': facility.coordinates.get('lat') if facility.coordinates else None,
        'lng': facility.coordinates.get('lng') if facility.coordinates else None,
        'condition': facility.technical_condition,
        'technicalCondition': facility.technical_condition,
        'status': facility.status,
        'riskScore': facility.risk_score,
        'riskLevel': facility.risk_level,
        'priority': priority,
        'lastInspection': facility.last_inspection.isoformat() if facility.last_inspection else None,
        'nextInspection': facility.next_inspection.isoformat() if facility.next_inspection else None,
        'issues': facility.issues,
        'alerts': facility.alerts,
        'description': facility.description,
        'waterBody': facility.water_body,
        'relatedSensors': facility.related_sensor_ids or []
    }), 200


@map_bp.route('/critical-zones', methods=['GET'])
def get_critical_zones():
    """
    Получить критические зоны рек

    Query параметры:
    - region: фильтр по региону (опционально)
    """
    region = request.args.get('region')

    # TODO: Создать модель CriticalZone
    # Пока возвращаем моковые данные
    mock_zones = [
        {
            'id': 'irtysh-pavlodar',
            'name': 'Иртыш (Павлодар)',
            'region': 'Павлодарская область',
            'level': 'critical',
            'description': 'Высокий уровень воды, риск выхода на пойму',
            'condition': 5,
            'lat': 52.3,
            'lng': 76.9
        },
        {
            'id': 'ural-uralsk',
            'name': 'Урал (Уральск)',
            'region': 'Западно-Казахстанская область',
            'level': 'warning',
            'description': 'Повышенный уровень, требуется мониторинг',
            'condition': 4,
            'lat': 51.2,
            'lng': 51.4
        },
        {
            'id': 'syrdarya-kyzylorda',
            'name': 'Сырдарья (Кызылорда)',
            'region': 'Кызылординская область',
            'level': 'critical',
            'description': 'Критический уровень, возможен выход воды на пойму',
            'condition': 5,
            'lat': 44.8,
            'lng': 65.5
        }
    ]

    # Фильтрация по региону
    if region and region != 'all':
        mock_zones = [z for z in mock_zones if region.lower() in z['region'].lower()]

    return jsonify(mock_zones), 200


@map_bp.route('/sensors', methods=['GET'])
def get_map_sensors():
    """
    Получить датчики для отображения на карте

    Query параметры:
    - region: фильтр по региону (опционально)
    - status: фильтр по статусу (online/offline) (опционально)
    """
    region = request.args.get('region')
    status_filter = request.args.get('status')

    query = Sensor.query.filter_by(is_active=True)

    # Фильтрация по региону
    if region and region != 'all':
        query = query.filter(Sensor.location.ilike(f'%{region}%'))

    # Фильтрация по статусу
    if status_filter:
        query = query.filter(Sensor.status == status_filter)

    sensors = query.all()

    # Преобразуем в формат для карты
    result = []
    for s in sensors:
        result.append({
            'id': s.id,
            'name': s.name,
            'location': s.location,
            'region': s.location,  # можно улучшить, добавив отдельное поле region в модель
            'lat': s.latitude,
            'lng': s.longitude,
            'status': 'online' if s.status == 'active' else 'offline',
            'type': 'level',  # можно добавить тип датчика в модель
            'waterLevel': s.water_level,
            'temperature': s.temperature,
            'lastUpdate': s.last_update.isoformat() if s.last_update else None,
            'dangerLevel': s.get_danger_level()
        })

    return jsonify(result), 200


# =====================
# ADMIN ENDPOINTS (требуют авторизации)
# =====================

@map_bp.route('/admin/waterbodies', methods=['GET'])
@jwt_required()
def admin_get_waterbodies():
    """Админский эндпоинт для получения водных объектов"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    # Проверка прав (только admin и emergency)
    if user.user_type not in ['admin', 'emergency']:
        return jsonify({'error': 'Доступ запрещён'}), 403

    return get_waterbodies()


@map_bp.route('/admin/waterbodies', methods=['POST'])
@jwt_required()
def admin_create_waterbody():
    """Создать новый водный объект"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    # Проверка прав (только admin и emergency)
    if user.user_type not in ['admin', 'emergency']:
        return jsonify({'error': 'Доступ запрещён'}), 403

    data = request.get_json()

    # Валидация
    if not data.get('name') or not data.get('region'):
        return jsonify({'error': 'Название и регион обязательны'}), 400

    # Создание объекта
    wb = WaterBody(
        name=data['name'],
        type=data.get('type', 'Река'),
        region=data['region'],
        coordinates={
            'lat': float(data.get('lat', 0)),
            'lng': float(data.get('lng', 0))
        },
        description=data.get('description')
    )

    db.session.add(wb)
    db.session.commit()

    return jsonify({
        'id': wb.id,
        'name': wb.name,
        'type': wb.type,
        'region': wb.region,
        'lat': wb.coordinates.get('lat'),
        'lng': wb.coordinates.get('lng'),
        'condition': 3,  # по умолчанию
        'coordinates': wb.coordinates
    }), 201


@map_bp.route('/admin/waterbodies/<int:id>', methods=['PUT'])
@jwt_required()
def admin_update_waterbody(id):
    """Обновить водный объект"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.user_type not in ['admin', 'emergency']:
        return jsonify({'error': 'Доступ запрещён'}), 403

    wb = WaterBody.query.get_or_404(id)
    data = request.get_json()

    # Обновление полей
    if 'name' in data:
        wb.name = data['name']
    if 'type' in data:
        wb.type = data['type']
    if 'region' in data:
        wb.region = data['region']
    if 'lat' in data and 'lng' in data:
        wb.coordinates = {
            'lat': float(data['lat']),
            'lng': float(data['lng'])
        }
    if 'description' in data:
        wb.description = data['description']

    wb.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        'id': wb.id,
        'name': wb.name,
        'type': wb.type,
        'region': wb.region,
        'coordinates': wb.coordinates
    }), 200


@map_bp.route('/admin/waterbodies/<int:id>', methods=['DELETE'])
@jwt_required()
def admin_delete_waterbody(id):
    """Удалить водный объект"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.user_type != 'admin':  # только админ
        return jsonify({'error': 'Доступ запрещён'}), 403

    wb = WaterBody.query.get_or_404(id)
    db.session.delete(wb)
    db.session.commit()

    return jsonify({'message': 'Объект удалён'}), 200


@map_bp.route('/admin/facilities', methods=['GET'])
@jwt_required()
def admin_get_facilities():
    """Админский эндпоинт для получения ГТС"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.user_type not in ['admin', 'emergency']:
        return jsonify({'error': 'Доступ запрещён'}), 403

    return get_facilities()


@map_bp.route('/admin/facilities', methods=['POST'])
@jwt_required()
def admin_create_facility():
    """Создать новое ГТС"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.user_type not in ['admin', 'emergency']:
        return jsonify({'error': 'Доступ запрещён'}), 403

    data = request.get_json()

    # Валидация
    if not data.get('name') or not data.get('region'):
        return jsonify({'error': 'Название и регион обязательны'}), 400

    # Создание ГТС
    facility = HydroFacility(
        name=data['name'],
        type=data.get('type', 'ГЭС'),
        region=data['region'],
        coordinates={
            'lat': float(data.get('lat', 0)),
            'lng': float(data.get('lng', 0))
        },
        technical_condition=int(data.get('condition', 3)),
        description=data.get('description')
    )

    db.session.add(facility)
    db.session.commit()

    priority = facility.calculate_priority()

    return jsonify({
        'id': facility.id,
        'name': facility.name,
        'type': facility.type,
        'region': facility.region,
        'lat': facility.coordinates.get('lat'),
        'lng': facility.coordinates.get('lng'),
        'condition': facility.technical_condition,
        'coordinates': facility.coordinates,
        'priority': priority
    }), 201


@map_bp.route('/admin/facilities/<int:id>', methods=['PUT'])
@jwt_required()
def admin_update_facility(id):
    """Обновить ГТС"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.user_type not in ['admin', 'emergency']:
        return jsonify({'error': 'Доступ запрещён'}), 403

    facility = HydroFacility.query.get_or_404(id)
    data = request.get_json()

    # Обновление полей
    if 'name' in data:
        facility.name = data['name']
    if 'type' in data:
        facility.type = data['type']
    if 'region' in data:
        facility.region = data['region']
    if 'lat' in data and 'lng' in data:
        facility.coordinates = {
            'lat': float(data['lat']),
            'lng': float(data['lng'])
        }
    if 'condition' in data:
        facility.technical_condition = int(data['condition'])
    if 'description' in data:
        facility.description = data['description']

    facility.updated_at = datetime.utcnow()
    db.session.commit()

    priority = facility.calculate_priority()

    return jsonify({
        'id': facility.id,
        'name': facility.name,
        'type': facility.type,
        'region': facility.region,
        'condition': facility.technical_condition,
        'coordinates': facility.coordinates,
        'priority': priority
    }), 200


@map_bp.route('/admin/facilities/<int:id>', methods=['DELETE'])
@jwt_required()
def admin_delete_facility(id):
    """Удалить ГТС"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.user_type != 'admin':
        return jsonify({'error': 'Доступ запрещён'}), 403

    facility = HydroFacility.query.get_or_404(id)
    db.session.delete(facility)
    db.session.commit()

    return jsonify({'message': 'ГТС удалено'}), 200


# =====================
# STATISTICS ENDPOINTS
# =====================

@map_bp.route('/stats', methods=['GET'])
def get_map_stats():
    """Получить статистику для карты"""

    total_waterbodies = WaterBody.query.count()
    total_facilities = HydroFacility.query.count()
    critical_facilities = HydroFacility.query.filter(HydroFacility.technical_condition >= 4).count()
    total_sensors = Sensor.query.filter_by(is_active=True).count()

    return jsonify({
        'totalWaterBodies': total_waterbodies,
        'totalFacilities': total_facilities,
        'criticalObjects': critical_facilities,
        'totalSensors': total_sensors,
        'goodCondition': HydroFacility.query.filter(HydroFacility.technical_condition <= 2).count(),
        'needsAttention': critical_facilities
    }), 200

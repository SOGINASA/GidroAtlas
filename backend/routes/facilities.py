from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, HydroFacility, WaterBody
from datetime import datetime

facilities_bp = Blueprint('facilities', __name__)


def validate_facility_data(data, partial=False):
    errors = []
    if not partial:
        required = ['name', 'type']
        for field in required:
            if field not in data:
                errors.append(f'Поле {field} обязательно')

    if 'technical_condition' in data:
        tc = data['technical_condition']
        if not isinstance(tc, int) or tc < 1 or tc > 5:
            errors.append('technical_condition должно быть целым 1..5')

    if 'risk_score' in data:
        rs = data['risk_score']
        if not isinstance(rs, (int, float)) or rs < 0 or rs > 100:
            errors.append('risk_score должно быть числом 0..100')

    return errors


@facilities_bp.route('', methods=['GET'])
def list_facilities():
    """Получить список всех объектов ГТС с возможностью фильтрации и приоритизации"""
    try:
        query = HydroFacility.query

        # Фильтрация по региону
        region = request.args.get('region')
        if region and region != 'all':
            query = query.filter_by(region=region)

        # Фильтрация по типу
        ftype = request.args.get('type')
        if ftype and ftype != 'all':
            query = query.filter_by(type=ftype)

        # Фильтрация по статусу
        status = request.args.get('status')
        if status and status != 'all':
            query = query.filter_by(status=status)

        # Фильтрация по риску
        min_risk = request.args.get('minRisk')
        max_risk = request.args.get('maxRisk')
        if min_risk is not None:
            try:
                mn = int(min_risk)
                query = query.filter(HydroFacility.risk_score >= mn)
            except Exception:
                pass
        if max_risk is not None:
            try:
                mx = int(max_risk)
                query = query.filter(HydroFacility.risk_score <= mx)
            except Exception:
                pass

        # Фильтрация по уровню приоритета (через вычисление)
        priority_level = request.args.get('priority')

        # Получаем все объекты
        facilities = query.all()

        # Применяем фильтр по уровню приоритета (если задан)
        if priority_level and priority_level != 'all':
            facilities = [f for f in facilities if f.calculate_priority()['level'] == priority_level]

        # Сортировка
        sort_by = request.args.get('sortBy', 'priority_desc')

        if sort_by == 'priority_desc':
            facilities.sort(key=lambda x: x.calculate_priority()['score'], reverse=True)
        elif sort_by == 'priority_asc':
            facilities.sort(key=lambda x: x.calculate_priority()['score'])
        elif sort_by == 'condition_desc':
            facilities.sort(key=lambda x: x.technical_condition, reverse=True)
        elif sort_by == 'condition_asc':
            facilities.sort(key=lambda x: x.technical_condition)
        elif sort_by == 'passport_old':
            facilities.sort(key=lambda x: x.passport_year if x.passport_year else 9999)
        elif sort_by == 'passport_new':
            facilities.sort(key=lambda x: x.passport_year if x.passport_year else 0, reverse=True)
        else:
            # По умолчанию сортируем по риск-скору
            facilities.sort(key=lambda x: x.risk_score, reverse=True)

        # Статистика по приоритетам
        all_priorities = [f.calculate_priority() for f in facilities]
        stats = {
            'total': len(facilities),
            'high': len([p for p in all_priorities if p['level'] == 'high']),
            'medium': len([p for p in all_priorities if p['level'] == 'medium']),
            'low': len([p for p in all_priorities if p['level'] == 'low'])
        }

        return jsonify({
            'success': True,
            'data': [f.to_dict() for f in facilities],
            'stats': stats,
            'count': len(facilities)
        }), 200
    except Exception as e:
        print(f'Ошибка получения объектов ГТС: {e}')
        return jsonify({'error': 'Ошибка при получении объектов'}), 500


@facilities_bp.route('/<int:fid>', methods=['GET'])
def get_facility(fid):
    try:
        f = HydroFacility.query.get(fid)
        if not f:
            return jsonify({'error': 'ГТС не найдено'}), 404
        return jsonify({'success': True, 'data': f.to_dict()}), 200
    except Exception as e:
        print(f'Ошибка получения ГТС: {e}')
        return jsonify({'error': 'Ошибка при получении объекта'}), 500


@facilities_bp.route('', methods=['POST'])
@jwt_required()
def create_facility():
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'mchs']:
            return jsonify({'error': 'Требуются права администратора'}), 403

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        errors = validate_facility_data(data, partial=False)
        if errors:
            return jsonify({'error': 'Ошибка валидации', 'details': errors}), 400

        facility = HydroFacility(
            name=data.get('name'),
            type=data.get('type'),
            region=data.get('region'),
            water_body=data.get('waterBody'),
            water_body_id=data.get('waterBodyId'),
            capacity=data.get('capacity', 0.0),
            year_built=data.get('yearBuilt'),
            passport_year=data.get('passportYear'),
            status=data.get('status', 'operational'),
            technical_condition=data.get('technical_condition', 1),
            risk_score=data.get('risk_score', 0),
            risk_level=data.get('risk_level', 'medium'),
            last_inspection=datetime.fromisoformat(data['lastInspection']) if data.get('lastInspection') else None,
            next_inspection=datetime.fromisoformat(data['nextInspection']) if data.get('nextInspection') else None,
            issues=data.get('issues', 0),
            alerts=data.get('alerts', 0),
            coordinates=data.get('coordinates'),
            related_sensor_ids=data.get('relatedSensors'),
            description=data.get('description')
        )

        db.session.add(facility)
        db.session.commit()

        return jsonify({'success': True, 'message': 'ГТС создано', 'data': facility.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        print(f'Ошибка создания ГТС: {e}')
        return jsonify({'error': 'Ошибка при создании объекта'}), 500


@facilities_bp.route('/<int:fid>', methods=['PUT'])
@jwt_required()
def update_facility(fid):
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'mchs']:
            return jsonify({'error': 'Требуются права администратора'}), 403

        f = HydroFacility.query.get(fid)
        if not f:
            return jsonify({'error': 'ГТС не найдено'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        errors = validate_facility_data(data, partial=True)
        if errors:
            return jsonify({'error': 'Ошибка валидации', 'details': errors}), 400

        # Обновление полей
        for field in ['name', 'type', 'region', 'status', 'description']:
            if field in data:
                setattr(f, field, data[field])

        if 'waterBody' in data:
            f.water_body = data['waterBody']
        if 'waterBodyId' in data:
            f.water_body_id = data['waterBodyId']
        if 'capacity' in data:
            f.capacity = data['capacity']
        if 'yearBuilt' in data:
            f.year_built = data['yearBuilt']
        if 'passportYear' in data:
            f.passport_year = data['passportYear']
        if 'technical_condition' in data:
            f.technical_condition = data['technical_condition']
        if 'risk_score' in data:
            f.risk_score = data['risk_score']
        if 'risk_level' in data:
            f.risk_level = data['risk_level']
        if 'lastInspection' in data:
            f.last_inspection = datetime.fromisoformat(data['lastInspection']) if data.get('lastInspection') else None
        if 'nextInspection' in data:
            f.next_inspection = datetime.fromisoformat(data['nextInspection']) if data.get('nextInspection') else None
        if 'issues' in data:
            f.issues = data['issues']
        if 'alerts' in data:
            f.alerts = data['alerts']
        if 'coordinates' in data:
            f.coordinates = data['coordinates']
        if 'relatedSensors' in data:
            f.related_sensor_ids = data['relatedSensors']

        f.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({'success': True, 'message': 'ГТС обновлено', 'data': f.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        print(f'Ошибка обновления ГТС: {e}')
        return jsonify({'error': 'Ошибка при обновлении объекта'}), 500


@facilities_bp.route('/<int:fid>', methods=['DELETE'])
@jwt_required()
def delete_facility(fid):
    try:
        claims = get_jwt()
        if claims.get('user_type') != 'admin':
            return jsonify({'error': 'Требуются права администратора'}), 403

        f = HydroFacility.query.get(fid)
        if not f:
            return jsonify({'error': 'ГТС не найдено'}), 404

        # Soft-delete: пометим статус как inactive
        f.status = 'inactive'
        f.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({'success': True, 'message': 'ГТС удалено (помечено как неактивно)'}), 200
    except Exception as e:
        db.session.rollback()
        print(f'Ошибка удаления ГТС: {e}')
        return jsonify({'error': 'Ошибка при удалении объекта'}), 500


# ===== Маршруты для водных объектов =====

@facilities_bp.route('/water-bodies', methods=['GET'])
def list_water_bodies():
    """Получить список всех водных объектов"""
    try:
        query = WaterBody.query

        # Фильтрация по региону
        region = request.args.get('region')
        if region:
            query = query.filter_by(region=region)

        # Фильтрация по типу
        wb_type = request.args.get('type')
        if wb_type:
            query = query.filter_by(type=wb_type)

        water_bodies = query.order_by(WaterBody.name).all()

        return jsonify({
            'success': True,
            'data': [wb.to_dict() for wb in water_bodies],
            'count': len(water_bodies)
        }), 200
    except Exception as e:
        print(f'Ошибка получения водных объектов: {e}')
        return jsonify({'error': 'Ошибка при получении водных объектов'}), 500


@facilities_bp.route('/water-bodies/<int:wbid>', methods=['GET'])
def get_water_body(wbid):
    """Получить один водный объект по ID"""
    try:
        wb = WaterBody.query.get(wbid)
        if not wb:
            return jsonify({'error': 'Водный объект не найден'}), 404
        return jsonify({'success': True, 'data': wb.to_dict()}), 200
    except Exception as e:
        print(f'Ошибка получения водного объекта: {e}')
        return jsonify({'error': 'Ошибка при получении водного объекта'}), 500

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, Evacuation, User, Notification
from datetime import datetime
import random

evacuations_bp = Blueprint('evacuations', __name__)


def create_evacuation_notification(user_id, evacuation_id, status):
    """Создать уведомление об эвакуации"""
    titles = {
        'pending': 'Назначена эвакуация',
        'in_progress': 'Эвакуация началась',
        'completed': 'Эвакуация завершена',
        'cancelled': 'Эвакуация отменена'
    }

    messages = {
        'pending': 'Вам назначена эвакуация. Ожидайте прибытия бригады.',
        'in_progress': 'Бригада эвакуации направляется к вам. Будьте готовы.',
        'completed': 'Вы успешно эвакуированы. Спасибо за сотрудничество.',
        'cancelled': 'Эвакуация отменена. Вы можете оставаться дома.'
    }

    notification = Notification(
        user_id=user_id,
        type='evacuation',
        title=titles.get(status, 'Обновление статуса эвакуации'),
        message=messages.get(status, f'Статус эвакуации изменен на: {status}'),
        evacuation_id=evacuation_id,
        is_important=True
    )

    db.session.add(notification)


@evacuations_bp.route('', methods=['GET'])
@jwt_required()
def get_evacuations():
    """
    Получить эвакуации
    Обычный пользователь видит только свои эвакуации
    Admin/MCHS видят все
    """
    claims = get_jwt()
    user_id = int(claims.get('sub'))
    user_type = claims.get('user_type', 'user')

    try:
        # Параметры фильтрации
        status = request.args.get('status')
        priority = request.args.get('priority')

        if user_type in ['admin', 'mchs']:
            # Admin/MCHS видят все эвакуации
            query = Evacuation.query
        else:
            # Обычный пользователь видит только свои
            query = Evacuation.query.filter_by(user_id=user_id)

        # Фильтры
        if status:
            query = query.filter_by(status=status)
        if priority:
            query = query.filter_by(priority=priority)

        evacuations = query.order_by(Evacuation.created_at.desc()).all()

        # Для admin/mchs добавляем информацию о пользователе
        result = []
        for evac in evacuations:
            evac_dict = evac.to_dict()
            if user_type in ['admin', 'mchs']:
                user = User.query.get(evac.user_id)
                if user:
                    evac_dict['user'] = {
                        'id': user.id,
                        'fullName': user.full_name,
                        'phone': user.phone,
                        'address': user.address
                    }
            result.append(evac_dict)

        return jsonify({
            'success': True,
            'data': result,
            'count': len(result)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evacuations_bp.route('/initiate', methods=['POST'])
@jwt_required()
def initiate_evacuation_operation():
    """
    Инициировать операцию эвакуации — создать записи для жителей в указанном месте
    Доступ: admin, mchs
    Body: { location, region?, evacuation_point?, user_ids?: number[] }
    Если user_ids не указаны, создаёт эвакуации для всех жителей без активной эвакуации
    Если жителей нет, создает демонстрационную эвакуацию или возвращает пустую операцию
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        location = data.get('location')
        evacuation_point = data.get('evacuation_point') or location
        region = data.get('region')
        user_ids = data.get('user_ids', [])

        if not location:
            return jsonify({'error': 'location обязателен'}), 400

        # Если user_ids не указаны, получаем всех жителей
        if not user_ids:
            # Получаем жителей, которые еще не в активной эвакуации
            all_residents = User.query.filter_by(user_type='user', is_active=True).all()
            active_evacuation_user_ids = db.session.query(Evacuation.user_id).filter(
                Evacuation.status.in_(['pending', 'in_progress'])
            ).all()
            active_ids = set(r[0] for r in active_evacuation_user_ids)
            user_ids = [u.id for u in all_residents if u.id not in active_ids]

        # Если все еще нет пользователей, создаем демо эвакуации
        if not user_ids:
            # Если указан demo_count, создаем демонстрационные записи без привязки к user_id
            demo_count = data.get('demo_count', 0)
            
            if demo_count > 0:
                # Создаем демо эвакуации (без привязки к real users, просто для тестирования UI)
                created_evacuations = []
                for i in range(demo_count):
                    # Берем первого доступного пользователя, если есть хотя бы один
                    first_user = User.query.filter_by(user_type='user', is_active=True).first()
                    if not first_user:
                        first_user = User.query.filter_by(user_type='mchs', is_active=True).first()
                    if not first_user:
                        first_user = User.query.filter_by(user_type='admin', is_active=True).first()
                    
                    if first_user:
                        evacuation = Evacuation(
                            user_id=first_user.id,
                            status='pending',
                            evacuation_point=evacuation_point,
                            priority='medium',
                            family_members=random.randint(1, 4)
                        )
                        db.session.add(evacuation)
                        db.session.flush()
                        create_evacuation_notification(first_user.id, evacuation.id, 'pending')
                        created_evacuations.append(evacuation.to_dict())

                db.session.commit()
                return jsonify({
                    'success': True,
                    'data': {
                        'location': location,
                        'evacuation_point': evacuation_point,
                        'created_count': len(created_evacuations),
                        'evacuations': created_evacuations,
                        'message': f'Создано {len(created_evacuations)} демонстрационных заявок на эвакуацию'
                    },
                    'message': f'Создано {len(created_evacuations)} демонстрационных заявок'
                }), 201
            
            # Возвращаем сообщение, что операция открыта, но нет жителей для добавления
            return jsonify({
                'success': True,
                'data': {
                    'location': location,
                    'evacuation_point': evacuation_point,
                    'created_count': 0,
                    'evacuations': [],
                    'message': 'Операция готова, но нет доступных жителей для добавления. Передайте demo_count в теле запроса для демо.'
                },
                'message': 'Операция создана без жителей'
            }), 201

        # Создаем эвакуации для каждого жителя
        created_evacuations = []
        for user_id in user_ids:
            # Проверяем, нет ли уже активной эвакуации для этого жителя
            existing = Evacuation.query.filter(
                Evacuation.user_id == user_id,
                Evacuation.status.in_(['pending', 'in_progress'])
            ).first()

            if existing:
                continue  # Пропускаем, если уже есть активная эвакуация

            evacuation = Evacuation(
                user_id=user_id,
                status='pending',
                evacuation_point=evacuation_point,
                priority='medium',
                family_members=1
            )

            db.session.add(evacuation)
            db.session.flush()  # Получаем ID

            # Создаем уведомление
            create_evacuation_notification(user_id, evacuation.id, 'pending')
            created_evacuations.append(evacuation.to_dict())

        db.session.commit()

        return jsonify({
            'success': True,
            'data': {
                'location': location,
                'evacuation_point': evacuation_point,
                'created_count': len(created_evacuations),
                'evacuations': created_evacuations
            },
            'message': f'Создано {len(created_evacuations)} заявок на эвакуацию'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@evacuations_bp.route('/<int:evacuation_id>', methods=['GET'])
@jwt_required()
def get_evacuation(evacuation_id):
    """Получить конкретную эвакуацию"""
    claims = get_jwt()
    user_id = int(claims.get('sub'))
    user_type = claims.get('user_type', 'user')

    try:
        evacuation = Evacuation.query.get(evacuation_id)

        if not evacuation:
            return jsonify({'error': 'Эвакуация не найдена'}), 404

        # Обычный пользователь может видеть только свою эвакуацию
        if user_type == 'user' and evacuation.user_id != user_id:
            return jsonify({'error': 'Недостаточно прав доступа'}), 403

        evac_dict = evacuation.to_dict()

        # Добавляем информацию о пользователе для admin/mchs
        if user_type in ['admin', 'mchs']:
            user = User.query.get(evacuation.user_id)
            if user:
                evac_dict['user'] = {
                    'id': user.id,
                    'fullName': user.full_name,
                    'phone': user.phone,
                    'address': user.address
                }

        return jsonify({
            'success': True,
            'data': evac_dict
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evacuations_bp.route('', methods=['POST'])
@jwt_required()
def create_evacuation():
    """
    Создать эвакуацию (admin/mchs)
    Body: { user_id, evacuation_point?, assigned_team?, priority?, family_members?, has_disabilities?, has_pets?, special_needs?, notes? }
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        # Проверка обязательных полей
        if 'user_id' not in data:
            return jsonify({'error': 'Поле user_id обязательно'}), 400

        # Проверка существования пользователя
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404

        # Создание эвакуации
        evacuation = Evacuation(
            user_id=data['user_id'],
            status='pending',
            evacuation_point=data.get('evacuation_point'),
            assigned_team=data.get('assigned_team'),
            priority=data.get('priority', 'medium'),
            family_members=data.get('family_members', 1),
            has_disabilities=data.get('has_disabilities', False),
            has_pets=data.get('has_pets', False),
            special_needs=data.get('special_needs'),
            notes=data.get('notes')
        )

        db.session.add(evacuation)
        db.session.flush()  # Получаем ID эвакуации

        # Создаем уведомление для пользователя
        create_evacuation_notification(data['user_id'], evacuation.id, 'pending')

        db.session.commit()

        return jsonify({
            'success': True,
            'data': evacuation.to_dict(),
            'message': 'Эвакуация создана'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@evacuations_bp.route('/<int:evacuation_id>', methods=['PUT'])
@jwt_required()
def update_evacuation(evacuation_id):
    """
    Обновить эвакуацию (admin/mchs)
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        evacuation = Evacuation.query.get(evacuation_id)

        if not evacuation:
            return jsonify({'error': 'Эвакуация не найдена'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        old_status = evacuation.status

        # Обновляемые поля
        allowed_fields = ['status', 'evacuation_point', 'assigned_team', 'priority',
                          'family_members', 'has_disabilities', 'has_pets', 'special_needs', 'notes']

        for field in allowed_fields:
            if field in data:
                setattr(evacuation, field, data[field])

        # Если статус изменился на completed
        if 'status' in data and data['status'] == 'completed' and old_status != 'completed':
            evacuation.completed_at = datetime.utcnow()

        # Если статус изменился, создаем уведомление
        if 'status' in data and data['status'] != old_status:
            create_evacuation_notification(evacuation.user_id, evacuation.id, data['status'])

        db.session.commit()

        return jsonify({
            'success': True,
            'data': evacuation.to_dict(),
            'message': 'Эвакуация обновлена'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@evacuations_bp.route('/<int:evacuation_id>', methods=['DELETE'])
@jwt_required()
def delete_evacuation(evacuation_id):
    """Удалить эвакуацию (admin)"""
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type != 'admin':
        return jsonify({'error': 'Недостаточно прав доступа. Требуется роль admin'}), 403

    try:
        evacuation = Evacuation.query.get(evacuation_id)

        if not evacuation:
            return jsonify({'error': 'Эвакуация не найдена'}), 404

        db.session.delete(evacuation)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Эвакуация удалена'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@evacuations_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_evacuation_stats():
    """Получить статистику эвакуаций (admin/mchs)"""
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        total = Evacuation.query.count()
        pending = Evacuation.query.filter_by(status='pending').count()
        in_progress = Evacuation.query.filter_by(status='in_progress').count()
        completed = Evacuation.query.filter_by(status='completed').count()
        cancelled = Evacuation.query.filter_by(status='cancelled').count()

        # Подсчет по приоритетам
        critical = Evacuation.query.filter_by(priority='critical').count()
        high = Evacuation.query.filter_by(priority='high').count()
        medium = Evacuation.query.filter_by(priority='medium').count()
        low = Evacuation.query.filter_by(priority='low').count()

        # Особые случаи
        with_disabilities = Evacuation.query.filter_by(has_disabilities=True).count()
        with_pets = Evacuation.query.filter_by(has_pets=True).count()

        return jsonify({
            'success': True,
            'data': {
                'total': total,
                'byStatus': {
                    'pending': pending,
                    'in_progress': in_progress,
                    'completed': completed,
                    'cancelled': cancelled
                },
                'byPriority': {
                    'critical': critical,
                    'high': high,
                    'medium': medium,
                    'low': low
                },
                'specialCases': {
                    'withDisabilities': with_disabilities,
                    'withPets': with_pets
                }
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evacuations_bp.route('/operations', methods=['GET'])
@jwt_required()
def get_evacuation_operations():
    """
    Получить агрегированные операции эвакуаций (группировка по пункту эвакуации или региону)
    Доступ: admin, mchs
    Возвращает структуру, совместимую с фронтендом (location, region, totalPeople, evacuated, inProgress, shelters, transport, medicalTeams, contact)
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        # Загружаем все эвакуации и связанных пользователей (если нужны контакты)
        evacuations = Evacuation.query.order_by(Evacuation.created_at.desc()).all()

        # Построим групповую структуру по evacuation_point (если нет - по region пользователя)
        groups = {}

        for e in evacuations:
            # Ключ группировки - пункт эвакуации, либо 'Не указано'
            key = e.evacuation_point or 'Не указано'

            if key not in groups:
                groups[key] = {
                    'id': f'op-{len(groups)+1}',
                    'location': key,
                    'region': None,
                    'totalPeople': 0,
                    'evacuated': 0,
                    'inProgress': False,
                    'shelters': [],
                    'transport': { 'buses': 0, 'active': 0 },
                    'medicalTeams': 0,
                    'contact': None,
                    'evacuations': []
                }

            grp = groups[key]

            # Суммируем людей
            members = e.family_members or 1
            grp['totalPeople'] += members

            # Если запись помечена как completed, считаем как эвакуированные
            if e.status == 'completed':
                grp['evacuated'] += members

            # Маркер активной эвакуации
            if e.status == 'in_progress' or e.status == 'pending':
                grp['inProgress'] = True

            # Попытка взять контакт из связанного пользователя (если есть)
            try:
                user = User.query.get(e.user_id)
                if user and not grp['region']:
                    grp['region'] = user.address or user.full_name
                if user and not grp['contact']:
                    grp['contact'] = user.phone
            except Exception:
                pass

            # Добавляем исходную запись для возможной детализации на фронте
            grp['evacuations'].append(e.to_dict())

        # Преобразуем в список и приводим к формату фронта (удаляем внутренние поля)
        result = []
        for g in groups.values():
            result.append({
                'id': g['id'],
                'location': g['location'],
                'region': g['region'],
                'totalPeople': g['totalPeople'],
                'evacuated': g['evacuated'],
                'inProgress': g['inProgress'],
                'shelters': g['shelters'],
                'transport': g['transport'],
                'medicalTeams': g['medicalTeams'],
                'contact': g['contact'],
                'evacuations': g['evacuations']
            })

        return jsonify({
            'success': True,
            'data': result,
            'count': len(result)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

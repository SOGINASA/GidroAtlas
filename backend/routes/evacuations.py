from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, Evacuation, User, Notification
from datetime import datetime

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

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, Notification, User
from datetime import datetime

notifications_bp = Blueprint('notifications', __name__)


@notifications_bp.route('', methods=['GET'])
@jwt_required()
def get_user_notifications():
    """
    Получить уведомления текущего пользователя
    Параметры: ?unread_only=true
    """
    claims = get_jwt()
    user_id = int(claims.get('sub'))

    try:
        # Параметры фильтрации
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        limit = int(request.args.get('limit', 50))

        # Базовый запрос
        query = Notification.query.filter_by(user_id=user_id)

        # Фильтр по непрочитанным
        if unread_only:
            query = query.filter_by(is_read=False)

        # Сортировка по дате создания (новые первыми)
        notifications = query.order_by(Notification.created_at.desc()).limit(limit).all()

        return jsonify({
            'success': True,
            'data': [notif.to_dict() for notif in notifications],
            'count': len(notifications),
            'unreadCount': Notification.query.filter_by(user_id=user_id, is_read=False).count()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/<int:notification_id>', methods=['GET'])
@jwt_required()
def get_notification(notification_id):
    """Получить конкретное уведомление"""
    claims = get_jwt()
    user_id = int(claims.get('sub'))

    try:
        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()

        if not notification:
            return jsonify({'error': 'Уведомление не найдено'}), 404

        return jsonify({
            'success': True,
            'data': notification.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(notification_id):
    """Отметить уведомление как прочитанное"""
    claims = get_jwt()
    user_id = int(claims.get('sub'))

    try:
        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()

        if not notification:
            return jsonify({'error': 'Уведомление не найдено'}), 404

        notification.is_read = True
        notification.read_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'success': True,
            'data': notification.to_dict(),
            'message': 'Уведомление отмечено как прочитанное'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_as_read():
    """Отметить все уведомления как прочитанные"""
    claims = get_jwt()
    user_id = int(claims.get('sub'))

    try:
        now = datetime.utcnow()
        updated = Notification.query.filter_by(user_id=user_id, is_read=False).update({
            'is_read': True,
            'read_at': now
        })

        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Отмечено {updated} уведомлений как прочитанных'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('', methods=['POST'])
@jwt_required()
def create_notification():
    """
    Создать уведомление (admin/mchs)
    Body: { user_id, type, title, message, sensor_id?, evacuation_id?, is_important? }
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        # Валидация обязательных полей
        required = ['user_id', 'type', 'title', 'message']
        missing = [f for f in required if f not in data]
        if missing:
            return jsonify({'error': f"Отсутствуют поля: {', '.join(missing)}"}), 400

        # Проверка существования пользователя
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404

        # Создание уведомления
        notification = Notification(
            user_id=data['user_id'],
            type=data['type'],
            title=data['title'],
            message=data['message'],
            sensor_id=data.get('sensor_id'),
            evacuation_id=data.get('evacuation_id'),
            is_important=data.get('is_important', False)
        )

        db.session.add(notification)
        db.session.commit()

        return jsonify({
            'success': True,
            'data': notification.to_dict(),
            'message': 'Уведомление создано'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """Удалить уведомление"""
    claims = get_jwt()
    user_id = int(claims.get('sub'))

    try:
        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()

        if not notification:
            return jsonify({'error': 'Уведомление не найдено'}), 404

        db.session.delete(notification)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Уведомление удалено'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_notification_stats():
    """Получить статистику уведомлений текущего пользователя"""
    claims = get_jwt()
    user_id = int(claims.get('sub'))

    try:
        total = Notification.query.filter_by(user_id=user_id).count()
        unread = Notification.query.filter_by(user_id=user_id, is_read=False).count()
        important = Notification.query.filter_by(user_id=user_id, is_important=True).count()

        # Подсчет по типам
        type_counts = db.session.query(
            Notification.type,
            db.func.count(Notification.id)
        ).filter_by(user_id=user_id).group_by(Notification.type).all()

        types = {t: c for t, c in type_counts}

        return jsonify({
            'success': True,
            'data': {
                'total': total,
                'unread': unread,
                'important': important,
                'byType': types
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@notifications_bp.route('/broadcast', methods=['POST'])
@jwt_required()
def broadcast_notification():
    """
    Отправить уведомление всем пользователям (admin/mchs)
    Body: { type, title, message, sensor_id?, is_important?, role_filter? }
    role_filter: 'all', 'resident', 'emergency' - кому отправить
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        # Валидация обязательных полей
        required = ['type', 'title', 'message']
        missing = [f for f in required if f not in data]
        if missing:
            return jsonify({'error': f"Отсутствуют поля: {', '.join(missing)}"}), 400

        # Получаем список пользователей
        role_filter = data.get('role_filter', 'all')

        # Маппинг role к user_type
        role_to_user_type = {
            'resident': 'user',
            'emergency': 'mchs',
            'admin': 'admin'
        }

        if role_filter == 'all':
            users = User.query.all()
        elif role_filter in role_to_user_type:
            user_type = role_to_user_type[role_filter]
            users = User.query.filter_by(user_type=user_type).all()
        else:
            return jsonify({'error': 'Недопустимое значение role_filter'}), 400

        if not users:
            return jsonify({'error': 'Пользователи не найдены'}), 404

        # Создаем уведомления для всех пользователей
        notifications_created = []
        for user in users:
            notification = Notification(
                user_id=user.id,
                type=data['type'],
                title=data['title'],
                message=data['message'],
                sensor_id=data.get('sensor_id'),
                is_important=data.get('is_important', True)  # По умолчанию важное
            )
            db.session.add(notification)
            notifications_created.append(notification)

        db.session.commit()

        return jsonify({
            'success': True,
            'data': {
                'recipientsCount': len(notifications_created),
                'message': f'Уведомление отправлено {len(notifications_created)} пользователям'
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

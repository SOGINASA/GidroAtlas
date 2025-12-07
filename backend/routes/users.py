from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, User
from datetime import datetime

users_bp = Blueprint('users', __name__)


def require_admin():
    """Декоратор-хелпер для проверки прав администратора и МЧС"""
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')
    if user_type not in ['admin', 'emergency']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403
    return None


@users_bp.route('', methods=['GET'])
@jwt_required()
def get_all_users():
    """
    Получить список всех пользователей
    Доступно: admin, mchs
    """
    error = require_admin()
    if error:
        return error

    try:
        # Параметры фильтрации
        user_type = request.args.get('user_type')
        search = request.args.get('search', '').strip()

        # Базовый запрос - только активные пользователи
        query = User.query.filter_by(is_active=True)

        # Фильтр по типу пользователя
        if user_type:
            query = query.filter_by(user_type=user_type)

        # Поиск по email или имени
        if search:
            search_pattern = f'%{search}%'
            query = query.filter(
                db.or_(
                    User.email.ilike(search_pattern),
                    User.full_name.ilike(search_pattern)
                )
            )

        users = query.order_by(User.created_at.desc()).all()

        return jsonify({
            'success': True,
            'data': [user.to_dict() for user in users],
            'count': len(users)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_by_id(user_id):
    """
    Получить пользователя по ID
    Доступно: admin, mchs, или сам пользователь
    """
    claims = get_jwt()
    current_user_id = claims.get('sub')
    user_type = claims.get('user_type', 'user')

    # Обычные пользователи и эксперты могут видеть только свои данные
    if user_type in ['user', 'expert'] and int(current_user_id) != user_id:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        user = User.query.filter_by(id=user_id, is_active=True).first()

        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404

        return jsonify({
            'success': True,
            'data': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('', methods=['POST'])
@jwt_required()
def create_user():
    """
    Создать нового пользователя
    Доступно: только admin
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type != 'admin':
        return jsonify({'error': 'Требуются права администратора'}), 403

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        # Валидация обязательных полей
        required_fields = ['email', 'full_name', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Поле {field} обязательно'}), 400

        # Проверка email на уникальность
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Пользователь с таким email уже существует'}), 400

        # Валидация пароля
        if len(data['password']) < 6:
            return jsonify({'error': 'Пароль должен быть не менее 6 символов'}), 400

        # Создание нового пользователя
        new_user = User(
            email=data['email'],
            full_name=data['full_name'],
            user_type=data.get('user_type', 'user'),  # по умолчанию 'user'
            phone=data.get('phone'),
            address=data.get('address'),
            is_verified=data.get('is_verified', False),
            is_active=True
        )
        new_user.set_password(data['password'])

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Пользователь успешно создан',
            'data': new_user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """
    Обновить данные пользователя
    Доступно: admin, mchs, или сам пользователь
    """
    claims = get_jwt()
    current_user_id = claims.get('sub')
    user_type = claims.get('user_type', 'user')

    # Обычные пользователи и эксперты могут редактировать только свои данные
    if user_type in ['user', 'expert'] and int(current_user_id) != user_id:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        user = User.query.filter_by(id=user_id, is_active=True).first()

        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        # Поля, которые можно обновлять
        allowed_fields = ['full_name', 'phone', 'address']

        # Только admin может менять user_type
        if user_type == 'admin':
            allowed_fields.append('user_type')

        # Обновляем разрешенные поля
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])

        # Обновление пароля (если предоставлен)
        if 'password' in data and data['password']:
            if len(data['password']) < 6:
                return jsonify({'error': 'Пароль должен быть не менее 6 символов'}), 400
            user.set_password(data['password'])

        db.session.commit()

        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'Данные пользователя обновлены'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """
    Удалить пользователя (soft delete)
    Доступно: только admin
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type != 'admin':
        return jsonify({'error': 'Недостаточно прав доступа. Требуется роль admin'}), 403

    try:
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404

        if not user.is_active:
            return jsonify({'error': 'Пользователь уже деактивирован'}), 400

        # Soft delete - просто помечаем как неактивный
        user.is_active = False
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Пользователь деактивирован'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@users_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    """
    Получить статистику пользователей
    Доступно: admin, mchs
    """
    error = require_admin()
    if error:
        return error

    try:
        total = User.query.filter_by(is_active=True).count()
        users = User.query.filter_by(user_type='user', is_active=True).count()
        experts = User.query.filter_by(user_type='expert', is_active=True).count()
        emergency = User.query.filter_by(user_type='emergency', is_active=True).count()
        admins = User.query.filter_by(user_type='admin', is_active=True).count()
        verified = User.query.filter_by(is_verified=True, is_active=True).count()

        return jsonify({
            'success': True,
            'data': {
                'total': total,
                'users': users,
                'experts': experts,
                'emergency': emergency,
                'admins': admins,
                'verified': verified,
                'unverified': total - verified
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/residents', methods=['GET'])
@jwt_required()
def get_residents():
    """
    Получить список жителей (user_type='user')
    Доступно: admin, mchs
    """
    error = require_admin()
    if error:
        return error

    try:
        # Параметры фильтрации
        search = request.args.get('search', '').strip()

        # Только обычные пользователи (user_type='user')
        query = User.query.filter_by(user_type='user', is_active=True)

        # Поиск по email или имени
        if search:
            search_pattern = f'%{search}%'
            query = query.filter(
                db.or_(
                    User.email.ilike(search_pattern),
                    User.full_name.ilike(search_pattern),
                    User.address.ilike(search_pattern)
                )
            )

        residents = query.order_by(User.created_at.desc()).all()

        return jsonify({
            'success': True,
            'data': [user.to_dict() for user in residents],
            'count': len(residents)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

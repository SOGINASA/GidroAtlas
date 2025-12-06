from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, Report, User
from datetime import datetime
from dateutil import parser

reports_bp = Blueprint('reports', __name__)


@reports_bp.route('', methods=['GET'])
@jwt_required()
def get_reports():
    """
    Получить список отчётов
    Доступ: admin, mchs
    Параметры фильтрации: type, status
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        # Параметры фильтрации
        report_type = request.args.get('type')
        status = request.args.get('status')

        query = Report.query

        # Фильтры
        if report_type:
            query = query.filter_by(type=report_type)
        if status:
            query = query.filter_by(status=status)

        # Сортировка: сначала новые
        reports = query.order_by(Report.created_at.desc()).all()

        return jsonify({
            'success': True,
            'data': [report.to_dict() for report in reports],
            'count': len(reports)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@reports_bp.route('/<int:report_id>', methods=['GET'])
@jwt_required()
def get_report(report_id):
    """
    Получить конкретный отчёт
    Доступ: admin, mchs
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        report = Report.query.get(report_id)

        if not report:
            return jsonify({'error': 'Отчёт не найден'}), 404

        return jsonify({
            'success': True,
            'data': report.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@reports_bp.route('', methods=['POST'])
@jwt_required()
def create_report():
    """
    Создать новый отчёт
    Доступ: admin, mchs
    Body: {
        title: string,
        period: string,
        period_start?: date,
        period_end?: date,
        type: 'weekly' | 'monthly' | 'incident' | 'evacuation',
        status?: 'draft' | 'completed',
        stats?: { incidents, critical, evacuations },
        content?: string,
        file_size?: string,
        related_sensor_ids?: number[],
        related_evacuation_ids?: number[],
        related_zone_ids?: string[]
    }
    """
    claims = get_jwt()
    user_id = int(claims.get('sub'))
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        # Проверка обязательных полей
        required_fields = ['title', 'period', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Поле {field} обязательно'}), 400

        # Получаем информацию об авторе
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404

        # Парсим даты периода, если они переданы
        period_start = None
        period_end = None

        if 'period_start' in data and data['period_start']:
            try:
                period_start = parser.parse(data['period_start']).date()
            except:
                pass

        if 'period_end' in data and data['period_end']:
            try:
                period_end = parser.parse(data['period_end']).date()
            except:
                pass

        # Создаём отчёт
        report = Report(
            title=data['title'],
            period=data['period'],
            period_start=period_start,
            period_end=period_end,
            type=data['type'],
            author_id=user_id,
            author_name=user.full_name or user.email,
            status=data.get('status', 'draft'),
            stats=data.get('stats'),
            content=data.get('content'),
            file_size=data.get('file_size'),
            related_sensor_ids=data.get('related_sensor_ids'),
            related_evacuation_ids=data.get('related_evacuation_ids'),
            related_zone_ids=data.get('related_zone_ids')
        )

        # Если статус completed, устанавливаем дату завершения
        if report.status == 'completed':
            report.completed_at = datetime.utcnow()

        db.session.add(report)
        db.session.commit()

        return jsonify({
            'success': True,
            'data': report.to_dict(),
            'message': 'Отчёт создан'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@reports_bp.route('/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(report_id):
    """
    Обновить отчёт
    Доступ: admin, mchs
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        report = Report.query.get(report_id)

        if not report:
            return jsonify({'error': 'Отчёт не найден'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Данные не предоставлены'}), 400

        old_status = report.status

        # Обновляемые поля
        allowed_fields = ['title', 'period', 'period_start', 'period_end', 'type',
                          'status', 'stats', 'content', 'file_size',
                          'related_sensor_ids', 'related_evacuation_ids', 'related_zone_ids']

        for field in allowed_fields:
            if field in data:
                value = data[field]

                # Парсим даты
                if field in ['period_start', 'period_end'] and value:
                    try:
                        value = parser.parse(value).date()
                    except:
                        value = None

                setattr(report, field, value)

        # Если статус изменился на completed
        if 'status' in data and data['status'] == 'completed' and old_status != 'completed':
            report.completed_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'success': True,
            'data': report.to_dict(),
            'message': 'Отчёт обновлён'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@reports_bp.route('/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    """
    Удалить отчёт
    Доступ: admin
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type != 'admin':
        return jsonify({'error': 'Недостаточно прав доступа. Требуется роль admin'}), 403

    try:
        report = Report.query.get(report_id)

        if not report:
            return jsonify({'error': 'Отчёт не найден'}), 404

        db.session.delete(report)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Отчёт удалён'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@reports_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_report_stats():
    """
    Получить статистику по отчётам
    Доступ: admin, mchs
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    try:
        total = Report.query.count()
        completed = Report.query.filter_by(status='completed').count()
        drafts = Report.query.filter_by(status='draft').count()

        # Подсчет по типам
        weekly = Report.query.filter_by(type='weekly').count()
        monthly = Report.query.filter_by(type='monthly').count()
        incident = Report.query.filter_by(type='incident').count()
        evacuation = Report.query.filter_by(type='evacuation').count()

        return jsonify({
            'success': True,
            'data': {
                'total': total,
                'byStatus': {
                    'completed': completed,
                    'draft': drafts
                },
                'byType': {
                    'weekly': weekly,
                    'monthly': monthly,
                    'incident': incident,
                    'evacuation': evacuation
                }
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@reports_bp.route('/templates', methods=['GET'])
@jwt_required()
def get_report_templates():
    """
    Получить шаблоны отчётов
    Доступ: admin, mchs
    """
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')

    if user_type not in ['admin', 'mchs']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403

    templates = [
        {
            'id': 1,
            'name': 'Отчёт по инциденту',
            'type': 'incident',
            'description': 'Детальный отчёт о произошедшем инциденте',
            'fields': ['Дата', 'Локация', 'Описание', 'Действия', 'Результат']
        },
        {
            'id': 2,
            'name': 'Еженедельный отчёт',
            'type': 'weekly',
            'description': 'Сводка за неделю',
            'fields': ['Период', 'Статистика', 'Критические случаи', 'Рекомендации']
        },
        {
            'id': 3,
            'name': 'Месячный отчёт',
            'type': 'monthly',
            'description': 'Полный отчёт за месяц',
            'fields': ['Период', 'Общая статистика', 'Анализ', 'Планы']
        },
        {
            'id': 4,
            'name': 'Отчёт по эвакуации',
            'type': 'evacuation',
            'description': 'Детали проведённой эвакуации',
            'fields': ['Дата', 'Локация', 'Эвакуировано', 'Ресурсы', 'Итоги']
        }
    ]

    return jsonify({
        'success': True,
        'data': templates
    }), 200

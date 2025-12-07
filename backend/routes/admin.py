from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, User, HydroFacility, WaterBody, Sensor
from datetime import datetime, timedelta
import psutil
import os

admin_bp = Blueprint('admin', __name__)


def require_admin():
    """Проверка прав администратора"""
    claims = get_jwt()
    user_type = claims.get('user_type', 'user')
    if user_type not in ['admin', 'emergency']:
        return jsonify({'error': 'Недостаточно прав доступа'}), 403
    return None


# ==================== DASHBOARD ====================

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """
    Получить статистику для главной панели админки
    GET /api/admin/dashboard
    """
    error = require_admin()
    if error:
        return error

    try:
        # Статистика пользователей
        total_users = User.query.filter_by(is_active=True).count()
        active_users = User.query.filter(
            User.is_active == True,
            User.last_login >= datetime.utcnow() - timedelta(days=7)
        ).count()
        new_users = User.query.filter(
            User.created_at >= datetime.utcnow() - timedelta(days=7)
        ).count()

        # Статистика водоёмов
        total_waterbodies = WaterBody.query.count()
        critical_waterbodies = WaterBody.query.filter(WaterBody.technical_condition >= 4).count()

        # Статистика ГТС
        total_facilities = HydroFacility.query.count()
        operational_facilities = HydroFacility.query.filter_by(status='operational').count()
        critical_facilities = HydroFacility.query.filter(HydroFacility.technical_condition >= 4).count()

        # Статистика датчиков
        total_sensors = Sensor.query.filter_by(is_active=True).count()
        active_sensors = Sensor.query.filter_by(status='active', is_active=True).count()

        # Системные метрики (базовые)
        cpu_usage = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        # Распределение пользователей по ролям
        role_distribution = {
            'admin': User.query.filter_by(user_type='admin', is_active=True).count(),
            'expert': User.query.filter_by(user_type='expert', is_active=True).count(),
            'emergency': User.query.filter_by(user_type='emergency', is_active=True).count(),
            'user': User.query.filter_by(user_type='user', is_active=True).count(),
        }

        # Последние действия (mock данные - можно добавить таблицу Activity)
        recent_activities = [
            {
                'id': 1,
                'user': 'admin@example.com',
                'action': 'Обновление ГТС',
                'timestamp': (datetime.utcnow() - timedelta(minutes=15)).isoformat(),
                'type': 'update'
            },
            {
                'id': 2,
                'user': 'expert@example.com',
                'action': 'Добавление нового датчика',
                'timestamp': (datetime.utcnow() - timedelta(hours=1)).isoformat(),
                'type': 'create'
            }
        ]

        return jsonify({
            'success': True,
            'data': {
                'users': {
                    'total': total_users,
                    'active': active_users,
                    'new': new_users,
                    'roleDistribution': role_distribution
                },
                'waterbodies': {
                    'total': total_waterbodies,
                    'critical': critical_waterbodies
                },
                'facilities': {
                    'total': total_facilities,
                    'operational': operational_facilities,
                    'critical': critical_facilities,
                    'maintenance': total_facilities - operational_facilities
                },
                'sensors': {
                    'total': total_sensors,
                    'active': active_sensors,
                    'inactive': total_sensors - active_sensors
                },
                'systemMetrics': {
                    'cpu': round(cpu_usage, 1),
                    'memory': {
                        'used': round(memory.used / (1024 ** 3), 1),
                        'total': round(memory.total / (1024 ** 3), 1),
                        'percent': memory.percent
                    },
                    'disk': {
                        'used': round(disk.used / (1024 ** 3), 1),
                        'total': round(disk.total / (1024 ** 3), 1),
                        'percent': disk.percent
                    }
                },
                'recentActivities': recent_activities
            }
        }), 200

    except Exception as e:
        print(f'Ошибка получения статистики dashboard: {e}')
        return jsonify({'error': 'Ошибка при получении статистики'}), 500


# ==================== SYSTEM ANALYTICS ====================

@admin_bp.route('/analytics/system', methods=['GET'])
@jwt_required()
def get_system_analytics():
    """
    Получить системную аналитику
    GET /api/admin/analytics/system
    """
    error = require_admin()
    if error:
        return error

    try:
        # Системные метрики
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        # Network IO (если доступно)
        try:
            net_io = psutil.net_io_counters()
            network_stats = {
                'bytesSent': net_io.bytes_sent,
                'bytesRecv': net_io.bytes_recv,
                'packetsSent': net_io.packets_sent,
                'packetsRecv': net_io.packets_recv
            }
        except:
            network_stats = None

        # Mock данные для графиков (в реальности - из БД или метрик)
        cpu_history = [
            {'timestamp': (datetime.utcnow() - timedelta(hours=i)).isoformat(), 'value': 30 + i * 2}
            for i in range(24, 0, -1)
        ]

        memory_history = [
            {'timestamp': (datetime.utcnow() - timedelta(hours=i)).isoformat(), 'value': 50 + i}
            for i in range(24, 0, -1)
        ]

        # Статус сервисов
        services_status = [
            {'name': 'API Server', 'status': 'running', 'uptime': '7 days'},
            {'name': 'Database', 'status': 'running', 'uptime': '7 days'},
            {'name': 'Cache', 'status': 'running', 'uptime': '7 days'},
        ]

        return jsonify({
            'success': True,
            'data': {
                'current': {
                    'cpu': round(cpu_percent, 1),
                    'memory': {
                        'used': round(memory.used / (1024 ** 3), 2),
                        'total': round(memory.total / (1024 ** 3), 2),
                        'percent': round(memory.percent, 1)
                    },
                    'disk': {
                        'used': round(disk.used / (1024 ** 3), 2),
                        'total': round(disk.total / (1024 ** 3), 2),
                        'percent': round(disk.percent, 1)
                    },
                    'network': network_stats
                },
                'history': {
                    'cpu': cpu_history,
                    'memory': memory_history
                },
                'services': services_status,
                'database': {
                    'size': '2.4 GB',
                    'tables': 8,
                    'connections': 5
                }
            }
        }), 200

    except Exception as e:
        print(f'Ошибка получения системной аналитики: {e}')
        return jsonify({'error': 'Ошибка при получении системной аналитики'}), 500


# ==================== AI MODELS ====================

@admin_bp.route('/ai/models', methods=['GET'])
@jwt_required()
def get_ai_models():
    """
    Получить список AI моделей (mock данные)
    GET /api/admin/ai/models
    """
    error = require_admin()
    if error:
        return error

    try:
        # Mock данные для AI моделей
        models = [
            {
                'id': 'lstm-water-level',
                'name': 'Прогнозирование уровня воды',
                'type': 'LSTM',
                'version': '1.2.0',
                'status': 'active',
                'accuracy': 94.2,
                'lastTrained': (datetime.utcnow() - timedelta(days=3)).isoformat(),
                'datasetSize': 50000,
                'parameters': {
                    'epochs': 100,
                    'batchSize': 32,
                    'learningRate': 0.001,
                    'layers': 3,
                    'neurons': 128
                },
                'metrics': {
                    'mse': 0.042,
                    'rmse': 0.205,
                    'mae': 0.156,
                    'r2': 0.942
                },
                'resources': {
                    'cpu': 15,
                    'memory': 2.4,
                    'gpu': 0
                },
                'predictions': 12453
            },
            {
                'id': 'rf-condition',
                'name': 'Классификация технического состояния',
                'type': 'Random Forest',
                'version': '1.0.3',
                'status': 'active',
                'accuracy': 89.7,
                'lastTrained': (datetime.utcnow() - timedelta(days=7)).isoformat(),
                'datasetSize': 30000,
                'parameters': {
                    'nEstimators': 200,
                    'maxDepth': 15,
                    'minSamplesSplit': 5,
                    'minSamplesLeaf': 2
                },
                'metrics': {
                    'precision': 0.892,
                    'recall': 0.901,
                    'f1Score': 0.897,
                    'auc': 0.945
                },
                'resources': {
                    'cpu': 8,
                    'memory': 1.2,
                    'gpu': 0
                },
                'predictions': 8234
            }
        ]

        return jsonify({
            'success': True,
            'data': models,
            'count': len(models)
        }), 200

    except Exception as e:
        print(f'Ошибка получения AI моделей: {e}')
        return jsonify({'error': 'Ошибка при получении AI моделей'}), 500


# ==================== NOTIFICATION TEMPLATES ====================

@admin_bp.route('/notifications/templates', methods=['GET'])
@jwt_required()
def get_notification_templates():
    """
    Получить шаблоны уведомлений (mock данные)
    GET /api/admin/notifications/templates
    """
    error = require_admin()
    if error:
        return error

    try:
        # Mock данные для шаблонов уведомлений
        templates = [
            {
                'id': 1,
                'name': 'Критическое состояние ГТС',
                'type': 'facility_critical',
                'channels': ['email', 'sms', 'push'],
                'recipients': ['admin', 'emergency'],
                'subject': 'Критическое состояние ГТС: {facility_name}',
                'body': 'ГТС {facility_name} находится в критическом состоянии. Требуется немедленная проверка.',
                'trigger': 'condition',
                'enabled': True,
                'lastSent': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                'sentCount': 15
            },
            {
                'id': 2,
                'name': 'Высокий приоритет обследования',
                'type': 'priority_high',
                'channels': ['email', 'push'],
                'recipients': ['expert', 'admin'],
                'subject': 'Объект требует обследования: {object_name}',
                'body': 'Объект {object_name} имеет высокий приоритет для обследования.',
                'trigger': 'priority',
                'enabled': True,
                'lastSent': (datetime.utcnow() - timedelta(days=1)).isoformat(),
                'sentCount': 42
            },
            {
                'id': 3,
                'name': 'Устаревший паспорт объекта',
                'type': 'passport_expired',
                'channels': ['email'],
                'recipients': ['admin', 'expert'],
                'subject': 'Требуется обновление паспорта: {object_name}',
                'body': 'Паспорт объекта {object_name} устарел. Год паспортизации: {passport_year}',
                'trigger': 'passport_age',
                'enabled': True,
                'lastSent': (datetime.utcnow() - timedelta(days=3)).isoformat(),
                'sentCount': 28
            },
            {
                'id': 4,
                'name': 'Еженедельный отчёт',
                'type': 'report_weekly',
                'channels': ['email'],
                'recipients': ['admin', 'emergency', 'expert'],
                'subject': 'Еженедельный отчёт мониторинга',
                'body': 'Сводка за неделю: {summary}',
                'trigger': 'schedule',
                'enabled': True,
                'lastSent': (datetime.utcnow() - timedelta(days=7)).isoformat(),
                'sentCount': 156
            },
            {
                'id': 5,
                'name': 'Новый пользователь зарегистрирован',
                'type': 'user_registered',
                'channels': ['email'],
                'recipients': ['admin'],
                'subject': 'Новая регистрация: {user_email}',
                'body': 'Пользователь {user_name} ({user_email}) зарегистрировался в системе.',
                'trigger': 'user_action',
                'enabled': True,
                'lastSent': (datetime.utcnow() - timedelta(hours=12)).isoformat(),
                'sentCount': 89
            },
            {
                'id': 6,
                'name': 'Изменение данных объекта',
                'type': 'object_updated',
                'channels': ['push'],
                'recipients': ['admin', 'expert'],
                'subject': 'Обновлены данные: {object_name}',
                'body': 'Данные объекта {object_name} были обновлены пользователем {user_name}.',
                'trigger': 'data_change',
                'enabled': False,
                'lastSent': (datetime.utcnow() - timedelta(days=5)).isoformat(),
                'sentCount': 234
            }
        ]

        return jsonify({
            'success': True,
            'data': templates,
            'count': len(templates)
        }), 200

    except Exception as e:
        print(f'Ошибка получения шаблонов уведомлений: {e}')
        return jsonify({'error': 'Ошибка при получении шаблонов'}), 500


# ==================== LOGS ====================

@admin_bp.route('/logs', methods=['GET'])
@jwt_required()
def get_system_logs():
    """
    Получить логи системы (mock данные)
    GET /api/admin/logs
    Query params: level, type, user, limit, offset
    """
    error = require_admin()
    if error:
        return error

    try:
        # Параметры фильтрации
        level_filter = request.args.get('level')  # info, success, warning, error
        type_filter = request.args.get('type')  # auth, database, crud, system, security
        user_filter = request.args.get('user')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))

        # Mock данные для логов
        all_logs = [
            {
                'id': 1,
                'timestamp': (datetime.utcnow() - timedelta(minutes=5)).isoformat(),
                'level': 'info',
                'type': 'auth',
                'user': 'admin@example.com',
                'action': 'Успешный вход в систему',
                'details': 'IP: 192.168.1.100',
                'ipAddress': '192.168.1.100'
            },
            {
                'id': 2,
                'timestamp': (datetime.utcnow() - timedelta(minutes=15)).isoformat(),
                'level': 'success',
                'type': 'crud',
                'user': 'expert@example.com',
                'action': 'Создание нового водоёма',
                'details': 'Озеро Балхаш добавлено',
                'ipAddress': '192.168.1.105'
            },
            {
                'id': 3,
                'timestamp': (datetime.utcnow() - timedelta(hours=1)).isoformat(),
                'level': 'warning',
                'type': 'system',
                'user': 'system',
                'action': 'Высокая загрузка CPU',
                'details': 'CPU usage: 85%',
                'ipAddress': 'localhost'
            },
            {
                'id': 4,
                'timestamp': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                'level': 'error',
                'type': 'database',
                'user': 'system',
                'action': 'Ошибка подключения к БД',
                'details': 'Connection timeout after 30s',
                'ipAddress': 'localhost'
            },
            {
                'id': 5,
                'timestamp': (datetime.utcnow() - timedelta(hours=3)).isoformat(),
                'level': 'info',
                'type': 'crud',
                'user': 'admin@example.com',
                'action': 'Обновление ГТС',
                'details': 'ГЭС "Бухтарминская" обновлена',
                'ipAddress': '192.168.1.100'
            },
            {
                'id': 6,
                'timestamp': (datetime.utcnow() - timedelta(hours=5)).isoformat(),
                'level': 'warning',
                'type': 'security',
                'user': 'unknown',
                'action': 'Неудачная попытка входа',
                'details': 'Неверный пароль для user@test.com',
                'ipAddress': '45.67.89.123'
            }
        ]

        # Фильтрация
        filtered_logs = all_logs
        if level_filter:
            filtered_logs = [log for log in filtered_logs if log['level'] == level_filter]
        if type_filter:
            filtered_logs = [log for log in filtered_logs if log['type'] == type_filter]
        if user_filter:
            filtered_logs = [log for log in filtered_logs if user_filter.lower() in log['user'].lower()]

        # Пагинация
        total = len(filtered_logs)
        paginated_logs = filtered_logs[offset:offset + limit]

        return jsonify({
            'success': True,
            'data': paginated_logs,
            'total': total,
            'limit': limit,
            'offset': offset
        }), 200

    except Exception as e:
        print(f'Ошибка получения логов: {e}')
        return jsonify({'error': 'Ошибка при получении логов'}), 500

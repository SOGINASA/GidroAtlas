# seed_data.py — адаптирован под обновлённую схему БД
from models import *
from datetime import datetime, date, timedelta
import json
import random

def seed_users():
    """Создаёт синтетические данные пользователей для каждой роли"""
    
    # Данные для пользователей
    user_data = [
        # Обычные пользователи (user)
        {
            'email': 'user1@example.com',
            'password': 'password123',
            'full_name': 'Иван Петров',
            'user_type': 'user',
            'phone': '+79991234567',
            'address': 'ул. Ленина, 10, Москва',
        },
        {
            'email': 'user2@example.com',
            'password': 'password123',
            'full_name': 'Мария Иванова',
            'user_type': 'user',
            'phone': '+79992345678',
            'address': 'ул. Пушкина, 20, СПб',
        },
        {
            'email': 'user3@example.com',
            'password': 'password123',
            'full_name': 'Сергей Сидоров',
            'user_type': 'user',
            'phone': '+79993456789',
            'address': 'ул. Толстого, 5, Казань',
        },
        # Эксперты (expert)
        {
            'email': 'expert@example.com',
            'password': 'expert123',
            'full_name': 'Дмитрий Эксперт',
            'user_type': 'expert',
            'phone': '+79996543210',
            'address': 'ул. Научная, 25, Москва',
        },
        # Администраторы (admin)
        {
            'email': 'admin@example.com',
            'password': 'admin123',
            'full_name': 'Александр Администратор',
            'user_type': 'admin',
            'phone': '+79994567890',
            'address': 'ул. Советская, 1, Москва',
        },
        # МЧС (emergency - экстренные службы)
        {
            'email': 'emergency@example.com',
            'password': 'emergency123',
            'full_name': 'Антон МЧС',
            'user_type': 'emergency',
            'phone': '+79995678901',
            'address': 'ул. Спасателей, 15, Москва',
        },
    ]
    
    # Проверяем, не существуют ли уже пользователи
    existing_users = User.query.filter_by(email=user_data[0]['email']).first()
    if existing_users:
        print("Пользователи уже созданы")
        return
    
    # Создаём пользователей
    for user_info in user_data:
        user = User(
            email=user_info['email'],
            full_name=user_info['full_name'],
            user_type=user_info['user_type'],
            phone=user_info['phone'],
            address=user_info['address'],
            is_active=True,
            is_verified=True,
            created_at=datetime.utcnow(),
        )
        user.set_password(user_info['password'])
        db.session.add(user)
        print(f"  Email: {user_info['email']} | Пароль: {user_info['password']} | Роль: {user_info['user_type']}")
    
    db.session.commit()
    print("[OK] Все пользователи успешно добавлены в БД")

def seed_sensors():
    """Создает 8 датчиков для мониторинга реки Ишим"""
    from models import Sensor

    # Проверяем, не существуют ли уже датчики
    if Sensor.query.first():
        print("Датчики уже созданы")
        return

    sensors_data = [
    {'id': 'sensor-1', 'name': 'Речной порт', 'location': 'Точка мониторинга №1', 'latitude': 54.910746, 'longitude': 69.128099, 'water_level': 3.72, 'status': 'active', 'description': 'Датчик на Речном порту'},
    {'id': 'sensor-2', 'name': 'Датчик №2', 'location': 'Точка мониторинга №2', 'latitude': 54.903939, 'longitude': 69.129221, 'water_level': 4.05, 'status': 'active', 'description': 'Датчик на точке №2'},
    {'id': 'sensor-3', 'name': 'Пёстрое', 'location': 'Точка мониторинга №3', 'latitude': 54.894783, 'longitude': 69.128507, 'water_level': 4.33, 'status': 'warning', 'description': 'Датчик на Пёстром участке'},
    {'id': 'sensor-4', 'name': 'Датчик №4', 'location': 'Точка мониторинга №4', 'latitude': 54.882924, 'longitude': 69.117075, 'water_level': 3.88, 'status': 'active', 'description': 'Датчик на точке №4'},
    {'id': 'sensor-5', 'name': 'Датчик №5', 'location': 'Точка мониторинга №5', 'latitude': 54.889793, 'longitude': 69.105847, 'water_level': 4.12, 'status': 'active', 'description': 'Датчик на точке №5'},
    {'id': 'sensor-6', 'name': 'Датчик №6', 'location': 'Точка мониторинга №6', 'latitude': 54.886447, 'longitude': 69.098192, 'water_level': 3.95, 'status': 'active', 'description': 'Датчик на точке №6'},
    {'id': 'sensor-7', 'name': 'Датчик №7', 'location': 'Точка мониторинга №7', 'latitude': 54.883098, 'longitude': 69.081809, 'water_level': 4.42, 'status': 'active', 'description': 'Датчик на точке №7'},
    {'id': 'sensor-8', 'name': 'Датчик №8', 'location': 'Точка мониторинга №8', 'latitude': 54.877279, 'longitude': 69.082573, 'water_level': 4.00, 'status': 'active', 'description': 'Датчик на точке №8'},
    {'id': 'sensor-9', 'name': 'Датчик №9', 'location': 'Точка мониторинга №9', 'latitude': 54.874643, 'longitude': 69.071891, 'water_level': 4.25, 'status': 'active', 'description': 'Датчик на точке №9'},
    {'id': 'sensor-10', 'name': 'Датчик №10', 'location': 'Точка мониторинга №10', 'latitude': 54.875869, 'longitude': 69.062264, 'water_level': 3.98, 'status': 'active', 'description': 'Датчик на точке №10'},
    {'id': 'sensor-11', 'name': 'Датчик №11', 'location': 'Точка мониторинга №11', 'latitude': 54.873087, 'longitude': 69.054938, 'water_level': 4.18, 'status': 'active', 'description': 'Датчик на точке №11'},
    {'id': 'sensor-12', 'name': 'Датчик №12', 'location': 'Точка мониторинга №12', 'latitude': 54.869493, 'longitude': 69.060150, 'water_level': 4.05, 'status': 'active', 'description': 'Датчик на точке №12'},
    {'id': 'sensor-13', 'name': 'Датчик №13', 'location': 'Точка мониторинга №13', 'latitude': 54.866295, 'longitude': 69.056845, 'water_level': 4.22, 'status': 'warning', 'description': 'Датчик на точке №13'},
    {'id': 'sensor-14', 'name': 'Датчик №14', 'location': 'Точка мониторинга №14', 'latitude': 54.861829, 'longitude': 69.044367, 'water_level': 3.85, 'status': 'active', 'description': 'Датчик на точке №14'},
    {'id': 'sensor-15', 'name': 'Датчик №15', 'location': 'Точка мониторинга №15', 'latitude': 54.854704, 'longitude': 69.041805, 'water_level': 3.90, 'status': 'active', 'description': 'Датчик на точке №15'},
    {'id': 'sensor-16', 'name': 'Датчик №16', 'location': 'Точка мониторинга №16', 'latitude': 54.854393, 'longitude': 69.047904, 'water_level': 3.95, 'status': 'active', 'description': 'Датчик на точке №16'},
    {'id': 'sensor-17', 'name': 'Датчик №17', 'location': 'Точка мониторинга №17', 'latitude': 54.855328, 'longitude': 69.054038, 'water_level': 4.00, 'status': 'active', 'description': 'Датчик на точке №17'},
    {'id': 'sensor-18', 'name': 'Датчик №18', 'location': 'Точка мониторинга №18', 'latitude': 54.848617, 'longitude': 69.053822, 'water_level': 4.05, 'status': 'active', 'description': 'Датчик на точке №18'},
    {'id': 'sensor-19', 'name': 'Датчик №19', 'location': 'Точка мониторинга №19', 'latitude': 54.839412, 'longitude': 69.049667, 'water_level': 4.10, 'status': 'active', 'description': 'Датчик на точке №19'},
    {'id': 'sensor-20', 'name': 'Датчик №20', 'location': 'Точка мониторинга №20', 'latitude': 54.831417, 'longitude': 69.060946, 'water_level': 4.15, 'status': 'active', 'description': 'Датчик на точке №20'},
    {'id': 'sensor-21', 'name': 'Датчик №21', 'location': 'Точка мониторинга №21', 'latitude': 54.826066, 'longitude': 69.041144, 'water_level': 4.20, 'status': 'active', 'description': 'Датчик на точке №21'},
    {'id': 'sensor-22', 'name': 'Датчик №22', 'location': 'Точка мониторинга №22', 'latitude': 54.817922, 'longitude': 69.041910, 'water_level': 4.25, 'status': 'active', 'description': 'Датчик на точке №22'},
    {'id': 'sensor-23', 'name': 'Датчик №23', 'location': 'Точка мониторинга №23', 'latitude': 54.805305, 'longitude': 69.025527, 'water_level': 4.30, 'status': 'active', 'description': 'Датчик на точке №23'},
    {'id': 'sensor-24', 'name': 'Датчик №24', 'location': 'Точка мониторинга №24', 'latitude': 54.798745, 'longitude': 69.000571, 'water_level': 4.35, 'status': 'active', 'description': 'Датчик на точке №24'},
    {'id': 'sensor-25', 'name': 'Датчик №25', 'location': 'Точка мониторинга №25', 'latitude': 54.786034, 'longitude': 68.998581, 'water_level': 4.40, 'status': 'warning', 'description': 'Датчик на точке №25'},
    {'id': 'sensor-26', 'name': 'Датчик №26', 'location': 'Точка мониторинга №26', 'latitude': 54.776086, 'longitude': 68.973216, 'water_level': 4.45, 'status': 'active', 'description': 'Датчик на точке №26'},
    {'id': 'sensor-27', 'name': 'Датчик №27', 'location': 'Точка мониторинга №27', 'latitude': 54.916863, 'longitude': 69.124826, 'water_level': 4.50, 'status': 'active', 'description': 'Датчик на точке №27'},
    {'id': 'sensor-28', 'name': 'Датчик №28', 'location': 'Точка мониторинга №28', 'latitude': 54.923037, 'longitude': 69.121579, 'water_level': 4.55, 'status': 'active', 'description': 'Датчик на точке №28'},
    {'id': 'sensor-29', 'name': 'Датчик №29', 'location': 'Точка мониторинга №29', 'latitude': 54.933848, 'longitude': 69.119516, 'water_level': 4.60, 'status': 'warning', 'description': 'Датчик на точке №29'},
    {'id': 'sensor-30', 'name': 'Датчик №30', 'location': 'Точка мониторинга №30', 'latitude': 54.927937, 'longitude': 69.105739, 'water_level': 4.65, 'status': 'active', 'description': 'Датчик на точке №30'},
    {'id': 'sensor-31', 'name': 'Датчик №31', 'location': 'Точка мониторинга №31', 'latitude': 54.933365, 'longitude': 69.097574, 'water_level': 4.70, 'status': 'active', 'description': 'Датчик на точке №31'},
    {'id': 'sensor-32', 'name': 'Датчик №32', 'location': 'Точка мониторинга №32', 'latitude': 54.937479, 'longitude': 69.113202, 'water_level': 4.75, 'status': 'active', 'description': 'Датчик на точке №32'},
    {'id': 'sensor-33', 'name': 'Датчик №33', 'location': 'Точка мониторинга №33', 'latitude': 54.939153, 'longitude': 69.126038, 'water_level': 4.80, 'status': 'active', 'description': 'Датчик на точке №33'},
    {'id': 'sensor-34', 'name': 'Датчик №34', 'location': 'Точка мониторинга №34', 'latitude': 54.946456, 'longitude': 69.098696, 'water_level': 4.85, 'status': 'warning', 'description': 'Датчик на точке №34'},
    {'id': 'sensor-35', 'name': 'Датчик №35', 'location': 'Точка мониторинга №35', 'latitude': 54.952834, 'longitude': 69.112049, 'water_level': 4.90, 'status': 'active', 'description': 'Датчик на точке №35'},
    {'id': 'sensor-36', 'name': 'Датчик №36', 'location': 'Точка мониторинга №36', 'latitude': 54.898201, 'longitude': 69.091147, 'water_level': 4.95, 'status': 'active', 'description': 'Датчик на точке №36'},
    {'id': 'sensor-37', 'name': 'Датчик №37', 'location': 'Точка мониторинга №37', 'latitude': 54.898480, 'longitude': 69.108383, 'water_level': 5.00, 'status': 'active', 'description': 'Датчик на точке №37'},
    {'id': 'sensor-38', 'name': 'Датчик №38', 'location': 'Точка мониторинга №38', 'latitude': 54.891255, 'longitude': 69.079130, 'water_level': 5.05, 'status': 'warning', 'description': 'Датчик на точке №38'},
    {'id': 'sensor-39', 'name': 'Датчик №39', 'location': 'Точка мониторинга №39', 'latitude': 54.880293, 'longitude': 69.075792, 'water_level': 5.10, 'status': 'active', 'description': 'Датчик на точке №39'},
    {'id': 'sensor-40', 'name': 'Датчик №40', 'location': 'Точка мониторинга №40', 'latitude': 54.886921, 'longitude': 69.055985, 'water_level': 5.15, 'status': 'active', 'description': 'Датчик на точке №40'},
    {'id': 'sensor-41', 'name': 'Датчик №41', 'location': 'Точка мониторинга №41', 'latitude': 54.858860, 'longitude': 69.105690, 'water_level': 5.20, 'status': 'active', 'description': 'Датчик на точке №41'},
    {'id': 'sensor-42', 'name': 'Датчик №42', 'location': 'Точка мониторинга №42', 'latitude': 54.848016, 'longitude': 69.090461, 'water_level': 5.25, 'status': 'active', 'description': 'Датчик на точке №42'},
    {'id': 'sensor-43', 'name': 'Датчик №43', 'location': 'Точка мониторинга №43', 'latitude': 54.841990, 'longitude': 69.065489, 'water_level': 5.30, 'status': 'active', 'description': 'Датчик на точке №43'},
    {'id': 'sensor-44', 'name': 'Датчик №44', 'location': 'Точка мониторинга №44', 'latitude': 54.839455, 'longitude': 69.130590, 'water_level': 5.35, 'status': 'active', 'description': 'Датчик на точке №44'},
    {'id': 'sensor-45', 'name': 'Датчик №45', 'location': 'Точка мониторинга №45', 'latitude': 54.837002, 'longitude': 69.110165, 'water_level': 5.40, 'status': 'warning', 'description': 'Датчик на точке №45'},
    {'id': 'sensor-46', 'name': 'Датчик №46', 'location': 'Точка мониторинга №46', 'latitude': 54.824364, 'longitude': 69.145098, 'water_level': 5.45, 'status': 'active', 'description': 'Датчик на точке №46'},
    {'id': 'sensor-47', 'name': 'Датчик №47', 'location': 'Точка мониторинга №47', 'latitude': 54.827847, 'longitude': 69.074496, 'water_level': 5.50, 'status': 'active', 'description': 'Датчик на точке №47'},
    {'id': 'sensor-48', 'name': 'Датчик №48', 'location': 'Точка мониторинга №48', 'latitude': 54.822005, 'longitude': 69.053373, 'water_level': 5.55, 'status': 'active', 'description': 'Датчик на точке №48'},
]




    for sensor_data in sensors_data:
        if Sensor.query.filter_by(id=sensor_data['id']).first():
            print(f"  Датчик {sensor_data['id']} уже существует, пропуск...")
            continue
        sensor = Sensor(**sensor_data)
        sensor.last_update = datetime.utcnow()
        db.session.add(sensor)
        print(f"  Создан датчик: {sensor.name}")


    db.session.commit()
    print("[OK] Все датчики успешно добавлены")


def seed_risk_zones():
    """Создает зоны риска"""
    from models import RiskZone

    if RiskZone.query.first():
        print("Зоны риска уже созданы")
        return

    zones_data = [
    {
        'id': 'zone-medium-1',
        'name': 'Зона среднего риска - Речной порт',
        'type': 'medium',
        'coordinates': [
            {'lat': 54.9050, 'lng': 69.1250},
            {'lat': 54.9150, 'lng': 69.1250},
            {'lat': 54.9150, 'lng': 69.1350},
            {'lat': 54.9050, 'lng': 69.1350}
        ],
        'residents_count': 1200,
        'related_sensor_ids': ['sensor-1','sensor-2','sensor-3']
    },
    {
        'id': 'zone-medium-2',
        'name': 'Зона среднего риска - Пёстрое',
        'type': 'medium',
        'coordinates': [
            {'lat': 54.8800, 'lng': 69.1200},
            {'lat': 54.8900, 'lng': 69.1200},
            {'lat': 54.8900, 'lng': 69.1300},
            {'lat': 54.8800, 'lng': 69.1300}
        ],
        'residents_count': 950,
        'related_sensor_ids': ['sensor-4','sensor-5','sensor-6']
    },
    {
        'id': 'zone-medium-3',
        'name': 'Зона среднего риска - Заречный',
        'type': 'medium',
        'coordinates': [
            {'lat': 54.8350, 'lng': 69.1100},
            {'lat': 54.8450, 'lng': 69.1100},
            {'lat': 54.8450, 'lng': 69.1200},
            {'lat': 54.8350, 'lng': 69.1200}
        ],
        'residents_count': 800,
        'related_sensor_ids': ['sensor-7','sensor-8','sensor-9']
    },
    {
        'id': 'zone-low-1',
        'name': 'Зона низкого риска - Кожевенный',
        'type': 'low',
        'coordinates': [
            {'lat': 54.8450, 'lng': 69.1500},
            {'lat': 54.8550, 'lng': 69.1500},
            {'lat': 54.8550, 'lng': 69.1600},
            {'lat': 54.8450, 'lng': 69.1600}
        ],
        'residents_count': 1400,
        'related_sensor_ids': ['sensor-10','sensor-11','sensor-12']
    },
    {
        'id': 'zone-low-2',
        'name': 'Зона низкого риска - Хромзавод',
        'type': 'low',
        'coordinates': [
            {'lat': 54.8600, 'lng': 69.1000},
            {'lat': 54.8700, 'lng': 69.1000},
            {'lat': 54.8700, 'lng': 69.1100},
            {'lat': 54.8600, 'lng': 69.1100}
        ],
        'residents_count': 900,
        'related_sensor_ids': ['sensor-13','sensor-14','sensor-15']
    },
    {
        'id': 'zone-low-3',
        'name': 'Зона низкого риска - Дачи',
        'type': 'low',
        'coordinates': [
            {'lat': 54.8300, 'lng': 69.1600},
            {'lat': 54.8400, 'lng': 69.1600},
            {'lat': 54.8400, 'lng': 69.1700},
            {'lat': 54.8300, 'lng': 69.1700}
        ],
        'residents_count': 0,
        'related_sensor_ids': ['sensor-16','sensor-17','sensor-18']
    },
    {
        'id': 'zone-low-4',
        'name': 'Зона низкого риска - Косогор',
        'type': 'low',
        'coordinates': [
            {'lat': 54.8650, 'lng': 69.1700},
            {'lat': 54.8750, 'lng': 69.1700},
            {'lat': 54.8750, 'lng': 69.1800},
            {'lat': 54.8650, 'lng': 69.1800}
        ],
        'residents_count': 750,
        'related_sensor_ids': ['sensor-19','sensor-20','sensor-21']
    },
    {
        'id': 'zone-low-5',
        'name': 'Зона низкого риска - Набережная',
        'type': 'low',
        'coordinates': [
            {'lat': 54.8750, 'lng': 69.1400},
            {'lat': 54.8850, 'lng': 69.1400},
            {'lat': 54.8850, 'lng': 69.1500},
            {'lat': 54.8750, 'lng': 69.1500}
        ],
        'residents_count': 600,
        'related_sensor_ids': ['sensor-22','sensor-23','sensor-24']
    },
    {
        'id': 'zone-low-6',
        'name': 'Зона низкого риска - Центр',
        'type': 'low',
        'coordinates': [
            {'lat': 54.8600, 'lng': 69.1400},
            {'lat': 54.8700, 'lng': 69.1400},
            {'lat': 54.8700, 'lng': 69.1550},
            {'lat': 54.8600, 'lng': 69.1550}
        ],
        'residents_count': 15000,
        'related_sensor_ids': ['sensor-25','sensor-26','sensor-27','sensor-28']
    },
    {
        'id': 'zone-high-1',
        'name': 'Зона высокого риска - Северо-Запад',
        'type': 'high',
        'coordinates': [
            {'lat': 54.9200, 'lng': 69.1200},
            {'lat': 54.9300, 'lng': 69.1200},
            {'lat': 54.9300, 'lng': 69.1300},
            {'lat': 54.9200, 'lng': 69.1300}
        ],
        'residents_count': 1100,
        'related_sensor_ids': ['sensor-29','sensor-30','sensor-31']
    },
    {
        'id': 'zone-high-2',
        'name': 'Зона высокого риска - Восток',
        'type': 'high',
        'coordinates': [
            {'lat': 54.9400, 'lng': 69.1100},
            {'lat': 54.9500, 'lng': 69.1100},
            {'lat': 54.9500, 'lng': 69.1250},
            {'lat': 54.9400, 'lng': 69.1250}
        ],
        'residents_count': 900,
        'related_sensor_ids': ['sensor-32','sensor-33','sensor-34']
    },
    {
        'id': 'zone-high-3',
        'name': 'Зона высокого риска - Юг',
        'type': 'high',
        'coordinates': [
            {'lat': 54.8250, 'lng': 69.0500},
            {'lat': 54.8350, 'lng': 69.0500},
            {'lat': 54.8350, 'lng': 69.0650},
            {'lat': 54.8250, 'lng': 69.0650}
        ],
        'residents_count': 750,
        'related_sensor_ids': ['sensor-35','sensor-36','sensor-37']
    },
    {
        'id': 'zone-high-4',
        'name': 'Зона высокого риска - Юго-Запад',
        'type': 'high',
        'coordinates': [
            {'lat': 54.8350, 'lng': 69.1300},
            {'lat': 54.8450, 'lng': 69.1300},
            {'lat': 54.8450, 'lng': 69.1450},
            {'lat': 54.8350, 'lng': 69.1450}
        ],
        'residents_count': 820,
        'related_sensor_ids': ['sensor-38','sensor-39','sensor-40','sensor-41']
    },
    {
        'id': 'zone-high-5',
        'name': 'Зона высокого риска - Северо-Восток',
        'type': 'high',
        'coordinates': [
            {'lat': 54.8500, 'lng': 69.1000},
            {'lat': 54.8600, 'lng': 69.1000},
            {'lat': 54.8600, 'lng': 69.1150},
            {'lat': 54.8500, 'lng': 69.1150}
        ],
        'residents_count': 950,
        'related_sensor_ids': ['sensor-42','sensor-43','sensor-44','sensor-45','sensor-46','sensor-47','sensor-48']
    }
]


    for zone_data in zones_data:
        # Вычисляем текущий уровень воды и статус зоны на основе связанных датчиков (если есть)
        related = zone_data.get('related_sensor_ids') or []
        wl_values = []
        danger_levels = []
        for sid in related:
            s = Sensor.query.filter_by(id=sid).first()
            if s:
                try:
                    wl_values.append(float(s.water_level))
                except Exception:
                    pass
                danger_levels.append(s.get_danger_level())

        water_level = max(wl_values) if wl_values else 0.0

        # Простая логика порога по типу зоны (можно настроить)
        if zone_data.get('type') == 'high':
            threshold = 6.0
        elif zone_data.get('type') == 'medium':
            threshold = 4.5
        else:
            threshold = 3.5

        # Тренд: если текущий уровень превышает порог — rising, иначе stable
        trend = 'rising' if water_level >= threshold else 'stable'

        # Статус: критический если есть критические датчики или вода значительно выше порога
        if 'critical' in danger_levels or water_level >= threshold * 1.1:
            status = 'critical'
        elif 'danger' in danger_levels or water_level >= threshold:
            status = 'warning'
        else:
            status = 'monitoring'

        zone = RiskZone(
            id=zone_data.get('id'),
            name=zone_data.get('name'),
            type=zone_data.get('type'),
            location=zone_data.get('name'),
            region=zone_data.get('region', 'Неизвестен'),
            coordinates=zone_data.get('coordinates'),
            water_level=water_level,
            threshold=threshold,
            trend=trend,
            residents_count=zone_data.get('residents_count', 0),
            affected_population=zone_data.get('residents_count', 0),
            evacuated_count=0,
            related_sensor_ids=zone_data.get('related_sensor_ids'),
            status=status,
            description=zone_data.get('description')
        )
        db.session.add(zone)
        print(f"  Создана зона: {zone.name} (status={status} wl={water_level})")

    db.session.commit()
    print("[OK] Все зоны риска добавлены")


def seed_hydro_facilities():
    """Создаёт несколько тестовых записей гидротехнических сооружений (ГТС)"""
    from models import HydroFacility

    if HydroFacility.query.first():
        print("ГТС уже созданы")
        return

    # Получаем водные объекты для связывания
    from models import WaterBody
    wb_karatomar = WaterBody.query.filter_by(name='Река Каратомар').first()
    wb_irtysh = WaterBody.query.filter_by(name='Река Иртыш').first()
    wb_ili = WaterBody.query.filter_by(name='Река Или').first()
    wb_balkhash = WaterBody.query.filter_by(name='Озеро Балхаш').first()
    wb_ural = WaterBody.query.filter_by(name='Река Урал').first()
    wb_ishim = WaterBody.query.filter_by(name='Река Ишим').first()
    wb_zaisan = WaterBody.query.filter_by(name='Озеро Зайсан').first()

    facilities = [
        {
            'name': 'Каратомарская плотина',
            'type': 'Плотина',
            'region': 'Алматинская область',
            'water_body': 'Река Каратомар',
            'water_body_id': wb_karatomar.id if wb_karatomar else None,
            'capacity': 120.0,
            'year_built': 2005,
            'passport_year': 2010,
            'status': 'operational',
            'technical_condition': 5,
            'risk_score': 95,
            'risk_level': 'high',
            'issues': 8,
            'alerts': 3,
            'last_inspection': date(2024, 12, 1),
            'coordinates': {'lat': 43.25, 'lng': 76.95},
            'description': 'Плотина на реке Каратомар, требует срочного обследования'
        },
        {
            'name': 'Усть-Каменогорская ГЭС',
            'type': 'ГЭС',
            'region': 'Восточно-Казахстанская область',
            'water_body': 'Река Иртыш',
            'water_body_id': wb_irtysh.id if wb_irtysh else None,
            'capacity': 331.2,
            'year_built': 1952,
            'passport_year': 2015,
            'status': 'operational',
            'technical_condition': 4,
            'risk_score': 75,
            'risk_level': 'high',
            'issues': 5,
            'alerts': 2,
            'last_inspection': date(2024, 8, 5),
            'coordinates': {'lat': 50.00, 'lng': 82.61},
            'description': 'Крупная ГЭС на реке Иртыш'
        },
        {
            'name': 'Бухтарминская ГЭС',
            'type': 'ГЭС',
            'region': 'Восточно-Казахстанская область',
            'water_body': 'Река Иртыш',
            'water_body_id': wb_irtysh.id if wb_irtysh else None,
            'capacity': 675.0,
            'year_built': 1966,
            'passport_year': 2012,
            'status': 'operational',
            'technical_condition': 3,
            'risk_score': 55,
            'risk_level': 'medium',
            'issues': 2,
            'alerts': 1,
            'last_inspection': date(2024, 10, 15),
            'coordinates': {'lat': 49.87, 'lng': 83.05},
            'description': 'ГЭС на Бухтарминском водохранилище'
        },
        {
            'name': 'Шульбинская ГЭС',
            'type': 'ГЭС',
            'region': 'Восточно-Казахстанская область',
            'water_body': 'Река Иртыш',
            'water_body_id': wb_irtysh.id if wb_irtysh else None,
            'capacity': 702.0,
            'year_built': 1987,
            'passport_year': 2013,
            'status': 'operational',
            'technical_condition': 3,
            'risk_score': 50,
            'risk_level': 'medium',
            'issues': 3,
            'alerts': 1,
            'last_inspection': date(2024, 9, 10),
            'coordinates': {'lat': 50.22, 'lng': 82.19},
            'description': 'ГЭС в среднем течении Иртыша'
        },
        {
            'name': 'Капшагайская ГЭС',
            'type': 'ГЭС',
            'region': 'Алматинская область',
            'water_body': 'Река Или',
            'water_body_id': wb_ili.id if wb_ili else None,
            'capacity': 364.0,
            'year_built': 1970,
            'passport_year': 2019,
            'status': 'operational',
            'technical_condition': 2,
            'risk_score': 25,
            'risk_level': 'low',
            'issues': 0,
            'alerts': 0,
            'last_inspection': date(2024, 11, 20),
            'coordinates': {'lat': 43.90, 'lng': 77.10},
            'description': 'ГЭС на реке Или, в хорошем состоянии'
        },
        {
            'name': 'Сергеевское водохранилище',
            'type': 'Водохранилище',
            'region': 'Северо-Казахстанская область',
            'water_body': 'Река Ишим',
            'water_body_id': wb_ishim.id if wb_ishim else None,
            'capacity': 664.0,
            'year_built': 1963,
            'passport_year': 2020,
            'status': 'operational',
            'technical_condition': 2,
            'risk_score': 20,
            'risk_level': 'low',
            'issues': 1,
            'alerts': 0,
            'last_inspection': date(2024, 11, 1),
            'coordinates': {'lat': 54.34, 'lng': 69.34},
            'description': 'Водохранилище на реке Ишим'
        }
    ]

    for f in facilities:
        hf = HydroFacility(
            name=f['name'],
            type=f['type'],
            region=f.get('region'),
            water_body=f.get('water_body'),
            water_body_id=f.get('water_body_id'),
            capacity=f.get('capacity', 0.0),
            year_built=f.get('year_built'),
            passport_year=f.get('passport_year'),
            status=f.get('status', 'operational'),
            technical_condition=f.get('technical_condition', 1),
            risk_score=f.get('risk_score', 0),
            risk_level=f.get('risk_level', 'medium'),
            last_inspection=f.get('last_inspection'),
            issues=f.get('issues', 0),
            alerts=f.get('alerts', 0),
            coordinates=f.get('coordinates'),
            related_sensor_ids=f.get('related_sensor_ids'),
            description=f.get('description')
        )
        db.session.add(hf)

        # Вычисляем приоритет для отображения
        calc_priority = hf.calculate_priority()
        print(f"  Добавлена ГТС: {hf.name} (score={calc_priority['score']}, level={calc_priority['level']})")

    db.session.commit()
    print("[OK] ГТС добавлены в БД")


def seed_sensor_readings():
    """Генерирует историю показаний для всех датчиков за последние 24 часа"""
    from models import Sensor, SensorReading

    # Проверяем, есть ли уже показания
    if SensorReading.query.first():
        print("История показаний уже создана")
        return

    sensors = Sensor.query.all()
    if not sensors:
        print("Сначала создайте датчики")
        return

    now = datetime.utcnow()
    hours = 24
    points = 50  # 50 точек данных за 24 часа
    interval = timedelta(hours=hours) / points

    print(f"Генерация истории показаний за {hours} часов...")

    for sensor in sensors:
        base_level = sensor.water_level

        for i in range(points):
            timestamp = now - (interval * (points - i))

            # Генерируем вариацию уровня воды (синусоида + случайный шум)
            variation = random.uniform(-0.3, 0.3) + (0.5 * (1 - abs(i - points/2) / (points/2)))
            water_level = max(0, base_level + variation)

            # Температура воды (15-20 градусов)
            temperature = 15 + random.uniform(0, 5)

            reading = SensorReading(
                sensor_id=sensor.id,
                water_level=round(water_level, 2),
                temperature=round(temperature, 1),
                timestamp=timestamp
            )
            db.session.add(reading)

        print(f"  Создана история для {sensor.name}: {points} записей")

    db.session.commit()
    print("[OK] История показаний успешно создана")


def seed_notifications():
    """Создает тестовые уведомления для пользователей"""
    from models import Notification, User, Sensor

    if Notification.query.first():
        print("Уведомления уже созданы")
        return

    # Получаем пользователей и сенсоры
    users = User.query.filter_by(user_type='user').all()
    sensors = Sensor.query.all()

    if not users:
        print("Сначала создайте пользователей")
        return

    # Уведомления для каждого пользователя
    notifications_data = [
        {
            'type': 'sensor',
            'title': 'Повышенный уровень воды',
            'message': 'Датчик №1 зафиксировал повышение уровня воды до 4.35м. Следите за обновлениями.',
            'is_important': True,
            'is_read': False
        },
        {
            'type': 'info',
            'title': 'Плановая проверка датчиков',
            'message': 'Будет проведена плановая проверка всех датчиков мониторинга. Возможны кратковременные перебои в передаче данных.',
            'is_important': False,
            'is_read': True
        },
        {
            'type': 'warning',
            'title': 'Предупреждение о погоде',
            'message': 'Прогнозируются обильные осадки в течение следующих 48 часов. Рекомендуем подготовиться.',
            'is_important': True,
            'is_read': False
        }
    ]

    # Создаем уведомления для каждого обычного пользователя
    for user in users[:3]:  # Первые 3 пользователя
        for i, notif_data in enumerate(notifications_data):
            notification = Notification(
                user_id=user.id,
                type=notif_data['type'],
                title=notif_data['title'],
                message=notif_data['message'],
                is_important=notif_data['is_important'],
                is_read=notif_data['is_read'],
                sensor_id=sensors[0].id if i == 0 and sensors else None,
                created_at=datetime.utcnow() - timedelta(hours=i*2)
            )
            db.session.add(notification)
            print(f"  Создано уведомление для {user.full_name}: {notif_data['title']}")

    db.session.commit()
    print("[OK] Все уведомления успешно добавлены")


def seed_evacuations():
    """Создает тестовые эвакуации"""
    from models import Evacuation, User, Notification

    if Evacuation.query.first():
        print("Эвакуации уже созданы")
        return

    # Получаем пользователей
    users = User.query.filter_by(user_type='user').all()

    if not users or len(users) < 3:
        print("Недостаточно пользователей для создания эвакуаций")
        return

    evacuations_data = [
        {
            'user_id': users[0].id,
            'status': 'pending',
            'evacuation_point': 'Школа №5, ул. Мира, 45',
            'assigned_team': 'Бригада №1',
            'priority': 'high',
            'family_members': 4,
            'has_disabilities': False,
            'has_pets': True,
            'special_needs': 'Необходима помощь с перевозкой питомца',
            'notes': 'Жильцы готовы к эвакуации'
        },
        {
            'user_id': users[1].id,
            'status': 'in_progress',
            'evacuation_point': 'Спорткомплекс "Олимп"',
            'assigned_team': 'Бригада №2',
            'priority': 'critical',
            'family_members': 2,
            'has_disabilities': True,
            'has_pets': False,
            'special_needs': 'Требуется помощь с перемещением (инвалидность)',
            'notes': 'Бригада направляется на объект'
        },
        {
            'user_id': users[2].id,
            'status': 'completed',
            'evacuation_point': 'Гостиница "Центральная"',
            'assigned_team': 'Бригада №3',
            'priority': 'medium',
            'family_members': 3,
            'has_disabilities': False,
            'has_pets': True,
            'special_needs': None,
            'notes': 'Эвакуация завершена успешно',
            'completed_at': datetime.utcnow() - timedelta(hours=2)
        }
    ]

    for evac_data in evacuations_data:
        evacuation = Evacuation(**evac_data)
        db.session.add(evacuation)
        db.session.flush()  # Получаем ID

        # Создаем уведомление об эвакуации
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
            user_id=evac_data['user_id'],
            type='evacuation',
            title=titles.get(evac_data['status'], 'Обновление статуса эвакуации'),
            message=messages.get(evac_data['status'], f"Статус эвакуации изменен на: {evac_data['status']}"),
            evacuation_id=evacuation.id,
            is_important=True,
            is_read=(evac_data['status'] == 'completed')
        )
        db.session.add(notification)

        user = User.query.get(evac_data['user_id'])
        print(f"  Создана эвакуация для {user.full_name}: статус {evac_data['status']}")

    db.session.commit()
    print("[OK] Все эвакуации успешно добавлены")


def seed_water_bodies():
    """Создаёт тестовые записи водных объектов"""
    from models import WaterBody

    if WaterBody.query.first():
        print("Водные объекты уже созданы")
        return

    water_bodies = [
        {
            'name': 'Река Иртыш',
            'type': 'Река',
            'region': 'Восточно-Казахстанская область',
            'length': 4248.0,
            'area': None,
            'max_depth': 45.0,
            'average_depth': 12.5,
            'volume': None,
            'description': 'Одна из крупнейших рек Казахстана, приток Оби'
        },
        {
            'name': 'Река Или',
            'type': 'Река',
            'region': 'Алматинская область',
            'length': 1439.0,
            'area': None,
            'max_depth': 30.0,
            'average_depth': 8.2,
            'volume': None,
            'description': 'Основная река, впадающая в озеро Балхаш'
        },
        {
            'name': 'Озеро Балхаш',
            'type': 'Озеро',
            'region': 'Алматинская область',
            'length': 614.0,
            'area': 16400.0,
            'max_depth': 26.0,
            'average_depth': 5.8,
            'volume': 112000000000.0,
            'description': 'Одно из крупнейших озёр Центральной Азии'
        },
        {
            'name': 'Река Каратомар',
            'type': 'Река',
            'region': 'Алматинская область',
            'length': 124.0,
            'area': None,
            'max_depth': 12.0,
            'average_depth': 4.5,
            'volume': None,
            'description': 'Горная река в Алматинской области'
        },
        {
            'name': 'Река Урал',
            'type': 'Река',
            'region': 'Западно-Казахстанская область',
            'length': 2428.0,
            'area': None,
            'max_depth': 35.0,
            'average_depth': 10.0,
            'volume': None,
            'description': 'Река, впадающая в Каспийское море'
        },
        {
            'name': 'Река Ишим',
            'type': 'Река',
            'region': 'Северо-Казахстанская область',
            'length': 2450.0,
            'area': None,
            'max_depth': 28.0,
            'average_depth': 7.8,
            'volume': None,
            'description': 'Левый приток Иртыша'
        },
        {
            'name': 'Озеро Зайсан',
            'type': 'Озеро',
            'region': 'Восточно-Казахстанская область',
            'length': 105.0,
            'area': 1810.0,
            'max_depth': 15.0,
            'average_depth': 4.7,
            'volume': 53000000000.0,
            'description': 'Пресноводное озеро в бассейне Иртыша'
        },
        {
            'name': 'Сергеевское водохранилище',
            'type': 'Водохранилище',
            'region': 'Северо-Казахстанская область',
            'length': 42.0,
            'area': 117.0,
            'max_depth': 22.0,
            'average_depth': 8.5,
            'volume': 664000000.0,
            'description': 'Искусственное водохранилище на реке Ишим'
        }
    ]

    for wb_data in water_bodies:
        wb = WaterBody(
            name=wb_data['name'],
            type=wb_data['type'],
            region=wb_data['region'],
            length=wb_data.get('length'),
            area=wb_data.get('area'),
            max_depth=wb_data.get('max_depth'),
            average_depth=wb_data.get('average_depth'),
            volume=wb_data.get('volume'),
            description=wb_data.get('description')
        )
        db.session.add(wb)
        print(f"  Добавлен водный объект: {wb.name} ({wb.type})")

    db.session.commit()
    print("[OK] Водные объекты добавлены в БД")


def seed_reports():
    """Создает тестовые отчёты МЧС"""
    from models import Report, User

    if Report.query.first():
        print("Отчёты уже созданы")
        return

    # Получаем пользователя МЧС для авторства
    emergency_user = User.query.filter_by(user_type='emergency').first()
    if not emergency_user:
        print("Сначала создайте пользователя МЧС")
        return

    reports_data = [
        {
            'title': 'Еженедельный отчёт МЧС',
            'period': '27 нояб. - 3 дек. 2024',
            'period_start': date(2024, 11, 27),
            'period_end': date(2024, 12, 3),
            'type': 'weekly',
            'author_id': emergency_user.id,
            'author_name': emergency_user.full_name,
            'status': 'completed',
            'stats': {'incidents': 45, 'critical': 8, 'evacuations': 3},
            'content': 'Сводка за неделю. Зафиксировано повышение уровня воды в нескольких зонах мониторинга.',
            'file_size': '2.4 MB',
            'completed_at': datetime.utcnow() - timedelta(days=3)
        },
        {
            'title': 'Отчёт по инциденту: Иртыш',
            'period': '1 дек. 2024',
            'period_start': date(2024, 12, 1),
            'period_end': date(2024, 12, 1),
            'type': 'incident',
            'author_id': emergency_user.id,
            'author_name': 'Петров П.П.',
            'status': 'completed',
            'stats': {'incidents': 1, 'critical': 1, 'evacuations': 1},
            'content': 'Критическое повышение уровня воды на реке Иртыш. Проведена эвакуация 150 человек.',
            'file_size': '1.8 MB',
            'completed_at': datetime.utcnow() - timedelta(days=5)
        },
        {
            'title': 'Месячный отчёт - Ноябрь 2024',
            'period': '1-30 ноября 2024',
            'period_start': date(2024, 11, 1),
            'period_end': date(2024, 11, 30),
            'type': 'monthly',
            'author_id': emergency_user.id,
            'author_name': 'Сидоров С.С.',
            'status': 'completed',
            'stats': {'incidents': 182, 'critical': 34, 'evacuations': 15},
            'content': 'Полный отчёт за ноябрь 2024 года. Общая статистика по инцидентам и эвакуациям.',
            'file_size': '5.2 MB',
            'completed_at': datetime.utcnow() - timedelta(days=6)
        },
        {
            'title': 'Отчёт по эвакуации: Затобольск',
            'period': '25 нояб. 2024',
            'period_start': date(2024, 11, 25),
            'period_end': date(2024, 11, 25),
            'type': 'evacuation',
            'author_id': emergency_user.id,
            'author_name': 'Козлов К.К.',
            'status': 'draft',
            'stats': {'incidents': 1, 'critical': 0, 'evacuations': 1},
            'content': 'Эвакуация жителей района Затобольск. Черновик отчёта.',
            'file_size': '0.8 MB',
            'completed_at': None
        },
        {
            'title': 'Еженедельный отчёт МЧС',
            'period': '20-26 нояб. 2024',
            'period_start': date(2024, 11, 20),
            'period_end': date(2024, 11, 26),
            'type': 'weekly',
            'author_id': emergency_user.id,
            'author_name': emergency_user.full_name,
            'status': 'completed',
            'stats': {'incidents': 38, 'critical': 5, 'evacuations': 2},
            'content': 'Еженедельная сводка. Ситуация стабильная, уровни воды в пределах нормы.',
            'file_size': '2.1 MB',
            'completed_at': datetime.utcnow() - timedelta(days=10)
        },
        {
            'title': 'Отчёт по инциденту: Плотина Каратомар',
            'period': '15 нояб. 2024',
            'period_start': date(2024, 11, 15),
            'period_end': date(2024, 11, 15),
            'type': 'incident',
            'author_id': emergency_user.id,
            'author_name': emergency_user.full_name,
            'status': 'completed',
            'stats': {'incidents': 1, 'critical': 1, 'evacuations': 0},
            'content': 'Обнаружены повреждения на Каратомарской плотине. Требуется срочный ремонт.',
            'file_size': '3.2 MB',
            'completed_at': datetime.utcnow() - timedelta(days=21)
        }
    ]

    for report_data in reports_data:
        report = Report(**report_data)
        db.session.add(report)
        print(f"  Создан отчёт: {report.title} ({report.type}, {report.status})")

    db.session.commit()
    print("[OK] Все отчёты успешно добавлены")


def seed_all():
    """Запускает все функции заполнения БД"""
    print("=== Запуск заполнения БД синтетическими данными ===")
    seed_users()
    seed_sensors()
    seed_risk_zones()
    seed_water_bodies()
    seed_hydro_facilities()
    seed_sensor_readings()
    seed_notifications()
    seed_evacuations()
    seed_reports()
    print("=== Заполнение БД завершено ===")

if __name__ == "__main__":
    seed_all()

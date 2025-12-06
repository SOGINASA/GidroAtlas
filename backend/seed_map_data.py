"""
Seed данные для водных объектов и ГТС (синхронизированы с iOS приложением)
"""
from models import db, WaterBody, HydroFacility
from datetime import datetime


def seed_water_bodies():
    """Заполняет БД водными объектами (аналогично WATER_OBJECTS_KZ из iOS)"""

    water_bodies_data = [
        {
            'name': 'Озеро Балхаш',
            'type': 'Озеро',
            'region': 'Карагандинская область',
            'water_type': 'mixed',  # пресная/солоноватая
            'has_fauna': True,
            'passport_year': 2022,
            'technical_condition': 3,
            'coordinates': {'lat': 46.8, 'lng': 74.9},
            'area': 16400,  # км²
            'max_depth': 26,
            'average_depth': 6,
            'description': 'Одно из крупнейших озёр Казахстана, расположено на границе Карагандинской и Алматинской областей'
        },
        {
            'name': 'Капшагайское водохранилище',
            'type': 'Водохранилище',
            'region': 'Алматинская область',
            'water_type': 'fresh',
            'has_fauna': True,
            'passport_year': 2021,
            'technical_condition': 2,
            'coordinates': {'lat': 43.9, 'lng': 77.1},
            'area': 847,
            'max_depth': 45,
            'volume': 28100000000,  # м³
            'description': 'Водохранилище на реке Или, создано для работы Капшагайской ГЭС'
        },
        {
            'name': 'Бухтарминское водохранилище',
            'type': 'Водохранилище',
            'region': 'Восточно-Казахстанская область',
            'water_type': 'fresh',
            'has_fauna': True,
            'passport_year': 2020,
            'technical_condition': 5,  # критическое
            'coordinates': {'lat': 47.4, 'lng': 83.1},
            'area': 5490,
            'max_depth': 70,
            'volume': 49800000000,
            'description': 'Крупнейшее водохранилище Казахстана на реке Иртыш'
        },
        {
            'name': 'Шардаринское водохранилище',
            'type': 'Водохранилище',
            'region': 'Туркестанская область',
            'water_type': 'fresh',
            'has_fauna': True,
            'passport_year': 2019,
            'technical_condition': 2,
            'coordinates': {'lat': 41.2, 'lng': 68.3},
            'area': 900,
            'max_depth': 25,
            'description': 'Водохранилище на реке Сырдарья'
        },
        {
            'name': 'Озеро Жайсан',
            'type': 'Озеро',
            'region': 'Восточно-Казахстанская область',
            'water_type': 'fresh',
            'has_fauna': True,
            'passport_year': 2018,
            'technical_condition': 3,
            'coordinates': {'lat': 47.5, 'lng': 84.8},
            'area': 1810,
            'max_depth': 8,
            'description': 'Озеро в бассейне реки Иртыш'
        },
        {
            'name': 'Озеро Алаколь',
            'type': 'Озеро',
            'region': 'Жетысуская область',
            'water_type': 'salt',
            'has_fauna': True,
            'passport_year': 2023,
            'technical_condition': 1,
            'coordinates': {'lat': 46.2, 'lng': 81.8},
            'area': 2200,
            'max_depth': 54,
            'description': 'Солоноватое озеро на востоке Казахстана'
        },
        {
            'name': 'Озеро Тенгиз',
            'type': 'Озеро',
            'region': 'Акмолинская область',
            'water_type': 'salt',
            'has_fauna': False,
            'passport_year': 2017,
            'technical_condition': 4,
            'coordinates': {'lat': 50.5, 'lng': 69.0},
            'area': 1590,
            'max_depth': 7,
            'description': 'Бессточное солёное озеро'
        },
        {
            'name': 'Водохранилище Сорбулак',
            'type': 'Водохранилище',
            'region': 'Алматинская область',
            'water_type': 'mixed',
            'has_fauna': False,
            'passport_year': 2020,
            'technical_condition': 2,
            'coordinates': {'lat': 43.4, 'lng': 77.3},
            'area': 60,
            'description': 'Водохранилище-отстойник сточных вод г. Алматы'
        }
    ]

    for wb_data in water_bodies_data:
        # Проверяем, существует ли уже такой объект
        existing = WaterBody.query.filter_by(name=wb_data['name']).first()
        if not existing:
            wb = WaterBody(**wb_data)
            db.session.add(wb)
            print(f"+ Добавлен водный объект: {wb_data['name']}")
        else:
            print(f"- Водный объект уже существует: {wb_data['name']}")

    db.session.commit()
    print(f"\nSeed водных объектов завершен")


def seed_hydro_facilities():
    """Заполняет БД гидротехническими сооружениями (аналогично HYDRO_FACILITIES_KZ из iOS)"""

    facilities_data = [
        {
            'name': 'Бухтарминская ГЭС',
            'type': 'ГЭС',
            'region': 'Восточно-Казахстанская область',
            'technical_condition': 3,
            'coordinates': {'lat': 47.4, 'lng': 83.1},
            'capacity': 675,  # МВт
            'year_built': 1966,
            'passport_year': 2019,
            'status': 'operational',
            'water_body': 'Бухтарминское водохранилище',
            'description': 'Первая ГЭС Иртышского каскада, вторая по мощности в Казахстане'
        },
        {
            'name': 'Капшагайская ГЭС',
            'type': 'ГЭС',
            'region': 'Алматинская область',
            'technical_condition': 2,
            'coordinates': {'lat': 43.9, 'lng': 77.1},
            'capacity': 364,
            'year_built': 1970,
            'passport_year': 2021,
            'status': 'operational',
            'water_body': 'Капшагайское водохранилище',
            'description': 'ГЭС на реке Или'
        },
        {
            'name': 'Шардаринская ГЭС',
            'type': 'ГЭС',
            'region': 'Туркестанская область',
            'technical_condition': 4,
            'coordinates': {'lat': 41.2, 'lng': 68.3},
            'capacity': 126,
            'year_built': 1967,
            'passport_year': 2018,
            'status': 'maintenance',
            'water_body': 'Шардаринское водохранилище',
            'description': 'ГЭС на реке Сырдарья',
            'issues': 3,
            'alerts': 2
        },
        {
            'name': 'Усть-Каменогорская ГЭС',
            'type': 'ГЭС',
            'region': 'Восточно-Казахстанская область',
            'technical_condition': 2,
            'coordinates': {'lat': 49.9, 'lng': 82.6},
            'capacity': 332,
            'year_built': 1952,
            'passport_year': 2020,
            'status': 'operational',
            'description': 'Третья ГЭС Иртышского каскада'
        },
        {
            'name': 'Плотина Коктерек',
            'type': 'Плотина',
            'region': 'Алматинская область',
            'technical_condition': 5,  # критическое
            'coordinates': {'lat': 43.2, 'lng': 76.8},
            'year_built': 1983,
            'passport_year': 2015,
            'status': 'emergency',
            'description': 'Земляная плотина в критическом состоянии',
            'issues': 12,
            'alerts': 8,
            'risk_score': 85,
            'risk_level': 'high'
        },
        {
            'name': 'Плотина Сорбулак',
            'type': 'Плотина',
            'region': 'Алматинская область',
            'technical_condition': 1,
            'coordinates': {'lat': 43.4, 'lng': 77.3},
            'year_built': 2010,
            'passport_year': 2023,
            'status': 'operational',
            'water_body': 'Водохранилище Сорбулак',
            'description': 'Современная плотина в отличном состоянии',
            'issues': 0,
            'alerts': 0,
            'risk_score': 10,
            'risk_level': 'low'
        }
    ]

    for f_data in facilities_data:
        # Проверяем, существует ли уже такой объект
        existing = HydroFacility.query.filter_by(name=f_data['name']).first()
        if not existing:
            facility = HydroFacility(**f_data)
            db.session.add(facility)
            print(f"+ Добавлено ГТС: {f_data['name']}")
        else:
            print(f"- ГТС уже существует: {f_data['name']}")

    db.session.commit()
    print(f"\nSeed ГТС завершен")


def seed_map_data():
    """Основная функция для заполнения всех данных карты"""
    print("\nНачинаем заполнение данных для карт...")
    print("=" * 60)

    seed_water_bodies()
    print()
    seed_hydro_facilities()

    print("=" * 60)
    print("Заполнение данных карты завершено!\n")


if __name__ == '__main__':
    from app import create_app
    app = create_app()

    with app.app_context():
        seed_map_data()

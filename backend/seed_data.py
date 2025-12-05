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
        # Администраторы (admin)
        {
            'email': 'admin@example.com',
            'password': 'admin123',
            'full_name': 'Александр Администратор',
            'user_type': 'admin',
            'phone': '+79994567890',
            'address': 'ул. Советская, 1, Москва',
        },
        # MCHS (экстренные службы)
        {
            'email': 'mchs@example.com',
            'password': 'mchs123',
            'full_name': 'Антон МЧС',
            'user_type': 'mchs',
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


def seed_all():
    """Запускает все функции заполнения БД"""
    print("=== Запуск заполнения БД синтетическими данными ===")
    seed_users()
    print("=== Заполнение БД завершено ===")

if __name__ == "__main__":
    seed_all()

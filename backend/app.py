from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config, DATABASE_DIR
from models import db, User
from seed_data import seed_all
from flask_jwt_extended.exceptions import JWTExtendedException
from werkzeug.exceptions import HTTPException
import os

# Инициализация расширений
migrate = Migrate()
jwt = JWTManager()

# TODO: разобраться в папке сервисов
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, supports_credentials=True, origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://oracle-itshechka.vercel.app"
    ])

    # Создаём папку для БД, если её нет
    os.makedirs(DATABASE_DIR, exist_ok=True)

    # Инициализация расширений
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Инициализация БД и заполнение данными при первом запуске
    with app.app_context():
        db.create_all()
        # Проверяем, есть ли уже данные в БД
        if User.query.first() is None:
            seed_all()

    # Регистрация blueprints
    from routes import (
        auth_bp,
    )

    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # Главная страница API
    @app.route('/api')
    def api_info():
        return jsonify({
            'message': 'secret API',
            'version': '1.0.0',
            'description': 'API для мониторинга чего-то там',
            'endpoints': {
                'auth': '/api/auth',
            },
        })

    return app


app = create_app()

# Обработчики ошибок
@app.errorhandler(422)
def handle_unprocessable_entity(err):
    return jsonify({'error': 'Validation error', 'message': str(err)}), 422

@app.errorhandler(JWTExtendedException)
def handle_jwt_error(e):
    return jsonify({'error': 'JWT Error', 'message': str(e)}), 401

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    return jsonify({'error': e.code, 'message': e.description}), e.code

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Токен истек'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'error': 'Недействительный токен'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'error': 'Требуется авторизация'}), 401

# CLI команды
@app.cli.command()
def init_db():
    """Инициализация базы данных с тестовыми данными"""
    print("🚀 Инициализация базы данных...")
    db.create_all()
    seed_all()
    print("✅ База данных инициализирована!")

@app.cli.command()
def create_admin():
    """Создать администратора"""
    email = input("Email администратора: ")
    password = input("Пароль: ")
    full_name = input("Полное имя: ")

    if User.query.filter_by(email=email).first():
        print("❌ Пользователь с таким email уже существует")
        return

    admin = User(full_name=full_name, email=email, user_type='admin', is_verified=True)
    admin.set_password(password)

    db.session.add(admin)
    db.session.commit()

    print(f"✅ Администратор {email} создан")

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5252)
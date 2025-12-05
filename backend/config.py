import os
from datetime import timedelta

# Получаем путь к директории backend
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(BACKEND_DIR, 'database')

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'workplus-dev-secret-key-change-in-production'
    
    # Настройки базы данных (абсолютный путь)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f'sqlite:///{os.path.join(DATABASE_DIR, "database.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Настройки CORS
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000", "https://oracle-itshechka.vercel.app"]
    
    # Настройки JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Email настройки
    MAIL_SERVER = os.environ.get('MAIL_SERVER') or 'smtp.gmail.com'
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER') or 'noreply@workplus.kz'
    
    # SMS настройки (Казахстан)
    SMS_PROVIDER = os.environ.get('SMS_PROVIDER') or 'smsc'  # smsc, kcell, etc.
    SMS_API_KEY = os.environ.get('SMS_API_KEY')
    SMS_LOGIN = os.environ.get('SMS_LOGIN')
    SMS_PASSWORD = os.environ.get('SMS_PASSWORD')
    
    # Настройки файлов
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'gif'}
    
    # Социальные сети API
    INSTAGRAM_ACCESS_TOKEN = os.environ.get('INSTAGRAM_ACCESS_TOKEN')
    INSTAGRAM_BUSINESS_ACCOUNT_ID = os.environ.get('INSTAGRAM_BUSINESS_ACCOUNT_ID')
    
    TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
    TELEGRAM_CHANNEL_ID = os.environ.get('TELEGRAM_CHANNEL_ID')  # Канал для публикации вакансий
    
    FACEBOOK_APP_ID = os.environ.get('FACEBOOK_APP_ID')
    FACEBOOK_APP_SECRET = os.environ.get('FACEBOOK_APP_SECRET')
    FACEBOOK_ACCESS_TOKEN = os.environ.get('FACEBOOK_ACCESS_TOKEN')
    FACEBOOK_PAGE_ID = os.environ.get('FACEBOOK_PAGE_ID')
    
    LINKEDIN_CLIENT_ID = os.environ.get('LINKEDIN_CLIENT_ID')
    LINKEDIN_CLIENT_SECRET = os.environ.get('LINKEDIN_CLIENT_SECRET')
    LINKEDIN_ACCESS_TOKEN = os.environ.get('LINKEDIN_ACCESS_TOKEN')
    
    # Настройки пагинации
    JOBS_PER_PAGE = 20
    APPLICATIONS_PER_PAGE = 50
    USERS_PER_PAGE = 30
    
    # Настройки кеширования
    CACHE_TYPE = os.environ.get('CACHE_TYPE') or 'simple'
    CACHE_DEFAULT_TIMEOUT = 300
    
    # Настройки безопасности
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = None
    
    # Настройки логирования
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'
    LOG_FILE = os.environ.get('LOG_FILE') or 'workplus.log'
    
    # API настройки
    API_RATE_LIMIT = os.environ.get('API_RATE_LIMIT') or '1000/hour'
    
    # Настройки уведомлений
    NOTIFICATION_SETTINGS = {
        'email_enabled': True,
        'sms_enabled': True,
        'telegram_enabled': True,
        'push_enabled': False
    }
    
    # Бизнес настройки
    BUSINESS_SETTINGS = {
        'company_name': 'WorkPlus.kz',
        'company_phone': '+7 (777) 123-45-67',
        'company_email': 'info@workplus.kz',
        'support_email': 'support@workplus.kz',
        'company_address': 'г. Павлодар, Павлодарская область, Казахстан',
        'working_hours': 'Пн-Пт: 9:00-18:00',
        'timezone': 'Asia/Almaty',
        'currency': 'KZT',
        'currency_symbol': '₸',
        'default_language': 'ru',
        'supported_languages': ['ru', 'kk', 'en']
    }
    
    # Социальные сети компании
    SOCIAL_MEDIA = {
        'instagram': 'https://instagram.com/workplus_kz',
        'telegram': 'https://t.me/workplus_kz',
        'facebook': 'https://facebook.com/workplus.kz',
        'linkedin': 'https://linkedin.com/company/workplus-kz',
        'youtube': 'https://youtube.com/@workplus_kz'
    }
    
    # SEO настройки
    SEO_SETTINGS = {
        'site_name': 'WorkPlus.kz - HR-экосистема Казахстана',
        'site_description': 'Найдите работу мечты или лучших сотрудников. Мультиканальная публикация вакансий в соцсетях, скоринг кандидатов, аналитика.',
        'site_keywords': 'работа, вакансии, резюме, Казахстан, HR, рекрутинг, поиск работы, найм сотрудников',
        'site_url': 'https://workplus.kz',
        'robots_txt': 'User-agent: *\nAllow: /',
        'sitemap_enabled': True
    }
    
    # Настройки тарифных планов
    PRICING_PLANS = {
        'free': {
            'name': 'Бесплатный',
            'jobs_limit': 3,
            'featured_jobs': 0,
            'social_publishing': False,
            'analytics': False,
            'price': 0
        },
        'start': {
            'name': 'Start',
            'jobs_limit': 10,
            'featured_jobs': 2,
            'social_publishing': True,
            'analytics': True,
            'price': 25000
        },
        'growth': {
            'name': 'Growth',
            'jobs_limit': 50,
            'featured_jobs': 10,
            'social_publishing': True,
            'analytics': True,
            'ats_lite': True,
            'price': 150000
        },
        'pro': {
            'name': 'Pro',
            'jobs_limit': -1,  # Безлимит
            'featured_jobs': -1,
            'social_publishing': True,
            'analytics': True,
            'ats_lite': True,
            'custom_scoring': True,
            'price': 400000
        }
    }
    
    # Настройки скоринга
    SCORING_SETTINGS = {
        'enabled': True,
        'skills_weight': 0.4,
        'experience_weight': 0.3,
        'education_weight': 0.2,
        'location_weight': 0.1,
        'auto_threshold': 0.7,
        'min_score': 0.0,
        'max_score': 1.0
    }
    
    # Настройки модерации
    MODERATION_SETTINGS = {
        'auto_approve_companies': False,
        'auto_approve_jobs': False,
        'require_phone_verification': True,
        'require_email_verification': True,
        'banned_keywords': [
            'пирамида', 'mlm', 'сетевой маркетинг',
            'работа на дому без вложений', 'легкие деньги'
        ]
    }
    
    # Настройки интеграций
    INTEGRATION_SETTINGS = {
        'kaspi_integration': False,
        'enbek_integration': False,
        'olx_integration': False,
        'google_analytics_id': os.environ.get('GOOGLE_ANALYTICS_ID'),
        'yandex_metrika_id': os.environ.get('YANDEX_METRIKA_ID')
    }
    
    # Категории вакансий
    JOB_CATEGORIES = [
        'IT', 'Продажи', 'Маркетинг', 'HR', 'Финансы',
        'Производство', 'Строительство', 'Медицина', 'Образование',
        'Туризм', 'Общепит', 'Розничная торговля', 'Логистика',
        'Дизайн', 'Консалтинг', 'Недвижимость', 'Автомобили',
        'Красота', 'Спорт', 'Другое'
    ]
    
    # Города Казахстана
    CITIES = [
        'Астана', 'Алматы', 'Петропавловск', 'Костанай',
        'Актау', 'Павлодар', 'Кокшетау', 'Рудный', 'Атырау'
    ]


class DevelopmentConfig(Config):
    """Конфигурация для разработки"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(DATABASE_DIR, "database.db")}'
    
    # Отключаем некоторые проверки для разработки
    MAIL_SUPPRESS_SEND = True
    WTF_CSRF_ENABLED = False
    
    # Тестовые токены
    INSTAGRAM_ACCESS_TOKEN = 'test_instagram_token'
    TELEGRAM_BOT_TOKEN = 'test_telegram_token'

class TestingConfig(Config):
    """Конфигурация для тестирования"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=1)
    
    # Отключаем внешние сервисы
    MAIL_SUPPRESS_SEND = True
    SMS_PROVIDER = 'mock'
    
class ProductionConfig(Config):
    """Конфигурация для продакшена"""
    DEBUG = False
    
    # PostgreSQL для продакшена
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://workplus_user:password@localhost/workplus_prod'
    
    # SSL для PostgreSQL
    if SQLALCHEMY_DATABASE_URI.startswith('postgresql://'):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace(
            'postgresql://', 'postgresql+psycopg2://'
        )
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,
            'pool_recycle': 300,
        }
    
    @staticmethod
    def init_app(app):
        Config.init_app(app)
        
        # Логирование в файл
        import logging
        from logging.handlers import RotatingFileHandler
        
        if not app.debug:
            file_handler = RotatingFileHandler(
                Config.LOG_FILE, 
                maxBytes=10240000,  # 10MB
                backupCount=10
            )
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
            ))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)
            app.logger.setLevel(logging.INFO)
            app.logger.info('WorkPlus.kz startup')

# Выбор конфигурации по переменной окружения
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Получить текущую конфигурацию"""
    return config[os.environ.get('FLASK_ENV') or 'default']

# Валидация критически важных настроек
def validate_config():
    """Проверить корректность конфигурации"""
    errors = []
    
    if not Config.SECRET_KEY or Config.SECRET_KEY == 'workplus-dev-secret-key-change-in-production':
        if os.environ.get('FLASK_ENV') == 'production':
            errors.append("SECRET_KEY должен быть установлен в продакшене")
    
    if os.environ.get('FLASK_ENV') == 'production':
        required_env_vars = [
            'DATABASE_URL',
            'MAIL_USERNAME',
            'MAIL_PASSWORD',
            'JWT_SECRET_KEY'
        ]
        
        for var in required_env_vars:
            if not os.environ.get(var):
                errors.append(f"Переменная окружения {var} обязательна в продакшене")
    
    if errors:
        print("Ошибки конфигурации:")
        for error in errors:
            print(f"   • {error}")
        return False
    
    print("Конфигурация корректна")
    return True

# Утилита для создания .env файла
def create_env_template():
    """Создать шаблон .env файла"""
    env_template = """# Flask настройки
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here

# База данных
DATABASE_URL=sqlite:///database.db

# Email настройки
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=noreply@workplus.kz

# SMS настройки (для Казахстана)
SMS_PROVIDER=smsc
SMS_API_KEY=your-sms-api-key
SMS_LOGIN=your-sms-login
SMS_PASSWORD=your-sms-password

# Социальные сети
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-instagram-account-id
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHANNEL_ID=your-telegram-channel-id
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_ACCESS_TOKEN=your-facebook-access-token
FACEBOOK_PAGE_ID=your-facebook-page-id
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_ACCESS_TOKEN=your-linkedin-access-token

# Файлы
UPLOAD_FOLDER=uploads

# Логирование
LOG_LEVEL=INFO
LOG_FILE=workplus.log

# API
API_RATE_LIMIT=1000/hour

# Кеширование
CACHE_TYPE=simple

# Аналитика
GOOGLE_ANALYTICS_ID=your-ga-id
YANDEX_METRIKA_ID=your-metrika-id
"""
    
    with open('.env.template', 'w', encoding='utf-8') as f:
        f.write(env_template)
    
    print("Создан файл .env.template")
    print("Скопируйте его в .env и заполните своими значениями")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "validate":
        validate_config()
    elif len(sys.argv) > 1 and sys.argv[1] == "create-env":
        create_env_template()
    else:
        print("Использование:")
        print("  python config.py validate     - Проверить конфигурацию")
        print("  python config.py create-env   - Создать шаблон .env файла")
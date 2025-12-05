from routes.auth import auth_bp
from routes.sensor import sensor_bp
from routes.users import users_bp


__all__ = [
    'auth_bp',
    'sensor_bp',
    'users_bp',
]
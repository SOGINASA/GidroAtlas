from flask import json
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date

db = SQLAlchemy()


# models.py (фрагмент)
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    full_name = db.Column(db.String(100))
    user_type = db.Column(db.String(20), default='user') # user, admin, mchs
    address = db.Column(db.String(255))
    phone = db.Column(db.String(20))

    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # токены восстановления/верификации — уже были
    reset_token = db.Column(db.String(100), unique=True)
    reset_token_expires = db.Column(db.DateTime)
    verification_token = db.Column(db.String(100), unique=True)


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_sensitive=False):
        # Мапим user_type к role для фронтенда
        role_mapping = {
            'user': 'resident',
            'mchs': 'emergency',
            'admin': 'admin'
        }
        role = role_mapping.get(self.user_type, self.user_type)

        data = {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'fullName': self.full_name,  # Дублируем для camelCase
            'user_type': self.user_type,
            'role': role,  # Добавляем для совместимости с фронтендом
            'is_verified': self.is_verified,
            'phone': self.phone,
            'address': self.address,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }
        if include_sensitive:
            data['is_active'] = self.is_active
        return data
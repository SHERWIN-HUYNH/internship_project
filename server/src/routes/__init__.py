

from flask import Blueprint, Flask
from .images import images_bp
from .posts import posts_bp
from .auth_route import auth_bp
from .accounts import accounts_bp

def register_routes(app: Flask) -> None:
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(images_bp, url_prefix='/api/images')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(accounts_bp, url_prefix='/api/accounts')
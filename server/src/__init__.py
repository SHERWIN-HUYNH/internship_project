from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .routes.auth_route  import auth_bp
from .routes.exceptions  import exceptions_register
from .routes.images import images_bp
from .routes.posts  import posts_bp
from .config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
        
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(images_bp, url_prefix='/api/images')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    exceptions_register(app)

    return app
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .routes import register_routes
from flask_cors import CORS
from .config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    
    register_routes(app)
    
    # exceptions_register(app)

    return app
from flask import Blueprint, request, jsonify, make_response
from datetime import timedelta
from ..services.auth import AuthService
from src.config import Config

auth_bp = Blueprint('auth', __name__)

COOKIE_NAME = "access_token"

def _set_auth_cookie(response, token: str):
    response.set_cookie(
        COOKIE_NAME,
        token,
        httponly=False,  
        secure=Config.ENV == "production",  
        samesite="Strict",
        max_age=Config.JWT_ACCESS_EXPIRES,
        path="/"
    )
    return response

@auth_bp.route('/signup', methods=['POST'])
def signup():
    json_data = request.get_json() or {}
    try:
        result = AuthService.signup(json_data)
    except ValueError as e:
        err = e.args[0]
        if isinstance(err, dict):
            return jsonify(err), 422
        return jsonify({"message": err}), 400

    response = make_response(jsonify({
        "message": "User created successfully",
        "userData": result["userData"],
        "access_token": result["token"]
    }), 201)

    return _set_auth_cookie(response, result["token"])

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    try:
        result = AuthService.login(data)
    except ValueError as e:
        err = e.args[0]
        if isinstance(err, dict):
            return jsonify(err), 422
        return jsonify({"error": err}), 401

    response = make_response(jsonify({
        "message": "Login successful!",
        "userData": result["userData"],
        "access_token": result["token"]
    }), 200)

    return _set_auth_cookie(response, result["token"])

@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Đăng xuất thành công"}), 200)
    response.set_cookie(
        "access_token",
        "",
        httponly=False,   
        secure=True,     
        samesite="Strict",
        path="/",
        max_age=0        
    )

    return response

from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token
from ..services.auth import AuthService
from ..models.account_model import UserModel

auth_bp = Blueprint('auth', __name__)

@auth_bp.post('/signup')
def signup():
    json_data = request.get_json() or {}
    try:
        result = AuthService.signup(json_data)
        print('SUCCESS')
    except ValueError as e:
        err = e.args[0]
        if isinstance(err, dict):
            return jsonify(err), 422
        return jsonify({"message": err}), 400

    return jsonify({
        "message": "User created successfully",
        "user_id": result["user_id"],
        "token": result["token"]
    }), 201
    
@auth_bp.post('/login')
def login():
    """
    User Login Route.
    """
    data = request.get_json()

    # --- Input Validation ---
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing email or password"}), 400

    email = data.get('email')
    password = data.get('password')

    # --- Find User ---
    user = UserModel.find_user_by_email(email)

    # --- Validate Credentials ---
    if not user or not UserModel.check_password(user['password'], password):
        return jsonify({"error": "Invalid email or password"}), 401 # 401 Unauthorized

    # --- Generate JWT Token ---
    user_id = str(user['_id'])
    access_token = create_access_token(identity=user_id)

    return jsonify({
        "message": "Login successful!",
        "access_token": access_token
    }), 200

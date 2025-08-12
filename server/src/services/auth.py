import os, hashlib
from datetime import datetime, timezone
import bcrypt
import jwt, datetime
from marshmallow import ValidationError
from src.config import Config
from src.models.account_model import UserModel
from src.schema.login_schema import LoginSchema
from src.schema.user import SignupSchema

def hashing(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()

class AuthService:
    @staticmethod
    def _build_payload(name: str, email: str, role: str) -> dict:
        return {
            "sub": email,
            "name": name,
            "role": role,
            "iat": datetime.datetime.now(datetime.timezone.utc),
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds=Config.JWT_ACCESS_EXPIRES)
        }

    @staticmethod
    def _encode(payload: dict) -> str:
        return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)

    @staticmethod
    def signup(data: dict) -> dict:
        errors = SignupSchema().validate(data)
        if errors:
            raise ValueError({"validation": errors})

        if UserModel.find_user_by_email(data["email"]):
            raise ValueError("Email đã được đăng ký")

        role = data.get("role", "user")
        user_id = UserModel.create_user(
            name=data["name"],
            email=data["email"],
            password=data["password"], 
            phone=data["phone"],
            role=role
        )

        payload = AuthService._build_payload(
            name=data["name"],
            email=data["email"],
            role=role
        )
        token = AuthService._encode(payload)

        return {
            "user_id": str(user_id),
            "userData": { "name": data["name"], "email": data["email"], "role": role },
            "token": token
        }

    @staticmethod
    def login(data: dict) -> dict:
        errors = LoginSchema().validate(data)
        if errors:
            raise ValueError({"validation": errors})

        user = UserModel.find_user_by_email(data["email"])
        if not user:
            raise ValueError("Email or password incorrect")

        if not bcrypt.checkpw(
            data["password"].encode("utf-8"),
            user["password"].encode("utf-8")
        ):
            raise ValueError("Email or password incorrect")

        name = user.get("name", "")
        email = user["email"]
        role = user.get("role", "user")

        payload = AuthService._build_payload(name=name, email=email, role=role)
        token = AuthService._encode(payload)

        return {
            "user_id": str(user["_id"]),
            "userData": { "name": name, "email": email, "role": role },
            "token": token
        }
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
    def __init__(self):
        self.user_model = UserModel()
    def _build_payload(user_id: str,name: str, email: str, role: str, phone:str) -> dict:
        return {
            "sub": user_id,
            "email": email,
            "name": name,
            "role": role,
            "phone":phone,
            "iat": datetime.datetime.now(datetime.timezone.utc),
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds=Config.JWT_ACCESS_EXPIRES)
        }

  
    def _encode(payload: dict) -> str:
        return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)


    def signup(self,data: dict) -> dict:
        errors = SignupSchema().validate(data)
        if errors:
            raise ValueError({"validation": errors})

        if self.user_model.find_by_email(email=data["email"]):
            raise ValueError("Email đã được đăng ký")

        role = data.get("role", "user")
        user_id = self.user_model.create(
            name=data["name"],
            email=data["email"],
            password=data["password"], 
            phone=data["phone"],
            role=role
        )

        payload = AuthService._build_payload(
            user_id=user_id,
            name=data["name"],
            email=data["email"],
            role=role,
            phone=data["phone"]
        )
        token = AuthService._encode(payload)

        return {
            "account_id": str(user_id),
            "userData": { "account_id": str(user_id),"name": data["name"], "email": data["email"], "role": role },
            "token": token
        }

  
    def login(self,data: dict) -> dict:
        errors = LoginSchema().validate(data)
        if errors:
            raise ValueError({"validation": errors})

        user = self.user_model.find_by_email(data["email"])
        if not user:
            print('VALUE', user)
            raise ValueError("Email or password incorrect")

        if not user or not bcrypt.checkpw(data["password"].encode(), user["password"].encode()):
            raise ValueError("Sai email hoặc mật khẩu")

        name = user.get("name", "")
        email = user["email"]
        phone = user.get("phone", "")
        role = user.get("role", "user")

        payload = AuthService._build_payload(user_id=str(user["_id"]),name=name, email=email, role=role,phone=phone)
        token = AuthService._encode(payload)

        return {
            "account_id": str(user["_id"]),
            "userData": { "account_id": str(user["_id"]),"name": name, "email": email, "role": role, "phone": phone },
            "token": token
        }
import os, hashlib
from datetime import timedelta
import bcrypt
from pymongo import MongoClient, errors
from dotenv import load_dotenv
from src.config import Config
import jwt, datetime
from marshmallow import ValidationError
from src.models.account_model import UserModel
from src.schema.login_schema import LoginSchema
from src.schema.user import SignupSchema

load_dotenv()

def hashing(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()

class AuthService:
    @staticmethod
    def signup(data: dict) -> dict:
        # Validate input
        errors = SignupSchema().validate(data)
        if errors:
            raise ValueError({"validation": errors})

        # Check duplicate và tạo user
        if UserModel.find_user_by_email(data["email"]):
            raise ValueError("Email đã được đăng ký")

        user_id = UserModel.create_user(
            name=data["name"],
            email=data["email"],
            password=data["password"],
            phone=data["phone"]
        )

        # Sinh JWT
        payload = {
            "sub":  data["email"],
            "role": "user",
            "iat":  datetime.datetime.utcnow(),
            "exp":  datetime.datetime.utcnow() + datetime.timedelta(seconds=Config.JWT_EXP_SEC)
        }
        token = jwt.encode(payload, Config.JWT_SECRET, algorithm=Config.JWT_ALGO)

        return {"user_id": user_id, "token": token}

    @staticmethod
    def login(data: dict) -> dict:
        # 1. Validate incoming payload
        errors = LoginSchema().validate(data)
        if errors:
            # validation errors: return detail to caller
            raise ValueError({"validation": errors})

        # 2. Fetch user from database
        user = UserModel.find_by_email(data["email"])
        if not user:
            # do not reveal which field is wrong
            raise ValueError("Email or password incorrect")

        # 3. Verify password
        # stored password is a bcrypt hash string
        if not bcrypt.checkpw(
            data["password"].encode("utf-8"),
            user["password"].encode("utf-8")
        ):
            raise ValueError("Email or password incorrect")

        # 4. Build JWT payload
        payload = {
            "sub":  user["email"],
            "role": user.get("role", "user"),
            "iat":  datetime.datetime.utcnow(),
            "exp":  datetime.datetime.utcnow() + datetime.timedelta(seconds=Config.JWT_EXP_SEC)
        }

        # 5. Encode token
        token = jwt.encode(payload, Config.JWT_SECRET, algorithm=Config.JWT_ALGO)

        # 6. Return user identifier and token
        return {
            "user_id": str(user["_id"]),
            "token":   token
        }
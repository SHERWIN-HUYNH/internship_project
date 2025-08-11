import bcrypt
from flask import current_app
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from ..utils.mongo import mongo_client

class UserModel:
   
    def __init__(self, email: str, password_hash: str, name: str = None, phone: str = None, is_admin: bool = False):
        self.email         = email
        self.password = password_hash
        self.name          = name
        self.phone         = phone
        self.is_admin      = is_admin

    def to_dict(self):
        return {
            "email":          self.email,
            "password":  self.password,
            "name":           self.name,
            "phone":          self.phone,
            "is_admin":       self.is_admin
        }
    
    @staticmethod
    def create_user(name, email, password,is_admin=False,phone=None):
        salt      = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
        COLLECTION  = mongo_client.accounts
        doc = {
            "name":    name,
            "email":        email,
            "password":     hashed_pw,
            "phone_number": phone,
            "role":         "admin" if is_admin else "user"
        }

        try:
            result = COLLECTION.insert_one(doc)
            return str(result.inserted_id)
        except DuplicateKeyError:
            raise ValueError("Email đã được đăng ký")

    @staticmethod
    def find_user_by_email(email):
        return mongo_client.accounts.find_one({"email": email})
    
    @staticmethod
    def check_password(hashed_password , password):
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
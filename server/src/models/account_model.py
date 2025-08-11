import bcrypt
from flask import current_app
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from ..utils.mongo import mongo_client

class UserModel:
   
    def __init__(self, email: str, password_hash: str, name: str = None, phone: str = None, role: bool = False):
        self.email         = email
        self.password = password_hash
        self.name          = name
        self.phone         = phone
        self.role          = role

    def to_dict(self):
        return {
            "email":          self.email,
            "password":       self.password,
            "name":           self.name,
            "phone":          self.phone,
            "role":           self.role
        }
    
    @staticmethod
    def create_user(name, email, password,role="user",phone=None):
        salt      = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
        COLLECTION  = mongo_client.accounts
        doc = {
            "name":    name,
            "email":        email,
            "password":     hashed_pw,
            "phone": phone,
            "role":  role
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
    
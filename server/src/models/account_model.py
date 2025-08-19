import bcrypt
from bson.objectid import ObjectId
from pymongo.errors import DuplicateKeyError
from flask import current_app

from ..utils.exceptions import NonExistAccount
from ..utils.mongo import mongo_client


class UserModel:
    def __init__(self):
        self.accounts = mongo_client.accounts
    def exists_by_id(self, id: str) -> bool:
        """Check if an account exists by ID."""
        try:
            return self.accounts.find_one({'_id': ObjectId(id)}) is not None
        except:
            return False

    def get_account_with_id(self, id: str) -> dict:
        """Retrieve account by ID."""
        account = self.accounts.find_one({'_id': ObjectId(id)}, {'_id': 1, 'role': 1})
        if account is None:
            raise NonExistAccount(id)
        return {'id': str(account['_id']), 'role': account.get('role', 'user')}
    
    def create(self, name: str, email: str, password: str, role: str = "user", phone: str = None) -> str:
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

        doc = {
            "name": name,
            "email": email,
            "password": hashed_pw,
            "phone": phone,
            "role": role
        }

        try:
            result = self.accounts.insert_one(doc)
            return str(result.inserted_id)
        except DuplicateKeyError:
            raise ValueError("Email đã được đăng ký")

    
    def find_by_email(self,email: str) -> dict:
        return self.accounts.find_one({"email": email})


    def check_password(hashed_password: str, raw_password: str) -> bool:
        return bcrypt.checkpw(
            raw_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    def exists_by_id(self, account_id: str) -> bool:
        return self.accounts.find_one({"_id": ObjectId(account_id)}, {"_id": 1}) is not None

account_model = UserModel()
import bcrypt
from bson import ObjectId
import logging
from flask_jwt_extended import get_jwt_identity
from ..models.account_model import UserModel
from ..utils.mongo import mongo_client
from ..utils.exceptions import NonExistAccount, UnauthorizedAccount

class AccountService():
    
    def __init__(self, db_client):
        self.accounts = db_client.accounts
    """
    User Services for business logic.
    """
    @staticmethod
    def create_user(username, email, password,is_admin=False,phone_number=None):
        """Hashes the password and inserts a new user into the database."""
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = UserModel(email, hashed_password, username, phone_number, is_admin)
        return user


    def get_account_with_email(self, email: str):
        account = self.accounts.find_one({'email': email}, {'_id': 1, 'role': 1})
        if account is None:
            raise NonExistAccount(id)
        return {'id': str(account['_id']), 'role': account['role']}


    def user_authorize(self, level='both'):
        account = self.get_account_with_email(get_jwt_identity())
        if level != 'both' and account['role'] != level:
            raise UnauthorizedAccount(f'Only {level} can do this')
        return account

    
accounts_services = AccountService(mongo_client)






import bcrypt
from bson import ObjectId
from flask_jwt_extended import get_jwt_identity
from ..models.account_model import UserModel
from ..utils.mongo import mongo_client
import hashlib
from ..utils.exceptions import NonExistAccount, UnauthorizedAccount
def hashing(input):
    assert isinstance(input, str), "Can not hash, input is not string"
    return hashlib.sha256(input.encode()).hexdigest()
class AccountService:
    """
    User Services for business logic.
    """
    def __init__(self, db_client):
        self.accounts = db_client.accounts

    def create_user(self, username: str, email: str, password: str, is_admin: bool = False, phone_number: str = None):
        """Hashes the password and inserts a new user into the database."""
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = UserModel(email, hashed_password, username, phone_number, is_admin)
        user_id = self.accounts.insert_one(user.__dict__).inserted_id
        return user_id

    def get_account_with_id(self, id: str):
        """Retrieve account by ID."""
        account = self.accounts.find_one({'_id': ObjectId(id)}, {'_id': 1, 'role': 1})
        if account is None:
            raise NonExistAccount(id)
        return {'id': str(account['_id']), 'role': account['role']}

    def user_authorize(self, level: str = 'both'):
        """Authorize user based on JWT identity and role."""
        user_id = get_jwt_identity()
        if not user_id:
            raise UnauthorizedAccount('Missing user identity in token')
        account = self.get_account_with_id(user_id)
        if level != 'both' and account['role'] != level:
            raise UnauthorizedAccount(f'Only {level} can do this')
        return account


    
accounts_services = AccountService(mongo_client)






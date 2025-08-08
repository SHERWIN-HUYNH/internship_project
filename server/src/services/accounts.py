import bcrypt
from server.models.account_model import User
from server.utils.mongo import mongoClient
import hashlib

def hashing(input):
    assert isinstance(input, str), "Can not hash, input is not string"
    return hashlib.sha256(input.encode()).hexdigest()
class AccountService():
    """
    User Services for business logic.
    """
    @staticmethod
    def create_user(username, email, password,is_admin=False,phone_number=None):
        """Hashes the password and inserts a new user into the database."""
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(email, hashed_password, username, phone_number, is_admin)
        return user
    
accounts_services = AccountService()
import bcrypt
from bson import ObjectId
from datetime import datetime
from flask_jwt_extended import get_jwt_identity
from ..models.account_model import UserModel
from ..utils.mongo import mongo_client
import hashlib
from ..utils.exceptions import NonExistAccount, UnauthorizedAccount, InvalidAccountState
def hashing(input):
    assert isinstance(input, str), "Can not hash, input is not string"
    return hashlib.sha256(input.encode()).hexdigest()
class AccountService:
    """
    User Services for business logic.
    """
    def __init__(self, db_client):
        self.accounts = db_client.accounts
        self.posts = db_client.posts

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


    def get_all_accounts(self):
        result = {}
        
        for account in self.accounts.find():
            name = account['name']
            create_at = account['create_at']
            update_at = account['update_at']

            # get active posts
            finding_posts_count = self.posts.count_documents({'account_id': account['_id'], 'status': 'finding'})
            # get found posts
            found_posts_count = self.posts.count_documents({'account_id': account['_id'], 'status': 'found'})

            result[str(account['_id'])] = {
                'name': name,
                'create_at': create_at,
                'update_at': update_at,
                'finding_posts_count': finding_posts_count,
                'found_posts_count': found_posts_count,
            }

        return result


    def update_state_account(self, account_id, new_state):
        if new_state not in ['active', 'disable']:
            raise InvalidAccountState(account_id)
        return self.accounts.update_one({'_id': ObjectId(account_id)}, {'$set': {'update_at': datetime.now(), 'state': new_state}}).modified_count
    
accounts_services = AccountService(mongo_client)
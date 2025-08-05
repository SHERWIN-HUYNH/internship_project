from utils.mongo import mongo_client
import hashlib

def hashing(input):
    assert isinstance(input, str), "Can not hash, input is not string"
    return hashlib.sha256(input.encode()).hexdigest()

class AccountsServices():
    def __init__(self, db_client):
        self.db_client = db_client
        self.accounts = self.db_client.accounts

    def get_account_by_id(self, id):
        return self.accounts.find_one({'_id': id})

    def add_account(self, full_name, email, password, is_admin=False):
        ''' add validator to this '''

        return str(
            self.accounts.insert_one(
                {
                    "_id": hashing(email),
                    "full_name": full_name,
                    "email": email,
                    "password": hashing("password"),
                    "role": "user" if not is_admin else "admin",
                }
            ).inserted_id
        )

accounts_services = AccountsServices(mongo_client)

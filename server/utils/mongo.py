from pymongo import MongoClient, errors
import logging
import configparser
import hashlib

def hashing(input):
    assert isinstance(input, str), 'Can not hash, input is not string'
    return hashlib.sha256(input.encode()).hexdigest()

class MongoDbClient:
    def __init__(self, config: configparser.RawConfigParser):
        self.logger = logging.getLogger('MongoClient')
        self.logger.setLevel(logging.DEBUG)
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(config['logging']['formatter']))
        self.logger.addHandler(handler)

        try:
            self.client = MongoClient(config['mongo']['connect_str'])
            self.client.server_info()
            self.logger.info('Mongo connect successfully')

            self.db = self.client['persons_db']
            self.accounts = self.db['accounts']
            self.images = self.db['images']
            self.posts = self.db['posts']
        except errors.ServerSelectionTimeoutError as e:
            self.logger.exception(f'Could not connect to mongo')

    def add_account(self, full_name, email, password,phone_number, is_admin=False):
        assert isinstance(full_name, str), 'full_name not str'
        assert isinstance(email, str), 'email not str'
        assert isinstance(password, str), 'password not str'
        assert isinstance(phone_number, str), 'phone_number phải là str'

        return self.accounts.insert_one({
            '_id': hashing(email),
            'full_name': full_name,
            'email': email,
            'password': hashing('password'),
             'phone_number': phone_number,
            'role': 'user' if not is_admin else 'admin'
        })
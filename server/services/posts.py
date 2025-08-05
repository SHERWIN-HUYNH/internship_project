from utils.mongo import mongo_client
from utils.validators import missing_fields_validate, fields_type_validate, date_validate
from utils.exceptions import MissingFields, InvalidFieldType, NonExistAccount, InvalidDate
from bson import ObjectId
from datetime import datetime

class PostsServices():
    def __init__(self, db_client):
        self.db_client = db_client
        self.posts = db_client.posts

    def get_post_by_id(self, post_id: str):
        self.posts.find_one({'_id', ObjectId(post_id)})

    def add_post(self, data: dict):
        # check if enough field
        required_fields = [
            "account_id",
            "missing_person_name",
            "gender",
            "dob",
            "date_of_event"
            "description",
            "contact_info",
        ]
        if not missing_fields_validate(data, required_fields):
            raise MissingFields(required_fields)
        # everything has to be str type
        if not fields_type_validate(data, required_fields, str):
            raise InvalidFieldType(required_fields, str)
        # check account_id in db
        if self.get_account_by_id(data['id']) is None:
            raise NonExistAccount()
        # check for correct date format and valid date
        dob = date_validate(data['dob'])
        if dob is None and date_of_event is None:
            raise InvalidDate(dob)
        date_of_event = date_validate(data['date_of_event'])
        if date_of_event is None:
            raise InvalidDate(date_of_event)
        # check for gender
        if data['gender'] not in ['F', 'M']:
            raise Exception('gender field only accepted "M" or "F"')

        return str(self.posts.insert_one({
            'account_id': data['account_id'],
            'missing_person_name': data['missing_person_name'],
            'gender': data['gender'],
            'dob': data['dob'],
            'date_of_event': data['date_of_event'],
            'description': data['description'],
            'contact_info': data['contact_info'],
            'status': 'finding',
            'create_at': datetime.now().timestamp()
        }).inserted_id)

posts_services = PostsServices(mongo_client)
from ..utils.mongo import mongo_client
from ..utils.validators import date_validate
from ..utils.s3 import s3_client
from ..utils.face import img_to_embedding, get_score_of_img_to_imgs
from ..utils.exceptions import (
    MissingFields,
    NonExistAccount,
    InvalidDate,
    NonExistPost,
    PersonNameExisted,
    DeletedImagesFailed,
    DetectFaceError
)
from bson import ObjectId
from io import BytesIO
from datetime import datetime, timedelta
import re


class PostsServices:
    def __init__(self, db_client):
        self.posts = db_client.posts
        self.accounts = db_client.accounts
        self.images = db_client.images

    def get_post_by_id(self, post_id: str):
        post = self.posts.find_one({"_id": ObjectId(post_id)})
        if post is None:
            raise NonExistPost(post_id)
        post["_id"] = str(post["_id"])
        post["account_id"] = str(post["account_id"])
        return post


    def get_posts_by_account_id(self, account_id: str):
        posts = self.posts.find({"account_id": ObjectId(account_id)}, {'_id': 1}).to_list()
        return [str(p['_id']) for p in posts]


    def get_similar_posts_to_img(self, file_name: str, stream: BytesIO, threshold=1.8):
        img = img_to_embedding(stream)
        if img is None:
            raise DetectFaceError(file_name)

        pipeline = [
            {
                '$lookup':{
                    'from': 'posts',
                    'localField': 'post_id',
                    'foreignField': '_id',
                    'as': 'post'
                }
            },
            { '$unwind': '$post'},
            { '$match': {'post.status': 'finding'} },
            {
                '$project': {
                    '_id': {'$toString': '$_id'},
                    'post._id': {'$toString': '$post._id'},
                    'feature': 1,
                }
            },
            {
                '$unset': [
                    'post_id',
                    'is_avatar',
                    'post.account_id',
                    'post.gender',
                    'post.date_of_event',
                    'post.create_at',
                    'post.missing_date',
                    'post.description',
                    'post.missing_person_name',
                    'post.dob',
                    'post.contact_info'
                    'post.status'
                ]
            }
        ]
        imgs = self.images.aggregate(pipeline)
        imgs_score = get_score_of_img_to_imgs(img, imgs)
        return list(filter(lambda i: True if i['l2_score'] <= threshold else False, imgs_score))


    def get_filter_posts(self, filter):
        query_condition = {}
        if filter['person_name'] != '':
            query_condition['person_name'] = filter['person_name']

        if filter['gender'] in ['M', 'F']:
            query_condition['person_name'] = filter['person_name']

        dob_from = date_validate(filter['dob_from'])
        dob_to = date_validate(filter['dob_from'])
        date_of_event_from = date_validate(filter['date_of_event_from'])
        date_of_event_to = date_validate(filter['date_of_event_to'])
        create_from = date_validate(filter['create_from'])
        create_to = date_validate(filter['create_to'])

        if None not in [dob_from, dob_to] and dob_from < dob_to:
            query_condition['dob'] = {"$gte": dob_from, "$lte": dob_to}
        if None not in [date_of_event_from, date_of_event_to] and date_of_event_from < date_of_event_to:
            query_condition['date_of_event'] = {"$gte": date_of_event_from, "$lte": date_of_event_to}
        if None not in [create_from, create_to] and create_from < create_to:
            query_condition['create_at'] = {"$gte": create_from, "$lte": create_to}

        # only query post with status finding
        query_condition['status'] = 'finding'
        return [str(p['_id']) for p in self.posts.find(query_condition, {'_id': 1}).to_list()]


    def report(self, report_from: str):
        if report_from == "":
            start_date = datetime.now() - timedelta(days=100)
        else:
            start_date = date_validate(report_from)
            if start_date is None:
                raise InvalidDate(report_from)

        active_posts_count = 0
        queuing_posts_count = 0

        # posts created timeline
        posts_timeline = []
        for post_timeline in (
            self.posts.find(
                {"create_at": {"$gte": start_date, "$lte": datetime.now()}},
                {"_id": 1, "create_at": 1, 'status': 1},
            )
            .sort({"create_at": -1})
            .to_list()
        ):
            post_timeline["_id"] = str(post_timeline["_id"])
            post_timeline["create_at"] = str(
                post_timeline["create_at"].strftime("%d/%m/%Y %H:%M:%S")
            )
            posts_timeline.append(post_timeline)

            active_posts_count += 1 if post_timeline['status'] == 'finding' else 0
            queuing_posts_count += 1 if post_timeline['status'] == 'queuing' else 0

        return {
            "active_posts_count": active_posts_count,
            "queuing_posts_count": queuing_posts_count,
            "posts_timeline": posts_timeline,
        }


    def update_post_status_to_finding(self, post_id):
        post = self.get_post_by_id(post_id)
        return self.posts.update_one(
            {"_id": ObjectId(post["_id"])}, {"$set": {"status": "finding"}}
        ).modified_count


    def create_post(self, new_post: dict):
        account = self.accounts.find_one({'_id': ObjectId(new_post['account_id'])}, {'_id': 1})
        if account is None:
            raise NonExistAccount(new_post['account_id'])

        if "" in [new_post["missing_person_name"], new_post["contact_info"]]:
            raise MissingFields("'missing_person_name' or 'contact_info'")

        if re.fullmatch(r"[a-zA-Z ]+", new_post["missing_person_name"]) is None:
            raise ValueError("Person name accept no special character")

        if (
            self.posts.find_one(
                {"missing_person_name": new_post["missing_person_name"]}, {"_id": 1}
            )
            is not None
        ):
            raise PersonNameExisted(new_post["missing_person_name"])

        if new_post["gender"] not in ["M", "F", ""]:
            raise ValueError("Gender only accept 'M', 'F', ''")

        dob = date_validate(new_post["dob"])
        if new_post["dob"] != "" and dob is None:
            raise InvalidDate(new_post["dob"])

        date_of_event = date_validate(new_post["date_of_event"])
        if new_post["date_of_event"] != "" and date_of_event is None:
            raise InvalidDate(new_post["date_of_event"])

        if None not in [dob, date_of_event] and dob > date_of_event:
            raise Exception("date of event must be later than dob")

        return str(
            self.posts.insert_one(
                {
                    "account_id": account["_id"],
                    "missing_person_name": new_post["missing_person_name"],
                    "gender": new_post["gender"],
                    "dob": dob,
                    "date_of_event": date_of_event,
                    "description": new_post["description"],
                    "contact_info": new_post["contact_info"],
                    "status": "queuing",
                    "create_at": datetime.now(),
                }
            ).inserted_id
        )


    def update_post(self, modified_post: dict[str, str]):
        # check is post existed
        existed_post = self.get_post_by_id(modified_post['post_id'])

        if "" in [modified_post["missing_person_name"], modified_post["contact_info"]]:
            raise MissingFields("'missing_person_name' or 'contact_info'")

        if re.fullmatch(r"[a-zA-Z ]+", modified_post["missing_person_name"]) is None:
            raise ValueError("Person name accept no special character")

        other_post_with_same_name = self.posts.find_one({"missing_person_name": modified_post["missing_person_name"], '_id': {'$ne': ObjectId(existed_post['_id'])}}, {"_id": 1})
        if other_post_with_same_name is not None:
            raise PersonNameExisted(modified_post["missing_person_name"])

        if modified_post["gender"] not in ["M", "F", ""]:
            raise ValueError("Gender only accept 'M', 'F', ''")

        dob = date_validate(modified_post["dob"])
        if modified_post["dob"] != "" and dob is None:
            raise InvalidDate(modified_post["dob"])

        date_of_event = date_validate(modified_post["date_of_event"])
        if modified_post["date_of_event"] != "" and date_of_event is None:
            raise InvalidDate(modified_post["date_of_event"])

        if None not in [dob, date_of_event] and dob > date_of_event:
            raise Exception("date of event must be later than dob")

        return self.posts.update_one(
                {
                    '_id': ObjectId(existed_post['_id'])
                },
                {
                    '$set': 
                    {
                        "missing_person_name": modified_post["missing_person_name"],
                        "gender": modified_post["gender"],
                        "dob": dob,
                        "date_of_event": date_of_event,
                        "description": modified_post["description"],
                        "contact_info": modified_post["contact_info"],
                        "status": "queuing",
                        "create_at": datetime.now(),
                    }
                }
            ).modified_count


    def delete_post(self, post_id: str):
        imgs = self.images.find({'post_id': ObjectId(post_id)}, {'_id': 1})

        # delete all imgs in s3
        result = s3_client.delete_imgs([str(img['_id']) for img in imgs])
        if result is not None:
            raise DeletedImagesFailed(post_id, result)

        # delete all the imgs in db
        deleted_imgs_count = self.images.delete_many({'post_id': ObjectId(post_id)}).deleted_count
        if deleted_imgs_count > 0:
            # delete  post in db
            return self.posts.delete_one({'_id': ObjectId(post_id)}).deleted_count
        raise DeletedImagesFailed(post_id)

        

posts_services = PostsServices(mongo_client)
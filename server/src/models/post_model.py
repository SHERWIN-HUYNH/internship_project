import bcrypt
from flask import current_app
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from bson import ObjectId
from datetime import datetime

from ..utils.convert import convert_to_json_serializable
from ..utils.mongo import mongo_client
import logging
logger = logging.getLogger(__name__)
class PostRepository:
    def __init__(self):
        self.posts = mongo_client.posts
        self.account = mongo_client.accounts
        self.images = mongo_client.images
    def to_dict(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "is_avatar": self.is_avatar,
            "feature": self.feature,
            "created_at": self.created_at,
            "s3_key": self.s3_key,
            "images": [image.to_dict() for image in self.images]
        }
    def get_all_posts_with_author(self):
        posts = self.posts.find({})
        result = []
        for post in posts:
            
            account = self.account.find_one({'_id': ObjectId(post['account_id'])})
            author_name = account['name'] if account else 'Unknown' 

            # Tạo object kết quả
            post_data = {
                'post_id': str(post['_id']),
                'name': post.get('name', ''),
                'gender': post.get('gender', ''),
                'dob': post.get('dob', ''),
                'missing_since': post.get('missing_since', ''),
                'description': post.get('description', ''),
                'contact_info': post.get('contact_info', ''),
                'status': post.get('status', ''),
                'author_name': author_name,
                'create_at': post.get('create_at', ''),
                'update_at': post.get('update_at', ''),
                'suspect': post.get('suspect', [])
            }
            result.append(post_data)
        return result
    def aggregate(self, pipeline: list, session=None) -> list:
        """Execute an aggregation pipeline on the images collection."""
        return list(self.posts.aggregate(pipeline, session=session))
    def get_all_posts(self, session=None) -> list:
        """Lấy tất cả bài post từ MongoDB."""
        try:
            pipeline = [
                {
                    "$lookup": {
                        "from": "images",
                        "localField": "_id",
                        "foreignField": "post_id",
                        "as": "images"
                    }
                },
                {
                    "$project": {
                        "_id": {"$toString": "$_id"},
                        "account_id": {"$toString": "$account_id"},
                        "name": 1,
                        "dob": 1,
                        "gender": 1,
                        "status": 1,
                        "create_at": 1,
                        "update_at": 1,
                        "suspect": {
                            "$cond": {
                                "if": {"$isArray": "$suspect"},
                                "then": {"$map": {"input": "$suspect", "as": "s", "in": {"$toString": "$$s"}}},
                                "else": []
                            }
                        },
                        "images": {
                            "$map": {
                                "input": "$images",
                                "as": "img",
                                "in": {
                                    "_id": {"$toString": "$$img._id"},
                                    "is_avatar": "$$img.is_avatar",
                                    "created_at": "$$img.created_at",
                                    # Giả sử bạn lưu extension trong images collection
                                    "s3_key": {"$concat": ["posts/", {"$toString": "$_id"}, "/", {"$toString": "$$img._id"}, ".jpg"]}  # Cần cập nhật nếu lưu extension
                                }
                            }
                        }
                    }
                }
            ]
            return list(self.posts.aggregate(pipeline, session=session))
        except Exception as e:
            print(f"Error: {e}")
            raise
    def insert_one(self, post_doc: dict, session=None) -> ObjectId:
        result = self.posts.insert_one(post_doc, session=session)
        return result.inserted_id
    def find(self, query: dict) -> list:
        """
        Find posts matching the given query.
        Args:
            query: MongoDB query dictionary (e.g., {'_id': {'$in': [ObjectId('...'), ...]}})
        Returns:
            List of post documents
        """
        try:
            posts = list(self.posts.find(query))
            for post in posts:
                post['name'] = post.get('name', '')
                post['description'] = post.get('description', '')
                post['missing_since'] = post.get('update_at') or post.get('create_at', '')
                post['gender'] = post.get('gender', '')
                post['dob'] = post.get('dob', '')
                post['relationship'] = post.get('relationship', '')
                post['address'] = post.get('address', '')
                post['contact_infor'] = post.get('contact_infor', '')
                post['images'] = post.get('images', [])
            logger.info(f"Found {len(posts)} posts for query: {query}")
            return posts
        except Exception as e:
            logger.error(f"Error in find: {str(e)}")
            raise
    def update_one(self, filter: dict, update: dict, session=None):
        self.posts.update_one(filter, update, session=session)

    def get_related_posts(self, post_id: str) -> list:
        """
        Retrieve related posts based on the 'suspect' field in the given post.
        
        :param post_id: The ObjectId string of the main post.
        :return: List of related post documents (as dictionaries).
        :raises ValueError: If post_id is invalid.
        """
        if not (post_id and len(post_id) == 24 and all(c in '0123456789abcdefABCDEF' for c in post_id)):
            raise ValueError("Invalid post_id: must be a 24-character hex string")

        try:
            main_post = self.posts.find_one({'_id': ObjectId(post_id)})
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")

        if not main_post:
            raise ValueError("Post not found")

        suspect_ids = main_post.get('suspect', [])

        related_posts = list(self.posts.find({'_id': {'$in': suspect_ids}}))
        for post in related_posts:
            post['_id'] = str(post['_id'])
            if 'account_id' in post:
                post['account_id'] = str(post['account_id'])
            
            post_images = list(self.images.find({'post_id': ObjectId(post['_id'])}))
            if post_images:
                post['images'] = [img.get('s3_key', '') for img in post_images]
            else:
                post['images'] = []

        return related_posts
    def update_many(self, filter: dict, update: dict, session=None):
        self.posts.update_many(filter, update, session=session)
    def get_by_id_with_images(self, post_id: str):
        post = self.posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            return None

        post["_id"] = str(post["_id"])
        if "post_id" in post and isinstance(post["post_id"], ObjectId):
            post["post_id"] = str(post["post_id"])
        post_id_value = ObjectId(post["_id"]) 
        images_data = self.images.find({"post_id": post_id_value})
        post["images"] = [img.get("s3_key", "") for img in images_data]

        post["account"]= self.account.find_one({"_id": post["account_id"]})
        return post

    def get_ids_by_account_id(self, account_id: str):
        cursor = self.posts.find({"account_id": ObjectId(account_id)}, {"_id": 1}).to_list()
        return [str(p["_id"]) for p in cursor]

    def exists_name(self, name: str) -> bool:
        return self.posts.find_one({"missing_person_name": name}, {"_id": 1}) is not None

    def exists_name_excluding(self, name: str, exclude_id: str) -> bool:
        return self.posts.find_one(
            {"missing_person_name": name, "_id": {"$ne": ObjectId(exclude_id)}},
            {"_id": 1}
        ) is not None
    def find_one_and_update(self, new_status:str, obj_id: str): 
        post =  self.posts.find_one_and_update(
        {"_id": obj_id},
        {"$set": {"status": new_status, "update_at": datetime.utcnow()}},
        return_document=ReturnDocument.AFTER
         )
        if post:
            return convert_to_json_serializable(post)
        return None
    def find_ids_by_filter(self, query_condition: dict):
        cursor = self.posts.find(query_condition, {"_id": 1}).to_list()
        return [str(p["_id"]) for p in cursor]

    def find_timeline_since(self, start_date: datetime, end_date: datetime):
        cursor = (
            self.posts.find(
                {"create_at": {"$gte": start_date, "$lte": end_date}},
                {"_id": 1, "create_at": 1, "status": 1}
            )
            .sort({"create_at": -1})
            .to_list()
        )
        return cursor

    

    def insert(self, doc: dict) -> str:
        return str(self.posts.insert_one(doc).inserted_id)

    def update(self, post_id: str, set_doc: dict) -> int:
        return self.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": set_doc}
        ).modified_count

    def delete_one(self, post_id: str) -> int:
        return self.posts.delete_one({"_id": ObjectId(post_id)}).deleted_count

post_model = PostRepository()
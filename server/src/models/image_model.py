from bson import ObjectId
from ..utils.mongo import mongo_client
class ImageRepository:
    def __init__(self):
        self.images = mongo_client.images
    
    def insert_one(self, image_doc: dict, session=None) -> ObjectId:
        """Insert a single image document."""
        result = self.images.insert_one(image_doc, session=session)
        return result.inserted_id

    def aggregate(self, pipeline: list, session=None) -> list:
        """Execute an aggregation pipeline on the images collection."""
        return list(self.images.aggregate(pipeline, session=session))
    def insert(self, doc: dict) -> str:
        return str(self.images.insert_one(doc).inserted_id)

    def find_ids_by_post_id(self, post_id: str):
        cursor = self.images.find({"post_id": ObjectId(post_id)}, {"_id": 1})
        return [str(img["_id"]) for img in cursor]

    def delete_many_by_post_id(self, post_id: str) -> int:
        return self.images.delete_many({"post_id": ObjectId(post_id)}).deleted_count

    def embeddings_for_active_posts(self):
        pipeline = [
            {
                "$lookup": {
                    "from": "posts",
                    "localField": "post_id",
                    "foreignField": "_id",
                    "as": "post"
                }
            },
            {"$unwind": "$post"},
            {"$match": {"post.status": "pending"}},
            {
                "$project": {
                    "_id": {"$toString": "$_id"},
                    "post._id": {"$toString": "$post._id"},
                    "feature": 1
                }
            },
            {
                "$unset": [
                    "post_id",
                    "is_avatar",
                    "post.account_id",
                    "post.gender",
                    "post.missing_since",
                    "post.create_at",
                    "post.description",
                    "post.name",
                    "post.dob",
                    "post.contact_info",
                    "post.status"
                ]
            }
        ]
        return self.images.aggregate(pipeline)

image_model = ImageRepository()
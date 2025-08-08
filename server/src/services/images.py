from utils.mongo import mongo_client
from bson import ObjectId
from io import BytesIO

class ImagesServices:
    def __init__(self, db_client):
        self.db_client = db_client
        self.images = self.db_client.images

    def get_image_urls_by_post_id(self, post_id: str):
        return list(self.images.find({'post_id': ObjectId(post_id)}))

    def up_load_images(index_avatar: int, post_id: str, stream: BytesIO):
        pass


images_services = ImagesServices(mongo_client)

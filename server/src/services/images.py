from ..utils.mongo import mongo_client
from ..utils.face import get_score_of_img_to_imgs
from ..utils.exceptions import ImageUploadFailed, DetectFaceError, DifferentImageIdentityError
from ..utils.face import img_to_embedding
from ..utils.s3 import s3_client
from bson import ObjectId
from io import BytesIO


class ImagesServices:
    def __init__(self, db_client):
        self.images = db_client.images
        self.posts = db_client.posts


    def get_imgs_id_with_post_id(self, post_id: str):
        return [
            {"id": str(img["_id"]), "is_avatar": img["is_avatar"]}
            for img in list(
                self.images.find(
                    {"post_id": ObjectId(post_id)}, {"_id": 1, "is_avatar": 1}
                )
            )
        ]


    def get_post_avatar_img(self, post_id: str):
        img = self.images.find_one({'post_id': ObjectId(post_id), 'is_avatar': True}, {'_id': 1})
        return str(img['_id'])


    def report(self):
        # number of images
        images_count = self.images.count_documents({})
        # total images size
        total_images_size = s3_client.get_total_size()
        return {
            "images_count": images_count,
            "total_images_size_in_bytes": total_images_size,
        }


    def upload_image(
        self, file_name: str, stream: BytesIO, post_id: str, threshold: float=2
    ):
        # get embeds of imgs
        img = img_to_embedding(stream)
        if img is None:
            raise DetectFaceError(file_name)

        # only do if there're already imgs in db
        if self.images.count_documents({}) > 0:
            pipeline = [
                { '$match': None },
                {
                    '$lookup':{
                        'from': 'posts',
                        'localField': 'post_id',
                        'foreignField': '_id',
                        'as': 'post'
                    }
                },
                { '$unwind': '$post'},
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

            pipeline[0]['$match'] = {'post_id':  ObjectId(post_id)}
            imgs = self.images.aggregate(pipeline).to_list()

            if any(map(lambda i: i['l2_score'] > threshold, get_score_of_img_to_imgs(img_embed=img, other_imgs_embed=imgs))):
                raise DifferentImageIdentityError(file_name)

        # store embed in db
        img_id = self.images.insert_one(
                {
                    "post_id": ObjectId(post_id),
                    "is_avatar": False,
                    "feature": img.tolist(),
                }
            ).inserted_id

        # upload images to s3
        if not s3_client.upload_to_s3(stream, str(img_id)):
            self.images.delete_one({'_id': img_id})
            raise ImageUploadFailed(file_name)
        return str(img_id)

    
    def remove_image(self, img_id: str):
        img = self.images.find_one({'_id': ObjectId(img_id)}, {'post_id': 1, 'is_avatar': 1})
        if img is None:
            raise Exception(f'Not found img with id {img_id}')
        if self.images.count_documents({'post_id': img['post_id']}) == 1:
            raise Exception(f'Post must have at least 1 image')
        if img['is_avatar']:
            raise Exception(f'This image is avatar')
        # delete from s3
        result = s3_client.delete_imgs([img_id])
        if result is None:
            return self.images.delete_one({'_id': ObjectId(img_id)}).deleted_count
        s3_client.logger.error(f'Deleted failed\n{result}')
        return 0


    def remove_images(self, imgs_id: list[str]):
        # delete from s3
        result = s3_client.delete_imgs(imgs_id)
        if result is None:
            return self.images.delete_many({'_id': {'$in': [ObjectId(id) for id in imgs_id]}}).deleted_count
        s3_client.logger.error(f'Deleted failed\n{result}')
        return 0


    def update_image_avatar(self, img_id: str):
        img = self.images.find_one({'_id': ObjectId(img_id)}, {'post_id': 1, 'is_avatar': 1})
        if img is None:
            raise Exception(f'Not found img with id {img_id}')
        if self.images.update_many({'post_id': img['post_id']}, {'$set': {'is_avatar': False}}).modified_count > 0:
            return self.images.update_one({'_id': ObjectId(img_id)}, {'$set': {'is_avatar': True}}).modified_count
        else: 
            raise Exception(f'Updated avatar failed')


images_services = ImagesServices(mongo_client)

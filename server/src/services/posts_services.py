from io import BytesIO
from datetime import datetime, timedelta
import os
from pathlib import Path
from bson import ObjectId
from ..utils.check_similarity import _dob_similarity, _gender_similarity, _img_score_from_l2, _min_l2_to_post_embeddings, _name_similarity, _weighted_score
from ..schema.post_schema import (
    build_create_payload, build_update_payload, build_filter
)
from ..utils.face import (
     img_to_embedding, get_score_of_img_to_imgs
)
from ..utils.exceptions import (
    FileType, ImageIdentityError, ImageUploadFailed, NonExistPost, NonExistAccount, PersonNameExisted,
    DetectFaceError, DeletedImagesFailed
)
from ..models.post_model import post_model
from ..utils.s3 import s3_client
from ..models.image_model import image_model
from ..models.account_model import account_model
IMG_L2_THRESHOLD = 1.6   # ngưỡng L2 cho embedding hiện tại của bạn
WEIGHT_NAME   = 0.35
WEIGHT_DOB    = 0.20
WEIGHT_GENDER = 0.15
WEIGHT_IMG    = 0.30
SCORE_THRESH  = 0.60     # tống điểm tối thiểu để đức vào suspect
TOPK_SUSPECTS = 10
MAX_IMAGES    = 5
from bson import ObjectId
from datetime import datetime
from io import BytesIO
import numpy as np
import logging
from ..utils.exceptions import NonExistAccount, DetectFaceError, ImageUploadFailed
from ..schema.post_schema import build_create_payload
from ..utils.check_similarity import _name_similarity, _dob_similarity, _gender_similarity, _min_l2_to_post_embeddings, _img_score_from_l2, _weighted_score
from ..utils.s3 import s3_client
from ..utils.mongo import mongo_client
SCORE_THRESH = 0.5
TOPK_SUSPECTS = 5
import logging
logger = logging.getLogger(__name__)
class PostService:
    def __init__(self, mongo_client):
        self.client = mongo_client
        self.posts = post_model
        self.images = image_model
        self.accounts = account_model
        self.logger = logging.getLogger("PostService")
        self.logger.setLevel(logging.INFO)
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(logging.Formatter("%(asctime)s %(name)s [%(levelname)s]: %(message)s"))
            self.logger.addHandler(handler)

    
    def create_post_with_images(self, new_post: dict, files, threshold: float = 1.6) -> str:
        if not self.accounts.exists_by_id(new_post["account_id"]):
            self.logger.error(f"Account not found: {new_post['account_id']}")
            raise NonExistAccount(new_post["account_id"])

        payload = build_create_payload(new_post)
        self.logger.info(f"Payload: {payload}")

        new_name = payload.get("name")
        new_dob = payload.get("dob")
        new_gender = payload.get("gender")

        s3_uploaded_keys = []
        try:
            with self.client.start_session() as session:
                with session.start_transaction():
                    post_doc = {
                        "_id": ObjectId(),
                        "account_id": ObjectId(new_post["account_id"]),
                        **payload,
                        "status": "pending",
                        "create_at": datetime.now(),
                        "update_at": datetime.now(),
                    }
                    self.posts.insert_one(post_doc, session=session)
                    post_id = post_doc["_id"]
                    self.logger.info(f"CREATE 1 - Post ID: {post_id}")

                    this_post_embeddings: list[np.ndarray] = []
                    image_ids = []

                    for idx, file in enumerate(files):
                        # 1) Đọc bytes
                        raw = file.read()
                        if not raw:
                            self.logger.error(f"Empty file: {file.filename}")
                            raise DetectFaceError(file.filename)

                        # 2) Embedding
                        emb = img_to_embedding(BytesIO(raw))
                        if emb is None:
                            self.logger.error(f"No face detected in file: {file.filename}")
                            raise DetectFaceError(file.filename)

                        # 3) Tạo ID ảnh, lấy đuôi gốc và upload
                        image_id = ObjectId()
                        orig_ext = Path(file.filename).suffix.lower()
                        if not orig_ext:
                            raise FileType("Missing file extension")

                        # Upload: giữ nguyên đuôi gốc; nhận về final_key chuẩn để lưu DB
                        final_key, ext = s3_client.upload_to_s3(
                            raw, f"{post_id}/{image_id}", orig_ext
                        )
                        s3_uploaded_keys.append(final_key)
                        self.logger.info(f"CREATE 3 - S3 Key: {final_key}")

                        # 4) Lưu image doc với s3_key là final_key
                        image_doc = {
                            "_id": image_id,
                            "post_id": post_id,
                            "is_avatar": idx == 0,
                            "feature": emb.tolist(),
                            "created_at": datetime.now(),
                            "s3_key": final_key, 
                        }
                        self.images.insert_one(image_doc, session=session)
                        image_ids.append(image_id)
                        self.logger.info(f"CREATE 2 - Image ID: {image_id}")

                        # 5) Lưu embedding cho so khớp
                        this_post_embeddings.append(emb)

                  
                    pipeline = [
                        {"$match": {"post_id": {"$ne": post_id}}},
                        {
                            "$lookup": {
                                "from": "posts",
                                "localField": "post_id",
                                "foreignField": "_id",
                                "as": "post"
                            }
                        },
                        {"$unwind": "$post"},
                        {
                            "$project": {
                                "feature": 1,
                                "post_id": 1,
                                "post_id_str": {"$toString": "$post._id"},
                                "name": "$post.name",
                                "dob": "$post.dob",
                                "gender": "$post.gender"
                            }
                        },
                    ]
                    other_imgs = list(self.images.aggregate(pipeline, session=session))
                    self.logger.info(f"Other Images: {len(other_imgs)}")

                    posts_map = {}
                    for it in other_imgs:
                        pid = it["post_id"]
                        pid_str = it["post_id_str"]
                        entry = posts_map.get(pid_str)
                        if entry is None:
                            entry = {
                                "_id": pid,
                                "name": it.get("name"),
                                "dob": it.get("dob"),
                                "gender": it.get("gender"),
                                "features": []
                            }
                            posts_map[pid_str] = entry
                        entry["features"].append(it["feature"])

                    scored = []
                    for pid_str, info in posts_map.items():
                        name_s = _name_similarity(new_name, info.get("name"))
                        dob_s = _dob_similarity(new_dob, info.get("dob"))
                        gender_s = _gender_similarity(new_gender, info.get("gender"))
                        min_l2 = _min_l2_to_post_embeddings(this_post_embeddings, info.get("features", []))
                        img_s = _img_score_from_l2(min_l2, threshold)
                        total = _weighted_score(name_s, dob_s, gender_s, img_s)
                        self.logger.info(f"Comparing with Post {pid_str}:")
                        self.logger.info(f"  Name Similarity: {name_s}")
                        self.logger.info(f"  DOB Similarity: {dob_s}")
                        self.logger.info(f"  Total Score: {total}")
                        scored.append({
                            "_id": info["_id"],
                            "score": total,
                            "name_s": name_s,
                            "dob_s": dob_s,
                            "gender_s": gender_s,
                            "min_l2": min_l2,
                            "img_s": img_s,
                        })

                    scored.sort(key=lambda x: x["score"], reverse=True)
                    suspects = [item["_id"] for item in scored if item["score"] >= SCORE_THRESH][:TOPK_SUSPECTS]
                    self.logger.info(f"Suspects: {suspects}")

                    if suspects:
                        self.posts.update_one(
                            {"_id": post_id},
                            {"$set": {"suspect": suspects, "update_at": datetime.now()}},
                            session=session
                        )
                        self.posts.update_many(
                            {"_id": {"$in": suspects}},
                            {"$addToSet": {"suspect": post_id}, "$set": {"update_at": datetime.now()}},
                            session=session
                        )

                    self.posts.update_one(
                        {"_id": post_id},
                        {"$set": {"update_at": datetime.now()}},
                        session=session
                    )
                    self.logger.info("CREATE SUCCESS")
                    return str(post_id)

        except Exception as e:
            self.logger.error(f"Transaction failed: {str(e)}")
            for key in reversed(s3_uploaded_keys):
                try:
                    s3_client.delete_object(key)
                except Exception as ex:
                    self.logger.error(f"Failed to delete S3 object {key}: {str(ex)}")
            raise e

    def get_all_posts(self) -> list:
        """Lấy tất cả bài post và thêm presigned URL cho ảnh."""
        try:
            posts = self.posts.get_all_posts()
            for post in posts:
                for image in post["images"]:
                    # Tạo presigned URL từ s3_key
                    image["url"] = s3_client.get_presigned_url(image["s3_key"])
            return posts
        except Exception as e:
            self.logger.error(f"Failed to get posts with images: {str(e)}")
            raise

    def get_posts_by_ids(self, post_ids: list):
        post_ids = [ObjectId(pid) if isinstance(pid, str) else pid for pid in post_ids]
        pipeline = [
            {"$match": {"_id": {"$in": post_ids}}},
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
                    "description": 1,
                    "address": 1,
                    "contact_infor": 1,
                    "suspect": {
                        "$cond": {
                            "if": {"$isArray": "$suspect"},
                            "then": {
                                "$map": {
                                    "input": "$suspect",
                                    "as": "s",
                                    "in": {"$toString": "$$s"}
                                }
                            },
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
                                "s3_key": {
                                    "$concat": [
                                        "posts/",
                                        {"$toString": "$_id"},
                                        "/",
                                        {"$toString": "$$img._id"},
                                        ".jpg"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]
        return list(self.posts.aggregate(pipeline))
    def get_posts_by_account_id(self, account_id: str):
        return self.posts.get_ids_by_account_id(account_id)

    def get_similar_posts_to_img(self, file_name: str, stream: BytesIO, threshold: float = 1.3):
        img = img_to_embedding(stream)
        if img is None:
            raise DetectFaceError(file_name)
        imgs = self.images.embeddings_for_active_posts()
        imgs_score = get_score_of_img_to_imgs(img, imgs)
        filtered = [i for i in imgs_score if i["l2_score"] <= threshold]
        logger.info(f"Filtered images: {len(filtered)}, scores: {[i['l2_score'] for i in filtered]}")
        return filtered

    def get_filter_posts(self, filter_data: dict):
        query_condition = build_filter(filter_data)
        return self.posts.find_ids_by_filter(query_condition)

    def report(self, report_from: str):
        if report_from == "":
            start_date = datetime.now() - timedelta(days=100)
        else:
            # build_filter đã validate format ngày cho filter, ở đây xử lý riêng:
            from ..utils.validators import date_validate
            start_date = date_validate(report_from)
            if start_date is None:
                from ..utils.exceptions import InvalidDate
                raise InvalidDate(report_from)

        end_date = datetime.now()
        active_posts_count = 0
        queuing_posts_count = 0
        posts_timeline = []

        for pt in self.posts.find_timeline_since(start_date, end_date):
            pt["_id"] = str(pt["_id"])
            pt["create_at"] = pt["create_at"].strftime("%d/%m/%Y %H:%M:%S")
            posts_timeline.append(pt)
            active_posts_count += 1 if pt["status"] == "finding" else 0
            queuing_posts_count += 1 if pt["status"] == "queuing" else 0

        return {
            "active_posts_count": active_posts_count,
            "queuing_posts_count": queuing_posts_count,
            "posts_timeline": posts_timeline
        }

    def update_post_status_to_finding(self, post_id: str) -> int:
        # sẽ raise nếu không tồn tại
        _ = self.get_post_by_id(post_id)
        return self.posts.update_status(post_id, "finding")

    def create_post(self, new_post: dict) -> str:
        if not self.accounts.exists_by_id(new_post["account_id"]):
            raise NonExistAccount(new_post["account_id"])

        payload = build_create_payload(new_post)

        if self.posts.exists_name(payload["name"]):
            raise PersonNameExisted(payload["name"])

        doc = {
            "account_id": ObjectId(new_post["account_id"]),  # cần import ObjectId ở đầu file
            **payload,
            "status": "queuing",
            "create_at": datetime.now(),
            "update_at": datetime.now()
        }
        return self.posts.insert(doc)

    def update_post(self, modified_post: dict) -> int:
        existed = self.get_post_by_id(modified_post["post_id"])

        payload = build_update_payload(modified_post)

        if self.posts.exists_name_excluding(payload["name"], existed["_id"]):
            raise PersonNameExisted(payload["name"])

        update_doc = {
            **payload,
            "status": "queuing",
            "create_at": datetime.now()
        }
        return self.posts.update(existed["_id"], update_doc)

    def delete_post(self, post_id: str) -> int:
        # Lấy danh sách ảnh để xóa khỏi S3
        img_ids = self.images.find_ids_by_post_id(post_id)
        result = s3_client.delete_imgs(img_ids)
        if result is not None:
            raise DeletedImagesFailed(post_id, result)

        deleted_imgs_count = self.images.delete_many_by_post_id(post_id)
        if deleted_imgs_count > 0:
            return self.posts.delete_one(post_id)

        raise DeletedImagesFailed(post_id)

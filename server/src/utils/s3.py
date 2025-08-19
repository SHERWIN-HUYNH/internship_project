from io import BytesIO
from .exceptions import EmptyFile, ImageUploadFailed
import logging
import boto3
import os
from botocore.exceptions import ClientError
from io import BytesIO
from PIL import Image
import mimetypes
from .exceptions import FileType
from dotenv import load_dotenv
load_dotenv()
ALLOWED_FORMATS = {
    'JPEG': {'.jpg', '.jpeg'},
    'PNG': {'.png'},
    'WEBP': {'.webp'},
}
MIME_MAP = {
    'JPEG': 'image/jpeg',
    'PNG': 'image/png',
    'WEBP': 'image/webp',
}
class S3Client:
    # def __init__(self):
    #     self.logger = logging.getLogger("s3Client")
    #     self.logger.setLevel(logging.INFO)
    #     if not self.logger.handlers:
    #         handler = logging.StreamHandler()
    #         formatter = logging.Formatter(
    #             "%(asctime)s %(name)s [%(levelname)s]: %(message)s"
    #         )
    #         handler.setFormatter(formatter)
    #         self.logger.addHandler(handler)

    #     try:
    #         self.client = boto3.client(
    #             service_name="s3",
    #             region_name=os.getenv("aws_region"),
    #             aws_access_key_id=os.getenv("aws_access_key"),
    #             aws_secret_access_key=os.getenv("aws_secret_access_key"),
    #         )
    #         self.bucket_name = os.getenv("aws_bucket_name")
    #         self.prefix=os.getenv("aws_prefix")
    #         self.logger.info("S3 connect successfully")
    #     except Exception as e:
    #         self.logger.exception("S3 connect failed")

    # @staticmethod
    # def is_empty_bytesio(bio):
    #     current_pos = bio.tell()   # remember where we are
    #     bio.seek(0, 2)             # move to end
    #     size = bio.tell()          # get position = size
    #     bio.seek(current_pos)      # restore position
    #     return size == 0

    # def upload_to_s3(self, file_object: BytesIO, img_id: str):
    #     file_object.seek(0)
    #     if self.is_empty_bytesio(file_object):
    #         raise EmptyFile()

    #     response = self.client.upload_fileobj(
    #         file_object, self.bucket_name, f'{self.prefix}{img_id}.jpg'
    #     )
    #     if response is not None:
    #         self.logger.error(f"Error for img id {img_id}\n{response}")
    #         return False
    #     self.logger.info(f"Uploaded for img id: {img_id}")
    #     return True

    # def delete_imgs(self, img_ids: list[str]):
    #     delete_objs = {
    #         'Objects': [{'Key': f'{self.prefix}{img_id}.jpg'} for img_id in img_ids],
    #         'Quiet': False
    #     }
    #     response = self.client.delete_objects(Bucket=self.bucket_name, Delete=delete_objs)
    #     if len(response['Deleted']) == len(img_ids):
    #         self.logger.info(f'Deleted imgs id: {img_ids}')
    #         return None
    #     else:
    #         return response['Errors']

    # def get_total_size(self):
    #     paginator = self.client.get_paginator('list_objects_v2')

    #     total_size_in_bytes = 0
    #     for page in paginator.paginate(Bucket=self.bucket_name, Prefix=self.prefix):
    #         for obj in page.get('Contents', []):
    #             total_size_in_bytes += obj['Size']

    #     return total_size_in_bytes
    # def delete_object(self, key):
    #     try:
    #         self.s3.delete_object(Bucket=self.bucket, Key=key)
    #         self.logger.info(f"Deleted from S3: {key}")
    #         return True
    #     except ClientError as e:
    #         self.logger.error(f"Failed to delete from S3: {str(e)}")
    #         return False

    def __init__(self):
        self.logger = logging.getLogger("s3Client")
        self.logger.setLevel(logging.INFO)
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                "%(asctime)s %(name)s [%(levelname)s]: %(message)s"
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

        try:
            self.client = boto3.client(
                service_name="s3",
                region_name=os.getenv("aws_region"),
                aws_access_key_id=os.getenv("aws_access_key"),
                aws_secret_access_key=os.getenv("aws_secret_access_key"),
            )
            self.bucket_name = os.getenv("aws_bucket_name")
            self.prefix = os.getenv("aws_prefix", "posts/")  # Mặc định prefix nếu không có
            self.allowed_formats = {'.jpg', '.jpeg', '.png', '.webp'}  # Các định dạng được phép
            self.logger.info("S3 connect successfully")
        except Exception as e:
            self.logger.exception("S3 connect failed")
            raise

    @staticmethod
    def is_empty_bytesio(bio):
        """Kiểm tra BytesIO có rỗng hay không."""
        current_pos = bio.tell()
        bio.seek(0, 2)
        size = bio.tell()
        bio.seek(current_pos)
        return size == 0

    def _validate_and_get_mime(self, raw_bytes: bytes, orig_ext: str) -> tuple[str, str]:
        buf = BytesIO(raw_bytes)
        buf.seek(0)
        img = Image.open(buf)
        img.verify()
        buf.seek(0)

        fmt = (img.format or '').upper()
        ALLOWED_FORMATS = {
            'JPEG': {'.jpg', '.jpeg'},
            'PNG': {'.png'},
            'WEBP': {'.webp'},
        }
        MIME_MAP = {
            'JPEG': 'image/jpeg',
            'PNG': 'image/png',
            'WEBP': 'image/webp',
        }

        if fmt not in ALLOWED_FORMATS:
            raise FileType(f"Unsupported image format: {fmt}")
        if orig_ext not in ALLOWED_FORMATS[fmt]:
            raise FileType(f"Extension {orig_ext} doesn't match actual format {fmt}")

        return orig_ext, MIME_MAP[fmt]

    def upload_to_s3(self, raw_bytes: bytes, img_id: str, orig_ext: str) -> tuple[str, str]:
        """
        Upload ảnh lên S3, giữ nguyên extension gốc người dùng.
        raw_bytes: nội dung file (dạng bytes)
        img_id: phần định danh (ví dụ "postId/imageId")
        orig_ext: phần mở rộng từ tên file (ví dụ '.jpg')
        """
        if not raw_bytes or len(raw_bytes) == 0:
            self.logger.error(f"Empty file for img_id: {img_id}")
            raise EmptyFile()

        # Xác thực extension gốc khớp định dạng thật
        kept_ext, mime_type = self._validate_and_get_mime(raw_bytes, orig_ext.lower())

        # Sinh key đầy đủ
        key = f"{self.prefix}{img_id}{kept_ext}"
        try:
            self.client.upload_fileobj(
                Fileobj=BytesIO(raw_bytes),
                Bucket=self.bucket_name,
                Key=key,
                ExtraArgs={
                    'ContentType': mime_type,
                    'CacheControl': 'public, max-age=31536000'
                }
            )
            self.logger.info(f"Uploaded to S3: {key}")
            return key, kept_ext
        except ClientError as e:
            self.logger.error(f"Failed to upload to S3 for img_id {img_id}: {str(e)}")
            raise ImageUploadFailed(f"Failed to upload {img_id}: {str(e)}")
    # def upload_to_s3(self, file_object: BytesIO, img_id: str) -> tuple[str, str]:
    #     """Tải file lên S3 và trả về key cùng phần mở rộng."""
    #     if self.is_empty_bytesio(file_object):
    #         self.logger.error(f"Empty file for img_id: {img_id}")
    #         raise EmptyFile()

    #     # Xác thực và lấy phần mở rộng
    #     extension = self.validate_image(file_object)
    #     key = f"{self.prefix}{img_id}{extension}"
    #     try:
    #         self.client.upload_fileobj(file_object, self.bucket_name, key)
    #         self.logger.info(f"Uploaded to S3: {key}")
    #         return key, extension
    #     except ClientError as e:
    #         self.logger.error(f"Failed to upload to S3 for img_id {img_id}: {str(e)}")
    #         raise ImageUploadFailed(f"Failed to upload {img_id}: {str(e)}")

    def delete_imgs(self, keys: list[str]):
        """Xóa nhiều object từ S3 dựa trên danh sách key."""
        if not keys:
            return None
        delete_objs = {
            'Objects': [{'Key': key} for key in keys],
            'Quiet': False
        }
        try:
            response = self.client.delete_objects(Bucket=self.bucket_name, Delete=delete_objs)
            if len(response.get('Deleted', [])) == len(keys):
                self.logger.info(f"Deleted S3 objects: {keys}")
                return None
            else:
                errors = response.get('Errors', [])
                self.logger.error(f"Failed to delete some S3 objects: {errors}")
                return errors
        except ClientError as e:
            self.logger.error(f"Failed to delete S3 objects: {str(e)}")
            raise
        

    def delete_object(self, key: str) -> bool:
        """Xóa một object từ S3."""
        try:
            self.client.delete_object(Bucket=self.bucket_name, Key=key)
            self.logger.info(f"Deleted from S3: {key}")
            return True
        except ClientError as e:
            self.logger.error(f"Failed to delete from S3: {str(e)}")
            return False

    def get_presigned_url(self, key: str, expires_in: int = 86400) -> str:
        """Tạo presigned URL để truy cập file trên S3."""
        try:
            url = self.client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': key},
                ExpiresIn=expires_in
            )
            self.logger.info(f"Generated presigned URL for {key}")
            return url
        except ClientError as e:
            self.logger.error(f"Failed to generate presigned URL for {key}: {str(e)}")
            raise Exception(f"Failed to generate presigned URL: {str(e)}")

    def get_total_size(self):
        """Tính tổng kích thước của các object trong prefix."""
        paginator = self.client.get_paginator('list_objects_v2')
        total_size_in_bytes = 0
        try:
            for page in paginator.paginate(Bucket=self.bucket_name, Prefix=self.prefix):
                for obj in page.get('Contents', []):
                    total_size_in_bytes += obj['Size']
            self.logger.info(f"Total size of objects in {self.prefix}: {total_size_in_bytes} bytes")
            return total_size_in_bytes
        except ClientError as e:
            self.logger.error(f"Failed to get total size: {str(e)}")
            raise

s3_client = S3Client()

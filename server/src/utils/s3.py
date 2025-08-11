from io import BytesIO
from .exceptions import EmptyFile
import logging
import boto3
import os

from dotenv import load_dotenv
load_dotenv()

class S3Client:
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
            self.prefix=os.getenv("aws_prefix")
            self.logger.info("S3 connect successfully")
        except Exception as e:
            self.logger.exception("S3 connect failed")

    @staticmethod
    def is_empty_bytesio(bio):
        current_pos = bio.tell()   # remember where we are
        bio.seek(0, 2)             # move to end
        size = bio.tell()          # get position = size
        bio.seek(current_pos)      # restore position
        return size == 0

    def upload_to_s3(self, file_object: BytesIO, img_id: str):
        file_object.seek(0)
        if self.is_empty_bytesio(file_object):
            raise EmptyFile()

        response = self.client.upload_fileobj(
            file_object, self.bucket_name, f'{self.prefix}{img_id}.jpg'
        )
        if response is not None:
            self.logger.error(f"Error for img id {img_id}\n{response}")
            return False
        self.logger.info(f"Uploaded for img id: {img_id}")
        return True

    def delete_imgs(self, img_ids: list[str]):
        delete_objs = {
            'Objects': [{'Key': f'{self.prefix}{img_id}.jpg'} for img_id in img_ids],
            'Quiet': False
        }
        response = self.client.delete_objects(Bucket=self.bucket_name, Delete=delete_objs)
        if len(response['Deleted']) == len(img_ids):
            self.logger.info(f'Deleted imgs id: {img_ids}')
            return None
        else:
            return response['Errors']

    def get_total_size(self):
        paginator = self.client.get_paginator('list_objects_v2')

        total_size_in_bytes = 0
        for page in paginator.paginate(Bucket=self.bucket_name, Prefix=self.prefix):
            for obj in page.get('Contents', []):
                total_size_in_bytes += obj['Size']

        return total_size_in_bytes

s3_client = S3Client()

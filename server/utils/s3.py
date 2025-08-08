from io import BytesIO
import logging
import boto3
import configparser
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
                region_name=os.getenv["aws_region"],
                aws_access_key_id=os.getenv["aws_access_key"],
                aws_secret_access_key=os.getenv["aws_secret_access_key"],
            )
            self.bucket_name = os.getenv["aws_bucket_name"]
            self.logger.info("S3 connect successfully")
        except Exception as e:
            self.logger.exception("S3 connect failed")

    def upload_to_s3(self, file_object, object_key: str):
        response = self.s3_client.upload_fileobj(
            BytesIO(file_object), self.bucket_name, object_key
        )
        if response is not None:
            self.logger.error(f"Error for {object_key}\n{response}")
            return False
        self.logger.info(f"Uploaded for {object_key}")
        return True


s3_client = S3Client()

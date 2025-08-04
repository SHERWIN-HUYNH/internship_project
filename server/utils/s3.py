from io import BytesIO
import logging
import boto3
import configparser

class S3Client():
    def __init__(self, config: configparser.RawConfigParser):

        self.logger = logging.getLogger('s3Client')
        self.logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(config['logging']['formatter']))
        self.logger.addHandler(handler)

        try:
            self.client = boto3.client(service_name='s3', 
                                    region_name=config['s3']['aws_region'], 
                                    aws_access_key_id=config['s3']['aws_access_key'], 
                                    aws_secret_access_key=config['s3']['aws_secret_access_key'])
            self.bucket_name = config['s3']['aws_bucket_name']
            self.logger.info('S3 connect successfully')
        except Exception as e:
            self.logger.exception('S3 connect failed')

    def upload_to_s3(self, file_object, object_key: str):
        response = self.s3_client.upload_fileobj(BytesIO(file_object), self.bucket_name, object_key)
        if response is not None:
            self.logger.error(f'Error for {object_key}\n{response}')
            return False
        self.logger.info(f'Uploaded for {object_key}')
        return True

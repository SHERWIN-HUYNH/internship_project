from pymongo import MongoClient, errors
import logging
import configparser
import os

class MongoDbClient:
    def __init__(self):
        config = configparser.RawConfigParser()
        config.read(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "config.ini")
        )

        self.logger = logging.getLogger("MongoClient")
        self.logger.setLevel(logging.DEBUG)
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(config["logging"]["formatter"]))
        self.logger.addHandler(handler)

        try:
            self.client = MongoClient(config["mongo"]["connect_str"])
            self.client.server_info()
            self.logger.info("Mongo connect successfully")

            self.db = self.client["persons_db"]
            self.accounts = self.db["accounts"]
            self.images = self.db["images"]
            self.posts = self.db["posts"]
        except errors.ServerSelectionTimeoutError as e:
            self.logger.exception(f"Could not connect to mongo")

mongo_client = MongoDbClient()

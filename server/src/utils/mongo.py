from dotenv import load_dotenv
from pymongo import MongoClient, errors
import logging
import hashlib
import os

load_dotenv()

def hashing(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()

class MongoDbClient:
    def __init__(self):
        # Logger setup
        self.logger = logging.getLogger("MongoClient")
        self.logger.setLevel(logging.INFO)
        
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                "%(asctime)s %(name)s [%(levelname)s]: %(message)s"
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

        # Get connection string
        uri = os.getenv("MONGO_URI")
        if not uri:
            raise RuntimeError("MONGODB_URI not found in environment variables")

        try:
            # Connect with SSL configuration for Atlas
            self.client = MongoClient(
                uri,
                serverSelectionTimeoutMS=10000,
                connectTimeoutMS=20000,
                socketTimeoutMS=20000,
                tlsAllowInvalidCertificates=True  # For development
            )
            self.client.server_info()
            self.logger.info("MongoDB connect successfully")

            # self.db       = self.client["reunite_face"]
            self.db       = self.client["persons_db"]
            self.accounts = self.db["accounts"]
            self.images   = self.db["images"]
            self.posts    = self.db["posts"]

        except errors.ServerSelectionTimeoutError as e:
            self.logger.exception("Could not connect to MongoDB")
            raise

    
mongo_client = MongoDbClient()
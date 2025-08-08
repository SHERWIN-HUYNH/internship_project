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
        uri = os.getenv("MONGODB_URI")
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

            self.db       = self.client["reunite_face"]
            self.accounts = self.db["accounts"]
            self.images   = self.db["images"]
            self.posts    = self.db["posts"]

        except errors.ServerSelectionTimeoutError as e:
            self.logger.exception("Could not connect to MongoDB")
            raise
    def connect(self, config):
        """Connect to the MongoDB server."""
        mongo_uri = config['MONGODB_URI']
        self.client = MongoClient(mongo_uri)
        self.db = self.client.get_database() # Assuming a default database
    def get_collection(self, collection_name):
        """Get a specific collection"""
        return self.db[collection_name]
    def get_db(self):
        """Get the database instance."""
        return self.db
    def close_connection(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            self.logger.info("MongoDB connection closed")

    def is_connected(self) -> bool:
        """Return True if MongoDB responds to ping."""
        try:
            self.client.admin.command("ping")
            return True
        except errors.PyMongoError:
            return False
    
mongo_client = MongoDbClient()
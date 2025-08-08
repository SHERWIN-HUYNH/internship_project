# backend/config.py

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration."""
    MONGODB_URI = os.getenv('MONGODB_URI')
    JWT_SECRET_KEY  = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM     = os.getenv("JWT_ALGORITHM")
    JWT_ACCESS_EXPIRES  = int(os.getenv("JWT_ACCESS_EXPIRES", "3600"))
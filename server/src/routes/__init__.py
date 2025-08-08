

from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

from . import accounts
from .auth_route import signup, login
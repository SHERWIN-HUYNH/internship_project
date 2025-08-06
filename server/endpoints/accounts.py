from flask import Blueprint, jsonify
from utils.mongo import mongo_client

accounts_bp = Blueprint('accounts', __name__)

@accounts_bp.get('/accounts')
def get_account():
    return jsonify({'hello':'bitch'})

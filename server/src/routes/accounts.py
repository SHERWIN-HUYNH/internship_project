from ..services.accounts_services import accounts_services
from ..utils.mongo import mongo_client
from flask import Blueprint, request, jsonify, redirect, url_for
from flask_jwt_extended import jwt_required


accounts_bp = Blueprint('posts', __name__)


@accounts_bp.get('/admin/posts')
@jwt_required
def get_all_accounts():
    accounts_services.user_authorize('admin')
    return jsonify({
        'results': accounts_services.get_all_accounts()
    })


@accounts_bp.put('/admin/state')
@jwt_required
def update_state_account():
    account = accounts_services.user_authorize('admin')
    new_state = request.form.get('new_state', type=str)
    return jsonify({
        'result': 'success' if accounts_services.update_state_account(str(account['id']), new_state) > 0 else 'fail'
    })
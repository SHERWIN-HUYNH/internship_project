from flask import Blueprint, request, jsonify, redirect, url_for
from utils.exceptions import ParamError
from services.posts import posts_services

posts_bp = Blueprint('posts', __name__)

@posts_bp.get('/post')
def get_post_by_id():
    try:
        post_id = request.args.get('post_id', type=str)
    except ValueError:
        raise ParamError('Invalid post_id provided')
    post = posts_services.get_post_by_id(post_id)
    return jsonify(post)

@posts_bp.post('/post')
def create_post():
    data = request.get_json()
    post_id = posts_services.add_post(data)
    return redirect(url_for('get_post_by_id', post_id=post_id))
        

from datetime import datetime
from bson import ObjectId
from flask import Blueprint, request, jsonify, redirect, url_for
from flask_jwt_extended import jwt_required
import numpy as np

from ..utils.clean_doc import clean_doc
from .images import allowed_file, ALLOWED_EXTENSIONS
from ..utils.exceptions import DetectFaceError, ParamError, NoImageProvide, FileType
from ..services.posts_services import PostService
from ..utils.mongo import mongo_client
from ..utils.s3 import s3_client
from ..services.accounts_services import accounts_services

posts_bp = Blueprint('posts', __name__)
post_service = PostService(mongo_client)
import logging
logger = logging.getLogger(__name__)

@posts_bp.get('/<post_id>')
def get_post_by_id(post_id):
    try:
        post = post_service.get_post_by_id(post_id)
        return jsonify({"post": post}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@posts_bp.get('/similar/<post_id>')
def get_similar_posts(post_id):
    try:
        related_posts = post_service.get_similar_posts(post_id)
        return jsonify({"related_posts": related_posts}), 200
    except ValueError as ve:
        if "Post not found" in str(ve):
            return jsonify({"error": str(ve)}), 404
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route('/<post_id>', methods=['PATCH'])
def update_post_status(post_id):
    try:
        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({"error": "Status is required in the request body"}), 400
        new_status = data['status']
        
        valid_statuses = ['pending', 'found', 'disable', 'finding']
        if new_status not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400
        
        updated_post = post_service.update_status(post_id, new_status)
        
        if not updated_post:
            return jsonify({"error": "Post not found"}), 404
        
        updated_post = (updated_post)
        
        return jsonify({"message": "Status updated successfully", "post": updated_post}), 200
    
    except ValueError as ve:
        return jsonify({"error": "Invalid post_id format"}), 400
    except Exception as e:
        logger.error(f"Error updating post status: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
@posts_bp.get('')
def get_all_posts():
    try:
        print('RUNNING FLASK')
        posts = post_service.get_all_posts()
        return jsonify({"posts": posts}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.get('/admin')
def get_all_posts_admin():
    try:
        print('RUNNING ADMIN')
        posts = post_service.get_all_posts_author()
        return jsonify({"posts": posts}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@posts_bp.post('')
@jwt_required()
def create_post():
    account = accounts_services.user_authorize('user')
    files = request.files.getlist('images')

    # Validate files
    if not files or all(not f for f in files):
        return jsonify({
            'error': 'Invalid input',
            'message': 'At least one image is required'
        }), 400

    # Validate form data
    required_fields = ['name', 'gender', 'dob', 'missing_since']
    new_post = {
        'account_id': account['id'],
        'name': request.form.get('name', '', type=str),
        'gender': request.form.get('gender', '', type=str),
        'dob': request.form.get('dob', '', type=str),
        'missing_since': request.form.get('missing_since', '', type=str),
        'contact_info': request.form.get('contact_info', '', type=str),
        'description': request.form.get('description', '', type=str)
    }

    # Check for missing required fields
    missing_fields = [field for field in required_fields if not new_post[field]]
    if missing_fields:
        return jsonify({
            'error': 'Invalid input',
            'message': f'Missing required fields: {", ".join(missing_fields)}'
        }), 400

    try:
        print('Creating post with data:', new_post)
        print('Files uploaded:', [f.filename for f in files])
        post_id = post_service.create_post_with_images(new_post, files=files)
        return jsonify({
            'post_id': str(post_id),
            'message': 'Post created successfully'
        }), 201
    except (ValueError, TypeError) as e:
        return jsonify({
            'error': 'Invalid input',
            'message': f'Invalid data provided: {str(e)}'
        }), 400
    except DetectFaceError as e:
        return jsonify({
            'error': 'Invalid image',
            'message': 'Please upload an image with exactly one face detected'
        }), 400
    except Exception as e:
        print('Unexpected error:', str(e))
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500

@posts_bp.post('/search')
def search():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    try:
        similar_imgs = post_service.get_similar_posts_to_img(file.filename, file.stream)
        if not similar_imgs:
            return jsonify({'posts': []}), 200
        logger.info(f"Found {len(similar_imgs)} similar images")
        # Đảm bảo l2_score là float
        for x in similar_imgs:
            if isinstance(x.get('l2_score'), np.generic):
                x['l2_score'] = float(x['l2_score'])

        post_ids = list({ObjectId(s['post_id']) for s in similar_imgs})
        posts = post_service.get_posts_by_ids(post_ids)

        post_scores = {}
        for img in similar_imgs:
            pid = img['post_id']
            score = float(img['l2_score'])
            if pid not in post_scores or score < post_scores[pid]:
                post_scores[pid] = score

        for post in posts:
            pid_str = str(post['_id'])
            post['similarity_score'] = post_scores.get(pid_str, float('inf'))

        posts.sort(key=lambda p: p['similarity_score'])

        clean_posts = clean_doc(posts)
        logger.info(f"Cleaned {len(clean_posts)} posts")
        return jsonify({'posts': clean_posts}), 200

    except Exception as e:
        logger.error(f"Error in search: {str(e)}")
        return jsonify({'error': str(e)}), 500
    


@posts_bp.put('')
@jwt_required()
def update_post():
    accounts_services.user_authorize('user')

    try:
        modified_post = {
            'post_id' : request.form.get('post_id', '', type=str),
            'name' : request.form.get('name', '', type=str),
            'gender' : request.form.get('gender', '', type=str),
            'dob' : request.form.get('dob', '', type=str),
            'missing_since' : request.form.get('missing_since', '', type=str),
            'contact_info' : request.form.get('contact_info', '', type=str),
            'description' : request.form.get('description', '', type=str)
        }
    except ValueError | TypeError:
        raise ParamError('Invalid fields provided')

    if post_service.update_post(modified_post) == 0:
        raise Exception('Update post failed')
    return redirect(url_for('posts.get_post_by_id', post_id=modified_post['post_id']))


@posts_bp.delete('')
@jwt_required()
def delete_post():
    accounts_services.user_authorize('user')

    try:
        post_id = request.form.get('post_id', type=str)
    except ValueError | TypeError:
        raise ParamError('Invalid posts_id provided')

    return jsonify({
        'result': 'success' if post_service.delete_post(post_id) > 0 else 'failed'
    })


@posts_bp.get('/account')
@jwt_required()
def get_posts_by_account_id():
    account = accounts_services.user_authorize('user')

    return jsonify({
        'result': {
            'posts_id': post_service.get_posts_by_account_id(account['id'])
        }
    })

# @posts_bp.post('/search/filter')
# @jwt_required()
# def search_post_with_text_filter():
#     accounts_services.user_authorize('admin')

#     try:
#         filter = {
#             'person_name': request.form.get('name', ''),
#             'gender': request.form.get('gender', ''),
#             'dob_from': request.form.get('dob_from', ''),
#             'dob_to': request.form.get('dob_to', ''),
#             'missing_since_from': request.form.get('missing_since_from', ''),
#             'missing_since_to': request.form.get('missing_since_to', ''),
#             'create_from': request.form.get('create_from', ''),
#             'create_to': request.form.get('create_to', ''),
#         }
#     except ValueError | TypeError:
#         raise ParamError('Invalid fields provided')
    
#     result = post_service.get_filter_posts(filter)
#     return jsonify({
#         'result': result
#     })


# @posts_bp.post('/search/image')
# @jwt_required()
# def search_post_with_image():
#     accounts_services.user_authorize('admin')

#     try:
#         threshold = request.form.get('threshold', 1.8, type=float)
#     except ValueError | TypeError:
#         raise ParamError('Invalid field provided')
    
#     img = request.files.get('image', None)
#     if img is None or img.filename == '': 
#         raise NoImageProvide()
#     if not allowed_file(img.filename):
#         raise FileType(img.filename, ALLOWED_EXTENSIONS)

#     return jsonify({
#         'result': post_service.get_similar_posts_to_img(img.filename, img.stream, threshold)
#     })


# @posts_bp.get('/report')
# @jwt_required()
# def report_on_posts():
#     accounts_services.user_authorize('admin')

#     try:
#         report_from = request.args.get('start_report_from', '', type=str)
#     except ValueError | TypeError:
#         raise ParamError('Invalid field provided')

#     return jsonify({
#         'result': post_service.report(report_from)
#     })


# @posts_bp.put('/finding')
# @jwt_required()
# def update_post_status_for_searching():
#     accounts_services.user_authorize('admin')

#     try:
#         post_id = request.form.get('post_id', type=str)
#     except ValueError | TypeError:
#         raise ParamError('Invalid posts_id provided')

#     return jsonify({
#         'result': 'success' if post_service.update_post_status_to_finding(post_id) > 0 else 'failed'
#     })



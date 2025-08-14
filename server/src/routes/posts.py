from flask import Blueprint, request, jsonify, redirect, url_for
from flask_jwt_extended import jwt_required
from .images import allowed_file, ALLOWED_EXTENSIONS
from ..utils.exceptions import ParamError, NoImageProvide, FileType
from ..services.posts import posts_services 
from ..services.accounts import accounts_services

posts_bp = Blueprint('posts', __name__)

@posts_bp.get('')
@jwt_required()
def get_post_by_post_id():
    accounts_services.user_authorize('both')
    try:
        post_id = request.args.get('post_id', type=str)
    except ValueError | TypeError:
        raise ParamError('Invalid post_id provided')
        
    return jsonify({
        'result': posts_services.get_post_by_id(post_id)
    })


@posts_bp.get('/account')
@jwt_required()
def get_posts_by_account_id():
    account = accounts_services.user_authorize('user')

    return jsonify({
        'result': {
            'posts_id': posts_services.get_posts_by_account_id(account['id'])
        }
    })


@posts_bp.post('/search/filter')
@jwt_required()
def search_post_with_text_filter():
    accounts_services.user_authorize('admin')

    try:
        filter = {
            'person_name': request.form.get('missing_person_name', ''),
            'gender': request.form.get('gender', ''),
            'dob_from': request.form.get('dob_from', ''),
            'dob_to': request.form.get('dob_to', ''),
            'date_of_event_from': request.form.get('date_of_event_from', ''),
            'date_of_event_to': request.form.get('date_of_event_to', ''),
            'create_from': request.form.get('create_from', ''),
            'create_to': request.form.get('create_to', ''),
        }
    except ValueError | TypeError:
        raise ParamError('Invalid fields provided')
    
    result = posts_services.get_filter_posts(filter)
    return jsonify({
        'result': result
    })


@posts_bp.post('/search/image')
@jwt_required()
def search_post_with_image():
    accounts_services.user_authorize('admin')

    try:
        threshold = request.form.get('threshold', 1.8, type=float)
    except ValueError | TypeError:
        raise ParamError('Invalid field provided')
    
    img = request.files.get('image', None)
    if img is None or img.filename == '': 
        raise NoImageProvide()
    if not allowed_file(img.filename):
        raise FileType(img.filename, ALLOWED_EXTENSIONS)

    return jsonify({
        'result': posts_services.get_similar_posts_to_img(img.filename, img.stream, threshold)
    })


@posts_bp.get('/report')
@jwt_required()
def report_on_posts():
    accounts_services.user_authorize('admin')

    try:
        report_from = request.args.get('start_report_from', '', type=str)
    except ValueError | TypeError:
        raise ParamError('Invalid field provided')

    return jsonify({
        'result': posts_services.report(report_from)
    })


@posts_bp.put('/finding')
@jwt_required()
def update_post_status_for_searching():
    accounts_services.user_authorize('admin')

    try:
        post_id = request.form.get('post_id', type=str)
    except ValueError | TypeError:
        raise ParamError('Invalid posts_id provided')

    return jsonify({
        'result': 'success' if posts_services.update_post_status_to_finding(post_id) > 0 else 'failed'
    })


@posts_bp.post('')
@jwt_required()
def create_post():
    account = accounts_services.user_authorize('user')
    try:
        new_post = {
            'account_id' : account['id'],
            'missing_person_name' : request.form.get('missing_person_name', '', type=str),
            'gender' : request.form.get('gender', '', type=str),
            'dob' : request.form.get('dob', '', type=str),
            'date_of_event' : request.form.get('date_of_event', '', type=str),
            'contact_info' : request.form.get('contact_info', '', type=str),
            'description' : request.form.get('description', '', type=str)
        }
    except ValueError | TypeError:
        raise ParamError('Invalid fields provided')

    post_id = posts_services.create_post(new_post)
    return redirect(url_for('posts.get_post_by_post_id', post_id=post_id))


@posts_bp.put('')
@jwt_required()
def update_post():
    accounts_services.user_authorize('user')

    try:
        modified_post = {
            'post_id' : request.form.get('post_id', '', type=str),
            'missing_person_name' : request.form.get('missing_person_name', '', type=str),
            'gender' : request.form.get('gender', '', type=str),
            'dob' : request.form.get('dob', '', type=str),
            'date_of_event' : request.form.get('date_of_event', '', type=str),
            'contact_info' : request.form.get('contact_info', '', type=str),
            'description' : request.form.get('description', '', type=str)
        }
    except ValueError | TypeError:
        raise ParamError('Invalid fields provided')

    if posts_services.update_post(modified_post) == 0:
        raise Exception('Update post failed')
    return redirect(url_for('posts.get_post_by_post_id', post_id=modified_post['post_id']))


@posts_bp.delete('')
@jwt_required()
def delete_post():
    accounts_services.user_authorize('user')

    try:
        post_id = request.form.get('post_id', type=str)
    except ValueError | TypeError:
        raise ParamError('Invalid posts_id provided')

    return jsonify({
        'result': 'success' if posts_services.delete_post(post_id) > 0 else 'failed'
    })

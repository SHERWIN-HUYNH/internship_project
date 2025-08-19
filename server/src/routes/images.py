from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ..services.images_services import images_services
from ..services.accounts_services import accounts_services
from ..utils.exceptions import ParamError, NoImageProvide, FileType

images_bp = Blueprint('images', __name__)

# Allowed extensions
ALLOWED_EXTENSIONS = ["jpg", "jpeg"]


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@images_bp.get('')
@jwt_required()
def get_imgs_id_with_post_id():
    accounts_services.user_authorize('both')

    try:
        post_id = request.args.get('post_id', type=str)
    except ValueError:
        raise ParamError('Invalid post_id provided')

    imgs_id = images_services.get_imgs_id_with_post_id(post_id)
    return jsonify({
        'imgs_id': imgs_id
    })


@images_bp.get('/avatar')
@jwt_required()
def get_post_avatar_img():
    accounts_services.user_authorize('both')

    try:
        post_id = request.args.get('post_id', type=str)
    except ValueError:
        raise ParamError('Invalid post_id provided')

    return jsonify({
        'result': {
            'img_id': images_services.get_post_avatar_img(post_id)
        }
    })


@images_bp.get('/report')
@jwt_required()
def report_on_images():
    accounts_services.user_authorize('admin')

    return {
        'result': images_services.report()
    }


@images_bp.post('/upload')
@jwt_required()
def upload_image():
    accounts_services.user_authorize('user')

    try:
        post_id = request.form.get('post_id', type=str)
    except ValueError:
        raise ParamError('Invalid post_id  provided')

    img = request.files.get('image', None)
    if img is None or img.filename == '' : 
        raise NoImageProvide()
    if not allowed_file(img.filename):
        raise FileType(img.filename, ALLOWED_EXTENSIONS)

    img_id = images_services.upload_image(img.filename, img.stream, post_id)

    return jsonify({
            'result': {
                'img_id': img_id
            }
        }
    )


@images_bp.post('/upload/images')
@jwt_required()
def upload_images():
    accounts_services.user_authorize('user')

    try:
        post_id = request.form.get('post_id', type=str)
    except ValueError:
        raise ParamError('Invalid post_id  provided')

    imgs = request.files.getlist('images')
    success_uploaded = [] 

    try:
        for img in imgs:
            if img is None and img.filename == '' : 
                raise NoImageProvide()
            if not allowed_file(img.filename):
                raise FileType(img.filename, ALLOWED_EXTENSIONS)

            success_uploaded.append(images_services.upload_image(img.filename, img.stream, post_id))
    except Exception:
        if success_uploaded:
            images_services.remove_images(success_uploaded)
        raise

    return jsonify({
            'result': {
                'uploaded': success_uploaded
            }
        }
    )


@images_bp.delete('')
@jwt_required()
def remove_image():
    accounts_services.user_authorize('user')

    try:
        img_id = request.form.get('img_id', type=str)
    except ValueError:
        raise ParamError('Invalid img_id provided')

    return jsonify({
        'result': 'success' if images_services.remove_image(img_id) == 1 else 'failed'
    })


@images_bp.put('')
@jwt_required()
def update_image_avatar():
    accounts_services.user_authorize('user')
    
    try:
        img_id = request.form.get('img_id', type=str)
    except ValueError:
        raise ParamError('Invalid img_id provided')

    return jsonify({
        'result': 'success' if images_services.update_image_avatar(img_id) == 1 else 'failed'
    })

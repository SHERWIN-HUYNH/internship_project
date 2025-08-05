from flask import Blueprint, jsonify, request
from services.images import images_services
from utils.exceptions import ParamError, NoImageProvide

images_bp = Blueprint('images', __name__)

@images_bp.get('/images')
def get_images():
    try:
        post_id = request.args.get('post_id', type=str)
    except ValueError:
        raise ParamError('Invalid post_id provided')

    images = images_services.get_image_urls_by_post_id(post_id)
    return jsonify(images)

@images_bp.post('/images/upload')
def upload_images():
    try:
        index_avatar = request.form.get('avatar', 0, type=int)
        post_id = request.form.get('post_id', type=str)
    except ValueError:
        raise ParamError('Invalid avartar index or post_id  provided')

    if 'images' not in request.files:
        raise NoImageProvide()

    imgs, imgs_id = request.files.getlist('images'), []
    empty_files = 0
    for img in imgs:
        if img.filename == '': 
            empty_file += 1
        else:
            imgs_id.append(images_services.up_load_images(index_avatar, post_id, img.stream))

    if empty_files == len(imgs):
        raise NoImageProvide()

    return jsonify({'status': 'success'})

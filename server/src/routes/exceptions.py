from flask import Blueprint, jsonify
from ..utils.exceptions import *


def exceptions_register(app):
    @app.errorhandler(NonExistAccount)
    def handle_non_exist_account(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(PersonNameExisted)
    def handle_person_name_existed(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(UnauthorizedAccount)
    def handle_Unauthorized_account(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(InvalidDate)
    def handle_invalid_date(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(NoImageProvide)
    def handle_no_image_provide(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(ParamError)
    def handle_param_error(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(MissingFields)
    def handle_missing_fields(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(ValueError)
    def handle_value_error(e):
        return jsonify({"error": str(e)}), 400


    @app.errorhandler(DetectFaceError)
    def handle_no_face_detect(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(ImageUploadFailed)
    def handle_failed_upload_image(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(EmptyFile)
    def handle_failed_upload_image(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(ImageIdentityError)
    def handle_failed_upload_image(e):
        return jsonify({"error": e.message}), e.status_code


    @app.errorhandler(Exception)
    def handle_invalid_field_type(e):
        return jsonify({"error": str(e)}), 400

from flask import Blueprint, jsonify
from utils.exceptions import *

exceptions_bp = Blueprint("exceptions", __name__)


@exceptions_bp.errorhandler(NonExistAccount)
def handle_non_exist_account(e):
    return jsonify({"error": e.message}), e.status_code


@exceptions_bp.errorhandler(InvalidDate)
def handle_invalid_date(e):
    return jsonify({"error": e.message}), e.status_code


@exceptions_bp.errorhandler(NoImageProvide)
def handle_no_image_provide(e):
    return jsonify({"error": e.message}), e.status_code


@exceptions_bp.errorhandler(ParamError)
def handle_param_error(e):
    return jsonify({"error": e.message}), e.status_code


@exceptions_bp.errorhandler(MissingFields)
def handle_missing_fields(e):
    return jsonify({"error": e.message}), e.status_code


@exceptions_bp.errorhandler(InvalidFieldType)
def handle_invalid_field_type(e):
    return jsonify({"error": e.message}), e.status_code
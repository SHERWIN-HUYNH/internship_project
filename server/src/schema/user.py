from marshmallow import Schema, fields, validate

class SignupSchema(Schema):
    name    = fields.Str(required=True, validate=validate.Length(min=3))
    email        = fields.Email(required=True)
    password     = fields.Str(required=True, validate=validate.Length(min=6))
    phone = fields.Str(required=True, validate=validate.Length(min=8))
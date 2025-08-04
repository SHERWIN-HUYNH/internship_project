from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.mongo import MongoDbClient
from utils.s3 import S3Client
import configparser

app = Flask(__name__)
CORS(app)

@app.route("/index", methods=["GET"])
def home():
    return jsonify({"hello": "world"})
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if users.find_one({"username": data["username"]}):
        return jsonify({"message": "Tài khoản đã tồn tại"}), 400

    pw_hash = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())
    users.insert_one({
        "username": data["username"],
        "password": pw_hash,
    })
    return jsonify({"message": "Đăng ký thành công"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = users.find_one({"username": data["username"]})
    if not user or not bcrypt.checkpw(data["password"].encode(), user["password"]):
        return jsonify({"message": "Sai tài khoản hoặc mật khẩu"}), 401

    # Tạo JWT payload
    token = jwt.encode(
        {"username": user["username"]},
        JWT_SECRET,
        algorithm="HS256"
    )
    return jsonify({"username": user["username"], "token": token})
def main():
    config = configparser.RawConfigParser()
    config.read('./config.ini')

    # test connect s3
    S3Client(config)
    # test connect mongo
    MongoDbClient(config)
    
    app.run(host="0.0.0.0", port=8080, debug=True)

if __name__ == "__main__":
    main()
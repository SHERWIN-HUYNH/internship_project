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
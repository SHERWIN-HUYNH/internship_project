from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/home", methods=["GET"])
def home():
    return jsonify({"hello": "world"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
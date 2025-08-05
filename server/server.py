from flask import Flask
from flask_cors import CORS
from endpoints.accounts import accounts_bp
from endpoints.images import images_bp
from endpoints.posts import posts_bp
from endpoints.exceptions import exceptions_bp

app = Flask(__name__)
app.register_blueprint(accounts_bp)
app.register_blueprint(images_bp)
app.register_blueprint(posts_bp)
app.register_blueprint(exceptions_bp)
CORS(app)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
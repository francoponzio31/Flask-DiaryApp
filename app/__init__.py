from flask import Flask
from .blueprints.stories_bp import stories_bp
from .blueprints.categories_bp import categories_bp
from .blueprints.auth import auth, login_manager
import os
from dotenv import load_dotenv


def create_app():

    app = Flask(__name__, static_folder="../static/")

    load_dotenv()
    app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY")
 
    app.register_blueprint(stories_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(auth)
    login_manager.init_app(app)

    return app
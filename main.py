from flask import redirect, url_for
from flask_login import login_required
from app import create_app
import os
from dotenv import load_dotenv


app = create_app()

@app.get("/")
@login_required
def index():
    return redirect(url_for("stories_bp.stories"))


if __name__ == "__main__":
    load_dotenv()
    app.run(debug=True, host="0.0.0.0", port=os.getenv("FLASK_APP_PORT"))
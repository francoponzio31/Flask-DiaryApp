from flask import Blueprint, request, jsonify, current_app
from ..models import Category
from ..services import categories_service, stories_service
from bson.objectid import ObjectId
from flask_login import login_required, current_user


categories_bp = Blueprint("categories_bp", __name__)

@categories_bp.post("/api/categories")
@login_required
def add():
    category_form = request.form.to_dict()
    new_category = Category(
        user_id=current_user._id,
        name=category_form["name"],
        color=category_form["color"]
    )

    created_story_id = categories_service.add_category(new_category.__dict__)
    return jsonify(created_story_id)

@categories_bp.get("/api/categories")
@login_required
def get_all():
    categories = categories_service.get_categories(current_user._id)    
    return jsonify(categories) 

@categories_bp.get("/api/userCategories")
@login_required
def get_users_categories():
    default = categories_service.get_default_category(current_user._id)
    categories = categories_service.get_categories(current_user._id)    
    categories = [category for category in categories if category["name"] != default["name"]]
    return jsonify(categories)

@categories_bp.get("/api/category/<category_id>")
@login_required
def get_one(category_id):
    category = categories_service.get_category(category_id)
    return jsonify(category)

@categories_bp.get("/api/category/getDeafault")
@login_required
def get_default():
    category = categories_service.get_default_category(current_user._id)
    return jsonify(category)

@categories_bp.delete("/api/category/<category_id>")
@login_required
def delete(category_id):
    default_category_id = categories_service.get_default_category(current_user._id)["_id"]
    stories_service.update_stories(current_user._id, {"category_id":ObjectId(category_id)}, {"category_id":ObjectId(default_category_id)})
    deleted_category = categories_service.delete_category(category_id)
    return jsonify(deleted_category)

@categories_bp.put("/api/category/<category_id>")
@login_required
def update(category_id):
    new_values = request.get_json() # Contenido del body de la request
    updated_category = categories_service.update_category(category_id, new_values)
    return jsonify(updated_category)
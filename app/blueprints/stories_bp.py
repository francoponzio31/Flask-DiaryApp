from flask import Blueprint, request, jsonify, send_file, redirect, url_for, current_app
from ..models import Story
from ..services import stories_service
from datetime import datetime
from bson.objectid import ObjectId
from flask_login import login_required, current_user


stories_bp = Blueprint("stories_bp", __name__)


@stories_bp.get("/stories")
@login_required
def stories():
    return send_file("../static/html/stories.html")

@stories_bp.get("/story_form")
@login_required
def new_story():
    request_params = request.args
    if not request_params:
        return redirect(url_for("index"))
    return send_file("../static/html/story_form.html")

@stories_bp.get("/api/stories")
@login_required
def get_all():

    url_params = request.args.to_dict()
    mongo_query = _mongo_query_from_url_params(url_params)
    stories = stories_service.get_stories(current_user._id, mongo_query)
    return jsonify(stories)

@stories_bp.post("/api/stories")
@login_required
def add():

    story_form = request.form.to_dict()
    new_story = Story(
        user_id = current_user._id,
        date = datetime.strptime(story_form["date"],"%Y-%m-%d"),
        time = datetime.strptime(story_form["time"],"%H:%M"),
        title = story_form["title"],
        description = story_form["description"],
        category_id = ObjectId(story_form["category_id"]),
        fav = False
    )

    created_story_id = stories_service.add_story(new_story.__dict__)

    return jsonify(created_story_id)


@stories_bp.get("/api/story/<story_id>")
@login_required
def get_one(story_id):
    story = stories_service.get_story(story_id)
    return jsonify(story) 

@stories_bp.delete("/api/story/<story_id>")
@login_required
def delete(story_id):
    deleted_story = stories_service.delete_story(story_id)
    return jsonify(deleted_story)

@stories_bp.put("/api/story/<story_id>")
@login_required
def update(story_id):
    story_form = request.get_json() # Contenido del body de la request
    new_values = story_form

    if "date" in new_values:
        new_values["date"] = datetime.strptime(new_values["date"],"%Y-%m-%d")
    if "time" in new_values:
        new_values["time"] = datetime.strptime(new_values["time"],"%H:%M")
    if "category_id" in new_values:
        new_values["category_id"] = ObjectId(new_values["category_id"])

    updated_story = stories_service.update_story(story_id,new_values) 
    return jsonify(updated_story)


def _mongo_query_from_url_params(url_params):

    mongo_query = {}
    if url_params:
        if "since" in url_params:
            mongo_query.update( {"date":{"$gte":datetime.strptime(url_params["since"],'%Y-%m-%d')}} )
        if "until" in url_params:
            mongo_query.update( {"date":{"$lte":datetime.strptime(url_params["until"],'%Y-%m-%d')}} )
        if "title" in url_params:
            mongo_query.update( {"title": {"$regex" : url_params["title"], "$options" : "i"}} )
        if "description" in url_params:
            mongo_query.update( {"description": {"$regex" : url_params["description"], "$options" : "i"}} )
        if "fav" in url_params:
            mongo_query.update( {"fav":True} )
        if "categories" in url_params:
            categories_list = url_params["categories"].split(",")
            categories_list = [ObjectId(category) for category in categories_list]
            mongo_query.update( {"category_id":{ "$in": categories_list }})

    return mongo_query
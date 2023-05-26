from ..db_connection import connect_to_db
from bson.objectid import ObjectId
from datetime import datetime


db = connect_to_db()
collection = db["stories"]

def get_stories(user_id, query):
    query.update({"user_id":user_id})
    stories = list(collection.find(query))
    if stories:
        stories = sorted(stories, reverse=True, key=_format_story_datetime) # Ordenamiento de stories por fecha
        stories = list(map(_parse_ObjectId_fields,stories))
        stories = list(map(_parse_datetime_fields,stories))
    return stories

def get_story(story_id):
    story = collection.find_one({"_id":ObjectId(story_id)})
    story = _parse_ObjectId_fields(story)
    story = _parse_datetime_fields(story)
    return story

def add_story(story):
    created_story = collection.insert_one(story)
    return {"created_story_id":str(created_story.inserted_id)}

def delete_story(story_id):
    collection.delete_one({"_id": ObjectId(story_id)})
    return {"deleted_story_id":story_id}

def update_story(story_id, new_values):
    collection.update_one({"_id":ObjectId(story_id)}, {"$set":new_values})
    return {"updated_story_id":story_id}

def update_stories(user_id, query={}, new_values={}):
    query["user_id"] = user_id
    result = collection.update_many(query, {"$set":new_values})
    return {"modified_documents":result.modified_count}

def _format_story_datetime(story):
    story_date = datetime.strftime(story["date"], "%Y-%m-%d")
    story_time = datetime.strftime(story["time"], "%H:%M")
    formated_datetime = datetime.strptime( f"{story_date} {story_time}", "%Y-%m-%d %H:%M")
    return formated_datetime

def _parse_ObjectId_fields(document):
    for property in document: # Parseo los tipos de dato de ObjectId a str
        if isinstance(document[property],ObjectId):
            document[property] = str(document[property])
    return document

def _parse_datetime_fields(document):
    for property in document: # Parseo los tipos de dato de datetime a str
        if isinstance(document[property],datetime):
            document[property] = datetime.strftime(document[property], "%Y-%m-%d,%H:%M")
    return document
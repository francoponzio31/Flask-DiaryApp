from ..db_connection import connect_to_db
from bson.objectid import ObjectId


db = connect_to_db()
collection = db["categories"]

def get_categories(user_id, query={}):
    categories = list(collection.find({"user_id":user_id},query))
    categories = list(map(_parse_ObjectId_fields,categories))
    return categories

def get_category(id):
    category = collection.find_one({"_id":ObjectId(id)})
    category = _parse_ObjectId_fields(category)
    return category

def get_default_category(user_id):
    category = collection.find_one({"user_id":user_id, "name":"Sin Categoría"})
    category = _parse_ObjectId_fields(category)
    return category

def add_category(category):
    created_category = collection.insert_one(category)
    return {"created_category_id":str(created_category.inserted_id)}

def add_categories(categories):
    created_categories = collection.insert_many(categories)
    return {"created_category_id":str(created_categories.inserted_ids)}

def delete_category(category_id):
    collection.delete_one({"_id": ObjectId(category_id)})
    return {"deleted_category_id":category_id}

def update_category(category_id,new_values):
    collection.update_one({"_id":ObjectId(category_id)}, {"$set":new_values})
    return {"updated_category_id":category_id}

def _parse_ObjectId_fields(document):
    for property in document: # Parseo los datos de tipo de ObjectId a str
        if isinstance(document[property],ObjectId):
            document[property] = str(document[property])
    return document
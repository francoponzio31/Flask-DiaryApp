from ..db_connection import connect_to_db


db = connect_to_db()
collection = db["users"]

def get_user_data(username):
    user = collection.find_one({"_id":username})
    if user:
        return user
    else:
        return None

def add_user(user_data):
    created_user = collection.insert_one(user_data)
    return {"created_user_id":str(created_user.inserted_id)}

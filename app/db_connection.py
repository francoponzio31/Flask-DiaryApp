from pymongo import MongoClient


def connect_to_db():
    DB_URI = "mongodb://mongodb-container/diary_app"
    client = MongoClient(DB_URI)
    db = client["diary_app"]

    return db

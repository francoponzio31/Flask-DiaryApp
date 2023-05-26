from bson.objectid import ObjectId
from datetime import datetime
from flask_login import UserMixin


class User(UserMixin):
    def __init__(self, _id:str, name:str, surname:str, password:str) -> None:
        self._id = _id
        self.name = name
        self.surname = surname
        self.password = password

    def get_id(self):
        return str(self._id)


class Category:
    def __init__(self, user_id:str, name:str, color:str) -> None:
        self.user_id = user_id
        self.name = name
        self.color = color


class Story:
    def __init__(self, user_id:str, date:datetime, time:datetime, title:str, description:str, category_id:ObjectId, fav:bool) -> None:
        self.user_id = user_id
        self.date = date
        self.time = time
        self.title = title
        self.description = description
        self.category_id = category_id
        self.fav = fav
from flask import Blueprint, make_response, send_file, redirect, url_for, request, current_app
from flask_login import LoginManager, login_user, login_required, logout_user
from ..models import User, Category, Story
from ..services import users_service, categories_service, stories_service
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


auth = Blueprint("auth", __name__)

login_manager = LoginManager()
login_manager.login_view = "auth.get_login_page"

@login_manager.user_loader
def load_user(user):
    user_data = users_service.get_user_data(user)
    return User(**user_data)


@auth.get("/login")
def get_login_page():
    return send_file("../static/html/login.html")


@auth.get("/signup")
def get_signup_page():
    return send_file("../static/html/signup.html")


@auth.get("/logout")
@login_required
def logout():
    logout_user()
    response = make_response(redirect(url_for("auth.get_login_page")))
    response.delete_cookie("user_id")
    response.delete_cookie("name")
    response.delete_cookie("surname")
    return response


@auth.post("/login")
def validate_login():

    # Login form:
    login_form = request.form.to_dict()
    username_input = login_form["username"]
    password_input = login_form["password"]
    
    #? Validación de la existencia del usuario y coincidencia con la contraseña ingresada:
    user_data = users_service.get_user_data(username_input)
    if user_data and check_password_hash(user_data["password"], password_input):
        
        # Login del usuario:
        user = User(**user_data)
        login_user(user)

        # Seteo de cookies con info del usuario:
        response = make_response(redirect(url_for("index")))
        response.set_cookie("user_id", user._id)
        response.set_cookie("name", user.name.capitalize())
        response.set_cookie("surname", user.surname.capitalize())

        return response 

    else:
        return redirect(url_for("auth.get_login_page"))


@auth.post("/signup")
def validate_signup():

    # Signup form:
    signup_form = request.form.to_dict()
    username_input = signup_form["username"]
    password_input = signup_form["password"]
    confirm_password_input = signup_form["confirm_password"]

    #? Validación de la no existencia de un usuario con el mismo username y de que las passwords ingresadas coincidan:
    user_data = users_service.get_user_data(username_input)
    if not user_data and password_input == confirm_password_input:

        # Creación del usuario:
        new_user = User(   
            _id=signup_form["username"],
            name=signup_form["name"],
            surname=signup_form["surname"],
            password=generate_password_hash(signup_form["password"]),
        )
        users_service.add_user(new_user.__dict__)


        # Creación de las categorias por default para el nuevo usuario:
        default_categories = [
            Category(
                user_id=new_user._id,
                name="Sin Categoría",
                color="#696969"
            ),
            Category(
                user_id=new_user._id,
                name="Familia y amigos",
                color="#004f99"
            ),
            Category(
                user_id=new_user._id,
                name="Hobbys",
                color="#2b8f0f"
            ),
            Category(
                user_id=new_user._id,
                name="Estudio y trabajo",
                color="#e21818"
            )
        ]
        categories_service.add_categories([category.__dict__ for category in default_categories])

        # Creación de la historia por default para el nuevo usuario:
        default_story = Story(
            user_id=new_user._id,
            date=datetime.now(),
            time=datetime.now(),
            title="Bienvenido a Flask - Diary App !!!",
            description="En esta aplicación de diario personal podrás registrar tus historias y organizarlas a través de la funcionalidad de Categorías, para poder clasificar entradas relacionadas entre sí. Además, cuentas con una función de Favoritos que te permite marcar tus entradas más valiosas. \n\n Esta es una entrada de ejemplo para presentarte la app y sus funcionalidades, puedes borrarla, editarla o guardarla como recuerdo de tu primera historia.",
            category_id=categories_service.get_default_category(new_user._id)["_id"],
            fav=True
        )
        stories_service.add_story(default_story.__dict__)

        # Login:
        login_user(new_user)

        # Seteo de cookies con info del usuario:
        response = make_response(redirect(url_for("index")))
        response.set_cookie("user_id", new_user._id)
        response.set_cookie("name", new_user.name.capitalize())
        response.set_cookie("surname", new_user.surname.capitalize())
       
        return response

    else:
        return redirect(url_for("auth.get_signup_page"))

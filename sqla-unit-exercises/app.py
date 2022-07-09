from flask import Flask, request, render_template, redirect, flash, session
from flask_sqlalchemy import SQLAlchemy
from models import db, connect_db, User

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///sqla_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "thisisthekey"

connect_db(app)

@app.route('/')
def home():
    return redirect('/users')

@app.route('/users')
def users():
    return render_template('users.html')

@app.route('/users/<int:userid>')
def users_view(userid):
    return render_template('user.html',userid=userid)

@app.route('/users/new')
def user_add():
    return render_template("new.html")

@app.route('/users/new', methods=["POST"])
def user_create():
    return redirect("/")

@app.route('/users/<int:userid>/edit')
def user_edit(userid):
    return render_template("edit.html", userid=userid)
    


    
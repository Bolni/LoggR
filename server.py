import flask
import os
import pymongo
import datetime

from flask import Response, jsonify, render_template, request, json, Flask, session, redirect
from flask_bootstrap import Bootstrap
from flask.ext.session import Session

from bson import BSON, json_util, Binary, Code
from bson.objectid import ObjectId
from bson.errors import InvalidId
from bson.json_util import dumps, loads

from user_controller import UserController
from log_controller import LogController



app = flask.Flask(__name__, static_url_path='/static')

SESSION_TYPE = 'mongodb'
SESSION_MONGODB_DB = 'test_db'
app.config.from_object(__name__)
Session(app)

Bootstrap(app)

def cursor_to_list(cursor):
    out = []
    for asd in cursor:
        out.extend(asd)
    return out

def response(success, data):
    out = {}
    out['success'] = success
    out['data'] = data
    return Response(json.dumps(out), mimetype='application/json')

def List(data):
    data = list(data)
    for i in data:
        if "_id" in i:
            i["_id"] = str(i["_id"])
    return data

def GetRole():
    return session.get("role", 'not set') 

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route('/')
def get_page():
    print(session)
    role = GetRole() 

    if role == "user":
        print("User")
        return redirect("/view-logs")
    elif role == "admin":
        print("Admin")
        return redirect("/admin") 
    else:
        print("Not set")
        return app.send_static_file('index.html')

@app.route('/logout')
def logout():
    if "role" in session:
        del session["role"]
    return redirect("/")


@app.route('/view-logs')
def get_logs():
    if GetRole() == "user":
        return app.send_static_file('user.html')
    else:
        return redirect("/")

@app.route('/admin')
def admin():
    if GetRole() == "admin":
        return app.send_static_file('admin.html')
    else:
        return redirect("/")

@app.route('/users/all', methods=['GET'])
def get_all_user():
    user_controller = UserController()
    user_dict = user_controller.get_users()
    user_json = List(user_dict)
    print(user_dict)
    return response(True, user_json)

@app.route('/users', methods=['POST'])
def post_user():
    user_controller = UserController()
    user_controller.insert_user(flask.request.json)
    return "OK"


@app.route('/users', methods=['GET'])
def get_user():
    if GetRole() == "admin":
        user_controller = UserController()
        username = request.args.get('username')
        user_dict = user_controller.get_user(username)
        user_json = json.dumps(user_dict)
        return user_json
    else:
        return json.dumps({"msg": "Permission denied"}), 401

@app.route('/users', methods=['DELETE'])
def delete_user():
    user_controller = UserController()
    username = flask.request.json['username']
    user_controller.delete_user(username)
    return "OK"


@app.route('/logs', methods=['POST'])
def post_log():
    log_controller = LogController()
    log_controller.insert_log(flask.request.json)
    return "OK"

@app.route('/register', methods=['POST'])
def register():
    flask.request.json["date"] = datetime.datetime.now()
    print(flask.request.json)
    user_controller = UserController()
    if user_controller.get_user(flask.request.json['username']) is None:
        user_controller.insert_user(flask.request.json)
        return "OK"
    else:
        return json.dumps({"msg": "User is already registered"}), 401



@app.route('/login', methods=['POST'])
def login():
    user_controller = UserController()
    username_password_dict = flask.request.json
    username_from_req = username_password_dict['username']

    user_from_db = user_controller.get_user(username_from_req)

    username = user_from_db['username']
    password = user_from_db['password']

    if username != username_password_dict['username'] or password != username_password_dict['password']:
        return json.dumps({"msg": "Bad username or password"}), 401

    session["role"] = user_from_db["role"]
    return json.dumps({"msg": "Success"}), 200

@app.route('/logs', methods=['GET'])
def get_log():
    if GetRole() == "user" or GetRole() == "admin":
        log_controller = LogController()
        log_dict = log_controller.get_log()
        log_json = List(log_dict)
        return response(True, log_json)
    else:
        return json.dumps({"msg": "Permission denied"}), 401

@app.route('/logs', methods=['DELETE'])
def delete_log():
    log_controller = LogController()
    _id = flask.request.json["_id"]
    log_controller.delete_log(_id)
    return "OK"


@app.route('/hello')
def hello2():
    return "hello"


if __name__ == "__main__":
    app.run('0.0.0.0', debug=True)
    

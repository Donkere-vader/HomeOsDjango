from django.shortcuts import render
from . import db
from .pico_models import User, Device, Program, Event
from .response import json_response
from .functions import random_string
from datetime import datetime as dt
from datetime import timedelta
from .constants import DATETIME_STRING_FORMAT


# VIEWS
def auth(request):
    if 'username' not in request.POST:
        return json_response({"error": "username is required"})

    username = request.POST['username']
    password = request.POST['password']

    if username in db['user']:
        user = User(username, db['user'][username])
        if user.auth(password):
            db['auth_keys'][username] = {
                "key": random_string(length=20),
                "expires": (dt.now() + timedelta(days=100)).strftime(DATETIME_STRING_FORMAT)
            }

            db.commit()

            return json_response(db['auth_keys'][username])

    return json_response({"error": "Invalid username or password"})


def devices(request):
    username = request.GET['auth_username']
    key = request.GET['auth_key']

    if username in db['user'] and db['auth_keys'][username]['key'] == key:
        user = User(username, db['user'][username])

        devices = {}

        for dev_id in user['devices']:
            devices[dev_id] = Device(dev_id, db['device'][dev_id]).serialize(
                fields=[
                    "name",
                    "description",
                    "active",
                    "icon",
                    "color",
                ]
            )

        return json_response(devices)

    return json_response({"error": "You are not logged in"})


def dev(request):
    username = request.GET['auth_username']
    key = request.GET['auth_key']
    device_id = request.GET['device_id']

    if username in db['user'] and db['auth_keys'][username]['key'] == key:
        user = User(username, db['user'][username])

        if device_id in db['user'][username]['devices']:
            device = Device(device_id, db['device'][device_id])

            return json_response(device.serialize(
                fields=[
                    "name",
                    "description",
                    "programs",
                    "active",
                    "color",
                    "icon",
                    "active_program",
                ]
            ))
        return json_response({"error": "Unknown device"})

    return json_response({"error": "You are not logged in"})


def global_programs(request):
    username = request.GET['auth_username']
    key = request.GET['auth_key']

    if username in db['user'] and db['auth_keys'][username]['key'] == key:
        user = User(username, db['user'][username])

        programs = {}

        for program_id in user['programs']:
            programs[program_id] = db['program'][program_id]

        return json_response(programs)

    return json_response({"error": "You are not logged in"})


def program(request):
    username = request.GET['auth_username']
    key = request.GET['auth_key']
    program_id = request.GET['program_id']

    if username in db['user'] and db['auth_keys'][username]['key'] == key:
        p = Program(program_id, db['program'][program_id])

        return json_response(p.serialize())

    return json_response({"error": "You are not logged in"})


def events(request):
    username = request.GET['auth_username']
    key = request.GET['auth_key']

    if username in db['user'] and db['auth_keys'][username]['key'] == key:
        user = User(username, db['user'][username])

        events = {}

        for event_id in user['events']:
            events[event_id] = Event(event_id, db['event'][event_id]).serialize(
                fields=["name"]
            )

        return json_response(events)

    return json_response({"error": "You are not logged in"})


def event(request):
    username = request.GET['auth_username']
    key = request.GET['auth_key']
    event_id = request.GET['event_id']

    if username in db['user'] and db['auth_keys'][username]['key'] == key:
        user = User(username, db['user'][username])

        if event_id in user['events']:
            event = Event(event_id, db['event'][event_id])
            return json_response(event.serialize())

        return json_response({"error": "Unknown event"})

    return json_response({"error": "You are not logged in"})

from django.shortcuts import render
from . import db
from .pico_models import User, Device, Program, Event
from .response import json_response
from .functions import random_string
from datetime import datetime as dt
from datetime import timedelta
from .constants import DATETIME_STRING_FORMAT
import json


def check_auth(request):
    if request.method == "POST":
        request_data = request.POST.dict()
    elif request.method == "GET":
        request_data = request.GET.dict()

    if 'auth_username' in request_data and 'auth_key' in request_data:
        username = request_data['auth_username']
        key = request_data['auth_key']

        if username in db['user']:
            user = User(username, db['user'][username])
            if user.verify_key(key):
                return user
            return None

    if 'api_key' in request_data:
        key = request_data['api_key']

        if key in db['api_key']:
            return "api"

    return None


# VIEWS
def auth(request):
    if 'username' not in request.POST:
        return json_response({"error": "username is required"})

    username = request.POST['username']
    password = request.POST['password']

    if username in db['user']:
        user = User(username, db['user'][username])
        if user.auth(password):
            new_key = random_string(length=20)
            db['user'][username]['auth_keys'][new_key] = {
                "expires": (dt.now() + timedelta(days=100)).strftime(DATETIME_STRING_FORMAT)
            }

            db.commit()

            return json_response({
                "username": user.id,
                "key": new_key,
            })

    return json_response({"error": "Invalid username or password"})


def register(request):
    username = request.POST['username']
    password = request.POST['password']

    if username in db['user']:
        return json_response({"form_error": "Username is already in use"})

    user = User.new(username, password)

    return json_response({"success": True})


def devices(request):
    user = check_auth(request)
    if user is None:
        return json_response({"error": "You are not logged in", "error_action": "redirect", "error_data": {"redirect": "/login"}})

    devices = {}

    if user == "api" or user['admin']:
        devices_list = db['device']
    else:
        devices_list = user['devices']

    for dev_id in devices_list:
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


def dev(request):
    user = check_auth(request)
    if user is None:
        return json_response({"error": "You are not logged in", "error_action": "redirect", "error_data": {"redirect": "/login"}})

    if request.method == "GET":
        device_id = request.GET['device_id']

        if user == "api" or device_id in db['user'][user.id]['devices'] or user['admin']:
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

    elif request.method == "POST":
        device_id = request.POST['device_id']
        action = request.POST['action']
        action_data = json.loads(request.POST['action_data'])

        if user == "api" or device_id in user['devices'] or user['admin']:
            device = Device(device_id, db['device'][device_id])

            error, response = device.action(action, action_data)

            return json_response({"error": error, "response": response})

        return json_response({"error": "Unknown device"})


def events(request):
    user = check_auth(request)
    if user is None:
        return json_response({"error": "You are not logged in", "error_action": "redirect", "error_data": {"redirect": "/login"}})

    events = {}

    if user == "api" or user['admin']:
        events_list = db['event']
    else:
        events_list = user['events']

    for event_id in events_list:
        events[event_id] = Event(event_id, db['event'][event_id]).serialize(
            fields=[
                "name",
                "enabled",
                "time"
            ]
        )

    return json_response(events)


def event(request):
    user = check_auth(request)
    if user is None:
        return json_response({"error": "You are not logged in", "error_action": "redirect", "error_data": {"redirect": "/login"}})

    if request.method == "GET":
        event_id = request.GET['event_id']

        if user == "api" or event_id in user['events'] or user['admin']:
            event = Event(event_id, db['event'][event_id])
            return json_response(event.serialize())

        return json_response({"error": "Unknown event"})

    elif request.method == "POST":
        event_id = request.POST['event_id']
        action = request.POST['action']
        action_data = json.loads(request.POST['action_data'])

        if user == "api" or event_id in user['events'] or user['admin']:
            event = Event(event_id, db['event'][event_id])

            error, response = event.action(action, action_data)

            return json_response({"error": error, "response": response})

        return json_response({"error": "Unknown event"})


def event_new(request):
    user = check_auth(request)
    if user is None:
        return json_response({"error": "You are not logged in", "error_action": "redirect", "error_data": {"redirect": "/login"}})

    if user == "api":
        return json_response({"error": "Can't create new events from API"})

    if request.method == "POST":
        error, new_event = Event.new()

        user['events'].append(new_event.id)
        user.save()

        return json_response({
            "error": error,
            "response": {"id": new_event.id}
        })

    return json_response({"error": "Method not allowed"})


def event_delete(request):
    user = check_auth(request)
    if user is None:
        return json_response({"error": "You are not logged in", "error_action": "redirect", "error_data": {"redirect": "/login"}})

    if user == "api":
        return json_response({"error": "Can't delete event from API"})

    if request.method == "POST":
        event_id = request.POST['event_id']

        if event_id in user['events']:
            event = Event(event_id, db['event'][event_id])
            error = event.delete()
            return json_response({"error": error})

        return json_response({"error": "Unknown event"})

    return json_response({"error": "Method not allowed"})


def eventsping(request):
    now = dt.now()

    for event_id in db['event']:
        event = db['event'][event_id]

        if not event['planned']:
            continue

        if event['enabled'] and event['time']['hour'] == now.hour and event['time']['minute'] == now.minute and now.weekday() in event['weekdays']:
            for device_id in event['devices']:
                device = Device(device_id, db['device'][device_id])
                error, response = device.action(
                    event['action'],
                    event['action_data']
                )

    return json_response({"succes": True})


def action(request):
    user = check_auth(request)
    if user is None:
        return json_response({"error": "You are not logged in", "error_action": "redirect", "error_data": {"redirect": "/login"}})

    event_id = request.POST['event_id']

    if user == "api" or (event_id in db['event'] and (event_id in user['events'] or user['admin'])):
        event = Event(event_id, db['event'][event_id])

        for device_id in event['devices']:
            device = Device(device_id, db['device'][device_id])
            error, response = device.action(
                event['action'],
                event['action_data']
            )

        return json_response({"succes": True})

    return json_response({"error": "Unknown action"})


def admin(request):
    user = check_auth(request)
    if user is None:
        return json_response({"error": "You are not logged in", "error_action": "redirect", "error_data": {"redirect": "/login"}})
    if not user['admin']:
        return json_response({"error": "You are no admin", "error_action": "redirect", "error_data": {"redirect": "/"}})

    if request.method == "GET":
        return json_response({"database": db.json_obj})

    if request.method == "POST":
        db_obj = json.loads(request.POST['db_obj'])
        db.json_obj = db_obj
        db.commit()
        return json_response({"message": "Saved"})

    return json_response({"error": "Method not allowed"})

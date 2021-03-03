from . import db
import bcrypt
from .functions import random_string


class PicoModel:
    private_fields = []

    def __init__(self, id, json_obj):
        self.id = id
        self.json_obj = json_obj

    def __getitem__(self, key):
        return self.json_obj[key]

    def __setitem__(self, key, value):
        self.json_obj[key] = value

    def serialize(self, fields="__all__"):
        if fields == "__all__":
            fields = self.json_obj.keys()

        obj = {}

        for field in fields:
            if field not in self.private_fields:
                obj[field] = self[field]

        return obj

    def save(self):
        table_name = self.__class__.__name__.lower()
        db[table_name][self.id] = self.json_obj
        db.commit()


class User(PicoModel):
    private_fields = ["password"]

    def auth(self, password) -> bool:
        return bcrypt.checkpw(password.encode(), self['password'].encode())

    @classmethod
    def new(cls, username, password, admin):
        if username in db['user']:
            return True, "Username already taken"

        salt = bcrypt.gensalt()

        user = User(username, {
            "admin": admin,
            "password": bcrypt.hashpw(password.encode(), salt).decode()
        })
        user.save()


class Device(PicoModel):
    private_fields = ["address"]

    def action(self, action, action_data):
        response = {
            "active": True,
            "color": "FFFF00",
            "active_program": "program_one_id",
        }

        keys = ["color", "active", "active_program"]

        for key in keys:
            if key in response:
                self[key] = response[key]

        self.save()

        return False, response


class Program(PicoModel):
    private_fields = ["global"]


class Event(PicoModel):
    private_fields = []

    def action(self, action, action_data):
        response = {}

        if action == "toggle_enabled":
            response['enabled'] = action_data['enabled']
        elif action == "set_time":
            response['time'] = action_data["time"]
        elif action == "set_weekday":
            response['weekdays'] = action_data["weekdays"]
        elif action == 'set_devices':
            response['devices'] = action_data["devices"]
        elif action == "set_action_data":
            response['action_data'] = action_data['action_data']
        elif action == "set_name":
            response['name'] = action_data["name"]

        keys = ["enabled", "time", "weekdays", "devices", "action_data"]

        for key in keys:
            if key in response:
                self[key] = response[key]

        self.save()

        return False, response

    def delete(self):
        del db[self.__class__.__name__.lower()][self.id]

        for username in db['user']:
            if self.id in db['user'][username]['events']:
                db['user'][username]['events'].remove(self.id)

        db.commit()
        del self
        return False

    @classmethod
    def new(cls):
        new_id = random_string()
        while new_id in db['event']:
            new_id = random_string()

        event = Event(new_id, {
            "name": "New event",
            "enabled": True,
            "weekdays": [],
            "time": {
                "hour": 12,
                "minute": 0,
            },
            "devices": [],
            "action": "power",
            "action_data": {
                "power": True
            }
        })

        event.save()

        return False, event

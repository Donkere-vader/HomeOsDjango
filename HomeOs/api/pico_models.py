from . import db
import bcrypt


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
        if action == "set_time":
            response['time'] = action_data["time"]
        if action == "set_weekday":
            response['weekdays'] = action_data["weekdays"]

        keys = ["enabled", "time", "weekdays"]

        for key in keys:
            if key in response:
                self[key] = response[key]

        self.save()

        return False, response

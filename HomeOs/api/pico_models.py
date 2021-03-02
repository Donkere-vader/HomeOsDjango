from . import db


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
        if password == self['password']:
            return True
        return False


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
    private_fields = ["action", "action_data"]

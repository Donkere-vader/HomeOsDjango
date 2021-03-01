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

class User(PicoModel):
    private_fields = ["password"]

    def auth(self, password) -> bool:
        if password == self['password']:
            return True
        return False


class Device(PicoModel):
    private_fields = ["address"]


class Program(PicoModel):
    private_fields = ["global"]


class Event(PicoModel):
    private_fields = ["action", "action_data"]

from picodb import PicoDb

db = PicoDb("database.json", indent=4, structure={
    "user": {},
    "device": {},
    "program": {},
    "event": {},
    "auth_keys": {},
})

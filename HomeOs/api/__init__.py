from picodb import PicoDb

db = PicoDb("database.json", indent=4, structure={
    "user": {},
    "device": {},
    "event": {},
    "api_key": {},
})

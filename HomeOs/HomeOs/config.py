import json

KEYS = {
    "ALLOWED_HOSTS": [],
    "TIME_ZONE": "UTC"
}

setup = False
try:
    json_config_file = open("server_config.json", 'r')
except FileNotFoundError:
    with open("server_config.json", 'w') as f:
        json.dump(KEYS, f, indent=4)

    json_config_file = open("server_config.json", 'r')

config = json.load(json_config_file)

for key in KEYS:
    exec(f"{key} = config['{key}']")

import atexit
import requests
from . import config

from apscheduler.schedulers.background import BackgroundScheduler


def ping():
    requests.post(f"http://localhost:{config.PORT}/api/eventsping")


def schedule_background_tasks():
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=ping, trigger="interval", minutes=1)
    scheduler.start()

    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())

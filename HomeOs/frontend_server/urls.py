import frontend_server.views as views
from django.urls import path

urlpatterns = [
    path("", views.index),
    path("login", views.index),
    path("logout", views.index),
    path("dev/<_>", views.index),
    path("programs", views.index),
    path("events", views.index),
    path("event/<_>", views.index),
    path("actions", views.index),
]

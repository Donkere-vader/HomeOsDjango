from django.urls import path
import api.views as views

urlpatterns = [
    path('auth', views.auth),
    path('register', views.register),
    path('devices', views.devices),
    path('dev', views.dev),
    path('event', views.event),
    path('events', views.events),
    path('eventsping', views.eventsping),
    path('action', views.action),
    path('event/new', views.event_new),
    path('event/delete', views.event_delete),
    path('admin', views.admin),
]

from django.urls import path
import api.views as views

urlpatterns = [
    path('auth', views.auth),
    path('devices', views.devices),
    path('dev', views.dev),
    path('program', views.program),
    path('global_programs', views.global_programs),
    path('event', views.event),
    path('events', views.events),
    path('eventsping', views.eventsping),
    path('trigger', views.trigger),
    path('event/new', views.event_new),
    path('event/delete', views.event_delete),
]

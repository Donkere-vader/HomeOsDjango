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
    path('event/new', views.event_new),
]

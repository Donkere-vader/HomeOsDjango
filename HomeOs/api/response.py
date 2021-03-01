from django.http import HttpResponse
import json


def json_response(d: dict) -> HttpResponse:
    return HttpResponse(json.dumps(d), content_type='application/json')

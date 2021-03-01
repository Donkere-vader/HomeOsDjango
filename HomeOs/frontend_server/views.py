from django.shortcuts import render

# this is deffinitly not final
def index(request, path=''):
    return render(request, template_name='index.html')

from django.contrib import admin

# Register your models here.
from discharger.models import *

admin.site.register(Discharge)
admin.site.register(PassedBy)
admin.site.register(Stage)

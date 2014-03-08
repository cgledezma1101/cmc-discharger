from django.db import models

# Create your models here.
class Discharge(models.Model)
  end_time = models.DateTimeField(null = True, blank = True)
  location = models.CharField(maxlength = 10)
  name = models.CharField(maxlength = 100)
  start_time = models.DateTimeField()

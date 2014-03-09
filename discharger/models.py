from django.db import models

# Create your models here.

# Main object representing a discharging process
class Discharge(models.Model):
  end_time = models.DateTimeField(null = True, blank = True)
  location = models.CharField(maxlength = 10)
  name = models.CharField(maxlength = 100)
  stages = models.ManyToMany('Stage', through = 'PassedBy')
  start_time = models.DateTimeField()

  def __unicode__(self):
    return 'Patient: ' + self.name + ', Location: ' + self.location

class Stage(models.Model):
  description = TextField(null = True, blank = True)
  discharges = models.ManyToMany('Discharge', through = 'PassedBy')
  name = CharField(maxlength = 100)
  sequence_number = IntegerField()

  def __unicode__(self):
    return self.name

class PassedBy:
  discharge = models.ForeignKey('Discharge')
  entry_time = models.DateTimeField()
  exit_time = models.DateTimeField()
  stage = models.ForeignKey('Stage')

  def __unicode__(self):
    return self.discharge + ', Stage: ' + self.stage

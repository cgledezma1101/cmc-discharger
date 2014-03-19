from django.db import models

# Create your models here.

# Main object representing a discharging process
class Discharge(models.Model):
  end_time = models.DateTimeField(null = True, blank = True)
  location = models.CharField(max_length = 10)
  patient_name = models.CharField(max_length = 100)
  start_time = models.DateTimeField()
  stages = models.ManyToManyField('Stage', through = 'PassedBy')

  # Printed representation of the object
  # @return [String] The string representation of the object
  def __unicode__(self):
    return 'Patient: ' + self.patient_name + ', Location: ' + self.location

  # Determines whether this discharge passed by and finished the stage passed
  # as parameter
  # @param [Stage] stage The stage to be verified
  # @return [Boolean] Whether the stage was completed or not
  def finished_stage(self, stage):
    association = PassedBy.objects.filter(discharge = self,
                                          stage = stage)
    if(association != None and association.exit_time != None):
      return True
    return False

# Join table that represents a stage through which a discharge process has
# passed. If exit_time is null, then the discharge is still on this stage
class PassedBy(models.Model):
  discharge = models.ForeignKey('Discharge')
  entry_time = models.DateTimeField(null = True, blank = True)
  exit_time = models.DateTimeField(null = True, blank = True)
  stage = models.ForeignKey('Stage')

  # Printed representation of the object
  # @return [String] The string representation of the object
  def __unicode__(self):
    return str(self.discharge) + ', Stage: ' + str(self.stage)

# Stages through which a discharge process can passed. They are ordered by
# a sequence number, which allows to tell, when a stage is done, which is the
# next one(s) to come
class Stage(models.Model):
  description = models.TextField(null = True, blank = True)
  discharges = models.ManyToManyField('Discharge', through = 'PassedBy')
  name = models.CharField(max_length = 100)
  sequence_number = models.IntegerField()

  # Printed representation of the object
  # @return [String] The string representation of the object
  def __unicode__(self):
    return self.name

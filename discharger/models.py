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

  # Determines the sequence number of the stage the discharge is currently in
  # @return [int] The sequence number of the current stage, or None if the
  #   discharge is finished
  def current_stage_number(self):
    if self.end_time != None:
      return None

    passed_stages = PassedBy.objects \
                            .filter(discharge = self) \
                            .order_by('stage__sequence_number')
    for passed_stage in passed_stages:
      if passed_stage.exit_time == None:
        return passed_stage.stage.sequence_number

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

  # Returns the list of stages that this discharge has, ordering them by their
  # sequence number
  # @return [QuerySet<Stage>] The ordered set of stages that this discharge must
  #   complete
  def ordered_stages(self):
    return self.stages.all().order_by('sequence_number')

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

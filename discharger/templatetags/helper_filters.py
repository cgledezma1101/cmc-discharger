from django import template
from datetime import datetime
from discharger.models import PassedBy

register = template.Library()

# Gives how many pixels should each element inside the iterable given have if
# the container's size is the argument
#
# @param [list] items The list with the objects to be distributed
# @param [int] size Size of the container in pixels
# @return [int] Size that each container should have
@register.filter
def divide_in(items, size):
  element_count = items.count()
  return int(size / element_count)

# Determines whether the discharge finished the stage passed as paramter
# @param [Discharge] discharge The discharge being considered
# @param [Stage] stage The stage to be consulted
# @return [int] A number between 0 and 100 indicating the percentage of the
#   stage that has been completed in the specified discharge
@register.filter
def progress_in(discharge, stage):
  association = PassedBy.objects.filter(discharge = discharge, stage = stage) \
                                .first()

  if((association != None) and (association.exit_time != None)):
    return 100
  return 0
  
# Returns the amount of seconds that have passed from the value to the current
# time
#
# @param [datetime] reference The date used as reference point
# @return [int] Amount of seconds from the given date until now
@register.filter
def seconds_from(reference):
  difference = datetime.now() - reference.replace(tzinfo = None)
  return int(difference.total_seconds())

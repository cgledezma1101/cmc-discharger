from django import template
from datetime import datetime

register = template.Library()

# Returns the amount of seconds that have passed from the value to the current
# time
#
# @param [datetime] value The date used as reference point
@register.filter
def seconds_from(value):
  difference = datetime.now() - value.replace(tzinfo = None)
  return int(difference.total_seconds())

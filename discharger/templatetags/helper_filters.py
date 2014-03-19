from django import template
from datetime import datetime

register = template.Library()

# Returns the amount of seconds that have passed from the value to the current
# time
#
# @param [datetime] value The date used as reference point
# @return [int] Amount of seconds from the given date until now
@register.filter
def seconds_from(value):
  difference = datetime.now() - value.replace(tzinfo = None)
  return int(difference.total_seconds())

# Gives how many pixels should each element inside the iterable given have if
# the container's size is the argument
#
# @param [list] value The list with the objects to be distributed
# @param [int] arg Size of the container in pixels
# @return [int] Size that each container should have
@register.filter
def divide_in(value, arg):
  print(value)
  element_count = value.count()
  return int(arg / element_count)

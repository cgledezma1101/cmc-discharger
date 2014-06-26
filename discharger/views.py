from django.shortcuts import render
from discharger.models import *

# To return JSON responses
from django.core import serializers;
import json

# GET /discharger/discharges/:discharge_id/complete_stage/:stage_id
#
# Marks a stage as completed under a particular discharge. This call answers
# to javascript requests only.
#
# @param [int] discharge_id The identifier of the discharge where the stage
#   will be completed.
# @param [int] stage_id The stage being completed.
def complete_stage(discharge_id, stage_id):
  return HttpResponse(json.dumps([]),
                      content_type = 'application/json')

# GET /discharger/list
#
# Renders the list of all the unfinished discharges in the system.
#
# @return [QuerySet<Discharge>] discharges: All the discharges to be displayed.
def discharge_list(request):
  # Retrieve all the discharges that haven't ended
  discharges = Discharge.objects.filter(end_time__isnull = True) \
                                .order_by('start_time')
  view_params = { 'discharges': discharges }
  return render(request, 'discharger/discharge_list.html', view_params)

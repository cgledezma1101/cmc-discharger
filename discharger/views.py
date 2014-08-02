from django.shortcuts import render
from discharger.models import *
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

# Important database operations
from django.db import IntegrityError, transaction

# To handle JSON requests and responses
from django.core import serializers;
import json
import requests

# Useful date functions
import datetime

# This includes the 'time(seconds)' function, which is useful for debugging AJAX
import time

BEDS_URL = ''

# POST /altas/agregar?id_cama=:id_cama&
#                     nombre_cama=:nombre_cama&
#                     nombre_paciente=:nombre_paciente
#
# URL that allows the addition of new discharges into the system
#
# @param [int] id_cama Identifier of the discharge
# @param [String] nombre_cama A name for the location where the patient will be
#   placed
# @param [String] nombre_paciente The name of the patient starting the discharge
#   process
#
# @return [int] A JSON integer, having 1 if the process was OK, and 0 otherwise
def add_discharge(request):
  # Retrieve the post parameters
  discharge_id = request.GET.get('id_cama', None)
  location = request.GET.get('nombre_cama', '')
  patient_name = request.GET.get('nombre_paciente', '')
  return_code = 1

  if discharge_id == None:
    discharge = Discharge(location = location,
                          patient_name = patient_name,
                          start_time = datetime.datetime.now())
  else:
    discharge = Discharge(id = int(discharge_id),
                          location = location,
                          patient_name = patient_name,
                          start_time = datetime.datetime.now())

  # Save all the necessary instances in one transaction. If anything goes
  # wrong nothing is saved
  try:
    with transaction.atomic():
      discharge.save()
      for stage in Stage.objects.all():
        passed_by = PassedBy(discharge = discharge,
                             stage = stage)
        # If this is the first stage, start it
        if stage.sequence_number == 0:
          passed_by.entry_time = datetime.datetime.now()

        passed_by.save()
  except IntegrityError:
    return_code = 0

  return HttpResponse(json.dumps(return_code),
                      content_type = 'application/json')

# GET /altas/discharges/:discharge_id/cancel
#
# @param [int] id The identifier of the discharge to cancel
def cancel_discharge(request, discharge_id):
  discharge = Discharge.objects.get(id = discharge_id)

  # First perform the remote request to undo the discharge
  remote_url = BEDS_URL + 'camas/revertir_alta'
  try:
    response = requests.get(remote_url, params = { 'id_cama' : discharge_id })
    status = response.json()
  except:
    status = 0

  # If the discharge was properly reverted, destroy the element and all of
  # it's passed bys atomically
  with transaction.atomic():
    PassedBy.objects.filter(discharge = discharge).delete()
    discharge.delete()

  return HttpResponse(json.dumps(status),
                      content_type = 'application/json')

# GET /altas/discharges/:discharge_id/complete_stage/:stage_id
#
# Marks a stage as completed under a particular discharge. This call answers
# to javascript requests only.
#
# @param [int] discharge_id The identifier of the discharge where the stage
#   will be completed.
# @param [int] stage_id The stage being completed.
# @return [int] A JSON integer indicating the result of the operation. 1 for
#   stage completed but there are still stages to go. 2 for stage completed and
#   beds service notified. 3 for stage completed but bed service not notified.
def complete_stage(request, discharge_id, stage_id):
  stage = Stage.objects.get(id = stage_id)
  discharge = Discharge.objects.get(id = discharge_id)

  # Mark the current stage as ended
  PassedBy.objects.filter(discharge = discharge,
                                 stage = stage) \
                  .update(exit_time = datetime.datetime.now())

  next_stages = \
    PassedBy.objects \
            .filter(discharge__id = discharge_id,
                    stage__sequence_number = (stage.sequence_number + 1))
  if not next_stages:
    # Here there are no more stages, so mark this discharge as finished
    discharge.end_time = datetime.datetime.now()
    discharge.save()

    # Now try to tell the beds service that the bed has been freed
    try:
      request_url = BEDS_URL + 'camas/liberar_cama'
      response = requests.get(request_url, \
                              params = { 'id_cama' : discharge_id })
      request_status = response.json()

      if request_status == 1:
        return_code = 2
      else:
        return_code = 3
    except Exception, e:
      print e
      return_code = 3
  else:
    next_stages.update(entry_time = datetime.datetime.now())
    return_code = 1

  return HttpResponse(json.dumps(return_code),
                      content_type = 'application/json')

# GET /altas/list
#
# Renders the list of all the unfinished discharges in the system.
#
# @return [QuerySet<Discharge>] discharges: All the discharges to be displayed.
@login_required
def discharge_list(request):
  # Retrieve all the discharges that haven't ended
  discharges = Discharge.objects.filter(end_time__isnull = True) \
                                .order_by('start_time')
  view_params = { 'discharges': discharges, 'title' : 'Listado de altas' }
  return render(request, 'discharger/discharge_list.html', view_params)

# GET /altas/statistics
#
# Renders the page that shows the statistics associated to the discharge system
@login_required
def statistics(request):
  view_params = { 'title' : 'Estadisticas' }
  return render(request, 'discharger/statistics.html', view_params)

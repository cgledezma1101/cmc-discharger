from django.shortcuts import render
from discharger.models import *

# Create your views here.
def discharge_list(request):
  # Retrieve all the discharges that haven't ended
  discharges = Discharge.objects.filter(end_time__isnull = True) \
                                .order_by('start_time')
  stages = Stage.objects.all().order_by('sequence_number')
  view_params = { 'discharges': discharges,
                  'stages': stages,
                  'stage_size': 600 / stages.count() }
  return render(request, 'discharger/discharge_list.html', view_params)

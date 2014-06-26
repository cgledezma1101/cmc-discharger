from django.shortcuts import render
from discharger.models import *

# Create your views here.
def discharge_list(request):
  # Retrieve all the discharges that haven't ended
  discharges = Discharge.objects.filter(end_time__isnull = True) \
                                .order_by('start_time')
  view_params = { 'discharges': discharges }
  return render(request, 'discharger/discharge_list.html', view_params)

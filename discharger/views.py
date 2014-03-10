from django.shortcuts import render

# Create your views here.
def discharge_list(request):
  return render(request, 'discharger/discharge_list.html')

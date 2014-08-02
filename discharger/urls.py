# Particular URLs for the discharger application
from django.conf.urls import patterns, include, url
from discharger.views import *

urlpatterns = patterns('',
  url(r'agregar/$', add_discharge),
  url(r'discharges/(\d+)/complete_stage/(\d+)/$', complete_stage),
  url(r'discharges/(\d+)/cancel/$', cancel_discharge),
  url(r'get_statistics/$', get_statistics),
  url(r'list/$', discharge_list),
  url(r'statistics/$', statistics)
)

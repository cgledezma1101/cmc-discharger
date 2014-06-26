# Particular URLs for the discharger application
from django.conf.urls import patterns, include, url
from discharger.views import *

urlpatterns = patterns('',
  url(r'list/$', discharge_list),
  url(r'discharges/(\d+)/complete_stage/(\d+)/$', complete_stage)
)

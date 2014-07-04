from django.conf.urls import patterns, include, url
from django.contrib.auth.views import login, logout

from django.contrib import admin
admin.autodiscover()

from cmc_discharger import views
import discharger

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.login),
    url(r'^altas/', include('discharger.urls')),
    url(r'^accounts/login/$', login),
    url(r'^accounts/logout/$', logout, { 'next_page' : '/accounts/login/' })
)

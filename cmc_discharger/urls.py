from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from cmc_discharger import views
import discharger

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.login),
    url(r'^discharger/', include('discharger.urls'))
)

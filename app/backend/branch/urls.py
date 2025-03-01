from django.template.defaulttags import url
from django.urls import path, include
from rest_framework import routers

from . import views, api

router = routers.DefaultRouter()
router.register("Branch", api.BranchViewSet)
router.register("BranchUser", api.BranchUserViewSet)
router.register("AppSettings", api.AppSettingViewSet)
router.register("ReportModule", api.ReportModuleViewSet)

router.register("CustomerModule", api.CustomerModuleViewSet)
urlpatterns = (
    path("api/v1/", include(router.urls)),
)
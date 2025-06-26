"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from rest_framework import routers
from django.urls import path, include
# from django.conf.urls import url
from rest_framework import routers


from branch import api

from django.conf import settings
from django.views.static import serve

router = routers.DefaultRouter()
router.register("Store", api.BranchViewSet)
router.register("StoreUser", api.BranchUserViewSet)
# router.register("Department", api.DepartmentViewSet)
# router.register("StoreShip", api.StoreShipLocationsViewSet)

urlpatterns = [

    path('accounts/', include('django.contrib.auth.urls')),
    path('admin/', admin.site.urls),
    path('authentication/', include('security.urls')),
    path('manage_branch/', include('branch.urls')),
    path('manage_service/', include('service.urls')),
    #path('payment_service/', include('razorpaypg.urls')),
    path('payment_service/', include('worldline.urls')),
    path('manage_reportengine/', include('reportengine.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serve media files (e.g., uploaded images) in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

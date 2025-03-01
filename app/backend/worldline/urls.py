from django.urls import path, include
from rest_framework import routers
from . import views
from . import api

router = routers.DefaultRouter()

#router.register("Payments", views.PaymentsAPIView)

urlpatterns = [
    path('payments/', views.online_transaction),
    #path('paymentsResponse/', api.payment_response),
    path('paymentsResponse/', views.payment_response),
]

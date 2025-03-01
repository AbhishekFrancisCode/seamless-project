from django.template.defaulttags import url
from django.urls import path, include
from rest_framework import routers

from . import views,api

router = routers.DefaultRouter()
router.register("Category", api.CategoryViewSet)
router.register("OrderStatus", api.OrderStatusViewSet)
router.register("SubCategory", api.SubCategoryViewSet)
router.register("Payment", api.PaymentViewSet)
router.register("contact_us", api.ContactUsViewSet)
urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("api/v1/save_service", views.save_service, name="save_service"),
    path("api/v1/get_order_status", views.get_order_status, name="get_order_status"),
    path("api/v1/get_states_list", views.get_states_list, name="get_states_list"),
    path("api/v1/get_districts_list", views.get_districts_list, name="get_districts_list"),
    path("api/v1/get_taluq_list", views.get_taluq_list, name="get_taluq_list"),
    path("api/v1/get_pincode_list", views.get_pincode_list, name="get_pincode_list"),
    path("api/v1/save_order", views.save_order, name="save_order"),
    path("api/v1/get_order_list", views.get_order_list, name="get_order_list"),
    path('api/v1/get_order_code', views.get_order_code, name="get_order_code"),
    path("api/v1/get_order_list_by_id", views.get_order_list_by_id, name="get_order_list_by_id"),
    path("api/v1/delete_order_details_data", views.delete_order_details_data, name="delete_order_details_data"),
    path("api/v1/get_service_list", views.get_service_list, name="get_service_list"),
    path("api/v1/get_service_list_by_subcategory", views.get_service_list_by_subcategory, name="get_service_list_by_subcategory"),
    # path("api/v1/get_service_lists", views.get_service_lists, name="get_service_lists"),
    path("api/v1/get_service_list_by_id", views.get_service_list_by_id, name="get_service_list_by_id"),
    path("api/v1/delete_service_documents", views.delete_service_documents, name="delete_service_documents"),
    path("api/v1/delete_Branch_fee", views.delete_Branch_fee, name="delete_Branch_fee"),
    path("api/v1/getPaymentGatwayInfo", views.getPaymentGatewayInfo, name="getPaymentGatwayInfo"),
)
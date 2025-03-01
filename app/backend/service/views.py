from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.http import JsonResponse
from django.shortcuts import render
# from notification.notificationservice import StatesDetailService
# Create your views here.
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .service import Services, OrderRequest


# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def save_service(request):
    data = request.data
    store_service = Services()
    res = store_service.save_service(data)
    return JsonResponse(res, safe=False)


@api_view(['GET'])
@permission_classes([AllowAny, ])
def get_service_list(request):
    store_service = Services()
    service = store_service.get_service_list()
    return JsonResponse(service, safe=False)


@api_view(['GET'])
@permission_classes([AllowAny, ])
def get_service_list_by_subcategory(request):
    store_service = Services()
    service = store_service.get_service_list_by_subcategory()
    return JsonResponse(service, safe=False)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated, ])
# def get_service_lists(request):
#     store_service = Services()
#     service = store_service.get_service_lists()
#     return JsonResponse(service, safe=False)


@api_view(['GET'])
@permission_classes([AllowAny, ])
def get_service_list_by_id(request):
    store_service = Services()
    ser_id = request.query_params['id']
    ser_obj = store_service.get_service_list_by_id(ser_id)
    return JsonResponse(ser_obj, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def delete_order_details_data(request):
    data = request.data
    store_service = Services()
    details_res = store_service.delete_order_details_data(data)
    return JsonResponse(details_res, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def save_order(request):
    data = request.data
    store_service = Services()
    file = request.FILES
    res = store_service.save_order(data, file)
    return JsonResponse(res, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_order_list(request):
    store_service = Services()
    order = store_service.get_order_list()
    return JsonResponse(order, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny, ])
def get_order_list_by_id(request):
    store_service = Services()
    ord_id = request.query_params['id']
    ord_obj = store_service.get_order_list_by_id(ord_id)
    return JsonResponse(ord_obj, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny, ])
def get_districts_list(request):
    context=request.query_params['district_id']
    notify = Services()
    res = notify.get_districts_list(context)
    return JsonResponse(res, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny, ])
def get_taluq_list(request):
    context=request.query_params['taluq_id']
    notify = Services()
    res = notify.get_taluq_list(context)
    return JsonResponse(res, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny, ])
def get_states_list(request):
    notify = Services()
    res = notify.get_states_list()
    return JsonResponse(res, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny, ])
def get_order_status(request):
    store_service = Services()
    order_id = request.query_params['order_id']
    order_obj = store_service.get_order_status(order_id)
    return JsonResponse(order_obj, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny, ])
def get_pincode_list(request):
    # context= request
    context=request.query_params['pincode_id']
    notify = Services()
    res = notify.get_pincode_list(context)
    return JsonResponse(res, safe=False)
@api_view(['POST'])
@permission_classes([AllowAny, ])
def get_order_code(request):
    user_category = request.data['user_category']
    user_subcategory=request.data['user_subcategory']
    state = request.data['state']
    district= request.data['district']
    store_service = Services()
    code = store_service.get_order_code(user_category,user_subcategory,state, district)
    return JsonResponse(code, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def delete_service_documents(request):
    data = request.data
    store_service = Services()
    doc_res = store_service.delete_service_documents(data)
    return JsonResponse(doc_res, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def delete_Branch_fee(request):
    data = request.data
    store_service = Services()
    fee_res = store_service.delete_Branch_fee(data)
    return JsonResponse(fee_res, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def getPaymentGatewayInfo(request):
    payment_id = request.data['payment_id']
    service = Services()
    res = service.getPaymentGatewayInfo(payment_id)
    return JsonResponse(res,safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def process_order(request):
    data = request.data
    service = Services()
    order_res = service.process_order(data)
    return JsonResponse(order_res, safe=False)

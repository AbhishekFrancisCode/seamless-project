
import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, FileResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
 
from  .payment_service import PaymentService



@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def verify_payment(request):
    payment = PaymentService()
    data = request.data
    res = payment.verify_payment(data)
    return JsonResponse(res, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def verify_payment_details(request):
    payment = PaymentService()
    tran_id = request.query_params['id']
    ord_obj = payment.verify_payment_details(tran_id)
    return JsonResponse(ord_obj, safe=False)

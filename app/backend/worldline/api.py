from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view([ 'POST','GET'])
@permission_classes([AllowAny, ])
def payment_response(request):

    if request.method == 'GET':
        request_data = request.data  # Assuming JSON data in the request
        return Response({'data': request_data}, status=200)

    if request.method == 'POST':
        request_data = request.data  # Assuming JSON data in the request
        return Response({'data': request_data}, status=200)
    else:
        return Response({'error': 'Only POST requests are allowed'}, status=405)

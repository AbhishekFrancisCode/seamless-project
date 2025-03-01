from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import render, redirect
from security.serializer import UserSerializer, GroupSerializer, CustomTokenObtainPairSerializer
from django.conf import settings

User = get_user_model()


class CreateUserAPIView(ListCreateAPIView):
    # Allow any user (authenticated or not) to access this url
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    # security = SecurityService()

    def perform_create(self, serializer):
        serializer.save()

    def list(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    token_obtain_pair = TokenObtainPairView

@api_view(['POST'])
def change_password(request):
    data = request.data
    user = authenticate(username=data['username'], password=data['old_password'])
    user_obj = User.objects.get(id=user.id)
    if user is not None:
        user_obj.password = make_password(data['new_password'])
        user_obj.save()
        return JsonResponse(user, safe=False, status=status.HTTP_200_OK)
    else:
        return JsonResponse('Invalid credentials', safe=False, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def forget_password(request):
    data = request.data

    if 'email' in data:
        user = User.objects.get(email=data['email'])
        if user is not None:
            pass


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_user_permissions(request):
    user_id = request.user.id
    user_obj = User.objects.get(id=user_id)
    if user_obj is not None:
        perms = user_obj.get_all_permissions()
        return JsonResponse(list(perms), safe=False, status=status.HTTP_200_OK)
    else:
        return JsonResponse('', safe=False, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
@permission_classes([AllowAny, ])
def email_activate(request):
    user_id = request.query_params.get('user_id', '')
    confirmation_token = request.query_params.get('confirmation_token', '')
    try:
        user = User.objects.get(id=user_id)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is None:
        return Response('User not found', status=status.HTTP_400_BAD_REQUEST)
    if not default_token_generator.check_token(user, confirmation_token):
        return Response('Token is invalid or expired. Please request another confirmation email by signing in.', status=status.HTTP_400_BAD_REQUEST)
    user.is_active = True
    user.save()
    return redirect(settings.FRONT_END_APP_LINK)

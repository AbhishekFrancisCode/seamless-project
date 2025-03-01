

from django.conf import settings

from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from security.views import CreateUserAPIView, CustomTokenObtainPairView,  change_password, \
    get_user_permissions,email_activate
from django.contrib.auth import views as auth_views

router = routers.DefaultRouter()


urlpatterns = [
    path('api/user/', CreateUserAPIView.as_view()),
    path('api-auth', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/change_password', change_password, name="change_password"),
    path('api/get_permissions', get_user_permissions, name="get_user_permissions"),
    path('api/activate', email_activate, name="activate"),

]
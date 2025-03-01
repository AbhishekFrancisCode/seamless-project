from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from notification.notificationservice import NotificationService

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    activate_link_url = settings.ACTIVATION_EMAIL_LINK
    class Meta:
        model = User
        fields = ['first_name','last_name','phone_number','email', 'password', 'is_staff','is_customer','categories','subcategories']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['username'] = validated_data['email']
        user = super().create(validated_data)
        confirmation_token = default_token_generator.make_token(user)
        actiavation_link = f'{self.activate_link_url}?user_id={user.id}&confirmation_token={confirmation_token}'
        notification = NotificationService()
        notification.send_activation_email(to_mail=validated_data['email'],user_name=validated_data['first_name'],link=actiavation_link)

        return user


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user_id'] = self.user.id
        data['categories']=self.user.categories
        data['subcategories']=self.user.subcategories
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        data['phone_number'] = self.user.phone_number
        data['permission'] = self.user.get_all_permissions()

        return data


class CustomTokenCreateSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        password = attrs.get("password")
        params = {settings.LOGIN_FIELD: attrs.get(settings.LOGIN_FIELD)}
        self.user = authenticate(
            request=self.context.get("request"), **params, password=password
        )
        if not self.user:
            self.user = User.objects.filter(**params).first()
            if self.user and not self.user.check_password(password):
                self.fail("invalid_credentials")
        # We changed only below line
        if self.user: # and self.user.is_active: 
            return attrs
        self.fail("invalid_credentials")
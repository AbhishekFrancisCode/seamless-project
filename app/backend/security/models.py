from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models, transaction

# Create your models here.
from audit_fields.models import AuditUuidModelMixin


class UserManager(BaseUserManager):

    def _create_user(self, username, password, **extra_fields):
        """
        Creates and saves a User with the given email,and password.
        """
        if not username:
            raise ValueError('The given email must be set')
        try:
            with transaction.atomic():
                user = self.model(username=username, **extra_fields)
                user.set_password(password)
                user.save(using=self._db)
                return user
        except:
            raise

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self._create_user(email, password=password, **extra_fields)


class User(AuditUuidModelMixin, AbstractBaseUser, PermissionsMixin):
    """
    An abstract base class implementing a fully featured User model with
    admin-compliant permissions.

    """
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['first_name', 'phone_number']
    username = models.CharField(max_length=255, blank=True,unique=True)
    email = models.EmailField(max_length=255,unique=True)
    categories = models.CharField(max_length=100,default=None, null=True)
    subcategories = models.CharField(max_length=100,default=None,null=True,blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_of_birth = models.DateField(null=True, blank=True)
    # categoriestype = models.CharField(max_length=100, default=None, null=True)
    phone_number = models.CharField(max_length=100, default=None, null=True)
    is_customer= models.BooleanField(default=False)

    objects = UserManager()

    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)
        return self

    class Meta:
        # display_format = '{user.first_name}'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        swappable = 'AUTH_USER_MODEL'

    def __str__(self):
        return self.first_name + '(' + self.email + ')'
    
    def verified_callback(user):
        user.is_active = True
        user.save()

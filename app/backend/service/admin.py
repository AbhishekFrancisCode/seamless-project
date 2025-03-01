from django.contrib import admin
from service.models import Category
from service.models import SubCategory
from service.models import Service


# Register your models here.
admin.site.register(Category)
admin.site.register(SubCategory)
admin.site.register(Service)
from django.contrib import admin

# Register your models here.
from django.contrib.admin import ModelAdmin

from branch.models import Branch, BranchUser, AppSettings, ReportModule

admin.site.register(Branch)
admin.site.register(BranchUser)

class AppSettingsForm(ModelAdmin):
    list_display = ['app_key', 'app_value']

    class Meta:
        model = AppSettings
        fields = '__all__'
        exclude = ['user_created', 'user_modified', 'hostname_created', 'hostname_modified',
                   'device_created', 'device_modified']


class ReportsModuleForm(ModelAdmin):
    list_display = ['report_name', 'report_file_name', 'params', 'is_active']

    class Meta:
        model = ReportModule
        fields = '__all__'
        exclude = ['user_created', 'user_modified', 'hostname_created', 'hostname_modified',
                   'device_created', 'device_modified']

admin.site.register(AppSettings, AppSettingsForm)
admin.site.register(ReportModule,ReportsModuleForm)

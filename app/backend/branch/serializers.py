from rest_framework import serializers
from sequences import get_next_value

from . import models
from .models import Branch


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Branch
        fields = [
            "id",
            "branch_name",
            "address",
            "city",
            "pin_code",
            "state_code",
            "state_name",
            "gst_no",
            "pan_no",
            "cin_no",
            "email",
            "phone_no",
            "is_head_office",
            "bank_details",
        ]


class BranchUserSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(many=False, read_only=True)

    class Meta:
        model = models.BranchUser
        fields = [
            "id",
            "user",
            "branch",
        ]


class AppSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AppSettings
        fields = [
            'app_key',
            'app_value',
        ]


class ReportModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ReportModule
        fields = [
            'id',
            'report_name',
            'report_file_name',
            'params',
            'is_active',
        ]


class CustomerModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomerModule
        fields = [
            "id",
            'customer_type',
            'customer_name',
            'address_line1',
            'address_line2',
            'phone_number',
            'email',
            'active',
            'blocked_yn',
        ]

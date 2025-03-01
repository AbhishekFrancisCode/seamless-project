from rest_framework import viewsets, permissions

from . import serializers
from . import models


class BranchViewSet(viewsets.ModelViewSet):
    """ViewSet for the Branch class"""

    queryset = models.Branch.objects.all()
    serializer_class = serializers.BranchSerializer

class CustomerModuleViewSet(viewsets.ModelViewSet):
    """ViewSet for the CustomerModule class"""

    queryset = models.CustomerModule.objects.all()
    serializer_class = serializers.CustomerModuleSerializer
    permission_classes = [permissions.AllowAny]

class BranchUserViewSet(viewsets.ModelViewSet):
    """ViewSet for the Branch class"""

    queryset = models.BranchUser.objects.all()
    serializer_class = serializers.BranchUserSerializer

    def get_queryset(self):
        if 'query' in self.request.query_params['query'] and self.request.query_params['query'] == 'all':
            return models.BranchUser.objects.all()
        else:
            return models.BranchUser.objects.filter(user_id=self.request.user.id).all()


class AppSettingViewSet(viewsets.ModelViewSet):
    """ViewSet for the Branch class"""

    queryset = models.AppSettings.objects.all()
    serializer_class = serializers.AppSettingsSerializer

class ReportModuleViewSet(viewsets.ModelViewSet):
    queryset = models.ReportModule.objects.filter(is_active=True).all()
    serializer_class = serializers.ReportModuleSerializer

    def get_queryset(self):
        perm = self.request.user.get_all_permissions()
        perm = [ str(i.split(".")[1]).replace("can_view_","") for i in list(perm)]
        if 'is_active' in self.request.query_params:
            return models.ReportModule.objects.filter(report_name__in=perm,is_active=int(self.request.query_params['is_active'])).all()
        else:
            return models.ReportModule.objects.filter(report_name__in=perm).all()

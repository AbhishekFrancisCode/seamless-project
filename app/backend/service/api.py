from rest_framework import viewsets, permissions,status
from rest_framework.response import Response
from . import serializers
from . import models
from .service import Services


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for the Category class"""

    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class OrderStatusViewSet(viewsets.ModelViewSet):
    """ViewSet for the Category class"""

    queryset = models.OrderStatus.objects.all()
    serializer_class = serializers.OrderStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for the SubCategory class"""

    queryset = models.SubCategory.objects.all()
    serializer_class = serializers.SubCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        store_service = Services()
        store_service.save_sub_category(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class OrderRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for the orderrequest class"""

    queryset = models.OrderRequest.objects.all()
    serializer_class = serializers.OrderRequestSerializer

class OrderAttachmentsViewSet(viewsets.ModelViewSet):
    """ViewSet for the orderdetails class"""

    queryset = models.OrderAttachments.objects.all()
    serializer_class = serializers.OrderAttachmentsSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for the paymentdetails class"""

    queryset = models.Payment.objects.all().order_by('-payment_date')
    serializer_class = serializers.PaymentSerializer
    permission_classes = [permissions.AllowAny]

class ContactUsViewSet(viewsets.ModelViewSet):
    """ViewSet for the ProductPriceMaster class"""

    queryset = models.contact_us.objects.all()
    serializer_class = serializers.ContactUsSerializer
    permission_classes = [permissions.AllowAny]

from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.
from audit_fields.models import AuditUuidModelMixin
 

User = get_user_model()


class Payments(AuditUuidModelMixin):
    razorpay_signature = models.CharField(max_length=500, null=True)
    razorpay_payment_id = models.CharField(max_length=500, null=True)
    razorpay_order_id = models.CharField(max_length=500, null=True)
    payment_vendor = models.CharField(max_length=500, null=True)
    payment_date = models.DateTimeField()
    payment_status = models.CharField(max_length=50)
    payment_order_id = models.CharField(max_length=50)
    order_data = models.TextField(null=True)
    payment_verified = models.BooleanField(default=False)
    order_number = models.CharField(max_length=30, null=True)


class Transaction(AuditUuidModelMixin):
    order_id = models.CharField(max_length=100,null=False)
    transaction_date = models.DateTimeField()
    receipt_id = models.CharField(max_length=50)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    payment = models.ForeignKey(Payments, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)





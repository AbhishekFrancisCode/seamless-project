from contextlib import nullcontext
from email.policy import default
from statistics import mode
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db import models


# Create your models here.
from django.urls import reverse

from django_audit_fields.models import AuditUuidModelMixin

from branch.models import Branch

from branch.models import CustomerModule


class Category(AuditUuidModelMixin):
    category_name = models.CharField(max_length=200, default=None, null=True)
    description = models.CharField(max_length=2000, null=True, blank=True)
    sequence = models.IntegerField(default=0)
    service_type = models.CharField(max_length=100, default=None, null=True)

    class Meta:
        pass
        # ordering = ('sequence', )

class contact_us(AuditUuidModelMixin):
    # user = models.ForeignKey(User, on_delete=models.CASCADE,null=True,blank=True)
    full_name = models.CharField(max_length=250,default=None,null=True,blank=True)
    subject = models.CharField(max_length=250,default=None,null=True,blank=True)
    phone_number = models.CharField(max_length=10,default=None,null=True,blank=True)
    email = models.CharField(max_length=250,default=None,null=True,blank=True)
    message = models.CharField(max_length=2000, default=None, null=True)

    class Meta:
        pass

class SubCategory(AuditUuidModelMixin):
    sub_category_name = models.CharField(max_length=50, default=None, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="category_sub_category")
    description = models.CharField(max_length=2000, null=True)
    sequence = models.IntegerField(default=0)

    class Meta:
         pass

class Service(AuditUuidModelMixin):
    service_name = models.CharField(max_length=50,default=None, null=True)
    desc = models.CharField(max_length=50, default=None, null=True)
    category = models.ForeignKey(Category, default=None, null=True, on_delete=models.CASCADE, related_name="category")
    sub_category = models.ForeignKey(SubCategory, on_delete=models.CASCADE, default=None, null=True)
    category_name = models.CharField(max_length=50, default=None, null=True)
    sub_category_name = models.CharField(max_length=50, default=None, null=True)
    active = models.BooleanField(default=True, null=True)
    is_learner_license = models.BooleanField(default=False, null=True)
    sequence = models.IntegerField(default=0)

    class Meta:
        pass
        # ordering = ('',)

class ServiceBranchFee(AuditUuidModelMixin):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, default=None, null=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, default=None, null=True)
    sl_no = models.IntegerField(default=0)
    branch_name = models.CharField(max_length=50, default=None, null=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    govt_fee =models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return str(self.pk)


class ServiceDocuments(AuditUuidModelMixin):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, default=None, null=True)
    sl_no = models.IntegerField(default=0)
    document_name = models.CharField(max_length=100, default=None, null=True)
    is_mandatory = models.BooleanField(default=0)

    def __str__(self):
        return str(self.pk)


class OrderRequest(AuditUuidModelMixin):
    order_no = models.CharField(max_length=250, null=True, blank=True)
    order_code = models.CharField(max_length=255, null=True, blank=True)
    order_date = models.CharField(max_length=100, null=True, blank=True)
    order_status = models.CharField(max_length=100, null=True, blank=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, default=None, null=True)
    service_type = models.CharField(max_length=1000, null=True, blank=True)
    customer = models.ForeignKey(CustomerModule, on_delete=models.CASCADE, default=None, null=True)
    customer_name = models.CharField(max_length=1000, null=True, blank=True)
    customer_lastname = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=500, null=True, blank=True)
    adharno = models.CharField(max_length=50, null=True, blank=True)
    address1 = models.CharField(max_length=500, null=True, blank=True)
    address2 = models.CharField(max_length=500, null=True, blank=True)
    state = models.CharField(max_length=50, default="")
    district = models.CharField(max_length=50, default="")
    city = models.CharField(max_length=500, null=True, blank=True)
    pincode = models.IntegerField(default=0)
    customer_phone = models.CharField(max_length=50, null=True, blank=True)
    application_no = models.CharField(max_length=100, null=True, blank=True)
    dl_number = models.CharField(max_length=100, null=True, blank=True)
    remarks = models.CharField(max_length=1000, null=True, blank=True)
    billed_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    additional_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    active = models.BooleanField(default=False)

    class Meta:
        pass

class OrderAttachments(AuditUuidModelMixin):
    order = models.ForeignKey(OrderRequest, on_delete=models.CASCADE, default=None, null=True,
                              related_name="order_details")
    order_maker_file = models.FileField(upload_to="upload/OrderRequest/file/", null=True, blank=True, default=None)
    file = models.ForeignKey(ServiceDocuments, on_delete=models.CASCADE, default=None, null=True,
                             related_name="service_documents")
    file_name = models.CharField(max_length=255,blank=True,null=True)

    class Meta:
        pass

class Payment(AuditUuidModelMixin):
    order = models.ForeignKey(OrderRequest, on_delete=models.CASCADE, default=None, null=True)
    order_no = models.CharField(max_length=100, null=True, blank=True)
    service_name = models.CharField(max_length=100, null=True, blank=True)
    customer = models.ForeignKey(CustomerModule, on_delete=models.CASCADE, default=None, null=True)
    customer_name = models.CharField(max_length=1000, null=True, blank=True)
    billed_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_date = models.CharField(max_length=100, null=True, blank=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_type = models.CharField(max_length=100, null=True, blank=True)
    remarks = models.CharField(max_length=1000, null=True, blank=True)
    transaction_payload = models.TextField(default=None,null=True)
    transaction_id = models.CharField(unique=True, max_length=200,null=True,default=None)
    transaction_timestamp = models.CharField(max_length=50,default=None,null=True)
    pg_gateway_response = models.TextField(default=None,null=True)
    transaction_status = models.CharField(max_length=50,default='NOT INITIATED',null=True)


    class Meta:
        pass

class OrderStatus(AuditUuidModelMixin):
    order = models.ForeignKey(OrderRequest, on_delete=models.CASCADE, default=None, null=True)
    order_no= models.CharField(max_length=50, default=None, null=True)
    order_date = models.CharField(max_length=100, null=True, blank=True)
    order_status = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
         pass
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db import models

# Create your models here.
from django.urls import reverse

from django_audit_fields.models import AuditUuidModelMixin


User = get_user_model()


class Branch(AuditUuidModelMixin):
    branch_name = models.CharField(max_length=255, null=False)
    address = models.TextField(max_length=500, null=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    pin_code = models.CharField(max_length=10, null=True, blank=True)
    state_code = models.IntegerField(null=True, default=0)
    state_name = models.CharField(max_length=50, default="")
    gst_no = models.CharField(max_length=50, null=False, blank=False)
    pan_no = models.CharField(max_length=50, null=False, blank=False, default=None)
    cin_no = models.CharField(max_length=50, null=False, blank=False, default=None)
    email = models.CharField(max_length=50, null=False, blank=False, default=None)
    phone_no = models.CharField(max_length=50, null=False, blank=False, default=None)
    bank_details = models.TextField(default=None)
    is_head_office = models.BooleanField(default=False)

    class Meta:
        pass

    def __str__(self):
        return str(self.branch_name)

    def get_absolute_url(self):
        return reverse("branch_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("branch_update", args=(self.pk,))


class BranchUser(AuditUuidModelMixin):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="branch_user")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="branch_store", default="")

    class Meta:
        pass


class AppSettings(AuditUuidModelMixin):
    app_key = models.CharField(max_length=50)
    app_value = models.CharField(max_length=1000)

    class Meta:
        pass

class ReportModule(AuditUuidModelMixin):
    report_name = models.CharField(null=False, max_length=100,unique=True)
    report_file_name = models.CharField(null=False, max_length=100)
    params = models.CharField(max_length=1000, null=True, blank=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        permissions = (
            ("can_view_reports", "Can View Reports"),
            # ("can_view_pos_sales_reports", "Can View POS Sales Reports"),
            # ("can_view_online_sales_reports", "Can View Online Sales Reports"),
            # ("can_view_product_list_reports", "Can View Product List Reports"),
            # ("can_view_product_stock_reports", "Can View Product Stock Reports"),
            # ("can_view_overall_sales_reports", "Can View Over All Sales Reports"),
            # ("can_view_barcode_40l_reports", "Can View Barcode 40L Reports"),
        )

    def save(self, *args, **kwargs):
        super(ReportModule, self).save(*args, **kwargs)
        code_name = "can_view_" + str(self.report_name).lower()
        name = "Can View " + str(self.report_name).capitalize()
        ct = ContentType.objects.get_for_model(ReportModule)
        Permission.objects.get_or_create(codename=code_name,
                                  name=name,
                                  content_type=ct)

class CustomerModule(AuditUuidModelMixin):
    customer_type = models.CharField(max_length=100, null=True, blank=True)
    customer_name = models.CharField(max_length=500, null=True, blank=True)
    address_line1 = models.CharField(max_length=1000, null=True, blank=True)
    address_line2 = models.CharField(max_length=1000, null=True, blank=True)
    phone_number = models.CharField(max_length=30,null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    active = models.BooleanField(default=False)
    blocked_yn = models.BooleanField(default=False)

    class Meta:
        pass

    def __str__(self):
        return str(self.id)
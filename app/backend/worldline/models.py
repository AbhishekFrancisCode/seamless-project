from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.
from audit_fields.models import AuditUuidModelMixin

User = get_user_model()


class Payments(AuditUuidModelMixin):
    card_number = models.CharField(max_length=500, null=True, default=None)
    exp_month = models.CharField(max_length=500, null=True, default=None)
    exp_year = models.CharField(max_length=500, null=True, default=None)
    cvv_code = models.CharField(max_length=500, null=True, default=None)
    si_details_merchantend = models.CharField(max_length=500, null=True, default=None)
    merchant_code = models.CharField(max_length=500, null=True, default=None)
    txn_id = models.CharField(max_length=500, null=True, default=None)
    amount = models.CharField(max_length=500, null=True, default=None)
    merchant_scheme_code = models.CharField(max_length=500, null=True, default=None)
    cust_id = models.CharField(max_length=500, null=True, default=None)
    mob_no = models.CharField(max_length=500, null=True, default=None)
    email = models.CharField(max_length=500, null=True, default=None)
    customer_name = models.CharField(max_length=500, null=True, default=None)
    currency = models.CharField(max_length=500, null=True, default=None)
    acc_no = models.CharField(max_length=500, null=True, default=None)
    debit_start_date = models.CharField(max_length=500, null=True, default=None)
    debit_end_date = models.CharField(max_length=500, null=True, default=None)
    max_amount = models.CharField(max_length=500, null=True, default=None)
    amount_type = models.CharField(max_length=500, null=True, default=None)
    frequency = models.CharField(max_length=500, null=True, default=None)

    class Meta:
        pass










from rest_framework import serializers
from .models import Payments

class PaymentsSerializer(serializers.ModelSerializer):
    cardNumber = serializers.CharField(source='card_number', allow_null=True, default=None)
    expMonth = serializers.CharField(source='exp_month', allow_null=True, default=None)
    expYear = serializers.CharField(source='exp_year', allow_null=True, default=None)
    cvvCode = serializers.CharField(source='cvv_code', allow_null=True, default=None)
    siDetailsMerchantEnd = serializers.CharField(source='si_details_merchantend', allow_null=True, default=None)
    merchantCode = serializers.CharField(source='merchant_code', allow_null=True, default=None)
    txnId = serializers.CharField(source='txn_id', allow_null=True, default=None)
    amount = serializers.CharField(allow_null=True, default=None)  # Field not in the model
    merchantSchemeCode = serializers.CharField(source='merchant_scheme_code', allow_null=True, default=None)
    custId = serializers.CharField(source='cust_id', allow_null=True, default=None)
    mobNo = serializers.CharField(source='mob_no', allow_null=True, default=None)
    email = serializers.CharField(allow_null=True, default=None)  # Field not in the model
    customerName = serializers.CharField(source='customer_name', allow_null=True, default=None)
    currency = serializers.CharField(allow_null=True, default=None)  # Field not in the model
    accNo = serializers.CharField(source='acc_no', allow_null=True, default=None)
    debitStartDate = serializers.CharField(source='debit_start_date', allow_null=True, default=None)
    debitEndDate = serializers.CharField(source='debit_end_date', allow_null=True, default=None)
    maxAmount = serializers.CharField(source='max_amount', allow_null=True, default=None)
    amountType = serializers.CharField(source='amount_type', allow_null=True, default=None)
    frequency = serializers.CharField(allow_null=True, default=None)  # Field not in the model

    class Meta:
        model = Payments
        fields = ['id',
                  'cardNumber',
                  'expMonth',
                  'expYear',
                  'cvvCode',
                  'siDetailsMerchantEnd',
                  'txnId',
                  'amount',
                  'merchantCode',
                  'merchantSchemeCode',
                  'custId',
                  'mobNo',
                  'email',
                  'customerName',
                  'currency',
                  'accNo',
                  'debitStartDate',
                  'debitEndDate',
                  'maxAmount',
                  'amountType',
                  'frequency',
                  ]

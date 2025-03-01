
from django import forms
import json
# Define a function to read configuration data (replace with your implementation)
import os
from backend.settings import BASE_DIR

def read_data():
    config_file_path = os.path.join(BASE_DIR, '/Users/francis/workspace/ST000027_RADIANT_DIGI-ST000027_RADIANT_DIGI_DEVELOP/app/backend/worldline/worldline_configuration.json')
    # config_file_path = os.path.join(BASE_DIR, '/SanadiTech/Radiant/ST000027_RADIANT_DIGI/app/backend/worldline_configuration.json')
    with open(config_file_path, 'r') as f:
        config_data = json.load(f)
    return config_data

class OnlineTransactionForm(forms.Form):
    config_data = read_data()
    merchantCode = forms.CharField(label='Merchant Code', required=False)
    txn_id = forms.CharField(label='Transaction ID')
    amount = forms.CharField(label='Amount')
    merchantSchemeCode = forms.CharField(label='Scheme', required=False)
    custID = forms.CharField(label='Customer Id')
    mobNo = forms.CharField(label='Mobile Number')
    email = forms.CharField(label='Email')
    customerName = forms.CharField(label='Customer Name')
    currency = forms.CharField(label='Currency', required=False)
    SALT = forms.CharField(label='SALT', required=False)
    returnUrl = forms.CharField(label='Return URL')
    cardNumber = forms.CharField(label='card Number',required=False)
    expMonth = forms.CharField(widget=forms.HiddenInput(), required=False)
    expYear = forms.CharField(widget=forms.HiddenInput(), required=False)
    cvvCode = forms.CharField(widget=forms.HiddenInput(), required=False)
    siDetailsAtMerchantEndCond = forms.CharField(widget=forms.HiddenInput(), required=False)


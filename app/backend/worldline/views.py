import hashlib
from datetime import date, timedelta
import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.middleware.csrf import get_token

from django.shortcuts import render, redirect
from django.http import JsonResponse
from .forms import OnlineTransactionForm, read_data  # Import your form
import requests
from django.http import HttpResponse
import json
import environ

env = environ.Env()
environ.Env.read_env()
# from .payment_service import online_transaction1
from service.models import Payment

string_to_bool = {'true': True, True: True, 'false': False, False: False}


def check_data():
    config_data = read_data()
    if (config_data['merchantCode'] and config_data['SALT'] and config_data['merchantSchemeCode'] and config_data[
        'currency']) == "":
        return 'False'
    else:
        return config_data


def call_api(data):
    raw_response = requests.post(url='https://www.paynimo.com/api/paynimoV2.req', data=json.dumps(data))
    return raw_response.json()


def get_datastring(data):
    return data['merchantCode'] + '|' + data['txn_id'] + '|' + data['amount'] + '|' + data['accNo'] + '|' \
        + str(data['custID']) + '|' + data['mobNo'] + '|' + data['email'] + '|' + \
        '-'.join(reversed(data['debitStartDate'].split('-'))) + '|' + '-'.join(
            reversed(data['debitEndDate'].split('-'))) \
        + '|' + data['maxAmount'] + '|' + data['amountType'] + '|' + data['frequency'] + '|' + data['cardNumber'] + '|' \
        + data['expMonth'] + '|' + data['expYear'] + '|' + data['cvvCode'] + '|' + data['SALT']


def get_hash_object(hashed_data, data, config_data):
    prepared_object = {
        'tarCall': False,
        'features': {
            'showPGResponseMsg': True,
            'enableMerTxnDetails': True,
            'enableAbortResponse': False,
            'enableSI': string_to_bool[config_data['enableSI']],
            'siDetailsAtMerchantEnd': string_to_bool[config_data.get('siDetailsAtMerchantEnd', 'false')],
            'enableNewWindowFlow': string_to_bool[config_data['enableNewWindowFlow']],
            # for hybrid applications please disable this by passing False
            'enableExpressPay': string_to_bool[config_data['enableExpressPay']],
            # if unique customer identifier is passed then save card functionality for end  end customer
            'enableInstrumentDeRegistration': string_to_bool[config_data['enableInstrumentDeRegistration']],
            # if unique customer identifier is passed then option to delete saved card by end customer
            'hideSavedInstruments': string_to_bool[config_data['hideSavedInstruments']],
            'separateCardMode': string_to_bool[config_data['separateCardMode']],
            'payWithSavedInstrument': string_to_bool[config_data['saveInstrument']],
            'hideSIDetails': string_to_bool[config_data['hideSIDetails']],
            'hideSIConfirmation': string_to_bool[config_data['hideSIConfirmation']],
            'expandSIDetails': string_to_bool[config_data['expandSIDetails']],
            'enableDebitDay': string_to_bool[config_data['enableDebitDay']],
            'showSIResponseMsg': string_to_bool[config_data['showSIResponseMsg']],
            'showSIConfirmation': string_to_bool[config_data['showSIConfirmation']],
            'enableTxnForNonSICards': string_to_bool[config_data['enableTxnForNonSICards']],
            'showAllModesWithSI': string_to_bool[config_data['showAllModesWithSI']]
        },
        'consumerData': {
            'deviceId': 'WEBSH2',  # //possible values 'WEBSH1', 'WEBSH2' and 'WEBMD5'
            'token': hashed_data,
            'returnUrl': data['returnUrl'],
            'paymentMode': config_data['paymentMode'],
            'paymentModeOrder': config_data['paymentModeOrder'].replace(' ', '').split(','),
            'checkoutElement': '#worldline_embeded_popup' if string_to_bool[
                config_data['embedPaymentGatewayOnPage']] else '',
            'merchantLogoUrl': config_data['logoURL'],
            'merchantId': data['merchantCode'],  # provided merchant
            'merchantMsg': config_data['merchantMessage'],
            'disclaimerMsg': config_data['disclaimerMessage'],
            'currency': data['currency'],
            'consumerId': data['custID'],  # Your unique consumer identifier to register a eMandate/eNACH
            'consumerMobileNo': data['mobNo'],
            'consumerEmailId': data['email'],
            'txnId': data['txn_id'],  # Unique merchant transaction ID
            'items': [{
                'itemId': data['merchantSchemeCode'],
                'amount': data['amount'],
                'comAmt': '0'
            }],
            'customStyle': {
                'PRIMARY_COLOR_CODE': config_data['primaryColor'],  # merchant primary color code
                'SECONDARY_COLOR_CODE': config_data['secondaryColor'],  # provide merchant's suitable color code
                'BUTTON_COLOR_CODE_1': config_data['buttonColor1'],  # merchant's button background color code
                'BUTTON_COLOR_CODE_2': config_data['buttonColor2']
                # provide merchant's suitable color code for button text
            }
        }
    }
    if string_to_bool[data['siDetailsAtMerchantEndCond']]:
        prepared_object['consumerData']['accountNo'] = data['accNo']
        prepared_object['consumerData']['accountHolderName'] = data['accountHolderName']
        prepared_object['consumerData']['ifscCode'] = data['ifscCode']
        prepared_object['consumerData']['accountType'] = data['accountType']
        prepared_object['consumerData']['debitStartDate'] = '-'.join(reversed(data['debitStartDate'].split('-')))
        prepared_object['consumerData']['debitEndDate'] = '-'.join(reversed(data['debitEndDate'].split('-')))
        prepared_object['consumerData']['maxAmount'] = data['maxAmount']
        prepared_object['consumerData']['amountType'] = data['amountType']
        prepared_object['consumerData']['frequency'] = data['frequency']
    elif string_to_bool[config_data['enableSI']] and not string_to_bool[data['siDetailsAtMerchantEndCond']]:
        prepared_object['consumerData']['debitStartDate'] = '-'.join(reversed(data['debitStartDate'].split('-')))
        prepared_object['consumerData']['debitEndDate'] = '-'.join(reversed(data['debitEndDate'].split('-')))
        prepared_object['consumerData']['maxAmount'] = data['maxAmount']
        prepared_object['consumerData']['amountType'] = data['amountType']
        prepared_object['consumerData']['frequency'] = data['frequency']
    return prepared_object


@api_view(['POST', 'GET'])
@permission_classes([AllowAny, ])
def online_transaction(request):
    config_data = check_data()
    start_date = date.today().strftime('%Y-%m-%d')
    end_date = (date.today() + timedelta(days=30 * 365.2425)).strftime('%Y-%m-%d')
    form = OnlineTransactionForm()
    # Get the CSRF token
    csrf_token = get_token(request)
    if not config_data:
        return render(request, 'mandatory_fields_page_error.html')
    if request.method == 'GET':
        payment_id = request.query_params.get('id')
        payment_details = Payment.objects.filter(id=payment_id).values(
            'transaction_id',
            'customer__customer_name',
            'customer__phone_number',
            'customer__email',
            'customer',
            'payment_amount'
        )
        initial_data = {}  # Create a dictionary for initial data
        if payment_details.exists():
            payment = Payment.objects.get(id=payment_id)
            payment.transaction_id = str(random.randint(100, 9999999999))
            payment.save()
            initial_data['txn_id'] = payment_details[0]['transaction_id']  # Use the updated txn_id
            initial_data['custID'] = '1234567'
            initial_data['merchantCode'] = 'L955387'
            initial_data['merchantSchemeCode'] = 'FIRST'
            initial_data['mobNo'] = payment_details[0]['customer__phone_number']
            initial_data['email'] = payment_details[0]['customer__email']
            initial_data['customerName'] = payment_details[0]['customer__customer_name']
            initial_data['amount'] = payment_details[0]['payment_amount']
            initial_data['currency'] = 'INR'
            initial_data['cardNumber'] = ''
            initial_data['SALT'] = '6391993385WVGGCS'
            initial_data['returnUrl'] = f"{env('BASE_URL')}/payment_service/paymentsResponse/"
            initial_data['expMonth'] = ""
            initial_data['expYear'] = ""
            initial_data['cvvCode'] = ""
            initial_data['siDetailsAtMerchantEndCond'] = "false"
            form = OnlineTransactionForm(initial=initial_data)

    if request.method == 'POST':
        form_data = request.POST.dict()
        data2 = request.data
        payment_details = Payment.objects.filter(transaction_id=data2['txn_id']).values(
            'transaction_id',
            'customer__customer_name',
            'customer__phone_number',
            'customer__email',
            'customer',
            'payment_amount'

        )
        form_data['merchantCode'] = 'L955387'
        form_data['txn_id'] = payment_details[0]['transaction_id']
        form_data['amount'] = payment_details[0]['payment_amount']
        form_data['merchantSchemeCode'] = 'FIRST'
        form_data['custID'] = '6948321207'  # payment_details[0]['customer']
        form_data['mobNo'] = payment_details[0]['customer__phone_number']
        form_data['email'] = payment_details[0]['customer__email']
        form_data['amount'] = str(payment_details[0]['payment_amount'])
        form_data['customerName'] = payment_details[0]['customer__customer_name']
        form_data['currency'] = 'INR'
        form_data['SALT'] = '6391993385WVGGCS'
        form_data[
            'returnUrl'] = f"{env('BASE_URL')}/payment_service/paymentsResponse/"  # if string_to_bool[config_data['displayTransactionMessageOnPopup']] else ''
        form_data['accNo'] = ''
        form_data['cardNumber'] = ''
        form_data['debitStartDate'] = ''
        form_data['debitEndDate'] = ''
        form_data['maxAmount'] = ''
        form_data['amountType'] = ''
        form_data['frequency'] = ''
        form_data['expMonth'] = ''
        form_data['expYear'] = ''
        form_data['cvvCode'] = ''
        form_data['siDetailsAtMerchantEndCond'] = False
        form = OnlineTransactionForm(initial=form_data)
        for field_name, field_value in config_data.items():
            # Set initial values for the form fields based on config_data
            if field_name in form.fields:
                form.fields[field_name].initial = field_value
        # if config_data['typeOfPayment'] == 'TEST':
        #     form_data['amount'] = '1'
        if not string_to_bool[config_data.get('siDetailsAtMerchantEnd', 'false')] and string_to_bool[
            config_data['enableSI']]:
            form_data['amountType'] = config_data['amountType']
            form_data['frequency'] = config_data['frequency']
            form_data['debitStartDate'] = date.today().strftime('%Y-%m-%d')
            form_data['debitEndDate'] = (date.today() + timedelta(days=30 * 365.2425)).strftime('%Y-%m-%d')
            form_data['maxAmount'] = str(int(form_data['amount']) * 2)

        data_string = get_datastring(form_data)
        hashed_data = hashlib.sha512(data_string.encode()).hexdigest()
        data = get_hash_object(hashed_data, form_data, config_data)
        return JsonResponse(data)
    return render(request, 'online_transaction.html',
                  {'form': form, 'config_data': config_data, 'start_date': start_date, 'end_date': end_date})


@api_view(['POST', 'GET'])
@permission_classes([AllowAny, ])
def payment_response(request):
    if request.method == 'POST':
        data = request.POST['msg'].split('|')
        print("data", data)
        full_response = request.POST['msg']
        if data[0] == '0300':
            config_data = check_data()
            if not config_data:
                return render(request, 'mandatory_fields_page_error.html')
            request_data = {
                'merchant': {
                    'identifier': config_data['merchantCode']
                },
                'transaction': {
                    'deviceIdentifier': 'S',
                    'currency': config_data['currency'],
                    'dateTime': data[8].split().pop(0),
                    'token': data[5],
                    'requestType': 'S'
                }
            }
            response = call_api(request_data)
            merchant_transaction_identifier = response.get('merchantTransactionIdentifier')
            payment_details = Payment.objects.filter(transaction_id=merchant_transaction_identifier).first()
            if payment_details:
                # Perform the update
                payment_details.pg_gateway_response = response
                payment_details.save()
            else:
                print('No Payment object found for the given transaction_id.')

    return render(request, 'response.html', {'data': data, 'response': response if 'response' in locals() else {},
                                             'full_response': full_response if 'full_response' in locals() else {}})

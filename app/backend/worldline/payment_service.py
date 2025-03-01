# import hashlib
# from datetime import date, timedelta
# from random import random
#
# from django.shortcuts import render, redirect
# from django.http import JsonResponse
# from .forms import OnlineTransactionForm, read_data  # Import your form
# import requests
# from django.http import HttpResponse
# import json
#
# from service.models import Payment
#
# string_to_bool = {'true': True, True: True, 'false': False, False: False}
#
#
# def check_data():
#     config_data = read_data()
#     if (config_data['merchantCode'] and config_data['SALT'] and config_data['merchantSchemeCode'] and config_data['currency']) == "":
#         return False
#     else:
#         return config_data
#
#
# def call_api(data):
#     raw_response = requests.post(url='https://www.paynimo.com/api/paynimoV2.req', data=json.dumps(data))
#     return raw_response.json()
#
# def get_datastring(data):
#     print('get_datastring')
#     return data['merchantCode'] + '|' + data['txn_id'] + '|' + '1'+ '|' + data['accNo'] + '|' \
#             + data['custID'] + '|' + data['mobNo'] + '|' + data['email'] + '|' + \
#             '-'.join(reversed(data['debitStartDate'].split('-'))) + '|' + '-'.join(reversed(data['debitEndDate'].split('-'))) \
#             + '|' + data['maxAmount'] + '|' + data['amountType'] + '|' + data['frequency'] + '|' + data['cardNumber'] + '|' \
#             + data['expMonth'] + '|' + data['expYear'] + '|' + data['cvvCode'] + '|' + data['SALT']
#
#
# def get_hash_object(hashed_data, data, config_data):
#     print('get_hash_object')
#     prepared_object = {
#         'tarCall': False,
#         'features': {
#             'showPGResponseMsg': True,
#             'enableMerTxnDetails': True,
#             'enableAbortResponse': False,
#             'enableSI': string_to_bool[config_data['enableSI']],
#             'siDetailsAtMerchantEnd': string_to_bool[config_data.get('siDetailsAtMerchantEnd', 'false')],
#             'enableNewWindowFlow': string_to_bool[config_data['enableNewWindowFlow']],  # for hybrid applications please disable this by passing False
#             'enableExpressPay': string_to_bool[config_data['enableExpressPay']],  # if unique customer identifier is passed then save card functionality for end  end customer
#             'enableInstrumentDeRegistration': string_to_bool[config_data['enableInstrumentDeRegistration']],  # if unique customer identifier is passed then option to delete saved card by end customer
#             'hideSavedInstruments': string_to_bool[config_data['hideSavedInstruments']],
#             'separateCardMode': string_to_bool[config_data['separateCardMode']],
#             'payWithSavedInstrument': string_to_bool[config_data['saveInstrument']],
#             'hideSIDetails': string_to_bool[config_data['hideSIDetails']],
#             'hideSIConfirmation': string_to_bool[config_data['hideSIConfirmation']],
#             'expandSIDetails': string_to_bool[config_data['expandSIDetails']],
#             'enableDebitDay': string_to_bool[config_data['enableDebitDay']],
#             'showSIResponseMsg': string_to_bool[config_data['showSIResponseMsg']],
#             'showSIConfirmation': string_to_bool[config_data['showSIConfirmation']],
#             'enableTxnForNonSICards': string_to_bool[config_data['enableTxnForNonSICards']],
#             'showAllModesWithSI': string_to_bool[config_data['showAllModesWithSI']]
#         },
#         'consumerData': {
#             'deviceId': 'WEBSH2',  # //possible values 'WEBSH1', 'WEBSH2' and 'WEBMD5'
#             'token': hashed_data,
#             'returnUrl': data['returnUrl'],
#             'paymentMode': config_data['paymentMode'],
#             'paymentModeOrder': config_data['paymentModeOrder'].replace(' ', '').split(','),
#             'checkoutElement': '#worldline_embeded_popup' if string_to_bool[config_data['embedPaymentGatewayOnPage']] else '',
#             'merchantLogoUrl': config_data['logoURL'],
#             'merchantId': data['merchantCode'],  # provided merchant
#             'merchantMsg': config_data['merchantMessage'],
#             'disclaimerMsg': config_data['disclaimerMessage'],
#             'currency': data['currency'],
#             'consumerId': data['custID'],  # Your unique consumer identifier to register a eMandate/eNACH
#             'consumerMobileNo': data['mobNo'],
#             'consumerEmailId': data['email'],
#             'txnId': data['txn_id'],  # Unique merchant transaction ID
#             'items': [{
#                 'itemId': data['merchantSchemeCode'],
#                 'amount': data['amount'],
#                 'comAmt': '0'
#             }],
#             'customStyle': {
#                 'PRIMARY_COLOR_CODE': config_data['primaryColor'],  # merchant primary color code
#                 'SECONDARY_COLOR_CODE': config_data['secondaryColor'],  # provide merchant's suitable color code
#                 'BUTTON_COLOR_CODE_1': config_data['buttonColor1'],  # merchant's button background color code
#                 'BUTTON_COLOR_CODE_2': config_data['buttonColor2']  # provide merchant's suitable color code for button text
#             }
#         }
#     }
#     if string_to_bool[data['siDetailsAtMerchantEndCond']]:
#         prepared_object['consumerData']['accountNo'] = data['accNo']
#         prepared_object['consumerData']['accountHolderName'] = data['accountHolderName']
#         prepared_object['consumerData']['ifscCode'] = data['ifscCode']
#         prepared_object['consumerData']['accountType'] = data['accountType']
#         prepared_object['consumerData']['debitStartDate'] = '-'.join(reversed(data['debitStartDate'].split('-')))
#         prepared_object['consumerData']['debitEndDate'] = '-'.join(reversed(data['debitEndDate'].split('-')))
#         prepared_object['consumerData']['maxAmount'] = data['maxAmount']
#         prepared_object['consumerData']['amountType'] = data['amountType']
#         prepared_object['consumerData']['frequency'] = data['frequency']
#     elif string_to_bool[config_data['enableSI']] and not string_to_bool[data['siDetailsAtMerchantEndCond']]:
#         prepared_object['consumerData']['debitStartDate'] = '-'.join(reversed(data['debitStartDate'].split('-')))
#         prepared_object['consumerData']['debitEndDate'] = '-'.join(reversed(data['debitEndDate'].split('-')))
#         prepared_object['consumerData']['maxAmount'] = data['maxAmount']
#         prepared_object['consumerData']['amountType'] = data['amountType']
#         prepared_object['consumerData']['frequency'] = data['frequency']
#     return prepared_object
#
#
# def online_transaction1(request):
#     config_data = check_data()
#
#     if not config_data:
#         return render(request, 'mandatory_fields_page_error.html')
#
#     initial_data = {}  # Create a dictionary for initial data
#
#     for field in OnlineTransactionForm():  # Use the form class, not an instance
#         field_name = field.name
#         initial_data[field_name] = config_data.get(field_name, '')  # Populate the initial_data dictionary
#
#     #initial_data['txn_id'] = str(random.randint(100, 9999999999))
#     initial_data['txn_id'] = '123456'
#     start_date = date.today().strftime('%Y-%m-%d')
#     end_date = (date.today() + timedelta(days=30*365.2425)).strftime('%Y-%m-%d')
#     #return_url = request.build_absolute_uri('/response') if not string_to_bool[config_data['displayTransactionMessageOnPopup']] else ''
#
#     # Pass the initial_data to the form instance
#     form = OnlineTransactionForm(initial=initial_data)
#
#     if not string_to_bool[config_data.get('siDetailsAtMerchantEnd', 'false')] and string_to_bool[
#                 config_data['enableSI']]:
#         form_data = request
#         # form_data['csrfmiddlewaretoken']= 'sueo4CRiZhVtrEq8hiqsewRBFNnZfFQA2UXhywd0kDYaCcK7rEbGowYuQNnv8Y2l'
#         form_data['merchantCode'] = 'T955387'
#         form_data['txn_id'] = '12343356'
#         form_data['amount'] = 1
#         form_data['merchantSchemeCode'] = 'FIRST'
#         form_data['custID'] = '11'
#         form_data['mobNo'] = '1234567891'
#         form_data['email'] = 'mail@mail.com'
#         form_data['customerName'] = 'Test'
#         form_data['currency'] = 'INR'
#         form_data['SALT'] = '6391993385WVGGCS'
#         form_data['returnUrl'] = 'http://127.0.0.1:8000/payment_service/paymentsResponse/'
#         form_data['accNo'] = ''
#         form_data['cardNumber'] = ''
#         form_data['debitStartDate'] = ''
#         form_data['debitEndDate'] = ''
#         form_data['maxAmount'] = ''
#         form_data['amountType'] = ''
#         form_data['frequency'] = ''
#         form_data['expMonth'] = ''
#         form_data['expYear'] = ''
#         form_data['cvvCode'] = ''
#         form_data['siDetailsAtMerchantEndCond'] = False
#
#         print('if form')
#
#         # print('from_data',form_data)
#
#         # Get or create a CustomerModule instance based on the customer identifier
#         # customer_identifier = form_data.get('customer', '')
#         # customer, _ = CustomerModule.objects.get_or_create(identifier=customer_identifier)
#
#         # Create or update a Payment object with data from the request
#         payment, created = Payment.objects.get_or_create(order_no=form_data.get('order_no'))
#
#         # Update the Payment object with the request data
#         payment.balance_amount = form_data.get('balance_amount', 0)
#         payment.billed_amount = form_data.get('billed_amount', 0)
#         #payment.customer = form_data.get('customer', '')
#         payment.customer_id = ''
#         payment.customer_name = form_data.get('customer_name', '')
#         payment.order_id = form_data.get('order', '')
#         payment.payment_amount = form_data.get('payment_amount', 0)
#         payment.payment_date = form_data.get('payment_date', '2023-09-09')
#         payment.payment_type = form_data.get('payment_type', 'Online')
#         payment.pg_gateway_response = form_data.get('pg_gateway_response', '')
#         payment.remarks = form_data.get('remarks', '')
#         payment.service_name = form_data.get('service_name', 'Service 1')
#         payment.transaction_id = form_data.get('transaction_id', '')
#         payment.transaction_payload = form_data.get('transaction_payload', '')
#         payment.transaction_status = form_data.get('transaction_status', '')
#         payment.transaction_timestamp = form_data.get('transaction_timestamp', '')
#         # Save the Payment object
#         payment.save()
#
#         if config_data['typeOfPayment'] == 'TEST':
#             form_data['amount'] = '1'
#             print('amount',form_data['amount'])
#         if not string_to_bool[config_data.get('siDetailsAtMerchantEnd', 'false')] and string_to_bool[
#             config_data['enableSI']]:
#             form_data['amountType'] = config_data['amountType']
#             form_data['frequency'] = config_data['frequency']
#             form_data['debitStartDate'] = date.today().strftime('%Y-%m-%d')
#             form_data['debitEndDate'] = (date.today() + timedelta(days=30 * 365.2425)).strftime('%Y-%m-%d')
#             form_data['maxAmount'] = str(int(form_data['amount']) * 2)
#         data_string = get_datastring(form_data)
#         hashed_data = hashlib.sha512(data_string.encode()).hexdigest()
#         print('hashed_data',hashed_data)
#         data = get_hash_object(hashed_data, form_data, config_data)
#         return JsonResponse(data)
#     print('form',form)
#     print('config_data',config_data)
#     return render(request, 'online_transaction.html',
#                   {'form': form, 'config_data': config_data, 'start_date': start_date, 'end_date': end_date})
#
#
# def payment_response(request):
#     # You can avoid using a global variable here by defining data_dict within the function.
#     data_dict = {}
#
#     if request.method == 'POST':
#         data = request.POST.get('msg').split('|')
#         full_response = request.POST.get('msg')
#
#         if data[0] == '0300':
#             config_data = check_data()
#             if not config_data:
#                 return render(request, 'mandatory_fields_page_error.html')
#
#             request_data = {
#                 'merchant': {
#                     'identifier': config_data['merchantCode']
#                 },
#                 'transaction': {
#                     'deviceIdentifier': 'S',
#                     'currency': config_data['currency'],
#                     'dateTime': data[8].split().pop(0),
#                     'token': data[5],
#                     'requestType': 'S'
#                 }
#             }
#             # response_data = call_api(request_data)  # Store the response in a local variable
#
#         else:
#             response_data = None  # Set it to None if the condition is not met
#
#         # Define data_dict here to avoid issues with global variables.
#         data_dict = {
#             'TxnStatus': data[0],
#             'Txn Message': data[1],
#             'Txn Error Message': data[2],
#             'Clnt Txn Ref': data[3],
#             'TPSL Bank Cd': data[4],
#             'TPSL Txn Id': data[5],
#             'Txn Amt': data[6],
#             'Clnt Request Meta': data[7],
#             'TPSL Txn Time': data[8],
#             'Balance Amt': data[9],
#             'Card Id': data[10] if data[10] != "" else None,
#             'Alias Name': data[11],
#             'Bank Transaction Id': data[12],
#             'Mandate Reg No': data[13] if data[13] != "" else None,
#             'Token': data[14],
#             'Hash': data[15],
#         }
#
#         return render(request, 'response.html',
#                       {'data': data_dict, 'response_data': response_data, 'full_response': full_response})
#
#     return HttpResponse("Method not allowed", status=405)

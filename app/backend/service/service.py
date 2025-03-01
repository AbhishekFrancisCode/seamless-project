
import secrets
from django.db import transaction
import ast
import os
import json
import datetime
from sequences import get_next_value
from django.http import HttpResponse

from notification.notificationservice import NotificationService, NotificationDetails
from razorpaypg.payment_service import PaymentService
from .models import OrderRequest,OrderStatus, OrderAttachments, Payment, Service, ServiceBranchFee, ServiceDocuments, Category, \
    SubCategory
from .encryption import generateHMACSHA256


class Services:
    @classmethod
    def save_sub_category(cls, serializer):
        sub_category = SubCategory()
        sub_category.category_id = serializer.initial_data['category_id']
        sub_category.sub_category_name = serializer.initial_data['sub_category_name']
        sub_category.sequence = serializer.initial_data['sequence']
        sub_category.description = serializer.initial_data['description']
        sub_category.save()
        return serializer

    @classmethod
    def get_districts_list(cls, context):
        print("context value", context)
        jason_dir = 'static/jason/'
        file = 'statesservice.json'
        file_path = os.path.join(jason_dir, file)
        with open(file_path, 'rb') as f:
            data = f.read()
            f.close()
        items = json.loads(data)
        l = []
        m=[]
        for i in items:
            l.append(i['stateName'])
            for j in items:
                if j['stateName']==context:
                    m.append(j['districtName'])
            return list(set(m))

    @classmethod
    def get_taluq_list(cls, context):
        print("context value", context)
        jason_dir = 'static/jason/'
        file = 'statesservice.json'
        file_path = os.path.join(jason_dir, file)
        with open(file_path, 'rb') as f:
            data = f.read()
            f.close()
        items = json.loads(data)
        l = []
        m = []
        for i in items:
            l.append(i['stateName'])
            for j in items:
                if j['districtName'] == context:
                    m.append(j['taluk'])
            return list(set(m))

    @classmethod
    def get_pincode_list(cls, context):
        print("context value", context)
        jason_dir = 'static/jason/'
        file = 'statesservice.json'
        file_path = os.path.join(jason_dir, file)
        with open(file_path, 'rb') as f:
            data = f.read()
            f.close()
        items = json.loads(data)
        l = []
        m = []
        for i in items:
            l.append(i['stateName'])
            for j in items:
                if j['taluk'] == context:
                    m.append(j['pincode'])
            return list(set(m))

    @classmethod
    @transaction.atomic
    def save_service(cls, data):
        if 'id' in data:
            service_object = Service.objects.get(id=data['id'])
        else:
            service_object = Service()

        service_object.service_name = data['service_name']
        service_object.desc = data['desc']
        service_object.sequence = data['sequence']
        service_object.category_id = data['category']
        service_object.sub_category_id = data['sub_category']
        service_object.category_name = data['category_name']
        service_object.sub_category_name = data['sub_category_name']
        if data['is_learner_license'] =="true":
            service_object.is_learner_license=True
        if data['is_learner_license']== "false":
            service_object.is_learner_license=False
        if data['active'] == "true":
            service_object.active = True
        if data['active'] == "false":
            service_object.active = False
        service_object.save()

        service_list1 = ast.literal_eval(str(data['service_list1']))
        for item in service_list1:
            if 'id' in item:
                service_product = ServiceBranchFee.objects.get(id=item['id'])
            else:
                service_product = ServiceBranchFee()
                service_product.service = service_object

            service_product.branch_id = item['branch_id']
            service_product.sl_no = item['sl_no']
            service_product.branch_name = item['branch_name']
            service_product.fee = item['fee']
            service_product.govt_fee = item['govt_fee']
            service_product.save()

        service_list2 = data['service_list2']
        for item in json.loads(service_list2):
            print("service item", item)
            if 'id' in item:
                service_product1 = ServiceDocuments.objects.get(id=item['id'])
            else:
                service_product1 = ServiceDocuments()
                service_product1.service = service_object

            service_product1.sl_no = item['sl_no']
            service_product1.document_name = item['document_name']
            service_product1.is_mandatory = item['is_mandatory']
            # if item['is_mandatory'] == "true":
            #     service_product1.is_mandatory = True
            # if item['is_mandatory'] == "false":
            #     service_product1.is_mandatory = False
            service_product1.save()

        return service_object.service_name

    @classmethod
    def get_service_list(cls):
        service_list = Service.objects.all().values(
            "id",
            "service_name",
            "category",
            "category__service_type",
            "sequence",
            'is_learner_license',
            "sub_category",
            "category_name",
            "sub_category_name",
            "desc",
            "active",
        ).order_by('category__sequence')
        for item in list(service_list):
            item['service_list1'] = list(
                ServiceBranchFee.objects.filter(service_id=item['id']).all().values(
                    'id',
                    'sl_no',
                    'branch_name',
                    'branch_id',
                    'branch__state_name',
                    'fee',
                    'govt_fee',
                ))
            service_list2 = list(
                ServiceDocuments.objects.filter(service_id=item['id']).all().values(
                    'id',
                    'sl_no',
                    'document_name',
                    'is_mandatory',
                ))
            item['service_doc'] = list(service_list2)
        return list(service_list)

    @classmethod
    def get_service_list_by_subcategory(cls):
        service_list = Service.objects.filter(active=True).order_by().values('category_name').distinct()
        for item in service_list:
            service_list1=Service.objects.filter(category_name=item['category_name'],active=True).order_by('sub_category__sequence').values('sub_category_name').distinct()
            # service_list1=Service.objects.filter(category_name=item['category_name']).values('sub_category_name','sub_category__sequence').order_by('sub_category__sequence')
            print("service list", service_list1)
            for service in service_list1:
                service_list2 = Service.objects.filter(category_name=item['category_name'],sub_category_name=service['sub_category_name'],active=True).values(
                    'id',
                    'service_name',
                    'sub_category__sequence',
                    'sequence',
                    'is_learner_license',
                    "active",
                ).order_by('sequence')
                # if service_list2[0]['active'] == 'true':
                service['service_list2'] = list(service_list2)
                # if service_list2.active == 'true':
                #     service['service_list2'] = list(service_list2)
                for documents in service_list2:
                    service_list3 = list(
                        ServiceDocuments.objects.filter(service_id=documents['id']).all().values(
                            'id',
                            'sl_no',
                            'document_name',
                            'is_mandatory',
                        ))
                    documents['service_doc'] = list(service_list3)
            item['service_list1'] = list(service_list1)
        return list(service_list)

    @classmethod
    def get_service_list_by_id(cls, ser_id):
        service_list = Service.objects.filter(id=ser_id).all().values(
            "id",
            "service_name",
            "category",
            "sequence",
            "sub_category",
            "category_name",
            "sub_category_name",
            "desc",
            'is_learner_license',
            "active",
        )[0]
        service_list['service_list1'] = list(
            ServiceBranchFee.objects.filter(service_id=ser_id).all().values(
                'id',
                'sl_no',
                "branch__state_name",
                'branch_name',
                'branch_id',
                'fee',
                'govt_fee',
            ))
        service_list['service_list2'] = list(
            ServiceDocuments.objects.filter(service_id=ser_id).all().values(
                'id',
                'sl_no',
                'document_name',
                'is_mandatory',

            ))
        return service_list

    @classmethod
    @transaction.atomic
    def save_order(cls, data, file):
        if 'id' in data:
            order_object = OrderRequest.objects.get(id=data['id'])
            # status_order=OrderStatus.objects.get(order=data['id'])
        else:
            order_object = OrderRequest()
            order_object.order_no = cls.generate_order_number()
            notify = NotificationDetails()
            notify.send_email(data['email'], data)
            # status_order = OrderStatus()

        # status_order.order_id=data[id]
        # status_order.order_no=data['order_no']
        # status_order.order_status=data['order_status']
        # status_order.order_date = data['order_date']
        order_object.order_code = data['order_code']
        order_object.order_date = data['order_date']
        order_object.order_status = data['order_status']
        order_object.service_id = data['service_id']
        order_object.service_type = data['service_type']
        order_object.customer_id = data['customer_id']
        order_object.customer_name = data['customer_name']
        order_object.customer_phone = data['customer_phone']
        order_object.customer_lastname = data['customer_lastname']
        order_object.email = data['email']
        order_object.adharno = data['adharno']
        order_object.address1 = data['address1']
        order_object.address2 = data['address2']
        order_object.state = data['state']
        order_object.district=data['district']
        order_object.city = data['city']
        order_object.pincode = data['pincode']
        order_object.application_no = data['application_no']
        order_object.dl_number = data['dl_number']
        order_object.remarks = data['remarks']
        order_object.billed_amount = data['billed_amount']
        order_object.additional_charges = data['additional_charges']
        if data['active'] == "true":
            order_object.active = True
        if data['active'] == "false":
            order_object.active = False

        order_object.save()

        # order_details = data['order_documents']
        # print(order_details)
        order_details = ast.literal_eval(data['order_documents'])
        for idx, item in enumerate(order_details):
            if len(data.getlist('order_maker_file[]')) > 0:
                file = data.getlist('order_maker_file[]')[idx]
                if OrderAttachments.objects.filter(order_id=order_object.id,file_id=item['file_id']).exists():
                    order_attachment_obj = OrderAttachments.objects.get(order_id=order_object.id,file_id=item['file_id'])
                else:
                    order_attachment_obj = OrderAttachments()
                order_attachment_obj.order = order_object
                order_attachment_obj.file_id = item['file_id']
                order_attachment_obj.order_maker_file = file
                order_attachment_obj.file_name = file.name
                order_attachment_obj.save()
        return order_object.id

    @classmethod
    def get_order_list(cls):
        order_list = OrderRequest.objects.all().values(
            "id",
            'order_no',
            'order_code',
            # 'order_details',
            'order_date',
            'order_status',
            'service_type',
            'customer',
            'district',
            'customer_name',
            'customer_phone',
            'customer_lastname',
            'email',
            'adharno',
            'address1',
            'address2',
            'state',
            'city',
            'pincode',
            'application_no',
            'dl_number',
            'remarks',
            'billed_amount',
            'additional_charges',
            'active',
        )
        return list(order_list)

    @classmethod
    def get_order_list_by_id(cls, ord_id):
        order_list = OrderRequest.objects.filter(id=ord_id).all().values(
            "id",
            'order_no',
            'order_code',
            # 'order_details',
            'order_date',
            'order_status',
            'service_type',
            'customer',
            'service',
            'customer_name',
            'customer_phone',
            'customer_lastname',
            'email',
            'adharno',
            'address1',
            'address2',
            'state',
            'district',
            'city',
            'pincode',
            'application_no',
            'dl_number',
            'remarks',
            'billed_amount',
            'additional_charges',
            'active'

        )[0]
        order_list['order_details'] = list(
            OrderAttachments.objects.filter(order_id=ord_id).all().values(
                'id',
                # "order",
                'order_maker_file',
                'file_id',
                'file_name',
                'file__document_name',
            ))
        return order_list

    @classmethod
    def get_order_code(cls, user_category,user_subcategory,state, district):
        print("inputs",user_category,user_subcategory,state,district)
        my_list = [word[0] for word in user_category.split()]
        letter=""
        for x in my_list:
            letter+=x
            print("first char",letter)
            my_list = [word[0] for word in user_category.split()]
            category = ""
            for x in my_list:
                category += x
                print("first letter", category)
        my_list1 = [word[0] for word in user_subcategory.split()]
        letter1=""
        for x in my_list1:
            letter1+=x
            print("second char",letter1)
            my_list1 = [word[0] for word in user_subcategory.split()]
            category1 = ""
            for x in my_list1:
                category1 += x
                print("second letter", category1)
        # my_list2 = [word[0] for word in state.split()]
        letter2=""
        # for x in my_list2:
        #     letter2+=x
        #     print("thirs char",letter2)
        #     my_list2 = [word[0] for word in state.split()]
        #     category2= ""
        #     for x in my_list2:
        #         category2 += x
        #         print("third letter", category2)
        # my_list3 = [word[0] for word in district.split()]
        # letter3=""
        # for x in my_list3:
        #     letter3+=x
        #     print("four char",letter3)
        #     my_list3 = [word[0] for word in district.split()]
        #     category3= ""
        #     for x in my_list3:
        #         category3 += x
        #         print("four letter", category3)
        prefix_code = category[:3]+ category1[:3].upper() + state[:3].upper()+ district[:3].upper()
        code = get_next_value(prefix_code)
        code = prefix_code + str(code)
        return code

    # @classmethod
    # def get_order_status(cls):
    #     order_status = OrderStatus.objects.all().values(
    #         "id",
    #         'order_no',
    #         'order_date',
    #         'order_status',
    #     )
    #     return list(order_status)
    @classmethod
    def get_order_status(cls, order_id):
        order_status = OrderStatus.objects.filter(order_id=order_id).all().values(
            'order_id',
            'order_no',
            'order_date',
            'order_status',
        )
        return list(order_status)

    @classmethod
    def generate_order_number(cls):
        prefix_code = ''
        code = get_next_value(sequence_name="ORDERNUMBER",initial_value=1)
        code = "ORD" + str(code).zfill(5)
        return code

    @classmethod
    def delete_order_details_data(cls, data):
        OrderAttachments.objects.filter(id=data['id']).delete()

    @classmethod
    def delete_service_documents(cls, data):
        ServiceDocuments.objects.filter(id=data['id']).delete()

    @classmethod
    def delete_Branch_fee(cls, data):
        ServiceBranchFee.objects.filter(id=data['id']).delete()

    @classmethod
    def getPaymentGatewayInfo(cls,data):
        paymentData = Payment.objects.filter(id=data).all()
        gatewayId="48703827"
        secretKey="70005BBF1CE93029"
        if paymentData.exists():
            msg = "gatewayId=" +gatewayId+",amount=" +str(paymentData[0].payment_amount)+",referenceId="+data
            res = dict(
                gatewayId=gatewayId,
                amount=paymentData[0].payment_amount,
                referenceId=data,
                # secretKey=secretKey,
                msg_digest=msg,
                signature= cls.generateSignature(secretKey, msg)
            )
            return res
        else:
            raise Exception("Payment information not found")
    
    @classmethod
    def generateSignature(cls,secretkey,data):
         
        return generateHMACSHA256(key=secretkey, message=data)
   
    
    @classmethod
    def get_states_list(cls):
        jason_dir='static/jason/'
        file='statesservice.json'
        file_path=os.path.join(jason_dir,file)
        with open(file_path,'rb') as f:
            data=f.read()
            f.close()
        items = json.loads(data)
        l=[]
        for i in items:
            l.append(i['stateName'])
        return list(set(l))

    @transaction.atomic
    def process_order(self, order_data, user_id):
        order_request = OrderStatus()
        order_request.order_date = datetime.datetime.now()
        order_request.order_id = order_data['id']
        order_request.order_no = order_data['order_no']
        order_request.order_status = order_data['order_no']
        # order_request.order_number = get_next_value('order_number', 100000000)
        # order_request.order_status = 1
        # order_request.payment_method = order_data['payment_method']
        # order_request.delivery_method = order_data['delivery_method']

        order_request.save()


def send_mail_login(mail_id, otp):
    notifs = NotificationService()
    mail_list = []
    mail_list.append(mail_id)
    notifs.send_email(mail_id, otp)

def send_mail_service(mail_id, otp):
    notifs =NotificationDetails()
    mail_list = []
    mail_list.append(mail_id)
    notifs.send_email(mail_id, otp)


from rest_framework import serializers
from sequences import get_next_value
import random


from . import models
from .service import send_mail_login
from notification.notificationservice import NotificationService, NotificationDetails


def generate_order_number():
    prefix_code = ''
    code = get_next_value()
    code = str(code)
    return code


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = [
            "category_name",
            "description",
            'sequence',
            'service_type',
            "id",
        ]
class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderStatus
        fields = [
            'order',
            'order_date',
            'order_no',
            'order_status',
            "id",
        ]

class ContactUsSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.contact_us
        fields = ['id', 'full_name','email','phone_number','message','subject']

    def create(self, validated_data):
        notify=NotificationService()
        notify.send_email(validated_data['email'], validated_data)
        # validated_data['password'] = make_password(validated_data['password'])
        # user = super().create(validated_data)
        return True


class SubCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = models.SubCategory
        fields = [
            "id",
            "category",
            "sub_category_name",
            'sequence',
            "description",
        ]


class OrderAttachmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderAttachments
        fields = [
            "id",
            "order",
            'order_maker_file',
            'file',
            'file_name'
        ]


class OrderRequestSerializer(serializers.ModelSerializer):
    # order_details = OrderDetailsSerializer(many=True)

    class Meta:
        model = models.OrderRequest
        fields = [
            "id",
            'order_no',
            'order_details',
            'order_date',
            'order_status',
            'service_type',
            'customer',
            'customer_name',
            'customer_phone',
            'application_no',
            'dl_number',
            'remarks',
            'billed_amount',
            # 'order_maker_file',
            'active',

        ]

    def create(self, validated_data):
        order_details = validated_data.pop('order_details')
        # if len(validated_data['order_no']) == 0:
        validated_data['order_no'] = generate_order_number()
        # order = models.Quotation.objects.create(**validated_data)
        order = super().create(validated_data)
        for item in order_details:
            models.OrderDetails.objects.create(
                order=order, **item)
        return order

    def update(self, instance, validated_data):
        validated_data.pop('order_details')

        order_details = self.initial_data['order_details']
        order = models.OrderRequest.objects.filter(
            id=instance.id).update(**validated_data)
        for item in order_details:
            if models.OrderDetails.objects.filter(id=item['id']).exists():
                models.OrderDetails.objects.filter(
                    id=item['id']).update(**item)
            else:
                models.OrderDetails.objects.create(
                    order=instance, **item)
        return instance

    def to_representation(self, instance):
        data = super(OrderRequestSerializer, self).to_representation(instance)
        return data

class PaymentSerializer(serializers.ModelSerializer):
    transaction_payload= serializers.CharField(max_length=100,allow_blank=True)
    transaction_id= serializers.CharField(max_length=100,allow_blank=True)
    transaction_timestamp= serializers.CharField(max_length=100,allow_blank=True)
    pg_gateway_response= serializers.CharField(max_length=100,allow_blank=True)
    transaction_status= serializers.CharField(max_length=100,allow_blank=True)
    class Meta:
        model = models.Payment
        fields = [
            "id",
            'order',
            "order_no",
            'service_name',
            'customer',
            'customer_name',
            'billed_amount',
            'balance_amount',
            'payment_date',
            'payment_amount',
            'payment_type',
            'remarks',
            'transaction_payload',
            'transaction_id',
            'transaction_timestamp',
            'pg_gateway_response',
            'transaction_status',
        ]
    def create(self, validated_data):
        validated_data['transaction_id'] = str(random.randint(100, 9999999999))
        return super().create(validated_data)
    def to_representation(self, instance):
        response1 = []
        response = super().to_representation(instance)
        response['order_status'] = models.OrderRequest.objects.filter(
            id=instance.order_id).values('order_status').distinct()
        return response


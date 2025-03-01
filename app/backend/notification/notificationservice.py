#
import os
from email.mime.image import MIMEImage

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context
from security.models import User
import security

class NotificationService:

    @classmethod
    @transaction.atomic
    def send_email(cls, to_mail,data):
        body_html = '''
          <html>
              <body>
                 <p>{{full_name}}</p>
                 <p>{{email}}</p>
                 <p>{{phone_number}}</p>
                 <p>{{subject}}</p>
                 <p>{{message}}</p>
              </body>
          </html>
          '''


        subject = "Contact Seamless Online Services Private Limited"
        # html_message = render_to_string('otp.html')
        message = 'Seamless Online Services Private Limited'
        email_from = settings.EMAIL_HOST_USER
        recipient_list =[]
        recipient_list.append(email_from)

        d=({
            'full_name':data['full_name'],
            'email': data['email'],
            'phone_number':data['phone_number'],
            'subject':data['subject'],
            'message':data['message'],
        })
        htmly = get_template('body.html')
        html_content = htmly.render(d)
        # msg = EmailMultiAlternatives(subject,html_content, from_email=email_from, to=recipient_list)
        #
        # msg.send()
        send_mail(subject,message,email_from, recipient_list,html_message=html_content)

    @classmethod
    @transaction.atomic
    def send_activation_email(cls, to_mail,user_name,link):
            body_html = '''
            <html>
                <body>
                     <p> Hi [USER],<br>
                     click here to activate your account [LINK]
                     </p>
                </body>
            </html>
            '''


            subject = "Activate your Seamless Online Services Account"
            # html_message = render_to_string('otp.html')
            body_html = body_html.replace('[LINK]',link)
            body_html = body_html.replace('[USER]',user_name)
            message = body_html
            
            email_from = settings.EMAIL_HOST_USER
            recipient_list =[]
            recipient_list.append(to_mail)

            # htmly = get_template('body.html')
            # html_content = htmly.render(d)
            # msg = EmailMultiAlternatives(subject,html_content, from_email=email_from, to=recipient_list)
            #
            # msg.send()
            send_mail(subject,message,email_from, recipient_list,html_message=body_html)

class NotificationDetails:

    @classmethod
    @transaction.atomic
    def send_email(cls, to_mail, data):
        servicebody_html = '''
          <html>
              <body>
                 <p>{{customer_name}}</p>
                 <p>{{service_type}}
                 <p>{{customer_phone}}</p>
                 <p>{{email}}</p>
                 <p>{{order_no}}</p>
                 <p>{{order_date}}</p>
                 <p>{{order_status}}</p>

                 # <p>{{}}</p>
                 # <p>{{}}</p>
              </body>
          </html>
          '''

        subject = "Seamless Online Services Private Limited"
        message = 'Seamless Online Services Private Limited'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = []
        recipient_list.append(email_from)

        d = ({
            'customer_phone': data['customer_phone'],
            'customer_name' : data['customer_name'],
            'email'         :data['email'],
            'service_type'  :data['service_type'],
            'order_no'      :data['order_no'],
            'order_date'    :data['order_date'],
            'order_status'  :data['order_status'],
            'order_code'    : data['order_code'],
        })
        htmly = get_template('servicebody.html')
        html_content = htmly.render(d)
        send_mail(subject, message, email_from, recipient_list, html_message=html_content)

    @classmethod
    @transaction.atomic
    def send_activation_email(cls, to_mail, user_name, link):
        body_html = '''
            <html>
                <body>
                     <p> Hi [USER],<br>
                     click here to activate your account [LINK]
                     </p>
                </body>
            </html>
            '''

        subject = "Activate your Seamless Online Services Account"
        # html_message = render_to_string('otp.html')
        body_html = body_html.replace('[LINK]', link)
        body_html = body_html.replace('[USER]', user_name)
        message = body_html

        email_from = settings.EMAIL_HOST_USER
        recipient_list = []
        recipient_list.append(to_mail)

        # htmly = get_template('body.html')
        # html_content = htmly.render(d)
        # msg = EmailMultiAlternatives(subject,html_content, from_email=email_from, to=recipient_list)
        #
        # msg.send()
        send_mail(subject, message, email_from, recipient_list, html_message=body_html)

# notification = NotificationService()
# notification.send_email()
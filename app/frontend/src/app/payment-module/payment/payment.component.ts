import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { OrderModuleService } from 'src/app/order-module/order-module.service';
import { CustomerModuleService } from 'src/app/customer-module/customer-module.service';
import { ServiceModuleService } from 'src/app/service-module/service-module.service';
import { PaymentModuleService } from '../payment-module.service';
import * as moment from 'moment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  submitted: boolean;
  PaymentForm:FormGroup;
  Payment_Type =[
    {name:"CASH", value:"Cash"},
    {name:"NETBANKING", value:"Net Banking"},
    {name:"UPI", value:"UPI"},
  ]
  Payment_id: any;

  searchPayment:any;
  order_code: any;
  createFlag = true;
  order_id: any;
  payment_id: any;
  order_list: any=[];
  searchorderNo: string;
  order_no: any;
  dailog_ref: any;
  service_list: any=[];
  searchService: string;
  service_id: any;
  service_name: any;
  customer_list: string | Partial<any>;
  searchCustomer: string;
  customer_id: any;
  customer_name: any;
  selected_order: any;
  billed_amount: any;
  payment_amount: any;
  payments_list: [];
  list:any;
  customer: any;
  order: any;
  pay_id: any;
  details: any=[];

  constructor(
    private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private routes: Router,
    private ordermoduleService: OrderModuleService,
    private customermoduleService: CustomerModuleService,
    private servicemoduleService: ServiceModuleService,
    private paymentmoduleService: PaymentModuleService,
    private dialogservice: NbDialogService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const today = new Date()
    this.PaymentForm = this.formBuilder.group(
      {
        orderNoFormControl : ['',[Validators.required]],
        serviceNameFormControl : ['',[]],
        customerFormControl : ['',[]],
        billedFormControl : ['',[]],
        balanceFormControl:['',[]],
        paymentdateFormControl:[moment(new Date(today)).format("YYYY-MM-DD")],
        paymentamountFormControl:['',[Validators.required]],
        paymentTypeFormControl:['',[Validators.required]],
        remarksFormControl:['',[]],
  })
  this.load_order_list();
  this.load_customer_list();
  this.load_service_list();
  // this.load_payment_varify();
  this.payment_id = this.route.snapshot.queryParams["id"];
  if(this.payment_id){
    this.createFlag = false;
    this.paymentmoduleService.getPaymentList(this.payment_id).subscribe(
      (data) => {
        console.log("check order",data);
        this.customer_id = data.customer;
        console.log("customer id is here",this.customer_id)
        this.order_id = data.order;
        this.ordermoduleService.getOrderById(data.order).subscribe(
          (data)=>{
         console.log("orderdata",data)
         this.order_code=data.order_code
          })
        this.PaymentForm.controls['orderNoFormControl'].setValue(data.order_no);
        this.PaymentForm.controls['serviceNameFormControl'].setValue(data.service_name);
        this.PaymentForm.controls['customerFormControl'].setValue(data.customer_name);
        this.PaymentForm.controls['billedFormControl'].setValue(data.billed_amount);
        this.PaymentForm.controls['balanceFormControl'].setValue(data.balance_amount);
        this.PaymentForm.controls['paymentdateFormControl'].setValue(data.payment_date);
        this.PaymentForm.controls['paymentamountFormControl'].setValue(data.payment_amount);
        this.PaymentForm.controls['paymentTypeFormControl'].setValue(data.payment_type);
        this.PaymentForm.controls['remarksFormControl'].setValue(data.remarks);
      },
      (error) =>{
        this.nbtoastService.danger("Unable to get Payment  Information")
      }
    )
    const data='';
    this.paymentmoduleService.getPaymentList(data).subscribe(
      (data)=>{
      console.log("payment",data);
      console.log("customer id is here",this.customer_id)
      var datas = data.filter(x => x.customer === this.customer_id)
      console.log("payment details",datas);
      datas.forEach(e=>{
      this.paymentmoduleService.getPaymentverify(e.transaction_id).subscribe(
        (data) => {
            console.log("check data",data,data.razorpay_payment_id)
          if(data.payment_verified === true){
              e.payment_status ="Completed"
          }
          else
          {
              e.payment_status="Not Completed"
          }
        },
      )
      })
      this.details=datas
      console.log("trans id",this.details.transaction_id)
      console.log("last transaction files",this.details)
         },
    )
  }
}
load_customer_list():void{
  const data = "";
  this.customermoduleService.getCustomerList(data).subscribe(
    (data)=>{
    this.customer_list=data;
    console.log("customer details",this.customer_list)
    },
    (error) => {
      this.nbtoastService.danger(error);
    }
  )
}
  open_customer_dialog(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogservice.open(dialog, { context: this.customer_list })
      .onClose.subscribe(data => {
        this.searchCustomer='';
        this.customer_id=data.id;
        this.customer_name=data.customer_name;
        this.PaymentForm.controls['customerFormControl'].setValue(data.customer_name)
      }
      );
  }
  open_service_dialog(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogservice.open(dialog, { context: this.service_list })
    .onClose.subscribe(data => {
      this.searchService='';
      this.service_id=data.id;
      this.service_name=data.service_type;
      this.PaymentForm.controls['serviceNameFormControl'].setValue(data.service_name);
    }
    );

  }
  open_OrderNo_dialog(dialog: TemplateRef<any>) {
     this.dailog_ref = this.dialogservice.open(dialog, { context: this.order_list })
      .onClose.subscribe(data => {
        console.log("check data",data)
        this.searchorderNo='';
        this.order_id=data.id;
        this.order_no=data.order_no;
        this.selected_order=data;
        this.PaymentForm.controls['orderNoFormControl'].setValue(data.order_no);
        this.PaymentForm.controls['billedFormControl'].setValue(data.billed_amount);

        this.PaymentForm.controls['serviceNameFormControl'].setValue(data.service_type);
        this.PaymentForm.controls['customerFormControl'].setValue(data.customer_name)
        this.order_code=data.order_code
        console.log("order code",this.order_code)
        this.customer_id=data.customer;
        console.log("customer Id",this.customer_id)
        this.ordermoduleService.getOrderById(this.order_id).subscribe(
          (data1)=>{
            console.log("data1",data1)
            this.service_list=[]
              this.service_list.push({
                service_name:data1.service_type,
                billed_amount:data1.billed_amount,
                id:data1.id
              })
              this.PaymentForm.controls['billedFormControl'].setValue(data1.billed_amount);
              this.customer_list=[]
              this.customer_list.push({
                customer_name:data1.customer_name,
                id:data1.id
              })
          },
        )
      }
      );
  }
  calculate(){
    let amount=0;
    this.payment_amount = this.PaymentForm.get('paymentamountFormControl').value;
    this.billed_amount = this.PaymentForm.get('billedFormControl').value;
    amount = (this.billed_amount)-(this.payment_amount);
    console.log("amount",this.payment_amount);
    console.log('bill amount',this.billed_amount)
    this.PaymentForm.controls['balanceFormControl'].setValue(amount);
  }
  load_service_list():void{
    const data = "";
    this.servicemoduleService.getService().subscribe(
      (data)=>{
      this.service_list=data;
      console.log("service details",this.service_list)
      },
      (error) => {
        this.nbtoastService.danger(error);
      }
    )
    this.selected_order=data
  }
  load_order_list():void{
  const data = "";
  this.ordermoduleService.getOrderList(data).subscribe(
    (data)=>{
    this.order_list=data;
    console.log("order details",this.order_list)
    },
    (error) => {
      this.nbtoastService.danger(error);
    }
  )
}
  savePayment():void{
    if (this.PaymentForm.dirty && this.PaymentForm.valid){
      let formData = new FormData()
      formData.append("order",this.order_id);
      formData.append("customer",this.customer_id);
      formData.append("order_no",this.PaymentForm.get(['orderNoFormControl']).value);
      formData.append("service_name",this.PaymentForm.get(['serviceNameFormControl']).value);
      formData.append("customer_name",this.PaymentForm.get(['customerFormControl']).value);
      formData.append("billed_amount",this.PaymentForm.get(['billedFormControl']).value);
      formData.append("balance_amount",this.PaymentForm.get(['balanceFormControl']).value);
      formData.append("payment_date",this.PaymentForm.get(['paymentdateFormControl']).value);
      formData.append("payment_amount",this.PaymentForm.get(['paymentamountFormControl']).value);
      formData.append("payment_type",this.PaymentForm.get(['paymentTypeFormControl']).value);
      formData.append("remarks",this.PaymentForm.get(['remarksFormControl']).value);
      this.paymentmoduleService.savePayment(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Payment Information saved successfully")
          this.ngOnInit();
          this.routes.navigateByUrl('/PaymentList');
        },
        (error) =>{
          this.nbtoastService.danger("Unable to save Payment information")
        }
      )
    }
  }
  updatePayment(): void {

    if (this.PaymentForm.dirty && this.PaymentForm.valid){
      let formData = new FormData()
      formData.append("order_id",this.order_id);
      formData.append("customer",this.customer_id);
      formData.append("order_no",this.PaymentForm.get(['orderNoFormControl']).value);
      formData.append("service_name",this.PaymentForm.get(['serviceNameFormControl']).value);
      formData.append("customer_name",this.PaymentForm.get(['customerFormControl']).value);
      formData.append("billed_amount",this.PaymentForm.get(['billedFormControl']).value);
      formData.append("balance_amount",this.PaymentForm.get(['balanceFormControl']).value);
      formData.append("payment_date",this.PaymentForm.get(['paymentdateFormControl']).value);
      formData.append("payment_amount",this.PaymentForm.get(['paymentamountFormControl']).value);
      formData.append("payment_type",this.PaymentForm.get(['paymentTypeFormControl']).value);
    formData.append("remarks",this.PaymentForm.get(['remarksFormControl']).value);
      this.paymentmoduleService.updatePayment(this.payment_id,formData).subscribe(
        (data) => {
          this.nbtoastService.success("Payment Information updated successfully")
          this.routes.navigateByUrl('/PaymentList');
        },
        (error) =>{
          this.nbtoastService.danger("Unable to update Payment information")
        }
      )

    }
}
get f() { return this.PaymentForm.controls; }
  onSubmit(){
    this.submitted = true;
    if (this.PaymentForm.invalid) {
        return;
    }
    if (!this.PaymentForm.invalid){
      return this.submitted = false;
    }
  }

}

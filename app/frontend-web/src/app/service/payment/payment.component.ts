import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  PaymentForm!:FormGroup;
  termsChecked: boolean = false
  Payment_Type =[
    {name:"Credit Card", value:"2"},
    {name:"Debit Card", value:"3"},
    {name:"Net Banking", value:"4"},
    {name:"UPI", value:"5"},
    // {name:"CASH", value:"1"},
  ]
  service_id: any;
  service_name: any;
  fee: any=0;
  govt_fee: any=0;
  amt: any=0;
  order_id: any;
  customer_name: any;
  order_list: any;
  today = new Date();
  lastname: any;
  phone_number: any;
  email: any;
  order_no: any;
  customer_id: any;
  payment: any;
  stateValue: any=[];
  is_learner_license: any;
  // billed_amount=0;

  constructor(
    private route: ActivatedRoute,
    // private nbtoastService: NbToastrService,
     private router: Router,
     private formBuilder: FormBuilder,
     private service: ServiceService,
     private http: HttpClient) { }

  ngOnInit(): void {
    this.order_id = this.route.snapshot.queryParams['Order'];
    this.customer_id =this.route.snapshot.queryParams['CustomerName'];
    this.stateValue = this.route.snapshot.queryParams["State"]
    console.log("this.statevalue",this.route.snapshot.queryParams["State"])
    console.log("this.statevalue1",this.stateValue)
    console.log("customer_id",this.customer_id)
    this.GetOrderlist();
    this.PaymentForm = this.formBuilder.group(
      {
      // paymentTypeFormControl:['',[]],
    })
    console.log("customer name",this.customer_name)
    this.service.getOrderById(this.order_id).subscribe(
      (data1:any)=>{    
        console.log("data1",data1)
        this.service_name= data1.service_type;
        this.service_id=data1.service;
        this.customer_id=data1.customer;
        this.customer_name=data1.customer_name;
        this.lastname=data1.customer_lastname;
        this.phone_number=data1.customer_phone;
        this.email=data1.email;
        this.order_no=data1.order_no;
        console.log("service_id",this.service_id)
        console.log("service",this.service_name)
        this.service.getServiceList(this.service_id).subscribe(
          (data:any)=>{ 
          this.is_learner_license=data.is_learner_license
          console.log("services under order",data)
          console.log("services  details",this.stateValue)
          let selected_servicelist=data.service_list1.find(e=> e.branch__state_name==this.stateValue)
          console.log("details", data.service_list1.find(e=> e.branch__state_name))
          // data.service_list1.forEach((ele:any) => {
          console.log('ele',selected_servicelist);
          this.fee=selected_servicelist.fee;
          this.govt_fee=selected_servicelist.govt_fee;
          console.log("fee",this.fee)
          console.log("govt_fee",this.govt_fee)
          this.amt=(parseFloat(selected_servicelist.fee) + parseFloat(selected_servicelist.govt_fee)).toFixed(2)
          console.log("fee details",this.amt)
          // const data='';
      // })
  }); 
  
  })
  }
  checkValue(event) {
    this.termsChecked = event.currentTarget.checked
  }
  GetOrderlist():void{
    const data = "";
    this.service.getOrderList(data).subscribe(
      (data:any) =>
    {
      this.order_list = data;
      console.log("orders list",this.order_list);
     });
  }
  savePayment():void{
    if(this.is_learner_license==true){
      if(!this.termsChecked) {
        alert("Please select checkbox to continue!")
        return
      }
    }
    let payment =
    {
      order:this.order_id,
      order_no:this.order_no,
      service_name:this.service_name,
      customer_name:this.customer_name,
      customer:this.customer_id,
      payment_date:moment(new Date(this.today)).format("YYYY-MM-DD"),
      billed_amount: this.amt,
      payment_amount:this.amt,
      balance_amount:0,
      payment_type:'Online',
      // payment_type:this.PaymentForm.controls['paymentTypeFormControl'].value,
      remarks: '',
      transaction_payload:'',
      transaction_id:'',
      transaction_timestamp:'',
      pg_gateway_response:'',
      transaction_status:''

    };
    this.service.savePayment(payment).subscribe(
      (data) => {
        console.log(data);
        this.verifyPayment(data);
        // this.payment=data.id;
        // this.router.navigateByUrl("PaymentsList?payments="+this.payment+'&State='+this.stateValue);
        // if (payment.payment_type == 1) {
        //   // this.route.navigateByUrl('OrderSummary?error=false&order_number='+res.order_number);
        //   this.router.navigate(['/OrderSummary/'], {
        //     queryParams: { error: false, order_number: data.order_no }
        //  });
         
        // }else
        {
          // this.route.navigateByUrl('payment?order_id='+res.payment_order_id + '&amount='+res.amount + '&order_number='+res.order_number);
        //   this.router.navigate(['/PaymentGateway/'], {
        //     queryParams: { order_id: data.transaction_id, amount: data.payment_amount , order_number: data.order_no }
        //  });
      
        }
      },
    );
  }
  verifyPayment(data:any): void {
    let payment_link = environment.BASE_SERVICE_URL + `/payment_service/payments/?id=${data.id}`;
     const requestData = {
      id:data.id,
      transaction_id: data.transaction_id,
      order_id: data.order,
      amount: data.payment_amount,
    };
    window.open(payment_link,'_blank')
    // this.http.post(payment_link, requestData).subscribe(
    //   (response) => {
    //     console.log('POST request successful:', response);
    //     window.open(payment_link, "_blank");
    //   },
    //   (error) => {
    //     console.error('Error while sending POST request:', error);
    //   }
    // );
  
  }
}
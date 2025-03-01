import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { PaymentModuleService } from 'src/app/payment-module/payment-module.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  Payment_List = []
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,      
      },
    columns: {
      id: {
        title: 'id',
        hide:true
      },
      order_no: {
        title: 'Order Number',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="Payment?id=${row.id}">${row.order_no}</a>`;
      }
      },
      service_name: {
        title: 'Service Name',
      },
      customer_name: {
        title: 'Customer Name',
      },
      billed_amount: {
        title: 'Billed Amount',
      },
      balance_amount: {
        title: 'Balance Amount',
      },
      payment_date: {
        title: 'Payment Date',
      },
     
      payment_amount: {
        title: 'Payment Amount',
      },
      payment_type: {
        title: 'Payment Type',
      },
      remarks : {
        title: 'Remarks',
      },
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private paymentmoduleService: PaymentModuleService,
    private nbtoastService: NbToastrService,
    private routes: Router
  ) { }

  ngOnInit(): void {
    const data = "";
    this.paymentmoduleService.getPaymentList(data).subscribe(
      (data) => {
          this.Payment_List = data;
          console.log("check data",this.Payment_List)
      },
      (error) => {
          this.nbtoastService.danger("Unable to get Payment Info",error);
      }

    )
  }

}

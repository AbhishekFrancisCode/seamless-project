import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CustomerModuleService } from '../customer-module.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  Customer_List = []
  
  settings = {
    // selectMode: 'multi',
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
      customer_type: {
        title: 'Customer Type',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="Customer?id=${row.id}">${row.customer_type}</a>`;
      }
      },
      customer_name: {
        title: 'Customer  Name',
      },
      address_line1: {
        title: 'Address Line1',
      },
      address_line2: {
        title: 'Address Line2',
      },
      phone_number : {
        title: 'Phone Number',
      },
      email : {
        title: 'Email',
      },
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private customermoduleService: CustomerModuleService,
    private nbtoastService: NbToastrService,
    private routes: Router
  ) { }

  ngOnInit(): void {
    const data = "";
    this.customermoduleService.getCustomerList(data).subscribe(
      (data) => {
          this.Customer_List = data
      },
      (error) => {
          this.nbtoastService.danger("Unable to get customer Info","Error");
      }

    )
  }

}

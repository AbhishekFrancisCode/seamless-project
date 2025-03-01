import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { count } from 'rxjs/operators';
import { OrderModuleService } from 'src/app/order-module/order-module.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  hidden=true;
  Order_List = []
  result:any=[];
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
          return `<a href="Order?id=${row.id}">${row.order_no}</a>`;
      }
      },
      order_date: {
        title: 'Order Date',
      },
      order_status: {
        title: 'Order Status',
      },   
      application_no : {
        title: 'Application Number',
      },
      order_code:{
        title:'Order Code',
      },
      service_type: {
        title: 'Service Type',
      },
      customer_name: {
        title: 'Customer Name',
      },
      customer_phone : {
        title: 'Customer Phone',
      },
      dl_number : {
        title: 'DL Number',
      },
      remarks : {
        title: 'Remarks',
      },
      billed_amount: {
        title: 'Billed Amount',
      },
    },
  };
  result1: any[];
  result2: any[];
  result3: any[];
  result4: any[];

  constructor(
    private formBuilder: FormBuilder,
    private ordermoduleService: OrderModuleService,
    private nbtoastService: NbToastrService,
    private routes: Router
  ) { }

  ngOnInit(): void {
    const data = "";
    this.ordermoduleService.getOrderList(data).subscribe(
      (data) => {
          this.Order_List = data
          this.result =this.Order_List.filter((obj) => {
            return obj.order_status === 'New';
          });
          this.result1 =this.Order_List.filter((obj) => {
            return obj.order_status === 'InProgress';
          });
          this.result2=this.Order_List.filter((obj) => {
            return obj.order_status === 'Completed';
          });
          this.result3 =this.Order_List.filter((obj) => {
            return obj.order_status === 'Hold';
          });
          this.result4 =this.Order_List.filter((obj) => {
            return obj.order_status === 'Rejected';
          });
          console.log("New count",this.result);
          console.log("Inprogress count",this.result2);
          console.log("completed",this.result3);
          console.log("Hold",this.result4);
          console.log("Rejected",this.result4);
      },
      (error) => {
          this.nbtoastService.danger("Unable to get order Info","Error");
      }
      

    )}
    New(): void {
      document.getElementById('display').style.display='visible'
      const data = "";
      this.ordermoduleService.getOrderList(data).subscribe(
        (data) => {
            this.Order_List = data
            this.result =this.Order_List.filter((obj) => {
              return obj.order_status === 'New';
            });
           
            console.log("New data ",this.result);
          
        },
        (error) => {
            this.nbtoastService.danger("Unable to get order Info","Error");
        }
  
      )}
      InProgress(): void {
        const data = "";
        this.ordermoduleService.getOrderList(data).subscribe(
          (data) => {
              this.Order_List = data
              this.result1 =this.Order_List.filter((obj) => {
                return obj.order_status === 'InProgress';
              });
             
              console.log("InProgress data ",this.result1);
            
          },
          (error) => {
              this.nbtoastService.danger("Unable to get order Info","Error");
          }
    
        )}
        Completed(): void {
          const data = "";
          this.ordermoduleService.getOrderList(data).subscribe(
            (data) => {
                this.Order_List = data
                this.result2=this.Order_List.filter((obj) => {
                  return obj.order_status === 'Completed';
                });
               
                console.log("Completed",this.result2);
              
            },
            (error) => {
                this.nbtoastService.danger("Unable to get order Info","Error");
            }
      
          )}
          Hold(): void {
            const data = "";
            this.ordermoduleService.getOrderList(data).subscribe(
              (data) => {
                  this.Order_List = data
                  this.result3 =this.Order_List.filter((obj) => {
                    return obj.order_status === 'Hold';
                  });
                 
                  console.log("Hold data ",this.result3);
                
              },
              (error) => {
                  this.nbtoastService.danger("Unable to get order Info","Error");
              }
        
            )}
            Rejected(): void {
              const data = "";
              this.ordermoduleService.getOrderList(data).subscribe(
                (data) => {
                    this.Order_List = data
                    this.result4 =this.Order_List.filter((obj) => {
                      return obj.order_status === 'Rejected';
                    });
                   
                    console.log("Rejected data ",this.result4);
                  
                },
                (error) => {
                    this.nbtoastService.danger("Unable to get order Info","Error");
                }
          
              )}     
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color, SingleDataSet, monkeyPatchChartJsTooltip, monkeyPatchChartJsLegend, BaseChartDirective } from 'ng2-charts';
// import { WarrantyService } from 'src/app/warranty/warranty.service';
import { SharedService } from '../shared.service';
import { OrderModuleService } from 'src/app/order-module/order-module.service';
import {PaymentModuleService} from 'src/app/payment-module/payment-module.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orders_data: [];
  options: any;

  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    // scales: { xAxes: [{}], yAxes: [{}] },
    // plugins: {
    //   datalabels: {
    //     anchor: 'end',
    //     align: 'end',
    //   }
    // }
  };
  barChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sept','Oct','Nov','Dec'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;

  barChartData: ChartDataSets[] = [
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: 'Sales' },
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: 'Purchase' },
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: 'Expense' }
  ];

   // Pie
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartLabels: Label[] = [['Raw Materials', 'Consumables'], ['Chemicals', 'Spares', 'Current Consumption'], 'Patterns'];
  pieChartData: SingleDataSet = [300, 500, 100];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];

  // Line
   lineChartData: ChartDataSets[] = [
    { data: [50,100,200,250,300,400,130], label: 'Daily Sales',
       },
    { data: [10,30,20,50,30,40,10], label: 'Sales Percentage',
      },
  ];
   lineChartLabels: Label[] = ['1', '2', '3', '4', '5', '6', '7'];
  // public lineChartOptions: (ChartOptions & { annotation: any }) = {
  //   responsive: true,
  // };
   lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
   lineChartLegend = true;
   lineChartType = 'line';
   lineChartPlugins = [];
   Order_List = []
   result:any=[];
   result1:any=[];
   result2:any=[];
   result3:any=[];
   result4:any=[];
  warranty_list: any;
  payment_list: any;
  poList: any;
  grnList: any;
  monthlySalesList: any;
  monthlyPurchaseList: any;
  monthlyExpenseList: any;
  payment_details: any=[];
  paymentSettings = {
    pager: {
      display: true,
      perPage: 3
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },

    columns: {
      id: {
        title: 'id',
        hide: true
      },
      order_no: {
        title: 'Order Number',
        type:'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="Order?id=${row.id}">${row.order_no}</a>`;
      }
      },
      customer_name: {
        title: 'Customer Name',
      },
      order_date:{
        title: 'Order Date',
      },
      order_status:{
        title: 'order Status',
      },
      order_code: {
        title: 'Order Code',
      },
    },
  };
  constructor(

    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    // private warrantyService: WarrantyService,
    private sharedService: SharedService,
    private ordermoduleService: OrderModuleService,
    private PaymentModuleService:PaymentModuleService,
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }

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

        })
        this.ordermoduleService.getOrderList(data).subscribe(
          (data) => {
            console.log("order data",data)
            this.payment_details=data;
          })
      // this.PaymentModuleService.getPaymentList(data).subscribe(
      //     (datas) => {
      //       datas.forEach(e=>{
      //           e.order_status= e.order_status[0].order_status
      //         e.payment_status="Not Completed"
      //         console.log("check data",datas)
      // this.PaymentModuleService.getPaymentverify(e.transaction_id).subscribe(
      //           (data) => {
      //               console.log("check data",data,data.razorpay_payment_id)
      //             if(data.payment_verified === true){
      //                 e.payment_status ="Completed" 
      //             }
      //             else 
      //             {  
      //                 e.payment_status="Not Completed"
      //             }
      //           },
      //         )
      //       })
      //       this.payment_details=datas
      //     console.log("payment details",datas)
      //     })
    // this.get_orders_data();
    // this.warrantyService.getWarrantyExpiryDetails().subscribe((data) => {
    //   this.warranty_list = data;
    // });

    // this.warrantyService.getPaymentDueDetails().subscribe((data) => {
    //   this.payment_list = data;
    // });
    this.sharedService.getDashboardPOList().subscribe((data) => {
      this.poList = data;
    })
    this.sharedService.getDashboardGrnList().subscribe((data) => {
      this.grnList = data;
    })
    this.sharedService.getDashboardSalesList().subscribe((data) => {
      this.monthlySalesList = data;
      this.monthlySalesList.forEach(element => {
        this.barChartData[0]["data"][element.month-1]=element.total_sales;
      });
      this.baseChart.ngOnChanges({});
    })
    this.sharedService.getDashboardPurchaseList().subscribe((data) => {
      this.monthlyPurchaseList = data;
      this.monthlyPurchaseList.forEach(element => {
        this.barChartData[1]["data"][element.month-1]=element.total_purchase;
      });
      this.baseChart.ngOnChanges({});
    })
    this.sharedService.getDashboardExpenseList().subscribe((data) => {
      this.monthlyExpenseList = data;
      this.monthlyExpenseList.forEach(element => {
        this.barChartData[2]["data"][element.month-1]=element.total_expense;
      });
      this.baseChart.ngOnChanges({});
    })
  }



  // get_orders_data(){
  //   const order_data  = { 'branch_id': localStorage.getItem('branch_id')}
  //   this.orderService.getOrderList(order_data).subscribe(
  //     (data) => {
  //         if(data.length > 0){
  //         this.orders_data = data;
  //         }else{
  //           this.orders_data = []
  //         }
  //     },
  //     (error) => {
  //         this.nbtoastService.danger(error.error.detail);
  //     }
  //   )
  // }


}

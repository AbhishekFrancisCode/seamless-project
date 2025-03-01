import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as crypto from 'crypto';
import { ServiceService } from '../service.service';
import { WindowRefService } from '../../window-ref.service';
import { environment } from 'src/environments/environment';
// declare const Buffer

@Component({
  selector: 'app-payment-razor-gateway ',
  templateUrl: './payment-razor-gateway.component.html',
  styleUrls: ['./payment-razor-gateway.component.css'],
  providers: [WindowRefService]
})
export class PaymentRazorGatewayComponent implements OnInit {

  order_id: any;
  user_name: string;
  email: string;
  phone_number: string;
  amount: any;
  order_number: any;
  
 
  constructor(private route: ActivatedRoute,
              private service: ServiceService,
              private winRef: WindowRefService,
              private zone: NgZone,
              private router: Router,
              ) { }

              ngOnInit() {
                this.user_name = '';
                this.email = '';
                this.phone_number = '';
                this.createRzpayOrder();
            
            
              }
            
              createRzpayOrder( ) {
                console.log( );
                this.order_id = this.route.snapshot.queryParams["order_id"];
                this.amount = this.route.snapshot.queryParams["amount"];
                this.order_number = this.route.snapshot.queryParams["order_number"];
                this.payWithRazor(this.order_id);
              }
            
              payWithRazor(val) {
                // alert(this.amount );
                const options: any = {
                  key: environment.RAZORPAY_ID,
                  amount: this.amount + '00', // amount should be in paise format to display Rs 1255 without decimal point
                  currency: 'INR',
                  name: 'SEAMLESS ONLINE SERVICES', // company name or product name
                  description: '',  // product description
                  image: '/assets/img/logo.png', // company logo or product image
                  order_id: val, // order_id created by you in backend
                  modal: {
                    // We should prevent closing of the form when esc key is pressed.
                    escape: false,
                  },
                  prefill: {
                    name: this.user_name,
                    email: this.email,
                    contact: this.phone_number
                  },
                  notes: {
                    // include notes if any
                  },
                  theme: {
                    color: '#0c238a'
                  }
                };
                console.log(options)
                options.handler = ((response, error) => {
                  options.response = response;
                  console.log(response);
                  console.log(options);
                let eee = options.prefill.email
                  console.log(options.prefill.email)
                  // call your backend api to verify payment signature & capture transaction
                  this.service.verifyPaymentRazorPay(options).subscribe(
                    (data) =>{
            
                      // this.router.navigateByUrl('OrderSummary?error=false&order_number='+this.order_number);
                      // window.location.href='OrderSummary?error=false&order_number='+this.order_number;
                      // this.router.navigateByUrl('OrderSummary?error=false&order_number='+ this.order_number);
                      this.zone.run(() => {
                      this.router.navigate(['/OrderSummary'], {
                        queryParams: { error: false, order_number: this.order_number }
                     });
                    });
            
                    },
                    (error) => {
                      // this.router.navigateByUrl('OrderSummary?error=true&order_number='+ this.order_number);
                    //  window.location.href='OrderSummary?error=true&order_number='+ this.order_number;
                  // this.router.navigateByUrl('OrderSummary?error=true&order_number='+ this.order_number);
                    this.zone.run(() => {
                     this.router.navigate(['/OrderSummary'], {
                        queryParams: { error: true, order_number: this.order_number }
                     });
                    });
                    }
                  )
                });
                options.modal.ondismiss = (() => {
                  // handle the case when user closes the form while transaction is in progress
                  console.log('Transaction cancelled.');
                  // window.location.href='OrderSummary?error=true&order_number='+ this.order_number;
                  // this.router.navigateByUrl('OrderSummary?error=true&order_number='+ this.order_number);
                  this.zone.run(() => {
                  this.router.navigate(["/OrderSummary"], {
                    queryParams: { error: true, order_number: this.order_number }
                 });
                });
                });
                const rzp = new this.winRef.nativeWindow.Razorpay(options);
                rzp.open();
              }
 

}

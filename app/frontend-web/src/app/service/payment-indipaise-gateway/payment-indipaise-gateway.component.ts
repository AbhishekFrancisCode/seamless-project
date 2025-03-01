import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as crypto from 'crypto';
import { ServiceService } from '../service.service';

// declare const Buffer

@Component({
  selector: 'app-payment-indipaise-gateway',
  templateUrl: './payment-indipaise-gateway.component.html',
  styleUrls: ['./payment-indipaise-gateway.component.css']
})
export class PaymentIndipaiseGatewayComponent implements OnInit {

  gatewayId= ''
  amount=''
  referenceId=''
  
  msg_digest_string =''

  secretKey = ''
  payment_id: any;

  constructor(private route: ActivatedRoute,private service: ServiceService) { }

  ngOnInit(): void {
    this.payment_id = this.route.snapshot.queryParams['ref_id'];
    if(this.payment_id){
      let data = {payment_id:this.payment_id}
      this.service.getPaymentInfo(data).subscribe(
        (data) => {
          this.gatewayId = data.gatewayId
          this.amount = data.amount
          // this.secretKey = data.secretKey
          this.referenceId = this.payment_id
          this.msg_digest_string = data.signature
        },
        (error) =>{

        }
      )
    }
    
    this.msg_digest_string = this.signKey(this.secretKey,this.msg_digest_string)
  }

  signKey (clientKey: string, msg: string) {
    const key = Buffer.from(clientKey, 'hex');
    console.log(key);
    return crypto.createHmac('sha256', key).update(msg).digest('hex');
}

}

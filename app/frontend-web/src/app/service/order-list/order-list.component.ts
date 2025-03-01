import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  order_list:any=[];
  payment_id: any;
  service_name: any;
  constructor(
    private route: ActivatedRoute,
    private Service:ServiceService,
    private router:Router,
    private formBuilder: FormBuilder,
    private service: ServiceService
  ) { }

  ngOnInit():void {
    this.payment_id = this.route.snapshot.queryParams["payments"];
    
  }
}

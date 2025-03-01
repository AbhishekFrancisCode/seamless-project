import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  // servicelist: any=[];
  // service_name: any;
  // service_Description: any;
  constructor( 
    // private Service:ServiceService,
    // private route:Router,

  ) { }

  ngOnInit(): void {
    // this.GetServicelist();
  }
  // GetServicelist(){
  //   const data = "";
  //   this.Service.getService().subscribe(
  //     (data:any) =>
  //   {
  //     this.servicelist = data;
  //     console.log("detals data",this.servicelist);
  //    });
  // }
}

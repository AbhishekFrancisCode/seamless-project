import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute } from "@angular/router";
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-service-show',
  templateUrl: './service-show.component.html',
  styleUrls: ['./service-show.component.css']
})
export class ServiceShowComponent implements OnInit {
  servicelist: any = []
  checkCategory: any
  category_Name: string
  stateValue: string

  isAuthenticated = false;
  service_id: any=[];
  category_service_list: any=[];
  service_category_name: any;


  constructor(
    private service: ServiceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.GetServicelist()
    // this.triggerClick();
    this.category_Name = this.route.snapshot.queryParams["ServiceName"]
    this.stateValue = this.route.snapshot.queryParams["Select"]    
    // console.log(this.category_Name, this.stateValue)
    this.checkLogin()
    

  }

  GetServicelist() {
    const data = '';
    this.service.getServicelist().subscribe(
      (data1: any) => {
        console.log("check data",data1)
        var datas = data1.filter( x => x.category_name === this.category_Name)
        console.log("data details",datas)
        this.servicelist = datas
        console.log("category wise services",this.servicelist)
        this.service_category_name=this.servicelist[0].category_name
        console.log("category name",this.service_category_name)
        this.category_service_list=this.servicelist[0].service_list1
        console.log("sub category name",this.category_service_list)
      }
    )
  }

  getServiceOnly(data: any) {
    if(this.category_Name === data) {
      // this.checkCategory = true
      return true 
    } else {
      // this.checkCategory = false
      return false
    }
  }

  checkLogin() {
    if(localStorage.getItem("accessToken")){
        this.isAuthenticated = true;
        console.log(this.isAuthenticated)
        // return true;
    }else{
      // alert("Login is required");
      //  this.router.navigateByUrl("/ServiceList");
      this.isAuthenticated = false;
      console.log(this.isAuthenticated)
      // return false;
    }
  }
  service_cat(data){
    console.log("data service",data)
    this.service_id=data


  }
  

}

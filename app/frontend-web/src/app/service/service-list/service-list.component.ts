import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { environment } from 'src/environments/environment';
// import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  servicelist:any=[];
  arrayCreation: any=[];
  service_name: any;
  service_Description: any;
  obj = {}
  result: any = []
  selectValue: string = ''
  isAuthenticated = false;
  VRS: boolean;
  DLRS: boolean;
  others: boolean;
  other_category: any=[];
  primary_service: any=[];
  secondary_service: any=[];

  constructor(
    private Service:ServiceService,
    private route:Router,
  ) { }

  ngOnInit(): void {
    this.GetServicelist();
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    this.checkLogin()
  }
  GetServicelist(){
    const data = "";
    this.Service.getService().subscribe(
      (data:any) =>{
      // this.servicelist = data;
        let activelist=data.filter(a=>{
          if(a.active){
            return a;
          }
        })       
      this.servicelist=activelist;
      console.log("details",this.servicelist);
     });
  }

  unique () {
    this.servicelist.forEach((item, i) => {
      this.obj[item['category_name']] = i
    })
    // console.log(this.obj)    

    for(let key in this.obj) {
      let index = this.obj[key]
      // console.log(index)
      this.result.push(this.servicelist[index])
      this.result.forEach(e=> {
        if(e.category__service_type === 'Primary Service'){
          this.VRS=true
          console.log("primary",e)
          this.primary_service.push(e)
          const key='category_name'
          const dataUniqueByKey = [...new Map(this.primary_service.map(item =>
            [item[key], item])).values()];
            this.primary_service=dataUniqueByKey
          console.log("primary",this.primary_service)

        }
        if(e.category__service_type === 'Secondary Service'){
          // this.VRS=true
          console.log("primary",e)
          this.secondary_service.push(e)
          const key='category_name'
          const dataUniqueByKey = [...new Map(this.secondary_service.map(item =>
            [item[key], item])).values()];
            this.secondary_service=dataUniqueByKey
          console.log("secondary",this.secondary_service)

        }
        // if(e.category_name === 'Vehicle Related Services'){
        //   this.VRS=true

        // }
        // else if(e.category_name === 'Driving License Related Services'){
        //   this.DLRS=true
        // }
      
      })
        console.log("others value",this.other_category)
    }
    this.result.forEach(e=> {
      if(e.category_name !== 'Driving License Related Services' && e.category_name !== 'Vehicle Related Services'){
        this.others=true
        this.other_category.push(e)
      }
    })
    // this.result.forEach(e=> {
    //   if(e.category_name !== 'Primary Service' && e.category_name !== 'Secondary Service'){
    //     this.others=true
    //     this.other_category.push(e)
    //   }
    // })
    console.log("result", this.result)
    // console.log("primary services",this.result)
  }

  reset () {
    this.result = [] 
    this.other_category=[]

  }

  selectChangeHandler (event: any) {
    this.selectValue = event.target.value
    // console.log(this.selectValue)
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

}

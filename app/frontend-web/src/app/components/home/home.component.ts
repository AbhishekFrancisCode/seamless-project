import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  servicelist: any = []
  result: any = []
  obj = {}
  selected_category: any;
  go_disable: boolean=true;
  VRS:any=[];
  services:any=[];
  servicelist_details: any=[];
  DLRS:any=[];
  others: boolean;
  other_category: any=[];
  vrs_category: any=[];
 dlrs_category:any=[];
  constructor(
    private Service: ServiceService
  ) { }

  ngOnInit(): void {
    this.GetServiceList()
  }

  GetServiceList () {
    const data = []
    this.Service.getService().subscribe(
      (data: any) => {
        let activelist=data.filter(a=>{
          if(a.active){
            return a;
          }
        })       
      this.servicelist=activelist;


    
      //   if(e.category_name === 'Vehicle Related Services'){
      //     this.VRS=true

      //   }
      //   else if(e.category_name === 'Driving License Related Services'){
      //     this.DLRS=true
      //   }
      
      // })
        // this.servicelist = data
        console.log('home', this.servicelist)
      }
      
    )
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
        if(e.category_name === 'Vehicle Related Services' || e.category_name === 'Driving License Related Services' ){
          this.vrs_category.push(e)
          const key='category_name'
          const dataUniqueByKey = [...new Map(this.vrs_category.map(item =>
            [item[key], item])).values()];
            this.vrs_category=dataUniqueByKey
     
        }
        console.log(" vrs result", this.vrs_category)
      })
      this.result.forEach(e=> {
        if(e.category_name !== 'Driving License Related Services' && e.category_name !== 'Vehicle Related Services'){
          this.other_category.push(e)
          const key='category_name'
          const dataUniqueByKey = [...new Map(this.other_category.map(item =>
            [item[key], item])).values()];
            this.other_category=dataUniqueByKey
        }
        console.log("others result", this.other_category)
      })
      console.log("result", this.result)
    }
  }

  reset() {
    this.result = []
  }
  categories(data:any){
    console.log(data)
    if(data == 'Select a Category' || data ==''){
      this.go_disable=true
    }
    else{
      this.selected_category=data;
      console.log("selected category",this.selected_category)
      this.go_disable=false
    }
  }
}

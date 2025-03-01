import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { OrderModuleService } from 'src/app/order-module/order-module.service';
import { CustomerModuleService } from 'src/app/customer-module/customer-module.service';
import { ServiceModuleService } from 'src/app/service-module/service-module.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { AdminService } from 'src/app/admin/admin.service';
import { getWeekYearWithOptions } from 'date-fns/fp';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  OrderForm: FormGroup;
  createFlag = true;
  imgSrcFileExist:boolean=false;
  state:any=[]
  array: any = [];
  array1: any = [];
  array2: any = [];
  // state:{name:string,value:string}[] =[
  //   {name:"Andaman and Nicobar Islands", value:"35"},
  //   {name:"Andhra Pradesh", value:"28"},
  //   {name:"Andhra Pradesh (New)", value:"37"},
  //   {name:"Arunachal Pradesh", value:"12"},
  //   {name:"Assam ", value:"18"},
  //   {name:"Bihar", value:"10"},
  //   {name:"Chandigarh ", value:"04"},
  //   {name:"Chattisgarh ", value:"22"},
  //   {name:"Dadra and Nagar Haveli", value:"26"},
  //   {name:"Daman and Diu", value:"25"},
  //   {name:"Delhi", value:"07"},
  //   {name:"Goa", value:"30"},
  //   {name:"Gujarat", value:"24"},
  //   {name:"Haryana", value:"06"},
  //   {name:"Himachal Pradesh", value:"02"},
  //   {name:"Jammu and Kashmir", value:"01"},
  //   {name:"Jharkhand", value:"20"},
  //   {name:"Karnataka", value:"29"},
  //   {name:"Kerala", value:"32"},
  //   {name:"Lakshadweep Islands", value:"31"},
  //   {name:"Madhya Pradesh", value:"23"},
  //   {name:"Maharashtra", value:"27"},
  //   {name:"Manipur", value:"14"},
  //   {name:"Meghalaya", value:"17"},
  //   {name:"Mizoram", value:"15"},
  //   {name:"Nagaland", value:"13"},
  //   {name:"Odisha", value:"21"},
  //   {name:"Pondicherry", value:"34"},
  //   {name:"Punjab", value:"03"},
  //   {name:"Rajasthan", value:"08"},
  //   {name:"Sikkim", value:"11"},
  //   {name:"Tamil Nadu", value:"33"},
  //   {name:"Telangana", value:"36"},
  //   {name:"Tripura", value:"16"},
  //   {name:"Uttar Pradesh ", value:"09"},
  //   {name:"Uttarakhand", value:"05"},
  //   {name:"West Bengal", value:"19"},
  // ]
  stateCode:any;
  selectedFiles:any=[];
  selected_service:any=[];
  submitfile:boolean=true
  Order_Status =[
    {value:"New", name:"New"},
    {value:"DR", name:"Document Review"},
    {value:"DV", name:"Document Verified"},
    {value:"AS", name:"Application Submitted"},
    {value:"InProgress", name:"In Progress"},
    {value:"AP", name:"Application Processed"},
    {value:"DD", name:"Document Dispatched"},
    {value:"Completed", name:"Completed"},
    {value:"Hold", name:"Hold"},
    {value:"Rejected", name:"Rejected"},
    {value:"UQ", name:"Under Query"},
  ]
  cityname= localStorage.getItem('branch_city');
  statename= localStorage.getItem('state_name');
  orderMakerFile=[];
  imgSrcOrderMaker:String;
  url = `${environment.BASE_SERVICE_URL}/`;
  submitted: boolean;
  active =true;
  customer_list: any;
  searchCustomer: string;
  customer_object: any;
  dailog_ref: any;
  order_id: any;
  customer_name: any;
  customer_phone: any;
  id: any;
  customer_id: any;
 
  imgSrc: string;
  service_list: any[];
  searchService: string;
  service_id: any;
  service_name: any;
  service_type: any;
  selected_service_list: any=[];
  service_lists: any;
  document_name: any;
  imageUrl: string;
  OrderMakerFileName:String;
  OrderInhouseFileName:String;
  imgSrcINhouse:String;
  OrderInhouseFileExist:boolean=false;
  OrderMakerFileExist:boolean=false;
  imgSrcOrderPicture:String;
  OrderPictureFileName:String;
  orderPictureFile;
  orderInhouseFile=[];
  OrderPictureFileExist:boolean=false;
  service_list2: any;
  orderFileUrl: any;
  orderPictureFileName: any;
  order_details: any=[];
  order: any;
  order_maker_file: any=[];
  list: any;
  order_documents: any;
  additional_amount: any=0;
  bill_value: any;
  branch_list: any=[];
  customer_city: any=[];
  customer_details: any=[];
  branch_city: any=[];
  city: any=[];
  branch_array: any=[];
  service_amount: any;
  service_detail: any=[];
  value: any=[];
  selectedState_value: any=[];
  selected_district: any=[];
  selected_taluq_pincode: any=[];
  selected_taluq: any=[];
  states: any=[];
  current_date: any;
  order_status_history: any=[];
  history_exists: boolean;
  default_branch: any=[];
  city_datas: any;
  history: any=[];
  constructor(
    private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private routes: Router,
    private ordermoduleService: OrderModuleService,
    private customermoduleService: CustomerModuleService,
    private servicemoduleService: ServiceModuleService,
    private dialogservice: NbDialogService,
    private route: ActivatedRoute,
    private adminService: AdminService,
  ) { }
  
  load_city(val){
    this.ordermoduleService.gettaluqlist(val).subscribe((data:any)=>{
      this.selected_taluq=data
      console.log("selecxted", this.selected_taluq)
    })
  }
  load_pincodes(item){
    this.ordermoduleService.pincodeslist(item).subscribe((data:any)=>{
      this.selected_taluq_pincode=data
      console.log("load pincodes",this.selected_taluq_pincode)
     
    })
  }
  ngOnInit(): void {
    const today = new Date()
    this.current_date=today.toLocaleString();
    console.log("iso time",this.current_date)
    console.log("date format",today)
    console.log("url",this.url)
    this.OrderForm = this.formBuilder.group(
      {
        orderNoFormControl : ['',[]],
        orderdateFormControl:[moment(new Date(today)).format("DD-MM-YYYY")],
        // orderdateFormControl:[today.toISOString()],
        orderstatusFormControl:['',[Validators.required]],
        servicetypeFormControl:['',[Validators.required]],
        customernameFormControl:['',[Validators.required]],
        customerphoneFormControl:['',[Validators.required]],
        applicationnoFormControl:['',[]],
        dlnumberFormControl:['',[]],
        remarksFormControl:['',[]],
        billedamountFormControl:['',[]],
        orderActivateFormControl:['',[]],
        addchargeFormControl:['',[]],
        OrderCodeFormControl:['',[]],
        lastnameFormControl:['',[]],
        emailFormControl:['',[Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        adarFormControl:['',[Validators.required,Validators.minLength(12), Validators.pattern('[0-9]{12}')]],
        address1FormControl:['',[Validators.required]],
        address2FormControl:['',[]],
        stateFormControl:['',[Validators.required]],
        districtFormControl:['',[Validators.required]],
        cityFormControl:['',[Validators.required]],
        pincodeFormControl:['',[Validators.required]],
      }
    )
    console.log("new date",today.toISOString, "date val",this.OrderForm.get(['orderdateFormControl']).value)
  
    console.log("branch city names",this.cityname)
    console.log("branch state names",this.statename)
    this.load_customer_list();
    this.load_service_list();
    this.order_id = this.route.snapshot.queryParams["id"];
    if(this.order_id){
      this.createFlag = false;
      this.ordermoduleService.getOrderById(this.order_id).subscribe(
        (data) => {
          this.submitfile=false
          console.log("check order",data)
          this.customer_id = data.customer;
          this.customer_city=data.state;
          this.service_id = data.service;
          this.OrderForm.controls['orderNoFormControl'].setValue(data.order_no);
          this.OrderForm.controls['OrderCodeFormControl'].setValue(data.order_code);
          this.OrderForm.controls['orderdateFormControl'].setValue(data.order_date);
          this.OrderForm.controls['orderstatusFormControl'].setValue(data.order_status);
          this.OrderForm.controls['servicetypeFormControl'].setValue(data.service_type);
          this.OrderForm.controls['customernameFormControl'].setValue(data.customer_name);
          this.OrderForm.controls['customerphoneFormControl'].setValue(data.customer_phone);
          this.OrderForm.controls['lastnameFormControl'].setValue(data.customer_lastname);
          this.OrderForm.controls['emailFormControl'].setValue(data.email);
          this.OrderForm.controls['adarFormControl'].setValue(data.adharno);
          this.OrderForm.controls['address1FormControl'].setValue(data.address1);
          this.OrderForm.controls['address2FormControl'].setValue(data.address2);
          this.OrderForm.controls['stateFormControl'].setValue(data.state);
          console.log("ditrsict name",data.district)
          this.load_districts(data.state);
          console.log("load districts", this.selected_district)
          this.OrderForm.controls['districtFormControl'].setValue(data.district);
          this.load_city(data.district);
          this.OrderForm.controls['cityFormControl'].setValue(data.city);
          this.load_pincodes(data.city);
          console.log("data pinode",data.pincode )
          this.service_amount=data.billed_amount-data.additional_charges;
          this.OrderForm.controls['pincodeFormControl'].setValue(data.pincode);
          this.OrderForm.controls['applicationnoFormControl'].setValue(data.application_no);
          this.OrderForm.controls['dlnumberFormControl'].setValue(data.dl_number);
          this.OrderForm.controls['remarksFormControl'].setValue(data.remarks);
          this.OrderForm.controls['billedamountFormControl'].setValue(data.billed_amount);
          this.OrderForm.controls['addchargeFormControl'].setValue(data.additional_charges);
          this.OrderForm.controls['orderActivateFormControl'].setValue(data.active);
          data.order_details.forEach(element => {
            this.selected_service_list.push(
              {
                id:element.id,
                document_name:element.file__document_name,
                file: element.order_maker_file,
                file_name: element.file_name,
              }
            )
            data.order_details.forEach(ele => {
            if (ele.file__document_name == "") {
              this.document_name = this.url + 'media/nofile.png' 
            }
            else {
              let namePath = ele.file__document_name
              this.document_name= ele.file__document_name
              console.log("loaded file", this.document_name)
              this.imgSrcFileExist=true;  
            }
          })
        });
           },
        (error) =>{
          this.nbtoastService.danger("Unable to get Order Information")
      }
    )}
    this.ordermoduleService.getStateslist().subscribe(
      (data:any)=>{   
        console.log("states json data",data)
        this.states=data
        console.log("data states",this.states)
        console.log('selected state',this.OrderForm.controls['stateFormControl'].value)
        this.selectedState_value=this.OrderForm.controls['stateFormControl'].value;
       })
       this.ordermoduleService.orderStatusList(this.order_id).subscribe(
        (data:any)=>{
          console.log("data",data)
          this.history=data
        })
  }
  
  load_districts(item){
  this.ordermoduleService.getDistrictslist(item).subscribe((data:any)=>{
    this.selected_district=data
    this.history_exists=true
  })
}
  orderStatusList(){
    this.ordermoduleService.orderStatusList(this.order_id).subscribe(
      (data:any)=>{
        console.log("data",data)
        this.order_status_history=data
        if(this.order_status_history.length != 0)
        {
          this.history_exists=true
          console.log("order status history",data.length)
        }
      })

  }
  load_district(item){
    const val=item.split(': ')
    console.log("state data splitted",val)
    console.log("state data",item)
    this.ordermoduleService.getDistrictslist(val[1]).subscribe((data:any)=>{
     console.log("district data",data)
     this.selected_district=data;
    })
//   this.service.getServiceList(this.service_id).subscribe(
//     (data1:any)=>{    
//       console.log("data1",data1)
//       this.selected_service_amount=data1.service_list1
//       this.service_name= data1.service_name;
//       this.service_desc =data1.desc;
//       console.log("service",this.service_name)
//       data1.service_list2.forEach((element:any) => {
//         console.log('elets',element);
//         this.selected_service_list.push({
//           document_name:element.document_name,
//           id:element.id,
//           is_mandatory:element.is_mandatory,
//         })
//         console.log('selected_service',this.selected_service_list);
//         // data1.service_list1.forEach((ele:any) => {
//         //   let selected_servicelist=data1.service_list1.find(e=> e.branch__state_name==this.selectValue)
//         //   console.log('ele details',selected_servicelist);
//         //   this.fee=selected_servicelist.fee;
//         //   this.govt_fee=selected_servicelist.govt_fee;
//         //   console.log("fee",this.fee)
//         //   console.log("govt_fee",this.govt_fee)
//         //   this.amt=(parseInt(selected_servicelist.fee) + parseInt(selected_servicelist.govt_fee))
//         //   console.log("fee details",this.amt)
//         //   //  this.amt=(parseInt(ele.fee)  + parseInt(ele.govt_fee))
//         //   // console.log("fee details",this.amt)
//         //   // console.log("amount",this.amt)
//         // })
// })
    
//    });
}

load_taluqlist(ele){
  const val=ele.split(': ')
  this.ordermoduleService.gettaluqlist(val[1]).subscribe((datas:any)=>{
    console.log("district data",datas)
    this.selected_taluq=datas;
    // this.load_pincodeslist(ele);
   })

}
load_pincodeslist(ele){
  const val=ele.split(': ')
  this.ordermoduleService.pincodeslist(val[1]).subscribe((datas:any)=>{
    console.log("pincode data",datas)
    this.selected_taluq_pincode=datas;
    // this.OrderForm.controls['pincodeFormControl'].setValue(datas)
  })
}
  load_customer_list():void{
    const data = "";
    this.customermoduleService.getCustomerList(data).subscribe(
      (data)=>{
        let activelist=data.filter(a=>{
          if(a.active){
            return a;
          }
        })       
      this.customer_list=data;
      console.log("customer details",this.customer_list)
      },
      (error) => {
        this.nbtoastService.danger(error);
      }
    )
  }
  add_items(){
    this.submitted = false;
    const data = {
      order:this.order_id,
      order_maker_file:this.selectedFiles,
    }
   
    this.order_details.push(data)
    console.log("file",this.order_details)
  
  }
  onchange(){
    this.bill_value=this.OrderForm.controls['billedamountFormControl'].value;
    this.additional_amount = this.OrderForm.get('addchargeFormControl').value;
    let amount= parseInt(this.bill_value) + parseInt(this.additional_amount)
    this.OrderForm.controls['billedamountFormControl'].setValue(amount)
    console.log("additional amount",this.additional_amount)
    console.log("bill value",this.bill_value)
    console.log("Total amount",amount)
  }
  onChangetaluq(ele:any){
    const val=ele.split(': ')
    console.log("selected taluq",ele)
    this.load_pincodeslist(ele);
  
  }
  onChangecity(element:any){
    console.log("selected district",element)
    const val=element.split(': ')
    this.load_taluqlist(element);
    // this.citypincodes.filter(e=>e.districtName==
  // console.log("city value",data)
  }
  onChange(data:any){

    console.log("state name",data)
    this.load_district(data)
  }
  
  load_service_list():void{
    this.servicemoduleService.getService().subscribe(
      (data2)=>{    
        let data=data2.filter(a=>{
          if(a.active){
            return a;
          }
         })
         this.service_list = data;
      // this.service_list=data;
      console.log("service details",this.service_list)
      
      },
      (error) => {
        this.nbtoastService.danger(error);
      }
    )
  }
  open_customer_dialog(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogservice.open(dialog, { context: this.customer_list })
      .onClose.subscribe(data => {
        this.searchCustomer='';
        this.customer_id=data.id;
        this.customer_name=data.customer_name;
        this.OrderForm.controls['customernameFormControl'].setValue(data.customer_name)
        this.OrderForm.controls['customerphoneFormControl'].setValue(data.phone_number)
        this.customermoduleService.getCustomerList(this.customer_id).subscribe(
          (data)=>{
            this.customer_details=data
            // this.customer_city=this.customer_details.address_line1    
          console.log("customer details BY id",this.customer_details)
          console.log("customer city BY id",this.customer_city)
          },
          (error) => {
            this.nbtoastService.danger(error);
          }
        )
        const data1 = "";
        this.adminService.getBranch(data1).subscribe(
          (data1) => {
              this.branch_list = data1
              console.log("Branch List",this.service_detail,this.customer_city)
          },
          (error) => {
              this.nbtoastService.danger("Unable to get branch Info","Error");
          }
    
        )
      }
      );
  }
  getOrderCode():void {
  };
  open_service_dialog(dialog: TemplateRef<any>) {
      this.selected_service_list=[];
      this.dailog_ref = this.dialogservice.open(dialog, { context: this.service_list })
      .onClose.subscribe(data => {
        this.searchService='';
        this.service_id = data.id;
        this.OrderForm.controls['servicetypeFormControl'].setValue(data.service_name)
        this.customer_city=this.OrderForm.controls['stateFormControl'].value;
        console.log("customer city state values",this.customer_city)
        this.servicemoduleService.getServiceList(this.service_id).subscribe(
          (data1)=>{    
            console.log("data1",data1)
            this.selected_service=data1;
            this.service_detail=this.selected_service.service_list1;
      console.log("service child table",this.service_detail)
      // var datas = this.service_detail.find( x => x.branch_name === this.statename)
      // console.log("Branchcity1",datas);
      // this.value=[datas];
      console.log("Branchcity amount",this.value);
      var city_datas = this.service_detail.find(x => x.branch__state_name === this.customer_city)
      console.log("Branch City details",city_datas);
      this.city=[city_datas];
      console.log("City",this.city);
       console.log("Customer City details",this.customer_city);
            data1.service_list2.forEach(element => {
              console.log('elets',element);
              this.selected_service_list.push({
                document_name:element.document_name,
                id:element.id,
                is_mandatory:element.is_mandatory,
              })
            })
              console.log('ele',this.city);
              this.city.forEach(ele => {
                console.log('ele',ele);
                // this.branch_array=ele
                let amt=(parseFloat(ele.fee)  + parseFloat(ele.govt_fee)).toFixed(2);
                console.log("fee details",amt)
                this.OrderForm.controls['billedamountFormControl'].setValue(amt);
                this.service_amount=amt;
            })
        this.add_items();
          },
        )
      });
  }
  saveOrder():void{
    this.submitted = true; 
       this.selected_service_list.forEach(ele=>{
        if (ele.is_mandatory) {
          this.array.push(ele.id)
        }
        console.log("order ele",ele)
        console.log("order ele1",ele.is_mandatory)
        this.array1 = []
        this.selectedFiles.forEach(element => {
          this.array1.push(element.file_id)
          console.log('file', element);
        });
      })  
    console.log('id', this.array, this.array1)
    this.array2 = []
    this.array1.forEach(ele => {
      this.array.forEach(element => {
        if (ele == element) {
          this.array2.push(element)
        }
      });
    });
    console.log('check', this.array2.length == this.array.length)
    if (this.array2.length != this.array.length) {
      alert("please upload mandatory file ");
      return ;     
    } 
    if (this.OrderForm.dirty && this.OrderForm.valid){
      let formData = new FormData()
      let file_ok:any = true;
      if (this.order_id){
        formData.append("id", this.order_id)
      }
      formData.append("customer_id",this.customer_id);
      formData.append("service_id",this.service_id);
      formData.append("order_code",this.OrderForm.get(['OrderCodeFormControl']).value);
      formData.append("order_no",this.OrderForm.get(['orderNoFormControl']).value);
      formData.append("order_date",this.OrderForm.get(['orderdateFormControl']).value);
      formData.append("order_status",this.OrderForm.get(['orderstatusFormControl']).value);
      formData.append("service_type",this.OrderForm.get(['servicetypeFormControl']).value);
      formData.append("customer_name",this.OrderForm.get(['customernameFormControl']).value);
      formData.append("customer_phone",this.OrderForm.get(['customerphoneFormControl']).value);
      formData.append("customer_lastname",this.OrderForm.get(['lastnameFormControl']).value);
      formData.append("email",this.OrderForm.get(['emailFormControl']).value);
      formData.append("adharno",this.OrderForm.get(['adarFormControl']).value);
      formData.append("address1",this.OrderForm.get(['address1FormControl']).value);
      formData.append("address2",this.OrderForm.get(['address2FormControl']).value);
      formData.append("state",this.OrderForm.get(['stateFormControl']).value);
      formData.append('district',this.OrderForm.get(['districtFormControl']).value);
      formData.append("city",this.OrderForm.get(['cityFormControl']).value);
      formData.append("pincode",this.OrderForm.get(['pincodeFormControl']).value);
      formData.append("application_no",this.OrderForm.get(['applicationnoFormControl']).value);
      formData.append("dl_number",this.OrderForm.get(['dlnumberFormControl']).value);
      formData.append("remarks",this.OrderForm.get(['remarksFormControl']).value);
      formData.append("billed_amount",this.OrderForm.get(['billedamountFormControl']).value);
      formData.append("additional_charges",this.OrderForm.get(['addchargeFormControl']).value);
      formData.append("active",this.OrderForm.get(['orderActivateFormControl']).value);
      formData.append('order_documents', JSON.stringify(this.selectedFiles));
        if(this.selectedFiles){
          for(let i=0 ; i <this.selectedFiles.length ; i++)
            formData.append('order_maker_file[]', this.selectedFiles[i].file,this.selectedFiles[i].file_name);
        }
      
      console.log("image ",this.selectedFiles)
      this.ordermoduleService.saveOrder(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Order Information saved successfully")
          this.ngOnInit();
          this.routes.navigateByUrl('/OrderList');
        }, 
        (error) =>{
          this.nbtoastService.danger("Unable to save Order information")
        }
      )
    }
  }
  delete_document(item){
    const index: number = this.order_documents.indexOf(item);
    if (index !== -1) {
      if(item.id){
        
        const formData = new FormData()
        formData.append('id', item.id);
      this.ordermoduleService.removeFromDocumentList(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Row deleted from List Successfully")
          this.order_documents.splice(index, 1);
        },
        (error) => {
          this.nbtoastService.danger(error.detail);
        }
      );
      }
      else{
        this.order_documents.splice(index, 1);
      }

    }
  }
  updateOrder():void{
    if (this.OrderForm.dirty && this.OrderForm.valid){
      let formData = new FormData()
      formData.append("customer_id",this.customer_id);
      formData.append("service_id",this.service_id);
      formData.append("order_code",this.OrderForm.get(['OrderCodeFormControl']).value);
      formData.append("order_no",this.OrderForm.get(['orderNoFormControl']).value);
      formData.append("order_date",this.OrderForm.get(['orderdateFormControl']).value);
      formData.append("order_status",this.OrderForm.get(['orderstatusFormControl']).value);
      formData.append("service_type",this.OrderForm.get(['servicetypeFormControl']).value);
      formData.append("customer_name",this.OrderForm.get(['customernameFormControl']).value);
      formData.append("customer_phone",this.OrderForm.get(['customerphoneFormControl']).value);
      formData.append("customer_lastname",this.OrderForm.get(['lastnameFormControl']).value);
      formData.append("email",this.OrderForm.get(['emailFormControl']).value);
      formData.append("adharno",this.OrderForm.get(['adarFormControl']).value);
      formData.append("address1",this.OrderForm.get(['address1FormControl']).value);
      formData.append("address2",this.OrderForm.get(['address2FormControl']).value);
      formData.append("state",this.OrderForm.get(['stateFormControl']).value);
      formData.append('district',this.OrderForm.get(['districtFormControl']).value);
      formData.append("city",this.OrderForm.get(['cityFormControl']).value);
      formData.append("pincode",this.OrderForm.get(['pincodeFormControl']).value);
      formData.append("application_no",this.OrderForm.get(['applicationnoFormControl']).value);
      formData.append("dl_number",this.OrderForm.get(['dlnumberFormControl']).value);
      formData.append("remarks",this.OrderForm.get(['remarksFormControl']).value);
      formData.append("billed_amount",this.OrderForm.get(['billedamountFormControl']).value);
      formData.append("additional_charges",this.OrderForm.get(['addchargeFormControl']).value);
      formData.append("active",this.OrderForm.get(['orderActivateFormControl']).value);
      // formData.append('order_details[]', this.order_details);
      alert(this.selectedFiles.length);
      if(this.selectedFiles.length){
        for(let i=0 ; i <this.selectedFiles.length ; i++)
          formData.append('order_maker_file[]', this.selectedFiles[i],this.selectedFiles[i].name);
      }
      this.ordermoduleService.saveOrder(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Order Information updated successfully")
          // this.ngOnInit();
          // this.routes.navigateByUrl('/OrderList');
        },  
      (error) =>{
          this.nbtoastService.danger("Unable to Update Order information")
        }
      )
      // this.saveOrderStatus();
    }
  }
  saveOrderStatus(){
    console.log("save order status")
    if (this.OrderForm.dirty && this.OrderForm.valid){
      let formData = new FormData()
    formData.append("order",this.order_id);
    formData.append("order_no",this.OrderForm.get(['orderNoFormControl']).value);
    // formData.append("order_date",this.OrderForm.get(['orderdateFormControl']).value);
    // formData.append("order_date",this.OrderForm.get(moment['orderdateFormControl']).value.format("DD-MM-YYYY:hh:mm"));
    formData.append("order_date",moment(this.current_date).format('DD-MM-YYYY:hh:mm A'));
    console.log("date",this.OrderForm.get(['orderdateFormControl']).value)
    formData.append("order_status",this.OrderForm.get(['orderstatusFormControl']).value);
    console.log("image ",this.selectedFiles)
    this.ordermoduleService.saveOrderStatus(formData).subscribe(
      (data) => {
        console.log('data',data)
      },  
    )
  }
  }
  onFileChange(event, file_name,file_id) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      for(let i=0 ; i < event.target.files.length ;i++){
        // alert(file_id)
        console.log("size",event.target.files[i].size)
        if(event.target.files[i].size>=500000){
          console.log("file size",true)
          this.nbtoastService.danger("Please upload  File Preferably with a file size below 500KB.")
          return 
        }
        if(event.target.files[i].type !== "image/jpeg" && event.target.files[i].type !== "application/pdf" && event.target.files[i].type !== "image/png"){
          console.log("file type",event.target.files[i].type)
          this.nbtoastService.danger("Please upload only .JPG, .PNG or .PDF. Preferably with a file size below 500KB.")
          return 
        }
        this.selectedFiles.push({file_name:<File>event.target.files[i].name,file:<File>event.target.files[i],file_id:file_id});
        this.submitfile=false
      }
      console.log("file name",this.selectedFiles)
      reader.readAsDataURL(file);
      reader.onload = () => {

        this.imgSrc = reader.result as string;

        this.OrderForm.patchValue({
          fileSource: reader.result
        });

      };

    }
  }
  get f() { return this.OrderForm.controls; }
  onSubmit(){
    this.submitted = true;
    if (this.OrderForm.invalid) {
        return;
    }
    if (!this.OrderForm.invalid){
      return this.submitted = false;
    }
  }
}
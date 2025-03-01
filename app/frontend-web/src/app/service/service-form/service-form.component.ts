import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ServiceService } from '../service.service';
import * as moment from 'moment';
// import { NbToastrService } from '@nebular/theme';
import { environment } from 'src/environments/environment';
import { isNgTemplate, ResourceLoader } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { elementAt } from 'rxjs';
import { Console } from 'console';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { FileRestrictions } from "@progress/kendo-angular-upload";



@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  
  stateCode:any;
  user_first_name=localStorage.getItem('first_name');
  user_last_name=localStorage.getItem('last_name');
  email=localStorage.getItem('email');
  phone_number=localStorage.getItem('phone_number');
  submitted1: boolean=false;
  is_learner_license:any;
  city:{name:string,value:string}[] =[
    {name:"Bagalkot", value:"Bagalkot"},
    {name:"Bengaluru Urban", value:"Bengaluru Urban"},
    {name:"Bengaluru Rural", value:"Bengaluru Rural"},
    {name:"Belagavi", value:"Belagavi"},
    {name:"Ballari", value:"Ballari"},
    {name:"Bidar", value:"Bidar"},
    {name:"Vijayapur", value:"Vijayapur"},
    {name:"Chamarajanagar", value:"Chamarajanagar"},
    {name:"Chikballapur", value:"Chikballapur"},
    {name:"Chikkamagaluru", value:"Chikkamagaluru"},
    {name:"Chitradurga", value:"Chitradurga"},
    {name:"Dakshina Kannada", value:"Dakshina Kannada"},
    {name:"Davanagere", value:"Davanagere"},
    {name:"Dharwad", value:"Dharwad"},
    {name:"Gadag", value:"Gadag"},
    {name:"Kalaburagi", value:"Kalaburagi"},
    {name:"Kolar", value:"Kolar"},
    {name:"Haveri", value:"Haveri"},
    {name:"Koppal", value:"Koppal"},
    {name:"Mandya", value:"Mandya"},
    {name:"Mysuru", value:"Mysuru"},
    {name:"Raichur", value:"Raichur"},
    {name:"Ramanagara", value:"Ramanagara"},
    {name:"Shivamogga", value:"Shivamogga"},
    {name:"Tumakuru", value:"Tumakuru"},
    {name:"Udupi", value:"Udupi"},
    {name:"Uttara Kannada", value:"Uttara Kannada"},
    {name:"Yadgir", value:"Yadgir"},

  ]
  defaultservice='Select Service Type';
  service_type =[
    {name:"For Self", value:"For Self"},
    {name:"For Others", value:"For Others"},
  ]
  selectValue: string = ''
  OrderForm!:FormGroup;
  loader:boolean=false;
  stateDefault='';
  url = `${environment.BASE_SERVICE_URL}/`;
  service_name:any;
  imgSrc!: string;
  isAuthenticated = false;
  active =true;
  today = new Date();
  selectedFiles:any=[];
  order_maker_file: any=[];
  service_id: any;
  selected_service_list: any=[];
  order_documents: any;
  order_date: any;
  submitted!: boolean;
  order_details: any=[];
  order_id: any;
  billed_amount: any;
  customer_id: any;
  customer:any;
  order_list:any;
  service_desc: any;
  stateValue: string
  states: any=[];
  districts: any=[];
  // selectedstate: any=[];
  selectedState: any;
  submitfile:boolean=true
  state_value: boolean=false;
  fee: any=0;
  govt_fee: any=0;
  amt: any=0;
  selected_service_amount: any=0;
  array: any = [];
  array1: any = [];
  array2: any = [];
  citypincodes: any=[];
  selectedState_value: any=[];
  selected_district: any=[];
  selected_taluq: any=[];
  selected_taluq_pincode: any=[];
  selected_state: any;
  selected_districts: any;
  product_code: any;
  user_categories: any;
  user_subcategories: any;


  constructor(
    private http: HttpClient,
    // private nbtoastService: NbToastrService,
    private route: ActivatedRoute,
     private router: Router,
     private formBuilder: FormBuilder,
       private service: ServiceService,
      //  private notification: NzNotificationService,
    ) { }

  ngOnInit(): void {
    console.log("phone number",this.phone_number)
    console.log("last name",this.user_last_name)
    this.http.get(`assets/states.json`).subscribe(state=>{
      // this.states=state['states']
  

      // console.log("state details",this.states)
      // // if(this.stateDefault == ''){

      // // }
      // console.log("state  by state",this.states[0].state)

    }),
    // this.http.get(`assets/pincode.json`).subscribe(pincode=>{
    //   this.citypincodes=pincode
    //   // console.log("pincode details",this.citypincodes)
    //   console.log("state names",this.citypincodes.map(e=>
    //     e.stateName).filter((value, index, self) => self.indexOf(value) === index))
    //     //  console.log("pincode details",this.citypincodes)
    // })
    this.OrderForm = this.formBuilder.group(
      {
        customernameFormControl: ['',[Validators.required]],
        lastnameFormControl: ['',[]],
        emailFormControl:['',[Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        customerphoneFormControl:['',[Validators.required,Validators.minLength(10), Validators.pattern('[0-9]{10}')]],
        adarFormControl:['',[Validators.required,Validators.minLength(12), Validators.pattern('[0-9]{12}')]],
        servicetypeFormControl:['',[Validators.required]],
        address1FormControl:['',[Validators.required]],
        address2FormControl:['',[]],
        stateFormControl:['',[Validators.required]],
        districtFormControl:['',[Validators.required]],
        cityFormControl:['',[Validators.required]], 
        OrderCodeFormControl:['',[]],
        pincodeFormControl:['',[Validators.required,Validators.minLength(5)]], 
       
   
  }),
  this.checkLogin();
  this.add_items();

  this.service_id = this.route.snapshot.queryParams["ServiceName"];
  this.stateValue = this.route.snapshot.queryParams["State"]
  console.log("id name",this.service_id, this.stateValue)
  
  console.log("service id",this.service_id);
  this.service.getStateslist().subscribe(
    (data:any)=>{   
      this.states=data
      console.log("data states",this.states)
      console.log("states json data",data)
      console.log('selected state',this.OrderForm.controls['stateFormControl'].value)
      this.selectedState_value=this.OrderForm.controls['stateFormControl'].value;
     })
     this.service.getServiceList(this.service_id).subscribe(
      (data1:any)=>{    
        console.log("data1",data1)
        this.is_learner_license=data1.is_learner_license
        this.selected_service_amount=data1.service_list1
        this.service_name= data1.service_name;
        this.service_desc =data1.desc;
        console.log("service",this.service_name)
        data1.service_list2.forEach((element:any) => {
          console.log('elets',element);
          this.selected_service_list.push({
            document_name:element.document_name,
            id:element.id,
            is_mandatory:element.is_mandatory,
          })
          console.log('selected_service',this.selected_service_list);
          // data1.service_list1.forEach((ele:any) => {
          //   let selected_servicelist=data1.service_list1.find(e=> e.branch__state_name==this.selectValue)
          //   console.log('ele details',selected_servicelist);
          //   this.fee=selected_servicelist.fee;
          //   this.govt_fee=selected_servicelist.govt_fee;
          //   console.log("fee",this.fee)
          //   console.log("govt_fee",this.govt_fee)
          //   this.amt=(parseInt(selected_servicelist.fee) + parseInt(selected_servicelist.govt_fee))
          //   console.log("fee details",this.amt)
          //   //  this.amt=(parseInt(ele.fee)  + parseInt(ele.govt_fee))
          //   // console.log("fee details",this.amt)
          //   // console.log("amount",this.amt)
          // })
  })
      
     });
   }
   
   load_district(item){
    const val=item.split(': ')
    console.log("state data splitted",val)
    console.log("state data",item)
    this.service.getDistrictslist(val[1]).subscribe((data1:any)=>{
     console.log("district data",data1)
     this.selected_district=data1;
    this.selected_state= val[1]
    console.log("selected state",this.selected_state)
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
  this.service.gettaluqlist(val[1]).subscribe((datas:any)=>{
    console.log("district data",datas)
    this.selected_taluq=datas;
    this.selected_districts=val[1]
    console.log("selected district",this.selected_districts)
    // this.load_pincodeslist(ele);
   })

}
load_pincodeslist(ele){
  const val=ele.split(': ')
  this.service.pincodeslist(val[1]).subscribe((datas:any)=>{
    console.log("pincode data",datas)
    this.selected_taluq_pincode=datas;
    // this.OrderForm.controls['pincodeFormControl'].setValue(datas)
  })
}

selectChangeHandler (event: any) {
  // this.selectValue = event.target.value
  this.selectValue=event.target.value.split(': ')
  if(this.selectValue!= 'Select a State Name'){
    this.state_value=true
  }
  else {
    this.state_value=false
  }
  console.log("selected state value",this.selectValue[1]!)
  this.OrderForm.controls['stateFormControl'].setValue(this.selectValue[1]!);
  this.onChange(this.selectValue);
  if (this.selectValue) {
  let service_amt=this.selected_service_amount.find(e=> e.branch__state_name==this.selectValue[1])
  }
  else{
    let service_amt=this.selected_service_amount.find(e=> e.branch__state_name==this.selectedState)
          // data.service_list1.forEach((ele:any) => {
          console.log('ele',service_amt);
          this.fee=service_amt.fee;
          this.govt_fee=service_amt.govt_fee;
          console.log("fee",this.fee)
          console.log("govt_fee",this.govt_fee)
          this.amt=(parseInt(service_amt.fee) + parseInt(service_amt.govt_fee))
          console.log("fee details",this.amt)
  }
}

checkLogin(): boolean {
  if(localStorage.getItem("accessToken")){
      this.isAuthenticated = true;

      return true;
  }else{
    // alert("Login is required");
    //  this.router.navigateByUrl("/ServiceList");
    this.isAuthenticated = false;
    return false;
  }
}
onChangetaluq(ele:any){
  // const val=ele.split(': ')
  console.log("selected taluq",ele)
  this.load_pincodeslist(ele);
  this.getOrderCode();

}
onChangecity(element:any){
  console.log("selected district",element)
  // this.selected_district=element
  // const val=element.split(': ')
  this.load_taluqlist(element);
  // this.citypincodes.filter(e=>e.districtName==
// console.log("city value",data)
}
onChange(data:any){

  console.log("state name",data)
  this.load_district(data)

  // if(this.selectedState == '9: Delhi (NCT)')
  // if(data =='9: Delhi' || data =='7: Dadra and Nagar Haveli (UT)' || data=='6: Chhattisgarh' || data =='5: Chandigarh (UT)' || data=='4: Bihar' || data=='3: Assam' ||  data=='3: Assam' || data=='2: Arunachal Pradesh')
  // {
  //   this.selectedState=data.slice(3,)
  // }
  // else{
  //   this.selectedState=data.slice(4,)
  // }
  console.log("value details",this.selectedState)
  this.http.get(`assets/states.json`).subscribe(state=>{
  console.log("states values",this.states[0].state)
  if (this.selectValue) {
    this.districts=this.states.find(e=>e.state==this.selectValue)['districts']
  } else {
    this.districts=this.states.find(e=>e.state==this.selectedState)['districts']
  }
    console.log("districts by state",this.districts)
  })
  for(let i=0;i<this.states.length;i++){
  }
  if (this.selectValue) {
    let service_amt=this.selected_service_amount.find(e=> e.branch__state_name==this.selectValue[1])
    // data.service_list1.forEach((ele:any) => {
    console.log('ele1',service_amt);
    this.fee=service_amt.fee;
    this.govt_fee=service_amt.govt_fee;
    console.log("fee1",this.fee)
    console.log("govt_fee1",this.govt_fee)
    this.amt=(parseInt(service_amt.fee) + parseInt(service_amt.govt_fee))
    console.log("fee details1",this.amt)
    }
    else{
      let service_amt=this.selected_service_amount.find(e=> e.branch__state_name==this.selectedState)
            // data.service_list1.forEach((ele:any) => {
            console.log('ele2',service_amt);
            this.fee=service_amt.fee;
            this.govt_fee=service_amt.govt_fee;
            console.log("fee2",this.fee)
            console.log("govt_fee2",this.govt_fee)
            this.amt=(parseInt(service_amt.fee) + parseInt(service_amt.govt_fee))
            console.log("fee details2",this.amt)
    }
}
change(){
  if(this.OrderForm.controls['servicetypeFormControl'].value == 'Select Service Type'){
    alert("please select valid service type")
   }
  if(this.OrderForm.controls['servicetypeFormControl'].value == 'For Self'){
    this.OrderForm.get(['customernameFormControl']).setValue(this.user_first_name);
    this.OrderForm.get(['lastnameFormControl']).setValue(this.user_last_name);
    this.OrderForm.get(['customerphoneFormControl']).setValue(this.phone_number);
    this.OrderForm.get(['emailFormControl']).setValue(this.email);
  }
  if(this.OrderForm.controls['servicetypeFormControl'].value == 'For Others') {
    this.OrderForm.get(['customernameFormControl']).setValue('');
    this.OrderForm.get(['lastnameFormControl']).setValue('');
    this.OrderForm.get(['customerphoneFormControl']).setValue('');
    this.OrderForm.get(['emailFormControl']).setValue('');

  }
  if(this.OrderForm.controls['servicetypeFormControl'].value == 'For Self'){
  this.user_categories=localStorage.getItem('categories');
  console.log("categoriessss",this.user_categories)
  this.user_subcategories=localStorage.getItem('subcategories');
  console.log("sub-categoriessss",this.user_subcategories)
  }else{
    this.user_categories='O T H';
    this.user_subcategories='O T H';
  }
}
saveOrder():void{
  this.submitted1=true
  this.loader=true;
  if(this.OrderForm.controls['servicetypeFormControl'].value == 'Select Service Type'){
    alert("please select valid service type")
    return 
   }
  if (this.OrderForm.dirty && this.OrderForm.valid){
    let formData = new FormData() 
    let file_ok:any = true;
    this.order_details.forEach(element => {
      console.log("order file",element.is_mandatory)  
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
    });
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
      alert("Please upload all mandotory files")
      // alert("please upload mandatory file ");
        //  this.notification.create(
        //   "info",
        //   'please upload mandatory file!',
        //   ''
        // );
      return ;     
    } 
    if (this.order_id){
      formData.append("id", this.order_id)
    }
    formData.append("service_id",this.service_id);
    formData.append("order_no",'0');
    formData.append("order_date",moment(new Date(this.today)).format("YYYY-MM-DD"));
    formData.append("order_status",'New');
    formData.append("order_code",this.OrderForm.get(['OrderCodeFormControl']).value);
    formData.append("service_type",this.service_name);
    formData.append("customer_name",this.OrderForm.get(['customernameFormControl']).value);
    formData.append("customer_lastname",this.OrderForm.get(['lastnameFormControl']).value);
    formData.append("customer_phone",this.OrderForm.get(['customerphoneFormControl']).value);
    formData.append("email",this.OrderForm.get(['emailFormControl']).value);
    formData.append("adharno",this.OrderForm.get(['adarFormControl']).value);
    formData.append("address1",this.OrderForm.get(['address1FormControl']).value);
    formData.append("address2",this.OrderForm.get(['address2FormControl']).value);
    formData.append("state",this.OrderForm.get(['stateFormControl']).value);
    formData.append("district",this.OrderForm.get(['districtFormControl']).value);
    formData.append("city",this.OrderForm.get(['cityFormControl']).value);
    formData.append("pincode",this.OrderForm.get(['pincodeFormControl']).value);
    formData.append("application_no",'');
    formData.append("dl_number",'');
    formData.append("remarks",'');
    formData.append("billed_amount",this.amt);
    formData.append("additional_charges",'0');
    formData.append("active",'1');
    formData.append("is_learner_license",this.is_learner_license);
    formData.append('order_documents', JSON.stringify(this.selectedFiles));
    formData.append("customer_id",this.customer);
    if(this.selectedFiles){
      for(let i=0 ; i <this.selectedFiles.length ; i++)
        formData.append('order_maker_file[]', this.selectedFiles[i].file,this.selectedFiles[i].file_name);
    }
  console.log("image ",this.selectedFiles)
  this.service.saveOrder(formData).subscribe(
    (data) => {
      console.log("order id",data)
      this.loader=false;
      this.order_list=data;
     console.log("data order id", this.order_list)
     this.stateValue=this.OrderForm.get(['stateFormControl']).value
     console.log("state name",this.stateValue)
    //  if(this.selectValue){
          this.router.navigateByUrl("Payments?Order="+this.order_list+'&State='+this.stateValue);
    // this.router.navigateByUrl("Payments?Order="+this.order_list+'&State='+this.selectValue[1]);

    //  }
    //  else if(this.selectedState){
    //   this.router.navigateByUrl("Payments?Order="+this.order_list+'&State='+this.selectedState);
    //  }
 
    },  
  )
}
}
saveCustomer():void{
  this.submitted1=true
  this.order_details.forEach(element => {
    console.log("order file",element.is_mandatory)  
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
  });
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
    alert("Please upload all mandotory files")
    // alert("please upload mandatory file ");
      //  this.notification.create(
      //   "info",
      //   'please upload mandatory file!',
      //   ''
      // );
    return ;     
  } 
  let customer =
  {
    customer_id:'',
    customer_type:'Customer',
    customer_name: this.OrderForm.controls['customernameFormControl'].value,
    email: this.OrderForm.controls['emailFormControl'].value,
    phone_number: this.OrderForm.controls['customerphoneFormControl'].value,
    address_line1: this.OrderForm.controls['address1FormControl'].value,
    address_line2: this.OrderForm.controls['address2FormControl'].value,
    active:'True',
    blocked_yn :'False',
  };
  this.service.saveCustomer(customer).subscribe(
    (data) => {
      this.loader=true;
      this.customer=data.id;
      console.log("check customer", this.customer)
      this.saveOrder();
    },
    (error) => { 
      if(JSON.parse(error)['phone_number']){
        alert(" Customer with this Phone Number already exist");
        // this.notification.create(
        //   "warning",
        //   'Customer with this Phone Number already exist!',
        //   ''
        // );
        }
        else{
          // this.notification.create(
          //   "error",
          //   'Unable to save customer information',
          //   ''
          // );
          alert("Unable to save customer information")
        }
      }
  );

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
getOrderCode():void {
  console.log("function called")
  if(this.user_categories=='Individuals'){
  this.user_subcategories='N D V'
  }
  try{
  if (this.user_categories && this.user_subcategories && this.selected_state && this.selected_districts){
    console.log("user cat",this.user_categories)
    console.log("user subcat",this.user_subcategories)
    console.log("selected state",this.selected_state)
    console.log("selected district",this.selected_districts)
    const data = {
      user_category: this.user_categories,
      user_subcategory:this.user_subcategories,
      state: this.selected_state,
      district:this.selected_districts,
    }
    this.service.getOrderCode(data).subscribe(
      (data) =>{
        console.log("order code data",data)
        // this.OrderForm.get(['OrderCodeFormControl']).setValue(data1);
        this.OrderForm.get(['OrderCodeFormControl']).setValue(data);
        console.log(" code data details",this.OrderForm.get(['OrderCodeFormControl']).value)
        // this.OrderForm.controls['OrderCodeFormControl'].setValue(data)
        //  this.product_code=data;
      },

      // (error) => {
      //   this.nbtoastService.danger('Error while getting order code');
      // }
    )
  }
}catch(e){
    console.log(e);
}
};
onFileChange(event:any, file_name:any, file_id:any, mandatory: any) {
  console.log(mandatory);
  const reader = new FileReader();
  console.log("event",event.target)
  if (event.target.files && event.target.files.length) {
    const [file] = event.target.files;
    for(let i=0 ; i < event.target.files.length ;i++){
      console.log("size",event.target.files[i].size)
      if(event.target.files[i].size>500000){
        console.log("file size",true)
        // this.notification.create(
        //   "warning",
        //   'Please upload  File Preferably with a file size below 500KB',
        //   ''
        // );
        alert("Please upload  File Preferably with a file size below 500KB.")
        // return 
      }
      if(event.target.files[i].type !== "image/jpeg" && event.target.files[i].type !== "application/pdf" && event.target.files[i].type !== "image/png"){
        console.log("file type",event.target.files[i].type)
        // this.notification.create(
        //   "warning",
        //   'Please upload only .JPG, .PNG or .PDF. Preferably with a file size below 500KB.',
        //   ''
        // );
        // if (mandatory && item.order_maker_file == '') {
        
        // }
        alert("Please upload only .JPG, .PNG or .PDF. Preferably with a file size below 500KB.")
        return 
      }
      // if (mandatory) {
      //   this.submitfile = true
      // } else {
      //   this.submitfile = false
      // }
      // alert(file_id)
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
  delete_document(item:any){
    const index: number = this.order_documents.indexOf(item);
    if (index !== -1) {
      if(item.id){
        
        const formData = new FormData()
        formData.append('id', item.id);
      this.service.removeFromDocumentList(formData).subscribe(
        (data) => {
          this.order_documents.splice(index, 1);
        },
        (error) => {
        }
      );
      }
      else{
        this.order_documents.splice(index, 1);
      }

    }
  }
  get f() { return this.OrderForm.controls; }
  onSubmit(){
    this.submitted1 = true;
    
    // stop here if form is invalid
    if (this.OrderForm.invalid) {
      return false ;
    }
    
    if (!this.OrderForm.invalid){
      return this.submitted1 = false;
    }
    return false;
  }
}

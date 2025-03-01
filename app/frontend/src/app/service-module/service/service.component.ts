import { Component, ComponentFactoryResolver, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import { ServiceModuleService } from '../service-module.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  ServiceForm: FormGroup;
  selected_category: any="";
  sub_categories;
  categories_list;
  searchCategory:any;
  searchSubCategory:any;
  selected_sub_category: any="";
  submitted: boolean;
  Service_Material:any=[];
  Service_Materials:any=[];
  active =true;
  is_learner_license=false;
  is_active = true;
  createFlag = true;
  branch_list: any;
  dailog_ref: any;

  searchBranch: string;
  service_id: any;
  cat_id: any;
  subcat_id: any;
  value: any;
  sequence=0;
  fee=0;
  govtfee=0;
  constructor(
    private formBuilder: FormBuilder,
    private servicemoduleService: ServiceModuleService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private adminService: AdminService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.ServiceForm = this.formBuilder.group(
      {
        categoryNameFormControl: ['', [Validators.required]],
        subcategoryNameFormControl: ['', [Validators.required]],
        serviceFormControl: ['',[Validators.required]],
        servicedescriptionFormControl:['',[]],
        serviceActivateFormControl:['',[]],
        SequenceFormControl:['',[]],
        LearnerLicenseFormControl:['',[]],
      }
    )
    // this.onchange();
    this.load_branch_list();
    this.load_category_list();
    this.load_subcategory_list();
    this.service_id = this.route.snapshot.queryParams["id"];
    if(this.service_id){
      this.createFlag = false;
      this.servicemoduleService.getServiceList(this.service_id).subscribe(
        (data) => {
          console.log("data list",data);
          this.ServiceForm.controls['categoryNameFormControl'].setValue(data.category_name);
          this.ServiceForm.controls['subcategoryNameFormControl'].setValue(data.sub_category_name);
          this.ServiceForm.controls['serviceFormControl'].setValue(data.service_name);
          this.ServiceForm.controls['servicedescriptionFormControl'].setValue(data.desc);
          this.ServiceForm.controls['SequenceFormControl'].setValue(data.sequence);
          this.ServiceForm.controls['serviceActivateFormControl'].setValue(data.active);
          this.ServiceForm.controls['LearnerLicenseFormControl'].setValue(data.is_learner_license);
          this.selected_category = data.category;
          this.cat_id = data.category
          console.log(this.cat_id)
          this.selected_sub_category = data.sub_category;
          console.log("data list2",this.selected_sub_category);
          this.subcat_id =data.sub_category;
          console.log("data list3",this.subcat_id );
          data.service_list1.forEach(element => {
            console.log("Branch Details",element)
            this.Service_Material.push(
              {
                sl_no : element.sl_no,
                // created: element.created,
                id: element.id,
                branch_name:element.branch_name,
                branch_id:element.branch_id,
                fee:element.fee,
                govt_fee:element.govt_fee,
              });
          });
          data.service_list2.forEach(element1 => {
            console.log("Documents Details",element1)
            this.Service_Materials.push(
              {
                sl_no : element1.sl_no,
                // created: element1.created,
                id: element1.id,
                document_name:element1.document_name,
                is_mandatory:element1.is_mandatory,
                              
                
              });
          //     if(element1.is_mandatory){
          //       this.onchange();
          // } 
          });
        },
        (error) =>{
          this.nbtoastService.danger("Unable to get Service Information")
        }
      )
    }
  }
  load_category_list(){
    this.servicemoduleService.getSubCategoryList().subscribe(
      (data) => {
          this.sub_categories = data;
          console.log("sub_categories",this.sub_categories)
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )
  }
  load_subcategory_list(){
  this.servicemoduleService.getCategoryList().subscribe(
 (data) => {
              this.categories_list = data;
            console.log("categories",this.categories_list)
           },
            (error) => {
                this.nbtoastService.danger(error,"Error")
            }
          )
  }
  cat_open(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.categories_list })
    .onClose.subscribe(data => {
      this.searchCategory=""
       this.selected_category = data
       this.cat_id = this.selected_category.id
       console.log(this.cat_id)
       this.ServiceForm.controls['categoryNameFormControl'].setValue(data.category_name);
    }
    );
  }
  sub_open(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.sub_categories })
    .onClose.subscribe(data => {
      this.searchSubCategory=""
       this.selected_sub_category = data
       console.log(this.selected_sub_category.id)
       this.ServiceForm.controls['subcategoryNameFormControl'].setValue(data.sub_category_name);
    }
    );
  }

  load_branch_list():void{
    const data = "";
    this.adminService.getBranch(data).subscribe(
      (data)=>{
        let activelist=data.filter(a=>{
          if(a.active){
            return a;
          }
        })
        
      this.branch_list=data;
      console.log("Branch details",this.branch_list)
      },
      (error) => {
        this.nbtoastService.danger(error);
      }
    )
  }
  add_branch(){
    this.submitted = false;
    const data = {
       sl_no:this.Service_Material.length + 1,
       branch_name:'',
       fee : 0,
       govt_fee:0,
    }
    this.Service_Material.push(data)

  }
  open_branch_dialog(dialog: TemplateRef<any>, item){
    this.dailog_ref = this.dialogService.open(dialog, { context: this.branch_list })
    .onClose.subscribe(data => {
      this.searchBranch = '';
      let data1=this.branch_list;
      // this.adminService.getBranch(data1).subscribe(
      // (material_detail) =>{
      //  console.log('dataa',data)
      // console.log("this is branch by id list", material_detail)
      if(item.branch_name == this.branch_list.branch_name){
        this.nbtoastService.danger("Branch name already exist");

      }else{
        console.log("check",item)

        item.branch_id = data.id;
        item.branch_name = data.branch_name;
        // item.fee=0;
        // item.govt_fee=0;
       
      }
    // })
  }); 
    
  }
  add_documents(){
    this.submitted = false;
    const data = {
       sl_no:this.Service_Materials.length + 1,
       document_name:'',
       is_mandatory : false,
    }
    this.Service_Materials.push(data)
  }

  // onchange(){
    
  //   this.Service_Materials.forEach(data => {
  //     console.log("check data",data)
  //     let val = data.is_mandatory;
  //     console.log("check val",val)
  //     if(data.is_mandatory == true){
  //       let value = 'true';
  //       data.is_mandatory  = value;
  //     }else{
  //       let value = 'false';
  //       data.is_mandatory  = value;
  //     }
  //   })
  // }
  remove_documents(item){
    const index: number = this.Service_Materials.indexOf(item);
    if (index !== -1) {
      if(item.id){
        
        const formData = new FormData()
        formData.append('id', item.id);
      this.servicemoduleService.deleteDocuments(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Row deleted from List Successfully")
          this.Service_Materials.splice(index, 1);
        },
        (error) => {
          this.nbtoastService.danger(error.detail);
        }
      );
      }
      else{
        this.Service_Materials.splice(index, 1);
      }

    }
  }
  remove_Branch(item):void{
    const index: number = this.Service_Material.indexOf(item);
    if (index !== -1) {
      if(item.id){
        
        const formData = new FormData()
        formData.append('id', item.id);
      this.servicemoduleService.deleteBranch(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Row deleted from List Successfully")
          this.Service_Material.splice(index, 1);
        },
        (error) => {
          this.nbtoastService.danger(error.detail);
        }
      );
      }
      else{
        this.Service_Material.splice(index, 1);
      }

    }
  }
  saveService():void{
    this.submitted = true;
    if (!this.Service_Material.length ) {
      this.nbtoastService.danger('Please Enter atleast One Branch')
      return
    }
    if(this.Service_Material){
      this.Service_Material.forEach(e=>{
         if(e.fee ==''){
          this.nbtoastService.danger('Please Enter Fee Details')
          return
         }
         if(e.govt_fee ==''){
          this.nbtoastService.danger('Please Enter Govt-Fee Details')
          return
         }
      })
      }
    if (!this.Service_Materials.length ) {
      this.nbtoastService.danger('Please Enter atleast One document')
      return
    }
    if (this.ServiceForm.dirty && this.ServiceForm.valid){
      let formData = new FormData()
      formData.append('category', this.cat_id);
      formData.append('sub_category', this.selected_sub_category.id);
      formData.append('category_name', this.ServiceForm.get(['categoryNameFormControl']).value);
      formData.append('sub_category_name', this.ServiceForm.get(['subcategoryNameFormControl']).value);
      formData.append('sub_category', this.selected_sub_category.id);
      formData.append('sequence',this.ServiceForm.get(['SequenceFormControl']).value);
      formData.append("service_name",this.ServiceForm.get(['serviceFormControl']).value);
      formData.append("desc",this.ServiceForm.get(['servicedescriptionFormControl']).value);
      formData.append("active",this.ServiceForm.get(['serviceActivateFormControl']).value);
      formData.append("is_learner_license",this.ServiceForm.get(['LearnerLicenseFormControl']).value);
      formData.append('service_list1', JSON.stringify(this.Service_Material));
      formData.append('service_list2', JSON.stringify(this.Service_Materials));
      this.servicemoduleService.saveService(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Service Information saved successfully")
          // this.ngOnInit();
          this.routes.navigateByUrl('/ServiceList');
        },
        (error) =>{
          if(JSON.parse(error)['service_name']){
            this.nbtoastService.danger("Service Name already Exist");
             }
             else{
              this.nbtoastService.danger("Unable to save Service information")
             }
        }
      )
    }
  }
    updateService(): void {
      this.submitted = true;
      if (!this.Service_Material.length ) {
        this.nbtoastService.danger('Please Enter atleast One Branch')
        return
      }
      if(this.Service_Material){
        this.Service_Material.forEach(e=>{
           if(e.fee ==''){
            this.nbtoastService.danger('Please Enter Fee Details')
            return
           }
           if(e.govt_fee ==''){
            this.nbtoastService.danger('Please Enter Govt-Fee Details')
            return
           }
        })
        }
      if (!this.Service_Materials.length ) {
        this.nbtoastService.danger('Please Enter atleast One document')
        return
      }
      // if (this.ServiceForm.dirty && this.ServiceForm.valid){
        let formData = new FormData()
        formData.append("id",this.service_id);
        formData.append('category', this.cat_id);
        formData.append('sub_category', this.subcat_id);
        formData.append('category_name', this.ServiceForm.get(['categoryNameFormControl']).value);
        formData.append('sub_category_name', this.ServiceForm.get(['subcategoryNameFormControl']).value);
        formData.append('sequence',this.ServiceForm.get(['SequenceFormControl']).value);
        formData.append("service_name",this.ServiceForm.get(['serviceFormControl']).value);
        formData.append("desc",this.ServiceForm.get(['servicedescriptionFormControl']).value);
        formData.append("active",this.ServiceForm.get(['serviceActivateFormControl']).value);
        formData.append("is_learner_license",this.ServiceForm.get(['LearnerLicenseFormControl']).value);
        formData.append('service_list1', JSON.stringify(this.Service_Material));
        formData.append('service_list2', JSON.stringify(this.Service_Materials));
      
        this.servicemoduleService.saveService(formData).subscribe(
          (data) => {
            this.nbtoastService.success("Service Information updated successfully")
            // this.ngOnInit();
            this.routes.navigateByUrl('/ServiceList');
          },
          (error) =>{
            if(JSON.parse(error)['service_name']){
              this.nbtoastService.danger("Service Name already Exist");
               }
               else{
                this.nbtoastService.danger("Unable to update Service information")
               }
          }
        )
  
      // }
  }
  get f() { return this.ServiceForm.controls; }
  onSubmit(){
    this.submitted = true;

      // stop here if form is invalid
      if (this.ServiceForm.invalid) {
          return;
      }
      if (!this.ServiceForm.invalid){
        return this.submitted = false;
      }
    
  }
  }




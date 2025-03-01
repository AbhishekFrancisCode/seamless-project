import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {

  state:{name:string,value:string}[] =[
    {name:"Andaman and Nicobar Islands", value:"35"},
    {name:"Andhra Pradesh", value:"28"},
    // {name:"Andhra Pradesh (New)", value:"37"},
    {name:"Arunachal Pradesh", value:"12"},
    {name:"Assam", value:"18"},
    {name:"Bihar", value:"10"},
    {name:"Chandigarh ", value:"04"},
    {name:"Chattisgarh ", value:"22"},
    {name:"Dadra and Nagar Haveli", value:"26"},
    {name:"Daman and Diu", value:"25"},
    {name:"Delhi", value:"07"},
    {name:"Goa", value:"30"},
    {name:"Gujarat", value:"24"},
    {name:"Haryana", value:"06"},
    {name:"Himachal Pradesh", value:"02"},
    {name:"Jammu and Kashmir", value:"01"},
    {name:"Jharkhand", value:"20"},
    {name:"Karnataka", value:"29"},
    {name:"Kerala", value:"32"},
    {name:"Lakshadweep Islands", value:"31"},
    {name:"Madhya Pradesh", value:"23"},
    {name:"Maharashtra", value:"27"},
    {name:"Manipur", value:"14"},
    {name:"Meghalaya", value:"17"},
    {name:"Mizoram", value:"15"},
    {name:"Nagaland", value:"13"},
    {name:"Odisha", value:"21"},
    {name:"Pondicherry", value:"34"},
    {name:"Punjab", value:"03"},
    {name:"Rajasthan", value:"08"},
    {name:"Sikkim", value:"11"},
    {name:"Tamil Nadu", value:"33"},
    // {name:"Telangana", value:"36"},
    {name:"Tripura", value:"16"},
    {name:"Uttar Pradesh", value:"09"},
    {name:"Uttarakhand", value:"05"},
    {name:"West Bengal", value:"19"},
  ]
  stateCode:any;
  branchForm: FormGroup;
  createFlag = true;
  branch_id: any;
  branch_list: [];
  selected_branch: any;
  branch_location: [];
  searchPinCode: any;
  shipPinCode: any;
  shipLocationName: any;
  loc_id: any;
  createFlag_Loc: boolean = true;
  submitted: boolean=false;

 

  constructor(private formBuilder: FormBuilder,
              private nbtoastService: NbToastrService,
              private routes: Router,
              private adminService: AdminService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.createFlag = true;
    this.branchForm = this.formBuilder.group(
      {
        branchNameFormControl: ['',[Validators.required]],
        branchAddressFormControl: ['',[]],
        branchPinCodeFormControl: ['',[]],
        branchCityFormControl: ['',[]],
        gstFormControl: ['',[Validators.required,Validators.minLength(15)]],
        branchPanNoFormControl: ['',[]],
        branchCinNoFormControl: ['',[]],
        branchEmailFormControl: ['',[]], 
        branchPhoneFormControl: ['',[]],
        mainBranchFormControl: [''],
        branchBankDetailsFormControl:[''],
        stateNameFormControl: ['', [Validators.required]],
        stateCodeFormControl: ['', [Validators.required]],
      }
    )

    this.branch_id = this.route.snapshot.queryParams["id"];
    if(this.branch_id){
      this.createFlag = false;
      this.adminService.getBranch(this.branch_id).subscribe(
        (data) => {
          this.branchForm.controls['branchNameFormControl'].setValue(data.branch_name);
          this.branchForm.controls['branchAddressFormControl'].setValue(data.address);
          this.branchForm.controls['branchPinCodeFormControl'].setValue(data.pin_code);
          this.branchForm.controls['branchCityFormControl'].setValue(data.city);
          this.branchForm.controls['stateCodeFormControl'].setValue(data.state_code);
          this.branchForm.controls['stateNameFormControl'].setValue(data.state_name);
          this.branchForm.controls['gstFormControl'].setValue(data.gst_no);
          this.branchForm.controls['branchPanNoFormControl'].setValue(data.pan_no);
          this.branchForm.controls['branchCinNoFormControl'].setValue(data.cin_no);
          this.branchForm.controls['branchEmailFormControl'].setValue(data.email);
          this.branchForm.controls['branchPhoneFormControl'].setValue(data.phone_no);
          this.branchForm.controls['mainBranchFormControl'].setValue(data.is_head_office);
          this.branchForm.controls['branchBankDetailsFormControl'].setValue(data.bank_details);

        },
        (error) =>{
          this.nbtoastService.danger("Unable to get Branch Information")
        }
      )
    }
    this.onChange();
    this.get_branch_list();
  }
  onChange(){
    this.branchForm.get('stateNameFormControl').valueChanges.subscribe(
      tt=>{
        if(tt){
          let searchInState=this.state.filter(s=>s.name===tt)[0];
          this.branchForm.get(['stateCodeFormControl']).setValue(searchInState.value);
        }
      });
  }
  saveBranch(): void {
    if (this.branchForm.dirty && this.branchForm.valid){
      let formData = new FormData()
      formData.append("branch_name",this.branchForm.get(['branchNameFormControl']).value);
      formData.append("address",this.branchForm.get(['branchAddressFormControl']).value);
      formData.append("pin_code",this.branchForm.get(['branchPinCodeFormControl']).value);
      formData.append("state_code",this.branchForm.get(['stateCodeFormControl']).value);
      formData.append("state_name",this.branchForm.get(['stateNameFormControl']).value);
      formData.append("city",this.branchForm.get(['branchCityFormControl']).value);
      formData.append("gst_no",this.branchForm.get(['gstFormControl']).value);
      formData.append("is_head_office",this.branchForm.get(['mainBranchFormControl']).value);
      formData.append("bank_details",this.branchForm.get(['branchBankDetailsFormControl']).value);
      formData.append("pan_no",this.branchForm.get(['branchPanNoFormControl']).value);
      formData.append("cin_no",this.branchForm.get(['branchCinNoFormControl']).value);
      formData.append("email",this.branchForm.get(['branchEmailFormControl']).value);
      formData.append("phone_no",this.branchForm.get(['branchPhoneFormControl']).value);

      this.adminService.saveBranch(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Branch Information saved successfully")
          this.ngOnInit();
          this.routes.navigateByUrl('/ManageBranchList');
        },
        (error) =>{
          this.nbtoastService.danger("Unable to save branch information")
        }
      )

    }

  }


  updateBranch(): void {
    if (this.branchForm.dirty && this.branchForm.valid){
      let formData = new FormData()      
      formData.append("branch_name",this.branchForm.controls['branchNameFormControl'].value);
      formData.append("address",this.branchForm.controls['branchAddressFormControl'].value);
      formData.append("pin_code",this.branchForm.controls['branchPinCodeFormControl'].value);
      formData.append("state_code",this.branchForm.get(['stateCodeFormControl']).value);
      formData.append("state_name",this.branchForm.get(['stateNameFormControl']).value);
      formData.append("city",this.branchForm.controls['branchCityFormControl'].value);
      formData.append("gst_no",this.branchForm.controls['gstFormControl'].value);
      formData.append("is_head_office",this.branchForm.get(['mainBranchFormControl']).value);
      formData.append("bank_details",this.branchForm.get(['branchBankDetailsFormControl']).value);
      formData.append("pan_no",this.branchForm.get(['branchPanNoFormControl']).value);
      formData.append("cin_no",this.branchForm.get(['branchCinNoFormControl']).value);
      formData.append("email",this.branchForm.get(['branchEmailFormControl']).value);
      formData.append("phone_no",this.branchForm.get(['branchPhoneFormControl']).value);
      
      this.adminService.updateBranch(this.branch_id, formData).subscribe(
        (data) => {
          console.log("check",data)
          this.nbtoastService.success("Branch Information saved successfully")
          this.routes.navigateByUrl('/ManageBranchList');
          this.reset();
          
        },
        (error) =>{
          this.nbtoastService.danger("Unable to save branch information")
        }
      )

    }
    
  }

  get_branch_list(): void{
    const data = ""
    this.adminService.getBranch(data).subscribe(
      (data) =>{
        this.branch_list = data;
      },
      (error) => {
        this.nbtoastService.danger("unable to get branch list");
      }
    )
  }

  get_ship_locations(): void {
    this.adminService.getBranchShipLocations(this.selected_branch).subscribe(
      (data) =>{
        this.branch_location = data
      },
      (error) =>{
        this.nbtoastService.danger("unable to get branch locations list");
      }
    )
  }

  save_location(pin_code, location):any{
    const data = new FormData()
    data.append('pin_code',pin_code)
    data.append('location_name',location)
    data.append('branch',this.selected_branch)
    this.adminService.saveBranchShipLocations(data).subscribe(
      (data) => {
          this.nbtoastService.success("Shipping location added successfuly")
          this.get_ship_locations();
          this.shipLocationName ='';
          this.shipPinCode ='';
          this.createFlag_Loc = true;
      },
      (error) => {
        this.nbtoastService.danger("Unable to  add shipping location added successfuly")
      }
    )
  }

  get_selected_loc(data): any {
    this.shipLocationName = data.location_name;
    this.shipPinCode = data.pin_code;
    this.loc_id = data.id;
    this.createFlag_Loc = false;
  }

  update_location(pin_code, location):any{
    const data = new FormData()
    data.append('id',this.loc_id)
    data.append('pin_code',pin_code)
    data.append('location_name',location)
    data.append('branch',this.selected_branch)
    this.adminService.updateBranchShipLocations(this.loc_id,data).subscribe(
      (data) => {
        this.nbtoastService.success("Shipping location updated successfuly")
        this.get_ship_locations();
        this.shipLocationName ='';
        this.shipPinCode ='';
        this.createFlag_Loc = true;
      },
      (error) => {
        this.nbtoastService.danger("Unable to  add shipping location added successfuly")
      }
    )
  }
  delete_location(pin_code, location):any{
    this.adminService.deleteBranchShipLocations(this.loc_id).subscribe(
      (data) => {
        this.nbtoastService.warning("Shipping location deleted successfuly")
      },
      (error) => {
        this.nbtoastService.danger("Unable to remove shipping location")
      }
    )
  }

  reset() {
    this.branchForm.reset();
  }

  ValidatePinCode(pin,pinof)
  {
    if(pin.length >6)
    {
      let pinslice = pin.slice(0,6);
    if(pinof == 'branchPinCode')
    {
      this.branchForm.controls['branchPinCodeFormControl'].setValue(pinslice);
    }
    else
    {
       (<HTMLInputElement>document.getElementById("shipPinCode")).value = pinslice;
    }
  }
  }
  // selected_branch(branch): any {
  //   localStorage.setItem('branch_name',branch.branch_name);
  //   localStorage.setItem('branch_city',branch.city);
  //   localStorage.setItem('branch_id',branch.id);
  //   localStorage.setItem('bank_detail',branch.bank_details);
  
  //   // this.router.navigate(["/"]);


  // }

  get f() { return this.branchForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.branchForm.invalid) {
          return;
      }
      if (!this.branchForm.invalid){
        return this.submitted = false;
      }

      
    
  }


}

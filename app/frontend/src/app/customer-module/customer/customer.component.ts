import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CustomerModuleService } from '../customer-module.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  createFlag = true;
  Customer_Type =[
    {name:"Customer", value:"Customer"},
    {name:"Dealer", value:"Dealer"},
  ]
  blocked_yn=false;
  active =true;
  customer_id: any;
  submitted: boolean;
  constructor(
    private formBuilder: FormBuilder,
              private nbtoastService: NbToastrService,
              private routes: Router,
              private customermoduleService: CustomerModuleService,
              private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group(
      {
        customertypeFormControl: ['',[Validators.required]],
        customernameFormControl:['',[Validators.required]],
        EmailFormControl:['',[Validators.required]],
        addressline1FormControl:['',[]],
        addressline2FormControl:['',[]],
        phonenumberFormControl:['',[Validators.required]],
        customerActivateFormControl:['',[]],
        blocked_ynFormControl:['',[]],

      }
    )
    this.customer_id = this.route.snapshot.queryParams["id"];
    if(this.customer_id){
      this.createFlag = false;
      this.customermoduleService.getCustomerList(this.customer_id ).subscribe(
        (data) => {
          this.customerForm.controls['customertypeFormControl'].setValue(data.customer_type);
          this.customerForm.controls['customernameFormControl'].setValue(data.customer_name);
          this.customerForm.controls['EmailFormControl'].setValue(data.email);
          this.customerForm.controls['addressline1FormControl'].setValue(data.address_line1);
          this.customerForm.controls['addressline2FormControl'].setValue(data.address_line2);
          this.customerForm.controls['phonenumberFormControl'].setValue(data.phone_number);
          this.customerForm.controls['customerActivateFormControl'].setValue(data.active);
          this.customerForm.controls['blocked_ynFormControl'].setValue(data.blocked_yn);
        },
        (error) =>{
          this.nbtoastService.danger("Unable to get Customer Information")
        }
      )
    }
    

  }
  
  saveCustomer(): void {
    if (this.customerForm.dirty && this.customerForm.valid){
      let formData = new FormData()
      formData.append("customer_type",this.customerForm.get(['customertypeFormControl']).value);
      formData.append("customer_name",this.customerForm.get(['customernameFormControl']).value);
      formData.append("address_line1",this.customerForm.get(['addressline1FormControl']).value);
      formData.append("address_line2",this.customerForm.get(['addressline2FormControl']).value);
      formData.append("phone_number",this.customerForm.get(['phonenumberFormControl']).value);
      formData.append("email",this.customerForm.get(['EmailFormControl']).value);
      formData.append("active",this.customerForm.get(['customerActivateFormControl']).value);
      formData.append("blocked_yn",this.customerForm.get(['blocked_ynFormControl']).value);
    
      this.customermoduleService.saveCustomer(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Customer Information saved successfully")
          this.ngOnInit();
          this.routes.navigateByUrl('/CustomerList');
        },
        (error) => { 
          if(JSON.parse(error)['phone_number']){
            this.nbtoastService.danger("Phone Number already exist");
            }
            else{
              this.nbtoastService.danger("Unable to save Customer information")
            }
        }
      )

    }

  }
  updateCustomer(): void {
    if (this.customerForm.dirty && this.customerForm.valid){
      let formData = new FormData()
      formData.append("customer_type",this.customerForm.get(['customertypeFormControl']).value);
      formData.append("customer_name",this.customerForm.get(['customernameFormControl']).value);
      formData.append("address_line1",this.customerForm.get(['addressline1FormControl']).value);
      formData.append("address_line2",this.customerForm.get(['addressline2FormControl']).value);
      formData.append("phone_number",this.customerForm.get(['phonenumberFormControl']).value);
      formData.append("email",this.customerForm.get(['EmailFormControl']).value);
      formData.append("active",this.customerForm.get(['customerActivateFormControl']).value);
      formData.append("blocked_yn",this.customerForm.get(['blocked_ynFormControl']).value);
    
      this.customermoduleService.updateCustomer(this.customer_id,formData).subscribe(
        (data) => {
          this.nbtoastService.success("Customer Information Updated successfully")
          this.ngOnInit();
          this.routes.navigateByUrl('/CustomerList');
        },
        (error) => { 
          if(JSON.parse(error)['phone_number']){
            this.nbtoastService.danger("Phone Number already exist");
            }
            else{
              this.nbtoastService.danger("Unable to update Customer information")
            }
        }
      )

    }

  }
  get f() { return this.customerForm.controls; }
  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.customerForm.invalid) {
        return;
    }
    if (!this.customerForm.invalid){
      return this.submitted = false;
    }
  }
}

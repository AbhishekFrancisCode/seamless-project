import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceModuleService } from 'src/app/service-module/service-module.service';
import { NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryFrom: FormGroup;
  categories;
  createFlag = true;
  // defaultservice_type='Primary Service';
  service_type=[
    {value:"Primary Service", name:"Primary Service"},
    {value:"Secondary Service", name:"Secondary Service"},
  ]
  category_id;
  sequence=0;
  searchCategory:any;
  submitted: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
              private Service: ServiceModuleService,
              private nbtoastService: NbToastrService,
              private routes: Router
  ) { }

  ngOnInit(): void {
    this.categoryFrom  =  this.formBuilder.group({
      categoryNameFormControl: ['', [Validators.required]],
      categoryDescFormControl: ['', [Validators.required]],
      SequenceFormControl:['',[]],
      servicetypeFormControl:['',[Validators.required]]
    });
    this.createFlag = true;
    this.Service.getCategoryList().subscribe(
      (data) => {
          this.categories = data;
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )
  }
  save_category(): void{
    this.submitted = true;
    if( this.categoryFrom.dirty && this.categoryFrom.valid){
      let data = {
            category_name: this.categoryFrom.get(['categoryNameFormControl']).value,
            description: this.categoryFrom.get(['categoryDescFormControl']).value,
            service_type:this.categoryFrom.get(['servicetypeFormControl']).value,
            sequence: this.categoryFrom.get(['SequenceFormControl']).value,
      }
      this.Service.saveCategory(data).subscribe(
        (data) => {
          this.submitted = false;
          this.nbtoastService.success("Saved Successfully");
          this.ngOnInit();
        },
        (error) =>{
          if(JSON.parse(error)['category_name']){
            this.nbtoastService.danger("Category Code or Category Name already exist");
             }
             else{
              this.nbtoastService.danger("Unable to save category information")
             }
        }
      )
    }
    };
    update_category(): void{

      if( this.categoryFrom.dirty && this.categoryFrom.valid){
        let data = {
              category_name: this.categoryFrom.get(['categoryNameFormControl']).value,
              description: this.categoryFrom.get(['categoryDescFormControl']).value,
              service_type:this.categoryFrom.get(['servicetypeFormControl']).value,
              sequence: this.categoryFrom.get(['SequenceFormControl']).value,
        }
        this.Service.updateCategory(this.category_id, data).subscribe(
          (data) => {
            this.nbtoastService.success("Category Updated Successfully");
            this.ngOnInit();
          },
          (error) =>{
            // this.nbtoastService.danger(error);
            if(JSON.parse(error)['category_name']){
              this.nbtoastService.danger("Category Code or Category Name already exist");
               }
               else{
                this.nbtoastService.danger("Unable to update category information")
               }
          }
        )
      }
      };
      selected_category(data): any{
        this.categoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);
        this.categoryFrom.controls['categoryDescFormControl'].setValue(data.description);
        this.categoryFrom.controls['servicetypeFormControl'].setValue(data.service_type);
        this.categoryFrom.controls['SequenceFormControl'].setValue(data.sequence);
        this.createFlag = false;
        this.category_id = data.id
    }
    delete_category(category){
      const data = {
        "id" : category.category_id
      }
      this.Service.removeFromCategory(data).subscribe(()=>{
        this.refresh();
      })
    }
    refresh(): void {
      window.location.reload();
    }

    get f() { return this.categoryFrom.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.categoryFrom.invalid) {
        return;
    }
    if (!this.categoryFrom.invalid){
      return this.submitted = false;
    }

    
  
}


}

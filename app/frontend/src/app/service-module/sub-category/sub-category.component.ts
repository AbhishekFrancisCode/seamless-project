import { Component, OnInit } from '@angular/core';
import { Optional, Pipe, PipeTransform, TemplateRef, ViewChild ,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ServiceModuleService } from 'src/app/service-module/service-module.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  subcategoryFrom: FormGroup;
  sub_categories;
  createFlag = true;
  subcategory_id;
  selected_category;
  categories_list;
  searchCatgory;
  sequence=0;
  searchSubCategory:any;
  dailog_ref;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  submitted: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private Service: ServiceModuleService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    @Optional() protected ref: NbDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.subcategoryFrom  =  this.formBuilder.group({
      subcategoryNameFormControl: ['', [Validators.required]],        
      categoryNameFormControl: ['', [Validators.required]],
      subDescription: ['', [Validators.required]],
      SequenceFormControl:['',[]],
    });
    this.createFlag = true;
    this.Service.getSubCategoryList().subscribe(
      (data) => {
          this.sub_categories = data;
          console.log(this.sub_categories)
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )
    this.Service.getCategoryList().subscribe(
      (data) => {
          this.categories_list = data;
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )
  }
  open(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.categories_list })
    .onClose.subscribe(data => {
      this.searchCatgory = ""
       this.selected_category = data   
      //  this.selected_category.id=data.id
      //  console.log("category_id",this.selected_category.id)
       this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);
       
    }
    );
  }
  reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }
  refresh(): void {
    window.location.reload();
  }
  save_sub_category(): void{
    this.submitted=true;
    if( this.subcategoryFrom.dirty && this.subcategoryFrom.valid){
      let data = new FormData()
      data.append('sub_category_name', this.subcategoryFrom.get(['subcategoryNameFormControl']).value)
      // data.append('category_name', this.subcategoryFrom.get(['categoryNameFormControl']).value)
      data.append('description', this.subcategoryFrom.get(['subDescription']).value)
      data.append('sequence',this.subcategoryFrom.get(['SequenceFormControl']).value);
      data.append('category_id', this.selected_category.id)
      this.Service.saveSubCategory(data).subscribe(
        (data) => {
          this.submitted=false;
          this.nbtoastService.success("Saved Successfully");
          this.ngOnInit();
        },
        (error) =>{
          if(JSON.parse(error)['sub_category_name']){
            this.nbtoastService.danger("Sub Category Code or Subcategory Name already");
             }
             else{
              this.nbtoastService.danger("Unable to save sub-category information")
             }
        }
      )    
    }
    };
    update_sub_category(): void{
      if( this.subcategoryFrom.valid){
        let data = new FormData()
            data.append('sub_category_name', this.subcategoryFrom.get(['subcategoryNameFormControl']).value)
            data.append('category_id', this.selected_category.id)
            data.append('description', this.subcategoryFrom.get(['subDescription']).value)
            data.append('sequence',this.subcategoryFrom.get(['SequenceFormControl']).value)
        this.Service.updateSubCategory(this.subcategory_id, data).subscribe(
          (data) => {
            
            this.nbtoastService.success("SubCategory Updated Successfully");
            this.ngOnInit();
          },
          (error) =>{
            if(JSON.parse(error)['sub_category_name']){
              this.nbtoastService.danger("Sub Category Code or Subcategory Name already");
               }
               else{
                this.nbtoastService.danger("Unable to update sub-category information")
               }
          }
        )    
      }
      };
      selected_sub_category(data): any{
      
        this.subcategoryFrom.controls['subcategoryNameFormControl'].setValue(data.sub_category_name);        
        this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category.category_name);
        this.subcategoryFrom.controls['subDescription'].setValue(data.description);
        this.subcategoryFrom.controls['SequenceFormControl'].setValue(data.sequence);
        this.createFlag = false;
        this.subcategory_id = data.id
        this.selected_category = data.category
    }
    get f() { return this.subcategoryFrom.controls; }
    onSubmit() {
      this.submitted = true;
  
      // stop here if form is invalid
      if (this.subcategoryFrom.invalid) {
          return;
      }
      if (!this.subcategoryFrom.invalid){
        return this.submitted = false;
      }
  
      
    
  }

}

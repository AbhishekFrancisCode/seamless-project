import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {SharedService} from '../../shared/shared.service';
// import { NbDialogService, NbToastrService } from '@nebular/theme';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
// import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  [x: string]: any;
  id: string;
  loader:boolean=false;
  ContactForm: FormGroup;
  user: any;
  dailog_ref: any;
  selected_category :any=[]
  submitted: boolean;
  constructor(private formBuilder: FormBuilder,private SharedService:SharedService,
    private route: ActivatedRoute,
    // private notification: NzNotificationService,
    // private nbtoastService: NbToastrService,
    
    private scroll: ViewportScroller
    ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParams["id"] 
    console.log("id contact",this.id)
    this.scroll.scrollToAnchor(this.id)
    this.selected_category =this.route.snapshot.queryParams['ServiceName'];
    console.log("selected category name", this.selected_category)
    this.ContactForm = this.formBuilder.group({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      phone_number: new FormControl('', [Validators.required,Validators.minLength(10), Validators.pattern('[0-9]{10}')]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    })
    this.ContactForm.get(['subject']).setValue(this.selected_category),
    this.user=localStorage.getItem('user_id')
    // console.log("user id",sessionStorage)
  }
  saveContactUs(){
    if(this.ContactForm.get('fullName').value !== '' && this.ContactForm.get('email').value !== '' && this.ContactForm.get('phone_number').value !== '' && this.ContactForm.get('message').value !== '' && this.ContactForm.get('subject').value !== ''){
      this.loader=true;
    }
    // this.loader=true;
    this.submitted=true
    if(this.ContactForm.invalid){
      return 
    }
    const data={
      // 'user':this.user,
      'full_name':this.ContactForm.get('fullName').value,
      'email':this.ContactForm.get('email').value,
      'phone_number':this.ContactForm.get('phone_number').value,
      'message':this.ContactForm.get('message').value,
      'subject':this.ContactForm.get('subject').value,
    }
    this.SharedService.SaveContactUs(data).subscribe(
      (data) => {
    console.log("data",data)
      this.loader=false;
    this.submitted=false
    // this.notification.create(
    //   "success",
    //   'Thank You For Contacting Us!',
    //   'We will reach you shortly'
    // );
    // this.nbtoastService.danger("Thanks for Contacting Us! We will reach you shortly")
    alert("Thanks for Contacting Us! We will reach you shortly")
    this.ContactForm.reset()
      }),
      (error) =>{
        // this.notification.create(
        //   "error",
        //   'Error',
        //   ''+ error.details
        // );
        alert("ERROR :" + error.details)

      }
  }
  get f() { return this.ContactForm.controls; }
  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.ContactForm.invalid) {
      return false ;
    }
    
    if (!this.ContactForm.invalid){
      return this.submitted = false;
    }
    return false;
  }
}

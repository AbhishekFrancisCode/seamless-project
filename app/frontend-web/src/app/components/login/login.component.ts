import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userRegisterForm!: FormGroup;
  forgot_password_like = environment.BASE_SERVICE_URL + '/accounts/password_reset/';
  error:any;
  loginForm!: FormGroup;
  errorTxt: string = "";
  email:string = "";
  Invalid=false;
  show = true;
  submitted: boolean;
  password_value: boolean=true;
  defaultcategory_type='Company / Organisation';
  categories =[
    {value:"Individuals", name:"Individuals"},
    {value:"Corporates",name:"Corporates"},
    {value:" Commercial Vehicle Companies", name:" Commercial Vehicle Companies"},
    {value:"Vehicle Manufacturer", name:"Vehicle Manufacturer"},
    {value:"Vehicle Leasing Company", name:"Vehicle Leasing Company"},
    {value:"Vehicle Finance Company", name:"Vehicle Finance Company"},
  ]
  get first_name(): any {
    return this.userRegisterForm.get('first_name')

  }
  get last_name(): any {
    return this.userRegisterForm.get('last_name')

  }
  get phone_number(): any {
    return this.userRegisterForm.get('phone_number')
  }
  get password(): any {
    return this.userRegisterForm.get('password')
  }
  get loginpassword(): any {
    return this.loginForm.get('loginpassword')
  }
  get username(): any {
    return this.loginForm.get('username')
  }
  get confirmpassword(): any {
    return this.userRegisterForm.get('confirmpassword')
  }
  @HostListener('change', ['$event'])
  onchange(event:Event){
    this.passwordMatchValidator();

  }
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private service: SharedService
    ) { }

  ngOnInit(): void {
    this.userRegisterForm = new FormGroup(
      {
        'first_name': new FormControl('', [Validators.required, Validators.minLength(3)]),
        'last_name': new FormControl('', [Validators.required, Validators.minLength(1)]),
        'email': new FormControl('', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        'phone_number': new FormControl('', [Validators.required,Validators.minLength(10), Validators.pattern('[0-9]{10}')]),
        'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
        'confirmpassword': new FormControl('', [Validators.required,Validators.minLength(6)]),
        'categories': new FormControl('',[Validators.required]),
        'subcategories':new FormControl('',[]),
        'activeformcontrol':new FormControl('',[Validators.required]),
      }
    );
    this.loginForm = new FormGroup(
      {
        'username': new FormControl(null, [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        'loginpassword': new FormControl(null,[Validators.required, Validators.minLength(6)])
      }
    );
  }

  login(): void {
    this.submitted = true;
    console.log("login values",this.loginForm.controls)
    const user =
    {
      email: this.loginForm.controls['username'].value,
      password: this.loginForm.controls['loginpassword'].value
    };
    this.service.loginUser(user).subscribe((data: any) => {
      console.log("log in data",data);
      this.submitted = false;
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("first_name", data.first_name);
      localStorage.setItem('categories',data.categories)
      localStorage.setItem('subcategories',data.subcategories)
      localStorage.setItem("email", user.email);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("last_name", data.last_name);
      localStorage.setItem("phone_number", data.phone_number);
      this.service.setAuthenticationObs(true);

      window.location.reload();
      this.loginForm.reset()
    }, (error) => {
      if(JSON.parse(error)['error']){
        alert(error);
        }
     console.log("error console value",error)
      this.service.setAuthenticationObs(false);
      this.error = this.service.handleError(error.message);
      // if(JSON.parse(error)['username']){
        alert(this.error);
      //    }

        //  else{
        //    alert("Unable to save Login information")
        //  }
        
      // if(JSON.parse(error)['username'] !==  sessionStorage.getItem( user.email)){
      //   alert("No active account found with the given credentials")
      // }
      // this.service.setAuthenticationObs(false);
      // this.error = this.service.handleError(error.message);
      // alert("ERROR :" + error.details);

    });

  }

  // validate the password and confirm password  
  passwordMatchValidator() {
    const password = this.userRegisterForm.get('password')
    const confirmpassword = this.userRegisterForm.get('confirmpassword')

    if (password.value !== confirmpassword.value) {
   
      this.password_value=false;
      console.log("val",this.password_value)
      confirmpassword.setErrors({ passwordsMatch: true })
    } else {
      this.password_value=true;
      console.log("val1",this.password_value)
      confirmpassword.setErrors(null)
    }
  }
onChange(){
  if(this.userRegisterForm.controls['categories'].value == 'Individuals'){
    this.show = false;
    this.userRegisterForm.controls['subcategories'].setValue('');
    console.log("sub cat values",  this.userRegisterForm.controls['subcategories'].setValue(''))
    console.log("show value",this.show)
   }
   else{
    this.show = true;
   }

}
  registerUser(): void {
    this.submitted = true;
    console.log("registration values",this.userRegisterForm.controls)
    if(this.userRegisterForm.controls['categories'].value == 'Please Select User Category'){
      alert("Please Select User Category")
    }
    if (!this.userRegisterForm.invalid) {
    const user =
    {
      first_name: this.userRegisterForm.controls['first_name'].value,
      last_name: this.userRegisterForm.controls['last_name'].value,
      email: this.userRegisterForm.controls['email'].value,
      phone_number: this.userRegisterForm.controls['phone_number'].value,
      subcategories:this.userRegisterForm.controls['subcategories'].value,
      categories:this.userRegisterForm.controls['categories'].value,
      password: this.userRegisterForm.controls['password'].value,
      confirmpassword: this.userRegisterForm.controls['confirmpassword'].value,
      is_customer: '1',

    };  
    this.service.registerUser(user).subscribe(
      (data) => {
        this.submitted = false;
        this.userRegisterForm.reset();
        this.loginForm.controls['username'].setValue(user.email);
        this.loginForm.controls['loginpassword'].setValue(user.password);
        alert("User Registration successful, Please activate the account by verifying your email")

      },
      (error) =>{
        if(JSON.parse(error)['email']){
          alert("User email already exist");
           }
          //  else{
          //    alert("Unable to save signup information")
          //  }
        // alert("ERROR :" + error.details);
      }
    );
    }
  }
  get f() { return this.userRegisterForm.controls; }
  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.userRegisterForm.invalid) {
      return false ;
    }
    
    if (!this.userRegisterForm.invalid){
      return this.submitted = false;
    }
    return false;
  }

}

import { Component, OnInit } from '@angular/core';
import { style } from '@angular/animations';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
// import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated = false;
  userSub!: Subscription;
  first_name!: string | null;
  
  constructor(
    private sharedservice: SharedService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin(): boolean {
    if(localStorage.getItem("accessToken")){
        this.isAuthenticated = true;
        this.first_name = localStorage.getItem("first_name");
        return true;
    }else{
      this.isAuthenticated = false;
      return false;
    }
    
  }
  logOutUser() {
    this.sharedservice.logoutUser();
    this.ngOnInit();
    window.location.reload();
  }

}

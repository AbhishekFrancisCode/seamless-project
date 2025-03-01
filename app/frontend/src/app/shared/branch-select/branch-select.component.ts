import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-branch-select',
  templateUrl: './branch-select.component.html',
  styleUrls: ['./branch-select.component.scss']
})
export class BranchSelectComponent implements OnInit {

  branchs=[]

  constructor(private sharedService: SharedService ,private router:Router) { }

  ngOnInit(): void {
    this.sharedService.getBranchList().subscribe(
      (data) => {
          this.branchs = data;
      },
      (error) => {

      }
    )
  }

  selected_branch(branch): any {
    localStorage.setItem('branch_name',branch.branch_name);
    localStorage.setItem('branch_city',branch.city);
    localStorage.setItem('branch_id',branch.id);
    localStorage.setItem('bank_details',branch.bank_details);
    localStorage.setItem('pan_no',branch.pan_no);
    localStorage.setItem('cin_no',branch.cin_no);
    localStorage.setItem('email',branch.email);
    localStorage.setItem('phone_no',branch.phone_no);
    localStorage.setItem('gst_no',branch.gst_no);
    localStorage.setItem('address',branch.address);
    localStorage.setItem('state_name',branch.state_name);
    this.router.navigate(["/"]);


  }

}

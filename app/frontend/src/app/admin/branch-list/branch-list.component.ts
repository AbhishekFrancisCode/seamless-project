import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {
  
  branch_list = []

  settings = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,      
      },
    columns: {
      id: {
        title: 'id',
        hide:true
      },
      branch_name: {
        title: 'Branch Name',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageBranch?id=${row.id}">${row.branch_name}</a>`;
      }
      },
      address: {
        title: 'Branch Address',
      },
      pin_code: {
        title: 'Pin Code',
      },
      is_head_office: {
        title: 'Is Head Office',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          if (row.is_head_office == true){
            return 'Head Office'
          }else{
            return 'Branch Office'
          }
          // return `<a href="ManageBranch?id=${row.id}">${row.branch_name}</a>`;
      }
      },
      
      
    },
  };
  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService,
    private nbtoastService: NbToastrService,
    private routes: Router) { }

  ngOnInit(): void {
    const data = "";
    this.adminService.getBranch(data).subscribe(
      (data) => {
          this.branch_list = data
      },
      (error) => {
          this.nbtoastService.danger("Unable to get branch Info","Error");
      }

    )
  }

}

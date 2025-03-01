import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ServiceModuleService } from '../service-module.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {

  Service_List=[]
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
      service_name: {
        title: 'Service Name',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="Service?id=${row.id}">${row.service_name}</a>`;
      }
      },
      desc: {
        title: 'Service Description',
      },
      sequence: {
        title: 'Sequence',
      },
      category_name: {
        title: 'Category Name',
      },
      sub_category_name: {
        title: 'Sub Category Name',
      },
      active:{
        title:'Active',
      },
      category__service_type:{
        title: 'Category service Type',

      }
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private servicemoduleService: ServiceModuleService,
    private nbtoastService: NbToastrService,
    private routes: Router
  ) { }

  ngOnInit(): void {
    const data = "";
    this.servicemoduleService.getService().subscribe(
      (data) => {
          this.Service_List = data;
          console.log("check data",this.Service_List)
      },
      (error) => {
          this.nbtoastService.danger("Unable to get branch Info",error);
      }

    )
  }
  }



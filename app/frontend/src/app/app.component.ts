import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { SharedService } from './shared/shared.service';
import { environment } from '../environments/environment';
import { LoadingService } from './loading.service';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  branch_name;
  has_permission = false;
  loading = true;
  constructor(
    private permissionsService: NgxPermissionsService,
    private roleService: NgxRolesService,
    private sharedService: SharedService,
    private _loading: LoadingService) {

  }
  items: NbMenuItem[];

  ngOnInit(): void {
    setTimeout(() => {
      this.loadPermissions();
    }, 500);
    this.listenToLoading();
  }

  loadPermissions() {
    this.branch_name = localStorage.getItem('branch_name');
    this.create_menu();
    this.sharedService.getUserPermissionList().subscribe(
      (data) => {
        this.permissionsService.loadPermissions(data);
        console.log(this.permissionsService.getPermissions());
        console.log(this.permissionsService.hasPermission("branch.view_branch"));
        this.roleService.addRoles(data);
        this.create_menu();

      },
      (error) => {
        console.log("Unable to load permissions");
      }
    )
  }

  /**
   * Listen to the loadingSub property in the LoadingService class. This drives the
   * display of the loading spinner.
   */
   listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  checkLogin(): any {
    if (localStorage.getItem('user_id') && localStorage.getItem('branch_id')) {
      return true;
    } else {
      return false;
    }
  }
  // has_permission(perm): any{
  //   let data = this.permissionsService.hasPermission(perm) .then((value:boolean)=>{console.log(value); return value})
  //   return data
  // }
  create_menu(): any {
    this.items = [
      {
        title: 'Dashboard',
        link: '/',
        icon: 'grid-outline'
      },
     {
       title: 'Admin',
       expanded: false,
       icon: 'person-add-outline',
      children: [
         {
           title: 'Branch',
           link: 'ManageBranchList', // goes into angular `routerLink`,
          //  hidden: this.check_permission('branch.view_branchuser'),
           icon: 'grid-outline'
         },
        //   {
        //     title: 'Offer Zone',
        //     link: 'OfferZone', // goes into angular `routerLink`,
        //     hidden: this.check_permission('branch.view_productcampaigns')
        //   },
        //  {
        //    title: 'Admin',
        //    link: 'AdminSite',
        //    hidden: this.check_permission('admin.view_logentry'),
        //    icon: 'person-add-outline',
        //  },
       ]

     },
     {
      title: 'Customer',
      expanded: false,
      icon: 'book-outline',
     children: [
      {
        title: 'Customer',
        link: 'CustomerList', // goes into angular `routerLink`,
        // hidden: this.check_permission('master.view_unitmaster'),
        icon: 'book-outline',
      },
    ]
    },
    {
      title: 'Service',
      expanded: false,
      icon: 'book-outline',
     children: [
      {
        title: 'Category',
        link: 'Category', // goes into angular `routerLink`,
        icon: 'book-outline',
      },
      {
        title: 'Sub-Category',
        link: 'Sub-Category', // goes into angular `routerLink`,
        icon: 'book-outline',
      },
      {
        title: 'Service',
        link: 'ServiceList', // goes into angular `routerLink`,
        // hidden: this.check_permission('master.view_unitmaster'),
        icon: 'book-outline',
      },
    ]
    },
    {
      title: 'Orders',
      expanded: false,
      icon: 'book-outline',
     children: [
      {
        title: 'Order',
        link: 'OrderList', // goes into angular `routerLink`,
        // hidden: this.check_permission('master.view_unitmaster'),
        icon: 'book-outline',
      },
    ]
    },
    {
      title: 'Payments',
      expanded: false,
      icon: 'book-outline',
     children: [
      {
        title: 'Payment',
        link: 'PaymentList', // goes into angular `routerLink`,
        // hidden: this.check_permission('master.view_unitmaster'),
        icon: 'book-outline',
      },
    ]
    },
    {
      title:'Reports',
      link:"ReportsList",
      icon: 'pie-chart-outline',
    
    }

    ]
  }


  check_permission(permission): boolean {
    console.log(permission);
    // this.permissionsService.hasPermission(permission).then(
    //   (value:boolean)=>{
    //     console.log(permission +' ' +value);
    //     // return value;
    //     this.has_permission = value;
    //   });
    if (this.permissionsService.getPermission(permission)) {
      return false;
    } else {
      return true;
    }
  }

}

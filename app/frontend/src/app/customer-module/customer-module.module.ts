import { AuthGuard } from '../shared/auth.gaurd';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbInputModule, NbLayoutModule, NbListModule, NbButtonModule, NbCardModule, NbToastrModule, NbDialogModule, NbUserModule, NbTabsetModule, NbSelectModule, NbDialogService, NbToastrService } from '@nebular/theme';
import { SharedModule } from '../shared/shared.module';
import { MainPipe } from '../pipe.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ImageUploadModule } from 'angular2-image-upload';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomerComponent}  from './customer/customer.component';
import { CustomerListComponent}  from './customer-list/customer-list.component';

const routes: Routes = [
  { path: 'Customer' , component: CustomerComponent,canActivate:[AuthGuard]},
  { path: 'CustomerList' , component: CustomerListComponent,canActivate:[AuthGuard]},   
];

@NgModule({
  declarations: [CustomerComponent, CustomerListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    SharedModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbButtonModule,
    NbCardModule,
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    NbUserModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    NbSelectModule,
    ImageUploadModule.forRoot(),
    MainPipe.forRoot(),
    NgxPermissionsModule.forRoot(),
  ],
  providers:[NbToastrService, NbDialogService],
  exports: []
})
export class CustomerModule { }

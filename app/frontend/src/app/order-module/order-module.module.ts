import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../shared/auth.gaurd';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbInputModule, NbLayoutModule, NbListModule, NbButtonModule, NbCardModule, NbToastrModule, NbDialogModule, NbUserModule, NbTabsetModule, NbSelectModule, NbDialogService, NbToastrService, NbStepperModule } from '@nebular/theme';
import { SharedModule } from '../shared/shared.module';
import { MainPipe } from '../pipe.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ImageUploadModule } from 'angular2-image-upload';
import { NgxPermissionsModule } from 'ngx-permissions';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  { path: 'Order' , component:OrderComponent,canActivate:[AuthGuard]},
  { path: 'OrderList' , component: OrderListComponent,canActivate:[AuthGuard]},   
];


@NgModule({
  declarations: [
    OrderListComponent,
    OrderComponent
  ],
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
    NbStepperModule,
  ],
  providers:[NbToastrService, NbDialogService],
  exports: []
})
export class OrderModule { }

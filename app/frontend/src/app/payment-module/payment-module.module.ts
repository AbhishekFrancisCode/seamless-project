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
import { PaymentComponent } from './payment/payment.component';
import { PaymentListComponent } from './payment-list/payment-list.component';

const routes: Routes = [
  { path: 'Payment' , component:PaymentComponent,canActivate:[AuthGuard]},
  { path: 'PaymentList' , component: PaymentListComponent,canActivate:[AuthGuard]},   
];

@NgModule({
  declarations: [
    PaymentComponent,
    PaymentListComponent
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
export class PaymentModule { }

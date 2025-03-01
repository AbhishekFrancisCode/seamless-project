import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { PaymentComponent } from './payment/payment.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderListComponent } from './order-list/order-list.component';
import { ServiceShowComponent } from './service-show/service-show.component';
import { PaymentIndipaiseGatewayComponent } from './payment-indipaise-gateway/payment-indipaise-gateway.component';
import { PaymentRazorGatewayComponent } from './payment-razor-gateway/payment-razor-gateway.component';
import { ThankYouPageComponent} from './thank-you-page/thank-you-page.component'

const routes: Routes = [
  {path:'PaymentsList', component: OrderListComponent},
  {path:'ServiceList', component: ServiceListComponent},
  {path:'ServiceForm', component: ServiceFormComponent},
  {path:'Payments', component: PaymentComponent},
  {path:'ServiceShow', component: ServiceShowComponent},
  {path:'PaymentGateway', component: PaymentRazorGatewayComponent},
  {path:'OrderSummary', component: ThankYouPageComponent}
  ];

@NgModule({
  declarations: [
    ServiceListComponent,
    ServiceFormComponent,
    PaymentComponent,
    OrderListComponent,
    ServiceShowComponent,
    PaymentIndipaiseGatewayComponent,
    PaymentRazorGatewayComponent,
    ThankYouPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class ServiceModule { }

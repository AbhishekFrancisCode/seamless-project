import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbToastrModule, NbToastrService, NbSidebarModule, NbMenuModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { NbDatepickerModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer-module/customer-module.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './shared/jwt.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPipe } from './pipe.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { ReportsModule } from './reports/reports.module'
import { ServiceModule} from './service-module/service-module.module';
import { OrderModule } from './order-module/order-module.module';
import { PaymentModule } from './payment-module/payment-module.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgxPrintModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    MainPipe.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    NbToastrModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbSelectModule,
    NbDatepickerModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    AdminModule,
    ChartsModule,
    ReportsModule,
    NbSpinnerModule,
    CustomerModule,
    ServiceModule,
    OrderModule,
    PaymentModule,

  ],
  providers: [DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
  },NbToastrService],
  bootstrap: [AppComponent]
})
export class AppModule { }

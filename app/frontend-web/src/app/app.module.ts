import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { OurservicesComponent } from './components/ourservices/ourservices.component';
import { CareersComponent } from './components/careers/careers.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { TeamComponent } from './components/team/team.component';
import { ServiceModule } from './service/service.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { VisionComponent } from './components/vision/vision.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AboutComponent } from './components/about/about.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { RefundComponent } from './components/refund/refund.component';
import { JwtInterceptor } from './shared/jwt.interceptor';
// import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SitemapComponent } from './components/sitemap/sitemap.component';
// import { ServicesComponent } from './components/services/services.component';


@NgModule({
  declarations: [
    AppComponent,
    VisionComponent,
    AboutComponent,
    PrivacyComponent,
    RefundComponent,
    // SitemapComponent,    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // NzNotificationModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    ServiceModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

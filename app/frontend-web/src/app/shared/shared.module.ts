import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
 
import { RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from '../components/aboutus/aboutus.component';
import { CareersComponent } from '../components/careers/careers.component';
import { ContactComponent } from '../components/contact/contact.component';
import { JobDetailComponent } from '../components/job-detail/job-detail.component';
import { LoginComponent } from '../components/login/login.component';
import { OurservicesComponent } from '../components/ourservices/ourservices.component';
import { TeamComponent } from '../components/team/team.component';
// import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HomeComponent } from '../components/home/home.component';
import { MainComponent } from './main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
 
  // {path:'ServiceForm', component: ServiceFormComponent},
  {path:'', component: MainComponent},
  ];

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    AboutusComponent,
    OurservicesComponent,
    CareersComponent,
    ContactComponent,
    LoginComponent,
    JobDetailComponent,
    TeamComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // MatSnackBarModule,
    // BrowserAnimationsModule,
    FormsModule,
    // BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule,HeaderComponent,FooterComponent]
})
export class SharedModule { }

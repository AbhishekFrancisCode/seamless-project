import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FooterComponent} from './shared/footer/footer.component'
import { HeaderComponent } from './shared/header/header.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { TeamComponent } from './components/team/team.component';
import { CareersComponent } from './components/careers/careers.component';
import { OurservicesComponent } from './components/ourservices/ourservices.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { VisionComponent } from './components/vision/vision.component';
import { AboutComponent } from './components/about/about.component';
import { TermsComponent } from './components/terms/terms.component';
import { ServicesComponent } from './components/services/services.component';
import { SitemapComponent } from './components/sitemap/sitemap.component';
import { ServiceListComponent } from './service/service-list/service-list.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { RefundComponent } from './components/refund/refund.component';

const routes: Routes = [
  // {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path:'vision',component: VisionComponent},
  {path: 'team', component: TeamComponent},
  {path:'ourservices',component: OurservicesComponent},
  {path:'careers',component: CareersComponent},
  {path:'contact',component: ContactComponent},
  {path:'jobdetails',component: JobDetailComponent},
  {path:'terms', component: TermsComponent},
  {path:'ServiceList', component: ServiceListComponent},
  {path:'services', component: ServicesComponent},
  {path:'sitemap', component: SitemapComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'refund', component: RefundComponent},

  // {path:'login', component: LoginComponent }
  // {path:'vision', component: VisionComponent },
// {path:'contact', component: ContactComponent},
// {path:'', component: FooterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

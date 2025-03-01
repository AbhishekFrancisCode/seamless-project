import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceComponent } from './service/service.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth.gaurd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NbButtonModule, NbCardModule, NbDialogModule, NbDialogService, NbInputModule, NbLayoutModule, NbListModule, NbSelectModule, NbTabsetModule, NbToastrModule, NbToastrService, NbUserModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ImageUploadModule } from 'angular2-image-upload';
import { MainPipe } from '../pipe.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';

const routes: Routes = [
  { path: 'Service' , component: ServiceComponent,canActivate:[AuthGuard]},
  { path: 'ServiceList' , component: ServiceListComponent,canActivate:[AuthGuard]},

  // { path: 'CategoryList' , component:  CategoryListComponent,canActivate:[AuthGuard]},

  { path: 'Category' , component:  CategoryComponent,canActivate:[AuthGuard]},
  { path: 'Sub-Category' , component:  SubCategoryComponent,canActivate:[AuthGuard]},
];

@NgModule({
  declarations: [
    ServiceListComponent,
    ServiceComponent,
    CategoryComponent,
    SubCategoryComponent,
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
  ],
  providers:[NbToastrService, NbDialogService],
  exports: []
})

export class ServiceModule {
  
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportHomeComponent } from './report-home/report-home.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth.gaurd';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbListModule, NbMenuModule } from '@nebular/theme';
import { ReportsListComponent } from './reports-list/reports-list/reports-list.component';
import { ReportViewerComponent } from './report-viewer/report-viewer/report-viewer.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';




const routes: Routes = [
  { path: 'ReportsList' , component: ReportsListComponent,canActivate:[AuthGuard]},
  { path: 'ReportViewer' , component: ReportViewerComponent, canActivate:[AuthGuard]},
]

@NgModule({

  declarations: [ReportHomeComponent, ReportsListComponent, ReportViewerComponent],
  imports: [
    CommonModule,
    NbButtonModule,
    NbCardModule,
    NbListModule,
    FormsModule,
    NbMenuModule.forRoot(),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    TableModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    AccordionModule,
    DropdownModule,
    MultiSelectModule,
  ]
})
export class ReportsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardDefaultComponent } from './dashboard-default.component'
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ChartModule } from 'angular2-chartjs';
// import {StatementComponent} from './statement/statement.component';
import { DtpModule } from '../../../shared/component/dtp/dtp.module';
import { MaterialModule } from '../../material/material.module';

export const DashboardDefaultRoutes: Routes = [
  {
    path: '',
    component: DashboardDefaultComponent,
    data: {
      breadcrumb: 'Dashboard',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(DashboardDefaultRoutes),
    SharedModule,
    ChartModule,
    MaterialModule,
    DtpModule
  ],
  declarations: [DashboardDefaultComponent]
})
export class DashboardDefaultModule { }

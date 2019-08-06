import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { StatementComponent } from './statement.component';
import { DtpModule } from '../../shared/component/dtp/dtp.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { StatementOfAccountComponent } from './statementOfAccount/statementOfAccount.component';
import { TransactionStatusComponent } from './transactionStatus/transactionStatus.component';
export const StatementRoutes: Routes = [
  {
    path: '',
    component: StatementComponent,
    data: {
      breadcrumb: 'Statement',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'statementOfAccount',
    component: StatementOfAccountComponent,
    data: {
      breadcrumb: 'Statement Of Account',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'transactionStatus',
    component: TransactionStatusComponent,
    data: {
      breadcrumb: 'Transaction Status',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(StatementRoutes),
    SharedModule,
    DtpModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [StatementComponent,TransactionStatusComponent,StatementOfAccountComponent]
})
export class StatementModule { }

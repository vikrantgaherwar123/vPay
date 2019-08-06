import { HelpModule } from '../../shared/component/help/help.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatementOfTransactionComponent } from './StatementOfTransaction.component';
import { ClientWiseStatementComponent } from "./ClientWiseStatement/ClientWiseStatement.component";
import { InstitutionWiseStateComponent } from './InstitutionWiseState/InstitutionWiseState.component';
import { SubInstitutionWiseStateComponent } from './SubInstitutionWiseState/SubInstitutionWiseState.component';
import { DtpModule } from '../../shared/component/dtp/dtp.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { InputTypeModule } from '../../shared/directive/inputType/inputType.module';
import { MaterialModule } from '../material/material.module';

export const BillPaymentRoutes: Routes = [
  {
    path: '',
    component: StatementOfTransactionComponent,
    data: {
      breadcrumb: 'Statement Of Transaction',
      icon: '../../../assets/images/Statement.png',
      status: false
    }
  },
  {
    path: 'ClientWiseStatement',
    component: ClientWiseStatementComponent,
    data: {
      breadcrumb: 'Client Wise Statement',
      icon: '../../../assets/images/Statement.png',
      status: true
    }
  },
  {
    path: 'InstitutionWiseState',
    component: InstitutionWiseStateComponent,
    data: {
      breadcrumb: 'Institution Wise Statement',
      icon: '../../../assets/images/Statement.png',
      status: true
    }
  }
  ,
  {
    path: 'SubInstitutionWiseState',
    component: SubInstitutionWiseStateComponent,
    data: {
      breadcrumb: 'Sub Institution Wise Statement',
      icon: '../../../assets/images/Statement.png',
      status: true
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BillPaymentRoutes),
    FormsModule,
    ReactiveFormsModule,
    InputTypeModule,
    NgxQRCodeModule,
    DtpModule,
    MaterialModule

  ],
  declarations: [ClientWiseStatementComponent, StatementOfTransactionComponent, InstitutionWiseStateComponent, SubInstitutionWiseStateComponent]
})
export class StatementOfTransactionModule { }

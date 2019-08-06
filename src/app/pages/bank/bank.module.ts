import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { DtpModule } from '../../shared/component/dtp/dtp.module';
import { InputTypeModule } from '../../shared/directive/inputType/inputType.module';
import { BankComponent } from './bank.component';
import { OtpModule } from '../../shared/component/otp/otp.module';
import { TransactionAccountComponent } from './transactionAccount/transactionAccount.component';
import { ApprovalComponent } from './approval/approval.component';
import { RequestComponent } from './request/request.component';
import { MyCardComponent } from './myCard/myCard.component';
import { BeneficiaryMaintenanceComponent } from './beneficiaryMaintenance/beneficiaryMaintenance.component';
import { FundTransferComponent } from './bankFundTransfer/bankFundTransfer.component';
import { ImpsComponent } from './bankFundTransfer/imps/imps.component';
import { TPINComponent } from './TPIN/TPIN.component';
import { EnquiryComponent } from './enquiry/enquiry.component';
import {loanRequestComponent} from './request/loanRequest/loanRequest.component';
import {ReqDepositComponent} from './request/depositOpen/depositOpen.component'
import { bankHeaderComponent } from './bankHeader/bankHeader.component';
import { MailboxComponent } from './enquiry/Mailbox/Mailbox.component';
import {ATMCardComponent} from './myCard/atmCard/atmCard.component';
import {TopUpCardComponent} from  './myCard/topupCard/topupCard.component'
export const BankRoutes: Routes = [
  {
    path: '',
    component: BankComponent,
    data: {
      breadcrumb: 'Bank',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'bank',
    component: BankComponent,
    data: {
      breadcrumb: 'Bank',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'transAcc',
    component: TransactionAccountComponent,
    data: {
      breadcrumb: 'Transaction Account',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'approval',
    component: ApprovalComponent,
    data: {
      breadcrumb: 'Approval',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'request',
    component: RequestComponent,
    data: {
      breadcrumb: 'Request',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'loanReq',
    component: loanRequestComponent,
    data: {
      breadcrumb: 'Loan Request',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'depositOpen',
    component: ReqDepositComponent,
    data: {
      breadcrumb: 'Loan Request',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'myCard',
    component: MyCardComponent,
    data: {
      breadcrumb: 'My Card',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'beneficiaryMaintenance',
    component: BeneficiaryMaintenanceComponent,
    data: {
      breadcrumb: 'Beneficiary Maintenance',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'fundTransfer',
    component: FundTransferComponent,
    data: {
      breadcrumb: 'Fund Transfer',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'imps',
    component: ImpsComponent,
    data: {
      breadcrumb: 'IMPS Transfer',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'TPIN',
    component: TPINComponent,
    data: {
      breadcrumb: 'TPIN',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },{
    path: 'enquiry',
    component: EnquiryComponent,
    data: {
      breadcrumb: 'Enquiry',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'MailBox',
    component: MailboxComponent,
    data: {
      breadcrumb: 'Enquiry',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'bankHeader',
    component: bankHeaderComponent,
    data: {
      breadcrumb: 'bankHeader',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
];

@NgModule({
  imports: [
    CommonModule,
    OtpModule,
    RouterModule.forChild(BankRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DtpModule,
    InputTypeModule
  ],
  declarations: [BankComponent,TransactionAccountComponent,ApprovalComponent,
    RequestComponent,MyCardComponent,BeneficiaryMaintenanceComponent,
    FundTransferComponent,ImpsComponent,TPINComponent,EnquiryComponent,bankHeaderComponent,loanRequestComponent,ReqDepositComponent,MailboxComponent,ATMCardComponent,
    TopUpCardComponent,
  ]
})
export class BankModule { }

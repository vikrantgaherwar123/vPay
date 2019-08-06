import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BbpsComponent } from './bbps.component';
import { BbpsTransactionComponent } from './bbpsTransaction/bbpsTransaction.component';
import { registerComplaintComponent } from './regComplaint/regComplaint.component';
import { searchTransactionComponent } from './searchTran/searchTran.component';
import { BbpsPaymentComponent } from './bbpsPayment/bbpsPayment.component';
import { PaymentOptionModule } from '../../shared/component/paymentOption/paymentOption.module';
import { MaterialModule } from '../material/material.module';
import { DtpModule } from '../../shared/component/dtp/dtp.module';
import { OtpModule } from '../../shared/component/otp/otp.module';
import { InputTypeModule } from '../../shared/directive/inputType/inputType.module';
import { ComplaintStatusComponent} from './complaintStatus/complaintStatus.component';
import { MessageService } from "../../services/_shared/message.service";


export const BbpsRoutes: Routes = [


  {
    path: '',
    component: BbpsComponent,
    data: {
      breadcrumb: 'Bbps',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'bbps',
    component: BbpsComponent,
    data: {
      breadcrumb: 'Bbps',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'bbpsPayment',
    component: BbpsPaymentComponent,
    data: {
      breadcrumb: 'Bill Payment',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  },
  {
    path: 'bbpsTransaction',
    component: BbpsTransactionComponent,
    data: {
      breadcrumb: 'Bill Transaction',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
  , {
    path: 'registerComplaint',
    component: registerComplaintComponent,
    data: {
      breadcrumb: 'Register Complaint',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
  , {
    path: 'complaintStatus',
    component: ComplaintStatusComponent,
    data: {
      breadcrumb: 'Complaint Status',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
  , {
    path: 'searchTran',
    component: searchTransactionComponent,
    data: {
      breadcrumb: 'Search Transaction',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }


];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BbpsRoutes),
    FormsModule,
    ReactiveFormsModule,
    PaymentOptionModule,
    MaterialModule,
    DtpModule,
    OtpModule,
    InputTypeModule
    // DragulaModule.forRoot()
  ],
  declarations: [BbpsComponent,
    ComplaintStatusComponent,
    BbpsPaymentComponent,BbpsTransactionComponent, searchTransactionComponent,
    registerComplaintComponent],
    providers :[MessageService]
})
export class BbpsModule { }

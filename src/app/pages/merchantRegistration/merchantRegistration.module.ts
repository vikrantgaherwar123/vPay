import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MerchantRegistrationComponent } from './merchantRegistration.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {DtpModule } from '../../shared/component/dtp/dtp.module';
import {HelpModule} from '../../shared/component/help/help.module';
//import {ChartModule} from 'angular2-chartjs';
import {InputTypeModule} from '../../shared/directive/inputType/inputType.module';
import {MaterialModule} from '../material/material.module';
import {OtpModule} from '../../shared/component/otp/otp.module';

export const MerchantRegistrationRoutes: Routes = [
  {
    path: '',
    component: MerchantRegistrationComponent,
    data: {
      breadcrumb: 'Default',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(MerchantRegistrationRoutes),
    SharedModule,
    DtpModule,
    HelpModule,
    InputTypeModule,
    OtpModule,
    MaterialModule
  ],
  declarations: [MerchantRegistrationComponent]
})
export class MerchantRegistrationModule { }

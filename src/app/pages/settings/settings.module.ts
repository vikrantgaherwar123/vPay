import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DtpModule } from '../../shared/component/dtp/dtp.module';
import { OtpModule } from '../../shared/component/otp/otp.module';
import { HelpModule } from '../../shared/component/help/help.module';
import { SharedModule } from '../../shared/shared.module';
import { InputTypeModule } from '../../shared/directive/inputType/inputType.module';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '../material/material.module';

import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { CloseAccountComponent } from './closeAccount/closeAccount.component';
import { FundTransferComponent } from './fundtransfer/fundtransfer.component';
import { SetThumbDeviceComponent } from './setThumbDevice/setThumbDevice.component';
import { SetBankDetailsComponent } from './setBankDetails/setBankDetails.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting.component';



export const SettingRoutes: Routes = [
  {
    path: '',
    component: SettingComponent,
    data: {
      breadcrumb: 'Setting',
      icon: 'icofont-home bg-c-blue',
      status: false
    }
  }, {
    path: 'setting',
    component: SettingComponent,
    data: {
      breadcrumb: 'Setting',
      icon: '../../../assets/images/cardChpPa.png',
      status: false
    }
  }, {
    path: 'changePassword',
    component: ChangePasswordComponent,
    data: {
      breadcrumb: 'Change Password',
      icon: '../../../assets/images/cardChpPa.png',
      status: true
    }
  },
  {
    path: 'closeAccount',
    component: CloseAccountComponent,
    data: {
      breadcrumb: 'Close Account',
      icon: '../../../assets/images/closeAcc.png',
      status: true
    }
  },
  {
    path: 'fundtransfer',
    component: FundTransferComponent,
    data: {
      breadcrumb: 'Vpay Balance Transfer',
      icon: '../../../assets/images/bankdetails.png',
      status: false
    }
  },
  {
    path: 'setThumbDevice',
    component: SetThumbDeviceComponent,
    data: {
      breadcrumb: 'Set Finger Print Device',
      icon: '../../../assets/images/fingerprint.jpg',
      status: true
    }
  },
  {
    path: 'setBankDetails',
    component: SetBankDetailsComponent,
    data: {
      breadcrumb: 'Set Bank Details',
      icon: '../../../assets/images/bankdetails.png',
      status: true
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      breadcrumb: 'Profile',
      icon: '../../../assets/images/cardProfile.png',
      status: true
    }
  },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SettingRoutes),
    FormsModule,
    ReactiveFormsModule,
    InputTypeModule,
    HelpModule,
    DtpModule,
    OtpModule,
    HttpModule,
    SharedModule,
    MaterialModule,

  ],
  // entryComponents: [DialogOverviewExampleDialog],
  declarations: [ChangePasswordComponent, FundTransferComponent, SetBankDetailsComponent, ProfileComponent,
    SetThumbDeviceComponent, CloseAccountComponent, SettingComponent]
}) export class SettingtModule { }

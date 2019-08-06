import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpModule } from '../../shared/component/otp/otp.module';
import { LoginComponent } from './login/login.component';
import { BankLoginComponent } from './bankLogin/bankLogin.component';
// import {WithSocialComponent} from './registration/with-social/with-social.component';
import { SignupComponent } from './signup/signup.component';
//import {CorpSignupComponent} from './corpSignup/corpSignup.component';
import { ForgetUnlockComponent } from './forgetUnlock/forgetUnlock.component';
import { MessageService } from "../../services/_shared/message.service";
import { MaterialModule } from './../material/material.module';

import { InputTypeModule } from '../../shared/directive/inputType/inputType.module';
export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {
          breadcrumb: 'login'
          //icon: 'icofont-listine-dots bg-c-pink',
          //status: true
        }
      },
      {
        path: 'signup',
        component: SignupComponent,
        data: {
          breadcrumb: 'Signup'
        }
      },
      {
        path: 'bankLogin',
        component: BankLoginComponent,
        data: {
          breadcrumb: 'Signup'
        }
      },
      // {
      //   path: 'corporateSignup',
      //   component: CorpSignupComponent,
      //   data: {
      //     breadcrumb: 'CorporateSignup'
      //   }
      // },
      {
        path: 'forgetUnlock',
        component: ForgetUnlockComponent,
        data: {
          breadcrumb: 'forgetUnlock'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    FormsModule,
    ReactiveFormsModule,
    InputTypeModule,
    OtpModule,
    MaterialModule
  ],
  declarations: [LoginComponent, SignupComponent, ForgetUnlockComponent,BankLoginComponent],
  providers: [
    MessageService
  ]
})
export class AuthenticationModule { }

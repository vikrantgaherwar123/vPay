import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTypeModule } from '../../directive/inputType/inputType.module';
import {MaterialModule} from '../../../pages/material/material.module'
// import { MaterialModule } from '../../material/material.module';

import { Otp } from './otp.component';

@NgModule({
  imports: [CommonModule,FormsModule,RouterModule,InputTypeModule,  MaterialModule,],
  declarations: [Otp],
  exports: [Otp],
  providers: [
   
  ]
})
export class OtpModule {

}

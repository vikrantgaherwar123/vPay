import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { PaymentOptionComponent } from './paymentOption.component';
import { InputTypeModule} from '../../../shared/directive/inputType/inputType.module';

@NgModule({
  imports: [CommonModule,FormsModule,RouterModule,ReactiveFormsModule,NgxQRCodeModule,
    InputTypeModule],
  declarations: [PaymentOptionComponent],
  exports: [PaymentOptionComponent],
  providers: [
    
  ]
})
export class PaymentOptionModule {

}

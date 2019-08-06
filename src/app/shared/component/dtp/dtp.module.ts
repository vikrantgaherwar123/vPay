import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { dtp } from './dtp.component';

@NgModule({
  imports: [CommonModule,FormsModule,RouterModule,ReactiveFormsModule],
  declarations: [dtp],
  exports: [dtp],
  providers: [
    
  ]
})
export class DtpModule {

}

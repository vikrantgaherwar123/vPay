import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTypeDirective } from './input-type.directive';
import {NotificationsComponent} from '../../../pages/ui-elements/advance/notifications/notifications.component';
import { OnlyNumbersDirective } from './only-numbers.directive';

@NgModule({
  imports: [CommonModule,FormsModule,RouterModule],
  declarations: [InputTypeDirective, OnlyNumbersDirective],
  exports: [InputTypeDirective,OnlyNumbersDirective],
  providers: [
    NotificationsComponent
  ]
})
export class InputTypeModule {

}

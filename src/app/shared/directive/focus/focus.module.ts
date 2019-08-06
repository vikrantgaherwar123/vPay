import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FocusDirective } from './focus.directive';

@NgModule({
  imports: [CommonModule,FormsModule,RouterModule],
  declarations: [FocusDirective],
  exports: [FocusDirective],
  providers: [
   
  ]
})
export class FocusModule {

}

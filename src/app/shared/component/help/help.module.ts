import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FocusModule } from '../../directive/focus/focus.module';
import { Help } from './help.component';

@NgModule({
  imports: [CommonModule,FormsModule,RouterModule,FocusModule,ReactiveFormsModule],
  declarations: [Help],
  exports: [Help],
  providers: [
   
  ]
})
export class HelpModule {

}

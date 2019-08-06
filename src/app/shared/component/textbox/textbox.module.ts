// import { NgModule }      from '@angular/core';
// import { CommonModule }  from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { FocusDirective } from '../../directive/focus.directive'
// import { Textbox } from './textbox.component';

// @NgModule({
//   imports: [CommonModule,FormsModule,RouterModule],
//   declarations: [Textbox, FocusDirective],
//   exports: [Textbox],
//   providers: [
   
//   ]
// })
// export class TextboxModule {

// }



import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { FocusDirective } from '../../directive/focus.directive'
import { Textbox } from './textbox.component';

@NgModule({
  imports: [CommonModule,FormsModule,RouterModule],
  declarations: [Textbox],
  exports: [Textbox],
  providers: [
   
  ]
})
export class TextboxModule {

}

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InfiniteScrollerDirective } from './infiniteScroller.directive';
//import {NotificationsComponent} from '../../../pages/ui-elements/advance/notifications/notifications.component';

@NgModule({
  imports: [CommonModule,FormsModule,RouterModule],
  declarations: [InfiniteScrollerDirective],
  exports: [InfiniteScrollerDirective],
  providers: [
  //  NotificationsComponent
  ]
})
export class InfiniteScrollerModule {

}

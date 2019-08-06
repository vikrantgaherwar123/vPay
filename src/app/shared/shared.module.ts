import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ToggleFullscreenDirective } from './fullscreen/toggle-fullscreen.directive';
import { AccordionAnchorDirective } from './accordion/accordionanchor.directive';
import { AccordionLinkDirective } from './accordion/accordionlink.directive';
import { AccordionDirective } from './accordion/accordion.directive';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import {ScrollModule} from './scroll/scroll.module';
import { SlimScroll } from './slimscroll.directive';
import { MenuItems } from './menu-items/menu-items';
import { SpinnerComponent } from './spinner/spinner.component';
import { CardComponent } from './card/card.component';
import { CardRefreshDirective } from './card/card-refresh.directive';
import { CardToggleDirective } from './card/card-toggle.directive';
import { DataFilterPipe } from './element/data-filter.pipe';
import { DtpModule } from '../shared/component/dtp/dtp.module';
import { MaterialModule } from './../pages/material/material.module';
// import { DialogBoxComponent } from './component/dialogBox/dialogBox.component';
import { OtpModule } from './component/otp/otp.module';
import { PaymentOptionModule } from './component/paymentOption/paymentOption.module';
// import { AutoFocusDirective } from './directive/auto-focus/auto-focus.directive';

@NgModule({
  imports: [
    CommonModule,
    // ScrollModule,
    FormsModule,
    ReactiveFormsModule,
    DtpModule,
    OtpModule,
    NgbModule.forRoot(),
    PaymentOptionModule,
    MaterialModule
  ],
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    CardRefreshDirective,
    CardToggleDirective,
    SpinnerComponent,
    // DialogBoxComponent,
    CardComponent,
    DataFilterPipe,
    SlimScroll,
    // AutoFocusDirective
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    CardRefreshDirective,
    CardToggleDirective,
    SlimScroll,
    //  ScrollModule,
    NgbModule,
    SpinnerComponent,
    CardComponent,
    DataFilterPipe
  ],
  providers: [
    MenuItems
  ]
})
export class SharedModule { }

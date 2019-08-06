import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//import { Http, ConnectionBackend } from '@angular/http';
import { AppRoutes } from './app.routing';
import { ToastyModule } from 'ng2-toasty';
import { AppComponent } from './app.component';
import { AdminComponent } from './layout/admin/admin.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbsComponent } from './layout/admin/breadcrumbs/breadcrumbs.component';
import { TitleComponent } from './layout/admin/title/title.component';
import { AuthComponent } from './layout/auth/auth.component';
import { HomeModule } from '../app/pages/home/home.module';
import { ApiService } from './core/api.service';
import { HttpClientModule } from '@angular/common/http';
import { DataStorage } from './core/dataStorage';
import { ErrorHandler } from './core/errorHandler';
import { Toast } from './services/toast';
import { GlobalState } from './global.state';
//import {DashboardDefaultModule} from './pages/dashboard/dashboard-default.module';
//import {BillPaymentModule} from './pages/billPayment/billPayment.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
// import { NgVirtualKeyboardModule } from '@protacon/ng-virtual-keyboard';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MaterialModule } from './pages/material/material.module';
// import {SafeHtmlPipe} from './safeHtml.pipe';
import {AutoFocusDirective } from './shared/directive/auto-focus/auto-focus.directive';
import { ConfirmDialogComponent } from "./shared/component/confirm-dialog/confirm-dialog.component";
import { from } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material';
// import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
// import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
//import { SliderModule } from 'angular-image-slider';
// import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { SliderModule } from './pages/products/slider/slider.module';
import { Ng2PanZoomModule } from 'ng2-panzoom';

//import { StorageServiceModule } from 'ngx-webstorage-service';
//import { NewProductService } from './new-product.service';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    BreadcrumbsComponent,
    TitleComponent,
    AuthComponent,
    AutoFocusDirective,
    //StorageServiceModule,
    //NewProductService
    // SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    // NgVirtualKeyboardModule,
    BrowserAnimationsModule, Ng2PanZoomModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes),
    ClickOutsideModule,
    HttpClientModule,
    ToastyModule.forRoot(),
    SharedModule,
    HomeModule,
    NgxQRCodeModule,
    MaterialModule,
    SliderModule,
    NgxImageZoomModule.forRoot(), // <-- Add this line
    
  ],
  entryComponents:[ConfirmDialogComponent],

  providers: [ApiService, DataStorage,
    ConfirmDialogComponent, ErrorHandler, 
    Toast, GlobalState, NgxImageZoomModule,
    //NewProductService,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }


// platformBrowserDynamic().bootstrapModule(AppModule);
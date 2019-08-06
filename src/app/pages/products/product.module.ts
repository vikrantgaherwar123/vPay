import { NgModule } from '@angular/core';
import * as $ from 'jquery';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DtpModule } from '../../shared/component/dtp/dtp.module';
import { HelpModule } from '../../shared/component/help/help.module';
import { InputTypeModule } from '../../shared/directive/inputType/inputType.module';
import { InfiniteScrollerModule } from '../../shared/directive/infiniteScroller/infiniteScroller.module';
import { ProductSaleComponent } from './productSale/productSale.component';
import { ProductTypeMasterComponent } from './productTypeMaster/productTypeMaster.component';
import { ProductMasterComponent } from './productMaster/productMaster.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { FilterPipe } from '../../shared/directive/pipe/product-filter.pipe';
import { PaymentOptionModule } from '../../shared/component/paymentOption/paymentOption.module';
import { MaterialModule } from '../material/material.module';
import { ProductComponent } from './product.component';
// import { SliderModule } from 'angular-image-slider';
import { SliderModule } from './slider/slider.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
// import { SliderComponent } from './slider/slider.component';



export const ProductRoutes: Routes = [


    {
        path: '',
        component: ProductComponent,
        data: {
            breadcrumb: 'Product',
            //   icon: 'icofont-home bg-c-blue',
            status: false
        }
    }, {
        path: 'products',
        component: ProductComponent,
        data: {
            breadcrumb: 'Product',
            //   icon: '../../../assets/images/cardChpPa.png',
            status: false
        }
    },
    {
        path: 'productSale',
        component: ProductSaleComponent,
        data: {
            breadcrumb: 'Product Sale',
            status: false
        }

    },
    {
        path: 'productTypeMaster',
        component: ProductTypeMasterComponent,
        data: {
            breadcrumb: 'Product Type Master',
            icon: '../../../assets/images/productIco.png',
            status: false
        }
    },
    {
        path: 'productMaster',
        component: ProductMasterComponent,
        data: {
            breadcrumb: 'Product Master',
            icon: '../../../assets/images/productIco.png',
            status: false
        }
    },

    {
        path: 'product-details',
        component: ProductDetailsComponent
    },

    {
        path: 'product-checkout',
        component: ProductCheckoutComponent
    },


];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProductRoutes),
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        DtpModule, HelpModule, InputTypeModule,
        InfiniteScrollerModule,
        NgxQRCodeModule,
        PaymentOptionModule,
        SliderModule,
        
        
        
    ],
    declarations: [ProductComponent,
        ProductSaleComponent,
        ProductTypeMasterComponent,
        ProductMasterComponent,
        FilterPipe,
        ProductDetailsComponent,
        ProductCheckoutComponent,
        // SliderComponent
    ]
})
export class ProductModule { }

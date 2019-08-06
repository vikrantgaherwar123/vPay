import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DtpModule } from '../../shared/component/dtp/dtp.module';


import { ReceiveMoneyComponent } from "./receiveMoney/receiveMoney.component";
import { SendMoneyComponent } from "./sendMoney/sendMoney.component";

//Receive Money
import { AadharComponent } from './receiveMoney/aadhar/aadhar.component';
import { CollectionComponent } from './receiveMoney/upi/collection/collection.component';
import { PaymentGatewayComponent } from './receiveMoney/paymentGateway/paymentGateway.component';
import { CheckStatusComponent } from './receiveMoney/upi/checkStatus/checkStatus.component';
import { FixQrCodeComponent } from './receiveMoney/upi/fixQrCode/fixQrCode.component';
import { QrCodeComponent } from './receiveMoney/upi/qrCode/qrCode.component';

//Send Money

import { SendAadharComponent } from './sendMoney/aadhar/aadhar.component';
import { SendCollectionComponent } from './sendMoney/collection/collection.component';
import { SendPaymentGatewayComponent } from './sendMoney/paymentGateway/paymentGateway.component';

import { MaterialModule } from '../material/material.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { InputTypeModule } from '../../shared/directive/inputType/inputType.module';

export const BillPaymentRoutes: Routes = [

  //Receive Money
  {
    path: '',
    children: [
      {
        path: 'receiveMoney',
        component: ReceiveMoneyComponent,
        data: {
          breadcrumb: 'Receive Money',
          icon: 'icofont-home bg-c-blue',
          status: false
        }
      },
      //Send Money
      {
        path: 'sendMoney',
        component: SendMoneyComponent,
        data: {
          breadcrumb: 'Send Money',
          icon: 'icofont-home bg-c-blue',
          status: false
        }
      },

      //Receive  Money Component
      {
        path: 'receiveMoney/aadhar',
        component: AadharComponent,
        data: {
          breadcrumb: 'Aadhar Pay',
          icon: '../../../assets/images/Aadhar.svg',
          status: true
        }
      },
      {
        path: 'receiveMoney/paymentGateway',
        component: PaymentGatewayComponent,
        data: {
          breadcrumb: 'Payment Gateway',
          icon: '../../../assets/images/app-08.svg',
          status: true
        }
      }, {
        path: 'receiveMoney/checkStatus',
        component: CheckStatusComponent,
        data: {
          breadcrumb: 'Check Status',
          icon: '../../../assets/images/checkStatus.png',
          status: true
        }
      },
      {
        path: 'receiveMoney/collection',
        component: CollectionComponent,
        data: {
          breadcrumb: 'collection',
          icon: '../../../assets/images/app-03.svg',
          status: true
        }
      },
      {
        path: 'receiveMoney/fixQrCode',
        component: FixQrCodeComponent,
        data: {
          breadcrumb: 'fix QR Code',
          icon: 'icofont-home bg-c-blue',
          status: false
        }
      },
      {
        path: 'receiveMoney/qrCode',
        component: QrCodeComponent,
        data: {
          breadcrumb: 'QR Code',
          icon: '../../../assets/images/qr-img.png',
          status: true
        }
      },

      // Send Money Component

      {
        path: 'sendMoney/aadharpay',
        component: SendAadharComponent,
        data: {
          breadcrumb: 'Aadhar Pay',
          icon: '../../../assets/images/Aadhar.svg',
          status: true
        }
      },
      {
        path: 'sendMoney/paymentGatewaypay',
        component: SendPaymentGatewayComponent,
        data: {
          breadcrumb: 'Payment Gateway',
          icon: '../../../assets/images/app-08.svg',
          status: true
        }
      },
      {
        path: 'sendMoney/collectionpay',
        component: SendCollectionComponent,
        data: {
          breadcrumb: 'collection',
          icon: '../../../assets/images/app-03.svg',
          status: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BillPaymentRoutes),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    InputTypeModule,
    NgxQRCodeModule,
    DtpModule
  ],

  declarations: [
    ReceiveMoneyComponent, SendMoneyComponent,
    AadharComponent, PaymentGatewayComponent, CheckStatusComponent, CollectionComponent,
    FixQrCodeComponent, QrCodeComponent, SendAadharComponent, SendCollectionComponent, SendPaymentGatewayComponent
  ]
})
export class BillPaymentModule { }

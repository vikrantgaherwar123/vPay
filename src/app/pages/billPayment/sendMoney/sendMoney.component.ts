import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Spinner } from '../../../services/spinner';
import { DataStorage } from "../../../core/dataStorage";
import { Common } from '../../../services/common';
import { ILogin } from "../../../interface/login";

@Component({
  selector: 'app-sendMoney',
  templateUrl: './sendMoney.component.html',
  styleUrls: [
    './sendMoney.component.scss'
  ],
  providers: [],
})
export class SendMoneyComponent implements OnInit {
  logInfo: ILogin;
  aeps_terminal_id: any;
  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  tab3: any;
  termCondContent: string;
  AadharPay: boolean = false;
  Collection: boolean = false;
  PaymentGateway: boolean = false;
  constructor(private router: Router, private dataStorage: DataStorage, private spinner: Spinner, private common: Common) { }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.aeps_terminal_id = this.logInfo[0].AEPS_TERMINAL_ID;
    if (this.aeps_terminal_id == undefined || this.aeps_terminal_id == null || this.aeps_terminal_id == '') {
      this.ChangeMenu('Collection');
    } else
      this.ChangeMenu('AadharPay');
  }


  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "29", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }




  gotoAadharPay() {
    this.router.navigate(['/billPayment/sendMoney/aadharpay']);
  }
  gotoCollection() {
    this.router.navigate(['/billPayment/sendMoney/collectionpay']);
  }
  gotoPaymentGateway() {
    this.router.navigate(['/billPayment/sendMoney/paymentGatewaypay']);
  }



  ChangeMenu(menu) {
    if (menu == "AadharPay") {
      this.tab = 'tab1';
      this.AadharPay = true;
      this.Collection = false;
      this.PaymentGateway = false;

    }

    else if (menu == "Collection") {
      this.tab = 'tab2';
      this.AadharPay = false;
      this.Collection = true;
      this.PaymentGateway = false;
    }

    else if (menu == "PaymentGateway") {
      this.tab = 'tab3';
      this.AadharPay = false;
      this.Collection = false;
      this.PaymentGateway = true;
    }

  }
}



import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataStorage } from "../../../core/dataStorage";
import { Spinner } from '../../../services/spinner';
import { Common } from '../../../services/common';
import { ILogin } from "../../../interface/login";


@Component({
  selector: 'app-receiveMoney',
  templateUrl: './receiveMoney.component.html',
  styleUrls: [
    './receiveMoney.component.scss'
  ],
  providers: [],
})
export class ReceiveMoneyComponent implements OnInit {
  logInfo: ILogin;
  aeps_terminal_id: any;
  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  tab3: any;
  tab4: any;
  tab5: any;
  tab6: any;
  termCondContent: string;

  AadharPay: boolean = false;
  CheckStatus: boolean = false;
  Collection: boolean = false;
  FixQrCode: boolean = false;
  QrCode: boolean = false;
  PaymentGateway: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private dataStorage: DataStorage, private spinner: Spinner, private common: Common) { }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.aeps_terminal_id = this.logInfo[0].AEPS_TERMINAL_ID;
    if (this.aeps_terminal_id == undefined || this.aeps_terminal_id == null || this.aeps_terminal_id == '') {
      this.ChangeMenu('CheckStatus');
    } else
      this.ChangeMenu('AadharPay');



    if (this.route.queryParams["_value"].ID == 'upi') {
      this.ChangeMenu('Collection');
    } else if (this.route.queryParams["_value"].ID == 'paymentGateway')
      this.ChangeMenu('PaymentGateway');

  }

  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "28", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }



  gotoAadharPay() {
    this.router.navigate(['/billPayment/receiveMoney/aadhar']);
  }
  gotoCheckStatus() {
    this.router.navigate(['/billPayment/receiveMoney/checkStatus']);
  }
  gotoCollection() {
    this.router.navigate(['/billPayment/receiveMoney/collection']);
  }
  gotoPaymentGateway() {
    this.router.navigate(['/billPayment/receiveMoney/paymentGateway']);
  }
  gotoFixQrCode() {
    this.router.navigate(['/billPayment/receiveMoney/fixQrCode']);
  }
  gotoQrCode() {
    this.router.navigate(['/billPayment/receiveMoney/qrCode']);
  }
  // if (p == 'Mobile') {
  //   this.router.navigate(['/bbps/mobileRecharge']);
  // }
  // if (p == 'Gas') {
  //   this.router.navigate(['/bbps/gasBillPay']);
  // }


  ChangeMenu(menu) {
    this.clearPage();
    if (menu == "AadharPay") {
      this.tab = 'tab1';
      this.AadharPay = true;
    }
    else if (menu == "CheckStatus") {
      this.tab = 'tab2';
      this.CheckStatus = true;
    }
    else if (menu == "Collection") {
      this.tab = 'tab3';
      this.Collection = true;
    }
    else if (menu == "FixQrCode") {
      this.tab = 'tab4';
      this.FixQrCode = true;
    }
    else if (menu == "QrCode") {
      this.tab = 'tab5';
      this.QrCode = true;
    }
    else if (menu == "PaymentGateway") {
      this.tab = 'tab6';
      this.PaymentGateway = true;
    }
  }

  clearPage() {
    this.PaymentGateway = false;
    this.AadharPay = false;
    this.CheckStatus = false;
    this.Collection = false;
    this.FixQrCode = false;
    this.QrCode = false;
  }
}



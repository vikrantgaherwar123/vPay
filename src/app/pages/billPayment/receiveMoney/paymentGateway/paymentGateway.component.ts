import { Component, OnInit,Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ICore } from '../../../../interface/core';
import { ILogin } from '../../../../interface/login';
import { IAadhar } from '../../../../interface/aadhar';
import { IBillCollectionUPI } from '../../../../interface/billCollectionUPI';
import { ApiService } from '../../../../core/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DataStorage } from '../../../../core/dataStorage';
// import { dtp } from '../../shared/component/dtp/dtp.component';
import { IPayment } from '../../../../interface/payment';
import { ErrorHandler } from '../../../../core/errorHandler';
import { Common } from '../../../../services/common';
import { InputTypeDirective } from '../../../../shared/directive/inputType/input-type.directive';
import { Spinner } from '../../../../services/spinner';
import { Toast } from '../../../../services/toast';

import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'R-vgipl-paymentGateway',
  templateUrl: './paymentGateway.html',
  providers: [Spinner, Common]
})

export class PaymentGatewayComponent implements OnInit {
  termCondContent: string;
  public PaymentGatewayUrl: SafeResourceUrl;
  virtualaddress: string;
  amount: string;
  logInfo: ILogin;
  code: number;
  msg: string = "";
  data: Array<any>;
  po_res_desc: string;
  clientMstId: number;
  VPA: string;
  PaymentRemarks: any = '';
  billNumber: string;

  msgshowhide: string = '';
  DisplayMsg: string = '';

  showOtherInfo: boolean = false;
  TCchek: boolean = true;

  option = {
    position: 'top-center',
    showClose: true,
    timeout: 5000,
    theme: 'bootstrap',
    type: 'error',
    closeOther: false,
    msg: ''
  }

  //---Pament gateway---------------------------------//
  encryptedkey: string; merchantid: number; submerchantid: number; returnurl: string;
  customername: string; billnumber: string; gstnumber: string;
  tranamount: string; refno: string; oURl: string; Encryurl: string;
  resultdata: Array<any>;
  d: string; ENCRYPTURL: any; ORIGINALURL: any;

  //dialog
  title;
  message;
  information;
  button;
  style;
  allow_outside_click;
  width;
  buttons = [
    { value: MessageBoxButton.Ok, display: "Ok" },
    { value: MessageBoxButton.OkCancel, display: "Ok/Cancel" },
    { value: MessageBoxButton.YesNo, display: "Yes/No" },
    { value: MessageBoxButton.AcceptReject, display: "Accept/Reject" }
  ];
  style_full = MessageBoxStyle.Full;
  style_simple = MessageBoxStyle.Simple;
  subscriber: Subscription;



  constructor(public domSanitizer: DomSanitizer, private dialog: MatDialog, private apiService: ApiService, private router: Router, private dataStorage: DataStorage,
    private errorHandler: ErrorHandler,private renderer2: Renderer2, private toast: Toast, private spinner: Spinner, private common: Common) {

  }
  Submit() { }
  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    //  this.PaymentRemarks = this.logInfo[0].CLIENT_NAME + '-' + this.logInfo[0].CITY_NAME;
    this.PaymentRemarks = this.logInfo[0].CLIENT_NAME + (this.logInfo[0].CITY_NAME ? ('-' + this.logInfo[0].CITY_NAME) : '');
    this.Get_PaymentSettings();
    const amt = this.renderer2.selectRootElement('#amt');
    setTimeout(() => amt.focus(), 0);
  }
  termConditions() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "3", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }



  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "5", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }
  showOthInfo(e) {
    if (e.srcElement.checked == true)
      this.showOtherInfo = true;
    else {
      this.showOtherInfo = false;
    }
  }

  setAmountFormat() {
    if (parseFloat(this.tranamount))
      this.tranamount = parseFloat(this.tranamount).toFixed(2);

  }

  //# START Payment Gateway  ------------------------------

  Get_PaymentSettings() {
    this.clear();
    var uinput = {
      opKeyword: "GETPAYSETMST",
    }
    this.spinner.show();
    this.apiService.sendToServer<IPayment>('/api/paymentgateway/PaymentSettings', uinput, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg !== 'Success') {

      }
      if (data && data.msg === 'Success') {
        var result = data.cursor1[0];
        if (result) {
          this.encryptedkey = result.ENCRY_KEY;
          this.merchantid = result.MERCHANT_ID;
          this.submerchantid = result.SUB_MERCHANT_ID;
          this.returnurl = result.RETURN_URL;
        }
      }
      else {

      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }

  CallbackClear() {
    this.customername = ''; this.billnumber = ''; this.gstnumber = '';
    this.tranamount = null;
  }

  ValidateData() {
    if (this.tranamount == '' || this.tranamount == undefined) {
      this.message = "Enter Transaction Amount.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (parseFloat(this.tranamount) == 0) {
      this.message = "Transaction Amount must be greater than Zero.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (!this.TCchek) {
      this.message = "Please check Terms and conditions.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
  }

  GenerateRequest() {
    if (this.ValidateData() === false) {
      return;
    }

    this.Get_ReferenceNo();
  }

  Get_ReferenceNo() {
    this.refno = '';
    var uinput = {
      opKeyword: 'GETREFNO',
    }
    this.spinner.show();
    let pageObj = this;
    this.apiService.sendToServer<IPayment>('/api/paymentgateway/ReferenceNo', uinput, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg !== 'Success') {

      }
      if (data && data.msg === 'Success') {
        this.refno = data.result;
        this.Process(pageObj);
      }
      else {

      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }

  Save_PGRequest(pageObj) {
    //let logInfo: ILogin = this.dataStorage.logInfo;
    if (pageObj.logInfo && pageObj.logInfo[0].CLIENT_MST_ID > 0) {
      var uinput = {
        opKeyword: 'PAYGATEREQ',
        pay_gate_req_id: 0,
        client_mst_id: pageObj.logInfo[0].CLIENT_MST_ID,
        eazypay_merchant_id: pageObj.merchantid,
        reference_no: pageObj.refno,
        sub_merchant_id: pageObj.submerchantid,
        tran_amount: pageObj.tranamount,
        amount_1: 0, amount_2: 0, amount_3: 0, amount_4: 0,
        return_url: pageObj.returnurl,
        before_encry: pageObj.ORIGINALURL, after_encry: pageObj.ENCRYPTURL,
        bill_number: pageObj.billnumber,
        // bill_number:  pageObj.logInfo[0].CLIENT_MST_ID + '~' + pageObj.billnumber,
        customer_name: pageObj.customername,
        gst_number: pageObj.gstnumber,
      }
      this.spinner.show();
      this.apiService.sendToServer<IPayment>('/api/paymentgateway/SaveRequest', uinput, this).subscribe(

        data => {
          this.spinner.hide();
          if (data && data.msg === 'Success') {
            this.PaymentGatewayUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.ENCRYPTURL);
            window.open(this.ENCRYPTURL, "_blank");
          }
          else {

          }
        },
        err => {
          this.spinner.hide();
          this.errorHandler.handlePageError(err);
        },
      );
    }
  }

  clear() {
    this.amount = null;
    // this.PaymentRemarks = '';
    this.billNumber = '';
    this.VPA = '';
    //payment gateway------------
    this.encryptedkey = '';
    this.returnurl = '';
    this.merchantid = 0;
    this.submerchantid = 0;
    //---------------------------

  }


  CheckResponseofRequest() {

  }

  Process(pageObj) {
    var currentDate = new Date();
    var cd = '';
    cd = currentDate.toString().split(' ')[4].replace(':', '').replace(':', '') + currentDate.toString().split(' ')[2]; // + currentDate.toString().split(' ')[3]

    var uinput = {
      ENCRYPTEDKEY: this.encryptedkey,
      MERCHANT_ID: this.merchantid,
      SUB_MERCHANT_ID: this.submerchantid,
      REFERENCE_NO: this.refno, // cd, //TODO - Use Instant Generated
      TRANSACTION_AMOUNT: this.tranamount,
      MOBILE_NO: '',
      AMOUNT_1: 0,
      AMOUNT_2: 0,
      AMOUNT_3: 0,
      AMOUNT_4: 0,
      PAYMENT_MODE: 9,
      RETURN_URL: this.returnurl,
    }
    this.spinner.show();
    this.apiService.sendToServer<IPayment>('/api/paymentgateway/RequestResponse', uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data) {
          //this.ENCRYPTURL = data.d;
          //var res = data.d;
          var res = data.d;
          if (res) {
            // this.ORIGINALURL = res[2];
            // this.ENCRYPTURL = res[3];
            debugger;
            this.ORIGINALURL = JSON.parse(res).oURl;
            this.ENCRYPTURL = JSON.parse(res).Encryurl;

            this.Save_PGRequest(pageObj);
            //window.open(this.ENCRYPTURL);
          }

        }
        else {
          if (data) {
            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
            // this.option.msg=data.msg;
            // this.toast.addToast(this.option);

          }
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
    );
  }

  //# END Payment Gateway----------------------------------------------



  //send payment





}
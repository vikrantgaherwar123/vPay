import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';

import { ErrorHandler } from '../../../../../core/errorHandler';
import { Spinner } from '../../../../../services/spinner';
import { ApiService } from '../../../../../core/api.service';
import { DataStorage } from '../../../../../core/dataStorage';
// import { dtp } from '../../../../shared/component/dtp/dtp.component';
import { Router } from '@angular/router';
import { ICore } from '../../../../../interface/core';
import { ILogin } from '../../../../../interface/login';
import { Common } from '../../../../../services/common';
import { IBillCollectionUPI } from '../../../../../interface/billCollectionUPI';
import * as moment from 'moment';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
import { Toast } from '../../../../../services/toast';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
declare const $: any;
@Component({
  selector: 'R-vgipl-qrCode',
  templateUrl: './qrCode.html',
  styleUrls: ['./qrCode.scss'],
  providers: [Spinner]
})

export class QrCodeComponent implements OnInit {
  // @ViewChild(dtp) dtp: dtp; SetControlValue: string; _gatewaydetid: number = 0;
  login_user_id: string;
  value: string = 'Techiediaries';
  successDialoage: boolean = false;
  failureDialoage: boolean = false;
  BUSINESS_DETAILS: string = "";
  Insti_Sub_Mst_Id: string = "";
  Corporate_Flag: any;

  // //COLLECTION VARIABLES
  // CollectionVPA: any = '';
  // CollectionAmount: any = '';
  CollectionCustomerName: any = '';
  CollectionBillNumber: any = '';
  CollectionGstNumber: any = '';
  // CollectionRemarks: any = '';


  //FIX QR
  showFQR: any;
  showQR: any;
  QRFlag: any = false;
  QRAmount: any = '';
  QRCustomerName: any = '';
  QRBillNumber: any = '';
  QRGstNumber: any = '';
  QRRemarks: any = '';
  termCondContent: string;


  statusImage: any;
  username: any;
  statusMessage: any;
  business: string = '';
  merchantName: string = '';
  logInfo: ILogin;
  customerName: string = '';
  rrn: string = '';
  status: string = '';
  balance: string = '';
  tranDate: string = '';
  collMessage: string = '';

  //END
  showStatusBox: boolean = false;
  showOtherInfo: boolean = false;
  TCchek: boolean = true;
  showCollReqF: boolean = true;
  clientMstId: number;
  option = {
    position: 'top-center',
    showClose: true,
    timeout: 5000,
    theme: 'bootstrap',
    type: 'error',
    closeOther: false,
    msg: ''
  }

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


  //charges slab
  ChargesSlab: any;
  MDRData: any;
  CR_AMT_CAPTION: any = 'Transaction Amount';
  CRGST: any = 0;
  CRMDR: any = 0;
  CREDIT_AMT: any = 0;
  CHRG_BARE_BY_CUST: any = 'N';
  CHRG_DISP_FLAG: any = 'N';
  TOT_TRAN_AMT: any = 0;
  CBS: any;
  totalCharges: any = 0;
  charges: boolean;
  showChargeModal: boolean = false;
  Sheetbuttons: Array<any>;


  constructor(private apiService: ApiService, private dialog: MatDialog, private router: Router, private dataStorage: DataStorage,
    private errorHandler: ErrorHandler, private renderer2: Renderer2, private bottomSheet: MatBottomSheet, private toast: Toast, private spinner: Spinner, private common: Common) {

  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.username = this.logInfo[0].CLIENT_NAME;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';
    this.QRRemarks = this.logInfo[0].CLIENT_NAME + '-' + this.logInfo[0].CITY_NAME;
    this.CHRG_BARE_BY_CUST = this.logInfo[0].CHRG_BARE_BY_CUST;
    if(this.CHRG_BARE_BY_CUST == 'N'){
     this.CR_AMT_CAPTION = 'Credited Amount';
   }
   else{
     this.CR_AMT_CAPTION = 'Transaction Amount';
    }
    const amnt = this.renderer2.selectRootElement('#amnt');
    setTimeout(() => amnt.focus(), 0);


  }

  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "36", loginFlag: 'A' }, this).subscribe(data => {
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
    if (parseFloat(this.QRAmount))
      this.QRAmount = parseFloat(this.QRAmount).toFixed(2);
    this.showMDR();

  }


  //# START QR CODE ======================================================

  processQR() {
    this.QRRequestID();
  }

  clearQR() {
    this.QRAmount = '';
    this.QRCustomerName = '';
    this.QRBillNumber = '';
    // this.QRRemarks='';
    this.QRGstNumber = '';
    this.CRMDR = 0;
    this.CRGST = 0;
    this.totalCharges = 0;
    this.CREDIT_AMT = 0;
    this.TOT_TRAN_AMT = 0;
    this.QRFlag = false;
    // this.showOtherInfo = false;
  }

  QRRequestID() {
    if (this.QRAmount == '' || this.QRAmount == undefined) {
      this.message = "Enter Amount.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (parseFloat(this.QRAmount) == 0) {
      this.message = "Transaction Amount must be greater than Zero.";
      MessageBox.show(this.dialog, this.message, "");
      // this.option.msg='Transaction Amount must be greater than Zero.';
      // this.toast.addToast(this.option);
      return false;
    }
    // if (this.QRCustomerName == '' || this.QRCustomerName == undefined) {
    //   alert('Enter Customer Name.');
    //   return false;
    // }

    if (this.QRBillNumber == '' || this.QRBillNumber == undefined) {
      this.message = "Enter Bill Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    // if (this.QRRemarks == '' || this.QRRemarks == undefined) {
    //   alert('Enter Remarks.');
    //   return false;
    // }

    if (!this.TCchek) {
      this.message = "Please check Terms and conditions.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }


    var paramObj = {
      client_mst_id: this.clientMstId,
      merchant_id: '',
      merchant_name: '',
      sub_merchant_id: '',
      sub_merchant_name: '',
      terminal_id: '',
      merchant_tran_id: '',
      original_bank_rrn: '',
      orig_mer_tran_id: '',
      payer_va: '',
      // amount: parseFloat(this.QRAmount).toFixed(2),
      amount: parseFloat(this.TOT_TRAN_AMT).toFixed(2),
      remarks: this.QRRemarks,
      bill_number: this.QRBillNumber,
      online_refund: '',
      collect_by_date: '',
      request_flag: 'Q',
      request_from: 'WB',
      device_id: 'D',
      login_user_id: this.login_user_id,
      customer_name: this.QRCustomerName,
      gst_number: this.QRGstNumber,
    };

    this.spinner.show();
    let pageObj = this;
    this.apiService.sendToServer<ICore>('/api/virtualPay/tranreq', paramObj, this).subscribe((data) => {
      //this.apiService.sendToServer('/api/virtualpay/tranreq', paramObj, this).subscribe((data) => {
      // this.spinner.hide();   
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.QRsendToService(data.data[0], pageObj);

      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        // this.option.msg=data.msg;
        // this.toast.addToast(this.option);

      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);

    });

  }

  QRsendToService(obj, pageObj) {
    var paramObj = {
      BILL_NUMBER: pageObj.QRBillNumber,
      // AMOUNT: parseFloat(pageObj.QRAmount).toFixed(2),
      AMOUNT: parseFloat(pageObj.TOT_TRAN_AMT).toFixed(2),
      MERCHANT_ID: obj.MERCHANT_ID,
      TERMINAL_ID: obj.TERMINAL_ID,
      MERCHANT_TRAN_ID: obj.MERCHANT_TRAN_ID,//obj.UPI_REQ_ID

      REMARKS: pageObj.QRRemarks,
      MERCHANT_NAME: obj.MERCHANT_NAME,
      SUB_MERCHANT_ID: obj.SUB_MERCHANT_ID,
      SUB_MERCHANT_NAME: obj.SUB_MERCHANT_NAME,
      UPI_REQ_ID: obj.UPI_REQ_ID,
      login_user_id: pageObj.login_user_id,
      bill_number: pageObj.QRBillNumber,
      customer_name: pageObj.QRCustomerName,
      gst_number: pageObj.QRGstNumber,
    };
    //TranRequestTest
    //
    //this.spinner.show(); 
    this.apiService.sendToServer<ICore>('/api/virtualPay/qrcodetoService', paramObj, this).subscribe((data) => {
      //this.spinner.hide(); 
      this.QRSaveResponse(data, paramObj, pageObj);

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  QRSaveResponse(obj, param, pageObj) {

    var paramObj = {

      upi_req_id: param.UPI_REQ_ID,
      client_mst_id: pageObj.clientMstId,
      merchant_id: obj.merchantId,
      sub_merchant_id: obj.subMerchantId,
      merchant_tran_id: obj.merchantTranId,
      orig_bank_rrn: obj.BankRRN,
      success: obj.success,
      message: obj.message,
      response: obj.response,
      status: '',
      terminal_id: obj.terminalId,
      request_flag: 'Q',
      request_string: obj.BILL_NUMBER + '|' + obj.AMOUNT + '|' + obj.REMARKS + '|' + obj.MERCHANT_ID + '|' + obj.MERCHANT_NAME + '|' + obj.SUB_MERCHANT_ID + '|' + obj.SUB_MERCHANT_NAME + '|' + obj.TERMINAL_ID + '|' + obj.MERCHANT_TRAN_ID + '|' + obj.UPI_REQ_ID,
      request_from: 'WB',
      device_id: 'D',
      login_user_id: pageObj.login_user_id,
      bill_number: pageObj.CollectionBillNumber,
      customer_name: pageObj.CollectionCustomerName,
      gst_number: pageObj.CollectionGstNumber,
      PAYER_NAME: '',
      PAYER_MOBILE: '',
      PAYER_VA: '',
      PAYER_AMOUNT: '',
      TXNINITDATE: '',
      TXNCOMPLETIONDATE: '',
      reference_id: obj.refId



    };
    //this.spinner.show(); 
    this.apiService.sendToServer<IBillCollectionUPI>('/api/virtualPay/tranresponse', paramObj, this).subscribe((data) => {
      this.spinner.hide();

      if (data.po_res_desc) {
        let tmp = data.po_res_desc.split('|');
        if (tmp[tmp.length - 1] == 'N') {
          this.statusImage = "assets/images/error.png";
          this.statusMessage = "Transaction failed";
          this.business = this.logInfo[0].BUSINESS_DETAILS;
          this.merchantName = this.logInfo[0].CLIENT_NAME;
          this.customerName = this.QRCustomerName;
          this.rrn = tmp[1];
          this.collMessage = tmp[0].replace(/-/g, '');
          this.status = "Pending";
          // this.balance = this.QRAmount;
          this.balance = this.TOT_TRAN_AMT;
          this.tranDate = tmp[2];
          // this.display='block'; 
          this.showStatusBox = true;


        }
        else {

          this.statusImage = "assets/images/success.png";
          this.statusMessage = "Transaction Success.";
          this.business = this.logInfo[0].BUSINESS_DETAILS;
          this.merchantName = this.logInfo[0].MERCHANT_NAME;
          this.customerName = this.QRCustomerName;
          this.rrn = tmp[1];
          this.collMessage = tmp[0].replace(/-/g, '');
          this.status = "Pending";
          // this.balance = this.QRAmount;
          this.balance = this.TOT_TRAN_AMT;
          this.tranDate = tmp[2];
          // this.display='block'; 
          this.showStatusBox = true;
        }

        let btnLogin = $('#qrCodeBtn');
        setTimeout(() => btnLogin.attr('disabled', 'true'), 0);
        this.clearQR();

      }
      if (paramObj.reference_id == undefined || paramObj.reference_id == "") {
        this.message = paramObj.message;
        MessageBox.show(this.dialog, this.message, "");
        // this.option.msg=paramObj.message;
        // this.toast.addToast(this.option);
        this.QRFlag = false;
      }
      else {
        //this.value = "upi://pay?pa=vgipl@icici&pn=Virtual Galaxy Infotech Pvt.Ltd&tr=" + paramObj.reference_id + "&am=" + param.AMOUNT + "&cu=INR&mc=5411";
        this.value = "upi://pay?pa=" + this.logInfo[0].VPA + "&pn=" + this.merchantName + "&tr=" + paramObj.reference_id + "&am=" + param.AMOUNT + "&cu=INR&mc=" + this.logInfo[0].TERMINAL_ID;
        // pageObj.qrValue = "upi://pay?pa=" + pageObj.logInfo[0].VPA + "&pn=" +  pageObj.logInfo[0].MERCHANT_NAME + "&tr=" + paramObj.reference_id + "&am=" + param.AMOUNT + "&cu=INR&mc=" + pageObj.logInfo[0].TERMINAL_ID;
        this.QRFlag = true;
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
      this.QRFlag = false;

    });
  }

  hideStatusBox() {
    this.showStatusBox = false;
  }

  showFIXQR() {
    this.showCollReqF = false;
    this.showFQR = true;
    this.showQR = false;
  }

  showQRCode() {
    this.showCollReqF = false;
    this.showFQR = true;
    this.showQR = true;
  }
  //# END QR CODE ======================================================== 

  getCharges(): void {
    // this.bottomSheet.open(QRBottomSheetComponent);

    this.spinner.show();
    var paramObj = {
      Client_Mst_ID: this.clientMstId,
      Client_Mst_Id: this.clientMstId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      keyword: 'CHARGESLABM~' + 4,
    };

    this.apiService.sendToServer<ICore>('/api/virtualpay/ChargesSlab', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1.length > 0) {
          this.showChargeModal = true;
          if (this.showChargeModal == true) {
            $(document).ready(function () {
              $("#chargesModal").modal('show');
            });
          }
          // this.createButtons(data.cursor1);
          this.Sheetbuttons = data.cursor1;
          let buttons = [];
          for (var index = 0; index < this.Sheetbuttons.length; index++) {
            let button = {
              text: ' Rs.   ' + this.Sheetbuttons[index].FROM_AMOUNT + ' To  Rs.' + this.Sheetbuttons[index].UPTO_AMOUNT + '| Rate   ' + this.Sheetbuttons[index].MDR_RATE + '%',
            }
            buttons.push(button);
          }
          this.Sheetbuttons = buttons;
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });

  }



  // showMDR() {
  //   var paramObj = {
  //     Client_Mst_ID: this.clientMstId,
  //     Client_Mst_Id: this.clientMstId,
  //     Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
  //     CORPORATE_FLAG: this.Corporate_Flag,
  //     Gatewaymstid: 4,
  //     Trandate: moment(new Date()).format('DD-MMM-YYYY'),
  //     Amount: this.QRAmount,
  //     Chrg_Flag: 'A'
  //   };

  //   this.apiService.sendToServer<ICore>('/api/virtualpay/GetMDRamount', paramObj, this).subscribe((data) => {
  //     if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
  //       if (data.result.length > 0) {

  //         this.CHRG_DISP_FLAG = (data.result.split('~')[0] == undefined ? 'N' : data.result.split('~')[0]);
  //         if (this.CHRG_DISP_FLAG == 'Y') {
  //           this.CR_AMT_CAPTION = 'Transaction Amount';
  //           this.CRGST = 0;
  //           this.CRMDR = 0;
  //           this.totalCharges = 0;
  //           this.CREDIT_AMT = this.QRAmount;
  //           this.TOT_TRAN_AMT = this.QRAmount;;

  //         }
  //         else {
  //           this.CRMDR = (data.result.split('~')[3] == undefined ? 0 : parseFloat(data.result.split('~')[3]).toFixed(2));
  //           this.CRGST = (data.result.split('~')[7] == undefined ? 0 : parseFloat(data.result.split('~')[7]).toFixed(2));
  //           this.totalCharges = (data.result.split('~')[8] == undefined ? 0 : parseFloat(data.result.split('~')[8]).toFixed(2));
  //           if (this.CHRG_BARE_BY_CUST == 'N') {
  //             this.CR_AMT_CAPTION = 'Credited Amount';
  //             this.TOT_TRAN_AMT = this.QRAmount;
  //             this.CREDIT_AMT = parseFloat(this.QRAmount) - (this.totalCharges == undefined ? 0 : parseFloat(this.totalCharges));
  //           }
  //           else {
  //             this.CR_AMT_CAPTION = 'Transaction Amount';
  //             this.TOT_TRAN_AMT = parseFloat(this.QRAmount) + (this.totalCharges == undefined ? 0 : parseFloat(this.totalCharges));
  //             this.CREDIT_AMT = this.TOT_TRAN_AMT;
  //           }
  //         }
  //       }
  //       else {
  //         this.CR_AMT_CAPTION = 'Transaction Amount';
  //         this.CREDIT_AMT = 0;
  //         this.CRGST = 0;
  //         this.CRMDR = 0;
  //         this.totalCharges = 0;
  //       }
  //     }
  //     else {
  //       this.message = data.msg;
  //       MessageBox.show(this.dialog, this.message, "");
  //       this.CR_AMT_CAPTION = 'Transaction Amount';
  //       this.CREDIT_AMT = 0;
  //       this.CRGST = 0;
  //       this.CRMDR = 0;
  //       this.totalCharges = 0;
  //     }
  //   }, err => {
  //     this.CR_AMT_CAPTION = 'Transaction Amount';
  //     this.CREDIT_AMT = 0;
  //     this.CRGST = 0;
  //     this.CRMDR = 0;
  //     this.totalCharges = 0;
  //     this.errorHandler.handlePageError(err);
  //   });
  // }

  showMDR() {
    this.spinner.show();
    var paramObj = {
      Client_Mst_ID: this.clientMstId,
      Client_Mst_Id: this.clientMstId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Gatewaymstid: 4,
      Trandate: moment(new Date()).format('DD-MMM-YYYY'),
      Amount: this.QRAmount,
      Chrg_Flag: 'A'
    };

    this.apiService.sendToServer<ICore>('/api/virtualpay/GetMDRamount', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.result.length > 0) {

          this.CHRG_DISP_FLAG = (data.result.split('~')[0] == undefined ? 'N' : data.result.split('~')[0]);
          if (this.CHRG_DISP_FLAG == 'Y') {

            this.CRGST = 0;
            this.CRMDR = 0;
            this.totalCharges = 0;
            this.CREDIT_AMT = this.QRAmount;
            this.TOT_TRAN_AMT = this.QRAmount;

          }
          else {
            this.CRMDR = (data.result.split('~')[3] == undefined ? 0 : parseFloat(data.result.split('~')[3]).toFixed(2));
            this.CRGST = (data.result.split('~')[7] == undefined ? 0 : parseFloat(data.result.split('~')[7]).toFixed(2));
            this.totalCharges = (data.result.split('~')[8] == undefined ? 0 : parseFloat(data.result.split('~')[8]).toFixed(2));
            if (this.CHRG_BARE_BY_CUST == 'N') {

              this.TOT_TRAN_AMT = this.QRAmount;
              this.CREDIT_AMT = parseFloat(this.QRAmount) - (this.totalCharges == undefined ? 0 : parseFloat(this.totalCharges));
            }
            else {

              this.TOT_TRAN_AMT = parseFloat(this.QRAmount) + (this.totalCharges == undefined ? 0 : parseFloat(this.totalCharges));
              this.CREDIT_AMT = this.TOT_TRAN_AMT;
            }
          }
        }
        else {

          this.CREDIT_AMT = 0;
          this.CRGST = 0;
          this.CRMDR = 0;
          this.totalCharges = 0;
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        this.CREDIT_AMT = 0;
        this.CRGST = 0;
        this.CRMDR = 0;
        this.totalCharges = 0;
      }
    }, err => {
      this.spinner.hide();
      this.CREDIT_AMT = 0;
      this.CRGST = 0;
      this.CRMDR = 0;
      this.totalCharges = 0;
      this.errorHandler.handlePageError(err);
    });
  }
}

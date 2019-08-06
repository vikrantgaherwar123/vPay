import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';

import { ErrorHandler } from '../../../../../core/errorHandler';
import { Spinner } from '../../../../../services/spinner';
import { ApiService } from '../../../../../core/api.service';
import { DataStorage } from '../../../../../core/dataStorage';
import { Router } from '@angular/router';
import { ICore } from '../../../../../interface/core';
import { ILogin } from '../../../../../interface/login';
import { Common } from '../../../../../services/common';
import * as moment from 'moment';
import { IBillCollectionUPI } from '../../../../../interface/billCollectionUPI';

import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { Toast } from '../../../../../services/toast';
declare const $ : any;
@Component({
  selector: 'R-vgipl-collection',
  templateUrl: './collection.html',
  providers: [Spinner, Common]

})

export class CollectionComponent implements OnInit {
  // @ViewChild(dtp) dtp: dtp; SetControlValue: string; _gatewaydetid: number = 0;
  termCondContent: string;
  resultMessage: string;
  mCust: string;
  showBusinness: string;
  showVPayTranId: string;
  showUPITranId: string;
  BUSINESS_DETAILS: string = "";
  Insti_Sub_Mst_Id: string = "";
  Corporate_Flag: any;

  login_user_id: string;
  value: string = 'Techiediaries';
  successDialoage: boolean = false;
  failureDialoage: boolean = false;
  showSpinner: boolean = false;
  //COLLECTION VARIABLES
  CollectionVPA: any = '';
  CollectionAmount: any = '';
  CollectionCustomerName: any = '';
  CollectionBillNumber: any = '';
  CollectionGstNumber: any = '';
  CollectionRemarks: any = '';

  showOtherInfo: boolean = false;
  TCchek: boolean = true;
  showStatusBox: boolean = false;

  // display='none';


  //END
  showCollReqF: boolean = true;
  clientMstId: number;

  statusImage: any;
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
  beneficaryList: any;
  acName: string;
  //modal: string = '';
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
    private renderer2: Renderer2, private bottomSheet: MatBottomSheet, private errorHandler: ErrorHandler, private toast: Toast, private spinner: Spinner, private common: Common) {

  }

  onkeyup() {
    let pageObj = this;
    $("input").keyup(function () {
      pageObj.showStatusBox = false;


    });
    // $('#footerimg').css('background-image','none')
  }
  setAmountFormat() {
    if (parseFloat(this.CollectionAmount))
      this.CollectionAmount = parseFloat(this.CollectionAmount).toFixed(2);
    this.showMDR();
  }
  select(e) {
    const txtAmount = this.renderer2.selectRootElement('#txtAmount');
    setTimeout(() => txtAmount.select(), 0);
  }
  setAcNameLabel(item) {
    if(item){
      let l = this.beneficaryList.filter((a) => a.VPA_ADDRESS == item);
      if (l && l.length >0 )
        this.acName = l[0].ACCOUNT_NAME;
    }
    this.acName = '';
 
  }
  termConditions() {
    this.common.TermConditons({ Term_Cond_Type: "3", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }


  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "35", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';
    // this.CollectionRemarks = this.logInfo[0].CLIENT_NAME + '-' + this.logInfo[0].CITY_NAME;
    this.CollectionRemarks = this.logInfo[0].CLIENT_NAME + (this.logInfo[0].CITY_NAME ? ('-' + this.logInfo[0].CITY_NAME) : '');
    this.CHRG_BARE_BY_CUST = this.logInfo[0].CHRG_BARE_BY_CUST;
    if(this.CHRG_BARE_BY_CUST == 'N'){
     this.CR_AMT_CAPTION = 'Credited Amount';
   }
   else{
     this.CR_AMT_CAPTION = 'Transaction Amount';
    }
    this.onkeyup();
    this.getBeneficiaryData();
    const txtVpa = this.renderer2.selectRootElement('#txtVpa');
    setTimeout(() => txtVpa.focus(), 0);

  }

  showOthInfo(e) {
    if (e.srcElement.checked == true)
      this.showOtherInfo = true;
    else {
      this.showOtherInfo = false;
    }
  }

  //# START UPI Request ============================================================

  getBeneficiaryData() {
    let param = {
      Client_Mst_ID: this.logInfo[0].CLIENT_MST_ID,
      Insti_Sub_Mst_Id: this.logInfo[0].INSTI_SUB_MST_ID,
      Gateway_Mst_Id: 2,
      CORPORATE_FLAG: this.logInfo[0].CORPORATE_FLAG
    };
    this.spinner.show();
    this.apiService.sendToServer<IBillCollectionUPI>('/api/virtualPay/BeneficiaryData', param, this).subscribe((data) => {
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.beneficaryList = data.cursor1;
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");

      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }
  CollectionSaveResponse(obj, param, pageObj) {
    var paramObj = {

      upi_req_id: param.UPI_REQ_ID,
      client_mst_id: this.clientMstId,
      merchant_id: obj.merchantId,
      sub_merchant_id: obj.subMerchantId,
      merchant_tran_id: obj.merchantTranId,
      orig_bank_rrn: obj.BankRRN,
      success: obj.success,
      message: obj.message,
      response: obj.response,
      status: '',
      terminal_id: obj.terminalId,
      request_flag: 'C',
      request_string: obj.BILL_NUMBER + '|' + obj.PAYER_VA + '|' + obj.AMOUNT + '|' + obj.REMARKS + '|' + obj.MERCHANT_ID + '|' + obj.MERCHANT_NAME + '|' + obj.SUB_MERCHANT_ID + '|' + obj.SUB_MERCHANT_NAME + '|' + obj.TERMINAL_ID + '|' + obj.MERCHANT_TRAN_ID + '|' + obj.UPI_REQ_ID,
      // request_string: obj.BILL_NUMBER + '|' + obj.PAYER_VA + '|' + obj.TOT_TRAN_AMT + '|' + obj.REMARKS + '|' + obj.MERCHANT_ID + '|' + obj.MERCHANT_NAME + '|' + obj.SUB_MERCHANT_ID + '|' + obj.SUB_MERCHANT_NAME + '|' + obj.TERMINAL_ID + '|' + obj.MERCHANT_TRAN_ID + '|' + obj.UPI_REQ_ID,
      request_from: 'WB',
      device_id: 'D',
      login_user_id: this.login_user_id, //1,
      bill_number: this.CollectionBillNumber,
      customer_name: this.CollectionCustomerName,
      gst_number: this.CollectionGstNumber,
      PAYER_NAME: '',
      PAYER_MOBILE: '',
      PAYER_VA: '',
      PAYER_AMOUNT: '',
      TXNINITDATE: '',
      TXNCOMPLETIONDATE: '',
      reference_id: ''
    };
    this.apiService.sendToServer<IBillCollectionUPI>('/api/virtualPay/tranresponse', paramObj, this).subscribe((data) => {
      if (data.po_res_desc) {
        let tmp = data.po_res_desc.split('|');
        //TODO=============
        if (tmp[0].split('-')[2].toString().toUpperCase() == tmp[0].split('-')[4].toString().toUpperCase()) {
          tmp[0] = tmp[0].split('-')[2];
        }
        else {
          tmp[0] = tmp[0].split('-')[2] + ',' + tmp[0].split('-')[4];
        }
        let msgArr = tmp[0].split('-');
        let msgcoll = '';
        let i = 2;
        if (msgArr.length > 2) {
          for (i; i < msgArr.length; i++) {
            msgcoll += msgArr[i];
          }
        }
        if (this.CollectionCustomerName && this.CollectionCustomerName.trim().length > 0) {
          this.mCust = 'show';
        }
        else {
          this.mCust = 'hide';
        }
        if (this.logInfo[0].BUSINESS_DETAILS) {
          this.showBusinness = "show";
        }
        else {
          this.showBusinness = "hide";
        }
        if (!tmp[1] || (tmp[1] && tmp[1].trim().length == 0))
          this.showVPayTranId = 'hide';
        else
          this.showVPayTranId = 'show';

        if (tmp[tmp.length - 1] == 'N') {
          this.resultMessage = "error";
          this.statusImage = "assets/images/error.png";
          this.statusMessage = "Transaction failed";
          this.business = this.logInfo[0].BUSINESS_DETAILS;
          this.merchantName = this.logInfo[0].CLIENT_NAME;
          this.customerName = this.CollectionCustomerName;
          this.rrn = tmp[1];
          this.collMessage = msgcoll;          //tmp[0].replace(/-/g,'');
          //this.status = "Pending";
          this.balance = this.TOT_TRAN_AMT;
          this.tranDate = tmp[2];
          // this.display='block'; 
          this.showStatusBox = true;
        }
        else {
          this.resultMessage = "success";
          this.statusImage = "assets/images/success.png";
          this.statusMessage = "Transaction Success.";

          this.business = this.logInfo[0].BUSINESS_DETAILS;
          this.merchantName = this.logInfo[0].CLIENT_NAME;
          this.customerName = this.CollectionCustomerName;
          this.rrn = tmp[1];
          this.collMessage = tmp[0].replace(/-/g, '');
          this.status = "Pending";
          this.balance = this.TOT_TRAN_AMT;
          this.tranDate = tmp[2];
          this.showStatusBox = true;
        }

        // let btnLogin = $('#collBtn');
        // setTimeout(() => btnLogin.attr('disabled', 'true'), 0);
        this.clearUPI();
        this.spinner.hide();
      }

      else {
        this.spinner.hide();
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  CollectionsendToService(obj, pageObj) {
    var paramObj = {
      PAYER_VA: obj.PAYER_VA,
      // AMOUNT: parseFloat(obj.AMOUNT).toFixed(2),
      AMOUNT: parseFloat(obj.TOT_TRAN_AMT).toFixed(2),
      REMARKS: obj.REMARKS,
      MERCHANT_ID: obj.MERCHANT_ID,
      MERCHANT_NAME: obj.MERCHANT_NAME,
      SUB_MERCHANT_ID: obj.SUB_MERCHANT_ID,
      SUB_MERCHANT_NAME: obj.SUB_MERCHANT_NAME,
      TERMINAL_ID: obj.TERMINAL_ID,
      MERCHANT_TRAN_ID: obj.MERCHANT_TRAN_ID,//obj.UPI_REQ_ID
      UPI_REQ_ID: obj.UPI_REQ_ID,
      login_user_id: pageObj.logInfo[0].LOGIN_USER_ID,
      bill_number: pageObj.CollectionBillNumber,
      customer_name: pageObj.CollectionCustomerName,
      gst_number: pageObj.CollectionGstNumber,

    };
    this.apiService.sendToServer<ICore>('/api/virtualPay/tranreqtoService', paramObj, this).subscribe((data) => {
      this.CollectionSaveResponse(data, paramObj, pageObj);
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);

    });
  }

  CollectiongetRequestID() {
    if (this.CollectionVPA == '' || this.CollectionVPA == undefined) {
      this.message = "Enter VPA Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.CollectionAmount == '' || this.CollectionAmount == undefined) {
      this.message = "Enter Amount.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (parseFloat(this.CollectionAmount) == 0) {
      this.message = "Transaction Amount must be greater than Zero.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.CollectionBillNumber == '' || this.CollectionBillNumber == undefined) {
      this.message = "Enter Bill Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

   
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
      payer_va: this.CollectionVPA,
      // amount: parseFloat(this.CollectionAmount).toFixed(2),
      amount: parseFloat(this.TOT_TRAN_AMT).toFixed(2),
      remarks: this.CollectionRemarks,
      bill_number: this.CollectionBillNumber,
      // bill_number: this.logInfo[0].CLIENT_MST_ID + '~' + this.CollectionBillNumber,
      online_refund: '',
      collect_by_date: '',
      request_flag: 'C',
      request_from: 'WB',
      device_id: 'D',
      login_user_id: this.login_user_id,
      customer_name: this.CollectionCustomerName,
      gst_number: this.CollectionGstNumber,
    };
    this.spinner.show();
    let pageObj = this;
    this.apiService.sendToServer<ICore>('/api/virtualPay/tranreq', paramObj, this).subscribe((data) => {
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.CollectionsendToService(data.data[0], pageObj);
      }
      else {
        this.spinner.hide();
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  processUPI() {

    this.CollectiongetRequestID();
  }
  hideStatusBox() {
    this.showStatusBox = false;
  }

  clearUPI() {
    this.CollectionVPA = '';
    this.acName = '';
    this.CollectionAmount = '';
    this.CollectionCustomerName = '';
    this.CollectionBillNumber = '';
    this.CollectionGstNumber = '';
    this.CRMDR = 0;
    this.CRGST = 0;
    this.totalCharges = 0;
    this.CREDIT_AMT = 0;
    this.TOT_TRAN_AMT = 0;
    //this.showStatusBox= false;
  }

  //# END UPI Request =============================================================== 

  getCharges(): void {
    // this.bottomSheet.open(CollectionBottomSheetComponent);
      this.spinner.show();
      var paramObj = {
        Client_Mst_ID: this.clientMstId,
        Client_Mst_Id: this.clientMstId,
        Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
        CORPORATE_FLAG: this.Corporate_Flag,
        keyword: 'CHARGESLABM~' + 2,
      };
  
      this.apiService.sendToServer<ICore>('/api/virtualpay/ChargesSlab', paramObj, this).subscribe((data) => {
        this.spinner.hide();
        if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
          if (data.cursor1.length > 0) {
            // this.createButtons(data.cursor1);
            this.showChargeModal = true;
            if (this.showChargeModal == true) {
              $(document).ready(function () {
                $("#chargesModal").modal('show');
              });
            }
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
  //     Gatewaymstid: 2,
  //     Trandate: moment(new Date()).format('DD-MMM-YYYY'),
  //     Amount: this.CollectionAmount,
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
  //           this.CREDIT_AMT = this.CollectionAmount;
  //           this.TOT_TRAN_AMT = this.CollectionAmount;;

  //         }
  //         else {
  //           this.CRMDR = (data.result.split('~')[3] == undefined ? 0 : parseFloat(data.result.split('~')[3]).toFixed(2));
  //           this.CRGST = (data.result.split('~')[7] == undefined ? 0 : parseFloat(data.result.split('~')[7]).toFixed(2));
  //           this.totalCharges = (data.result.split('~')[8] == undefined ? 0 : parseFloat(data.result.split('~')[8]).toFixed(2));
  //           if (this.CHRG_BARE_BY_CUST == 'N') {
  //             this.CR_AMT_CAPTION = 'Credited Amount';
  //             this.TOT_TRAN_AMT = this.CollectionAmount;
  //             this.CREDIT_AMT = parseFloat(this.CollectionAmount) - (this.totalCharges == undefined ? 0 : parseFloat(this.totalCharges));
  //           }
  //           else {
  //             this.CR_AMT_CAPTION = 'Transaction Amount';
  //             this.TOT_TRAN_AMT = parseFloat(this.CollectionAmount) + (this.totalCharges == undefined ? 0 : parseFloat(this.totalCharges));
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
      Gatewaymstid: 2,
      Trandate: moment(new Date()).format('DD-MMM-YYYY'),
      Amount: this.CollectionAmount,
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
            this.CREDIT_AMT = this.CollectionAmount;
            this.TOT_TRAN_AMT = this.CollectionAmount;

          }
          else {
            this.CRMDR = (data.result.split('~')[3] == undefined ? 0 : parseFloat(data.result.split('~')[3]).toFixed(2));
            this.CRGST = (data.result.split('~')[7] == undefined ? 0 : parseFloat(data.result.split('~')[7]).toFixed(2));
            this.totalCharges = (data.result.split('~')[8] == undefined ? 0 : parseFloat(data.result.split('~')[8]).toFixed(2));
            if (this.CHRG_BARE_BY_CUST == 'N') {

              this.TOT_TRAN_AMT = this.CollectionAmount;
              this.CREDIT_AMT = parseFloat(this.CollectionAmount) - (this.totalCharges == undefined ? 0 : parseFloat(this.totalCharges));
            }
            else {

              this.TOT_TRAN_AMT = parseFloat(this.CollectionAmount) + (this.totalCharges == undefined ? 0 : parseFloat(this.totalCharges));
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

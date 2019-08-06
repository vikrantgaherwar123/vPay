import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { ApiService } from '../../../core/api.service';
import { IBbps } from '../../../interface/bbps';
import { IBillDetail } from '../../../interface/payment';
import { Spinner } from '../../../services/spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { BbpsPaymentComponent } from './../bbpsPayment/bbpsPayment.component';
import { Common } from '../../../services/common';
import { ErrorHandler } from '../../../core/errorHandler';



import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'app-bbpsTransaction',
  templateUrl: './bbpsTransaction.html',
  styleUrls: [
    '../bbps.component.scss'
  ],
  providers: []
})

export class BbpsTransactionComponent implements OnInit {
  // @ViewChild(BbpsPaymentComponent) bbpsOption: BbpsPaymentComponent;

  logInfo: ILogin;
  billDetailObj: IBillDetail;
  ProvidersData: any;
  providerName: any;
  clientMstId: number;
  login_user_id: string;
  userName: string = "";
  lastLogin: string = "";
  BUSINESS_DETAILS: string = "";
  Insti_Sub_Mst_Id: string = "";
  Corporate_Flag: any;
  aadharRemarksPay: string = '';
  mobile: any = '';

  termCondContent: string;
  //bbps variable
  BankArray = [];


  bankFullLogo: any;
  payBillOnlyData: any;
  payBillData: any;
  paymentmode: any;
  BillerData: any;
  Amount: any;
  errorDisplay: any;
  bbpsreversmsg: any;
  bbpsresponsemsg: any;
  bbpsTransmsg: any;
  errorDisplaydata: any;
  banklogo: any;
  bankname: any;
  SecretKey: any;
  CBSBillPaymentData: any;
  Category_ID: any;

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


  constructor(private dataStorage: DataStorage, private dialog: MatDialog, private renderer2: Renderer2, private apiService: ApiService,
    private router: Router, private errorHandler: ErrorHandler, private route: ActivatedRoute, private spinner: Spinner, private common: Common) {
    if (this.route.queryParams["_value"].PayBillPayOnly != undefined) {
      this.payBillOnlyData = JSON.parse(this.route.queryParams["_value"].PayBillPayOnly);
    } else if (this.route.queryParams["_value"].PayBill != undefined) {
      this.payBillData = JSON.parse(this.route.queryParams["_value"].PayBill);
    }
    this.CBSBillPaymentData = JSON.parse(this.route.queryParams["_value"].CBSBillPaymentData);
    this.paymentmode = this.route.queryParams["_value"].paymentMode != undefined ? this.route.queryParams["_value"].paymentMode : 'Internet Banking';
    this.Category_ID = this.route.queryParams["_value"].Category_ID;
    this.BankArray = JSON.parse(this.route.queryParams["_value"].bankArray);
    // this.paymentmode = 'Internet Banking';
  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.aadharRemarksPay = this.logInfo[0].CLIENT_NAME + (this.logInfo[0].CITY_NAME ? ('-' + this.logInfo[0].CITY_NAME) : '');
    this.userName = this.logInfo[0].CLIENT_NAME;
    this.lastLogin = this.logInfo[0].LOGIN_DATE;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.mobile = this.login_user_id;
    this.banklogo = this.BankArray[0].BANK_FULL_LOGO;
    if (this.payBillOnlyData != null || this.payBillOnlyData != undefined) {
      this.PayBillOnly(this.payBillOnlyData);
    }
    else if (this.payBillData != null || this.payBillData != undefined) {
      this.PayBill(this.payBillData);
    }
  }

  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "10", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }

  //Image array to base64 string
  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    var imageArray = window.btoa(binary);
    return 'data:image/png;base64,' + imageArray;

  }


  //Pay Bill Without Featching Bill Data 
  PayBillOnly(Paybillonly) {
    var paramObj = {
      // Client_Mst_ID: this.model.client_mst_id,
      KEYWORD: Paybillonly.KEYWORD,
      VARCHAR_1: Paybillonly.VARCHAR_1, //this.loginInfo.LOGIN_USER_ID,   //customer mobile
      VARCHAR_2: Paybillonly.VARCHAR_2,           //customer Email
      VARCHAR_3: Paybillonly.VARCHAR_3, //this.referenceId
      VARCHAR_4: Paybillonly.VARCHAR_4,  //id
      VARCHAR_5: Paybillonly.VARCHAR_5, //Biller ID
      VARCHAR_6: Paybillonly.VARCHAR_6,   //quickPay
      VARCHAR_7: Paybillonly.VARCHAR_7,    //splitPay
      VARCHAR_8: Paybillonly.VARCHAR_8,   //paymentMode this.paymentmode
      VARCHAR_9: Paybillonly.VARCHAR_9,
      VARCHAR_10: Paybillonly.VARCHAR_10,
      VARCHAR_11: Paybillonly.VARCHAR_11,
      VARCHAR_12: Paybillonly.VARCHAR_12,
      VARCHAR_13: Paybillonly.VARCHAR_13,
      VARCHAR_14: Paybillonly.VARCHAR_14,   //clientReferenceID
      VARCHAR_15: Paybillonly.VARCHAR_15,   //Remark
      VARCHAR_16: Paybillonly.VARCHAR_16,     // refId
      VARCHAR_17: Paybillonly.VARCHAR_17 == null ? '' : Paybillonly.VARCHAR_17,
      VARCHAR_18: Paybillonly.VARCHAR_18 == null ? '' : Paybillonly.VARCHAR_18,
      VARCHAR_19: Paybillonly.VARCHAR_19 == null ? '' : Paybillonly.VARCHAR_19,
      VARCHAR_20: Paybillonly.VARCHAR_20 == null ? '' : Paybillonly.VARCHAR_20,
      VARCHAR_21: Paybillonly.VARCHAR_21 == null ? '' : Paybillonly.VARCHAR_21,
      VARCHAR_22: Paybillonly.VARCHAR_22 == null ? '' : Paybillonly.VARCHAR_22,
      VARCHAR_23: Paybillonly.VARCHAR_23 == null ? '' : Paybillonly.VARCHAR_23,
      VARCHAR_24: Paybillonly.VARCHAR_24 == null ? '' : Paybillonly.VARCHAR_24,
      VARCHAR_25: Paybillonly.VARCHAR_25 == null ? '' : Paybillonly.VARCHAR_25,
      VARCHAR_26: Paybillonly.VARCHAR_26 == null ? '' : Paybillonly.VARCHAR_26,
      Sub_Ag_Mst_Id: Paybillonly.Sub_Ag_Mst_Id,
      Bank_Reg_Mst_Id: Paybillonly.Bank_Reg_Mst_Id,
      Client_Mst_Id: Paybillonly.Client_Mst_Id,
      Cat_Mst_Id: this.Category_ID,
      Method_Name: Paybillonly.Method_Name,
      Actual_String: JSON.stringify(Paybillonly)
    }
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/GetBBPSRequest', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') { //&& data.success=='success'

        // if (data.errorMessages.length > 0) {
        //   //alert('Transaction Failed'));
        //   this.errorDisplay = data.errorMessages;
        //   //  this.errorDisplay = data.errors;
        //   //  if (this.errorDisplay != null) {
        //   //    alert(this.errorDisplay.field-name)
        //   //    return false;
        //   //  }
        //   this.Send_Reversal_Request(data)
        // }
        if (data.errorMessages == undefined) {
          this.errorDisplay = data.message;
          this.Send_Reversal_Request();
          return false
        }
        if (data.errorMessages.length > 0) {
          //this.alertCtrl.showToastBottom(this.translate.instant('Transaction Failed'));
          this.errorDisplaydata = data.errorMessages;
          this.errorDisplay = data.errorMessages[0].errorDtl;
          this.Send_Reversal_Request();
        }
        else {
          this.BillerData = data;
          this.message = "Transaction Successfull.";
          MessageBox.show(this.dialog, this.message, "");
          this.Amount = (this.BillerData.amount) / 100;
          this.Amount = parseFloat(this.Amount);
          if (this.CBSBillPaymentData == null || this.CBSBillPaymentData == undefined) {
            this.saveBBPSTransactionOther(this.BillerData);  //CBS Biller Data is not found
          }
          else {
            this.Save_BBPSResponse(this.BillerData)  //CBS Biller Data is found
          }

        }
      }
      else {
        this.message = data.msg + ' ' + data.message;
        MessageBox.show(this.dialog, this.message, "");
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
      this.errorDisplay = err;
      this.Send_Reversal_Request();
    });

  }



  //Pay Bill With Featching Bill Data
  PayBill(PayBill) {
    this.spinner.show();
    var paramObj = {
      // Client_Mst_ID: this.model.client_mst_id,
      KEYWORD: 'PayBill',
      VARCHAR_1: PayBill.VARCHAR_1,
      VARCHAR_2: PayBill.VARCHAR_2, // this.loginInfo.LOGIN_USER_ID,
      VARCHAR_3: PayBill.VARCHAR_3,
      VARCHAR_4: PayBill.VARCHAR_4,
      VARCHAR_5: PayBill.VARCHAR_5,
      VARCHAR_6: PayBill.VARCHAR_6,
      VARCHAR_7: PayBill.VARCHAR_7,
      VARCHAR_8: PayBill.VARCHAR_8,
      VARCHAR_9: PayBill.VARCHAR_9,
      VARCHAR_10: PayBill.VARCHAR_10,
      VARCHAR_11: PayBill.VARCHAR_11,
      VARCHAR_12: PayBill.VARCHAR_12,
      VARCHAR_13: PayBill.VARCHAR_13,
      VARCHAR_14: PayBill.VARCHAR_14,
      VARCHAR_15: PayBill.VARCHAR_15,
      VARCHAR_16: PayBill.VARCHAR_16,
      VARCHAR_17: PayBill.VARCHAR_17,
      // VARCHAR_21:this.inputfieldarray[0].name,
      // VARCHAR_22:PayBill.VARCHAR_22e,
      VARCHAR_21: PayBill.VARCHAR_21 == null ? '' : PayBill.VARCHAR_21,
      VARCHAR_22: PayBill.VARCHAR_22 == null ? '' : PayBill.VARCHAR_22,
      VARCHAR_23: PayBill.VARCHAR_23 == null ? '' : PayBill.VARCHAR_23,
      VARCHAR_24: PayBill.VARCHAR_24 == null ? '' : PayBill.VARCHAR_24,
      VARCHAR_25: PayBill.VARCHAR_25 == null ? '' : PayBill.VARCHAR_25,
      VARCHAR_26: PayBill.VARCHAR_26 == null ? '' : PayBill.VARCHAR_26,
      VARCHAR_27: PayBill.VARCHAR_27 == null ? '' : PayBill.VARCHAR_27,
      VARCHAR_28: PayBill.VARCHAR_28 == null ? '' : PayBill.VARCHAR_28,
      VARCHAR_29: PayBill.VARCHAR_29 == null ? '' : PayBill.VARCHAR_29,
      VARCHAR_30: PayBill.VARCHAR_30 == null ? '' : PayBill.VARCHAR_30,
      Sub_Ag_Mst_Id: PayBill.Sub_Ag_Mst_Id,
      Bank_Reg_Mst_Id: PayBill.Bank_Reg_Mst_Id,
      Client_Mst_Id: PayBill.Client_Mst_Id,
      Method_Name: PayBill.Method_Name,
      Actual_String: JSON.stringify(PayBill)
    }
    this.apiService.sendToServer<IBbps>('/api/virtualpay/GetBBPSRequest', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        // if (data.errorMessages.length > 0) {
        //   //alert('Transaction Failed');
        //   this.errorDisplay = data.errorMessages;
        //   //  this.errorDisplay = data.errors;
        //   //  if (this.errorDisplay != null) {
        //   //    alert(this.errorDisplay.field-name)
        //   //    return false;
        //   //  }
        //   this.Send_Reversal_Request()
        // }
        if (data.errorMessages == undefined) {
          this.errorDisplay = data.message;
          this.Send_Reversal_Request();
          return false
        }
        if (data.errorMessages.length > 0) {
          //this.alertCtrl.showToastBottom(this.translate.instant('Transaction Failed'));
          this.errorDisplaydata = data.errorMessages;
          this.errorDisplay = data.errorMessages[0].errorDtl;
          this.Send_Reversal_Request();
        }
        else {
          this.BillerData = data;
          this.message = "Transaction Successfull.";
          MessageBox.show(this.dialog, this.message, "");
          this.Amount = (this.BillerData.amount) / 100;
          this.Amount = parseFloat(this.Amount);
          if (this.CBSBillPaymentData == null || this.CBSBillPaymentData == undefined) {
            this.saveBBPSTransactionOther(this.BillerData);  //CBS Biller Data is not found
          }
          else {
            this.Save_BBPSResponse(this.BillerData)  //CBS Biller Data is found
          }
        }
      }
      else {
        this.message = data.msg + ' ' + data.message;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
      this.errorDisplay = err;
      this.Send_Reversal_Request();
    });

  }



  //Save BBPS Response
  Save_BBPSResponse(OBJ) {
    this.spinner.show();
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Bank_Reg_Mst_Id: this.CBSBillPaymentData.Bank_Reg_Mst_Id,
      Account_No: this.CBSBillPaymentData.Account_No,
      Customer_ID: this.CBSBillPaymentData.Customer_ID,
      Cat_Mst_Id: this.Category_ID,
      Tran_Mode: 'BBPS',
      Bene_Account: '',
      Tran_Amount: this.CBSBillPaymentData.Tran_Amount,
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      Final_Remark: OBJ.transactionRefId,
      CBS_TranID: this.CBSBillPaymentData.CBS_TranID,
      Response_Code: '00',
      Response_Message: 'Completed Successfully',
      RRN_Number: this.CBSBillPaymentData.RRN_Number,
      login_user_id: this.CBSBillPaymentData.login_user_id,
      Insti_Sub_Mst_Id: '',
      CORPORATE_FLAG: this.Corporate_Flag,
      Corporate_Flag: this.Corporate_Flag,
      Secret_Key: this.CBSBillPaymentData.Secret_Key,
      url: this.CBSBillPaymentData.url,
    }
    this.apiService.sendToServer<IBbps>('/api/virtualpay/TranReqResponse', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].RESPONSE_CODE == '00') {
          this.saveBBPSTransaction(OBJ);
        }
        else {
          this.bbpsresponsemsg = data.cursor1[0].RESPONSE_MESSAGE;
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



  //Save BBPS Transaction 
  saveBBPSTransaction(OBJ) {
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Bank_Reg_Mst_Id: this.CBSBillPaymentData.Bank_Reg_Mst_Id,
      Bbps_Req_Det_Id: OBJ.Bbps_Req_Det_Id,
      Cat_Mst_Id: this.Category_ID,
      Biller_Id: OBJ.billerId,
      Bill_Amount: this.CBSBillPaymentData.Tran_Amount,
      Biller_Ref_Number: OBJ.transactionRefId,
      Biller_Mob_No: OBJ.customerMobile,
      Biller_Email_Id: '',
      Biller_Name: OBJ.billerName,
      Remarks: OBJ.approvalRefNum,
      Cbs_Bbps_User_Code: '',
      Cbs_Bbps_User_Name: '',
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: this.CBSBillPaymentData.login_user_id,
      Insti_Sub_Mst_Id: '',
      CORPORATE_FLAG: this.Corporate_Flag,
      Corporate_Flag: this.Corporate_Flag,
      Secret_Key: this.CBSBillPaymentData.Secret_Key,
      url: this.CBSBillPaymentData.url,


    }
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/BbpsTransaction', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.bbpsTransmsg = '';
      }
      else {
        this.bbpsTransmsg = data.msg;
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }


  //If CBS Bill Data is Empty

  //Save BBPS Transaction 
  saveBBPSTransactionOther(OBJ) {
    this.spinner.show();
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Bank_Reg_Mst_Id: '', //this.CBSBillPaymentData.Bank_Reg_Mst_Id,
      Bbps_Req_Det_Id: OBJ.Bbps_Req_Det_Id,
      Cat_Mst_Id: this.Category_ID,
      Biller_Id: OBJ.billerId,
      Bill_Amount: (OBJ.Tran_Amount) / 100,
      Biller_Ref_Number: OBJ.transactionRefId,
      Biller_Mob_No: OBJ.customerMobile,
      Biller_Email_Id: '',
      Biller_Name: OBJ.billerName,
      Remarks: OBJ.approvalRefNum,
      Cbs_Bbps_User_Code: '',
      Cbs_Bbps_User_Name: '',
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: this.login_user_id,
      Insti_Sub_Mst_Id: '',
      CORPORATE_FLAG: this.Corporate_Flag,
      Corporate_Flag: this.Corporate_Flag,
      Secret_Key: '',//this.CBSBillPaymentData.Secret_Key,
      url: ''//this.CBSBillPaymentData.Secret_Key,
    }
    this.apiService.sendToServer<IBbps>('/api/virtualpay/BbpsTransaction', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.bbpsTransmsg = '';
      }
      else {
        this.bbpsTransmsg = data.msg;
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }



  //Send Reversal Request
  Send_Reversal_Request() {
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Bank_Reg_Mst_Id: this.CBSBillPaymentData.Bank_Reg_Mst_Id,
      Account_No: this.CBSBillPaymentData.Account_No,
      Tran_Mode: 'BBPS',
      Tran_Amount: this.CBSBillPaymentData.Tran_Amount,
      Bene_Account: '',
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      Declined_Remark: '',
      CBS_TranID: this.CBSBillPaymentData.CBS_TranID,
      Response_Code: '01',
      // Response_Message: this.errorDisplay[0].errorDtl,
      Response_Message: this.errorDisplay,
      RRN_Number: this.CBSBillPaymentData.RRN_Number,
      login_user_id: this.CBSBillPaymentData.login_user_id,
      Insti_Sub_Mst_Id: '',
      CORPORATE_FLAG: this.Corporate_Flag,
      Corporate_Flag: this.Corporate_Flag,
      Secret_Key: this.CBSBillPaymentData.Secret_Key,
      url: this.CBSBillPaymentData.url,
    }
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/TranRevRequest', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        // alert('Send Reversal Request');
        this.message = 'Send Reversal Request';
        MessageBox.show(this.dialog, this.message, "");
        this.router.navigate[('/bbps')];
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


  GotoHome() {
    this.router.navigate(['/dashboard'], { queryParams: { 'kyc': false } });
  }
}


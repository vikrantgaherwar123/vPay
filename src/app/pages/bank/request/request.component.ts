import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../../core/api.service';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { ErrorHandler } from '../../../core/errorHandler';
import { Spinner } from '../../../services/spinner';
import { ICore } from '../../../interface/core';
import { Common } from '../../../services/common';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Otp } from "../../../shared/component/otp/otp.component";
import { Subscription } from "rxjs/Subscription";
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { IOtp } from '../../../interface/otp';
import * as moment from 'moment';
import { ConfirmDialogComponent } from '../../../shared/component/confirm-dialog/confirm-dialog.component';


declare const $: any;

@Component({
  selector: 'app-bank',
  templateUrl: './request.component.html',
  styleUrls: [
    './../bank.component.scss'
  ],
  providers: [DecimalPipe],
})
export class RequestComponent implements OnInit {
  @ViewChild(dtp) dtp: dtp;
  @ViewChild(Otp) otpCntrl: Otp;


  tDate: Date = new Date();
  logInfo: ILogin;
  clientMstId: number;
  login_user_id: string;
  userName: string = "";
  lastLogin: string = "";
  BUSINESS_DETAILS: string = "";
  Corporate_Flag: any;
  sessionId: any;
  secretKey: any;
  Insti_Sub_Mst_Id: any;
  url: any;
  InetCorpoID: any;
  InetUserID: any;
  InetCorpFlag: any;
  CUSTNAME:any;
  termCondContent: string;
  //mobile Banking Variable
  banklogo: any = null;

  listarray = [];
  bankname: any;
  setBankLogo: any = null;
  selectedBank: any;
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;

  //Request Variable
  New_Ac_Number: any;
  Account_Name: any;
  Account_Type: any;
  AccountBalance: any;
  padBottom: string = '';
  NoChequebook: any;
  NoLeaves: any;
  RRN_No: any;
  CBS_TranID: any;
  reqTitle: any;
  showRequest: boolean = false;
  showcheckBookReq: boolean = false;
  showStopPaymentReq: boolean = false;
  showVpayOtp: string = "hide";
  accCheckBookArray: Array<any>;
  btnStopPayOtp: boolean = false;
  btnCheckBookOtp: boolean = false;
  btnBack: boolean = true;
  statusMsg: any;
  showPOPUP: boolean = false;

  //stopPayment
  reason: any;
  AlphaCode: any;
  Numberofleave: any;
  Payeename: any;
  InstrmtNo: any;
  txt_Tdate: any;
  tpin: any;
  InstrmtAmt: any;
  reqAccNo: any;
  req:any;

  // dtp variables
  msgshowhide: string;
  DisplayMsg: string = '';
  SetControlValue: string;
  currentDate: any;

  //dialog box Variable
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

  constructor(private dataStorage: DataStorage, private router: Router, private route: ActivatedRoute, private apiService: ApiService,
    private spinner: Spinner, private errorHandler: ErrorHandler, private common: Common, public dialog: MatDialog, private dp: DecimalPipe) {
  }

  ngOnInit() {
    this.txt_Tdate=moment(this.tDate).format("DD-MM-YYYY");
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.userName = this.logInfo[0].CLIENT_NAME;
    this.lastLogin = this.logInfo[0].LOGIN_DATE;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.sessionId = this.logInfo.sessionId;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';
  

    if (this.logInfo[0].SelectedBankData != null) {
      this.selectedBank = this.logInfo[0].SelectedBankData[0].BANK_NAME == null ? null : this.logInfo[0].SelectedBankData[0].BANK_NAME;
      this.banklogo = this.logInfo[0].SelectedBankData[0].BANK_FULL_LOGO == null ? null : this.logInfo[0].SelectedBankData[0].BANK_FULL_LOGO;
      this.secretKey = this.logInfo[0].SelectedBankData[0].SECRET_KEY;
      this.url = this.logInfo[0].SelectedBankData[0].URL;
      this.Cbs_CustomerID = this.logInfo[0].SelectedBankData[0].CBS_CUSTOMER_ID;
      this.BANK_REG_MST_ID = this.logInfo[0].SelectedBankData[0].BANK_REG_MST_ID;
      this.CLIENT_MST_ID = this.logInfo[0].SelectedBankData[0].CLIENT_MST_ID;
      this.SUB_AG_MST_ID = this.logInfo[0].SelectedBankData[0].SUB_AG_MST_ID;
      this.InetCorpoID = this.logInfo[0].SelectedBankData[0].INET_CORP_ID;
      this.InetUserID = this.logInfo[0].SelectedBankData[0].INET_USER_ID;
      this.CUSTNAME = this.logInfo[0].SelectedBankData[0].CUSTNAME;

      this.InetCorpFlag = this.logInfo[0].SelectedBankData[0].INET_CORPORATE_FLAG;
      this.Get_AccountList('FRAC');
      this.req = this.route.queryParams["_value"].Request;
      if(this.req=="CR"){
        this.ChequeBookMethod();
      }
      else if(this.req=="SPR"){
      this.StopPayMethod();  
      }
     
    } else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");
    }
  }

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

  //Page Help
  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "6", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }


  // Account List
  Get_AccountList(KEYWORD) {
    var paramObj = {
      request_from: 'WB',
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Customer_ID: this.Cbs_CustomerID,
      CORPORATE_FLAG: this.Corporate_Flag,
      Secret_Key: this.secretKey,
      url: this.url,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      AcKeyword: KEYWORD,
      Device_Id: 'Desktop',
      Session_Id: this.sessionId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Source: 'Desktop',
    };
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_Account', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].ERROR) {
          this.message = data.cursor1[0].ERROR;
          MessageBox.show(this.dialog, this.message, "");
        } else {
          this.accCheckBookArray = data.cursor1;
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }

  ChequeBookMethod() {
    this.showcheckBookReq = true;
    this.showRequest = false;
    // this.btnBack = false;
    this.reqTitle = "ChequeBook Request";
  }

  StopPayMethod() {
    this.showStopPaymentReq = true;
    this.showRequest = false;
    // this.btnBack = false;
    this.reqTitle = "Stop Payment Request";
  }

  //cheque Book Page Start
  SelectedAccNo(obj) {
    this.New_Ac_Number = obj.ACCOUNT_NUMBER,
      this.Account_Name = obj.ACCOUNT_NAME;
    this.AccountBalance = parseFloat(obj.AC_BALANCE);
    this.padBottom = "padding-bot";
  }

  // //method for save data
  cheqBookReqSubmit() {
    if (this.New_Ac_Number == undefined || this.New_Ac_Number == 0) {
      // alert('Select Account Number.');
      this.message = 'Select Account Number.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.NoChequebook == undefined || this.NoChequebook == 0) {
      // alert('Select number of Cheque Book.');
      this.message = "Select number of Cheque Book.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.NoLeaves == undefined || this.NoLeaves == 0) {
      // alert('Select Number of leaves.');
      this.message = "Select Number of leaves.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.tpin == undefined || this.tpin.toString().trim() == "") {
      this.message = "Enter TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.tpin.trim().length != 4) {
      this.message = "Enter a valid 4 digit TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    // var res = confirm("Do You Want To Procced ?");
    // if (!res) {
    //   return false;
    // }
    var paramObj = {
      login_user_id: this.login_user_id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Customer_ID: this.Cbs_CustomerID,
      Client_Mst_Id: this.clientMstId,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Inet_User_Id: this.InetUserID,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Request_From: 'Desktop',
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
      CBS_OTP: '',
      Tran_Mode: 'All',
      New_Ac_Number: this.New_Ac_Number,
      Sub_Ac_Number: '',
      No_Of_Leaves: this.NoLeaves,
      No_Of_Book: this.NoChequebook,
      TPIN: this.tpin,
      url: this.url,
      RRN_Number: '',
     

    };
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualpay/Get_ChequbookOTP', paramObj, this).subscribe(data => {
      this.spinner.hide();
      this.otpConfirmation(data);

      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].RESPONSE_CODE == '00') {
          this.RRN_No = data.cursor1[0].RRN_NUMBER,
          
          this.showcheckBookReq = false;
          this.btnCheckBookOtp = true;
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


  otpConfirmation(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // if (this.showRejectReason == true) {
    dialogConfig.data = {
      id: 1,
      title: "OTP Verification Required !",
      content: "Do you want to make checkbook request ?",
    };
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.showVpayOtp = "show";
        this.otpCntrl.placeholder = 'Enter OTP';
        data.po_OTPExpDur = data.cursor1[0].OTP_EXPDURATION;
        this.otpCntrl.showOtp(data, this);
      }
      if (result == false) {
       this.Back();
      }
    });
  }


  //cheque Book Otp Process
  chequeBookOtpProcess() {
    var paramObj = {
      Request_From: 'WB',
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Client_Mst_Id: this.clientMstId,
      Secret_Key: this.secretKey,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
      Customer_ID: this.Cbs_CustomerID,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Request_Mode: 26, //this.Request_Mode,,
      Trancode: 200,//this.Trancode,
      Accept_Reject: 'Y',
      Reject_Reason: '',
      CBS_OTP: this.otpCntrl.otp,
      RRN_Number: this.RRN_No,
      url: this.url
    }
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualPay/Authorize', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data != null && data != undefined) {
        if (data.Po_Error != null) {
          this.message = data.Po_Error;
          MessageBox.show(this.dialog, this.message, "");
        }
        else {
          if (data.code === 1) {
            if (data.cursor1[0].RESPONSE_CODE == '00') {
              this.CBS_TranID = data.cursor1[0].CBSTRNREFNO;
              // this.message = 'CBS TranID:- ' + this.CBS_TranID + ' ' + data.cursor1[0].RESPONSE_MESSAGE;
              // MessageBox.show(this.dialog, this.message, "");
              this.statusMsg = " Your Request Send Successflly For The Approval.";
              this.showPOPUP = true;
              if (this.showPOPUP == true) {
                $(document).ready(function () {
                  $("#TopupDialog").modal('show');
                });
              }
              this.otpCntrl.otp = '';
              this.showVpayOtp = "hide";
              this.otpCntrl.hideOtp();
              // this.router.navigate(['/bank']);
            }
            else {

              this.message = data.cursor1[0].RESPONSE_MESSAGE;
              MessageBox.show(this.dialog, this.message, "");
              return false;
            }
          }
          else if (data.code === 0) {

            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
          }
          this.otpCntrl.otp = '';
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    this.otpCntrl.otp = '';
  }
  //cheque book page close

  // //method for save data stop Payment

  //method for save data
  stopPaySubmit() {
this.txt_Tdate= moment(this.txt_Tdate).format("DD-MMM-YYYY");
    if (this.New_Ac_Number == undefined || this.New_Ac_Number == 0) {
      // alert('Select Account Number.');
      this.message = 'Select Account Number.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.InstrmtNo == undefined || this.InstrmtNo == 0) {
      // alert('Enter Instrument No.');
      this.message = 'Enter Instrument No.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.txt_Tdate == undefined || this.txt_Tdate == 0) {
      // alert('Enter Instrument Date');
      this.message = 'Enter Instrument Date';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.InstrmtAmt == undefined || this.InstrmtAmt == 0) {
      // alert('Enter Instrument Amount.');
      this.message = 'Enter Instrument Amount.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Payeename == undefined || this.Payeename == 0) {
      // alert('Enter Payee Name.');
      this.message = 'Enter Payee Name.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.reason == undefined || this.reason == 0) {
      // alert('Enter Reason.');
      this.message = 'Enter Reason.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.tpin == undefined || this.tpin.toString().trim() == "") {
      this.message = "Enter TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.tpin.trim().length != 4) {
      this.message = "Enter a valid 4 digit TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    var res = confirm("Do You Want To Procced ?");
    if (!res) {
      return;
    }
    var items = {
      login_user_id: this.login_user_id,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
      Customer_ID: this.Cbs_CustomerID,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      New_Ac_Number: this.New_Ac_Number,
      Cheque_No: this.InstrmtNo,
      Payee_Name: this.Payeename,
      Alpha_Code: this.AlphaCode,
      No_Of_Leaves: this.Numberofleave,
      Cheque_Amt: this.InstrmtAmt,
      Cheque_Date: this.txt_Tdate,
      Reson: this.reason,
      TPIN: this.tpin,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      url: this.url
    };
    this.apiService.sendToServer<IOtp>('/api/virtualpay/StopPay_OTP_Req', items, this).subscribe(data => {
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        //response code ==00
        if (data.cursor1[0].RESPONSE_CODE == '00') {
          this.RRN_No = data.cursor1[0].RRN_NUMBER,
            this.showVpayOtp = "show";
          this.otpCntrl.placeholder = 'Enter OTP';
          data.po_OTPExpDur = data.cursor1[0].OTP_EXPDURATION;
          this.otpCntrl.showOtp(data, this);
          this.showStopPaymentReq = false;
          this.btnStopPayOtp = true;
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

  stopPayOtpProcess() {
    var paramObj = {
      Request_From: 'WB',
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Client_Mst_Id: this.clientMstId,
      Secret_Key: this.secretKey,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
      Customer_ID: this.Cbs_CustomerID,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Request_Mode: 26, //this.Request_Mode,,
      Trancode: 200,//this.Trancode,
      Accept_Reject: 'Y',
      Reject_Reason: '',
      CBS_OTP: this.otpCntrl.otp,
      RRN_Number: this.RRN_No,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      url: this.url
    }
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualPay/Authorize', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data != null && data != undefined) {
        if (data.Po_Error != null) {
          this.message = data.Po_Error;
          MessageBox.show(this.dialog, this.message, "");
        }
        else {
          if (data.code === 1) {
            if (data.cursor1[0].RESPONSE_CODE == '00') {
              this.CBS_TranID = data.cursor1[0].CBSTRNREFNO;
              // this.message = 'CBS TranID:- ' + this.CBS_TranID + ' ' + data.cursor1[0].RESPONSE_MESSAGE;
              // MessageBox.show(this.dialog, this.message, "");
              this.statusMsg = " Your Request Send Successflly For The Approval.";
              this.showPOPUP = true;
              if (this.showPOPUP == true) {
                $(document).ready(function () {
                  // (<any>$("#KYCModal")).modal('show');
                  $("#TopupDialog").modal('show');
                });
              }
              this.otpCntrl.otp = '';
              this.showVpayOtp = "hide";
              this.otpCntrl.hideOtp();
              // this.router.navigate(['/bank']);
            }
            else {
              this.message = data.cursor1[0].RESPONSE_MESSAGE;
              MessageBox.show(this.dialog, this.message, "");
              return false;
            }
          }
          else if (data.code === 0) {
            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
          }
          this.otpCntrl.otp = '';
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    this.otpCntrl.otp = '';
  }




  
  clearPage() {
    this.New_Ac_Number = null;
    this.otpCntrl.otp = '';
    this.reqAccNo = null;
    this.Account_Name = null;
    this.AccountBalance = null;
    this.NoChequebook = '';
    this.NoLeaves = '';
    this.tpin = null;
    this.InstrmtNo = '';
    this.txt_Tdate = null;
    this.InstrmtAmt = '';
    this.Payeename = '';
    this.reason = '';
    this.AlphaCode = '';
    this.padBottom = '';
    this.Numberofleave = '';
  }
  Back() {
    this.clearPage();
    this.showVpayOtp = 'hide';
    this.btnBack = true;
    this.showStopPaymentReq = false;
    this.showcheckBookReq = true;
    this.showRequest = false;
    
  }

  pageBack() {
    this.router.navigate(['/bank'],{ queryParams: { 'bank': false}});
  }

  ConverToDecimal() {
    // this.TransferLimit = parseFloat(this.TransferLimit).toFixed(2);
    if (parseFloat(this.InstrmtAmt))
      this.InstrmtAmt = parseFloat(this.InstrmtAmt).toFixed(2);
  }


  //Date & Time

  getcurrentDate() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var fullDate = new Date();//console.log(fullDate);
    var twoDigitMonth = monthNames[fullDate.getMonth()];
    //var twoDigitMonth1 = [twoDigitMonth];
    var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
    this.currentDate = twoDigitDate + '/' + twoDigitMonth + '/' + fullDate.getFullYear();
    this.txt_Tdate = this.currentDate;

  }

  getcurrentDate11(date) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var fullDate = new Date(date);//console.log(fullDate);
    var twoDigitMonth = monthNames[fullDate.getMonth()];
    //var twoDigitMonth1 = [twoDigitMonth];
    var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
    var currentDate = twoDigitDate + '/' + twoDigitMonth + '/' + fullDate.getFullYear();
    return currentDate;
  }

  Call_MsgDiv(ShowHide, Msg) {
    if (ShowHide == 'SHOW')
      this.msgshowhide = '_show';
    if (ShowHide == 'HIDE')
      this.msgshowhide = '_hide';
    this.DisplayMsg = Msg;
  }

  CallBack = function (obj) {
    if (obj != null) {
      if (obj.SetControlValue == 'txt_Tdate')
        this.txt_Tdate = obj.mydate;
    }
  }



  DateTimeCtrl(Val1, Val2) {
    this.Call_MsgDiv('HIDE', '');
    this.SetControlValue = Val2;
    var objdttm = {
      setoncontrol: Val2,
      // mtype: 'SET DATE',
      mtype: Val1 == 'D' ? 'SET DATE' : 'SET TIME',
      ctrl: 'DTTMPC',
      callback: this.CallBack,
    }
    this.dtp.toggleDTTMcontrol(objdttm, this);
  }

  // SetValue = function (obj) {
  //   if (obj.selectvalue != undefined && obj.selectvalue != '') {
  //     obj.fromdate = obj.mydate;
  //   }
  // }
}



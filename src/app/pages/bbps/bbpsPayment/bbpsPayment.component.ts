import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { ErrorHandler } from '../../../core/errorHandler';
import { ApiService } from '../../../core/api.service';
import { IBbps } from '../../../interface/bbps';
import { IOtp } from "../../../interface/otp";
import { IBillDetail } from '../../../interface/payment';
import { Spinner } from '../../../services/spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { Otp } from "../../../shared/component/otp/otp.component";
import { IPurchaseItem } from '../../../interface/saleItem';
import { PaymentOptionComponent } from '../../../shared/component/paymentOption/paymentOption.component';
import { UpiPayment } from '../../../shared/component/paymentOption/paymentServices/upiPayment';
import { Common } from '../../../services/common';
import { MatDialog } from "@angular/material";
import * as moment from 'moment';
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'app-bbpsPayment',
  templateUrl: './bbpsPayment.html',
  styleUrls: [
    '../bbps.component.scss'
  ],
  providers: []
})

export class BbpsPaymentComponent implements OnInit {
  // @ViewChildren(Otp) otpCntrl: QueryList<Otp>;
  @ViewChild(Otp) otpCntrl: Otp;
  @ViewChild(PaymentOptionComponent) payOption: PaymentOptionComponent;
  logInfo: ILogin;
  billDetailObj: IBillDetail;
  showPaymentOption = false;
  ItemsAll: any;
  Items: any;
  ProvidersData: any;
  providerName: any;
  clientMstId: number;
  login_user_id: string;
  sessionId: any;
  userName: string = "";
  lastLogin: string = "";
  BUSINESS_DETAILS: string = "";
  Insti_Sub_Mst_Id: string = "";
  Corporate_Flag: any;
  showOverlay = "hide";
  showAccountList: string = "hide";
  errorDisplay: any;
  purchaseItemArray: Array<IPurchaseItem> = new Array<IPurchaseItem>();
  showProviderName: boolean = true;
  // bbps variable
  Amount: any;
  tpin: any;
  fetchBillAmt: any = true;
  inputfieldarray: any;
  BillerData: any;
  fetchbillData: any;
  referenceId: any;
  ccfAmt: any;
  couccfamt: any;
  ccfobj: any;
  couccfobj: any;
  fetchbill: boolean = true;
  showTpin: boolean = false;
  fetchbillResponse: any;
  fetchbillresponseAllTagall: any;
  CurrentDate:any;
  amountLabel:any='Base Bill Amount';
  reasonresp: any;
  out = [];
  Pout = [];
  billNumber: any;
  PaidAmt: any = false;
  quickpay: any;
  providerNameClass: string = 'hide';
  aadharRemarksPay: string = '';
  showForm: string = 'show';
  TRAN_DET_ID: string = '';
  productTranId: number = 0;
  PayBillPayOnlyData: any;
  PayBillData: any;
  mobile: any = '';
  fetchbillresponseTag: any = [];
  fetchbillresponseAllTag: any;
  baseBillAmount:any;
  additionfetchbillInfo: any;
  isReadOnly: any = false;
  accountList: any;
  AccountName: any;
  Account_Number: any;
  GlCode: any;
  ChoosePaymentOption: any;
  AC_BALANCE: any;
  resentData: any;
  showRecentTab: boolean = false;


  //mobile banking
  BankArray = [];
  bbpsForm: boolean = false;
  categoryName: any = '';
  categoryMstID: any = '';
  bankFullLogo: any;
  bankname: any;
  banklogo: any = null;
  setBankLogo: any = null;
  selectedBank: any;
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;
  secretKey: any;
  showBankList = 'hide';
  listarray = [];
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;
  url: any;
  SelectbankData: any;
  vpayOtpElement: any;
  showVpayOtp: string = "hide";
  po_OTPExpDur: any;
  RRN_Number: any = '';
  CBS_TranID: any;
  OBJBillPay: any;
  Ref_ID: any;
  InetCorpoID: any;
  InetUserID: any;
  InetCorpFlag: any;
  bbpsreversmsg: any;
  termCondContent: string;

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
    let inputmodal;
    this.CurrentDate=moment(new Date).format('YYYY-MM-DD');
    this.inputfieldarray = [
      inputmodal = { name: '', type: '', isMandatory: '', minLength: '', maxLength: '', val: '' }
    ]
  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.aadharRemarksPay = this.logInfo[0].CLIENT_NAME + (this.logInfo[0].CITY_NAME ? ('-' + this.logInfo[0].CITY_NAME) : '');
    this.userName = this.logInfo[0].CLIENT_NAME;
    this.lastLogin = this.logInfo[0].LOGIN_DATE;
    this.sessionId = this.logInfo.sessionId;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.mobile = this.login_user_id;
    // if (this.logInfo[0].BANKFULLLOGO != null) {
    //   this.bankFullLogo = this.arrayBufferToBase64(this.logInfo[0].BANKFULLLOGO.data);
    //   this.bankname = this.logInfo[0].BANKNAME;
    // }
    if (this.categoryName != undefined) {
      this.BankArray = JSON.parse(this.route.queryParams["_value"].bankArray);
      this.categoryName = this.route.queryParams["_value"].bbpsCatName;
      this.categoryMstID = this.route.queryParams["_value"].bbpsCatMstID;
      if (this.BankArray != null) {

        this.InetCorpoID = this.BankArray[0].INET_CORP_ID == null ? '' : this.BankArray[0].INET_CORP_ID,
        this.InetUserID = this.BankArray[0].INET_USER_ID == null ? '' : this.BankArray[0].INET_USER_ID,
        this.InetCorpFlag = this.BankArray[0].INET_CORPORATE_FLAG == null ? 'I' : this.BankArray[0].INET_CORPORATE_FLAG
        this.selectedBank = this.BankArray[0].BANK_NAME == null ? null : this.BankArray[0].BANK_NAME;
        this.banklogo = this.BankArray[0].BANK_FULL_LOGO == null ? null : this.BankArray[0].BANK_FULL_LOGO;
        this.secretKey = this.BankArray[0].SECRET_KEY;
        this.url = this.BankArray[0].URL;
        this.Cbs_CustomerID = this.BankArray[0].CBS_CUSTOMER_ID;
        this.BANK_REG_MST_ID = this.BankArray[0].BANK_REG_MST_ID;
        this.CLIENT_MST_ID = this.BankArray[0].CLIENT_MST_ID;
        this.SUB_AG_MST_ID = this.BankArray[0].SUB_AG_MST_ID;
        this.bbpsForm = true;
        this.recent();
        this.fetchBillerList();
        this.Get_TranAccount(this.BankArray[0]);
      } else {
        this.message = "Invalid Data";
        MessageBox.show(this.dialog, this.message, "");
      }
    }
  }
  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "11", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }


  myupdate(obj) {
    let opindex = this.inputfieldarray.map(function (item) {
      return item.name;
    }).indexOf(obj.name);
    if (opindex >= 0) {
      this.inputfieldarray[opindex].myvalue = obj.value;
    }
    let a = this.inputfieldarray;
  }



  showTranAccountModal() {
    this.showAccountList = "show";
    this.showOverlay = "show";
  }

  selectedAcc(obj) {
    this.Account_Number = obj.ACCOUNT_NUMBER;
    this.AccountName = obj.ACCOUNT_NAME;
    this.GlCode = obj.GL_NAME;
    this.AC_BALANCE = obj.AC_BALANCE;
    this.btnCloseAcc();
  }

  //check request from bank or Other Payment Options
  checkpaymentMethod() {
    if (this.ChoosePaymentOption == 'Bank') {
      if(this.fetchbill == false){
        this.ValidatePayAmount();
       }
       else{
        this.validateTranotp();
       } //select Bank Option 
    }
    else if (this.ChoosePaymentOption == 'A' || this.ChoosePaymentOption == 'P') {
      this.PayBillAmount() //select Other Payment Option
    }
  }
  //for Selected Bank Call this Method
  validateTranotp() {
    // for (var i = 0; i < this.inputfieldarray.length; i++) {
    //   if (this.inputfieldarray[i].isMandatory == true && this.inputfieldarray[i].value == undefined || this.inputfieldarray[i].value == "") {
    //     this.message = this.inputfieldarray[i].name + " " + 'is Mandatory';
    //     MessageBox.show(this.dialog, this.message, "");
    //     return false;
    //   }
    //   if (this.inputfieldarray[i].value.length != this.inputfieldarray[i].minLength && this.inputfieldarray[i].value.length < this.inputfieldarray[i].minLength) {
    //     this.message = ' Minimum length for ' + " " + this.inputfieldarray[i].name + " " + "is" + " " + this.inputfieldarray[i].minLength;
    //     MessageBox.show(this.dialog, this.message, "");
    //     return false;
    //   }
    // }
    for (var i = 0; i < this.inputfieldarray.length; i++) {
      if (this.inputfieldarray[i].isMandatory == true && this.inputfieldarray[i].value == undefined || this.inputfieldarray[i].isMandatory == true && this.inputfieldarray[i].value == "") {
        this.message = this.inputfieldarray[i].name + " " + 'is Mandatory';
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.inputfieldarray[i].value.length < this.inputfieldarray[i].minLength) {
        this.message = 'Minimum length for ' + " " + this.inputfieldarray[i].name + " " + "is" + " " + this.inputfieldarray[i].minLength;
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.inputfieldarray[i].value.length > this.inputfieldarray[i].maxLength) {
        this.message = 'Minimum length for ' + " " + this.inputfieldarray[i].name + " " + "is" + " " + this.inputfieldarray[i].maxLength;
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.inputfieldarray[i].type == 'ALPHANUMERIC') {
        var filter = /^[A-Za-z0-9]*$/;
        if (!filter.test(this.inputfieldarray[i].value)) {
          this.message = 'Enter Valid ' + " " + this.inputfieldarray[i].name + " ";
          MessageBox.show(this.dialog, this.message, "");
          return false;
        }
      }
      if (this.inputfieldarray[i].type == 'NUMERIC') {
        var filter = /^[0-9]*$/;
        if (!filter.test(this.inputfieldarray[i].value)) {
          this.message = 'Enter Valid ' + " " + this.inputfieldarray[i].name + " ";
          MessageBox.show(this.dialog, this.message, "");
          return false;
        }
      }
    }

    if (this.Amount == null || this.Amount == undefined || this.Amount == "") {
      this.message = 'Enter Amount';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Amount <= 0) {
      // alert('Enter Valid Amonut');
      this.message = 'Enter Valid Amount';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.tpin == undefined || this.tpin == 0) {
      this.message = 'Please Enter Your TPIN.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.tpin.length != 4) {
      this.message = 'Please Enter Your 4 digit TPIN.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.Get_TranOTPProcess();
  }


  //Set Transaction Otp
  Get_TranOTPProcess() {
    this.spinner.show();
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Account_No: this.Account_Number,
      Tran_Mode: 'BBPS',
      Bene_Account: '',
      Tran_Amount: this.Amount,
      Tran_Remark: 'remark',
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: this.login_user_id,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Corporate_Flag: this.Corporate_Flag,
      Secret_Key: this.secretKey,
      url: this.url,
      Customer_ID: this.Cbs_CustomerID,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      TPIN: this.tpin,
      RRN_Number: '',
      CBS_TranID: ''
    }
    
    let pageObj = this;
    this.apiService.sendToServer<IOtp>('/api/virtualpay/GetTranOTPRequest', paramObj, pageObj).subscribe((data) => {
      pageObj.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].RESPONSE_CODE == '00') {
          pageObj.RRN_Number = data.cursor1[0].RRN_NUMBER;
          pageObj.showVpayOtp = 'show';
          pageObj.showForm = 'hide';
          data.po_OTPExpDur = data.cursor1[0].OTP_EXPDURATION;
          pageObj.otpCntrl.placeholder = 'Enter Otp';
          pageObj.otpCntrl.showOtp(data, pageObj);
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      pageObj.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }


  //BBPS Payment Process
  bbpsPaymentProcess() {    
    // this.spinner.show();
    // this.apiService.sendToServer<IOtp>('/api/virtualpay/GetTranRequest', paramObj, this).subscribe((data) => {
    //   this.spinner.hide();
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      CBS_AcNo: this.Account_Number,
      Customer_ID: this.Cbs_CustomerID,
      login_user_id: this.login_user_id,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Corporate_Flag: this.Corporate_Flag,
      CBS_OTP: this.otpCntrl.otp,
      RRN_Number: this.RRN_Number,
      Secret_Key: this.secretKey,
      url: this.url,
      Account_No: this.Account_Number,
      Tran_Mode: 'BBPS',
      Bene_Account: '',
      Tran_Amount: this.Amount,
      Tran_Remark: 'remark',
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      CBS_TranID: '',
      Client_Mst_ID: this.clientMstId,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Request_Mode: 26, //this.Request_Mode,,
      Trancode: 200,//this.Trancode,
      Accept_Reject: 'Y',
      Reject_Reason: ''
    }
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualPay/Authorize', paramObj, this).subscribe((data) => {
      this.spinner.hide();

    
    //this.SMS_SENDER = this.beforeLoginInfo.SMS_SENDER_NAME;

      if (data != null && data != undefined) {
        if (data.Po_Error != null) {
          this.message = data.Po_Error;
          MessageBox.show(this.dialog, this.message, "");
        }
        else {
          if (data.code === 1) {
            if (data.cursor1[0].RESPONSE_CODE == '00') {
              this.CBS_TranID = data.cursor1[0].CBSTRNREFNO;
              paramObj.CBS_TranID = this.CBS_TranID;
              this.OBJBillPay = paramObj;
              this.PayBillAmount();
            }
            else {
              this.message = data.cursor1[0].RESPONSE_MESSAGE;
              MessageBox.show(this.dialog, this.message, "");
              return false;
            }
          }
        }
      }
    }, err => {
      this.errorHandler.handlePageError(err);
      this.spinner.hide();
    });
    this.otpCntrl.otp = '';
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

  //Agent Login
  AgentLogin() {
    this.spinner.show();
    var paramObj = {
      // Client_Mst_ID: this.model.client_mst_id,
      KEYWORD: 'AgentLogin',
      VARCHAR_1: 'SUMzMTAwMDAwMDAwMDAwMDAwNzg6cGFzc3dvcmQ=',
      USERNAME: 'abcd',
      PASSWORD: 'abcd',
      request_from: 'MB',
      device_id: 'SID',
      Device_Id: 'SID',
    }
    this.apiService.sendToServer<IBbps>('/api/virtualpay/AgentLogin', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.errorMessages.length > 0) {
          let errorsMsg = data.errorMessages;
          if (errorsMsg != null) {
            this.message = errorsMsg[0].errorDtl;
            MessageBox.show(this.dialog, this.message, "");
            return false;
          }
        }
        else {
          // console.log(this.inputfieldarray);
          // this.fetchBill(data);
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "")
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);

    });
  }


  fetchBillerList() {
    this.spinner.show();
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Cat_Mst_Id: this.categoryMstID,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      // KEYWORD: 'GetBillerList',
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,
      VARCHAR_1: this.categoryName,
      request_from: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      Method_Name: 'GetBillerList',
      Actual_String: this.categoryName + '~' + 'WB' + '~' + this.SUB_AG_MST_ID + '~' + this.clientMstId + '~' + this.BANK_REG_MST_ID + '~' + 'GetBillerList'
    }

    this.apiService.sendToServer<IBbps>('/api/virtualPay/GetBBPSRequest', paramObj, this).subscribe((data) => {
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.ProvidersData = data.billers;
        this.ItemsAll = this.ProvidersData;
        this.Items = this.ProvidersData;
        this.spinner.hide();
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

  reset() {
    this.providerNameClass = 'hide';
    this.providerName = '';
  }

  //Get Customer Bill Parameters
  GetBillCutsomerparams(id) {
    var paramObj = {
      // Client_Mst_ID: this.model.client_mst_id,
      //KEYWORD:'FetchBill',
      //Secret_Key: this.secretKey,
      VARCHAR_1: id,
      Cat_Mst_Id: this.categoryMstID,
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      request_from: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      Method_Name: 'GetBillerCustomerParameters',
      Actual_String: id + '~' + 'WB' + '~' + this.SUB_AG_MST_ID + '~' + this.clientMstId + '~' + this.BANK_REG_MST_ID + '~' + 'GetBillerCustomerParameters'
    }
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/GetBBPSRequest', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        let errorsMsg = data.errorMessages;
        if (data.errorMessages.length > 0) {
          // alert(errorsMsg[0].errorDtl)
          this.message = errorsMsg[0].errorDtl;
          MessageBox.show(this.dialog, this.message, "");
          return false;
        }
        else {
          if (data.customParams.length > 0) {
            this.inputfieldarray = data.customParams;
            if (this.BillerData.BILLER_MOB_NO != undefined) {
              for (var i = 0; i < this.inputfieldarray.length; i++) {
                this.inputfieldarray[i].value = this.BillerData.BILLER_MOB_NO;
              }
              //this.Amount=this.BillerData  .BILL_AMOUNT;
              this.fetchbillbyParams();
            }
          }
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

  //check Fetch Bill Parameters
  fetchbillbyParams() {
    if (!this.providerName || (this.providerName && this.providerName.length == 0)) {
      // alert("Please select Provider Name");
      this.message = "Please Select Provider Name.";
      MessageBox.show(this.dialog, this.message, "");
      this.providerName = '';
      // const txtAadharBank = this.renderer2.selectRootElement('#txtAadharBank');
      // setTimeout(() => txtAadharBank.focus(), 0);
      // this.fetchbill=true;
      return false;
    }
    if (this.mobile == undefined || this.mobile == null) {
      this.message = "Enter Mobile Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.mobile.trim().length != 10) {
      this.message = "Enter 10 digit Mobile Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    // for (var i = 0; i < this.inputfieldarray.length; i++) {
    //   if (this.inputfieldarray[i].isMandatory == true && this.inputfieldarray[i].value == undefined || this.inputfieldarray[i].value == "") {
    //     this.message = this.inputfieldarray[i].name + " " + 'is Mandatory';
    //     MessageBox.show(this.dialog, this.message, "");
    //     return false;
    //   }
    //   if (this.inputfieldarray[i].value.length != this.inputfieldarray[i].minLength && this.inputfieldarray[i].value.length < this.inputfieldarray[i].minLength) {
    //     this.message = ' Minimum length for ' + " " + this.inputfieldarray[i].name + " " + "is" + " " + this.inputfieldarray[i].minLength;
    //     MessageBox.show(this.dialog, this.message, "");
    //     return false;
    //   }
    // }
    for (var i = 0; i < this.inputfieldarray.length; i++) {
      if (this.inputfieldarray[i].isMandatory == true && this.inputfieldarray[i].value == undefined || this.inputfieldarray[i].isMandatory == true && this.inputfieldarray[i].value == "") {
        this.message = this.inputfieldarray[i].name + " " + 'is Mandatory.';
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.inputfieldarray[i].value.length < this.inputfieldarray[i].minLength) {
        this.message = 'Minimum length for ' + " " + this.inputfieldarray[i].name + " " + "is" + " " + this.inputfieldarray[i].minLength;
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.inputfieldarray[i].value.length > this.inputfieldarray[i].maxLength) {
        this.message = 'Minimum length for ' + " " + this.inputfieldarray[i].name + " " + "is" + " " + this.inputfieldarray[i].maxLength;
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.inputfieldarray[i].type == 'ALPHANUMERIC') {
        var filter = /^[A-Za-z0-9]*$/;
        if (!filter.test(this.inputfieldarray[i].value)) {
          this.message = 'Enter Valid ' + " " + this.inputfieldarray[i].name + " ";
          MessageBox.show(this.dialog, this.message, "");
          return false;
        }
      }
      if (this.inputfieldarray[i].type == 'NUMERIC') {
        var filter = /^[0-9]*$/;
        if (!filter.test(this.inputfieldarray[i].value)) {
          this.message = 'Enter Valid ' + " " + this.inputfieldarray[i].name + " ";
          MessageBox.show(this.dialog, this.message, "");
          return false;
        }
      }
    }
    this.fetchBill();
  }


  //Fetch Bill
  fetchBill() {

    var paramObj = {
      Cat_Mst_Id: this.categoryMstID,
      VARCHAR_6: this.BillerData.id,
      VARCHAR_7: this.mobile == null ? this.logInfo[0].LOGIN_USER_ID : this.mobile,//this.loginInfo.LOGIN_USER_ID,
      VARCHAR_8: 'IC31',
      VARCHAR_9: 'IC31',
      VARCHAR_11: this.inputfieldarray[0] == undefined ? '' : this.inputfieldarray[0].name,
      VARCHAR_12: this.inputfieldarray[0] == undefined ? '' : this.inputfieldarray[0].value,
      VARCHAR_13: this.inputfieldarray[1] == undefined ? '' : this.inputfieldarray[1].name,
      VARCHAR_14: this.inputfieldarray[1] == undefined ? '' : this.inputfieldarray[1].value,
      VARCHAR_15: this.inputfieldarray[2] == undefined ? '' : this.inputfieldarray[2].name,
      VARCHAR_16: this.inputfieldarray[2] == undefined ? '' : this.inputfieldarray[2].value,
      VARCHAR_17: this.inputfieldarray[3] == undefined ? '' : this.inputfieldarray[3].name,
      VARCHAR_18: this.inputfieldarray[3] == undefined ? '' : this.inputfieldarray[3].value,
      VARCHAR_19: this.inputfieldarray[4] == undefined ? '' : this.inputfieldarray[4].name,
      VARCHAR_20: this.inputfieldarray[4] == undefined ? '' : this.inputfieldarray[4].value,
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      Method_Name: 'FetchBill',
      Actual_String: {},
      request_from: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
    }
    paramObj.Actual_String = (JSON.stringify(paramObj));
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/GetBBPSRequest', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      let fetchbillresponseTag = []; let fetchbillresponseAllTagresponse=[];
      this.additionfetchbillInfo=[];
       if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
         if (data.errorMessages.length > 0) {
           let errorsMsg = data.errorMessages;
           if (errorsMsg != null) {
             this.message = errorsMsg[0].errorDtl;
             MessageBox.show(this.dialog,this.message,'');
             return false;
           }
         }
         else {
           this.showTpin =true;
           this.referenceId = data.refId;
           if (data.billerResponse != null) {
             this.fetchbillResponse = data.billerResponse;
             this.billNumber = this.fetchbillResponse.billNumber;
             this.reasonresp = data.reason;
             if (data.billerResponse.tags.length > 0) {
               //Tags IN Bill Response
               for (var i = 0; i < data.billerResponse.tags.length; i++) {
                 let tagsData = {
                   'name': data.billerResponse.tags[i].value.split('=')[0].replace(/ *\([^)]*\) */g, ""),
                   'value':data.billerResponse.tags[i].value.split('=')[1]
                 }
                fetchbillresponseTag.push(tagsData);   
                 this.baseBillAmount= fetchbillresponseTag[0].value;
               }
               this.fetchbillresponseAllTag = fetchbillresponseTag;
               fetchbillresponseAllTagresponse = fetchbillresponseTag ;
             }
                       
             let billDate={
               'name':'Bill Date',
               'value':this.fetchbillResponse.billDate
             }
             fetchbillresponseAllTagresponse.push(billDate);
             if (data.additionalInfo.tags.length > 0) {
               //Aditional Inforamtion Array 
              // this.additionfetchbillInfo = data.additionalInfo.tags;
 
               for(let i=0; i< data.additionalInfo.tags.length;i++){
                 if( data.additionalInfo.tags[i].name == "Early Payment Date"){
                   fetchbillresponseAllTagresponse.push(data.additionalInfo.tags[i])
                 }
                 else if(data.additionalInfo.tags[i].name != "Early Payment Date"){
                   this.additionfetchbillInfo.push(data.additionalInfo.tags[i])
                 }
               }
              }
             
             let dueDate={
               'name':'Late Payment Date',
               'value': this.fetchbillResponse.dueDate
             }
                       
             fetchbillresponseAllTagresponse.push(dueDate);
             this.fetchbillresponseAllTagall=fetchbillresponseAllTagresponse;
             console.log(this.CurrentDate);
             this.fetchbillresponseAllTagall.sort(function (a, b) {
               var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
               if (nameA < nameB) //sort string ascending
                 return -1
               if (nameA > nameB)
                 return 1
               return 0 //default return value (no sorting)
             })
           console.log( this.fetchbillresponseAllTagall);
            let Bill_Date =this.fetchbillresponseAllTagall.filter(item=>item.name == "Bill Date"); 
            let Bill_Due_Date =this.fetchbillresponseAllTagall.filter(item=>item.name == "Late Payment Date"); 
            let Early_Bill_Date =this.fetchbillresponseAllTagall.filter(item=>item.name == "Early Payment Date"); 
            let Bill_Amount =this.fetchbillresponseAllTagall.filter(item=>item.name == "Bill Amount"); 
            let Bill_Due_Amount =this.fetchbillresponseAllTagall.filter(item=>item.name == "Late Payment Amount"); 
            let Early_Bill_Amount =this.fetchbillresponseAllTagall.filter(item=>item.name == "Early Payment Amount"); 
        
             if (Early_Bill_Date.length > 0) {
               if (this.CurrentDate < Early_Bill_Date[0].value) {
                 this.Amount = (Early_Bill_Amount[0].value);
                 this.amountLabel = 'Early Payment Date'
               }
               else if (this.CurrentDate >= Early_Bill_Date[0].value ||
                 this.CurrentDate < Bill_Due_Date[0].value) {
                 this.Amount = (Bill_Amount[0].value);
                 this.amountLabel = 'Base Bill Amount'
               }
               else if (this.CurrentDate > Bill_Due_Date[0].value) {
                 this.Amount = (Bill_Due_Amount[0].value);
                 this.amountLabel = 'Late Payment Amount'
               }
             }
             else{
              if (this.CurrentDate >= Bill_Date[0].value ||
                 this.CurrentDate < Bill_Due_Date[0].value) {
                  this.Amount = (Bill_Amount[0].value);
                  this.amountLabel='Base Bill Amount'
                }
             else if (this.CurrentDate > Bill_Due_Date[0].value) {
               this.Amount = (Bill_Amount[0].value);
               this.amountLabel = 'Late Payment Amount'
             }
           }  
             this.fetchBillAmt = false;
             this.GetTaxAmount();
             this.isReadOnly = true;
          
           }
         }
 
 
       }
      // if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
      //   if (data.errorMessages.length > 0) {
      //     let errorsMsg = data.errorMessages;
      //     if (errorsMsg != null) {
      //       // alert(errorsMsg[0].errorDtl)
      //       this.message = errorsMsg[0].errorDtl;
      //       MessageBox.show(this.dialog, this.message, "");
      //       return false;
      //     }
      //   }
      //   else {
      //     this.referenceId = data.refId;
      //     if (data.billerResponse != null) {
      //       this.fetchbillResponse = data.billerResponse;
      //       this.billNumber = this.fetchbillResponse.billNumber;
      //       this.reasonresp = data.reason;
      //       if (data.billerResponse.tags.length > 0) {
      //         //Tags IN Bill Response
      //         for (var i = 0; i < data.billerResponse.tags.length; i++) {
      //           let tagsData = {
      //             'name': data.billerResponse.tags[i].value.split('=')[0].replace(/ *\([^)]*\) */g, ""),
      //             'value': '₹' + ' ' + data.billerResponse.tags[i].value.split('=')[1]
      //           }
      //           this.fetchbillresponseTag.push(tagsData);
      //           this.baseBillAmount= this.fetchbillresponseTag[0].value;
      //         }
      //         this.fetchbillresponseAllTag = this.fetchbillresponseTag;
      //       }
      //       this.Amount = (data.billerResponse.amount) / 100;
      //       this.Amount = parseFloat(this.Amount).toFixed(2);
      //       if (data.additionalInfo.tags.length > 0) {
      //         //Aditional Inforamtion Array 
      //         this.additionfetchbillInfo = data.additionalInfo.tags;
      //         // this.fetchbillresponseAllTag=this.fetchbillresponseTag.concat(this.additionfetchbillInfo);
      //       }
      //       this.fetchBillAmt = false;
      //       this.GetTaxAmount();
      //       this.isReadOnly = true;
      //       this.showProviderName = false;
      //       this.inputfieldarray = null;

      //       // $('#custparams').css('display','none');
      //       // this.fetchbill=false;
      //     }
      //   }

      // }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  //Get Transaction Account
  Get_TranAccount(obj) {
    this.spinner.show();
    var paramObj = {
      Device_Id: 'Desktop',
      request_from: 'WB',
      Client_Mst_ID: this.clientMstId,
      Bank_Reg_Mst_Id: obj.BANK_REG_MST_ID,
      Secret_Key: obj.SECRET_KEY,
      url: obj.URL,
      Session_Id: this.sessionId,
      Source: '',
      Customer_ID: obj.CBS_CUSTOMER_ID,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag
    };
    this.apiService.sendToServer<IBbps>('/api/virtualpay/Get_TranAccount', paramObj, this).subscribe((data) => {
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.ChoosePaymentOption = 'Bank';
        if (data.cursor1.length == 1) {
          this.accountList = data.cursor1;
          this.Account_Number = data.cursor1[0].ACCOUNT_NUMBER;
          this.AccountName = data.cursor1[0].ACCOUNT_NAME;
          this.GlCode = data.cursor1[0].GL_NAME;
          this.AC_BALANCE = data.cursor1[0].AC_BALANCE;
        }
        else {
          this.Account_Number = data.cursor1[0].ACCOUNT_NUMBER;
          this.AccountName = data.cursor1[0].ACCOUNT_NAME;
          this.GlCode = data.cursor1[0].GL_NAME;
          this.AC_BALANCE = data.cursor1[0].AC_BALANCE;
          this.accountList = data.cursor1;
          // this.showTranAccountModal();
        }
        this.spinner.hide();
        const txtproviderName = this.renderer2.selectRootElement('#txtproviderName');
        setTimeout(() => txtproviderName.focus(), 0);
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }

  clearPage() {
    this.additionfetchbillInfo = null;
    this.inputfieldarray = null;
    this.Amount = '';
    this.fetchbillResponse = null;
    this.reasonresp = null;
    this.providerNameClass = 'hide';
  }

  recentProviderSelect(obj) {
    this.showRecentTab = false;
    this.providerName = obj.name;
    this.BillerData = obj;
    this.setProviderName();
  }

  setProviderName() {
    this.clearPage();
    let pageObj = this;
    if (this.BillerData == null) {
      let selProviderName = this.ItemsAll.filter(a => a.name == pageObj.providerName);
      if (!selProviderName || (selProviderName && selProviderName.length == 0)) {
        // alert("Please select Provider Name");
        this.message = "Please select Provider Name";
        MessageBox.show(this.dialog, this.message, "");
        pageObj.providerName = '';
        pageObj.providerNameClass = 'hide';
        return false;
      }
      pageObj.providerName = selProviderName[0].name;
      pageObj.BillerData = selProviderName[0];
    }
    if (pageObj.BillerData.id != undefined || pageObj.BillerData.id != null) {
      pageObj.GetBillCutsomerparams(pageObj.BillerData.id)
      pageObj.providerNameClass = 'show';
      pageObj.showRecentTab = false;
      pageObj.Amount = null;
      if (pageObj.BillerData.fetchRequirement == "MANDATORY" || pageObj.BillerData.fetchRequirement == "OPTIONAL") {
        pageObj.fetchBillAmt = true;
        pageObj.fetchbill = true;
        pageObj.quickpay = 'NO';
        //
      }
      else {
        if (pageObj.BillerData.blrSupportBillValidation == "MANDATORY" || pageObj.BillerData.blrSupportBillValidation == "OPTIONAL") {
          this.quickpay = 'NO';
          this.fetchBillAmt = false;
          this.fetchbill = false;
        }
        else{
          pageObj.fetchBillAmt = false;
          pageObj.fetchbill = false;
          pageObj.quickpay = 'YES';
          //this.fetchbill=true;
        }
      }
    }
  }

  recent() {
    var paramObj = {
      Cat_Mst_Id: this.categoryMstID, //'Electricity',
      Client_Mst_Id: this.clientMstId,
    }
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualPay/BBPSBillerHistory', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.resentData = data.data;
        var rsdata = [];
        this.showRecentTab = true;
        for (var i = 0; i < data.data.length; i++) {
          var d = {
            'name': data.data[i].BILLER_NAME,
            'id': data.data[i].BILLER_ID,
            'BILLER_MOB_NO': data.data[i].BILLER_MOB_NO,
            'BILL_AMOUNT': data.data[i].BILL_AMOUNT,
            'img': 'assets/images/DefaultIcon.png',
            'fetchRequirement': 'MANDATORY'
          }
          rsdata.push(d);
        }
        this.resentData = rsdata;
      }
      else {
        if (data.msg != "Record not Found.") {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });

  }


  //cbs bank selected data

  bankListData(bankData) {
    this.bbpsForm = true;
    this.setBankLogo = bankData.BANK_FULL_LOGO;
    this.categoryName = this.route.queryParams["_value"].bbpsCatName;
    this.showBankList = "hide";
    this.showOverlay = "hide";
    // this.SelectbankData = bankData;
    if (bankData.SECRET_KEY != null) {
      this.selectedBank = bankData.BANK_NAME;
      this.banklogo = bankData.BANK_FULL_LOGO == null ? '' : this.arrayBufferToBase64(this.BankArray[0].BANK_FULL_LOGO.data);
      this.secretKey = bankData.SECRET_KEY;
      this.url = bankData.URL;
      this.Cbs_CustomerID = bankData.CBS_CUSTOMER_ID;
      this.BANK_REG_MST_ID = bankData.BANK_REG_MST_ID;
      this.CLIENT_MST_ID = bankData.CLIENT_MST_ID;
      this.SUB_AG_MST_ID = bankData.SUB_AG_MST_ID;
      this.Get_TranAccount(bankData);
    } else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");
    }
  }

  showBankModal() {
    this.listarray = [];
    this.BankArray = [];
    this.bbpsForm = false;
    this.showBankList = 'show';
    this.showOverlay = 'show';
    this.providerName = '';
    this.providerNameClass = 'hide';
  }

  btnClose() {
    // this.showProdList = 'show';
    this.showBankList = "hide ";
    this.showOverlay = "hide";

    this.router.navigate(['/bbps']);
    // this.disDevTab = "show";
  }
  btnCloseAcc() {
    this.showAccountList = "hide";
    this.showOverlay = "hide";
  }

  


  //Calculate Tax Amount
  GetTaxAmount() {
    var paramObj = {
      // Client_Mst_ID: this.model.client_mst_id,
      KEYWORD: 'GetTaxAmount',
      VARCHAR_1: this.Amount, //Amount
      VARCHAR_2: this.BillerData.id, //billerId
      VARCHAR_3: 'YES',
      VARCHAR_4: 'Cash',
      VARCHAR_5: this.quickpay,
      VARCHAR_6: 'NO',
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Cat_Mst_Id: this.categoryMstID,
      Client_Mst_Id: this.clientMstId,
      Method_Name: 'GetTaxAmount',
      Actual_String: this.Amount + '~' + this.BillerData.id + '~' + 'YES' + '~' + 'Cash' + '~' + this.quickpay + '~' + 'NO' + '~' + this.SUB_AG_MST_ID + '~' + this.clientMstId + '~' + this.BANK_REG_MST_ID + '~' + 'GetTaxAmount'
    }
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/GetBBPSRequest', paramObj, this).subscribe((data) => {
      // if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
      //   if (data.errors.length > 0) {
      //     let errorsMsg = data.errors;
      //     if (errorsMsg != null) {
      //       // alert(errorsMsg[0].errorDtl)
      //       this.message = errorsMsg[0].errorDtl;
      //       MessageBox.show(this.dialog, this.message, "");
      //       return false;
      //     }
      //   }
      //   else {
      //     this.ccfAmt = parseInt(data.ccf.amount) + parseInt(data.ccf.cgst.value) + parseInt(data.ccf.igst.value) + parseInt(data.ccf.sutgst.value)
      //     this.couccfamt = parseInt(data.couccf.amount) + parseInt(data.couccf.cgst.value) + parseInt(data.couccf.igst.value) + parseInt(data.couccf.sutgst.value)
      //     this.ccfobj = data.ccf;
      //     this.couccfobj = data.couccf;
      //     if (this.fetchbill == false) {
      //       this.GenerateReferenceID();
      //     }
      //   }

      // }
      // else {
      //   this.message = data.msg;
      //   MessageBox.show(this.dialog, this.message, "");
      // }
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.errors == undefined) {
          this.message = data.message;
          MessageBox.show(this.dialog, this.message, "");
          this.errorDisplay = data.message;
          if (this.OBJBillPay != null) {
            this.Send_Reversal_Request();
          }
          return false;
        }
        if (data.errors.length > 0) {
          let errorsMsg = data.errors;
          if (errorsMsg != null) {
            this.errorDisplay = errorsMsg[0].errorDtl;
            this.message = errorsMsg[0].errorDtl;
            MessageBox.show(this.dialog, this.message, "");
            if (this.OBJBillPay != null) {
              this.Send_Reversal_Request();
            }
            return false;
          }
        }
        else {
          this.ccfAmt = parseInt(data.ccf.amount) + parseInt(data.ccf.cgst.value) + parseInt(data.ccf.igst.value) + parseInt(data.ccf.sutgst.value)
          this.couccfamt = parseInt(data.couccf.amount) + parseInt(data.couccf.cgst.value) + parseInt(data.couccf.igst.value) + parseInt(data.couccf.sutgst.value)
          this.ccfobj = data.ccf;
          this.couccfobj = data.couccf;
          if (this.fetchbill == false) {
            this.GenerateReferenceID();
          }
        }

      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
      this.errorDisplay = err;
      if (this.OBJBillPay != null) {
        this.Send_Reversal_Request();
      }
    });
  }

  //Onlu used for PayBillOnly Method  ValidateCustomerParameters
  GenerateReferenceID() {
    var paramObj = {
      VARCHAR_1: 'IC31',
      VARCHAR_2: '',              // ID
      VARCHAR_3: this.BillerData.id, //Biller ID  
      VARCHAR_4: this.inputfieldarray[0] == undefined ? '' : this.inputfieldarray[0].name,
      VARCHAR_5: this.inputfieldarray[0] == undefined ? '' : this.inputfieldarray[0].value,
      VARCHAR_6: this.inputfieldarray[1] == undefined ? '' : this.inputfieldarray[1].name,
      VARCHAR_7: this.inputfieldarray[1] == undefined ? '' : this.inputfieldarray[1].value,
      VARCHAR_8: this.inputfieldarray[2] == undefined ? '' : this.inputfieldarray[2].name,
      VARCHAR_9: this.inputfieldarray[2] == undefined ? '' : this.inputfieldarray[2].value,
      VARCHAR_10: this.inputfieldarray[3] == undefined ? '' : this.inputfieldarray[3].name,
      VARCHAR_11: this.inputfieldarray[3] == undefined ? '' : this.inputfieldarray[3].value,
      VARCHAR_12: this.inputfieldarray[4] == undefined ? '' : this.inputfieldarray[4].name,
      VARCHAR_13: this.inputfieldarray[4] == undefined ? '' : this.inputfieldarray[4].value,
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,
      Cat_Mst_Id: this.categoryMstID,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      Method_Name: 'ValidateCustomerParameters',
      Actual_String: {}
    }

    paramObj.Actual_String = (JSON.stringify(paramObj));
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/GetBBPSRequest', paramObj, this).subscribe((data) => {
      // if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
      //   if (data.errorMessages.length > 0) {
      //     let errorsMsg = data.errorMessages;
      //     if (errorsMsg != null) {
      //       // alert(errorsMsg[0].errorDtl);
      //       this.message = errorsMsg[0].errorDtl;
      //       MessageBox.show(this.dialog, this.message, "");
      //       return false;
      //     }
      //   }
      //   else {
      //     this.Ref_ID = data.refId;
      //     if (this.Ref_ID != null)
      //       this.GenerateTxnReferenceId();
      //   }
      // }
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.errorMessages == undefined) {
          this.message = data.message;
          MessageBox.show(this.dialog, this.message, "");
          if (this.OBJBillPay != null) {
            this.Send_Reversal_Request();
          }
          return false;
        }
        if (data.errorMessages.length > 0) {
          let errorsMsg = data.errorMessages;
          if (errorsMsg != null) {
            this.errorDisplay = errorsMsg[0].errorDtl;
            this.message = errorsMsg[0].errorDtl;
            MessageBox.show(this.dialog, this.message, "");
            if (this.OBJBillPay != null) {
              this.Send_Reversal_Request();
            }
            return false;
          }
        }
        else {
          this.Ref_ID = data.refId;
          if (this.Ref_ID != null)
            this.GenerateTxnReferenceId();
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
      this.errorDisplay = err;
      if (this.OBJBillPay != null) {
        this.Send_Reversal_Request();
      }
    });


  }

  //Generate Transaction Reference ID
  GenerateTxnReferenceId() {
    var paramObj = {
      // Client_Mst_ID: this.model.client_mst_id,
      //KEYWORD: 'GenerateTxnReferenceId',
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      Method_Name: 'GenerateTxnReferenceId',
      Cat_Mst_Id: this.categoryMstID,
      Actual_String: this.SUB_AG_MST_ID + '~' + this.clientMstId + '~' + this.BANK_REG_MST_ID + '~' + 'GenerateTxnReferenceId'
    }
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/GetBBPSRequest', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        // if (data.errorMessages.length > 0) {
        //   let errorsMsg = data.errorMessages;
        //   if (errorsMsg != null) {
        //     alert(errorsMsg[0].errorDtl)
        //     return false;
        //   }
        // }
        // else{
        if (this.fetchbill == true) {
          this.PayBill(data.id);
        }
        else if (this.fetchbill == false) {
          this.PayBillOnly(data.id)
        }
        // }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
      this.errorDisplay = err;
      if (this.OBJBillPay != null) {
        this.Send_Reversal_Request();
      }
    });
  }

  //Call method Directly for other Payment Options only

  PayBillAmount() {
    this.PaidAmt = true;
    //this.showpayBank();
    for (var i = 0; i < this.inputfieldarray.length; i++) {
      if (this.inputfieldarray[i].isMandatory == true && this.inputfieldarray[i].value == undefined || this.inputfieldarray[i].value == "") {
        this.message = this.inputfieldarray[i].name + " " + 'is Mandatory';
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.inputfieldarray[i].value.length != this.inputfieldarray[i].minLength && this.inputfieldarray[i].value.length < this.inputfieldarray[i].minLength) {
        this.message = ' Minimum length for ' + " " + this.inputfieldarray[i].name + " " + "is" + " " + this.inputfieldarray[i].minLength;
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    }
    if (this.Amount == null || this.Amount == undefined || this.Amount == "") {
      this.message = "Enter Amount";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.fetchbill == false) {
      this.GetTaxAmount();  //For Pay Bill Method
    } else {
      this.GenerateTxnReferenceId();  //Pay Bill Only
    }
  }


  PayBill(TxnReferenceId) {
    var paramObj = {
      // Client_Mst_ID: this.client_mst_id,
      // KEYWORD: 'PayBill',                                                 //Method Name
      VARCHAR_1: this.referenceId,                                         //referenceId
      VARCHAR_2: this.login_user_id,                             //this.logInfo[0].LOGIN_USER_ID,   //customer mobile
      VARCHAR_3: 'burghatesachin@gmail.com',                               //customer Email
      VARCHAR_4: '',
      VARCHAR_5: 'IC31',                                                    //BouCode
      VARCHAR_6: this.BillerData.id,                                        //Biller ID
      VARCHAR_7: 'NO',                                                      //quickPayIC#!
      VARCHAR_8: 'NO',                                                      //splitPay
      VARCHAR_9: 'Internet Banking',                                        //paymentMode
      VARCHAR_10: '',
      VARCHAR_11: (this.Amount * 100),                                      //BillAmount
      VARCHAR_12: this.ccfAmt,                                              //Customer Convience Fees
      VARCHAR_13: 0,
      VARCHAR_14: this.couccfamt,                                           //Cou CCF
      VARCHAR_15: (this.Amount * 100),                                      //BillAmount
      VARCHAR_16: TxnReferenceId,                                           //clientReferenceID
      VARCHAR_17: 'Remarks',                                                //Remark
      VARCHAR_21: this.inputfieldarray[0] == undefined ? '' : this.inputfieldarray[0].name, //Input Parameters Key
      VARCHAR_22: this.inputfieldarray[0] == undefined ? '' : this.inputfieldarray[0].value,//Input Parameters Value
      VARCHAR_23: this.inputfieldarray[1] == undefined ? '' : this.inputfieldarray[1].name,
      VARCHAR_24: this.inputfieldarray[1] == undefined ? '' : this.inputfieldarray[1].value,
      VARCHAR_25: this.inputfieldarray[2] == undefined ? '' : this.inputfieldarray[2].name,
      VARCHAR_26: this.inputfieldarray[2] == undefined ? '' : this.inputfieldarray[2].value,
      VARCHAR_27: this.inputfieldarray[3] == undefined ? '' : this.inputfieldarray[3].name,
      VARCHAR_28: this.inputfieldarray[3] == undefined ? '' : this.inputfieldarray[3].value,
      VARCHAR_29: this.inputfieldarray[4] == undefined ? '' : this.inputfieldarray[4].name,
      VARCHAR_30: this.inputfieldarray[4] == undefined ? '' : this.inputfieldarray[4].value,
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      Cat_Mst_Id : this.categoryMstID,
      Method_Name: 'PayBill',
      Actual_String: {}
    }
    paramObj.Actual_String = (JSON.stringify(paramObj));
    let PayBillData = paramObj;
    if (this.ChoosePaymentOption == 'Bank') {
      this.router.navigate(['/bbps/bbpsTransaction'], {
        queryParams: {
          'PayBill': JSON.stringify(PayBillData), 'CBSBillPaymentData': JSON.stringify(this.OBJBillPay),
          'Category_ID': this.categoryMstID, 'bankArray': JSON.stringify(this.BankArray)
        }, skipLocationChange: true
      });
    }
    //  else if(this.ChoosePaymentOption=='P'){
    //   this.navCtrl.push(PAYMENT_GATEWAY, {'PayBill': PayBillData, 'Category_ID':this.categoryname.CAT_MST_ID,
    //     'paymentMode':'Payment Gateway','frompage':'BBPS_BillPayment' });

    //  }
    //  else if(this.ChoosePaymentOption=='A'){
    //   this.navCtrl.push(AADHAR,{'PayBill':this.PayBillData, 'Category_ID':this.categoryname.CAT_MST_ID,
    //   'paymentMode':'Aadhar Pay','frompage':'BBPS_BillPayment'});
    //   }



  }


  //Pay Bill Without Featching Bill Data 
  PayBillOnly(TxnReferenceId) {
    var paramObj = {
      // Client_Mst_ID: this.model.client_mst_id,
      KEYWORD: 'PayBillPayOnly',                                    //Method Name
      VARCHAR_1: this.login_user_id,//'7798880952'                      //this.loginInfo.LOGIN_USER_ID,   //customer mobile
      VARCHAR_2: 'burghatesachin@gmail.com',                         //customer Email
      VARCHAR_3: '',                                                //this.referenceId
      VARCHAR_4: 'IC31',                                            //id
      VARCHAR_5: this.BillerData.id,                                //Biller ID
      VARCHAR_6: this.quickpay,                                             //quickPayIC#!
      VARCHAR_7: 'NO',                                              //splitPay
      VARCHAR_8: 'Internet Banking',                                //paymentMode
      VARCHAR_9: (this.Amount * 100),                               //BillAmount
      VARCHAR_10: this.ccfAmt,                                      //Customer Convience Fees              
      VARCHAR_11: 0,
      VARCHAR_12: this.couccfamt,                                   //Cou CCF
      VARCHAR_13: (this.Amount * 100),                              //Bill Amount 
      VARCHAR_14: TxnReferenceId,                                   //clientReferenceID
      VARCHAR_15: 'Remark',
      VARCHAR_16: this.Ref_ID,                                                 // refId                                         //Remark
      VARCHAR_17: this.inputfieldarray[0] == undefined ? '' : this.inputfieldarray[0].name,   //InputParameters Key
      VARCHAR_18: this.inputfieldarray[0] == undefined ? '' : this.inputfieldarray[0].value,   //InputParameters Value
      VARCHAR_19: this.inputfieldarray[1] == undefined ? '' : this.inputfieldarray[1].name,
      VARCHAR_20: this.inputfieldarray[1] == undefined ? '' : this.inputfieldarray[1].value,
      VARCHAR_21: this.inputfieldarray[2] == undefined ? '' : this.inputfieldarray[2].name,
      VARCHAR_22: this.inputfieldarray[2] == undefined ? '' : this.inputfieldarray[2].value,
      VARCHAR_23: this.inputfieldarray[3] == undefined ? '' : this.inputfieldarray[3].name,
      VARCHAR_24: this.inputfieldarray[3] == undefined ? '' : this.inputfieldarray[3].value,
      VARCHAR_25: this.inputfieldarray[4] == undefined ? '' : this.inputfieldarray[4].name,
      VARCHAR_26: this.inputfieldarray[4] == undefined ? '' : this.inputfieldarray[4].value,

      Cat_Mst_Id: this.categoryMstID,
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      Method_Name: 'PayBillPayOnly',
      Actual_String: {}
    }
    paramObj.Actual_String = (JSON.stringify(paramObj));
    let PayBillPayOnlyData = paramObj;
    if (this.ChoosePaymentOption == 'Bank') {
      this.router.navigate(['/bbps/bbpsTransaction'], {
        queryParams: {
          'PayBillPayOnly': JSON.stringify(PayBillPayOnlyData), 'CBSBillPaymentData': JSON.stringify(this.OBJBillPay),
          'Category_ID': this.categoryMstID, 'bankArray': JSON.stringify(this.BankArray)
        }, skipLocationChange: true
      });
    }
    //  else if(this.ChoosePaymentOption=='P'){
    //   this.navCtrl.push(PAYMENT_GATEWAY, {'PayBillPayOnly': PayBillPayOnlyData, 'Category_ID':this.categoryname.CAT_MST_ID,
    //   'paymentMode':'Payment Gateway','frompage':'BBPS_BillPayment' });
    //  }
    //  else if(this.ChoosePaymentOption=='A'){
    //   this.navCtrl.push(AADHAR,{'PayBillPayOnly':this.PayBillPayOnlyData, 'Category_ID':this.categoryname.CAT_MST_ID,
    //   'paymentMode':'Aadhar Pay','frompage':'BBPS_BillPayment'});
    //   }
  }

  closeBill() {
    this.fetchbillResponse = null;
    this.providerNameClass = 'hide';
    this.providerName = null;
    this.fetchBillAmt = true;
    this.showForm = 'show';
    this.fetchbill = true;
    this.showTpin = false;
    this.inputfieldarray = null;
    this.Amount = null;
    this.router.navigate['/bbps'];
    // $('#custparams').css('display','none');
  }

  ToDecimal() {
    if (this.Amount != undefined)
      //     if(this.validateDecimal(this.amount))
      this.Amount = parseFloat(this.Amount).toFixed(2);
  }

  pageBack() {
    this.router.navigate(['/bbps']);
  }

  paymentCallback(obj) {
    if (obj === 'close1') {
      this.showOverlay = 'hide';
      this.showPaymentOption = false;
      this.closeBill();
      this.payOption.paymentMode = '';
    } else if (obj === 'close') {
      this.showOverlay = 'hide';
      this.showPaymentOption = false;
      this.closeBill();
      this.payOption.paymentMode = '';
      // if (confirm('Do You Want to Print Bill ?')) {
      // } else {

      // }
    }
    else {
      this.saveTran();
      // this.saveBbpsBillOnly(obj);
      // this.resetPurchaseItemIconValue();
    }
  }

  saveTran() {
    return new Promise(resolve => {
      let paymentMode = '';
      let tranMode = '';
      let tranStatus = '';
      let pageObj = this;
      if (pageObj.payOption) {
        paymentMode = pageObj.payOption.paymentMode ? pageObj.payOption.paymentMode : '';
        tranMode = pageObj.payOption.paymentMode === 'CASH' ? 'C' : 'O';
        if (pageObj.payOption.paymentMode == 'Aadhar') {
          pageObj.payOption.aadharTran(pageObj.PayBillData);
          // this.payOption.aadharTran(pageObj.updateProdTranMaster);
        } else if (pageObj.payOption.paymentMode == 'UPI') {
          pageObj.payOption.payUpiPayment(pageObj.PayBillData);
          // this.payOption.payUpiPayment(pageObj.updateProdTranMaster);
        }
        else if (this.payOption.paymentMode == 'PAYMENTGATEWAY') {
          this.payOption.payByPaymentGateway();
        }
        else if (this.payOption.paymentMode == 'QRCODE') {
          this.payOption.qrCodePay();
        }
        // }
        return true;
      }
    });
  }



//Validate Payment Amount
ValidatePayAmount(){
  this.spinner.show();
  var paramObj = {
    // Client_Mst_ID: this.model.client_mst_id,
    //KEYWORD: 'GenerateTxnReferenceId',
   
    VARCHAR_1: (this.Amount),                                 //(Amount)
    VARCHAR_2:  this.baseBillAmount==undefined ? this.Amount: (this.baseBillAmount +'|BASE_BILL_AMOUNT') ,     //(amount|amountOption)
    VARCHAR_3:0     ,                                          /// (basebillAmount)
    VARCHAR_4:this.BillerData.id,             // (billerId)
    VARCHAR_5:this.quickpay == 'NO' ?false:true ,                                     //( isQuickPay)
    VARCHAR_6:'Internet Banking'  ,      //(paymentMethod)
    Method_Name:'ValidatePaymentAmount',
    Sub_Ag_Mst_Id:this.SUB_AG_MST_ID,
    Bank_Reg_Mst_Id:this.BANK_REG_MST_ID,
    Client_Mst_Id: this.clientMstId,
    Cat_Mst_Id: this.categoryMstID,
    Actual_String:this.SUB_AG_MST_ID +'~'+this.clientMstId+'~'+this.BANK_REG_MST_ID+'~'+'ValidatePaymentAmount'

  }
  this.apiService.sendToServer<IBbps>('/api/virtualpay/GetBBPSRequest', paramObj, this).subscribe((data) => {
    this.spinner.hide();
    if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.isValid == true) {
          this.validateTranotp();
        }
        else {
          if (data.errorMessages.length > 0) {
            let errorsMsg = data.errorMessages;
            if (errorsMsg != null) {
              this.errorDisplay=errorsMsg[0].errorDtl;
              this.message = errorsMsg[0].errorDtl;
              MessageBox.show(this.dialog,this.message ,"");
              return false;
            }
          }
        }
      }
    else {
      this.message = data.msg;
      MessageBox.show(this.dialog, this.message, "");
    }

  }, err => {
    //this.navCtrl.push(InternetConnectionPage,{'ErrorMsg':err})
    this.spinner.hide();
    this.errorHandler.handlePageError(err);
    this.errorDisplay=err;
    if(this.OBJBillPay !=null){
      this.Send_Reversal_Request();
    }
  });
}





  //Send Reversal Request
  Send_Reversal_Request() {
    this.spinner.show();
    var paramObj = {
      Cat_Mst_Id: this.categoryMstID,
      Client_Mst_Id: this.clientMstId,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Account_No: this.Account_Number,
      Tran_Mode: 'BBPS',
      Tran_Amount: this.Amount,
      Bene_Account: '',
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      Declined_Remark: '',
      CBS_TranID: this.CBS_TranID,
      Response_Code: '01',
      Response_Message: this.errorDisplay,
      RRN_Number: this.RRN_Number,
      login_user_id: this.login_user_id,
      Insti_Sub_Mst_Id: '',
      CORPORATE_FLAG: this.Corporate_Flag,
      Corporate_Flag: this.Corporate_Flag,
      Secret_Key: this.secretKey,
      url: this.url,

    }
    this.apiService.sendToServer<IBbps>('/api/virtualPay/TranRevRequest', paramObj, this).subscribe((data) => {
      this.spinner.hide()
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].RESPONSE_CODE == '00')
          this.bbpsreversmsg = 'Any Amount Deducted From Your Account Will be Reversed in 2/3 Days.';
        this.message = this.bbpsreversmsg;
        MessageBox.show(this.dialog,this.message,'');
      }
      else {
        this.bbpsreversmsg = data.msg;
        this.message = data.msg;
        MessageBox.show(this.dialog,this.message,'');
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });

  }
}


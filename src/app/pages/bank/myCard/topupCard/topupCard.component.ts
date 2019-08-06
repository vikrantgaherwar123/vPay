import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../../../core/api.service';
import { ILogin } from '../../../../interface/login';
import { DataStorage } from '../../../../core/dataStorage';
import { Spinner } from '../../../../services/spinner';
import { ICore } from '../../../../interface/core';
import { ErrorHandler } from '../../../../core/errorHandler';
import { Common } from '../../../../services/common';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { MessageBox } from "../../../../services/_shared/message-box";
import { Otp } from "../../../../shared/component/otp/otp.component";
import { IBank } from '../../../../interface/bank';
import { ConfirmDialogComponent } from '../../../../shared/component/confirm-dialog/confirm-dialog.component';
declare const $: any;

@Component({
  selector: 'app-topUpCard',
  templateUrl: './topUpCard.component.html',
  styleUrls: [
    './../../bank.component.scss'
  ],
  providers: [DecimalPipe],
})
export class TopUpCardComponent implements OnInit {
  @ViewChild(Otp) otpCntrl: Otp;
  logInfo: ILogin;
  clientMstId: number;
  login_user_id: string;
  userName: string = "";
  lastLogin: string = "";
  BUSINESS_DETAILS: string = "";
  Corporate_Flag: any;
  sessionId: any;
  Insti_Sub_Mst_Id: any;
  secretKey: any;
  url: any;
  InetCorpoID: any;
  InetUserID: any;
  InetCorpFlag: any;
  CUSTNAME: any;
  termCondContent: string;
  tpin: string = "";
  //mobile Banking Variable
  banklogo: any = null;
  listarray = [];
  bankname: any;
  setBankLogo: any;
  selectedBank: any;
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;
  otpTitle: string;
  //topup card
  acc: any;
  cardNO: any;
  bankReferenceNumber: any;
  customerRefNo: any;
  remarks: any;
  payData: any;
  RespData: any;
  rrnNumber: any;
  instraPayObj: any;
  amount: any;
  glCode: string = "";
  AccountBalance: any;
  AccountName: any;
  statusMsg: string = "";
  padbot: string = "";
  showTOPUP: boolean = false;
  accountlistArray = [];
  debitNarration: any;

  //dialog box Variable
  message;

  constructor(private dataStorage: DataStorage, private router: Router, private route: ActivatedRoute, private apiService: ApiService,
    private spinner: Spinner, private errorHandler: ErrorHandler, private common: Common, public dialog: MatDialog) {
  }

  ngOnInit() {
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
    }
    else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");
    }

    this.Get_AccountList();

    //demo data please delete 
    // this.acc = "010405000002";
    // this.AccountBalance = "50000";

    // this.BRANCH_NAME = ""
    //
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

  pageBack() {
    this.router.navigate(['/bank'], { queryParams: { 'bank': false } });
  }

  //Atm Card close
  //Top Up CARD

  // Account List
  Get_AccountList() {
    this.spinner.show();
    var paramObj = {
      request_from: 'WB',
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Customer_ID: this.Cbs_CustomerID,
      CORPORATE_FLAG: this.Corporate_Flag,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Secret_Key: this.secretKey,
      url: this.url,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Device_Id: 'Desktop',
      Session_Id: this.sessionId,
      Source: 'Desktop',
    };
  
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_Pay_Direct_Ac', paramObj, this).subscribe((data) => {
      
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].ERROR) {
          this.message = data.cursor1[0].ERROR;
          MessageBox.show(this.dialog, this.message, "");
        } else {
          // console.log('Get_Pay_Direct_Ac' + data.cursor1);
          // if (FundKey == 'FRAC') {
          //   this.fromAccfundTranArray = data.cursor1;
          //   this.showFundTransfer = true;
          // }
          // else
          this.accountlistArray = data.cursor1;
          this.padbot = 'pb-5';
        }
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }


  selectedAccDetails(accObj) {
    this.AccountName = accObj.ACCOUNT_NAME;
    this.AccountBalance = accObj.AC_BALANCE;
    this.glCode = accObj.GL_NAME;
    this.cardNO = accObj.CARD_NUMBER;
  }


  // //method for save data
  submit(event) {

    if (this.acc == undefined || this.acc == null || this.acc == '') {
      // this.alertCtrl.showToastBottom('Please select Account Number.');
      this.message = 'Please select Account Number.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.amount == undefined || this.amount == 0) {
      this.message = 'Please Enter Amount.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    //debitNarration
    if (this.debitNarration == undefined || this.debitNarration == 0) {
      // this.alertCtrl.showToastBottom('Please Enter Debit Narration.');
      this.message = 'Please Enter Debit Narration.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    //TPIN
    if (this.tpin == undefined || this.tpin == '') {
      this.message = 'Enter Your TPIN .';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    //tpin Limit
    if (this.tpin.length != 4) {
      this.message = 'Enter Valid 4 Digit TPIN.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    // let res = confirm("Do You Want To Procced ?");
    // if (!res) {
    //   return;
    // }
    // this.spinner.show();
    this.confirmBox();

  }


  confirmBox() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: "",
      content: "Do You Want To Procced ?",
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true)
        this.instaPayment();
    });
  }

  instaPayment() {
    this.spinner.show();
    var paramObj = {
      login_user_id: this.login_user_id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Customer_ID: this.Cbs_CustomerID,
      url: this.url,
      RRN_Number: '',
      Client_Mst_Id: this.clientMstId,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Inet_User_Id: this.InetUserID,
      Bene_ID: '',
      Insti_Sub_Mst_Id: '',
      Corporate_Flag: this.Corporate_Flag,
      Request_From: 'WB',
      Session_Id: '',
      loginInfo: this.logInfo,
      Source: '',
      Device_Id: '',
      Request_Mode: '',
      Trancode: '',
      Accept_Reject: 'Y',
      Reject_Reason: '',
      CBS_OTP: '',
      Tran_Mode: 'All',
      New_Ac_Number: this.acc,
      Username: 'TESTIPAY',
      Password: 'TESTIPAY',
      customerID: 'TESTIPAY',
      customerReferenceNumber: Math.floor(Math.random() * 1000000),//this.refNumber,
      debitAccountNumber: '010405000001',
      creditAccountNumber: this.acc,
      dealerCode: 'TBENE1',
      beneficiaryCode: 'TBENE1',
      transactionAmount: this.amount,
      debitNarration: this.debitNarration,
      creditNarration: this.debitNarration,
      additionalDetails: ''

    };
    var ran = Math.random().toPrecision(9);
    this.apiService.sendToServer<IBank>('/api/topupcard/InstaPayment', paramObj, this).subscribe(data => {
      if (data.code == 1) {
        this.instraPayObj = data;
        this.bankReferenceNumber = data.bankReferenceNumber;
        this.PayLoad();
      }
      else {
        this.message = data.message;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }


  PayLoad() {
    this.spinner.show();
    var paramObj = {
      login_user_id: this.login_user_id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Customer_ID: this.Cbs_CustomerID,
      url: this.url,
      RRN_Number: '',
      Client_Mst_Id: this.clientMstId,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Inet_User_Id: this.InetUserID,
      Bene_ID: '',
      Insti_Sub_Mst_Id: '',
      loginInfo: this.logInfo,
      Corporate_Flag: this.Corporate_Flag,
      Request_From: 'WB',
      Session_Id: '',
      Source: '',
      Device_Id: '',
      Request_Mode: '',
      Trancode: '09',
      Accept_Reject: 'Y',
      Reject_Reason: '',
      CBS_OTP: '',
      Tran_Mode: 'All',
      New_Ac_Number: this.acc,
      DeliveryChnl: '17',
      LocalTranDate: '20171025',
      RRN: this.bankReferenceNumber,
      TranAmt: this.amount,
      CardNumber: '4336620020552982',
      IPAddress: '192.168.1.112',
      MerchantId: 'FLP0000001',
      MerchantPassword: 'admin12345',
      Remark: '',
      ReasonCode: '',
    };
    this.apiService.sendToServer<ICore>('/api/topupcard/Load_Card', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data.code == 1) {
        this.payData = data;
        this.rrnNumber = this.payData.RRN;
        this.RespData = this.payData.RespData;
        this.showTOPUP = true;
        if (this.showTOPUP == true) {
          $(document).ready(function () {
            $("#TopupDialog").modal('show');
          });
        }

      }
      else {
        this.message = data.message;
        MessageBox.show(this.dialog, this.message, "");
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });


  }
  ConverToDecimal() {
    // this.TransferLimit = parseFloat(this.TransferLimit).toFixed(2);
    if (parseFloat(this.amount))
      this.amount = parseFloat(this.amount).toFixed(2);
  }
  clearPage() {
    this.acc = '';
    this.AccountName = '';
    this.glCode = '';
    this.AccountBalance = '';
    this.cardNO = '';
    this.amount = '';
    this.remarks = '';
    this.debitNarration = '';
    this.tpin = '';
    this.AccountName = null;
  }
}



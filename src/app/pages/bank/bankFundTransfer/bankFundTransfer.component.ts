import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../../core/api.service';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { Spinner } from '../../../services/spinner';
import { ErrorHandler } from '../../../core/errorHandler';
import { ICore } from '../../../interface/core';
import { Common } from '../../../services/common';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { MessageBox } from "../../../services/_shared/message-box";
import { Otp } from "../../../shared/component/otp/otp.component";
import { IOtp } from '../../../interface/otp';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { FormControl } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/component/confirm-dialog/confirm-dialog.component';
declare const $: any;




@Component({
  selector: 'app-bankFundTransfer',
  templateUrl: './bankFundTransfer.component.html',
  styleUrls: [
    './../bank.component.scss'
  ],
  providers: [DecimalPipe],
})
export class FundTransferComponent implements OnInit {

  // filteredStates: Observable<any[]>;
  // filteredStatesTo: Observable<any[]>;
  // filteredStatesBene: Observable<any[]>;
  // fromAccfundTranArray: AccState[] = [];
  // toAccfundTranArray: AccState[] = [];
  // BeneAccountList: BeneState[] = [];

  // FromAccountNumber1: FormControl;
  // ToAccountNumber1: FormControl;
  // ToBeneAccountNumber1: FormControl;




  @ViewChild(Otp) otpCntrl: Otp;
  logInfo: ILogin;
  clientMstId: number;
  login_user_id: string;
  userName: string = "";
  lastLogin: string = "";
  BUSINESS_DETAILS: string = "";
  Corporate_Flag: any;
  sessionId: any;
  secretKey: any;
  url: any;
  InetCorpoID: any;
  InetUserID: any;
  InetCorpFlag: any;
  CUSTNAME: any;
  termCondContent: string;
  //mobile Banking Variable
  banklogo: any = null;
  listarray = [];
  bankname: any;
  setBankLogo: any = null;
  selectedBank: any;
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;
  RRN_No: any;
  CBS_TranID: any;

  Insti_Sub_Mst_Id: any;
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;
 


  //fund transfer Variable
  FromAccountNumber: any;
  FromAccountName: string = '';
  colLength: string = 'col-md-12';
  colLength1: string = 'col-md-12';
  FromAccountBal: any;
  FromBRANCH_NAME: any;
  ToAccountNumber: any;
  ToAccountName: string = '';
  ToBranchName: string = '';
  ToAccountIFSC: any;
  ToBank_Name: any;
  BENE_MST_ID: any;
  BeneToAccountNumber: any;
  BeneToAccountName: any;
  BeneToAccountIFSC: any;
  BeneToBank_Name: any;
  amount: any;
  tpin: any;
  remark: any;
  ShowAccList: any = false;
  ShowBeneList: any = false;
  showfundModepage: any = false;
  fundModeTitle: string = '';
  padBottom: string = '';
  BeneAccountList: Array<any>;
  fromAccfundTranArray: Array<any>;
  TranLimitResp: Array<any>;
  toAccfundTranArray: Array<any>;
  showVpayOtp: string = "hide";
  btnNeftSubmit: boolean = false;
  btnRtgsSubmit: boolean = false;
  btnOwnSubmit: boolean = false;
  btnOtherSubmit: boolean = false;
  btnBack: boolean = true;
  fundPFlag: any;
  fundPTitle: any;
  chargeFlag: any;
  statusMsg: string = "";
  showTOPUP: boolean = false;


  //dialog box Variable

  message;


  constructor(private dataStorage: DataStorage, private router: Router, private route: ActivatedRoute, private apiService: ApiService,
    private spinner: Spinner, private common: Common, private dialog: MatDialog, private dp: DecimalPipe, private errorHandler: ErrorHandler, ) {
  }

  ngOnInit() {
    this.spinner.show();
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
      // this.spinner.hide();
    } else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");
    }
    this.spinner.show();
    this.fundPFlag = this.route.queryParams["_value"].pageFlag;
    this.fundPTitle = this.route.queryParams["_value"].pageTitle;

    if (this.fundPTitle) {
      this.fundTransferMethod(this.fundPFlag, this.fundPTitle);
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
  Get_AccountList(FundKey) {
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
      AcKeyword: FundKey,
      Device_Id: 'Desktop',
      Session_Id: this.sessionId,
      Source: 'Desktop',
    };
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_Account', paramObj, this).subscribe((data) => {
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        
        if (data.cursor1[0].ERROR) {
          this.message = data.cursor1[0].ERROR;
          MessageBox.show(this.dialog, this.message, "");
        } else {
          if (FundKey == 'FRAC') {
            this.fromAccfundTranArray = data.cursor1;
          }
          else {
            this.toAccfundTranArray = data.cursor1;
          }

        }
      } else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  //BeneFiciary List 
  Get_BeneficieryList(PFlag) {
    this.spinner.show();
    var uinput = {
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      Secret_Key: this.secretKey,
      Customer_ID: this.Cbs_CustomerID,
      Tran_Mode: 'ALL',
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Bene_Type_Flag: PFlag,
      Bene_Confirm_Flag: 'A',
      url: this.url,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
    }
    this.apiService.sendToServer<ICore>('/api/virtualPay/Bene_List', uinput, this).subscribe(data => {
      this.spinner.hide();
      if (data.code === 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.BeneAccountList = data.cursor1;
      
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      });
  }

  //Fund Transfer start

  fundTransferMethod(PFlag, title) {
    this.spinner.show();
    this.showfundModepage = true;
    if (title == 'Neft') {
      this.chargeFlag = 'N';
      this.btnNeftSubmit = true;
      this.btnRtgsSubmit = this.btnOwnSubmit = this.btnOtherSubmit = false;
    }
    else if (title == 'Rtgs') {
      this.chargeFlag = 'R';
      this.btnRtgsSubmit = true;
      this.btnNeftSubmit = this.btnOwnSubmit = this.btnOtherSubmit = false;
    }
    else if (title == 'Own') {
      this.chargeFlag = 'O';
      this.btnOwnSubmit = true;
      this.btnRtgsSubmit = this.btnNeftSubmit = this.btnOtherSubmit = false;
    }
    else if (title == 'Other') {
      this.chargeFlag = 'T';
      this.btnOtherSubmit = true;
      this.btnRtgsSubmit = this.btnOwnSubmit = this.btnNeftSubmit = false;
    }
   
    this.Get_AccountList("FRAC");

    if (title == 'Own') {
      this.Get_AccountList("TOAC");
      this.ShowBeneList = false;
      this.ShowAccList = true;
    } else {
      this.Get_BeneficieryList(PFlag);
      this.ShowBeneList = true;
      this.ShowAccList = false;
    }

    this.fundModeTitle = title;
    // this.btnBack = false;
  }

  

  FromAccountchange(obj) {
    if (obj.ACCOUNT_NUMBER == this.ToAccountNumber) {
      this.message = "Select Other Account Number.";
      MessageBox.show(this.dialog, this.message, "");
      this.FromAccountNumber = null;
      this.FromAccountName = null;
      this.FromAccountBal = '';
      this.FromBRANCH_NAME = '';
      // this.FromAccountNumber1.setValue('');
      return false;
    }
    this.FromAccountNumber = obj.ACCOUNT_NUMBER;
    this.FromAccountName = obj.ACCOUNT_NAME;
    this.FromAccountBal = parseFloat(obj.AC_BALANCE).toFixed(2);
    this.FromBRANCH_NAME = obj.BRANCH_NAME;


  }

  ToAccountchangeOWN(obj) {
    if (obj.ACCOUNT_NUMBER == this.FromAccountNumber) {
      this.message = "Select Other Account Number.";
      MessageBox.show(this.dialog, this.message, "");
      this.ToAccountNumber = null;
      this.ToAccountName = null;
      this.FromAccountBal = '';
      this.ToAccountIFSC = '';
      this.ToBranchName = '';
      return false;
    } else {
      this.ToAccountNumber = obj.ACCOUNT_NUMBER;
      this.ToAccountName = obj.ACCOUNT_NAME;
      this.FromAccountBal = parseFloat(obj.AC_BALANCE).toFixed(2);
      this.ToAccountIFSC = obj.IFSC_CODE;
      this.ToBranchName = obj.BRANCH_NAME;
    }
  }
  ToAccountchange(obj) {
    this.BeneToAccountNumber = obj.BENE_ACCOUNT_NUMBER;
    this.BeneToAccountName = obj.BENE_NAME;
    this.BeneToAccountIFSC = obj.IFSC_CODE;
    this.BENE_MST_ID = obj.BENE_MST_ID;
    this.BeneToBank_Name = obj.BANK_NAME;


  }

  //fundTranfer Submit
  fundTranferSubmit(tranMode) {
    if (this.FromAccountNumber == undefined || this.FromAccountNumber == null || this.FromAccountNumber.toString().trim() == "") {
      this.message = "Select From Account Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.ShowBeneList == true) {
      if (this.BeneToAccountNumber == undefined || this.BeneToAccountNumber == null || this.BeneToAccountNumber.toString().trim() == "") {
        this.message = "Select To Account Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    }
    if (this.ShowAccList == true) {
      if (this.ToAccountNumber == undefined || this.ToAccountNumber == null) {
        this.message = "Select To Account Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.ToAccountNumber == this.FromAccountNumber) {
        this.message = "To Account Number should not be same.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    }

    if (this.amount == undefined || this.amount == null || this.amount.toString().trim() == "") {
      this.message = "Enter Amount.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.amount === 'undefined' || this.amount > 50000) {
      this.message = "Please enter Transfer Limit less than 50,000.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.tpin == undefined || this.tpin.toString().trim() == "") {
      this.message = "Enter TPIN .";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.tpin.trim().length != 4) {
      this.message = "Enter a valid 4 digit TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    var paramObj = {
      login_user_id: this.login_user_id,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Customer_ID: this.Cbs_CustomerID,
      Tran_Mode: tranMode,
      Account_No: this.FromAccountNumber,
      Bene_Account: this.BeneToAccountNumber == null ? this.ToAccountNumber : this.BeneToAccountNumber,
      Tran_Amount: this.amount,
      Tran_Remark: this.remark,
      url: this.url,
      RRN_Number: '',
      Inet_Corp_Id: this.InetCorpoID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Inet_User_Id: this.InetUserID,
      Bene_ID: this.BENE_MST_ID,
      // Insti_Sub_Mst_Id: '',
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Request_From: '',
      TPIN: this.tpin,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
    };
    // (this.loginInfo.INSTI_SUB_MST_ID == null ? '' :this.loginInfo.INSTI_SUB_MST_ID)
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualpay/GetTranOTPRequest', paramObj, this).subscribe(data => {

      this.spinner.hide();
      this.otpConfirmation(data);
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        //response code ==00
        if (data.cursor1[0].RESPONSE_CODE == '00') {
          this.RRN_No = data.cursor1[0].RRN_NUMBER,
      
            this.showfundModepage = false;
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.tpin = "";
      this.errorHandler.handlePageError(err);
    });
  }


  otpConfirmation(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: "OTP Verification Required !",
      content: "Do you want to transfer fund ?",
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
        this.showfundModepage = true;
        this.showVpayOtp = "hide";
        this.pageBack();
      }
    });
  }



  //fund transfer Otp Process
  fundOtpProcess() {
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
              this.otpCntrl.otp = '';
              if (this.fundModeTitle == "Neft") {
                this.message = 'Your NEFT Transaction ';
              }
              if (this.fundModeTitle == "Rtgs") {
                this.message = 'Your RTGS Transaction';
              }
              if (this.fundModeTitle == "Own") {
                this.message = 'Your OWN Account  Transaction';
              }
              if (this.fundModeTitle == "Other") {
                this.message = 'Your Other Account  Transaction';
              }

              // MessageBox.show(this.dialog, this.message, "");
              this.statusMsg = this.message + ' ' + data.cursor1[0].RESPONSE_MESSAGE;
              this.showTOPUP = true;
              if (this.showTOPUP == true) {
                $(document).ready(function () {
                  $("#TopupDialog").modal('show');
                });
              }
              this.showVpayOtp = "hide";
              this.otpCntrl.hideOtp();
              // this.router.navigate(['/bank']);
            }
          }
          else if (data.code === 0) {
            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
          }
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    this.otpCntrl.otp = '';
  }

  resetFrom() {
    this.FromAccountNumber = null;
    this.FromAccountName = null;
    this.FromAccountBal = '';
    this.FromBRANCH_NAME = null;
  }
  resetTo() {
    this.ToAccountNumber = null;
    this.ToBank_Name = null;
    this.ToAccountName = null;
    this.ToAccountIFSC = '';
  }

  resetBeneTo() {
    this.BeneToAccountNumber = null;
    this.BeneToAccountName = null;
    this.BeneToAccountIFSC = null;
    this.BeneToBank_Name = null;
    this.BENE_MST_ID = '';
  }

  Back() {
    this.showVpayOtp = 'hide';
    this.clearPage();
    this.pageBack();

    this.showfundModepage = false;
    this.btnBack = true;
  }

  pageBack() {
    this.clearPage();
    this.router.navigate(['/bank'], { queryParams: { 'bank': false } });
  }

  saveCode(e): void {
    let AcNo = '';
    AcNo = e.target.value;
    let list;
    list = null;
    if (e.target.id == 'txtFromAccountNumber') {
      list = this.fromAccfundTranArray.filter(x => x.ACCOUNT_NUMBER === AcNo)[0];
      this.FromAccountchange(list);
    }
    if (e.target.id == 'txtToAccountNumber') {
      list = this.toAccfundTranArray.filter(x => x.ACCOUNT_NUMBER === AcNo)[0];
      this.ToAccountchangeOWN(list);
    }
    if (e.target.id == 'txtToBeneAccountNumber') {
      list = this.BeneAccountList.filter(x => x.BENE_ACCOUNT_NUMBER === AcNo)[0];
      this.ToAccountchange(list);
    }
    
  }

  clearPage() {
    this.otpCntrl.otp = null;
    this.RRN_No = '';
    this.FromAccountNumber = null;
    this.colLength = "col-md-12";
    this.colLength1 = "col-md-12";
    this.FromAccountName = null;
    this.FromAccountBal = '';
    this.FromBRANCH_NAME = null;
    this.ToAccountNumber = null;
    this.ToBank_Name = null;
    this.ToAccountName = null;
    this.BeneToAccountNumber = null;
    this.BeneToAccountName = null;
    this.BeneToAccountIFSC = null;
    this.BeneToBank_Name = null;
    this.ToAccountIFSC = '';
    this.padBottom = '';
    this.tpin = '';
    this.BENE_MST_ID = '';
    this.amount = '';
    this.remark = '';
    this.TranLimitResp = null;
  }

  ConverToDecimal() {
    if (parseFloat(this.amount))
      this.amount = parseFloat(this.amount).toFixed(2);
    this.checkTranLimit(this.chargeFlag);
  }
  

  checkLengthOfFrmAccNo(event) {
    if (event.keyCode === 8 || event.keyCode === 46) {
      this.FromAccountName = null;
      this.FromAccountBal = '';
      this.FromBRANCH_NAME = null;
    }
  }
  checkLengthOfToBeneAccNo(event) {
    if (event.keyCode === 8 || event.keyCode === 46) {
      this.BeneToAccountName = null;
      this.BeneToAccountIFSC = null;
      this.BeneToBank_Name = null;
    }
  }
  checkLengthOfToAccNo(event) {
    if (event.keyCode === 8 || event.keyCode === 46) {
      // this.ToBank_Name = null;
      this.ToAccountName = null;
      this.ToAccountIFSC = '';
      this.ToBranchName = '';
    }
  }
  //Get_Tran_Limit
  checkTranLimit(cFlag) {
    let paramObj = {
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Tran_Flag: cFlag,
      url: this.url

    }
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_Tran_Limit', paramObj, this).subscribe((data) => {

      if (data.code == 1 && data.msg.toUpperCase() == "SUCCESS") {
 
        this.TranLimitResp = data.cursor1[0];
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
  //Fund Transfer Closed

}



export class AccState {

  constructor(
    // public name: string,
    public ACCOUNT_NAME: string,
    public ACCOUNT_NUMBER: any,
    public ACCOUNT_TYPE: string,
    public ACTYPE_NAME: string,
    public AC_BALANCE: any,
    public AC_CUST_ID: string,
    public BRANCH_NAME: string,
    public CORPORATE_FLAG: string,
    public CUSTOMER_ID: string,
    public CUSTOMER_NAME: string,
    public DEBIT_CARD_FLAG: string,
    public GL_NAME: string,
    public IFSC_CODE: string,
    public SR_NO: any
  ) { }
}
export class BeneState {

  constructor(
    // public name: string,
    public BANK_BRANCH_NAME: string,
    public BANK_NAME: string,
    public BENERELATION_NAME: string,
    public BENE_ACCNO_NICKNAME: string,
    public BENE_ACCOUNT_NUMBER: any,
    public BENE_ADDRESS: string,
    public BENE_CONFIRM_FLAG: string,
    public BENE_EMAILID: string,
    public BENE_MOBNO: string,
    public BENE_MST_ID: any,
    public BENE_NAME: string,
    public BENE_NICKNAME: string,
    public BENE_PINCODE: string,
    public BENE_RELATION: string,
    public BENE_TYPE_FLAG: string,
    public BRANCH_LOCATION: string,
    public IFSC_CODE: string,
    public MAX_TRAN_LIMIT: any
  ) { }
}
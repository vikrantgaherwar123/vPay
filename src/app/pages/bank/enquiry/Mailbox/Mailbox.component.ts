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
import { IOtp } from '../../../../interface/otp';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { FormControl } from '@angular/forms';

import { ConfirmDialogComponent } from '../../../../shared/component/confirm-dialog/confirm-dialog.component';
declare const $: any;


@Component({
  selector: 'app-mailbox',
  templateUrl: './Mailbox.component.html',
  styleUrls: ['./Mailbox.component.scss'],
  providers: [DecimalPipe],
})
export class MailboxComponent implements OnInit {
  purpose: string = "";
  description: string = "";
  loanReqAmount: string = "";
  period: string = "";
  customerType: string = "";

  btnBack: boolean = true;

  accImpsTranArray: Array<any>;
  BeneAccountList: Array<any>;

  @ViewChild(Otp) otpCntrl: Otp;
  p2ppage: boolean = false;
  p2apage: boolean = true;

  tab: any = 'tab1';
  tab1: any;
  tab2: any;
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
  showBankList = 'hide';
  showOverlay = 'hide';
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



  TranLimitResp: Array<any>;
  showVpayOtp: string = "hide";
  DivshowImps: boolean = false;
  showImpsTrans: boolean = false;
  showImpsTranfer: boolean = true;
  showImpsP2ATrans: boolean = true;
  showImpsMMID: boolean = false;
  ImpsModeTitle: string = '';
  impsTranTitle: string = 'IMPS Transaction P2A Transfer';
  FromAccountNumber: any;
  FromAccountName: string = null;
  FromAccountBal: any;
  FromBRANCH_NAME: any;
  ToBank_Name: any;
  ToAccountNumber: any;

  ToAccountName: null;
  ToAccountIFSC: any;
  BENE_MST_ID: any;
  amount: any;
  tpin: any;
  padBottom: any;
  remark: any;
  statusMsg: string = "";
  showTOPUP: boolean = false;

  //dialog box Variable
  message;

  constructor(private dataStorage: DataStorage, private router: Router, private route: ActivatedRoute, private apiService: ApiService,
    private spinner: Spinner, private common: Common, private errorHandler: ErrorHandler, public dialog: MatDialog, private dp: DecimalPipe) {

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
      this.CUSTNAME = this.logInfo[0].SelectedBankData[0].CUSTNAME;

      this.InetUserID = this.logInfo[0].SelectedBankData[0].INET_USER_ID;
      this.InetCorpFlag = this.logInfo[0].SelectedBankData[0].INET_CORPORATE_FLAG;


      // this.ImpsTranP2AMethod();
    } else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");

    }
this.spinner.hide();
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
        this.p2ppage = false;
        this.p2apage = false;
        // this.showApproval = false
        this.showVpayOtp = "show";
        this.otpCntrl.placeholder = 'Enter OTP';
        data.po_OTPExpDur = data.cursor1[0].OTP_EXPDURATION;
        this.otpCntrl.showOtp(data, this);
      }
      if (result == false) {
        this.showImpsP2ATrans = true;
        this.clearPage();
        // this.ngOnInit();
      }
    });
  }
  Back() {
    this.clearPage();
    this.btnBack = true;
  }


  pageBack() {
    // this.clearPage();
    this.router.navigate(['/bank'], { queryParams: { 'bank': false } });
  }
  clearPage() {
    this.p2ppage = false;
    this.otpCntrl.otp = null;
    this.RRN_No = '';
    this.padBottom = ''
    this.FromAccountNumber = null;
    this.FromAccountName = null;
    this.FromAccountBal = '';
    this.FromBRANCH_NAME = null;
    this.ToAccountNumber = null;
    // this.FromAccountNumber1.setValue('');
    // this.ToAccountNumber1.setValue('');

    this.ToAccountName = null;
    this.ToBank_Name = null;
    this.ToAccountIFSC = '';
    this.TranLimitResp = null;
    this.BENE_MST_ID = '';
    this.tpin = '';
    this.amount = '';
    this.remark = '';

  }


  ConverToDecimal() {
    if (parseFloat(this.amount))
      this.amount = parseFloat(this.amount).toFixed(2);
    this.checkTranLimit();
  }

  checkTranLimit() {
    this.spinner.show();
    let paramObj = {
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Tran_Flag: 'I',
      url: this.url

    }
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_Tran_Limit', paramObj, this).subscribe((data) => {
      this.spinner.hide();
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

}



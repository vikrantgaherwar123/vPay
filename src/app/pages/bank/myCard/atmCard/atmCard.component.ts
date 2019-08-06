import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { ConfirmDialogComponent } from '../../../../shared/component/confirm-dialog/confirm-dialog.component';
declare const $: any;

@Component({
  selector: 'app-atmCard',
  templateUrl: './atmCard.component.html',
  styleUrls: [
    './../../bank.component.scss'
  ]
})
export class ATMCardComponent implements OnInit {
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

  //ATM card variable
  showATMCard: string = "hide";
  showCard: string = 'hide';
  New_Ac_Number: any;
  Account_Name: any;
  Account_Type: any;
  OnOff: boolean = false;
  showCardMenu: boolean = true;
  showTOPUPCard: boolean = false;
  block_flag: string;
  RRN_No: any;
  checkprivStatus: boolean;
  cardFColorclass: any;
  cardBColorclass: any;
  showVpayOtp: string = "hide";
  CBS_TranID: any;
  btnBack: boolean = true;
  showTpin: boolean = false;
  tpin: string = "";
  //mobile Banking Variable
  banklogo: any = null;
  req: any;
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;
  otpTitle: string;
  statusMsg: string = "";
  showTOPUP: boolean = false;
  //dialog box Variabl
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
      this.req = this.route.queryParams["_value"].Request;
      this.Mycardinfo();
    }

    else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");
    }

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

  //Atm Card
  Mycardinfo() {
    this.spinner.show();
    var obj = {
      Client_Mst_ID: this.clientMstId,
      login_user_id: this.login_user_id,
      Client_Mst_Id: this.clientMstId,
      Secret_Key: this.secretKey,
      Inet_Corp_Id: this.InetCorpoID,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Customer_ID: this.Cbs_CustomerID,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      url: this.url,
      Request_From: "WB",
      Device_Id: 'Desktop',
      Session_Id: this.sessionId,
      Source: 'Desktop',
    };
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_CardAcDetails', obj, this).subscribe(data => {
      this.spinner.show();

      this.showCard = "show";
      this.showATMCard = "show";
      this.New_Ac_Number = data.cursor1[0].ACCOUNT_NUMBER;
      this.Account_Name = data.cursor1[0].ACCOUNT_NAME;
      this.Account_Type = data.cursor1[0].ACCOUNT_TYPE;
      this.showAcflag(data.cursor1[0].DEBIT_CARD_FLAG);
      this.showTpin = false;
      this.spinner.hide();
    }
      ,
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      }
    );
  }

  CardProcess() {
    if (this.OnOff === false)
      this.block_flag = "B";
    else
      this.block_flag = "U";
    if (this.tpin == undefined || this.tpin.toString().trim() == "") {
      this.message = "Enter TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.tpin.trim().length !== 4) {
      this.message = "Enter a valid 4 digit TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    var paramObj = {
      Client_Mst_ID: this.clientMstId,
      Client_Mst_Id: this.clientMstId,
      login_user_id: this.login_user_id,
      Secret_Key: this.secretKey,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Block_Flag: this.block_flag,
      Account_No: this.New_Ac_Number,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      url: this.url,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Device_Id: 'Desktop',
      TPIN: this.tpin,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      RRN_Number: '',

    }
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualPay/CardOTPRequest', paramObj, this).subscribe((data) => {
      this.otpConfirmation(data);
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        //response code ==00
        if (data.cursor1[0].RESPONSE_CODE == '00') {
          this.RRN_No = data.cursor1[0].RRN_NUMBER,
            this.showCard = "hide";
          this.showATMCard = 'hide';
        }
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


  cardOtpProcess() {
    var paramObj = {
      Request_From: 'WB',
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      login_user_id: this.login_user_id,
      Client_Mst_Id: this.clientMstId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
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
      Accept_Reject: '',
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
              let msg;
              if (this.OnOff != true) {
                msg = "Card Block Successfully";
              } else {
                msg = "Card Unblock Successfully";
              }
              // if (this.OnOff != true) {
              //   this.message = "Card Block Successfully";
              //   MessageBox.show(this.dialog, this.message, "");
              // } else {
              //   this.message = "Card Unblock Successfully";
              //   MessageBox.show(this.dialog, this.message, "");
              // }

              this.statusMsg = msg;
              this.showTOPUP = true;
              if (this.showTOPUP == true) {
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
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    this.otpCntrl.otp = '';
  }



  otpConfirmation(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // if (this.showRejectReason == true) {
    dialogConfig.data = {
      id: 1,
      title: "OTP Verification Required !",
      content: "Do you want to process request ?",
    };
    // }
    // else{
    // dialogConfig.data = {
    //   id: 1,
    //   title: "OTP Verification Required !",
    //   content: "Do you want to approve request ?",
    // };
    // }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.otpTitle = "Process Request";
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

  showAcflag(chkflag) {
    if (chkflag === 'Y') {
      this.OnOff = true; //Active(Unblock)
      this.cardFColorclass = 'lightcolor lightblue';
      this.cardBColorclass = 'darkcolor lightbluedark'
      this.checkprivStatus = true;
    }
    else {
      this.OnOff = false;  //Inctive(block)
      this.checkprivStatus = false;
      this.showTpin = true;
      this.cardFColorclass = 'lightcolor grey';
      this.cardBColorclass = 'darkcolor greydark'
    }
  }

  updateItem(Item) {
    if (Item == true) {
      this.showTpin = true;
      this.tpin = this.tpin;
      this.cardFColorclass = 'lightcolor lightblue';
      this.cardBColorclass = 'darkcolor lightbluedark';
    }
    else {
      this.showTpin = true;
      this.tpin = this.tpin;
      this.cardFColorclass = 'lightcolor grey';
      this.cardBColorclass = 'darkcolor greydark';
    }
  }

  Back() {
    this.showVpayOtp = "hide";
    // this.Mycardinfo();
    this.btnBack = true;
    this.showTpin = false;
    this.tpin = '';
    this.otpCntrl.otp = '';
  }

  pageBack() {
    this.router.navigate(['/bank'], { queryParams: { 'bank': false } });
  }
  //Atm Card close

}



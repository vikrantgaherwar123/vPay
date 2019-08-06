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
import { IOtp } from '../../../interface/otp';
import { ConfirmDialogComponent } from '../../../shared/component/confirm-dialog/confirm-dialog.component';

declare const $: any;

@Component({
  selector: 'app-bank',
  templateUrl: './approval.component.html',
  styleUrls: [
    './../bank.component.scss'
  ],
  providers: [DecimalPipe],
})
export class ApprovalComponent implements OnInit {
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
  showBankList = 'hide';
  showOverlay = 'hide';
  listarray = [];
  bankname: any;
  setBankLogo: any = null;
  selectedBank: any;

  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;
  Insti_Sub_Mst_Id: any;
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;


  //Approval Variable
  showApproval: any = false;
  RRN_No: any;
  CBS_TranID: any;
  showVpayOtp: string = "hide";
  OthPageTitle: string;
  approveCode: any;
  showRejectReason: boolean = false;
  DivOtherPages: boolean = false;
  showApprovalList: boolean = false;
  showTpin: boolean = false;
  btnBack: boolean = true;
  apprRefMstID: any;
  apprReqMode: any;
  appTranCode: any;
  shortCode: any;
  tpin: any="";
  txtRejectResaon: string = '';
  ApprovalList: Array<any>;
  statusMsg: string = "";
  showTOPUP: boolean = false;

  OtpTitle:string='';
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
      this.showApproval = true;
      this.showRejectReason = false;
      this.showTpin = false;
      this.showApprovalList = true;
      this.Get_PendingApproval();
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

  //Approve  Page
  Get_PendingApproval() {
    var paramObj = {
      login_user_id: this.login_user_id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      Secret_Key: this.secretKey,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
      Customer_ID: this.Cbs_CustomerID,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Tran_Mode: 'ALL',
      url: this.url,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
    };
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_PendingApproval', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.ApprovalList = data.cursor1;
        // //response code ==00
        // if (data.cursor1[0].RESPONSE_CODE == '00') {
        // }
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

  // Approve Reject request
  approveRejectBene(obj, approveCode) {
    this.approveCode = approveCode;
    this.shortCode = obj.SHORT_CODE;
    this.apprRefMstID = obj.REF_MST_ID;
    this.apprReqMode = obj.REQMODE;
    this.appTranCode = obj.TRANCODE;
    this.DivOtherPages = true;
    if (approveCode == 'R') {
      this.showRejectReason = true;
      this.OthPageTitle = "Reject Reason";
      this.OtpTitle="Reject Request"
      
    } else {
      this.showTpin = true;
      this.OthPageTitle = "Transaction Password";
      this.OtpTitle="Approve Request"
    }
    this.btnBack = false;
    this.showApprovalList = false;
  }

  //Approve Reject 
  approveBenerejectReason() {
    if (this.showRejectReason == true) {
      // this.OtpTitle='Reject Request';

      if (this.txtRejectResaon == undefined || this.txtRejectResaon.toString().trim() == "") {
        this.message = "Enter Reject Reason.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    }
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
    this.spinner.show();
    var paramObj = {
      login_user_id: this.login_user_id,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Customer_ID: this.Cbs_CustomerID,
      Client_Mst_Id: this.clientMstId,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Inet_User_Id: this.InetUserID,
      Request_From: 'WB',
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,

      Short_Code: this.shortCode,
      Referance_ID: this.apprRefMstID,
      TPIN: this.tpin,
      url: this.url,
      CBS_OTP: '',
      Request_Mode: this.apprReqMode,
      Trancode: this.appTranCode,
      RRN_Number: '',
      Accept_Reject: this.approveCode,
    };

    this.apiService.sendToServer<IOtp>('/api/virtualpay/Pending_Auth_OTP', paramObj, this).subscribe(data => {
      this.spinner.hide();
      this.otpConfirmation(data);

      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        // if (this.showRejectReason == true)
        

        //response code ==00
        if (data.cursor1[0].RESPONSE_CODE == '00') {
          this.RRN_No = data.cursor1[0].RRN_NUMBER
          // this.showApproval = false;
          //   data.po_OTPExpDur = data.cursor1[0].OTP_EXPDURATION;
          // this.otpCntrl.placeholder = 'Enter Otp';
          // this.otpCntrl.showOtp(data, this);
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


  //Approval Otp Process
  approveOtpProcess() {
    var paramObj = {
      Request_From: 'WB',
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
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
      Accept_Reject: this.approveCode == undefined ? 'Y' : this.approveCode,
      Reject_Reason: this.txtRejectResaon,
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
              this.showVpayOtp = "hide";
              // this.message = 'CBS TranID:- ' + this.CBS_TranID + ' ' + data.cursor1[0].RESPONSE_MESSAGE;
              // MessageBox.show(this.dialog, this.message, "");
              this.otpCntrl.hideOtp();
              if (this.shortCode == 'BENE_M') {
                this.message = "Beneficiary modified Successfully";
              }
              else if (this.shortCode == 'CHQBK') {
                this.message = "New Cheque Book Request Send Successfully";
              }
              else if (this.shortCode == 'BENE_R') {
                this.message = "Beneficiary Rejected Successfully";
              }
              else if (this.shortCode == 'BENE_N') {
                this.message = "Beneficiary Added Successfully";
              }
              this.statusMsg = this.message + ' ' + data.cursor1[0].RESPONSE_MESSAGE;
              this.showTOPUP = true;
              if (this.showTOPUP == true) {
                $(document).ready(function () {
                  $("#TopupDialog").modal('show');
                });
              }
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
    if (this.showRejectReason == true) {
      dialogConfig.data = {
        id: 1,
        title: "OTP Verification Required !",
        content: "Do you want to reject request ?",
      };
    }
    else{
      dialogConfig.data = {
        id: 1,
        title: "OTP Verification Required !",
        content: "Do you want to approve request ?",
      };
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
 
      if (result == true) {
        this.showApproval = false;
        this.showVpayOtp = "show";
        data.po_OTPExpDur = data.cursor1[0].OTP_EXPDURATION;
      this.otpCntrl.placeholder = 'Enter Otp';
      this.otpCntrl.showOtp(data, this);

      }
      if (result == false) {
        this.Back();
      }
    });
  }


  clearPage() {
    this.txtRejectResaon = null;
    this.tpin="";
  }

  Back() {
    this.tpin="";
    this.clearPage();
    this.showVpayOtp = 'hide';
    this.showApproval = true;
    this.btnBack = true;
    this.showRejectReason = false;
    this.DivOtherPages = false;
    this.showTpin = false;
    this.showApprovalList = true;
  }

  pageBack() {
    this.clearPage();
    this.router.navigate(['/bank'], { queryParams: { 'bank': false } });
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


  //Approve Page close 

}



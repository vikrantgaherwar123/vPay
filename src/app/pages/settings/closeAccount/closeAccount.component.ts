import { Component, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { ICore } from '../../../interface/core';
import { ILogin } from '../../../interface/login';
import { ApiService } from '../../../core/api.service';
import { DataStorage } from '../../../core/dataStorage';
import { Spinner } from '../../../services/spinner';
import { IOtp } from '../../../interface/otp';
import { ErrorHandler } from '../../../core/errorHandler';
import { Toast } from '../../../services/toast';
import { Otp } from '../../../shared/component/otp/otp.component';
import { Common } from '../../../services/common';
import { MatDialog,MatDialogConfig } from "@angular/material";
import { ConfirmDialogComponent } from '../../../shared/component/confirm-dialog/confirm-dialog.component';
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'vgipl-closeAccount',
  templateUrl: './closeAccount.component.html',
  providers: [ApiService, Spinner,Common]
})
export class CloseAccountComponent implements OnInit, AfterViewInit {
  @ViewChildren(Otp) otpCntrl: QueryList<Otp>;
  logInfo: ILogin;
  otp: any;
  OTP_ExpDur: any;
  Po_Otp_Det_ID: any;
  INSTI_SUB_MST_ID: any;
  CLIENT_MST_ID: any;
  CORPORATE_FLAG: any = 'I';
  balance: string;
  OTP_Det_ID: string = '';
  msgType: string = '';
  // showOtpBtnF:boolean = true;
  showCloseBtn: boolean = false;
  // showGenOtpBtn: boolean = true;
  po_OTPExpDur: any;
  showGenOtpBtn: boolean = true;
  showOtp: string = 'hide cta OtpBtn';

  option = {
    position: 'top-center',
    showClose: true,
    timeout: 5000,
    theme: 'bootstrap',
    type: this.msgType,
    closeOther: false,
    msg: ''
  }
  otpElement: any;
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

  constructor(private apiService: ApiService, private dialog: MatDialog, private router: Router, private dataStorage: DataStorage,
    private errorHandler: ErrorHandler, private toast: Toast, private spinner: Spinner, private common: Common
  ) {
    // this.loginClass = "btn-login1";
  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    $('#vpayBanner').hide();
    //$('#txtMobileNo')[0].focus();
    this.balance = this.logInfo[0].BALANCE;
    this.getBalace();
  }

  ngAfterViewInit() {
    this.otpElement = this.otpCntrl.find(a => a.eid == 'otp');
    // this.secretKeyElement =  this.otpCntrl.find(a=>a.eid=='seceretKey');
  }
  pageHelp() {
    this.common.TermConditons({ Term_Cond_Type: "14", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }


  SendRequest() {
    if (parseFloat(this.logInfo[0].BALANCE) == 0) {
      var cnf = confirm('Do you want to close VPay Account ?');
      if (cnf) {
        //  this.getOtpForCloseAccount();
      }
    }
    else {
      // alert('You have Balance in  your account, Account Can not close');
      this.message = "You have Balance in  your account, Account Can not close.";
      MessageBox.show(this.dialog, this.message, "");
    }

  }

  getOtpForCloseAccount() {
    this.spinner.show();
    var paramObj = {
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: this.logInfo[0].LOGIN_USER_ID,
      flag: 'CL',
      request_from: 'WB',
      Client_Mst_Id: this.logInfo[0].CLIENT_MST_ID,
      Insti_Sub_Mst_Id: this.logInfo[0].INSTI_SUB_MST_ID,
      CORPORATE_FLAG: this.logInfo[0].CORPORATE_FLAG
    };
    let pageObj = this;
    this.apiService.sendToServer<IOtp>('/api/virtualPay/GetOTP', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data != null && data != undefined) {
        if (data.Po_Error != null) {
          this.message = data.Po_Error;
          MessageBox.show(this.dialog, this.message, "");
        }
        else {
          // pageObj.OTP_ExpDur = data.po_OTPExpDur;
          // pageObj.Po_Otp_Det_ID = data.Po_Otp_Det_ID;
          pageObj.OTP_Det_ID = data.Po_Otp_Det_ID;
          pageObj.po_OTPExpDur = data.po_OTPExpDur;

          // this.showCloseBtn = true;
          pageObj.showGenOtpBtn = false;

          pageObj.showOtp = 'show cta OtpBtn';
          pageObj.otpElement.placeholder = 'Enter OTP';;
          pageObj.otpElement.showOtp(data, pageObj);

          pageObj.Po_Otp_Det_ID = pageObj.OTP_Det_ID;
          // pageObj.OTP_Det_ID= data.Po_Otp_Det_ID;
          //var obj = this.OTP_Process();

        }
        
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });

    return false;
  }

  onClickCheckOTP() {
    var curotp = '';
    // for Otp control
    curotp = this.otpElement.otp;
    // curotp = this.otpCntrl.otp;
    if (!curotp || (curotp && curotp.trim().length != 6)) {
      // alert('Please Enter valid OTP.');
      this.message = "Please Enter valid OTP.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.spinner.show();
    let paramObj = {
      login_user_id: this.logInfo[0].LOGIN_USER_ID,
      OTP_Det_ID: this.Po_Otp_Det_ID,
      otp: curotp,
      Request_From: 'WB'
    }
    this.apiService.sendToServer<IOtp>('/auth/merchant/CheckOTP', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        this.showOtp = 'show cta OtpBtn';
        this.closeAccount();
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        // this.option.msg= data.msg;
        // this.toast.addToast(this.option);
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }


  regenerateOTP() {
    this.spinner.show();
    let paramObj = {
      Otp_Det_ID: this.Po_Otp_Det_ID
    }
    let pageObj = this;
    this.apiService.sendToServer<IOtp>('/auth/merchant/regenOTP', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data) {
        if (data.msg === 'Success') {

          // pageObj.OTP_Det_ID = data.Po_Otp_Det_ID;
          // pageObj.po_OTPExpDur = data.po_OTPExpDur;
          pageObj.OTP_Det_ID = data.Pio_Otp_Det_ID;
          pageObj.po_OTPExpDur = data.Po_Otpexpdur;

          pageObj.showOtp = 'show cta OtpBtn';
          pageObj.showGenOtpBtn = false;
          pageObj.otpElement.placeholder = 'Enter OTP';
          pageObj.otpElement.showOtp(data, pageObj);
          pageObj.Po_Otp_Det_ID = pageObj.OTP_Det_ID;
          // for Otp control
        }
        else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
          this.router.navigate(['/authentication/login']);
        }
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })


  }


  closeAccount() {

    var paramObj = {
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: this.logInfo[0].LOGIN_USER_ID,
      Client_Mst_Id: this.logInfo[0].CLIENT_MST_ID,
      Request_From: 'WB',
      Insti_Sub_Mst_Id: this.logInfo[0].INSTI_SUB_MST_ID,
      CORPORATE_FLAG: this.logInfo[0].CORPORATE_FLAG
    };
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualPay/ClientClose', paramObj, this).subscribe((data) => {
      if (data != null && data != undefined) {
        if (data.Po_Error != null) {
          this.message = data.Po_Error;
          MessageBox.show(this.dialog, this.message, "");
          this.spinner.hide();
        }
        else {
          // alert('Your Account is Closed,You are not authorize to use it again.');
          this.message = "Your Account is Closed,You are not authorize to use it again.";
          MessageBox.show(this.dialog, this.message, "");
          //logout
          this.spinner.hide();
          this.router.navigate(['/home']);
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });

    return false;
  }

  getBalace() {
    if (this.logInfo[0].CLIENT_MST_ID != "") {
      var paramObj = {
        client_mst_id: this.logInfo[0].CLIENT_MST_ID,
        device_id: 'Desktop',
        Device_Id: 'Desktop',
        login_user_id: this.logInfo[0].LOGIN_USER_ID,
        request_from: 'WB',
        Insti_Sub_Mst_Id: this.logInfo[0].INSTI_SUB_MST_ID,
        CORPORATE_FLAG: this.logInfo[0].CORPORATE_FLAG
      };
      this.spinner.show();
      this.apiService.sendToServer<ICore>('/api/virtualpay/GetBal', paramObj, this).subscribe((data) => {
        this.spinner.hide();
        if (data.code == 1) {
          if (data.result != null) {
            this.logInfo[0].BALANCE = parseFloat(data.result).toFixed(2);
            if (this.logInfo[0].BALANCE == undefined) {
              this.logInfo[0].BALANCE = 0;
            }
            else {
              this.logInfo[0].BALANCE = parseFloat(this.logInfo[0].BALANCE).toFixed(2);
            }
          }
          else {
            this.logInfo[0].BALANCE = 0;
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
  }


  otpConfirmation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: "OTP Verification Required !",
      content: "Do you want to close account ?",
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true)
      this.getOtpForCloseAccount();
    });
  }
}

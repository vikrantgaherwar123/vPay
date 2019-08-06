import { Component, OnInit, Renderer2,AfterViewInit, QueryList,Input,ViewChildren } from "@angular/core";
import { ApiService } from "../../../core/api.service";
import { ILogin } from "../../../interface/login";
import { ErrorHandler } from "../../../core/errorHandler";
import { DataStorage } from "../../../core/dataStorage";
import { IOtp } from '../../../interface/otp';
import { Toast } from "../../../services/toast";
import { Common } from "../../../services/common";
import { Router } from '@angular/router';
import { Spinner } from "../../../services/spinner";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ConfirmDialogComponent } from '../../../shared/component/confirm-dialog/confirm-dialog.component';
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
import { MatBottomSheet } from '@angular/material';
import { Otp } from '../../../shared/component/otp/otp.component';
declare const $ : any;
@Component({
  selector: "vgipl-changePassword",
  templateUrl: "./changePassword.html",
  providers: [ApiService, Spinner, ]
})
export class ChangePasswordComponent implements OnInit ,AfterViewInit{
  // @ViewChild(Otp) otpCntrl: Otp;
  @ViewChildren(Otp) otpCntrl: QueryList<Otp>;
  logInfo: ILogin;
  mobileNo: string = "";
  password: string = "";
  confPass: string = "";
  oldPassword: string = "";
  newPassword: string = "";
  confNewPass: string = "";
  code: number = 0;
  msg: string = "";
  data: Array<any>;
  loginClass: string;
  showLgn: boolean = true;
  showGenOtpBtn: boolean = true;
  showOtp: string = 'hide cta OtpBtn';
  showChangePass: boolean = false;
  showFgP: boolean = false;
  showOtpBtnF: boolean = false;
  showFgpSave: boolean = false;
  showChP: boolean = false;
  showOtpBtnC: boolean = false;
  showChpSave: boolean = false;
  showUnLok: boolean = false;
  showOtpBtnU: boolean = false;
  showULokSave: boolean = false
  showHelpModal: boolean = false
  po_OTPExpDur: any;
  OTP_Det_ID: string = '';
  otp: any;
  TCchek: boolean = true;
  msgType: string = '';
  option = {
    position: 'top-center',
    showClose: true,
    timeout: 5000,
    theme: 'bootstrap',
    type: this.msgType,
    closeOther: false,
    msg: ''
  }
  termCondContent: string;
  otpElement: any;
  // secretKeyElement : any;

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


  constructor(
    private apiService: ApiService, private dataStorage: DataStorage, private router: Router,private renderer2: Renderer2, private errorHandler: ErrorHandler,
    private toast: Toast, private dialog: MatDialog, private spinner: Spinner, private common: Common, private bottomSheet: MatBottomSheet) { }

    ngOnInit() {
      this.logInfo = this.dataStorage.logInfo;
      this.mobileNo = this.logInfo[0].LOGIN_USER_ID;
      $('#vpayBanner').hide();
      const mobNo = this.renderer2.selectRootElement('#txtMobileNo');
      setTimeout(() => mobNo.disabled = true, 0);
    }
    pageHelp() {
      this.common.TermConditons({ Term_Cond_Type: "21", loginFlag: 'A' }, this).subscribe(data => {
        if (data.code == 1) {
          // this.showHelpModal = true;
          // if (this.showHelpModal == true) {
          //   $(document).ready(function () {
          //     $("#helpModal").modal('show');
          //   });
          // }
          this.termCondContent = data.cursor1;
        }
      });
    }
  
    ngAfterViewInit() {
      this.otpElement = this.otpCntrl.find(a => a.eid == 'otp');
      // this.secretKeyElement =  this.otpCntrl.find(a=>a.eid=='seceretKey');
    }
    clear() {
      // this.mobileNo = '';
      this.oldPassword = '';
      this.newPassword = '';
      this.confNewPass = '';
      this.otpElement.otp = '';
    }
    generateOTP(flag) {
      if (this.mobileNo.trim().length === 0) {
        this.message = "Enter Mobile no.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.mobileNo.trim().length !== 10) {
        this.message = "Enter a valid 10 digit mobile no.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      let paramObj = {
        login_user_id: this.mobileNo,
        Client_Mst_Id: this.logInfo[0].CLIENT_MST_ID,
        Insti_Sub_Mst_Id: this.dataStorage.insti_sub_mst_id
      }
      let path = "";
      // if(flag==="F")
      // path = '/auth/merchant/forgetGetOTP';
      if (flag === "C")
        path = '/auth/merchant/changePassOTP';
      let pageObj = this;
      this.spinner.show();
      this.apiService.sendToServer<IOtp>(path, paramObj, this).subscribe(data => {
        this.spinner.hide();
        if (data) {
          if (data.msg === 'Success') {
            const mobNo = pageObj.renderer2.selectRootElement('#txtMobileNo');
            setTimeout(() => mobNo.disabled = true, 0);
            if (flag === "C") {
              pageObj.showGenOtpBtn = false;
              pageObj.OTP_Det_ID = data.Po_Otp_Det_ID;
              pageObj.po_OTPExpDur = data.po_OTPExpDur;
              pageObj.showOtp = 'show cta OtpBtn';
              pageObj.otpElement.placeholder = 'Enter OTP';
              pageObj.otpElement.showOtp(data, pageObj);
              pageObj.showChangePass = false;
            }
          }
          else {
            this.errorHandler.handlePageError(data.msg);
          }
        }
      },
        err => {
          this.spinner.hide();
          this.errorHandler.handlePageError(err);
        })
    }
  
  
    onClickCheckOTP() {
      var curotp = '';
      // for Otp control
      curotp = this.otpElement.otp;
      // curotp = this.otpCntrl.otp;
      if (!curotp || (curotp && curotp.trim().length != 6)) {
        this.message = "Please Enter valid OTP.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      this.spinner.show();
      let paramObj = {
        login_user_id: this.mobileNo,
        OTP_Det_ID: this.OTP_Det_ID,
        otp: curotp
      }
      let pageObj = this;
      this.apiService.sendToServer<IOtp>('/auth/merchant/CheckOTP', paramObj, this).subscribe(data => {
        this.spinner.hide();
        if (data && data.msg === 'Success') {
          pageObj.showOtp = 'hide cta OtpBtn';
          pageObj.showGenOtpBtn = false;
          pageObj.showChangePass = true;
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
  
  
    changePass() {
      this.otp = this.otpElement.otp;
      if (this.mobileNo.trim().length === 0) { this.option.msg = "Enter mobile no."; this.option.type = 'error'; this.toast.addToast(this.option); return false; }
      if (this.mobileNo.trim().length !== 10) { this.option.msg = "Enter a valid 10 digit mobile no."; this.option.type = 'error'; this.toast.addToast(this.option); return false; }
      if (this.otp.trim().length === 0) { this.option.msg = "Enter OTP."; this.option.type = 'error'; this.toast.addToast(this.option); return false; }
      if (this.oldPassword.trim().length === 0) { this.option.msg = "Enter Old Password."; this.option.type = 'error'; this.toast.addToast(this.option); return false; }
      if (this.newPassword.trim().length === 0) { this.option.msg = "Enter New Password."; this.option.type = 'error'; this.toast.addToast(this.option); return false; }
      if (this.confNewPass.trim().length === 0) { this.option.msg = "Enter Confirm Password."; this.option.type = 'error'; this.toast.addToast(this.option); return false; }
      if (this.newPassword.trim() !== this.confNewPass.trim()) { this.option.msg = "Confitm Password should be matched with Password."; this.option.type = 'error'; this.toast.addToast(this.option); this.confNewPass = ""; return false; }
      this.spinner.show();
      let paramObj = {
        login_user_id: this.mobileNo,
        old_password: this.oldPassword.trim(),
        new_password: this.newPassword.trim(),
        Client_Mst_Id: this.logInfo[0].CLIENT_MST_ID,
        Insti_Sub_Mst_Id: this.logInfo[0].INSTI_SUB_MST_ID,
        otp: this.otp,
        old_conf_pass: '',
        new_conf_pass: '',
        new_slt_conf_pass: '',
        flag: 'L',
        Flag: 'L'
      }
      this.apiService.sendToServer<IOtp>('/auth/merchant/changePass', paramObj, this).subscribe(data => {
        this.spinner.hide();
        if (data && data.msg === 'Success') {
          this.message = "Your Password changed successfully. Now you can login.";
          MessageBox.show(this.dialog, this.message, "");
          this.router.navigate(['/home']);
        }
        else if (data && data.msg !== 'Success') {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
          this.router.navigate(['/home']);
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
        Otp_Det_ID: this.OTP_Det_ID
      }
      let pageObj = this;
      this.apiService.sendToServer<IOtp>('/auth/merchant/regenOTP', paramObj, this).subscribe(data => {
        this.spinner.hide();
        if (data) {
          if (data.msg === 'Success') {
            pageObj.OTP_Det_ID = data.Pio_Otp_Det_ID;
            pageObj.po_OTPExpDur = data.Po_Otpexpdur;
            pageObj.showOtp = 'show cta OtpBtn';
            pageObj.showGenOtpBtn = false;
            pageObj.showChangePass = false;
            pageObj.otpElement.placeholder = 'Enter OTP';
            pageObj.otpElement.showOtp(data, pageObj);
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



   otpConfirmation() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        id: 1,
        title: "OTP Verification Required !",
        content: "Do you want to change password ?",
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        //   console.log("“ Dialog was closed“" )
        //  console.log(result)
        if (result == true)
          // this.gotoLogout();
          this.generateOTP("C");
      });
    }
}

import { Component, OnInit, Renderer2, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
//import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { DataStorage } from '../../../core/dataStorage';
import { Spinner } from '../../../services/spinner';
import { IOtp } from '../../../interface/otp';
import { ErrorHandler } from '../../../core/errorHandler';
import { Toast } from '../../../services/toast';
import { Otp } from '../../../shared/component/otp/otp.component';
import { Common } from '../../../services/common';

import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'vgipl-forgetUnlock',
  templateUrl: './forgetUnlock.component.html',
  styleUrls: ['./forgetUnlock.component.css'],
  providers: [ApiService, Spinner]
})
export class ForgetUnlockComponent implements OnInit, AfterViewInit {
  @ViewChildren(Otp) otpCntrl: QueryList<Otp>;
  pageCaption: string;
  pageFlag: string;
  showGenSecBtn: boolean = false;
  showSignUp: string = 'hide cta signUpBtn';
  showUnlockUser: string = 'hide cta';

  hideSeceretKey: string = "hide cta secKeyBtn";
  corporateCode: string = "";
  loginUserType: string = '';
  seceretKey: string = "";
  hideCorpCode: string = "hide";
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
  hideOtp: string = "hide cta OtpBtn";
  showOtp: boolean = false;

  showFgP: boolean = false;
  showOtpBtnF: boolean = false;
  showFgpSave: boolean = false;

  showChP: boolean = false;
  showOtpBtnC: boolean = false;
  showChpSave: boolean = false;

  showUnLok: boolean = false;
  showOtpBtnU: boolean = false;
  showULokSave: boolean = false
  po_OTPExpDur: any;
  OTP_Det_ID: string = '';
  otp: string = '';
  TCchek: boolean = true;
  curotp: string = '';
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
  secretKeyElement: any;
  secretOtp: boolean = false;
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
  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, private dataStorage: DataStorage,
    private errorHandler: ErrorHandler, private dialog: MatDialog, private toast: Toast, private spinner: Spinner, private renderer2: Renderer2, private common: Common) {
    this.loginClass = "btn-login1";
  }

  ngOnInit() {
    $('#vpayBanner').hide();
    this.mobileNo = "";
    this.corporateCode = "";
    this.loginUserType = this.dataStorage.loginUserType; //this.route.queryParams["_value"].loginUserType;

    this.pageFlag = this.route.queryParams["_value"].pageFlag;
    this.mobileNo = this.route.queryParams["_value"].loginUserId;
    this.corporateCode = this.route.queryParams["_value"].corporateCode;

    if (this.pageFlag == 'SP')
      this.pageCaption = 'Set Password For Existing User';
    else if (this.pageFlag == 'U')
      this.pageCaption = 'Unlock User';
    else
      this.pageCaption = 'Forget Password';
    this.dataStorage.loginUserType = this.loginUserType;
    this.setfirstFocus(this.loginUserType);
  }

  ngAfterViewInit() {
    // this.clear();
    if (this.showOtp) {

    }

    this.otpElement = this.otpCntrl.find(a => a.eid == 'otp');
    this.secretKeyElement = this.otpCntrl.find(a => a.eid == 'seceretKey');
  }


  pageHelpF() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "16", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }
  pageHelpU() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "24", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }

  setfirstFocus(loginUserType: string) {
    const txtCorporateCode = this.renderer2.selectRootElement('#txtCorporateCode');
    const txtMobileNo = this.renderer2.selectRootElement('#txtMobileNo');

    if (loginUserType === 'C') {
      this.hideCorpCode = 'show';
      this.showGenSecBtn = true;
      this.showGenOtpBtn = false;
      setTimeout(() => txtCorporateCode.focus(), 0);
    }
    else {
      this.hideCorpCode = 'hide';
      this.showGenOtpBtn = true;
      this.showGenSecBtn = false;
      setTimeout(() => txtMobileNo.focus(), 0);
    }
  }
  clearPass() {
    this.password = '';
    this.confPass = '';
    // const divPassVal = this.renderer2.selectRootElement('#divPassVal');
    // if(divPassVal)
    // divPassVal.className ='hide passwordValidator';
    $('.passwordValidator').removeClass('show').removeClass('hide').addClass('hide');
  }
  clear() {
    this.corporateCode = '';
    this.mobileNo = '';
    this.password = '';
    this.secretKeyElement.otp = '';
    this.otp = '';
    this.confPass = '';
    // const divPassVal = this.renderer2.selectRootElement('#divPassVal');
    // if(divPassVal)
    // divPassVal.className ='hide passwordValidator';
  }
  generateSecKey() {
    if (this.mobileNo && this.mobileNo.toString().length === 10) {
      let paramObj = {
        Login_User_Id: this.mobileNo,
        Insti_Sub_Mst_Id: this.dataStorage.insti_sub_mst_id,
        Mobileno: this.mobileNo,
        Flag: 'C',
        KeyFlag: 'Y'
      }
      let pageObj = this;
      this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/CORPORATESIGNUP', paramObj, this).subscribe(data => {
        if (data) {
          if (data.msg === 'Success') {
            // pageObj.hideSeceretKey = "show";
            // pageObj.showGenSecBtn = false;
            // pageObj.showSignUp = 'hide cta signUpBtn';
            // pageObj.OTP_Det_ID = data.Pi_OTP_Det_ID;
            // pageObj.po_OTPExpDur = data.po_OTPExpDur
            // pageObj.hideOtp = "hide";
            // const txtCorporateCode = pageObj.renderer2.selectRootElement('#txtCorporateCode');
            // setTimeout(() => txtCorporateCode.disabled = true, 0);
            // const txtMobileNo = pageObj.renderer2.selectRootElement('#txtMobileNo');
            // setTimeout(() => txtMobileNo.disabled = true, 0);
            // const txtSecKey = pageObj.renderer2.selectRootElement('#txtSecKey');
            // setTimeout(() => txtSecKey.focus(), 0);
            pageObj.OTP_Det_ID = data.Pi_OTP_Det_ID;
            pageObj.po_OTPExpDur = data.po_OTPExpDur;
            if (data.msg === 'Success') {
              pageObj.hideSeceretKey = "show cta secKeyBtn";
              pageObj.showGenSecBtn = false;
              pageObj.showSignUp = 'hide cta signUpBtn';

              this.secretKeyElement.placeholder = 'Enter Secret Key';
              this.secretKeyElement.showOtp(data, pageObj);


              pageObj.hideOtp = "hide";
              const txtCorporateCode = pageObj.renderer2.selectRootElement('#txtCorporateCode');
              setTimeout(() => txtCorporateCode.disabled = true, 0);
              const txtMobileNo = pageObj.renderer2.selectRootElement('#txtMobileNo');
              setTimeout(() => txtMobileNo.disabled = true, 0);
              // const txtSecKey = pageObj.renderer2.selectRootElement('#txtSecKey');
              // setTimeout(() => txtSecKey.focus(), 0);
            }
          }
          else {
            this.message = data.msg; MessageBox.show(this.dialog, this.message, "");
            this.router.navigate(['/authentication/login']);
          }
        }
      },
        err => {
          this.spinner.hide();
          this.errorHandler.handlePageError(err);
        })
    }
    else {
      this.option.msg = "Please Enter Mobile No.";
      this.option.type = 'error';
      this.toast.addToast(this.option);
      return false;
    }
  }
  /**
   * Generate OTP for corporate
   */
  generateCorpOTP(pageObj) {
    this.spinner.show();
    if (pageObj.mobileNo && pageObj.mobileNo.toString().length === 10) {
      let paramObj = {
        Login_User_Id: pageObj.mobileNo,
        Insti_Sub_Mst_Id: pageObj.dataStorage.insti_sub_mst_id,
        Mobileno: pageObj.mobileNo,
        Flag: 'C',
        KeyFlag: pageObj.pageFlag == 'U' ? 'U' : 'FL'
      }
      if (pageObj.pageFlag == 'SP')
        paramObj.KeyFlag = 'F';
      //let pageObj = this;
      this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/CORPORATESIGNUP', paramObj, this).subscribe(data => {
        if (data) {
          this.spinner.hide();
          if (data.msg === 'Success') {
            pageObj.showGenOtpBtn = false;
            pageObj.hideOtp = 'show cta OtpBtn';
            pageObj.showSignUp = 'hide cta signUpBtn';
            pageObj.OTP_Det_ID = data.Pi_OTP_Det_ID;
            pageObj.po_OTPExpDur = data.po_OTPExpDur;

            this.otpElement.placeholder = 'Enter OTP';
            this.otpElement.showOtp(data, pageObj);
            pageObj.hideOtp = "show";
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
    else {
      this.message = "Please Enter Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
  }

  regenerateOTP() {
    this.otpElement.otp = '';
    let paramObj = {
      Otp_Det_ID: this.OTP_Det_ID
    }
    let pageObj = this;
    this.spinner.show();
    this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/regenOTP', paramObj, this).subscribe(data => {
      if (data) {
        this.spinner.hide();
        if (data.msg === 'Success') {
          // pageObj.showGenOtpBtn = false;
          // pageObj.showOtp = 'show cta OtpBtn';;
          // pageObj.showSignUp = 'hide cta signUpBtn';
          // pageObj.OTP_Det_ID = data.Pio_Otp_Det_ID;
          // pageObj.po_OTPExpDur = data.Po_Otpexpdur;

          // pageObj.otpCntrl.showOtp({ po_OTPExpDur: pageObj.po_OTPExpDur }, pageObj);
          pageObj.OTP_Det_ID = data.Pio_Otp_Det_ID;
          pageObj.po_OTPExpDur = data.Po_Otpexpdur;

          if (pageObj.hideSeceretKey == "show cta secKeyBtn") {
            pageObj.hideSeceretKey = 'show cta secKeyBtn';
            pageObj.hideOtp = 'hide cta OtpBtn';
            pageObj.secretKeyElement.placeholder = 'Enter Secret Key';
            pageObj.secretKeyElement.showOtp(data, pageObj);
          } else {
            pageObj.hideOtp = 'show cta OtpBtn';
            pageObj.hideSeceretKey = 'hide cta secKeyBtn';
            pageObj.showGenOtpBtn = false;
            pageObj.showSignUp = 'hide cta signUpBtn';
            pageObj.otpElement.placeholder = 'Enter OTP';
            pageObj.otpElement.showOtp(data, pageObj);
          }
        }

        else {
          this.message = data.msg; MessageBox.show(this.dialog, this.message, "");
          this.otpElement.otp = '';
          this.secretKeyElement.otp = '';
          this.router.navigate(['/authentication/login']);
        }
      }

    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })


  }
  generateOTP() {
    if (this.mobileNo.trim().length === 0) {

      this.message = "Enter Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.mobileNo.trim().length !== 10) {
      this.message = "Enter a valid 10 digit mobile no.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    let forgetFlag = this.pageFlag == 'SP' ? 'MR' : 'FL';
    if (this.pageFlag == "U")
      forgetFlag = "U";

    this.spinner.show();
    let paramObj = {
      login_user_id: this.mobileNo,
      Insti_Sub_Mst_Id: this.dataStorage.insti_sub_mst_id,
      Client_Mst_Id: this.dataStorage.client_Mst_Id,
      flag: forgetFlag
    }
    let path = "";
    path = '/auth/merchant/forgetGetOTP';
    let pageObj = this;

    this.apiService.sendDataBeforeLogin<IOtp>(path, paramObj, this).subscribe(data => {
      if (data) {
        this.spinner.hide();
        if (data.msg === 'Success') {
          const txtMobileNo = pageObj.renderer2.selectRootElement('#txtMobileNo');
          setTimeout(() => txtMobileNo.disabled = true, 0);
          pageObj.OTP_Det_ID = data.Po_Otp_Det_ID;
          pageObj.po_OTPExpDur = data.po_OTPExpDur;
          pageObj.showGenOtpBtn = false;
          pageObj.hideOtp = 'show cta OtpBtn';
          pageObj.showSignUp = 'hide cta signUpBtn';
          pageObj.otpElement.placeholder = 'Enter OTP';
          pageObj.otpElement.showOtp(data, pageObj);
        }
        else {
          pageObj.message = data.msg; MessageBox.show(pageObj.dialog, pageObj.message, "");
          pageObj.router.navigate(['/authentication/login']);
        }
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }

  onClickCheckSecKey() {
    if (!this.secretKeyElement.otp || (this.secretKeyElement.otp && this.secretKeyElement.otp.trim().length != 6)) {
      this.message = "Please Enter 6 digit Seceret Key.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.secretOtp = true;
    this.onClickCheckOTP('Secret');
  }


  onClickCheckOTP(runotp) {
    if (runotp == 'Secret')
      this.curotp = this.secretKeyElement.otp;
    else
      this.curotp = this.otpElement.otp;
    if (this.secretOtp) {
      //curotp = this.secretKeyElement.seceretKey;
      if (!this.curotp || this.curotp && this.curotp.trim().length != 6) {
        this.message = "Please Enter valid Secret Key.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    }
    else {
    }
    let paramObj = {
      login_user_id: this.mobileNo,
      OTP_Det_ID: this.OTP_Det_ID,
      otp: this.curotp
    }
    this.spinner.show();
    let pageObj = this;
    this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/CheckOTP', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        if (pageObj.secretOtp) {
          pageObj.generateCorpOTP(pageObj);
          pageObj.hideOtp = 'hide cta OtpBtn';
          pageObj.showGenSecBtn = false;
          pageObj.showGenOtpBtn = false;
          pageObj.showSignUp = 'hide cta signUpBtn';
          pageObj.hideSeceretKey = 'hide cta secKeyBtn';
          pageObj.otpElement.hideOtp();
          pageObj.secretOtp = false;
        }
        else if (pageObj.pageFlag == "U") {
          // pageObj.showOtp = 'hide cta OtpBtn';;
          // pageObj.showGenOtpBtn = false;
          // pageObj.showSignUp = 'hide cta signUpBtn';
          // pageObj.hideOtp = "hide";
          // pageObj.showUnlockUser ='show cta';
          // const btnUserUnlock = pageObj.renderer2.selectRootElement('#btnUserUnlock');
          // setTimeout(() => btnUserUnlock.focus(), 0);
          this.unlockUser(pageObj);
        }
        else {
          this.hideOtp = 'hide cta OtpBtn';
          this.showGenOtpBtn = false;
          this.showSignUp = 'show cta signUpBtn';
          pageObj.showSignUp = 'show cta signUpBtn';
          // pageObj.showOtp = "hide";
          const txtPasswd = pageObj.renderer2.selectRootElement('#txtPasswd');
          setTimeout(() => txtPasswd.focus(), 0);
        }
      }
      else {
        this.spinner.hide();
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }

    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }

  forgetPass() {
    let flag = "";
    let pageObj = this;
    if (pageObj.pageFlag == 'SP')
      flag = "MR";
    else
      flag = "FL";
    if (pageObj.loginUserType == 'C' && pageObj.corporateCode.trim().length == 0) {
      // alert("Enter Corporate Code.");
      this.message = "Enter Corporate Code.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (pageObj.mobileNo.trim().length === 0) {
      // alert("Enter mobile no.");
      this.message = "Enter mobile no.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (pageObj.mobileNo.trim().length !== 10) { pageObj.option.msg = "Enter a valid 10 digit mobile no."; alert(pageObj.option.msg); return false; }
    if (pageObj.curotp.trim().length === 0) { pageObj.option.msg = "Enter OTP."; alert(pageObj.option.msg); return false; }
    if (pageObj.password.trim().length === 0) { pageObj.option.msg = "Enter Password."; alert(pageObj.option.msg); return false; }
    if (pageObj.confPass.trim().length === 0) { pageObj.option.msg = "Enter confirm Password."; alert(pageObj.option.msg); return false; }
    if (pageObj.password.trim() !== pageObj.confPass.trim()) { pageObj.option.msg = "Confitm Password should be matched with Password."; alert(pageObj.option.msg); return false; }
    let paramObj = {
      login_user_id: pageObj.mobileNo,
      new_password: pageObj.password.trim(),
      Insti_Sub_Mst_Id: pageObj.dataStorage.insti_sub_mst_id,
      otp: pageObj.curotp,
      flag: flag
    }
    this.spinner.show();
    this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/forgetPassword', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        this.message = "Your Password changed successfully. Now you can login.";
        MessageBox.show(this.dialog, this.message, "");
        this.router.navigate(['/home']);
      }
      else if (data && data.msg !== 'Success') {
        this.message = data.msg; MessageBox.show(this.dialog, this.message, "");
        return false;
      }

    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }

  unlockUser(pageObj) {
    if (!pageObj)
      pageObj = this;
    let paramObj = {
      login_user_id: pageObj.mobileNo,
      Client_Mst_Id: pageObj.dataStorage.client_Mst_Id,
      Insti_Sub_Mst_Id: pageObj.dataStorage.insti_sub_mst_id,
      otp: pageObj.curotp,
      Otp: pageObj.curotp,
      Flag: 'M',
      flag: 'M',
    }
    this.spinner.show();
    this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/unlockUser', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        this.message = " User unlocked successfully. Now you can login.";
        MessageBox.show(this.dialog, this.message, "");
        this.router.navigate(['/home']);
      }
      else if (data && data.msg !== 'Success') {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }
  gotoHome() {
    this.router.navigate(['']);
  }

  gotoLogin() {
    this.router.navigate(['/authentication/login']);
  }
  gotoSignUp(flag: string) {
    this.router.navigate(['/authentication/signup'], { queryParams: { signUpUserType: flag } });
  }
  gotoAbout() {
    this.router.navigate(['/about']);
  }
  gotoHowToUse() {
    this.router.navigate(['/howItWorks']);
  }
  gotoOurTeam() {
    this.router.navigate(['/ourTeam']);
  }
  gotoWhyUs() {
    this.router.navigate(['/whyUs']);
  }

}

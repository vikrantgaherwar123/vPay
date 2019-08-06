import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/** Custom Import */
//import { Textbox } from '../../../shared/component/textbox/textbox.component';
import { IOtp } from '../../../interface/otp';
import { ApiService } from '../../../core/api.service';
import { DataStorage } from '../../../core/dataStorage';
import { ErrorHandler } from '../../../core/errorHandler';
import { FocusDirective } from '../../../shared/directive/focus/focus.directive';
import { Spinner } from '../../../services/spinner';
import { Toast } from '../../../services/toast';
import { Otp } from '../../../shared/component/otp/otp.component';

import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
import { from } from 'rxjs';
/** class decorator */
@Component({
  selector: 'vgipl-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [ApiService, ErrorHandler, DataStorage,Spinner]
})
/** define class SignupComponent and implement OnInit and  IOtp(custom) interface   */
export class SignupComponent implements OnInit, AfterViewInit {
  @ViewChildren(Otp) otpCntrl: QueryList<Otp>;
  hideCorpCode: string = "hide";
  hideSeceretKey: string = "hide cta secKeyBtn";
  corporateCode: string = "";
  showGenSecBtn: boolean = false;
  mobileNo: string;
  loginPass: string;
  confirmLoginPass: string;
  loginSalt: string;
  otp: string; seceretKey: string;
  showGenOtpBtn: boolean = false;
  showOtp: boolean = false;
  showSignUp: string = 'hide cta signUpBtn';
  OTP_Det_ID: string = '';
  po_OTPExpDur: string = ''; Pi_Otp_Det_ID: string = '';
  code: number = 0;
  msg: string = '';
  data: Array<any>;
  generateOtPBtnDisabled: boolean = false;
  hideOtp: string = "hide cta OtpBtn";
  msgType: string = "";
  option = {
    position: 'top-center',
    showClose: true,
    timeout: 500000,
    theme: 'bootstrap',
    type: this.msgType,
    closeOther: false,
    msg: ''
  }
  signUpUserType: string
  otpElement: any;
  secretKeyElement: any;
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

  constructor(private apiService: ApiService, private dialog: MatDialog, private dataStorage: DataStorage, private route: ActivatedRoute,
    private errorHandler: ErrorHandler, private spinner: Spinner, private router: Router, private toast: Toast, private renderer2: Renderer2) {

  }
  ngOnInit() {
    $('#vpayBanner').hide();
    this.clear();
    this.signUpUserType = this.route.queryParams["_value"].signUpUserType;
    this.dataStorage.loginUserType = this.signUpUserType;
    this.setfirstFocus(this.signUpUserType);

  }
  setfirstFocus(signUpUserType: string) {
    const txtCorporateCode = this.renderer2.selectRootElement('#txtCorporateCode');
    const txtMobileNo = this.renderer2.selectRootElement('#txtMobileNo');
    if (signUpUserType === 'C') {
      this.hideCorpCode = 'show';
      this.showGenSecBtn = true;
      this.showGenOtpBtn = false;
      setTimeout(() => txtCorporateCode.focus(), 0);
    }
    else {

      this.hideSeceretKey = "hide cta secKeyBtn";
      this.showSignUp = 'hide cta signUpBtn';
      this.hideOtp = "hide cta OtpBtn";
      this.hideCorpCode = 'hide';
      this.showGenOtpBtn = true;
      this.showGenSecBtn = false;
      const txtMobileNo = this.renderer2.selectRootElement('#txtMobileNo');
      setTimeout(() => txtMobileNo.disabled = '', 0);
      setTimeout(() => txtMobileNo.focus(), 0);
    }
  }
  ngAfterViewInit() {
    this.clear();
    if (this.showOtp) {

    }

    this.otpElement = this.otpCntrl.find(a => a.eid == 'otp');
    this.secretKeyElement = this.otpCntrl.find(a => a.eid == 'seceretKey');
  }
  clear() {
    this.mobileNo = '';
    this.corporateCode = "";
    this.seceretKey = "";
    this.otp = '';
    $('.passwordValidator').removeClass('show').removeClass('hide').addClass('hide');

  }
  clearPass() {
    this.confirmLoginPass = '';
    this.loginPass = '';
  }
  // ngDoCheck(){
  //   //this.generateOtPBtnDisabled = (this.mobileNo && this.mobileNo.toString().trim().length>0)?false:true;
  // }


  onClickCheckSecKey() {
    if (!this.seceretKey || (this.seceretKey && this.seceretKey.trim().length != 6)) {
      // alert("Please Enter 6 digit Seceret Key.")
      this.message = "Please Enter 6 digit Seceret Key.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.onClickCheckOTP('Secret');
  }

  generateSecKey() {
    this.seceretKey = "";
    if (this.mobileNo && this.mobileNo.toString().length === 10) {
      let paramObj = {
        Login_User_Id: this.mobileNo,
        Insti_Sub_Mst_Id: this.corporateCode,
        Mobileno: this.mobileNo,
        Flag: 'C',
        KeyFlag: 'Y'
      }
      let pageObj = this;
      this.spinner.show();
      this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/CORPORATESIGNUP', paramObj, this).subscribe(data => {
        if (data) {
          this.spinner.hide();
          if (data.msg === 'Success') {
            pageObj.hideSeceretKey = "show cta secKeyBtn";
            pageObj.showGenSecBtn = false;
            pageObj.showSignUp = 'hide cta signUpBtn';

            this.secretKeyElement.placeholder = 'Enter Secret Key';
            this.secretKeyElement.showOtp(data, pageObj);

            pageObj.OTP_Det_ID = data.Pi_OTP_Det_ID;
            pageObj.po_OTPExpDur = data.po_OTPExpDur
            pageObj.hideOtp = "hide cta OtpBtn";
            const txtCorporateCode = pageObj.renderer2.selectRootElement('#txtCorporateCode');
            setTimeout(() => txtCorporateCode.disabled = true, 0);
            const txtMobileNo = pageObj.renderer2.selectRootElement('#txtMobileNo');
            setTimeout(() => txtMobileNo.disabled = true, 0);
            const txtSecKey = pageObj.renderer2.selectRootElement('#txtSecKey');
            setTimeout(() => txtSecKey.focus(), 0);
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
    this.spinner.show();
    let paramObj = {
      Otp_Det_ID: this.OTP_Det_ID
    }
    let pageObj = this;
    this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/regenOTP', paramObj, this).subscribe(data => {
      if (data) {
        this.spinner.hide();
        if (data.msg === 'Success') {

          pageObj.OTP_Det_ID = data.Pio_Otp_Det_ID;
          pageObj.po_OTPExpDur = data.Po_Otpexpdur;

          if (pageObj.hideSeceretKey == 'show') {
            pageObj.hideSeceretKey = 'show';
            pageObj.hideOtp = 'hide cta OtpBtn';
            pageObj.secretKeyElement.placeholder = 'Enter Secret Key';
            pageObj.secretKeyElement.showOtp(data, pageObj);
          } else {
            pageObj.hideOtp = 'show cta OtpBtn';
            pageObj.hideSeceretKey = 'hide';
            pageObj.showGenOtpBtn = false;
            pageObj.showSignUp = 'hide cta signUpBtn';
            pageObj.otpElement.placeholder = 'Enter OTP';
            pageObj.otpElement.showOtp(data, pageObj);
          }
        }
        else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
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


  getInputData(val, elmId) {
    switch (elmId) {
      case 'mobileNo': this.mobileNo = val;

        break;

      default:
        break;
    }
  }

  /**
    * Generate OTP for Individual
    */
  generateOTP() {
    debugger;
    this.otp = '';
    if (this.mobileNo && this.mobileNo.toString().length === 10) {
      let paramObj = {
        login_user_id: this.mobileNo
      }
      let pageObj = this;
      this.spinner.show();
      this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/signUpGetOTP', paramObj, this).subscribe(data => {
        if (data) {
          this.spinner.hide();
          if (data.msg === 'Success') {
            const mobNo = pageObj.renderer2.selectRootElement('#txtMobileNo');
            setTimeout(() => mobNo.disabled = true, 0);
            pageObj.OTP_Det_ID = data.Po_Otp_Det_ID;
            pageObj.po_OTPExpDur = data.po_OTPExpDur;
            pageObj.showGenOtpBtn = false;
            pageObj.showOtp = true;
            pageObj.showSignUp = 'hide cta signUpBtn';

            this.otpElement.placeholder = 'Enter OTP';
            this.otpElement.showOtp(data, pageObj);


            pageObj.hideOtp = "show cta OtpBtn";
            let otp = $('#txtOtp');
            setTimeout(() => otp.focus(), 500);
            //const element = this.renderer2.selectRootElement('#txtOtp');

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
      // this.option.msg = "Please Enter Mobile No.";
      // this.option.type = 'error';
      // this.toast.addToast(this.option);
      return false;
    }
  }


  /**
   * Generate OTP for corporate
   */
  generateCorpOTP() {

    if (this.mobileNo && this.mobileNo.toString().length === 10) {
      let paramObj = {
        Login_User_Id: this.mobileNo,
        Insti_Sub_Mst_Id: this.corporateCode,
        Mobileno: this.mobileNo,
        Flag: 'C',
        KeyFlag: 'N'
      }
      this.spinner.show();
      let pageObj = this;
      this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/CORPORATESIGNUP', paramObj, this).subscribe(data => {
        if (data) {
          this.spinner.hide();
          if (data.msg === 'Success') {
            // const mobNo = this.renderer2.selectRootElement('#txtMobNo');
            // setTimeout(() => mobNo.disabled = true, 0);
            pageObj.showGenOtpBtn = false;
            pageObj.showOtp = true;
            pageObj.showSignUp = 'hide cta signUpBtn';
            pageObj.OTP_Det_ID = data.Pi_OTP_Det_ID;
            pageObj.po_OTPExpDur = data.po_OTPExpDur;

            this.otpElement.placeholder = 'Enter OTP';
            this.otpElement.showOtp(data, pageObj);


            pageObj.hideOtp = "show cta OtpBtn";
            // let otp = $('#txtOtp');
            // setTimeout(() => otp.focus(), 500);
            //const element = this.renderer2.selectRootElement('#txtOtp');

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
      this.spinner.hide();
      this.message = "Please Enter Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      // this.option.msg = "Please Enter Mobile No.";
      // this.option.type = 'error';
      // this.toast.addToast(this.option);
      return false;
    }
  }
  /*
   * Check Otp
  */
  onClickCheckOTP(runotp) {


    var curotp = '';
    if (runotp == 'Secret')
      curotp = this.seceretKey;
    else
      curotp = this.otpElement.otp;

    if (!curotp || (curotp && curotp.trim().length != 6)) {
      alert("Please Enter 6 digit OTP.")
      return false;
    }
    let paramObj = {
      login_user_id: this.mobileNo,
      OTP_Det_ID: this.OTP_Det_ID,
      otp: curotp,
    }
    let pageObj = this;
    this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/CheckOTP', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        if (runotp == 'Secret') {
          pageObj.generateCorpOTP();
          pageObj.showOtp = true;
          pageObj.showGenSecBtn = false;
          pageObj.showGenOtpBtn = false;
          pageObj.showSignUp = 'hide cta signUpBtn';
          pageObj.hideSeceretKey = 'hide cta secKeyBtn';
          const txtOtp = pageObj.renderer2.selectRootElement('#txtOtp');
          setTimeout(() => txtOtp.focus(), 0);
        }
        else {
          pageObj.showOtp = false;
          pageObj.showGenOtpBtn = false;
          pageObj.showSignUp = 'show cta signUpBtn';
          pageObj.hideOtp = "hide cta OtpBtn";
          const txtPasswd = pageObj.renderer2.selectRootElement('#txtPasswd');
          setTimeout(() => txtPasswd.focus(), 0);
        }

      }
      else {

        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        this.secretKeyElement.otp = '';
        this.otpElement.otp = '';
        // pageObj.option.msg = data.msg;
        // pageObj.toast.addToast(this.option);
      }

    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }

  submit() {

    if (this.loginPass.trim().length === 0) {
      // this.option.msg = "Enter Password."; 
      // alert(this.option.msg);
      this.message = "Enter Password.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.confirmLoginPass.trim().length === 0) {
      //  this.option.msg = "Enter confirm Password.";
      //   alert(this.option.msg); 
      this.message = "Enter confirm Password.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.loginPass.trim() !== this.confirmLoginPass.trim()) {
      //  this.option.msg = "Confitm Password should be matched with Password."; 
      //  alert(this.option.msg); 
      this.message = "Confitm Password should be matched with Password.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.signUpUserType === 'C')
      this.corpSignUp();
    else
      this.signUp();
  }

  /**
   * Individual Signup
   */
  signUp() {
    this.spinner.show();
    let paramObj = {
      login_user_id: this.mobileNo,
      login_pass: this.loginPass,
      // otp: this.otp,
      otp: this.otpElement.otp
    }
    let pageObj = this;
    this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/signUp', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        // alert("Your account created successfully. Now you can login.");
        // pageObj.option.msg = "Your account created successfully. Now you can login.";
        //pageObj.toast.addToast(pageObj.option);
        //pageObj.option.type = 'success';
        // alert(pageObj.option.msg);
        this.message = "Your account created successfully. Now you can login.";
        MessageBox.show(this.dialog, this.message, "");
        pageObj.router.navigate(['/home']);
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        // pageObj.option.msg = data.msg;
        // pageObj.toast.addToast(pageObj.option);
      }

    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }

  /**
   * signup
   */
  corpSignUp() {
    this.spinner.show();
    let paramObj = {
      Login_User_Id: this.mobileNo,
      Insti_Sub_Mst_Id: this.corporateCode,
      Mobileno: this.mobileNo,
      Flag: 'R',
      KeyFlag: 'N',
      Login_Pass: this.loginPass,
      // Otp: this.otp,
      Otp: this.otpElement.otp,
      OTP_Det_ID: this.OTP_Det_ID
    }
    let pageObj = this;
    this.apiService.sendDataBeforeLogin<IOtp>('/auth/merchant/CORPORATESIGNUP', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        // pageObj.option.msg = "Your account created successfully. Now you can login.";
        //pageObj.toast.addToast(pageObj.option);
        //pageObj.option.type = 'success';
        // alert(pageObj.option.msg);
        this.message = "Your account created successfully. Now you can login.";
        MessageBox.show(this.dialog, this.message, "");
        pageObj.router.navigate(['/home']);
      }
      else {

        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        // pageObj.option.msg = data.msg;
        // pageObj.toast.addToast(pageObj.option);
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
  // gotoLogin(flag) {
  //   this.router.navigate(['/authentication/login'], { queryParams: { loginUserType: flag } });
  // }
  gotoLogin() {
    //this.dataStorage.loginUserType = flag;
    this.router.navigate(['/authentication/login']);
  }
  gotoSignUp(signUpUserType) {
    // this.setfirstFocus(signUpUserType);
    // window.location.reload();
    this.router.navigate(['/authentication/signup']);
    // this.router.navigate(['/blankPage']);

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
  gotoblankPage() {
    this.router.navigate(['/blankPage']);
  }
}

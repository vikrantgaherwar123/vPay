import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../../core/api.service';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { Spinner } from '../../../services/spinner';
import { ErrorHandler } from '../../../core/errorHandler';
import { Common } from '../../../services/common';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ConfirmDialogComponent } from '../../../shared/component/confirm-dialog/confirm-dialog.component';
import { MessageBox } from "../../../services/_shared/message-box";
import { Otp } from "../../../shared/component/otp/otp.component";
import { Subscription } from "rxjs/Subscription";
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { IOtp } from '../../../interface/otp';
declare const $: any;
@Component({
  selector: 'app-TPIN',
  templateUrl: './TPIN.component.html',
  styleUrls: [
    './../bank.component.scss'
  ],
  providers: [DecimalPipe],
})
export class TPINComponent implements OnInit {
  @ViewChild(dtp) dtp: dtp;
  @ViewChildren(Otp) otpCntrl: QueryList<Otp>;
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
  Insti_Sub_Mst_Id: any;
  CUSTNAME:any ;

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
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;

  //TPin Variable
  RRN_No: any;
  CBS_TranID: any;
  tpinTitle: any;
  txt_Tdate: any;
  showTpin: boolean = true;
  showDivGenerateOtp: boolean = false;
  showBtnTpin: boolean = true;
  showSetTpinInput: boolean = false;
  showUnlockTpin: boolean = false;
  showVpayOtp: string = "hide";
  btnBack: boolean = true;
  mobileNo: string = "";
  tpin: string = "";
  confirmTpin: string = "";
  curotp: string = "";

  //otp
  OTP_ExpDur: any;
  Po_Otp_Det_ID: any;
  po_OTPExpDur: any;
  statusMsg: any;
  showPOPUP: boolean = false;


  // dtp variables
  msgshowhide: string;
  DisplayMsg: string = '';
  SetControlValue: string;
  currentDate: any;
  otpElement: any;
  OTP_Det_ID: string = '';
  showOtp: string = 'hide cta OtpBtn';
req:any;
  //dialog box Variable
  message;


  constructor(private dataStorage: DataStorage, private errorHandler: ErrorHandler, private router: Router, private route: ActivatedRoute, private apiService: ApiService,
    private spinner: Spinner, private common: Common, public dialog: MatDialog, private dp: DecimalPipe) {
  }

  ngOnInit() {
    this.spinner.show();
    this.logInfo = this.dataStorage.logInfo;
    this.mobileNo = this.logInfo[0].LOGIN_USER_ID;
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
      // this.Get_AccountList('FRAC');
      this.req = this.route.queryParams["_value"].Request;
      if (this.req == 'set') {
        this.setTpin();
      }
      else if (this.req == 'unlock') {
        this.unlockTpin();
      }
    }   
    else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");
    }
    this.spinner.hide();
  }

  ngAfterViewInit() {
    this.otpElement = this.otpCntrl.find(a => a.eid == 'otp');
    // this.secretKeyElement =  this.otpCntrl.find(a=>a.eid=='seceretKey');
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

  setTpin() {
    this.showTpin = false;
    this.showBtnTpin = true;
    this.tpinTitle = " Set Transaction PIN";
    this.showDivGenerateOtp = true;
    // this.btnBack = false;
  }
  unlockTpin() {
    this.showTpin = false;
    // this.btnBack = false;
    this.showBtnTpin = false;
    this.tpinTitle = "Unlock TPIN";
    this.showDivGenerateOtp = true;
    // this.showUnlockTpin = true;
  }

  generateOTP() {
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
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: this.login_user_id,
      flag: 'C',
      request_from: 'WB',
      Client_Mst_Id: this.clientMstId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,


    };
    this.spinner.show();
    let pageObj = this;
    this.apiService.sendToServer<IOtp>('/api/virtualPay/GetOTP', paramObj, this).subscribe((data) => {
      debugger
      if (data != null && data != undefined) {
        if (data.Po_Error != null) {
          this.message = data.Po_Error;
          MessageBox.show(this.dialog, this.message, "");
        }
        else {
          pageObj.OTP_Det_ID = data.Po_Otp_Det_ID;
          pageObj.po_OTPExpDur = data.po_OTPExpDur;
          pageObj.showDivGenerateOtp = false;
          pageObj.showOtp = 'show cta OtpBtn';
          pageObj.otpElement.placeholder = 'Enter OTP';;
          pageObj.otpElement.showOtp(data, pageObj);
          pageObj.Po_Otp_Det_ID = pageObj.OTP_Det_ID;
        }
        this.spinner.hide();
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }


  onClickCheckOTP() {
    this.curotp = '';
    // for Otp control
    this.curotp = this.otpElement.otp;
    // curotp = this.otpCntrl.otp;
    if (!this.curotp || (this.curotp && this.curotp.trim().length != 6)) {
      this.message = "Please Enter valid OTP.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    let paramObj = {
      login_user_id: this.mobileNo,
      OTP_Det_ID: this.OTP_Det_ID,
      otp: this.curotp
    }
    let pageObj = this;
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/auth/merchant/CheckOTP', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        pageObj.showOtp = 'hide cta OtpBtn';
        if (this.showBtnTpin == true) {
          this.showSetTpinInput = true;
        }
        else {
          this.unlockUser(pageObj);
          pageObj.showOtp = 'show cta OtpBtn';
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }

  saveData() {
    if (this.tpin.trim().length === 0) {
      this.message = "Enter TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.confirmTpin.trim().length === 0) {
      this.message = "Enter confirm Password.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.tpin.trim() !== this.confirmTpin.trim()) {

      this.message = "Confitm TPIN should be matched with TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    /**Functionality for saving new MPIN */
    var paramObj = {
      login_user_id: this.login_user_id,
      otp: this.curotp,
      Tpin: this.confirmTpin,
      Tpin_Slt: '',
      Client_Mst_Id: this.clientMstId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag
    };
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/auth/merchant/Set_TPin', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        // this.message = "Your TPIN set successfully.";
        // MessageBox.show(this.dialog, this.message, "");
        this.statusMsg = "  Your TPIN Create Successfully. Use TPIN for Transactions.";
        this.showPOPUP = true;
        if (this.showPOPUP == true) {
          $(document).ready(function () {
            $("#TopupDialog").modal('show');
          });
        }
        // this.router.navigate(['/bank']);
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

  unlockUser(pageObj) {
    if (!pageObj)
      pageObj = this;
    let paramObj = {
      login_user_id: pageObj.mobileNo,
      Client_Mst_Id: pageObj.clientMstId,
      Insti_Sub_Mst_Id: pageObj.Insti_Sub_Mst_Id,
      otp: pageObj.curotp,
      Flag: 'T'
    }
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/auth/merchant/unlockUser', paramObj, this).subscribe(data => {
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


  regenerateOTP() {
    this.otpElement.otp = '';
    let paramObj = {
      Otp_Det_ID: this.OTP_Det_ID
    }
    let pageObj = this;
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/auth/merchant/regenOTP', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data) {
        if (data.msg === 'Success') {
          pageObj.OTP_Det_ID = data.Pio_Otp_Det_ID;
          pageObj.po_OTPExpDur = data.Po_Otpexpdur;
          pageObj.showOtp = 'show cta OtpBtn';
          // pageObj.showGenOtpBtn = false;
          // pageObj.showChangePass = false;
          pageObj.otpElement.placeholder = 'Enter OTP';
          pageObj.otpElement.showOtp(data, pageObj);
          // for Otp control
        }
        else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
          // this.router.navigate(['/bank']);
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
    if (this.req == 'set') {
      dialogConfig.data = {
        id: 1,
        title: "OTP Verification Required !",
        content: "Do you want to set TPIN ?",
      };
    }
    else if (this.req == 'unlock') {
      dialogConfig.data = {
        id: 1,
        title: "OTP Verification Required !",
        content: "Do you want to unlock TPIN ?",
      };
    }
   
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == true)
      this.generateOTP();
    });
  }


  clearPage() {
    this.tpin = null;
    this.confirmTpin = null;
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


  Back() {
    // this.clearPage();
    this.showVpayOtp = 'hide';
    this.btnBack = true;
    this.showDivGenerateOtp = false;
    this.showUnlockTpin = false;
    this.showTpin = true;
  }

  pageBack() {
    this.clearPage()
    this.router.navigate(['/bank'],{ queryParams: { 'bank': false}  });
  }




}



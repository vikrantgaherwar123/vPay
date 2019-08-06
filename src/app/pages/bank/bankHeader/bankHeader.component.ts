import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../../core/api.service';
import { ILogin } from '../../../interface/login';
import { ICore } from '../../../interface/core';
import { DataStorage } from '../../../core/dataStorage';
import { Spinner } from '../../../services/spinner';
import { ErrorHandler } from '../../../core/errorHandler';
import { Common } from '../../../services/common';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { MessageBox } from "../../../services/_shared/message-box";
import { ConfirmDialogComponent } from '../../../shared/component/confirm-dialog/confirm-dialog.component';
import { Otp } from "../../../shared/component/otp/otp.component";
import { DomSanitizer } from '@angular/platform-browser';

import { dtp } from '../../../shared/component/dtp/dtp.component';
import { IBank } from '../../../interface/bank';

declare const $: any;
@Component({
  selector: 'app-bankHeader',
  templateUrl: './bankHeader.component.html',
  styleUrls: [
    './../bank.component.scss'
  ],
  providers: [DecimalPipe],
})
export class bankHeaderComponent implements OnInit {
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

  CUSTNAME: any;
  password: any;
  Disp_BankModal = false;
  selectedArray: any = [];
  flagCount: any;
  ClientData: any;
  ClientCheckList: any = false;
  Disp_authUserModal: boolean = false;
  showError: boolean = false;
  errMsg: any;



  termCondContent: string;
  //mobile Banking Variable
  banklogo: any = null;
  showBankList = 'hide';
  showOverlay = 'hide';
  listarray = [];
  bankname: any;
  setBankLogo: any = null;
  selectedBank: any;
  BankArray = [];
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
  SwitchIcon: boolean = false;
  SwitchBank: boolean = false;
  BankOptionCard = false;

  // dtp variables
  msgshowhide: string;
  DisplayMsg: string = '';
  SetControlValue: string;
  currentDate: any;
  otpElement: any;
  OTP_Det_ID: string = '';
  showOtp: string = 'hide cta OtpBtn';
  req: any;

  message;

  bankMenu: any = [];
  listArray1: any;
  bankArrayList: any;
  showFundTransfer: boolean;
  clientPhoto: string;
  showUserIcon: boolean = false;
  hide = true;
  constructor(private dataStorage: DataStorage, private domSanitizer: DomSanitizer, private errorHandler: ErrorHandler, private router: Router, private route: ActivatedRoute, private apiService: ApiService,
    private spinner: Spinner, private common: Common, public dialog: MatDialog, private dp: DecimalPipe) {
  }

  ngOnInit() {
    this.spinner.show();
    this.logInfo = this.dataStorage.logInfo;
    this.mobileNo = this.logInfo[0].LOGIN_USER_ID;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    if (this.logInfo[0].CLIENT_PHOTO) {
      this.clientPhoto = "data:image/JPEG;base64," + this.logInfo[0].CLIENT_PHOTO;
      this.showUserIcon = false;
    }
    this.userName = this.logInfo[0].CLIENT_NAME;
    this.lastLogin = this.logInfo[0].LOGIN_DATE;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.sessionId = this.logInfo.sessionId;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';

    if (this.logInfo[0].SelectedBankData != null) {
      this.spinner.show();
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

      if (this.logInfo[0].MultiBankArray != null) {
        if (this.logInfo[0].MultiBankArray.length > 1) {
          this.SwitchBank = true;
        } else
          this.SwitchBank = false;
      }
      if (this.logInfo[0].switchicon != false) {
        if (this.logInfo[0].InetUserList != null) {
          if (this.logInfo[0].InetUserList.length > 1 || this.logInfo[0].InetUserListHeader.length > 1) {
            this.SwitchIcon = true;
          } else
            this.SwitchIcon = false;
        }
      } else {
        this.SwitchIcon = false;
      }
      this.BankOptionCard = true;
      this.logInfo[0].BankOptionCard = this.BankOptionCard;
      if (this.logInfo[0].SelectedBankData == null) {
        this.Get_BankList();
      }
      // this.spinner.hide();
    }
    else {

    }
  }

  ngAfterViewInit() {
    this.otpElement = this.otpCntrl.find(a => a.eid == 'otp');
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




  clearPage() {
    this.tpin = null;
    this.confirmTpin = null;
  }

  //INET USER LIST
  CheckUserFromCBS() {
    this.spinner.show();
    this.Disp_authUserModal = false;
    this.BankOptionCard = false;
    this.logInfo[0].BankOptionCard = this.BankOptionCard;
    this.password = '';
    if (this.Disp_BankModal == true) {
      var parmObj = {
        Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
        Client_Mst_ID: this.clientMstId,
        Secret_Key: this.secretKey,
        Inet_Corp_Id: this.InetCorpoID,
        Inet_User_Id: this.InetUserID,
        Inet_Corporate_Flag: this.InetCorpFlag,
        url: this.url
      }
    } else {
      if (this.logInfo[0].SelectedBankData != null) {
        this.selectedArray = this.logInfo[0].SelectedBankData;
      }
      var parmObj = {
        Bank_Reg_Mst_Id: this.selectedArray[0].BANK_REG_MST_ID,
        Client_Mst_ID: this.clientMstId,
        Secret_Key: this.selectedArray[0].SECRET_KEY,
        Inet_Corp_Id: this.selectedArray[0].INET_CORP_ID,
        Inet_User_Id: this.selectedArray[0].INET_USER_ID,
        Inet_Corporate_Flag: this.selectedArray[0].INET_CORPORATE_FLAG,
        url: this.selectedArray[0].URL
      }
    }
    this.apiService.sendToServer<ICore>('/api/virtualpay/Inet_Client_Check', parmObj, this).subscribe(data => {
      this.spinner.show();
      if (data.msg.toUpperCase() === "SUCCESS") {
        if (data.cursor1.length > 0) {
          this.flagCount = new Set(data.cursor1.map(item => item.CORPORATE_FLAG))
          this.logInfo[0].InetUserListHeader = data.cursor1;
          if (data.cursor1.length == 1) {
            this.ClientData = data.cursor1[0]
            this.InetCorpFlag = data.cursor1[0].CORPORATE_FLAG;
            this.InetCorpoID = data.cursor1[0].INET_CORP_ID;
            this.InetUserID = data.cursor1[0].INET_USER_ID;
            this.CUSTNAME = data.cursor1[0].CUSTNAME;
            this.logInfo[0].switchicon = false;
            this.SwitchIcon = this.logInfo[0].switchicon;
            this.Disp_authUserModal = true;
            if (this.Disp_authUserModal == true) {
              $(document).ready(function () {
                $("#authUserModal").modal('show');
              });
              $(document).ready(function () {
                $("#authUserModal").on('shown.bs.modal', function () {
                  $(this).find('input[type="password"]').focus();
                });
              });
            }
          }
          else {
            this.logInfo[0].switchicon = true;
            this.SwitchIcon = this.logInfo[0].switchicon;
            this.ClientData = data.cursor1;
            this.ClientCheckList = true;
            if (this.ClientCheckList == true) {
              $(document).ready(function () {
                $("#BankUserModal").modal('show');
              });
            }
          }
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.message, this.dialog, "");
      }
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      });
  }



  //Select CBS Bank Data
  SelectedBank(obj) {
    this.selectedArray = [];
    this.setBankLogo = obj.BANK_FULL_LOGO;
    this.BANK_REG_MST_ID = obj.BANK_REG_MST_ID;
    this.Cbs_CustomerID = obj.CBS_CUSTOMER_ID;
    this.secretKey = obj.SECRET_KEY;
    this.url = obj.URL;
    this.InetCorpoID = obj.INET_CORP_ID;
    this.InetUserID = obj.INET_USER_ID;
    this.InetCorpFlag = obj.INET_CORPORATE_FLAG;
    this.selectedArray.push(obj);
    this.CheckUserFromCBS();
  }


  showBankModal() {
    this.listarray = [];
    this.BankArray = [];
    this.selectedArray = [];
    this.Get_BankList();
  }

  //CBS BANK  LIST
  Get_BankList() {
    var paramObj = {
      Device_Id: 'Desktop',
      request_from: 'WB',
      Client_Mst_ID: this.clientMstId,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag
    };
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_VPAYCLIENTBANK', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        let BankList = data.cursor1;
        var list;
        this.BankArray = [];
        this.selectedArray = [];
        for (var i = 0; i < BankList.length; i++) {
          if (BankList[i].BANK_REG_MST_ID > 0) {
            this.BankArray.push(BankList[i]);
          }
          list = {
            'BANK_NAME': this.BankArray[i].BANK_NAME,
            'BANK_LOGO': this.BankArray[i].BANK_LOGO == null ? '' : this.arrayBufferToBase64(this.BankArray[i].BANK_LOGO.data),
            'BANK_FULL_LOGO': this.BankArray[i].BANK_FULL_LOGO == null ? '' : this.arrayBufferToBase64(this.BankArray[i].BANK_FULL_LOGO.data),
            'BANK_REG_MST_ID': this.BankArray[i].BANK_REG_MST_ID,
            'SECRET_KEY': this.BankArray[i].SECRET_KEY,
            'URL': this.BankArray[i].URL,
            'SUB_AG_MST_ID': this.BankArray[i].SUB_AG_MST_ID,
            'CLIENT_MST_ID': this.BankArray[i].CLIENT_MST_ID,
            'INET_CORP_ID': this.BankArray[i].INET_CORP_ID,
            'INET_USER_ID': this.BankArray[i].INET_USER_ID,
            'INET_CORPORATE_FLAG': this.BankArray[i].INET_CORPORATE_FLAG,
            'CBS_CUSTOMER_ID': this.BankArray[i].CBS_CUSTOMER_ID,
          }
          this.listarray.push(list);
        }
        this.BankArray = this.listarray;
        this.selectedArray = this.BankArray;
        if (this.BankArray.length > 1) {
          this.BankOptionCard = false;
          this.logInfo[0].BankOptionCard = this.BankOptionCard;
          this.Disp_BankModal = true;
          if (this.Disp_BankModal == true) {
            $(document).ready(function () {
              $("#BankModal").modal('show');
            });
          }
        } else {
          // this.BankOptionCard = true;
          this.CheckUserFromCBS();
        }
        this.banklogo = this.BankArray[0].BANK_FULL_LOGO == null ? null : this.BankArray[0].BANK_FULL_LOGO;
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }



  //Multi INET Bank user Selected DATA
  selectedBankUser(userObj) {
    this.InetCorpFlag = userObj.CORPORATE_FLAG;
    this.InetCorpoID = userObj.INET_CORP_ID;
    this.InetUserID = userObj.INET_USER_ID;
    this.CUSTNAME = userObj.CUSTNAME;
    // this.BankOptionCard = true;
    this.Disp_authUserModal = true;
    if (this.Disp_authUserModal == true) {
      $(document).ready(function () {
        $("#authUserModal").modal('show');
      });
      $(document).ready(function () {
        $("#authUserModal").on('shown.bs.modal', function () {
          $(this).find('input[type="password"]').focus();
        });
      });
    }
  }

  //Inet Authorized user
  AuthorizeUser() {
    this.Disp_authUserModal = false;

    this.spinner.show();
    var parmObj = {
      Client_Mst_Id: this.clientMstId,
      login_user_id: this.login_user_id,
      Login_Pass: this.password,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Pass_Flag: 'P',
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag
    }
    this.apiService.sendToServer<IBank>('/api/virtualpay/AuthorizeClient', parmObj, this).subscribe(data => {
      if (data.msg.toUpperCase() === "SUCCESS") {
        if (data.Po_Responce == 'Y') {
          this.BankOptionCard = true;
          this.logInfo[0].BankOptionCard = this.BankOptionCard;
          this.selectedArray[0].INET_CORPORATE_FLAG = this.InetCorpFlag;
          this.selectedArray[0].CORPORATE_FLAG = this.InetCorpFlag;
          this.selectedArray[0].INET_CORP_ID = this.InetCorpoID;
          this.selectedArray[0].INET_USER_ID = this.InetUserID;
          this.selectedArray[0].CUSTNAME = this.CUSTNAME;
          this.logInfo[0].SelectedBankData = this.selectedArray;

          this.GetBankMenu();
          this.router.navigate(['/bank'], { queryParams: { 'bank': 'false' } });
        }
        else {
          this.showError = true;
          this.password = '';
          this.errMsg = "Enter Valid Password";
          this.Disp_authUserModal = true;
          if (this.Disp_authUserModal == true) {
            $(document).ready(function () {
              $("#authUserModal").modal('show');
            });
            $(document).ready(function () {
              $("#authUserModal").on('shown.bs.modal', function () {
                $(this).find('input[type="password"]').focus();
              });
            });
          }
        }

      }
      else {
        this.showError = true;
        this.password = '';
        this.errMsg = "Enter Valid Password";
        this.Disp_authUserModal = true;
        if (this.Disp_authUserModal == true) {
          $(document).ready(function () {
            $("#authUserModal").modal('show');
          });
          $(document).ready(function () {
            $("#authUserModal").on('shown.bs.modal', function () {
              $(this).find('input[type="password"]').focus();
            });
          });
        }
      }
      this.spinner.hide();
    },
      err => {
        //obj.navController.push(InternetConnectionPage, { 'ErrorMsg': err, 'loginFlag': 'N' })
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
        this.CheckUserFromCBS();
      });


  }


  onKeyup(event) {
    if (event.keyCode === 13) {
      $("#authUserModal").modal('hide');
      this.AuthorizeUser();
    }
  }
  Pbankfund

  //Bank Menu
  GetBankMenu() {
    this.spinner.show();
    var paramObj = {
      Bank_Mst_ID: this.selectedArray[0].BANK_REG_MST_ID,
      request_from: 'WB',
      Customer_ID: this.selectedArray[0].CBS_CUSTOMER_ID,
      CORPORATE_FLAG: this.Corporate_Flag,
      Secret_Key: this.selectedArray[0].SECRET_KEY,
      url: this.selectedArray[0].URL,
      Inet_Corp_Id: this.selectedArray[0].INET_CORP_ID,
      Inet_User_Id: this.selectedArray[0].INET_USER_ID,
      Inet_Corporate_Flag: this.selectedArray[0].INET_CORPORATE_FLAG,
    };
    this.apiService.sendToServer<ICore>('/api/virtualPay/GetBankMenu', paramObj, this).subscribe(data => {
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        //response code ==00  
        this.listArray1 = data.cursor1;
        this.logInfo[0].ListArray1 = this.listArray1;
        this.bankMenu = [];
        for (var i = 0; i < this.listArray1.length; i++) {
          if (this.listArray1[i].PARENT_MENU_MST_ID === 1) {
            this.bankMenu.push(this.listArray1[i]);
          }
          if (this.listArray1[i].CAPTION_NAME === '   Fund Transfer') {
            this.showFundTransfer = true;
            this.logInfo[0].ShowFundTransfer = this.showFundTransfer;
          }
        }
        this.bankArrayList = this.bankMenu;
        this.logInfo[0].BankArrayList = this.bankArrayList;
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

  switchBank() {
    this.BankOptionCard = false;
    this.logInfo[0].BankOptionCard = this.BankOptionCard;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: "",
      content: "Do you want to Switch Bank?",
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      //   console.log("“ Dialog was closed“" )
      //  console.log(result)
      if (result == true)
        this.showBankModal();
    });
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
    this.router.navigate(['/bank'], { queryParams: { 'bank': false } });
  }


  btnClose() {
    this.router.navigate(['/dashboard'], { queryParams: { 'kyc': false } });
  }



}



import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { ILogin } from '../../interface/login';
import { DomSanitizer } from '@angular/platform-browser';
import { DataStorage } from '../../core/dataStorage';
import { ErrorHandler } from '../../core/errorHandler';
import { IBank } from '../../interface/bank';
import { Spinner } from '../../services/spinner';
import { ICore } from '../../interface/core';
import { Common } from '../../services/common';
import { MatDialog } from "@angular/material";
import { MessageBox } from "../../services/_shared/message-box";
declare const $: any;


@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: [
    './bank.component.scss'
  ],
  providers: [DecimalPipe],
})
export class BankComponent implements OnInit {

  imgPath: string = "";
  logInfo: ILogin;
  clientMstId: number;
  login_user_id: string;
  userName: string = "";
  lastLogin: string = "";
  Insti_Sub_Mst_Id: string = "";
  BUSINESS_DETAILS: string = "";
  Corporate_Flag: any;

  termCondContent: string;
  //mobile Banking
  banklogo: any = null;
  bankname: any;
  accountlist: any;
  setBankLogo: any = null;
  selectedBank: any;
  BankArray = [];
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;
  accdetails: any;
  BalanceAccount: any;
  secretKey: any;
  url: any;
  ac_Type: any;
  // showBankList = false;
  BankOptionCard = false;
  Disp_BankModal = false;
  Disp_authUserModal = false;
  // showOverlay = 'hide';
  listarray = [];
  InetCorpoID: any;
  InetUserID: any;
  InetCorpFlag: any;
  CUSTNAME: any;
  selectedArray: any = [];
  password: any;

  flagCount: any;
  // MOBILE_BANK_TRAN_FLAG
  //V---Hide Approval & fund Transfer ,T--Hide IMPS,I--All Display
  ClientData: any;
  ClientCheckList: boolean = false;
  bankHeader: boolean = false;

  bankMenu: any = [];
  listArray1: any;
  bankArrayList: any;
  errMsg: any;
  showFundTransfer: boolean = false;
  showError: boolean = false;
  //dialog
  message;
  clientPhoto: string;
  showUserIcon: boolean = false;
  hide = true;

  sessionId: any;
  constructor(private dataStorage: DataStorage, private domSanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router, private apiService: ApiService,
    private spinner: Spinner, public renderer2: Renderer2, private errorHandler: ErrorHandler, private common: Common, public dialog: MatDialog, private dp: DecimalPipe) { }

  ngOnInit() {
    this.spinner.show();
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    if (this.logInfo[0].CLIENT_PHOTO) {
      this.clientPhoto = "data:image/JPEG;base64," + this.logInfo[0].CLIENT_PHOTO;
      this.showUserIcon = false;
    }
    this.userName = this.logInfo[0].CLIENT_NAME;
    this.lastLogin = this.logInfo[0].LOGIN_DATE;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.sessionId = this.logInfo.sessionId;
    this.BankOptionCard = false;
    if (this.logInfo[0].SelectedBankData == null && this.route.queryParams["_value"].bank != 'false') {
      this.GetUpdateBankData();
    } else if (this.logInfo[0].SelectedBankData !== null && this.route.queryParams["_value"].bank != 'false') {
      this.Get_BankList();
    }
    if (this.logInfo[0].SelectedBankData != null && this.route.queryParams["_value"].bank == 'false') {
      this.spinner.show();
      this.BankOptionCard = true;
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
      this.bankArrayList = this.logInfo[0].BankArrayList;
      this.listArray1 = this.logInfo[0].ListArray1;
      this.showFundTransfer = this.logInfo[0].ShowFundTransfer;
      this.bankHeader = true;
      this.spinner.hide();
    }
    // if (this.route.queryParams["_value"].bank != 'false' && this.logInfo[0].SelectedBankData == null) {
    // if (this.route.queryParams["_value"].bank != 'false') {

    //   this.Get_BankList();
    // }
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
    this.common.TermConditons({ Term_Cond_Type: "6", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }

  //GEt cbs bank List
  Get_BankList() {
    this.spinner.show();
    var paramObj = {
      Device_Id: 'Desktop',
      request_from: 'WB',
      Client_Mst_ID: this.clientMstId,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag
    };
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_VPAYCLIENTBANK', paramObj, this).subscribe((data) => {
      this.spinner.show();
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
        this.logInfo[0].MultiBankArray = this.listarray;
        this.selectedArray = this.BankArray;
        if (this.BankArray.length > 1) {
          this.BankOptionCard = false;
          this.Disp_BankModal = true;
          if (this.Disp_BankModal == true) {
            $(document).ready(function () {
              $("#BankModal").modal('show');
            });
          }
        } else {
          this.CheckUserFromCBS();
        }
        this.banklogo = this.BankArray[0].BANK_FULL_LOGO == null ? null : this.BankArray[0].BANK_FULL_LOGO;
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }







  selectedBankUser(userObj) {
    this.Disp_authUserModal = true;
    this.InetCorpFlag = userObj.CORPORATE_FLAG;
    this.InetCorpoID = userObj.INET_CORP_ID;
    this.InetUserID = userObj.INET_USER_ID;
    this.CUSTNAME = userObj.CUSTNAME;
    this.BankOptionCard = false;
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

  //Select Bank Data
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


  //Check User from CBS
  CheckUserFromCBS() {
    this.Disp_authUserModal = false;
    this.spinner.show();
    this.password = '';
    this.BankOptionCard = false;
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
          this.logInfo[0].InetUserList = data.cursor1;
          if (data.cursor1.length == 1) {
            this.ClientData = data.cursor1[0]
            this.InetCorpFlag = data.cursor1[0].CORPORATE_FLAG;
            this.InetCorpoID = data.cursor1[0].INET_CORP_ID;
            this.InetUserID = data.cursor1[0].INET_USER_ID;
            this.CUSTNAME = data.cursor1[0].CUSTNAME;
            this.logInfo[0].switchicon = false;
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
            this.ClientData = data.cursor1;
            this.logInfo[0].switchicon = true;
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
      this.spinner.show();
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
          // this.selectedArray[0].CORPORATE_FLAG = this.InetCorpFlag;
          this.selectedArray[0].INET_CORP_ID = this.InetCorpoID;
          this.selectedArray[0].INET_USER_ID = this.InetUserID;
          this.selectedArray[0].CUSTNAME = this.CUSTNAME;
          this.logInfo[0].SelectedBankData = this.selectedArray;

          this.GetBankMenu();
          this.bankHeader = true;
        }
        else {
          // this.message = "Invalid Password";
          // MessageBox.show(this.dialog, this.message, "");
          this.showError = true;
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
        // this.message = data.msg;
        //   MessageBox.show(this.dialog, this.message, "");
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
        // const txtSearchterm1 = this.renderer2.selectRootElement('#txtSearchterm1');
        //   setTimeout(() => txtSearchterm1.focus(), 0);


      }
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      });


  }
  gotoPage(page) {
    if (page == 'loanReq') {
      this.router.navigate(['/bank/loanReq']);
    }
    else if (page == 'Deposit') {
      this.router.navigate(['/bank/depositOpen']);
    }
    else if (page == 'mail') {
      this.router.navigate(['/bank/MailBox']);
    }
  }

  SelectChildMenu(subMenu) {
    var childMenuName = subMenu.CAPTION_NAME.trim();
    if (childMenuName == 'Rtgs' || childMenuName == 'Neft' || childMenuName == 'Other') {
      var PFlag = 'O';
      this.router.navigate(['/bank/fundTransfer'], { queryParams: { pageFlag: PFlag, pageTitle: childMenuName }, skipLocationChange: true });
    }
    else if (childMenuName == 'Own') {
      var PFlag = 'S';
      this.router.navigate(['/bank/fundTransfer'], { queryParams: { pageFlag: PFlag, pageTitle: childMenuName }, skipLocationChange: true });
    }
    else if (childMenuName == 'Imps') {
      this.router.navigate(['/bank/imps']);
    }
    else if (childMenuName == 'Beneficiary' || childMenuName == 'Beneficiery') {
      this.router.navigate(['/bank/beneficiaryMaintenance']);
    }
    else if (childMenuName == 'ATMCard' || childMenuName == 'TopupCard') {
      var card;
      if (childMenuName == 'ATMCard') {
        card = 'atm';
      }
      else {
        card = 'topup';

      }
      this.router.navigate(['/bank/myCard'], { queryParams: { Request: card }, skipLocationChange: true });
    }
    else if (childMenuName == 'ChqBookRequest' || childMenuName == 'StopPayRequest') {
      var request;
      if (childMenuName == 'ChqBookRequest') {
        request = 'CR';

      }
      else
        request = 'SPR';
      this.router.navigate(['/bank/request'], { queryParams: { Request: request }, skipLocationChange: true });
    }

    if (subMenu == 'loanRequest') {
      this.router.navigate(['/bank/request/loanRequest']);
    }
  }

  SelectParentMenu(menu) {
    var parentMenuName = menu.CAPTION_NAME.trim();
    var keyword;
    if (parentMenuName == 'Transaction A/c' || parentMenuName == 'Deposite A/c' || parentMenuName == 'Loan A/c') {
      if (parentMenuName == 'Transaction A/c')
        keyword = 'OPAC';
      else if (parentMenuName == 'Deposite A/c')
        keyword = 'FDAC';
      else if (parentMenuName == 'Loan A/c')
        keyword = 'LNAC';
      this.router.navigate(['/bank/transAcc'], { queryParams: { tranKeyword: keyword, }, skipLocationChange: true });
    }
    else if (parentMenuName == 'Approval') {

      this.router.navigate(['/bank/approval']);
    }
    else if (parentMenuName == 'Enquiry') {

      this.router.navigate(['/bank/enquiry']);
    }
  }

  setTpin(request) {
    this.router.navigate(['/bank/TPIN'], { queryParams: { Request: request }, skipLocationChange: true });
  }

  showBankModal() {
    this.listarray = [];
    this.BankArray = [];
    this.selectedArray = [];

    this.Get_BankList();
  }

  onKeyup(event) {
    if (event.keyCode === 13) {
      $("#authUserModal").modal('hide');
      this.AuthorizeUser();
    }
  }


  logs() {
    // alert('Coming Soon');
    this.message = "Coming Soon.";
    MessageBox.show(this.dialog, this.message, "");
  }

  GetUpdateBankData() {
    var pageObj = this;
    this.spinner.show();
    var paramObj = {
      Client_Bank_Mst_Id: "",//0
      Client_Mst_Id: pageObj.clientMstId,
      Bank_Ac_Number: "",
      Bank_Ifsc: "",
      Bank_Ac_Name: "",
      Default_Flag: "N",
      Bank_Ac_Type: "",
      Opflag: "V",
      Bank_Reg_Mst_Id: 0,
      Cbs_Customer_Id: "",
      Cbs_Customer_Mobno: "",
      Request_From: "WB",
      device_id: "Desktop",
      Device_Id: "Desktop",
      login_user_id: pageObj.login_user_id,
      Insti_Sub_Mst_Id: pageObj.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: pageObj.Corporate_Flag,
      Corporate_Flag: pageObj.Corporate_Flag,
      corporate_flag: pageObj.Corporate_Flag,
      DocMstID_Bank: null,
      Doc_IMG_Bank: null,
    };
    this.apiService.sendToServer<ICore>("/api/virtualPay/ClientBankDetails", paramObj, pageObj).subscribe(
      data => {
        if (data.code == 1 && data.msg.toUpperCase() == "SUCCESS") {
          if (data.data.length > 0) {
            let bnkmstid = data.data.filter(item => item.BANK_REG_MST_ID > 0)
            bnkmstid = bnkmstid.map(item => item.BANK_REG_MST_ID);
            if (bnkmstid.length > 0) {
              // this.BANK_MST_ID = bnkmstid[0];
              // this.router.navigate(['/bank']);
              this.Get_BankList();
            }
            else {
              // this.BANK_MST_ID = 0;
              this.router.navigate(['/settings'], { queryParams: { ID: 2 } });
            }

            if (data.data[0].BANKNAME == null) {
              this.router.navigate(['/settings'], { queryParams: { ID: 2 } });
            }
            else {
            }
          }
        }
        else {
          this.spinner.hide();
          if (data.msg == "Record not Found.") {
            // this.AddNew('N');
            this.router.navigate(['/settings'], { queryParams: { ID: 2 } });
          }
          else {
            this.message = data.msg;
            alert(this.message)
            // MessageBox.show(this.dialog, this.message, "");
          }
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      }
    );
  }

  btnClose() {
    this.router.navigate(['/dashboard'], { queryParams: { 'kyc': false } });
  }
}


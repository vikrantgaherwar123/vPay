import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { ErrorHandler } from '../../core/errorHandler';
import { IBbps } from '../../interface/bbps';
import { Spinner } from '../../services/spinner';
import { ILogin } from '../../interface/login';
import { DataStorage } from '../../core/dataStorage';
import { Common } from '../../services/common';

import { MatDialog } from "@angular/material";
import { MessageBox } from "../../services/_shared/message-box";
import { ICore } from '../../interface/core';
declare const $: any;


@Component({
  selector: 'app-bbps',
  templateUrl: './bbps.component.html',
  styleUrls: [
    './bbps.component.scss'
  ],
  providers: [],
})
export class BbpsComponent implements OnInit {

  logInfo: ILogin;
  clientMstId: number;
  login_user_id: string;
  userName: string = "";
  lastLogin: string = "";
  BUSINESS_DETAILS: string = "";
  Corporate_Flag: any;
  InetCorpoID: any;
  InetUserID: any;
  InetCorpFlag: any;

  //Mobile Bnaking
  BankArray = [];
  selectedArray = [];
  bbpsForm: boolean = false;
  Disp_BankModal: boolean = false;
  categoryName: any = '';
  categoryMstID: any = '';
  bankFullLogo: any;
  bankname: any;
  banklogo: any = null;
  setBankLogo: any = null;
  selectedBank: any;
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;
  secretKey: any;
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;
  url: any;


  ShowBBPSCate = false;
  showBankList = false;
  showOverlay = "hide";
  listarray = [];
  bbpslistarray = [];
  bbpsItemArray: any;
  termCondContent: string;
  // code: number;
  // msg: string = "";

  //dialog
  message;


  constructor(private dataStorage: DataStorage, private dialog: MatDialog, private router: Router, private apiService: ApiService,
    private spinner: Spinner, private errorHandler: ErrorHandler, private common: Common) { }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.userName = this.logInfo[0].CLIENT_NAME;
    this.lastLogin = this.logInfo[0].LOGIN_DATE;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.getCategoryList();
    this.Get_BankList();
  }
  pageHelp() {
    this.common.TermConditons({ Term_Cond_Type: "30", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }

  getCategoryList() {
    var paramObj = {
      Client_Mst_ID: this.clientMstId,
      VARCHAR_1: '',
      KEYWORD: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
    }
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualPay/Get_Bbps_Category', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.bbpsItemArray = data.cursor1;
        var list;
        for (var i = 0; i < this.bbpsItemArray.length; i++) {
          list = {
            CATEGORY_KEYWORD: this.bbpsItemArray[i].CATEGORY_KEYWORD,
            CAT_MST_ID: this.bbpsItemArray[i].CAT_MST_ID,
            CATEGORY_LOGO: this.bbpsItemArray[i].CATEGORY_LOGO == null ? "" : this.arrayBufferToBase64(this.bbpsItemArray[i].CATEGORY_LOGO.data)
          };
          this.bbpslistarray.push(list);
        }
        this.bbpsItemArray = this.bbpslistarray;
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


  gotoSearchTrans() {
    this.router.navigate(['/bbps/searchTran'], { queryParams: { bankArray: JSON.stringify(this.selectedArray) }, skipLocationChange: true });
  }
  gotoComplStatus() {
    this.router.navigate(['/bbps/complaintStatus'], { queryParams: { bankArray: JSON.stringify(this.selectedArray) }, skipLocationChange: true });
  }

  showBbpsPage(p) {
    this.router.navigate(['/bbps/bbpsPayment'], { queryParams: { bbpsCatName: p.CATEGORY_KEYWORD, bbpsCatMstID: p.CAT_MST_ID, bankArray: JSON.stringify(this.selectedArray) }, skipLocationChange: true });
  }

  //GEt cbs bank List
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
            'SUB_AG_MST_ID': this.BankArray[i].SUB_AG_MST_ID,
            'URL': this.BankArray[i].URL,
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
          this.ShowBBPSCate = false;
          // this.showBankList = true;
          // this.showOverlay = "show";
          this.Disp_BankModal = true;
          if (this.Disp_BankModal == true) {
            $(document).ready(function () {
              $("#BankModal").modal('show');
            });
          }
        } else {
          this.ShowBBPSCate = true;
        }
        this.banklogo = this.BankArray[0].BANK_FULL_LOGO == null ? null : this.BankArray[0].BANK_FULL_LOGO;
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }


  SelectedBank(obj) {
    this.ShowBBPSCate = true;
    this.selectedArray = [];
    this.setBankLogo = obj.BANK_FULL_LOGO;
    this.BANK_REG_MST_ID = obj.BANK_REG_MST_ID;
    this.Cbs_CustomerID = obj.CBS_CUSTOMER_ID;
    this.secretKey = obj.SECRET_KEY;
    this.url = obj.url;
    this.InetCorpoID = obj.INET_CORP_ID;
    this.InetUserID = obj.INET_USER_ID;
    this.InetCorpFlag = obj.INET_CORPORATE_FLAG;
    this.selectedArray.push(obj);
  }

  showBankModal() {
    this.listarray = [];
    this.BankArray = [];
    this.bbpsForm = false;
    this.Get_BankList();
  }

  btnClose() {
    this.router.navigate(['/dashboard'], { queryParams: { 'kyc': false } });
  }
}



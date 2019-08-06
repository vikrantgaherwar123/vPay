import { Component, ViewChild } from '@angular/core';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { ApiService } from '../../../core/api.service';
import { ErrorHandler } from '../../../core/errorHandler';
import { IBbps } from '../../../interface/bbps';
import { Spinner } from '../../../services/spinner';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { Common } from '../../../services/common';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'app-searchTran',
  templateUrl: './searchTran.html',
  styleUrls: [
    '../bbps.component.scss'
  ],
  providers: []
})

export class searchTransactionComponent {
  logInfo: ILogin;
  @ViewChild(dtp) dtp: dtp;
  clientMstId: number;
  login_user_id: string;
  userName: string = "";
  lastLogin: string = "";
  BUSINESS_DETAILS: string = "";
  Corporate_Flag: any;
  Insti_Sub_Mst_Id: string = "";

  //variables
  MOBILE: any = '';
  TRF_REF_NUMBER: any = '';
  txt_Fdate: any; txt_Tdate: any;
  msgType: string = '';
  msgshowhide: string;
  DisplayMsg: string = '';
  SetControlValue: string;
  Items: any;
  currentDate: any;
  Disp_DivData = false;
  // Result_Data: Array<any>;
  isDesc: boolean = false;
  column: string = '';

  //mobile Banking
  bbpsForm: boolean = false;
  categoryName: any = '';
  categoryMstID: any = '';
  bankFullLogo: any;
  bankname: any;
  banklogo: any = null;
  setBankLogo: any = null;
  selectedBank: any;
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;
  url: any;
  secretKey: any;
  showBankList = 'hide';
  listarray = [];
  BankArray = [];
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;
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


  constructor(private dataStorage: DataStorage, private dialog: MatDialog, private apiService: ApiService, private spinner: Spinner,
    private router: Router,private errorHandler : ErrorHandler, private common: Common, private route: ActivatedRoute, ) {
  }




  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.userName = this.logInfo[0].CLIENT_NAME;
    this.lastLogin = this.logInfo[0].LOGIN_DATE;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID == null ? '' : this.logInfo[0].INSTI_SUB_MST_ID;
    
    this.BankArray = JSON.parse(this.route.queryParams["_value"].bankArray);
    if (this.BankArray != null) {
      this.selectedBank = this.BankArray[0].BANK_NAME == null ? null : this.BankArray[0].BANK_NAME;
      this.banklogo = this.BankArray[0].BANK_FULL_LOGO == null ? null : this.BankArray[0].BANK_FULL_LOGO;
      this.secretKey = this.BankArray[0].SECRET_KEY;
      this.url = this.BankArray[0].URL;
      this.Cbs_CustomerID = this.BankArray[0].CBS_CUSTOMER_ID;
      this.BANK_REG_MST_ID = this.BankArray[0].BANK_REG_MST_ID;
      this.CLIENT_MST_ID = this.BankArray[0].CLIENT_MST_ID;
      this.SUB_AG_MST_ID = this.BankArray[0].SUB_AG_MST_ID;
      this.bbpsForm = true;
    } else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");
    }
    this.getcurrentDate();
  }

  pageHelp() {
    this.common.TermConditons({ Term_Cond_Type: "31", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
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

  RegisterComplaint(obj) {
    this.router.navigate(['/bbps/registerComplaint'], { queryParams: { data: JSON.stringify(obj), BankData: JSON.stringify(this.BankArray) }, skipLocationChange: true });
  }
  //bbps request
  Submit() {
    if (this.MOBILE == undefined && this.TRF_REF_NUMBER == undefined || this.MOBILE == "" && this.TRF_REF_NUMBER == "") {
      this.message = "Enter Transaction Reference Number or Mobile Number.";
      MessageBox.show(this.dialog, this.message, "");
      this.clearPage();
      return false;
    }
    if (this.MOBILE != undefined && this.TRF_REF_NUMBER == undefined || this.MOBILE != "" && this.TRF_REF_NUMBER == '') {
      if (this.MOBILE.length != 10 && this.MOBILE != "") {
        this.message = "Enter valid Mobile Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      else if (this.MOBILE == "") {
        this.message = "Enter Transaction Reference Number or Mobile Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    }
    else if (this.TRF_REF_NUMBER != undefined && this.MOBILE == undefined || this.TRF_REF_NUMBER != '' && this.MOBILE == '') {
      if (this.TRF_REF_NUMBER.length < 5 && this.TRF_REF_NUMBER != "") {
        this.message = "Enter Transaction Reference Number.";
        MessageBox.show(this.dialog, this.message, "");
        this.clearPage();
        return false;
      }
      else if (this.TRF_REF_NUMBER == "") {
        this.message = "Enter Transaction Reference Number or Mobile Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    }
    else if (this.MOBILE != undefined && this.TRF_REF_NUMBER != undefined || this.MOBILE != "" && this.TRF_REF_NUMBER != "") {
      this.message = "Enter Either Transaction Reference Number or Mobile Number.";
      MessageBox.show(this.dialog, this.message, "");
      this.clearPage();
      return false;
    }

    if ((this.MOBILE == undefined || this.MOBILE.length == 0) && (this.TRF_REF_NUMBER == undefined || this.TRF_REF_NUMBER.length == 0)) {
      this.message = "Enter Transaction Reference Number or Mobile Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.MOBILE.length > 0 && this.TRF_REF_NUMBER.length > 0) {
      // else if (this.MOBILE.length != 10) {
      this.message = "Enter Transaction Reference Number or Mobile Number only.";
      MessageBox.show(this.dialog, this.message, "");
      this.clearPage();
      return false;
    }

    if (this.txt_Fdate == undefined || this.txt_Fdate.length == 0) {
      this.message = "Select From Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.txt_Tdate == undefined || this.txt_Tdate.length == 0) {
      this.message = "Select Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    var VAR1, VAR2, VAR3;
    if (this.MOBILE.length > 0) {
      VAR1 = this.MOBILE;//'8484943081';
      VAR2 = moment(this.txt_Fdate).format('YYYY-MM-DD');//2016-07-26
      VAR3 = moment(this.txt_Tdate).format('YYYY-MM-DD');//2018-07-26
    } else {
      VAR1 = this.TRF_REF_NUMBER;//'IC31A0000555';
      VAR2 = '';
      VAR3 = '';
    }
    var paramObj = {
      client_mst_id: this.clientMstId,
      fromdate: this.txt_Fdate,
      uptodate: this.txt_Tdate,
      login_user_id: this.login_user_id,
      Client_Mst_Id: this.clientMstId,
      // Client_Mst_Id: this.CLIENT_MST_ID,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      VARCHAR_1: VAR1,
      VARCHAR_2: VAR2,
      VARCHAR_3: VAR3,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,

      Method_Name: 'GetCustomerTransactions',
      Actual_String: '',
    };
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/GetBBPSRequest', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.Items = data.txnDetails;
        if (this.Items.length == 0) {
          this.message = "No Data Found.";
          MessageBox.show(this.dialog, this.message, "");
        }
        else {
          this.Items = data.txnDetails;
          this.Disp_DivData = true;
          // this.getTransactionSearchData();
        }
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }


  clearPage() {
    this.txt_Fdate = this.currentDate;
    this.txt_Tdate = this.currentDate;
    this.TRF_REF_NUMBER = '';
    this.MOBILE = '';
    this.Disp_DivData = false;
    // this.getcurrentDate();
  }

  sort(property) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    let direction = this.isDesc ? 1 : -1;
    this.Items.sort(function (a, b) {
      if (a[property] < b[property]) {
        return -1 * direction;
      }
      else if (a[property] > b[property]) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  }

  getcurrentDate() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var fullDate = new Date();//console.log(fullDate);
    var twoDigitMonth = monthNames[fullDate.getMonth()];
    //var twoDigitMonth1 = [twoDigitMonth];
    var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
    this.currentDate = twoDigitDate + '/' + twoDigitMonth + '/' + fullDate.getFullYear();
    this.txt_Tdate = this.currentDate;
    this.txt_Fdate = this.currentDate;

  }

  getcurrentDate11(date) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var fullDate = new Date(date);//console.log(fullDate);
    var twoDigitMonth = monthNames[fullDate.getMonth()];
    //var twoDigitMonth1 = [twoDigitMonth];
    var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
    var currentDate = twoDigitDate + '/' + twoDigitMonth + '/' + fullDate.getFullYear();
    return currentDate;
  }



  Call_MsgDiv(ShowHide, Msg) {
    if (ShowHide == 'SHOW')
      this.msgshowhide = '_show';
    if (ShowHide == 'HIDE')
      this.msgshowhide = '_hide';

    this.DisplayMsg = Msg;
  }


  CallBack = function (obj) {
    if (obj != null) {
      if (obj.SetControlValue == 'txt_Fdate')
        this.txt_Fdate = obj.mydate;
      if (obj.SetControlValue == 'txt_Tdate')
        this.txt_Tdate = obj.mydate;
    }
  }

  DateTimeCtrl1(Val1, Val2) {
    this.Call_MsgDiv('HIDE', '');
    this.SetControlValue = Val2;
    var objdttm = {
      setoncontrol: Val2,
      // mtype: 'SET DATE',
      mtype: Val1 == 'D' ? 'SET DATE' : 'SET TIME',
      ctrl: 'DTTMPC',
      callback: this.CallBack,
    }
    this.dtp.toggleDTTMcontrol(objdttm, this);

    // this.Call_MsgDiv('HIDE','');
    // this.SetControlValue = Val2;
    // this.objdttm = {
    //   setoncontrol: Val2,
    //   mtype: Val1 == 'D' ? 'SET DATE' : 'SET TIME',
    //   ctrl: 'DTTMPC',
    // }
    // this.dtp.toggleDTTMcontrol(this.objdttm, this);
  }

  SetValue1 = function (obj) {

    if (obj.selectvalue != undefined && obj.selectvalue != '') {
      obj.fromdate = obj.mydate;
    }
  }

  DateTimeCtrl2(Val1, Val2) {
    this.Call_MsgDiv('HIDE', '');
    this.SetControlValue = Val2;
    var objdttm = {
      setoncontrol: Val2,
      // mtype: 'SET DATE',
      mtype: Val1 == 'D' ? 'SET DATE' : 'SET TIME',
      ctrl: 'DTTMPC',
      callback: this.CallBack,
    }
    this.dtp.toggleDTTMcontrol(objdttm, this);

  }

  SetValue2 = function (obj) {
    // if (obj.selectvalue != undefined && obj.selectvalue != '') {
    //   obj.todate = obj.mydate;
    // }
    // if (obj.txt_Fdate != undefined && obj.txt_Tdate != undefined) {
    //    if (parseFloat(obj.txt_Fdate) < parseFloat(obj.txt_Tdate) || parseFloat(obj.txt_Fdate) == parseFloat(obj.txt_Tdate)) {
    //   //   this.CallStatement('A', '', this.txt_Fdate, this.txt_Tdate);
    //    }
    //    else {
    //     //this.message ="From Date must be less than or same as To Date."; 
    //  MessageBox.show(this.dialog, this.message, "");
    //     return false;
    //    }
    // }
    var StartDate = (<HTMLInputElement>document.getElementById('txtStartDate')).value;
    var EndDate = (<HTMLInputElement>document.getElementById('txtEndDate')).value;
    var eDate = new Date(EndDate);
    var sDate = new Date(StartDate);
    if (StartDate != '' && StartDate != '' && sDate > eDate) {
      this.Reset();
      this.message = "Please ensure that the End Date is greater than or equal to the Start Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    return true;
  }





}


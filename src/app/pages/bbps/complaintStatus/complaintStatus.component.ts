import { Component, ViewChild } from '@angular/core';
import { ILogin } from '../../../interface/login';
import { Router, ActivatedRoute } from '@angular/router';
import { DataStorage } from '../../../core/dataStorage';
import { ErrorHandler } from '../../../core/errorHandler';
import { ApiService } from '../../../core/api.service';
import { IBbps } from '../../../interface/bbps';
import { Spinner } from '../../../services/spinner';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { Common } from '../../../services/common';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'app-complaintStatus',
  templateUrl: './complaintStatus.html',
  styleUrls: [
    '../bbps.component.scss'
  ],
  providers: []
})

export class ComplaintStatusComponent {
  logInfo: ILogin;
  @ViewChild(dtp) dtp: dtp;
  clientMstId: number;
  login_user_id: string;
  userName: string = "";
  lastLogin: string = "";
  BUSINESS_DETAILS: string = "";
  Corporate_Flag: any;
  Insti_Sub_Mst_Id: string = "";




  //variable
  txt_Fdate: any; txt_Tdate: any; txt_FromAmount: string; txt_ToAmount: string;
  msgType: string = '';
  msgshowhide: string;
  DisplayMsg: string = '';
  SetControlValue: string;
  Items: any;
  TrasacItems: any;
  currentDate: any;
  TRF_REF_NUMBER: any = '';
  MOBILE: any = '';
  FROM: any = '';
  TypeofComplaint: any = 'T';
  DispositionItems: Array<any>;
  DESC: any;
  Disposition: any;
  // public tabBarElement:any;
  Disp_DivData = false;
  cmplaintobj: any;
  isDesc: boolean = false;
  column: string = '';
  ComplaintType: any = '';
  agentId: any = '';
  amount: any = '';
  billerId: any = '';
  txnDate: any = '';
  txnReferenceId: any = '';


  //Mobile banking
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
  secretKey: any;
  url: any;
  showBankList = 'hide';
  listarray = [];
  BankArray = [];
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;
  SelectbankData: any;
  showOverlay = "hide";
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


  constructor(private dataStorage: DataStorage, private dialog: MatDialog, private apiService: ApiService, private common: Common,
    private router: Router, private errorHandler: ErrorHandler, private route: ActivatedRoute, private spinner: Spinner, ) {

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
    // this.banklogo = this.logInfo[0].BANKLOGO == null ? '' : this.arrayBufferToBase64(this.logInfo[0].BANKLOGO.data);
    // this.bankname = this.logInfo[0].BANKNAME == null ? '' : this.logInfo[0].BANKNAME;
    // this.Get_BankList();
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
    this.GetTxnComplaintDispositions('T');
    // if (this.logInfo[0].BANKLOGO != null) {
    //   this.banklogo = this.arrayBufferToBase64(this.logInfo[0].BANKLOGO.data);
    //   this.bankname = this.logInfo[0].BANKNAME;
    // }
    this.getcurrentDate();
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
  pageHelp() {
    this.common.TermConditons({ Term_Cond_Type: "32", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }

  // // Get Bank List
  // Get_BankList() {
  //   var paramObj = {
  //     Device_Id: 'Desktop',
  //     request_from: 'WB',
  //     Client_Mst_ID: this.clientMstId,
  //     Bank_Reg_Mst_Id: '',//this.logInfo[0].BANK_REG_MST_ID,
  //     // Customer_ID: 12940,
  //     // CORPORATE_FLAG: this.CORPORATE_FLAG

  //   };
  //   this.spinner.show();
  //   this.apiService.sendToServer<IBbps>('/api/virtualPay/Get_VPAYCLIENTBANK', paramObj, this).subscribe((data) => {
  //     if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
  //       let BankList = data.cursor1;
  //       this.BankArray = [];
  //       for (var i = 0; i < BankList.length; i++) {
  //         if (BankList[i].BANK_REG_MST_ID > 0) {
  //           this.BankArray.push(BankList[i]);
  //         }
  //       }
  //       if (this.BankArray.length == 1) {
  //         // this.navCtrl.setRoot(BankAccountDetailsPage);
  //         this.selectedBank = this.BankArray[0].BANK_NAME == null ? '' : this.BankArray[0].BANK_NAME;
  //         this.banklogo = this.BankArray[0].BANK_FULL_LOGO == null ? '' : this.arrayBufferToBase64(this.BankArray[0].BANK_FULL_LOGO.data);
  //         this.secretKey = this.BankArray[0].SECRET_KEY;
  //         this.url = this.BankArray[0].URL;
  //         this.Cbs_CustomerID = this.BankArray[0].CBS_CUSTOMER_ID;
  //         this.BANK_REG_MST_ID = this.BankArray[0].BANK_REG_MST_ID;
  //         this.CLIENT_MST_ID = this.BankArray[0].CLIENT_MST_ID;
  //         this.SUB_AG_MST_ID = this.BankArray[0].SUB_AG_MST_ID;
  //         this.bbpsForm =true;
  //       }
  //       else if (this.BankArray.length > 1) {
  //         // this.showBankModal();
  //         this.showBankList = "show";
  //         this.showOverlay = "show";
  //         var list;
  //         for (var i = 0; i < this.BankArray.length; i++) {
  //           list = {
  //             BANK_NAME: this.BankArray[i].BANK_NAME,
  //             BANK_LOGO: this.BankArray[i].BANK_LOGO == null ? "" : this.arrayBufferToBase64(this.BankArray[i].BANK_LOGO.data),
  //             BANK_FULL_LOGO: this.BankArray[i].BANK_FULL_LOGO == null ? "" : this.arrayBufferToBase64(this.BankArray[i].BANK_FULL_LOGO.data),
  //             BANK_REG_MST_ID: this.BankArray[i].BANK_REG_MST_ID,
  //             SECRET_KEY: this.BankArray[i].SECRET_KEY,
  //             URL: this.BankArray[i].URL,
  //             CBS_CUSTOMER_ID: this.BankArray[i].CBS_CUSTOMER_ID,
  //             BBPS_FLAG: this.BankArray[i].BBPS_FLAG,
  //             SUB_AG_MST_ID: this.BankArray[i].SUB_AG_MST_ID,
  //             CLIENT_MST_ID: this.BankArray[i].CLIENT_MST_ID
  //           };
  //           this.listarray.push(list);
  //         }
  //         this.BankArray = this.listarray;
  //       }
  //       this.spinner.hide();
  //     }
  //   }, err => {
  //     this.spinner.hide();
  //     this.message = err; 
  //     MessageBox.show(this.dialog, this.message, "");
  //   });
  //   return false;
  // }


  //cbs bank selected data

  // bankListData(bankData) {
  //   this.bbpsForm = true;
  //   this.setBankLogo = bankData.BANK_FULL_LOGO;
  //   this.showBankList = "hide";
  //   this.showOverlay = "hide";
  //   // this.SelectbankData = bankData;
  //   if (bankData.SECRET_KEY != null) {
  //     this.selectedBank = bankData.BANK_NAME;
  //     this.banklogo = bankData.BANK_FULL_LOGO == null ? '' : this.arrayBufferToBase64(this.BankArray[0].BANK_FULL_LOGO.data);
  //     this.secretKey = bankData.SECRET_KEY;
  //     this.url = bankData.URL;
  //     this.Cbs_CustomerID = bankData.CBS_CUSTOMER_ID;
  //     this.BANK_REG_MST_ID = bankData.BANK_REG_MST_ID;
  //     this.CLIENT_MST_ID = bankData.CLIENT_MST_ID;
  //     this.SUB_AG_MST_ID = bankData.SUB_AG_MST_ID;
  //   } else {
  //     this.message ="Invalid Data."; 
  //              MessageBox.show(this.dialog, this.message, "");
  //   }
  // }

  // showBankModal() {
  //   this.listarray = [];
  //   this.BankArray = [];
  //   this.bbpsForm = false;
  //   this.showBankList = 'show';
  //   this.showOverlay = 'show';
  //   this.Get_BankList();
  // }



  GetTxnComplaintDispositions(param) {
    var paramObj = {
      // client_mst_id: this.clientMstId,
      fromdate: this.txt_Fdate,
      uptodate: this.txt_Tdate,
      login_user_id: this.login_user_id,
      Client_Mst_Id: this.clientMstId,
      Insti_Sub_Mst_Id: this.logInfo[0].INSTI_SUB_MST_ID,
      CORPORATE_FLAG: this.Corporate_Flag,
      // VARCHAR_1: this.txnReferenceId
    };
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/GetTxnComplaintDispositions', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.DispositionItems = data.dispositions;
        if (this.DispositionItems.length == 0) {
          this.message = "No Data Found.";
          MessageBox.show(this.dialog, this.message, "");
        }
        else {
          this.DispositionItems = data.dispositions;
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }



  View() {
    if (this.txt_Fdate == undefined || this.txt_Fdate.length == 0) {
      this.message = "Select From Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.txt_Tdate == undefined || this.txt_Tdate.length == 0) {
      this.message = 'Select Upto Date.';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    var paramObj = {
      client_mst_id: this.clientMstId,
      FromDate: this.txt_Fdate,
      UpToDate: this.txt_Tdate,
      login_user_id: this.login_user_id,
      Client_Mst_Id: this.clientMstId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,

    };
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/Get_BBPS_Complaint_Data', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1.length == 0) {
          this.message = 'No Record Available.';
          MessageBox.show(this.dialog, this.message, "");
        }
        else
          this.Disp_DivData = true;
        this.Items = data.cursor1;
      }
      else {
        this.message = 'No Record Available.';
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }



  GetComplaintStatus(obj) {

    var paramObj = {
      bbps_comp_det_id: obj.BBPS_COMP_DET_ID,
      client_mst_id: this.clientMstId,
      VARCHAR_1: obj.COMPLENT_ID,
      VARCHAR_2: obj.TYPE_OF_COMPLENT,
      login_user_id: this.login_user_id,
      Client_Mst_Id: this.clientMstId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,
      //Secret_Key: this.secretKey,
      Method_Name: 'GetComplaintStatus',
      Actual_String: this.clientMstId + '~' + this.txt_Fdate + '~' + this.txt_Tdate + '~' + this.SUB_AG_MST_ID + '~' + this.BANK_REG_MST_ID + '~' + this.login_user_id + '~' + this.Insti_Sub_Mst_Id + '~' + this.Corporate_Flag + '~' + 'GetComplaintStatus'
    };
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/GetBBPSRequest', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.SaveComplaintStatus(data, obj.BBPS_COMP_DET_ID);
      }
      else {
        this.message = 'No data available.';
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  SaveComplaintStatus(data, ID) {
    var paramObj = {
      client_mst_id: this.clientMstId,
      login_user_id: this.login_user_id,
      Client_Mst_Id: this.clientMstId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Sub_Ag_Mst_Id: this.SUB_AG_MST_ID,
      // Secret_Key: this.secretKey,
      Complent_ID: (data.complaintId == undefined ? '' : data.complaintId),
      Bbps_Comp_Det_Id: ID,
      Complent_Status: (data.complaintStatus == undefined ? '' : data.complaintStatus),
      Error_Message: data.errorMessages
    };
    this.spinner.show();
    this.apiService.sendToServer<IBbps>('/api/virtualpay/BbpsComplentDetails', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.message = 'Your complaint Status is ' + paramObj.Complent_Status;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  btnClose() {
    // this.showProdList = 'show';
    this.showBankList = "hide ";
    this.showOverlay = "hide";
    this.router.navigate(['/bbps']);
    // this.disDevTab = "show";
  }




  clearPage() {
    this.txt_Fdate = this.currentDate;
    this.txt_Tdate = this.currentDate;
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
    var fullDate = new Date();
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
    var fullDate = new Date(date);
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


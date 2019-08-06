import { Component, OnInit, ViewChild,ViewChildren, QueryList } from '@angular/core';
import { DataStorage } from '../../../core/dataStorage';
import { Help } from '../../../shared/component/help/help.component';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import * as moment from 'moment';
import { ApiService } from '../../../core/api.service';
import { ILogin } from '../../../interface/login';
import { ErrorHandler } from '../../../core/errorHandler';
import { DecimalPipe } from '@angular/common';
import { Toast } from '../../../services/toast';
import { Spinner } from '../../../services/spinner';
import { IStatementOfTransaction } from '../../../interface/StatementOfTransaction';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { Service } from '../service';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
// declare let jsPDF;
import * as jsPDF from 'jspdf'; 
import 'jspdf-autotable';

@Component({
  selector: 'vgipl-ClientWiseStatement',
  templateUrl: './ClientWiseStatement.html',
  styleUrls: ['../StatementOfTransaction.scss'],
  providers: [ApiService, DecimalPipe, Spinner, Service]
})

export class ClientWiseStatementComponent implements OnInit {
  @ViewChildren(Help) helpElement: QueryList<Help>;
  @ViewChild(dtp) dtp: dtp; SetControlValue: string;
  logInfo: ILogin;
  code: number;
  msg: string = "";
  data: Array<any>;
  po_res_desc: string;
  clientMstId: number;
  VPA: string;
  amount: string;
  dob: string = '';
  Fdate: string = ''; Tdate: string = ''; TDR: number = 0; TCR: number = 0; TBAL: number = 0;

  msgshowhide: string = '';
  DisplayMsg: string = '';
  login_user_id: string;
  showOtherInfo: boolean = false;
  TCchek: boolean = true;
  Result_Data: Array<any>;
  model: any;
  Auto: any;
  Manual: any;
  isDesc: boolean = false;
  column: string = '';
  Disp_DivData: boolean = false;
  Corporateuse: boolean = false;
  option = {
    position: 'top-center',
    showClose: true,
    timeout: 5000,
    theme: 'bootstrap',
    type: 'error',
    closeOther: false,
    msg: ''
  }
  statusImage: any;
  statusMessage: any;
  business: string = '';
  merchantName: string = '';
  customerName: string = '';
  rrn: string = '';
  status: string = '';
  balance: string = '';
  tranDate: string = '';
  collMessage: string = '';
  showStatusBox = false;
  InstiSubMstId: any;
  ClientMstId: any;
  InstisubIdData: any;
  clientData: any;
  HeaderClientData: any;

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


  constructor(private apiService: ApiService, private dialog: MatDialog, private dataStorage: DataStorage, private decimalPipe: DecimalPipe,
    private errorHandler: ErrorHandler, private toast: Toast, private spinner: Spinner, public service: Service) {
    this.model = { option: 'D' };
  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.Fdate = moment(this.logInfo[0].LOGIN_DATE).format('DD/MMM/YYYY');
    this.Tdate = moment(this.logInfo[0].LOGIN_DATE).format('DD/MMM/YYYY');
    if (this.dataStorage.loginUserType === 'C') {
      this.Corporateuse = true;
      this.SearchInstiSubId();
    }
    else if (this.dataStorage.loginUserType === 'I') {
      this.Corporateuse = false;
    }
  }
  CallStatementWB() {
    if (this.Fdate == undefined || this.Fdate.toString().trim() == "") {
      // alert('Enter From Date.')
      this.message = "Enter From Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Tdate == undefined || this.Tdate.toString().trim() == "") {
      // alert('Enter Upto Date.')
      this.message = "Enter Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    var fDate, TDate;
    fDate = this.Fdate;
    TDate = this.Tdate;
    var uinput = {
      opKeyword: "CLIENTSTATMENT",
      MobileNo: this.logInfo[0].LOGIN_USER_ID,
      FromDate: fDate, UpToDate: TDate,
      Device_Id: 'D',
      Request_From: 'WB'
    }
    this.spinner.show();
    this.apiService.sendToServer<IStatementOfTransaction>('/api/statement/statementoftransaction', uinput, this).subscribe(data => {
      if (data && data.msg === 'Success') {
        this.spinner.hide();
        if (data.cursor2) {
          //this._Disphd = '_show';
          this.FormatResultData(data.cursor2);
        }
        if (data.cursor1) {
          this.HeaderClientData = data.cursor1;
        }
      }
      else {
        this.spinner.hide();
        this.option.msg = data.msg;
        this.option.type = 'error';
        this.Result_Data = null;
        this.toast.addToast(this.option);
      }
    },
      err => {
      })

  }
  CallStatementWC() {

    var fDate, TDate;
    fDate = this.Fdate;
    TDate = this.Tdate;
    var uinput = {
      Insti_Mst_Id: this.logInfo[0].INSTI_MST_ID,
      Insti_Sub_Mst_Id: this.InstiSubMstId,
      Client_Mst_ID: this.ClientMstId,
      opKeyword: "INSTISTATMENT",
      MobileNo: this.logInfo[0].LOGIN_USER_ID,
      FromDate: fDate, UpToDate: TDate,
      SumDetFlag: 'D',
      Device_Id: 'D',
      Request_From: 'WC'
    }
    this.spinner.show();
    this.apiService.sendToServer<IStatementOfTransaction>('/api/statement/InstitutionStatement', uinput, this).subscribe(data => {
      if (data && data.msg === 'Success') {
        this.spinner.hide();
        if (data.cursor2) {
          this.FormatResultData(data.cursor2);
        }
        if (data.cursor1) {
          this.HeaderClientData = data.cursor1;
        }
      }
      else {
        this.spinner.hide();
        this.option.msg = data.msg;
        this.option.type = 'error';
        this.Result_Data = null;
        this.toast.addToast(this.option);
      }
    },
      err => {
      })

  }
  validatedataWc() {
    if (this.InstiSubMstId == undefined || this.InstiSubMstId.toString().trim() == "") {
      // alert('Please Select Sub-Institute Name.')
      this.message = "Please Select Sub-Institute Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.ClientMstId == undefined || this.ClientMstId.toString().trim() == "") {
      // alert('Please Select Client Name.')
      this.message = "Please Select Client Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Fdate == undefined || this.Fdate.toString().trim() == "") {
      // alert('Enter From Date.')
      this.message = "Enter From Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Tdate == undefined || this.Tdate.toString().trim() == "") {
      // alert('Enter Upto Date.')
      this.message = "Enter Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
  }
  validateWB() {
    if (this.Fdate == undefined || this.Fdate.toString().trim() == "") {
      // alert('Enter From Date.')
      this.message = "Enter From Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Tdate == undefined || this.Tdate.toString().trim() == "") {
      // alert('Enter Upto Date.')
      this.message = "Enter Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
  }

  ShowData() {
    this.Result_Data = null;
    if (this.dataStorage.loginUserType === 'C') {
      if (this.InstiSubMstId == undefined || this.InstiSubMstId.toString().trim() == "") {
        // alert('Please Select Sub-Institute Name.')
        this.message = "Please Select Sub-Institute Name.";
        MessageBox.show(this.dialog, this.message, "");
        this.Disp_DivData = false;
        return false;
      }
      if (this.ClientMstId == undefined || this.ClientMstId.toString().trim() == "") {
        // alert('Please Select Client Name.')
        this.message = "Please Select Client Name";
        MessageBox.show(this.dialog, this.message, "");
        this.Disp_DivData = false;
        return false;
      }
      if (this.Fdate == undefined || this.Fdate.toString().trim() == "") {
        // alert('Enter From Date.')
        this.message = "Enter From Date.";
        MessageBox.show(this.dialog, this.message, "");
        this.Disp_DivData = false;
        return false;
      }
      if (this.Tdate == undefined || this.Tdate.toString().trim() == "") {
        // alert('Enter Upto Date.')
        this.message = "Enter Upto Date.";
        MessageBox.show(this.dialog, this.message, "");
        this.Disp_DivData = false;
        return false;
      }
      let frmdate = new Date(this.Fdate); let todate = new Date(this.Tdate);
      if (frmdate > todate) {
        // alert('From Date Should Be Less Than Upto Date.')
        this.message = "From Date Should Be Less Than Upto Date.";
        MessageBox.show(this.dialog, this.message, "");
        this.Disp_DivData = false;
        return false;
      }
      this.CallStatementWC();
    }
    else {
      if (this.Fdate == undefined || this.Fdate.toString().trim() == "") {
        // alert('Enter From Date.')
        this.message = "Enter From Date.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.Tdate == undefined || this.Tdate.toString().trim() == "") {
        // alert('Enter Upto Date.')
        this.message = "Enter Upto Date.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }

      let frmdate = new Date(this.Fdate); let todate = new Date(this.Tdate);
      if (frmdate > todate) {
        // alert('From Date Should Be Less Than Upto Date.');
        this.message = "From Date Should Be Less Than Upto Date.";
        MessageBox.show(this.dialog, this.message, "");
        this.Disp_DivData = false;
        return false;
      }
      this.isDesc = false;
      this.column = '';
      this.CallStatementWB();
    }
    this.Disp_DivData = true;
  }
  FormatResultData(data) {
    if (data) {
      this.TDR = 0; this.TCR = 0; this.TBAL = 0;
      this.Result_Data = data;
      for (var i = 0; i < this.Result_Data.length; i++) {
        this.TDR += parseFloat(this.Result_Data[i].DR_AMT);
        this.TCR += parseFloat(this.Result_Data[i].CR_AMT);
        //  this.TBAL += parseFloat(this.Result_Data[i].BALANCE);
      }
    }
  }
  DateTimeCtrl = function (Val1, Val2) {
    this.Call_MsgDiv('HIDE', '');
    this.SetControlValue = Val2;
    this.objdttm = {
      setoncontrol: Val2,
      mtype: Val1 == 'D' ? 'SET DATE' : 'SET TIME',
      ctrl: 'DTTMPC',
    }
    this.dtp.toggleDTTMcontrol(this.objdttm, this);
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
      if (obj.SetControlValue == 'Fdate')
        this.Fdate = obj.mydate;
      if (obj.SetControlValue == 'Tdate')
        this.Tdate = obj.mydate;
    }
  }
  export(obj, document) {

    if (document === 'PDF') {
      this.converttopdf();
    }
    if (document === 'EXCEL') {
      this.exporttoexcel(obj);
    }
  }
  spaces(x) {
    var res = '';
    while (x--) res += ' ';
    return res;
  }
  converttopdf() {
    if (this.Disp_DivData === false) {
      if (this.dataStorage.loginUserType === 'C') {
        this.validatedataWc();
        this.CallStatementWC();
      }
      else {
        this.validateWB();
        this.CallStatementWB();
      }
    }
    var imgData = 'assets/images/logo.png'
    var header1 = "";
    header1 += "Client Details" + this.spaces(85) + "Registered Bank Details" + "\n\n";
    if (this.dataStorage.loginUserType === 'C') {
      if (this.HeaderClientData) {
        header1 += "Institution Id           : " + this.logInfo[0].INSTI_MST_ID + "-" + this.logInfo[0].INSTITUTION_NAME + "\n";
        header1 += "Institution Sub Id    : " + this.HeaderClientData[0].INSTI_SUB_MST_ID.toString().substring(0, 40) + this.spaces(80) + "Bank A/c No.       : " + this.HeaderClientData[0].BANK_AC_NUMBER + "\n";
        header1 += "Institution Name     : " + this.HeaderClientData[0].SUB_INSTI_NAME.substring(0, 40) + this.spaces(71) + "Bank Name          : " + this.HeaderClientData[0].BANK_AC_NAME + "\n";
        header1 += "Client Id                 : " + this.HeaderClientData[0].CLIENT_MST_ID.toString().substring(0, 40) + this.spaces(80) + "Bank IFSC Code  : " + this.HeaderClientData[0].BANK_IFSC + "\n";
        header1 += "Name                     : " + this.HeaderClientData[0].CLIENT_NAME.substring(0, 40) + this.spaces(50 - this.HeaderClientData[0].CLIENT_NAME.length) + "\n";
        header1 += "Address                 : " + this.HeaderClientData[0].ADDRESS_1.substring(0, 40) + this.spaces(50 - this.HeaderClientData[0].ADDRESS_1.length) + "\n";
        header1 += "email                      : " + this.HeaderClientData[0].EMAIL_ID.substring(0, 40) + this.spaces(50 - this.HeaderClientData[0].EMAIL_ID.length) + " \n\n";
      }
    }
    if (this.dataStorage.loginUserType === 'I') {
      if (this.HeaderClientData) {
        header1 += "Client Id                 : " + this.HeaderClientData[0].CLIENT_MST_ID.toString().substring(0, 30) + this.spaces(70 - this.HeaderClientData[0].CLIENT_MST_ID.toString().length) + this.spaces(6) + "Bank A/c No.      : " + this.HeaderClientData[0].BANK_AC_NUMBER + "\n";
        header1 += "Name                     : " + this.HeaderClientData[0].CLIENT_NAME.substring(0, 30) + this.spaces(68 - this.HeaderClientData[0].CLIENT_NAME.length) + "Bank Name        : " + this.HeaderClientData[0].BANK_AC_NAME + "\n";
        header1 += "Address                 : " + this.HeaderClientData[0].ADDRESS_1.substring(0, 30) + this.spaces(70 - this.HeaderClientData[0].ADDRESS_1.length) + this.spaces(5) + "" + "Bank IFSC Code : " + this.HeaderClientData[0].BANK_IFSC + "\n";
        header1 += "email                      : " + this.HeaderClientData[0].EMAIL_ID + this.spaces(70 - this.HeaderClientData[0].EMAIL_ID.length) + this.spaces(5) + "  " + " \n\n";
      }
    }
    header1 += "ClientWise Statement " + " From Date    : " + moment(this.Fdate).format('DD/MMM/YYYY') + "  Upto Date : " + moment(this.Tdate).format('DD/MMM/YYYY') + "";
    var item1 = this.Result_Data;
    var doc = new jsPDF();
    var img = new Image();
    img.src = 'assets/images/logo.png';
    var col = ["Transaction " + "\n" + "Date ", "Particulars  ", "Debit  ", " Credit  ", " Balance "];
    var rows = []; var credit = ''; var Debit = ''; doc.setFontSize(10);
    var footer = []; this.TDR = 0; this.TCR = 0; this.TBAL = 0;
    for (var i = 0; i < item1.length; i++) {
      if (this.decimalPipe.transform(item1[i]["DR_AMT"], '1.2') === null)
        Debit = "0.00";
      else
        Debit = this.decimalPipe.transform(item1[i]["DR_AMT"], '1.2');
      if (this.decimalPipe.transform(item1[i]["CR_AMT"], '1.2') === null)
        credit = this.decimalPipe.transform("0.00", '1.2');
      else
        credit = this.decimalPipe.transform(item1[i]["CR_AMT"], '1.2');
      this.TDR += parseFloat(item1[i].DR_AMT);
      this.TCR += parseFloat(item1[i].CR_AMT);
      // this.TBAL += parseFloat(item1[i].BALANCE);
      var temp = [moment(item1[i]["TRAN_DATE"]).format('DD/MMM/YYYY') + "\n" + moment(item1[i]["TRAN_DATE"]).format('hh:mm:ss') + "  ", item1[i]["PARTICULARS"] + "", Debit + "", credit + "", this.decimalPipe.transform(item1[i]["BALANCE"], '1.2')];
      rows.push(temp);
    }
    var temp2 = [" ", " Total :      ", this.decimalPipe.transform(this.TDR, '1.2') + "", this.decimalPipe.transform(this.TCR, '1.2') + "", ""];
    rows.push(temp2);
    var marginY = 10;
    if (this.dataStorage.loginUserType === 'C')
      marginY = 80;
    else
      marginY = 70;
    img.onload = function () {
      doc.addImage(img, 90, 10, 15, 15);
      //Font Size
      doc.setFontSize(10);
      doc.text(header1, 15, 35)
      doc.setFontSize(8);

      // doc.margin = { top: 60 },
      // doc.autoTable(col, rows);
      doc.autoTable(col, rows, {
        startY: marginY,
        styles: { // Defaul style
          lineWidth: 0.001,
          lineColor: 0,
          fillStyle: 'DF',
          halign: 'center',
          valign: 'middle',
          textColor: 20,
          columnWidth: 'auto',
          overflow: 'linebreak', cellWidth: 'auto',
          fontSize: 8,
        },
        // drawHeaderRow: function(header1, data) {
        //  // header1.height = 46;
        // },
      });
      doc.save('Clientwisestatement.pdf');
    };
  }
  exporttoexcel(obj) {
    var header1 = "";
    header1 += "Client Details" + this.spaces(85) + "Registered Bank Details" + "\n\n";
    if (this.dataStorage.loginUserType === 'C') {
      if (this.HeaderClientData) {
        header1 += "Institution Id          : " + this.logInfo[0].INSTI_MST_ID + this.spaces(5) + "-" + this.logInfo[0].INSTITUTION_NAME + "\n";
        header1 += "Institution Sub Id  : " + this.HeaderClientData[0].INSTI_SUB_MST_ID.toString().substring(0, 30) + this.spaces(70 - this.HeaderClientData[0].INSTI_SUB_MST_ID.toString().length) + this.spaces(5) + "Bank A/c No.       : " + this.HeaderClientData[0].BANK_AC_NUMBER + "\n";
        header1 += "Institution Name   : " + this.HeaderClientData[0].SUB_INSTI_NAME.substring(0, 30) + this.spaces(68 - this.HeaderClientData[0].SUB_INSTI_NAME.length) + this.spaces(6) + "Bank Name       : " + this.HeaderClientData[0].BANK_AC_NAME + "\n";
        header1 += "Client Id                    : " + this.HeaderClientData[0].CLIENT_MST_ID.toString().substring(0, 30) + this.spaces(70 - this.HeaderClientData[0].CLIENT_MST_ID.toString().length) + this.spaces(6) + "Bank IFSC Code  : " + this.HeaderClientData[0].BANK_IFSC + "\n";
        header1 += "Name                        : " + this.HeaderClientData[0].CLIENT_NAME.substring(0, 30) + this.spaces(70 - this.HeaderClientData[0].CLIENT_NAME.length) + "\n";
        header1 += "Address                    : " + this.HeaderClientData[0].ADDRESS_1.substring(0, 30) + this.spaces(70 - this.HeaderClientData[0].ADDRESS_1.length) + this.spaces(5) + "" + "\n";
        header1 += "email                       : " + this.HeaderClientData[0].EMAIL_ID + this.spaces(70 - this.HeaderClientData[0].EMAIL_ID.length) + this.spaces(5) + "  " + " \n\n";
      }
    }
    if (this.dataStorage.loginUserType === 'I') {
      if (this.HeaderClientData) {
        header1 += "Client Id                : " + this.HeaderClientData[0].CLIENT_MST_ID.toString().substring(0, 30) + this.spaces(70 - this.HeaderClientData[0].CLIENT_MST_ID.toString().length) + this.spaces(5) + "Bank A/c No.      : " + this.HeaderClientData[0].BANK_AC_NUMBER + "\n";
        header1 += "Name                     : " + this.HeaderClientData[0].CLIENT_NAME.substring(0, 30) + this.spaces(58 - this.HeaderClientData[0].CLIENT_NAME.length) + "Bank Name        : " + this.HeaderClientData[0].BANK_AC_NAME + "\n";
        header1 += "Address                : " + this.HeaderClientData[0].ADDRESS_1.substring(0, 30) + this.spaces(70 - this.HeaderClientData[0].ADDRESS_1.length) + this.spaces(5) + "" + "Bank IFSC Code : " + this.HeaderClientData[0].BANK_IFSC + "\n";
        header1 += "email                     : " + this.HeaderClientData[0].EMAIL_ID + this.spaces(70 - this.HeaderClientData[0].EMAIL_ID.length) + this.spaces(5) + "  " + " \n\n";
      }
    }
    header1 += "ClientWise Statement " + " From Date    : " + moment(this.Fdate).format('DD/MMM/YYYY') + " Upto Date : " + moment(this.Tdate).format('DD/MMM/YYYY') + "\n";
    header1.fontsize(11);
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false,
      showTitle: true,
      showfooter: false,
      title: header1,
    };
    var Rdata = this.Result_Data;
    var col = ["Transaction Date", "Particular", "Debit", "Credit", "Balance"];
    var footer1 = []; var footer2 = []; this.TDR = 0; this.TCR = 0;
    var rows = [];
    var temp = [];
    rows.push(col);

    for (var i = 0; i < Rdata.length; i++) {
      var dateparticular = ''; var particular = ''; var amount; var cramt = ''; var dramt = ''; var balance = ''
      dateparticular = moment(Rdata[i].TRAN_DATE).format('DD/MMM/YYYY') + "\n" + moment(Rdata[i]["TRAN_DATE"]).format('hh:mm:ss');
      particular = Rdata[i].PARTICULARS;
      cramt = this.decimalPipe.transform(Rdata[i].CR_AMT, '1.2');
      dramt = this.decimalPipe.transform(Rdata[i].DR_AMT, '1.2');
      amount = this.decimalPipe.transform(Rdata[i].BALANCE, '1.2');
      this.TDR += parseFloat(Rdata[i].DR_AMT);
      this.TCR += parseFloat(Rdata[i].CR_AMT);
      temp = [dateparticular, particular, dramt, cramt, amount];
      rows.push(temp)
    }
    footer1 = ["    ", " Total :  ", this.decimalPipe.transform(this.TDR, '1.2') + "", this.decimalPipe.transform(this.TCR, '1.2') + "", ""];
    rows.push(footer1);
    footer2 = ["*** END OF STATEMENT-Vpay."];
    rows.push(footer2);

    new Angular2Csv(rows, 'CLientWise Statement', options);
  }


  sort(property) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    let direction = this.isDesc ? 1 : -1;
    this.Result_Data.sort(function (a, b) {
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


  SearchInstiSubId() {
    this.spinner.show();
    var uinput = {
      userid: this.dataStorage.logInfo[0].LOGIN_USER_ID,
      keyword: 'INSTISUBADMIN' + '~' + this.dataStorage.logInfo[0].INSTI_MST_ID + '~' + this.dataStorage.logInfo[0].CLIENT_MST_ID,
      device_id: 'Desktop',
    }
    this.service.Search(uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1) {
          this.InstisubIdData = data.cursor1;
          if (this.InstisubIdData) {
            this.InstiSubMstId = this.InstisubIdData[0].KEY;
            this.SearchClient();
          }
          else {
            this.InstiSubMstId = "";
            this.ClientMstId = "";
            this.clientData = null;
          }
          this.Disp_DivData = false;
        }
        else {
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('ClientwiseStatement ')
    );
  }
  SearchClient() {
    this.spinner.show();
    var uinput = {
      userid: this.dataStorage.logInfo[0].LOGIN_USER_ID,
      keyword: 'INSTISUBCLIENT' + '~' + this.InstiSubMstId,
      device_id: 'Desktop',
    }
    this.service.Search(uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1) {
          this.clientData = data.cursor1;
          if (this.clientData.length > 0)
            this.ClientMstId = this.clientData[0].CLIENT_MST_ID;
          else
            this.ClientMstId = "";
        }
        else {
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('ClientwiseStatement')
    );
  }
  getclientid() {
    this.SearchClient();
    this.Disp_DivData = false;
  }
  ChangeClientId() {
    this.Result_Data = null;
    this.Disp_DivData = false;
  }

}
import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DataStorage } from '../../../core/dataStorage';
import { Help } from '../../../shared/component/help/help.component';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import * as moment from 'moment';
import { ApiService } from '../../../core/api.service';
import { ILogin } from '../../../interface/login';
import { ErrorHandler } from '../../../core/errorHandler';
import { Toast } from '../../../services/toast';
import { Spinner } from '../../../services/spinner';
import { IStatementOfTransaction } from '../../../interface/StatementOfTransaction';
import { DecimalPipe } from '@angular/common';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { Service } from '../service';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
import * as jsPDF from 'jspdf'; 
import 'jspdf-autotable';
// declare let jsPDF;

@Component({
  selector: 'vgipl-SubInstitutionWiseState',
  templateUrl: './SubInstitutionWiseState.html',
  styleUrls: ['../StatementOfTransaction.scss'],
  providers: [ApiService, DecimalPipe, Spinner, Service]
})

export class SubInstitutionWiseStateComponent implements OnInit {
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
  InstiSubMstId: any;
  InstisubIdData: any;
  msgshowhide: string = '';
  Fdate: string = ''; Tdate: string = ''; TDR: number = 0; TCR: number = 0;
  DisplayMsg: string = '';
  login_user_id: string;
  Result_Data: Array<any>;
  Result_Data1: Array<any>;
  model: any;
  Auto: any;
  Manual: any;
  isDesc: boolean = false;
  column: string = '';
  Disp_DivData: boolean = false;
  Disp_SumData: boolean = false;
  HeaderClientData: any;
  showOtherInfo: boolean = false;
  TCchek: boolean = true;
  showAadharInstallInfo: boolean = true;
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
    this.SearchInstiSubId();
  }


  SearchInstiSubId() {
    this.spinner.show();
    var uinput = {
      userid: this.dataStorage.logInfo[0].LOGIN_USER_ID,
      keyword: 'INSTISUBADMIN' + '~' + this.dataStorage.logInfo[0].INSTI_MST_ID + '~' + this.dataStorage.logInfo[0].CLIENT_MST_ID,
      //keyword: 'INSTISUBCHILD' + '~' + this.dataStorage.logInfo[0].INSTI_MST_ID,
      device_id: 'Desktop',
    }
    this.service.Search(uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1) {
          this.InstisubIdData = data.cursor1;
          this.InstiSubMstId = this.InstisubIdData[0].KEY;
        }
        else {
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('SubinstiwiseStatement ')
    );
  }
  CallStatement() {
    if (this.InstiSubMstId == undefined || this.InstiSubMstId.toString().trim() == "") {
      this.message = "Please Select Sub-Institute Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Fdate == undefined || this.Fdate.toString().trim() == "") {
      this.message = "Enter From Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Tdate == undefined || this.Tdate.toString().trim() == "") {
      this.message = "Enter Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    var fDate, TDate;
    fDate = this.Fdate;
    TDate = this.Tdate;
    var uinput = {
      Insti_Mst_Id: this.logInfo[0].INSTI_MST_ID,
      Insti_Sub_Mst_Id: this.InstiSubMstId,
      Client_Mst_ID: 0,
      opKeyword: "INSTISTATMENT",
      MobileNo: this.logInfo[0].LOGIN_USER_ID,
      FromDate: fDate, UpToDate: TDate,
      SumDetFlag: this.model.option,
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

  validateData() {
    if (this.Fdate == undefined || this.Fdate.toString().trim() == "") {
      this.message = "Enter From Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Tdate == undefined || this.Tdate.toString().trim() == "") {
      this.message = "Enter Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Fdate > this.Tdate) {
      this.message = "From Date Should Be Less Than Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
  }
  ShowData() {
    if (this.Fdate == undefined || this.Fdate.toString().trim() == "") {
      this.message = "Enter From Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Tdate == undefined || this.Tdate.toString().trim() == "") {
      this.message = "Enter Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    let frmdate = new Date(this.Fdate); let todate = new Date(this.Tdate);
    if (frmdate > todate) {
      this.message = "From Date Should Be Less Than Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      this.Disp_DivData = false;
      return false;
    }
    this.isDesc = false;
    this.column = '';
    this.CallStatement();
  }
  FormatResultData(data) {
    if (data) {
      if (this.model.option === 'D') {
        this.Result_Data = data;
        this.TDR = 0; this.TCR = 0;
        for (var i = 0; i < this.Result_Data.length; i++) {
          this.TDR += parseFloat(this.Result_Data[i].DR_AMT);
          this.TCR += parseFloat(this.Result_Data[i].CR_AMT);
          //  this.TBAL += parseFloat(this.Result_Data[i].BALANCE);
        }
        this.Disp_DivData = true;
        this.Disp_SumData = false
      }
      else if (this.model.option === 'S') {
        this.Result_Data1 = data;
        this.TDR = 0; this.TCR = 0;
        for (var i = 0; i < this.Result_Data1.length; i++) {
          this.TDR += parseFloat(this.Result_Data1[i].DR_AMT);
          this.TCR += parseFloat(this.Result_Data1[i].CR_AMT);
          //  this.TBAL += parseFloat(this.Result_Data1[i].BALANCE);
        }
        this.Disp_DivData = false;
        this.Disp_SumData = true;
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
  cleardata() {
    this.Disp_DivData = false;
    this.Disp_SumData = false
  }
  export(obj, document) {
    if (this.InstiSubMstId == undefined || this.InstiSubMstId.toString().trim() == "") {
      this.message = "Please Select Sub-Institute Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Fdate == undefined || this.Fdate.toString().trim() == "") {
      this.message = "Enter From Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.Tdate == undefined || this.Tdate.toString().trim() == "") {
      this.message = "Enter Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
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
    var imgData = 'assets/images/logo.png'
    var header1 = "Client Details" + "                                                                        " + "\n";
    if (this.HeaderClientData) {
      header1 += "Institution Id          : " + this.logInfo[0].INSTI_MST_ID + this.spaces(5) + "-" + this.logInfo[0].INSTITUTION_NAME + "\n";
      header1 += "Address                : " + this.HeaderClientData[0].ADDRESS_1.substring(0, 30) + this.spaces(70 - this.HeaderClientData[0].ADDRESS_1.length) + this.spaces(5) + "" + "\n";
      header1 += "email                     : " + this.HeaderClientData[0].EMAIL_ID + this.spaces(70 - this.HeaderClientData[0].EMAIL_ID.length) + this.spaces(5) + "  " + " \n\n";
    }
    header1 += "Sub Institution Wise Statement " + " From Date    : " + moment(this.Fdate).format('DD/MMM/YYYY') + " Upto Date : " + moment(this.Tdate).format('DD/MMM/YYYY') + "\n";

    var doc = new jsPDF();
    var img = new Image();
    img.src = 'assets/images/logo.png';
    if (this.model.option === 'D') {
      var item1 = this.Result_Data;
      var col = ["Transaction " + "\n" + "Date ", "Particulars  ", "Debit  ", " Credit ", " Balance ", "Client Id"];
      var rows = []; var credit = ''; var Debit = ''; doc.setFontSize(10);
      this.TDR = 0; this.TCR = 0;
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
        var temp = [moment(item1[i]["TRAN_DATE"]).format('DD/MMM/YYYY') + "\n" + moment(item1[i]["TRAN_DATE"]).format('hh:mm:ss') + "  ", item1[i]["PARTICULARS"] + "", Debit + "", credit + "", this.decimalPipe.transform(item1[i]["BALANCE"], '1.2'), item1[i]["CLIENT_MST_ID"] + "-" + item1[i]["CLIENT_NAME"]];
        rows.push(temp);
      }
      var temp2 = [" ", " Total :      ", this.decimalPipe.transform(this.TDR, '1.2') + "", this.decimalPipe.transform(this.TCR, '1.2') + "", ""];
      rows.push(temp2);
    }
    if (this.model.option === 'S') {
      var item1 = this.Result_Data1;
      var col = ["Transaction Date ", "Debit  ", " Credit  ", " Balance "];
      var rows = []; var credit = ''; var Debit = ''; doc.setFontSize(10);
      this.TDR = 0; this.TCR = 0;
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
        var temp1 = [moment(item1[i]["TRAN_DATE"]).format('DD/MMM/YYYY') + "  ", Debit + "", credit + "", this.decimalPipe.transform(item1[i]["BALANCE"], '1.2')];
        rows.push(temp1);
      }
      var temp2 = [" Total :      " + "  ", this.decimalPipe.transform(this.TDR, '1.2') + "", this.decimalPipe.transform(this.TCR, '1.2') + "", ""];
      rows.push(temp2);
    }
    img.onload = function () {
      doc.addImage(img, 100, 10, 15, 15);
      //Font Size
      doc.setFontSize(10);
      doc.text(header1, 15, 35)
      doc.setFontSize(8);
      // doc.margin = { top: 60 },
      // doc.autoTable(col, rows);
      doc.autoTable(col, rows, {
        startY: 60,
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
      doc.save('SubinstiwiseStatement.pdf');
    };
  }
  exporttoexcel(obj) {
    var header1 = "Client Details" + "\n\n";
    if (this.HeaderClientData) {
      header1 += "Institution Id       : " + this.logInfo[0].INSTI_MST_ID + this.spaces(5) + "-" + this.logInfo[0].INSTITUTION_NAME + "\n";
      header1 += "Address                : " + this.HeaderClientData[0].ADDRESS_1.substring(0, 30) + this.spaces(70 - this.HeaderClientData[0].ADDRESS_1.length) + this.spaces(5) + "" + "\n";
      header1 += "email                     : " + this.HeaderClientData[0].EMAIL_ID + this.spaces(70 - this.HeaderClientData[0].EMAIL_ID.length) + this.spaces(5) + "  " + " \n\n";
    }
    header1 += "Sub InstitutionWise Statement " + " From Date    : " + moment(this.Fdate).format('DD/MMM/YYYY') + "  Upto Date : " + moment(this.Tdate).format('DD/MMM/YYYY') + "\n";
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
    if (this.model.option === 'D') {
      var Rdata = this.Result_Data;
      var col = ["Transaction Date", "Particular", "Debit", "Credit", "Balance", "Client Id"];
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
        temp = [dateparticular, particular, dramt, cramt, amount, Rdata[i].CLIENT_MST_ID];
        rows.push(temp)
      }
      footer1 = ["      ", " Total :  ", this.decimalPipe.transform(this.TDR, '1.2') + "", this.decimalPipe.transform(this.TCR, '1.2') + "", ""];
      rows.push(footer1);
    }
    if (this.model.option === 'S') {
      var Rdata = this.Result_Data1;
      var col = ["Transaction Date", "Debit", "Credit", "Balance"];
      var footer1 = []; var footer2 = []; this.TDR = 0; this.TCR = 0;
      var rows = [];
      var temp = [];
      rows.push(col);

      for (var i = 0; i < Rdata.length; i++) {
        var dateparticular = ''; var particular = ''; var amount; var cramt = ''; var dramt = ''; var balance = ''
        dateparticular = moment(Rdata[i].TRAN_DATE).format('DD/MMM/YYYY') + "\n" + moment(Rdata[i]["TRAN_DATE"]).format('hh:mm:ss');
        cramt = this.decimalPipe.transform(Rdata[i].CR_AMT, '1.2');
        dramt = this.decimalPipe.transform(Rdata[i].DR_AMT, '1.2');
        amount = this.decimalPipe.transform(Rdata[i].BALANCE, '1.2');
        this.TDR += parseFloat(Rdata[i].DR_AMT);
        this.TCR += parseFloat(Rdata[i].CR_AMT);
        temp = [dateparticular, dramt, cramt, amount];
        rows.push(temp)
      }
      footer1 = [" Total :      ", this.decimalPipe.transform(this.TDR, '1.2') + "", this.decimalPipe.transform(this.TCR, '1.2') + "", ""];
      rows.push(footer1);
    }

    footer2 = ["*** END OF STATEMENT-Vpay."];
    rows.push(footer2);

    new Angular2Csv(rows, 'SubInstitutionWiseStatement', options);
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
  sort1(property) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    let direction = this.isDesc ? 1 : -1;
    this.Result_Data1.sort(function (a, b) {
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

  getclientid() {

  }
}
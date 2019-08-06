import { Component, ViewChild, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { IStatement } from '../../../interface/statement';
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { Toast } from '../../../services/toast';
import { Spinner } from '../../../services/spinner';
import { ErrorHandler } from '../../../core/errorHandler';
import { Common } from '../../../services/common';
import { MatDialog } from "@angular/material";
import { MessageBox } from "../../../services/_shared/message-box";

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as $ from 'jquery';
// declare let jsPDF;
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
@Component({
  selector: 'app-transactionStatus',
  styleUrls: ['./../statement.scss'],
  templateUrl: './transactionStatus.html',
  providers: [ApiService, DecimalPipe, Spinner]
})

export class TransactionStatusComponent implements OnInit {
  fDate: Date = new Date();
  tDate: Date = new Date();
  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  TransactionStatus: boolean = false;
  mobileNo: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('Paginator1', { read: MatPaginator }) Paginator1: MatPaginator;
  @ViewChild('Paginator2', { read: MatPaginator }) Paginator2: MatPaginator;
  @ViewChild('Paginator3', { read: MatPaginator }) Paginator3: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sort1') sort1: MatSort;
  @ViewChild('sort2') sort2: MatSort;
  @ViewChild('sort3') sort3: MatSort;
  flag: string = "";
  recFlag: string = "";
  gateway: string = "0";
  firstReq: boolean = false;
  msgType: string = '';
  tranTable: string = 'hide';
  code: number; msg: string; data: Array<any>; cursor1: Array<any>;
  msgshowhide: string; DisplayMsg: string = '';
  // @ViewChild(dtp) dtp: dtp;
   SetControlValue: string; _gatewaydetid: number = 0;
  divR: string; divP: string; divN: string; divF: string; _Disphd: string;
  Result_Data: Array<any>; GatewayList: Array<any>;
  txt_Fdate: any; txt_Tdate: any; txt_FromAmount: string; txt_ToAmount: string;
  logInfo: ILogin;
  // totalBalance: number;
  myRadio: any;
  curDate: any;
  rtgsRow: boolean = false;
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

  //dialog
  message;
  
  displayedColumns: string[] = ['TRAN_DATE', 'PARTICULARS', 'TRANSAMT'];
  dataSource: MatTableDataSource<StatementData>;
  dataSource1: MatTableDataSource<StatementData>;
  dataSource2: MatTableDataSource<StatementData>;
  dataSource3: MatTableDataSource<StatementData>;
  constructor(private apiService: ApiService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private dp: DecimalPipe,
    private dataStorage: DataStorage, private errorHandler: ErrorHandler, private toast: Toast, private spinner: Spinner, private common: Common) {
    this.divR = this.divP = this.divN = this.divF = 'filterdiv'; this._Disphd = '_hide';
    this.msgshowhide = '_hide'; this.DisplayMsg = '';
    // this.txt_Fdate = "01/Jan/2017"; this.txt_Tdate = "31/Dec/2017";
    // this.txt_Fdate = ""; this.txt_Tdate = "";
    this.txt_Fdate = this.fDate; this.txt_Tdate = this.tDate;
    this.txt_FromAmount = "0"; this.txt_ToAmount = "99999";
  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.mobileNo = this.dataStorage.logInfo[0].LOGIN_USER_ID
    let currDate = moment(this.logInfo[0].LOGIN_DATE).format('MMMM/YYYY');
    this.curDate = currDate.split('/');
    this.Get_GatewayList();
    this.getcurrentDate();
    this.flag = "S";
    this.recFlag = "R";
    this.firstReq = true;

    

    if (this.route.queryParams["_value"].ID != null) {
      this._gatewaydetid = this.route.queryParams["_value"].ID;
      this.gateway = this.route.queryParams["_value"].ID;
      // console.log(this._gatewaydetid);
      this.CallStatement('R', '', this.txt_Fdate, this.txt_Tdate);

    } else
      this.CallStatement('R', 'T', this.txt_Fdate, this.txt_Tdate);


  }

  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "23", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }
  //get selected duration statement
  getStatement() {
    var date = new Date();
    let currDate = moment(date).format('DD/MMM/YYYY');
    //this.curDate = currDate.split('/');
    this.txt_Fdate = currDate;
    //this.CallStatement('A','T');
    var selectDate = $('#checkDate').val();
    // console.log(selectDate);

    if (selectDate == 'l') {
      this.getoneDate(0, 0);
      this.CallStatement('A', 'T', this.txt_Fdate, this.txt_Tdate);
    }
    if (selectDate == 'w') {
      this.getoneDate(7, 1);
      this.CallStatement(this.gateway, '', this.txt_Fdate, this.txt_Tdate);
    }
    if (selectDate == 'hm') {
      this.getDate(15, 1);
      this.CallStatement('A', '', this.txt_Fdate, this.txt_Tdate);
    }
    if (selectDate == 'm') {
      this.getDate(1, 0);
      this.CallStatement('A', '', this.txt_Fdate, this.txt_Tdate);
    }
    if (selectDate == 'qm') {
      this.getDate(3, 0);
      this.CallStatement('A', '', this.txt_Fdate, this.txt_Tdate);
    }

    if (selectDate == 'sd') {
      $('.sfd').show();
      this.Reset();
    }
    else {
      $('.sfd').hide();
    }
  }

  Reset() {
    this.Result_Data = null; this._Disphd = '_hide';
    this.dataSource = null;
    this.dataSource1 = null;
    this.dataSource2 = null;
    this.dataSource3 = null;
    this.txt_Fdate = new Date(this.txt_Fdate);
    this.txt_Tdate = new Date(this.txt_Tdate);
  }

 
  Filter(arg1) {
    this.rtgsRow = false;
    if (arg1 == "R") {
      this.flag = "S"
      this.recFlag = "R";
      this.CallStatement('S', 'N', this.txt_Fdate, this.txt_Tdate);
    } else if (arg1 == "P") {
      this.flag = "S"
      this.recFlag = "P";
      this.rtgsRow = true;
      this.CallStatement('P', 'N', this.txt_Fdate, this.txt_Tdate);
    } else if (arg1 == "N") {
      this.flag = "F"
      this.recFlag = "P";
      this.CallStatement('P', 'N', this.txt_Fdate, this.txt_Tdate);
    }
    else {
      this.flag = "F"
      this.recFlag = "F";
      this.CallStatement('F', 'N', this.txt_Fdate, this.txt_Tdate);

    }
  }

  FormatResultData(data) {
    if (data) {
      for (var i = 0; i <= data.length - 1; i++) {
        data[i].TRAN_DATE = data[i].TRAN_DATE.replace("T", " ").substring(0, 19);
        data[i].PARTICULARS = data[i].PARTICULARS;
        // data[i].GATEWAY_TYPE = data[i].GATEWAY_TYPE;
        data[i].TRANSAMT = data[i].TRANSAMT.toFixed(2);
        if (data[i].DBCR === "CR") {
          data[i].crdrcolor = 'credit';
        }
        else {
          data[i].crdrcolor = 'debit';
        }
      }
      this.Result_Data = data;
      this.tranTable = 'show';
      this.dataSource = new MatTableDataSource(data);
      this.dataSource1 = new MatTableDataSource(data);
      this.dataSource2 = new MatTableDataSource(data);
      this.dataSource3 = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource1.paginator = this.Paginator1;
      this.dataSource2.paginator = this.Paginator2;
      this.dataSource3.paginator = this.Paginator3;
      this.dataSource.sort = this.sort;
      this.dataSource1.sort = this.sort1;
      this.dataSource2.sort = this.sort2;
      this.dataSource3.sort = this.sort3;
    }
    this.txt_Fdate = new Date(this.txt_Fdate);
    this.txt_Tdate = new Date(this.txt_Tdate);

  }

  CSS_SelectedFilter(filter) {
    // this.Call_MsgDiv('HIDE', '');
    if (filter == 'R')
      this.divR = 'Sfilterdiv';
    if (filter == 'P')
      this.divP = 'Sfilterdiv';
    if (filter == 'N')
      this.divN = 'Sfilterdiv';
    if (filter == 'F')
      this.divF = 'Sfilterdiv';

  }

  Get_GatewayList() {
    this.spinner.show();
    var uinput = {
      opKeyword: "HELP",
      userid: 1,
      keyword: 'GM',
      device_id: 'D',
    }
    this.apiService.sendToServer<IStatement>('/api/statement/gatewaylist', uinput, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg !== 'Success') {
      }
      if (data && data.msg === 'Success') {
        this.GatewayList = data.cursor1;
      }
      else {
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })

  }

  onGatewaySelect(event) {
    this.Reset();
    this._gatewaydetid = 0;
    if (event) {
      this._gatewaydetid = parseInt(event);
      this.CallStatement(this.gateway, '', this.txt_Fdate, this.txt_Tdate)
      // if (parseInt(event) > 0) {

      // }
    }
  }

  CallStatement(pflag, tTen_flag, fDate, TDate) {
    var selectDate1 = $('#checkDate').val();
    if (selectDate1 == 'l') {
      tTen_flag = 'T';
    }
    this.CSS_SelectedFilter(pflag);
    this.Reset();

    // var fDate,TDate;
    if (tTen_flag == 'T') {
      fDate = '';
      TDate = '';
    }
    else {
      fDate = fDate;
      TDate = TDate;
    }
    this.spinner.show();
    var uinput = {
      opKeyword: "STATEMENT",
      client_mst_id: this.logInfo[0].CLIENT_MST_ID,
      Insti_Sub_Mst_Id: this.logInfo[0].INSTI_SUB_MST_ID,
      User_Flag: this.logInfo[0].User_Flag,
      gateway_mst_id: this._gatewaydetid,
      fromdate: fDate, uptodate: TDate,
      fromamt: this.txt_FromAmount, uptoamt: this.txt_ToAmount,
      flag: this.flag,
      recpayflag: this.recFlag,
      device_id: 'D',
    }
    // console.log(uinput);
    this.apiService.sendToServer<IStatement>('/api/statement/cstatement', uinput, this).subscribe(data => {
      // if (data && data.msg !== 'Success') {
      //   //this.Call_MsgDiv('SHOW',data.msg);

      // }
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        if (data.data) {
          this._Disphd = '_show';
          this.FormatResultData(data.data);
        }
      }
      else {
        if (this.firstReq) {
          this.firstReq = true;
          return false;
        } else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
        }

        //this.option.msg = data.msg;
        //this.option.type ='error';
        this.Result_Data = null;
        //this.toast.addToast(this.option);
      }
    },
      err => {
        this.spinner.hide();
        // console.log(err);
        this.errorHandler.handlePageError(err);
      })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  Submit() {
    // if (this.SetValue2(this))
    //   this.CallStatement('A', 'A', this.txt_Fdate, this.txt_Tdate);
    // else
    //   return false;
    this.txt_Fdate = moment(this.txt_Fdate).format("DD/MMM/YYYY");
    this.txt_Tdate = moment(this.txt_Tdate).format("DD/MMM/YYYY");
    if (this.txt_Fdate == '' || this.txt_Fdate == undefined || this.txt_Fdate == null) {
      this.message = 'select From Date';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.txt_Tdate == '' || this.txt_Tdate == undefined || this.txt_Tdate == null) {
      this.message = 'select To Date';
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.SetValue2(this)) {
      if (this.txt_Fdate == '' || this.txt_Fdate == undefined || this.txt_Fdate == null) {
        this.message = 'select From Date';
        MessageBox.show(this.dialog, this.message, "");
        return;
      } else
        this.CallStatement('A', 'A', this.txt_Fdate, this.txt_Tdate);
      // alert('run');
    }
    else
      return false;
  }

  export(obj, document) {
    if (document === 'PDF') {
      this.converttopdf(obj);

    }
    if (document === 'EXCEL') {
      this.exporttoexcel(obj);
    }
  }

  exporttoexcel(obj) {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false,
      showTitle: true,
      showfooter: false,
      title: "Merchant Statement  From " + moment(this.txt_FromAmount).format('DD-MMM-YYYY') + " To " + moment(this.txt_ToAmount).format('DD-MMM-YYYY'),
    };

    debugger;
    var Rdata = this.Result_Data;
    var col = ["Date/Particulars", "Amount"];
    var footer1 = []; var footer2 = [];
    var rows = [];
    var temp = [];
    rows.push(col);

    for (var i = 0; i < Rdata.length; i++) {
      var dateparticular = ''; var amount; var crdr = '';
      dateparticular += Rdata[i].TRAN_DATE;
      if (Rdata[i].PARTICULARS)
        dateparticular += Rdata[i].PARTICULARS;
      amount = this.dp.transform(Rdata[i].TRANSAMT, '1.2');
      crdr = Rdata[i].DBCR;
      temp = [dateparticular, amount, crdr];
      rows.push(temp)
    }

    footer1 = [" "];
    rows.push(footer1);
    footer2 = ["*** END OF STATEMENT- from Internet Banking."];
    rows.push(footer2);

    new Angular2Csv(rows, 'Merchant Statement', options);
  }

  
  converttopdf(obj) {
    var imgData = 'assets/images/VPay.png';
    var header1 = "";
    // header1 += "Client Details" + this.spaces(85) + "Registered Bank Details" + "\n\n";
    header1 += "Transaction Status" + "\n\n";

    if (this.logInfo[0]) {
      obj.txt_Fdate = moment(obj.txt_Fdate).format("DD/MMM/YYYY");
      obj.txt_Tdate = moment(obj.txt_Tdate).format("DD/MMM/YYYY");
      header1 += "Merchant Name : " + this.logInfo[0].CLIENT_NAME + "" + "\n";
      header1 += "Between Period : " + obj.txt_Fdate + ' To ' + obj.txt_Tdate + "" + "\n";
      header1 += "Between Amount : " + obj.txt_FromAmount + ' To ' + obj.txt_ToAmount + "" + "\n";
      var date;
      date = moment(this.logInfo[0].LOGIN_DATE).format('DD/MMM/YYYY');
      header1 += "Statement Date : " + date + "\n";
    }

    var item1 = this.Result_Data;
    var doc = new jsPDF();
    var img = new Image();
    img.src = 'assets/images/VPay.png';
    var col = ["Transaction " + "\n" + "Date ", "Particulars  ", " Amount ", " CR/DR "];
    var rows = []; var credit = ''; var Debit = ''; doc.setFontSize(10);
    var PaymentMode = '';
    // var footer = []; this.TDR = 0; this.TCR = 0; this.TBAL = 0;
    for (var i = 0; i < item1.length; i++) {
      // if (this.decimalPipe.transform(item1[i]["DR_AMT"], '1.2') === null)
      //   Debit = "0.00";
      // else
      //   Debit = this.decimalPipe.transform(item1[i]["DR_AMT"], '1.2');
      // if (this.decimalPipe.transform(item1[i]["CR_AMT"], '1.2') === null)
      //   credit = this.decimalPipe.transform("0.00", '1.2');
      // else
      //   credit = this.decimalPipe.transform(item1[i]["CR_AMT"], '1.2');
      // this.TDR += parseFloat(item1[i].DR_AMT);
      // this.TCR += parseFloat(item1[i].CR_AMT);
      // this.TBAL += parseFloat(item1[i].BALANCE);
     
      var temp = [moment(item1[i]["TRAN_DATE"]).format('DD/MMM/YYYY') + "\n" + moment(item1[i]["TRAN_DATE"]).format('hh:mm:ss') + "  ", item1[i]["PARTICULARS"] + "", this.dp.transform(item1[i]["TRANSAMT"], '1.2'), item1[i]["DBCR"]];
      rows.push(temp);
    }
    // var temp2 = [" ", " Total :      ", this.decimalPipe.transform(this.TDR, '1.2') + "", this.decimalPipe.transform(this.TCR, '1.2') + "", ""];
    // rows.push(temp2);
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
      doc.save('Transaction_Status.pdf');
      obj.txt_Fdate = new Date(obj.txt_Fdate);
      obj.txt_Tdate = new Date(obj.txt_Tdate);
    };
  }




  getDate(month, d) {
    //console.log(month);
    var twoDigitMonth;
    var twoDigitDate;
    var year;
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var fullDate = new Date();//console.log(fullDate);
    if (d == "0") { twoDigitDate = (fullDate.getDate()) + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate; }
    else if (d == "1") { twoDigitDate = (fullDate.getDate()); }
    if (d == "0") {
      twoDigitMonth = new Date(fullDate.setMonth(fullDate.getMonth() - month));
      twoDigitMonth = monthNames[twoDigitMonth.getMonth()];
    }
    else if (d == "1") { twoDigitMonth = monthNames[fullDate.getMonth()]; }
    year = fullDate.getFullYear();
    if (d == "1") {
      twoDigitDate = parseInt(twoDigitDate);
      if (twoDigitDate >= 1 && twoDigitDate <= 14) {
        twoDigitDate = (15 - fullDate.getDate());
        twoDigitMonth = new Date(fullDate.setMonth(fullDate.getMonth() - 1));
      }
      else if (twoDigitDate >= 15) {
        twoDigitDate = (fullDate.getDate() - 15);
        twoDigitMonth = new Date(fullDate.setMonth(fullDate.getMonth()));
      }

      twoDigitMonth = monthNames[twoDigitMonth.getMonth()];
      year = (fullDate.getFullYear());

    }
    var fromdate = twoDigitDate + '/' + twoDigitMonth + '/' + year;
    // console.log(fromdate);
    this.txt_Fdate = fromdate;

  }

  getoneDate(month, d) {

    var previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - 6)

    this.txt_Fdate = this.getcurrentDate11(previousDate);
  }


  getcurrentDate() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var fullDate = new Date();//console.log(fullDate);
    var twoDigitMonth = monthNames[fullDate.getMonth()];
    //var twoDigitMonth1 = [twoDigitMonth];
    var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
    var currentDate = twoDigitDate + '/' + twoDigitMonth + '/' + fullDate.getFullYear();
    this.txt_Fdate = this.fDate;
    this.txt_Tdate = this.tDate;
    this.spinner.hide();

  }

  getcurrentDate11(date) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var fullDate = new Date(date);//console.log(fullDate);
    var twoDigitMonth = monthNames[fullDate.getMonth()];
    //var twoDigitMonth1 = [twoDigitMonth];
    var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
    var currentDate = twoDigitDate + '/' + twoDigitMonth + '/' + fullDate.getFullYear();
    //console.log(currentDate);
    return currentDate;
  }

  SetValue1 = function (obj) {

    if (obj.selectvalue != undefined && obj.selectvalue != '') {
      obj.fromdate = obj.mydate;
    }
  }


  SetValue2 = function (obj) {
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

  goTODashboard() {
    this.router.navigate(['/dashboard'], { queryParams: { 'kyc': false } });
  }

  ChangeMenu(menu) {
    if (menu == "statementOfAcc") {
      this.tab = 'tab1';
      this.TransactionStatus = false;

    }
    else if (menu == "TransactionStatus") {
      this.tab = 'tab2';
      this.TransactionStatus = true;
    }
  }
}

export interface StatementData {
  TRAN_DATE: string;
  PARTICULARS: string;
  TRANSAMT: string;
}
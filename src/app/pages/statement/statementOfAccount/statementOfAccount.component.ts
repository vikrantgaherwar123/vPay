import { Component, ViewChild, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { IStatement } from '../../../interface/statement';
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { Toast } from '../../../services/toast';
import { Spinner } from '../../../services/spinner';
import { ErrorHandler } from '../../../core/errorHandler';
import { Common } from '../../../services/common';
import { MatDialog } from "@angular/material";
import { MessageBox  } from "../../../services/_shared/message-box";
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// declare let jsPDF;
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
@Component({
  selector: 'app-statementOfAccount',
  styleUrls: ['./../statement.scss'],
  templateUrl: './statementOfAccount.html',
  providers: [ApiService, DecimalPipe, Spinner]
})

export class StatementOfAccountComponent implements OnInit {
  fDate: Date = new Date();
  tDate: Date = new Date();

  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  TransactionStatus: boolean = false;
  statementTable: boolean = false;
  mobileNo: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  TDR: number = 0; TCR: number = 0; TBAL: number = 0;
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
  message;
  displayedColumns: string[] = ['TRAN_DATE', 'PARTICULARS', 'DR_AMT', 'CR_AMT', 'BALANCE', 'GATEWAY_NAME'];
  dataSource: MatTableDataSource<StatementData>;

  constructor(private apiService: ApiService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private decimalPipe: DecimalPipe,
    private dataStorage: DataStorage, private errorHandler: ErrorHandler, private toast: Toast, private spinner: Spinner, private common: Common) {
    this.divR = this.divP = this.divN = this.divF = 'filterdiv'; this._Disphd = '_hide';
    this.msgshowhide = '_hide'; this.DisplayMsg = '';
    // this.txt_Fdate = "01/Jan/2017"; this.txt_Tdate = "31/Dec/2017";
    this.txt_Fdate = this.fDate; this.txt_Tdate = this.tDate;

    this.txt_FromAmount = "0"; this.txt_ToAmount = "99999";
  }

  ngOnInit() {
    this.spinner.show();
    this.logInfo = this.dataStorage.logInfo;
    this.mobileNo = this.dataStorage.logInfo[0].LOGIN_USER_ID
    let currDate = moment(this.logInfo[0].LOGIN_DATE).format('MMMM/YYYY');
    this.curDate = currDate.split('/');
    this.getcurrentDate();
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


  Reset() {
    this.Result_Data = null; this._Disphd = '_hide';
    this.dataSource = null;
    this.txt_Fdate = new Date(this.txt_Fdate);
    this.txt_Tdate = new Date(this.txt_Tdate);


  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  // Submit() {
  //   if (this.SetValue2(this))
  //     this.CallStatement(this.txt_Fdate, this.txt_Tdate);
  //   else
  //     return false;
  // }

  Submit() {

    this.txt_Fdate = moment(this.txt_Fdate).format("DD-MMM-YYYY");
    this.txt_Tdate = moment(this.txt_Tdate).format("DD-MMM-YYYY");
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
        this.CallStatement(this.txt_Fdate, this.txt_Tdate);
      // alert('run');
    }
    else
      return false;
  }

  CallStatement(fDate, TDate) {
    this.Reset();
    this.spinner.show();
    var uinput = {
      MobileNo: this.mobileNo,
      Device_Id: 'D',
      Request_From: "WB",
      FromDate: fDate,
      UpToDate: TDate,
      device_id: 'D',
    }
    this.apiService.sendToServer<IStatement>('/api/statement/StatmentOfAc_Client', uinput, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        this.tranTable = 'show';
        this.Result_Data = data.data;
        this.dataSource = new MatTableDataSource(data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
      else {
        this.Result_Data = null;
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      })
  }

  export(obj, document) {

    if (document === 'PDF') {
      this.converttopdf(obj);
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
  converttopdf(obj) {
    var imgData = 'assets/images/VPay.png';
    var header1 = "";
    // header1 += "Client Details" + this.spaces(85) + "Registered Bank Details" + "\n\n";
    header1 += "Statement Of Transaction" + "\n\n";

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
    var col = ["Transaction " + "\n" + "Date ", "Particulars  ", "Debit  ", " Credit  ", " Balance ", " Payment Method "];
    var rows = []; var credit = ''; var Debit = ''; doc.setFontSize(10);
    var PaymentMode = '';
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
      var temp = [moment(item1[i]["TRAN_DATE"]).format('DD/MMM/YYYY') + "\n" + moment(item1[i]["TRAN_DATE"]).format('hh:mm:ss') + "  ", item1[i]["PARTICULARS"] + "", Debit + "", credit + "", this.decimalPipe.transform(item1[i]["BALANCE"], '1.2'), item1[i]["GATEWAY_NAME"]];
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
      doc.save('Statement_Of_Transaction.pdf');
      obj.txt_Fdate = new Date(obj.txt_Fdate);
      obj.txt_Tdate = new Date(obj.txt_Tdate);
    };
  }

  exporttoexcel(obj) {
    // var imgData = this.banklogo !=null ? this.banklogo : this.setBankLogo;
    var header1 = "";
    // header1 += "Client Details" + this.spaces(85) + "Registered Bank Details" + "\n\n";
    header1 += "Statement Of Transaction" + "\n\n";

    if (this.logInfo[0]) {
      obj.txt_Fdate = moment(obj.txt_Fdate).format("DD/MMM/YYYY");
      obj.txt_Tdate = moment(obj.txt_Tdate).format("DD/MMM/YYYY");
      header1 += "Merchant Name : " + this.logInfo[0].CLIENT_NAME + "" + "\n";
      header1 += "Between Period : " + obj.txt_Fdate + ' To ' + obj.txt_Tdate + "" + "\n";
      header1 += "Between Amount : " + obj.txt_FromAmount + ' To ' + obj.txt_ToAmount + "" + "\n";
      var date;
      date = moment(this.logInfo[0].LOGIN_DATE).format('DD/MMM/YYYY');
      header1 += "Statement Date : " +  date +  "\n";
    }

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
    var col = ["Transaction Date", "Particular", "Debit", "Credit", "Balance", "Payment Method"];
    var footer1 = []; var footer2 = []; this.TDR = 0; this.TCR = 0;
    var rows = [];
    var temp = [];
    rows.push(col);

    for (var i = 0; i < Rdata.length; i++) {
      var dateparticular = ''; var particular = ''; var paymentMode = ''; var amount; var cramt = ''; var dramt = ''; var balance = ''
      dateparticular = moment(Rdata[i].TRAN_DATE).format('DD/MMM/YYYY') + "\n" + moment(Rdata[i]["TRAN_DATE"]).format('hh:mm:ss');
      particular = Rdata[i].PARTICULARS;
      cramt = this.decimalPipe.transform(Rdata[i].CR_AMT, '1.2');
      dramt = this.decimalPipe.transform(Rdata[i].DR_AMT, '1.2');
      amount = this.decimalPipe.transform(Rdata[i].BALANCE, '1.2');
      paymentMode = Rdata[i].GATEWAY_NAME;
      this.TDR += parseFloat(Rdata[i].DR_AMT);
      this.TCR += parseFloat(Rdata[i].CR_AMT);
      temp = [dateparticular, particular, dramt, cramt, amount, paymentMode];
      rows.push(temp)
    }
    footer1 = ["    ", " Total :  ", this.decimalPipe.transform(this.TDR, '1.2') + "", this.decimalPipe.transform(this.TCR, '1.2') + "", ""];
    rows.push(footer1);
    footer2 = ["*** END OF STATEMENT-Vpay."];
    rows.push(footer2);

    new Angular2Csv(rows, 'Statement Of Transaction', options);
    obj.txt_Fdate = new Date(obj.txt_Fdate);
    obj.txt_Tdate = new Date(obj.txt_Tdate);
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
    //console.log(previousDate)
    this.txt_Fdate = this.getcurrentDate11(previousDate);
    // console.log(this.txt_Fdate);
    //this.getdata(this.pflag, this.recpayflag);

  }


  getcurrentDate() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var fullDate = new Date();//console.log(fullDate);
    var twoDigitMonth = monthNames[fullDate.getMonth()];
    //var twoDigitMonth1 = [twoDigitMonth];
    var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
    var currentDate = twoDigitDate + '/' + twoDigitMonth + '/' + fullDate.getFullYear();
    // console.log(currentDate);
    // this.txt_Tdate = currentDate;
    // this.txt_Fdate = currentDate;
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
  CR_AMT: string;
  DR_AMT: string;
  BALANCE: string;
  GATEWAY_NAME: string;
}
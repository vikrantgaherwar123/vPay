import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { ErrorHandler } from '../../../core/errorHandler';
import { Spinner } from '../../../services/spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as moment from 'moment';
import { DecimalPipe } from '@angular/common';
import { ICore } from '../../../interface/core';
import { Common } from '../../../services/common';
import { MatDialog } from "@angular/material";
import { MessageBox } from "../../../services/_shared/message-box";
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// declare let jsPDF;
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
declare const $: any;

@Component({
  selector: 'app-bank',
  templateUrl: './transactionAccount.component.html',
  styleUrls: [
    './../bank.component.scss'
  ],
  providers: [DecimalPipe],
})
export class TransactionAccountComponent implements OnInit {
  fromDate: Date = new Date();
  toDate: Date = new Date();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sort1') sort1: MatSort;
  logInfo: ILogin;
  clientMstId: number;
  login_user_id: string;
  userName: string = "";
  lastLogin: string = "";
  BUSINESS_DETAILS: string = "";
  Corporate_Flag: any;
  sessionId: any;
  Insti_Sub_Mst_Id: any;
  secretKey: any;
  url: any;
  InetCorpoID: any;
  InetUserID: any;
  InetCorpFlag: any;
  CUSTNAME: any;

  termCondContent: string;
  //mobile Banking Variable
  banklogo: any = null;
  listarray = [];
  bankname: any;
  setBankLogo: any = null;
  selectedBank: any;
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;
  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;

  //Tran Account Variable
  Items: Array<any>;
  accStatementNo: any;
  AccDetItems: Array<any>;
  AccStateItems: Array<any>;
  bankDetails: boolean = false;
  btnBack: boolean = true;
  Disp_DivData: string = 'hide';
  showAccDetModal: boolean = false;
  showMiniStateModal: string = "hideModal";
  accdetails: any;
  TranKey: any;
  AccTitle: string = '';
  txt_Fdate: any; txt_Tdate: any;
  showAccStatement: boolean = false;
  HeaderClientData: any;
  TDR: number = 0; TCR: number = 0; TBAL: number = 0;
  BankArray = [];
  currentDate: any;
  //dialog box Variable
  message;
  tranTable: string = 'hide';
  displayedColumns: string[] = ['TRAN_DATE', 'PARTICULAR', 'DR_AMOUNT', 'CR_AMOUNT', 'LINE_BALANCE'];
  dataSource: MatTableDataSource<MiniStatementData>;
  dataSourceAcc: MatTableDataSource<MiniStatementData>;
  constructor(private dataStorage: DataStorage, private router: Router, private route: ActivatedRoute, private apiService: ApiService,
    private spinner: Spinner, private decimalPipe: DecimalPipe, private errorHandler: ErrorHandler, private common: Common, public dialog: MatDialog, private dp: DecimalPipe) {
  }

  ngOnInit() {
    this.spinner.show();
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.userName = this.logInfo[0].CLIENT_NAME;
    this.lastLogin = this.logInfo[0].LOGIN_DATE;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.sessionId = this.logInfo.sessionId;
    this.HeaderClientData = this.logInfo;
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
      this.TranKey = this.route.queryParams["_value"].tranKeyword;
      if (this.TranKey != null) {
        if (this.TranKey == "OPAC")
          this.AccTitle = "Transaction Account";
        else if (this.TranKey == "FDAC")
          this.AccTitle = "Deposit Account";
        else
          this.AccTitle = "Loan Account";
        this.Get_AccountList();
      }
    } else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");
    }

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
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "6", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }

  // Account List
  Get_AccountList() {
    this.spinner.show();
    this.accdetails = null;
    var paramObj = {
      request_from: 'WB',
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Customer_ID: this.Cbs_CustomerID,
      CORPORATE_FLAG: this.Corporate_Flag,
      Secret_Key: this.secretKey,
      url: this.url,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      AcKeyword: this.TranKey,
      Device_Id: 'Desktop',
      Session_Id: this.sessionId,
      Source: 'Desktop',
    };
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_Account', paramObj, this).subscribe((data) => {
      this.spinner.show();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].ERROR) {
          this.message = data.cursor1[0].ERROR;
          MessageBox.show(this.dialog, this.message, "");
        } else {
          this.accdetails = data.cursor1;
          this.bankDetails = true;
        }
      } else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  //Mini Statement
  openMiniStatement(Account_No) {
    this.spinner.show();
    this.showMiniStateModal = 'hideModal';
    this.Items = null;
    var paramObj = {
      request_from: 'WB',
      Client_Mst_ID: this.clientMstId,
      Account_No: Account_No,
      CORPORATE_FLAG: this.Corporate_Flag,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Secret_Key: this.secretKey,
      url: this.url,
      Device_Id: 'Desktop',
      Session_Id: this.sessionId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Source: 'Desktop',
    };
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_MiniStatement', paramObj, this).subscribe((data) => {
      this.spinner.show();

      if (data != null && data != undefined) {

        // this.Items = data.cursor1;
        this.tranTable = 'show';
        this.dataSource = new MatTableDataSource(data.cursor1);
        this.dataSource.sort = this.sort;
        this.showMiniStateModal = 'showModal';
        if (this.showMiniStateModal == 'showModal') {
          $(document).ready(function () {
            $("#modalMiniStatement").modal('show');
          });
        }

      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  //Account Details
  openACDetails(Account_No) {
    this.spinner.show();
    this.AccDetItems = null;
    var paramObj = {
      request_from: 'WB',
      Client_Mst_ID: this.clientMstId,
      Account_No: Account_No,
      CORPORATE_FLAG: this.Corporate_Flag,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Secret_Key: this.secretKey,
      url: this.url,
      Device_Id: 'Desktop',
      Session_Id: this.sessionId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Source: 'Desktop',
    };
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_AccountDetails', paramObj, this).subscribe((data) => {

      if (data != null && data != undefined) {
        this.showAccDetModal = true;
        if (this.showAccDetModal == true) {
          $(document).ready(function () {
            $("#modalAccountDetails").modal('show');
          });
          this.AccDetItems = data.cursor1;
        }

      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  //Account Statement
  accStatement(Account_No) {
    this.showAccStatement = true;
    this.btnBack = false;
    this.bankDetails = false;
    this.accStatementNo = Account_No;
    // this.clear();
    this.getcurrentDate();
  }

  showStatment() {
    if (this.SetValue2(this))
      this.openACStatement(this.txt_Fdate, this.txt_Tdate);
    else
      return false;
  }

  openACStatement(fDate, tDate) {

    fDate = moment(fDate).format("DD-MMM-YYYY");
    tDate = moment(tDate).format("DD-MMM-YYYY");
    if (fDate == undefined || fDate.toString().trim() == "") {
      this.message = "Enter From Date.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (tDate == undefined || tDate.toString().trim() == "") {
      this.message = "Enter Upto Date.";
      MessageBox.show(this.dialog, this.message, "");

      return false;
    }
    this.showMiniStateModal = 'hideModal';
    this.spinner.show();
    var paramObj = {
      request_from: 'WB',
      Client_Mst_Id: this.clientMstId,
      Account_No: this.accStatementNo,
      CORPORATE_FLAG: this.Corporate_Flag,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Secret_Key: this.secretKey,
      FromDate: fDate,
      UptoDate: tDate,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      url: this.url
    };
    this.apiService.sendToServer<ICore>('/api/virtualPay/Ac_Statement', paramObj, this).subscribe((data) => {

      if (data != null && data != undefined && data.cursor1[0].SRNO != null) {
        this.Disp_DivData = 'show';
        this.dataSourceAcc = new MatTableDataSource(data.cursor1);
        this.dataSource.paginator = this.paginator;
        this.dataSourceAcc.sort = this.sort1;
      } else {
        this.message = 'No Record Found';
        MessageBox.show(this.dialog, this.message, "");
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }


  applyFilter(filterValue: string) {
    this.dataSourceAcc.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceAcc.paginator) {
      this.dataSourceAcc.paginator.firstPage();
    }
  }

  //Bank Page Back Button
  Back() {
    this.bankDetails = true;
    this.btnBack = true;
    this.showAccStatement = false;
    this.clear();
  }
  pageBack() {
    this.clear();
    this.router.navigate(['/bank'], { queryParams: { 'bank': false } });
    // this.router.navigate(['/bank']);
  }

  clear() {
    // this.AccDetItems = null;
    this.AccStateItems = null;
    this.Items = null;
    this.AccDetItems = null;
    this.Disp_DivData = 'hide';
    this.txt_Fdate = new Date();
    this.txt_Tdate = new Date();
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
    var imgData = this.banklogo != null ? this.banklogo : this.setBankLogo;
    var header1 = "";
    // header1 += "Client Details" + this.spaces(85) + "Registered Bank Details" + "\n\n";
    header1 += "Bank Account Statement" + "\n\n";

    if (this.HeaderClientData) {
      header1 += "Bank Name : " + this.selectedBank + "" + "\n";
      header1 += "Bank Account Number : " + this.accStatementNo + "" + "\n";
    }
    this.txt_Fdate = moment(this.txt_Fdate).format("DD/MMM/YYYY");
    this.txt_Tdate = moment(this.txt_Tdate).format("DD/MMM/YYYY");
    header1 += "Period " + " From Date    : " + moment(this.txt_Fdate).format('DD/MMM/YYYY') + "  Upto Date : " + moment(this.txt_Tdate).format('DD/MMM/YYYY') + "";
    var item1 = this.AccStateItems;
    var doc = new jsPDF();
    var img = new Image();
    img.src = this.banklogo != null ? this.banklogo : this.setBankLogo;;
    var col = ["Transaction " + "\n" + "Date ", "Particulars  ", "Debit  ", " Credit  ", " Balance "];
    var rows = []; var credit = ''; var Debit = ''; doc.setFontSize(10);
    var footer = []; this.TDR = 0; this.TCR = 0; this.TBAL = 0;
    for (var i = 0; i < item1.length; i++) {
      if (this.decimalPipe.transform(item1[i]["DR_AMOUNT"], '1.2') === null)
        Debit = "0.00";
      else
        Debit = this.decimalPipe.transform(item1[i]["DR_AMOUNT"], '1.2');
      if (this.decimalPipe.transform(item1[i]["CR_AMOUNT"], '1.2') === null)
        credit = this.decimalPipe.transform("0.00", '1.2');
      else
        credit = this.decimalPipe.transform(item1[i]["CR_AMOUNT"], '1.2');
      this.TDR += parseFloat(item1[i].DR_AMOUNT);
      this.TCR += parseFloat(item1[i].CR_AMOUNT);
      // this.TBAL += parseFloat(item1[i].LINE_BALANCE);
      var temp = [moment(item1[i]["TRAN_DATE"]).format('DD/MMM/YYYY') + "\n" + moment(item1[i]["TRAN_DATE"]).format('hh:mm:ss') + "  ", item1[i]["PARTICULAR"] + "", Debit + "", credit + "", this.decimalPipe.transform(item1[i]["LINE_BALANCE"], '1.2')];
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
      doc.addImage(img, 10, 10, 70, 15);
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
      doc.save('Bank_Statement.pdf');
    };
    this.txt_Fdate = new Date(this.txt_Fdate);
    this.txt_Tdate = new Date(this.txt_Tdate);
  }

  exporttoexcel(obj) {
    // var imgData = this.banklogo !=null ? this.banklogo : this.setBankLogo;
    var header1 = "";
    // header1 += "Client Details" + this.spaces(85) + "Registered Bank Details" + "\n\n";
    header1 += "Registered Bank Details" + "\n\n";

    if (this.HeaderClientData) {
      header1 += "Bank Name           : " + this.selectedBank + "" + "\n";
      header1 += "Bank Account Number           : " + this.accStatementNo + "" + "\n";
    }
    this.txt_Fdate = moment(this.txt_Fdate).format("DD/MMM/YYYY");
    this.txt_Tdate = moment(this.txt_Tdate).format("DD/MMM/YYYY");
    header1 += "Bank Account Statement " + " From Date    : " + moment(this.txt_Tdate).format('DD/MMM/YYYY') + " Upto Date : " + moment(this.txt_Tdate).format('DD/MMM/YYYY') + "\n";
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
    var Rdata = this.AccStateItems;
    var col = ["Transaction Date", "Particular", "Debit", "Credit", "Balance"];
    var footer1 = []; var footer2 = []; this.TDR = 0; this.TCR = 0;
    var rows = [];
    var temp = [];
    rows.push(col);

    for (var i = 0; i < Rdata.length; i++) {
      var dateparticular = ''; var particular = ''; var amount; var cramt = ''; var dramt = ''; var balance = ''
      dateparticular = moment(Rdata[i].TRAN_DATE).format('DD/MMM/YYYY') + "\n" + moment(Rdata[i]["TRAN_DATE"]).format('hh:mm:ss');
      particular = Rdata[i].PARTICULAR;
      cramt = this.decimalPipe.transform(Rdata[i].CR_AMOUNT, '1.2');
      dramt = this.decimalPipe.transform(Rdata[i].DR_AMOUNT, '1.2');
      amount = this.decimalPipe.transform(Rdata[i].LINE_BALANCE, '1.2');
      this.TDR += parseFloat(Rdata[i].DR_AMOUNT);
      this.TCR += parseFloat(Rdata[i].CR_AMOUNT);
      temp = [dateparticular, particular, dramt, cramt, amount];
      rows.push(temp)
    }
    footer1 = ["    ", " Total :  ", this.decimalPipe.transform(this.TDR, '1.2') + "", this.decimalPipe.transform(this.TCR, '1.2') + "", ""];
    rows.push(footer1);
    footer2 = ["*** END OF STATEMENT-Vpay."];
    rows.push(footer2);

    new Angular2Csv(rows, 'Bank Account Statement', options);
    this.txt_Fdate = moment(this.txt_Fdate).format("DD/MMM/YYYY");
    this.txt_Tdate = moment(this.txt_Tdate).format("DD/MMM/YYYY");
  }




  //Account Statement Close





  //Date & Time

  getcurrentDate() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var fullDate = new Date();
    var twoDigitMonth = monthNames[fullDate.getMonth()];
    //var twoDigitMonth1 = [twoDigitMonth];
    var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
    this.currentDate = twoDigitDate + '/' + twoDigitMonth + '/' + fullDate.getFullYear();
    this.txt_Fdate = this.fromDate;
    this.txt_Tdate = this.toDate;
    this.spinner.hide();

  }

  SetValue2 = function (obj) {

    var StartDate = (<HTMLInputElement>document.getElementById('txtStartDate')).value;
    var EndDate = (<HTMLInputElement>document.getElementById('txtEndDate')).value;
    var eDate = new Date(EndDate);
    var sDate = new Date(StartDate);
    if (StartDate != '' && StartDate != '' && sDate > eDate) {
      obj.clear();
      obj.message = "Please ensure that the End Date is greater than or equal to the Start Date.";
      MessageBox.show(obj.dialog, obj.message, "");
      return false;
    }

    return true;
  }
}


export interface MiniStatementData {
  TRAN_DATE: string;
  PARTICULAR: string;
  DR_AMOUNT: string;
  CR_AMOUNT: string;
  LINE_BALANCE: string;
}

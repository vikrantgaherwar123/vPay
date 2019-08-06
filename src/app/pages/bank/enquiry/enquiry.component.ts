import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../../core/api.service';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { Spinner } from '../../../services/spinner';
import { ICore } from '../../../interface/core';
import { Common } from '../../../services/common';
import { MatDialog } from "@angular/material";
import { ErrorHandler } from '../../../core/errorHandler';
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: [
    './../bank.component.scss'
  ],
  providers: [DecimalPipe],
})
export class EnquiryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  termCondContent: string;
  //mobile Banking Variable
  banklogo: any = null;
  showBankList = 'hide';
  showOverlay = 'hide';
  padBottom: string = '';
  listarray = [];
  loanArray = [];
  bankname: any;
  setBankLogo: any = null;
  selectedBank: any;
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;

  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;


  //dialog box Variable
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

  //enquiry variables
  btnBack: boolean = true;
  schemeArray = [];
  codeMstArray = [];
  depositArray = [];
  acType: any;
  showVpayOtp: string = "hide";
  schemeSubId: any;
  emiTable: string = 'hide';
  Amount: any;
  year: any;
  monthamount: any;
  codeMsterSubName: any;
  scheme: any;
  rate: any;
  req: any;
  codeMaster_CODE_ID: any;
  displayedColumns: string[] = ['SRNO', 'EMI', 'INTEREST_AMOUNT', 'OUTSTANDING_AMOUNT', 'PRINCIPAL_AMOUNT'];
  dataSource: MatTableDataSource<UserData>;


  constructor(private dataStorage: DataStorage, private route: ActivatedRoute, private errorHandler: ErrorHandler, private router: Router, private apiService: ApiService,
    private spinner: Spinner, private common: Common, public dialog: MatDialog, private dp: DecimalPipe) {

  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.userName = this.logInfo[0].CLIENT_NAME;
    this.lastLogin = this.logInfo[0].LOGIN_DATE;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.sessionId = this.logInfo.sessionId;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';

    if (this.logInfo[0].SelectedBankData != null) {
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

      this.req = this.route.queryParams["_value"].Request;
      if (this.req == 'deposit') {
        this.Open(0);
        this.Get_Scheme('FD');
      }
      else if (this.req == 'loan') {
        this.Open(1);
        this.Get_Scheme('LN');
      }
      this.Get_Code_Mst();
    } else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");
    }

    // this.SearchBank();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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


  // Scheme List
  Get_Scheme(acType) {
    this.clearPage();
    this.acType = acType;
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Flag: acType,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      url: this.url,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      login_user_id: this.login_user_id,
      RRN_Number: ''

    };
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_Scheme_Details', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].ERROR) {
          this.message = data.cursor1[0].ERROR;
          MessageBox.show(this.dialog, this.message, "");
        } else {
          this.schemeArray = data.cursor1;
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }


  // Scheme List
  Get_Code_Mst() {
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Flag: this.acType,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      url: this.url,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      login_user_id: this.login_user_id,
      RRN_Number: '',
      Code_Group_ID: 10,

    };
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_Code_Master', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].ERROR) {
          this.message = data.cursor1[0].ERROR;
          MessageBox.show(this.dialog, this.message, "");
        } else {
          this.codeMstArray = data.cursor1;
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }


  selectedCodeMst(codeObj) {
    this.codeMaster_CODE_ID = codeObj.CODE_ID;
  }
  selectedScheme(schemeObj) {
    this.schemeSubId = schemeObj.SCHEME_ID;
  }



  Go(year) {
    if (this.codeMsterSubName.trim().length == 0 || this.codeMsterSubName == null || this.codeMsterSubName == undefined) {
      this.message = "Select Customer Type.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.scheme.trim().length == 0 || this.scheme == null || this.scheme == undefined) {
      this.message = "Select Scheme.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.year.trim().length == 0 || this.year == null || this.year == undefined) {
      this.message = "Enter Months In Year.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.Amount.length == 0) {
      this.message = "Enter Amount.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (parseFloat(this.Amount) == 0) {
      this.message = "Enter Amount greater than 0.00.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.spinner.show();
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Flag: this.acType,
      Scheme_ID: this.schemeSubId,
      Amount: this.Amount,
      Code_Mst_ID: this.codeMaster_CODE_ID,
      Period_In_Months: year,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      url: this.url,
      RRN_Number: '',
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      login_user_id: this.login_user_id,
    }
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_Deposit_Enquiry', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].ERROR) {
          this.message = data.cursor1[0].ERROR;
          MessageBox.show(this.dialog, this.message, "");
        } else {
          this.depositArray = data.cursor1;
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }

  Open(Val) {
    this.clearPage();
    if (Val.index == 0 || Val == 0) {
      this.Get_Scheme('FD'); //OWN Bank / Same Bank 
    }
    if (Val.index == 1 || Val == 1) {
      this.Get_Scheme('LN'); //OTHER Bank 
    }
  }


  GoLoan(year) {
    if (this.codeMsterSubName.trim().length == 0 || this.codeMsterSubName == null || this.codeMsterSubName == undefined) {
      this.message = "Select Customer Type.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.scheme.trim().length == 0 || this.scheme == null || this.scheme == undefined) {
      this.message = "Select Scheme.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.year.trim().length == 0 || this.year == null || this.year == undefined) {
      this.message = "Enter Months In Year.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (this.Amount.length == 0) {
      this.message = "Enter Amount.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (parseFloat(this.Amount) == 0) {
      this.message = "Enter Amount greater than 0.00.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.spinner.show();
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Client_Mst_ID: this.clientMstId,
      Secret_Key: this.secretKey,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Flag: this.acType,
      Scheme_ID: this.schemeSubId,
      Amount: this.Amount,
      Code_Mst_ID: this.codeMaster_CODE_ID,
      Period_In_Months: year,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      url: this.url,
      RRN_Number: '',
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      login_user_id: this.login_user_id,

    }
    this.apiService.sendToServer<ICore>('/api/virtualpay/Get_Loan_Enquiry', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1[0].ERROR) {
          this.message = data.cursor1[0].ERROR;
          MessageBox.show(this.dialog, this.message, "");
        } else {
          this.emiTable = 'show';
          this.dataSource = new MatTableDataSource(data.cursor1);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;
  }

  pageBack() {
    this.clearPage();
    this.router.navigate(['/bank'], { queryParams: { 'bank': false}});
  }

  clearPage() {
    this.Amount = null;
    this.schemeArray = null;
    this.codeMaster_CODE_ID = null;
    this.schemeSubId = null;
    this.depositArray = null;
    this.emiTable = 'hide';
    this.year = '';
    this.scheme = '';
    this.Amount = '';
    this.codeMsterSubName = '';
    // this.codeMstArray = null;
  }

  ConverToDecimal() {
    if (parseFloat(this.Amount))
      this.Amount = parseFloat(this.Amount).toFixed(2);
  }
}

export interface UserData {
  SRNO: string;
  EMI: string;
  INTEREST_AMOUNT: string;
  OUTSTANDING_AMOUNT: string;
  PRINCIPAL_AMOUNT: string;
}
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../../core/api.service';
import { ILogin } from '../../../interface/login';
import { DataStorage } from '../../../core/dataStorage';
import { Spinner } from '../../../services/spinner';
import { ICore } from '../../../interface/core';
import { Common } from '../../../services/common';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ErrorHandler } from '../../../core/errorHandler';
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Otp } from "../../../shared/component/otp/otp.component";
import { Subscription } from "rxjs/Subscription";
import { IOtp } from '../../../interface/otp';
import { ConfirmDialogComponent } from '../../../shared/component/confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material';

declare const $: any;

@Component({
  selector: 'app-bank',
  templateUrl: './beneficiaryMaintenance.component.html',
  styleUrls: [
    './../bank.component.scss'
  ],
  providers: [DecimalPipe],
})
export class BeneficiaryMaintenanceComponent implements OnInit {
  @ViewChild(Otp) otpCntrl: Otp;
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
  showBankList = 'hide';
  showOverlay = 'hide';
  padBottom: string = '';
  listarray = [];
  bankname: any;
  setBankLogo: any = null;
  selectedBank: any;
  Cbs_CustomerID: any;
  BANK_REG_MST_ID: any;

  CLIENT_MST_ID: any;
  SUB_AG_MST_ID: any;

  //Bene. variable
  beneneficiaryName: string = '';
  nickName: string = '';
  BeneficiaryTypeFlag: any;
  BeneConfirmFlag: any;
  btnAddBene: any = false;
  btnDeleteBene: boolean = false;
  btnClearBene: boolean = false;
  btnModifyBene: boolean = false;
  addRemoveBeneficiary: boolean = false;
  showBeneficiary: boolean = true;
  beneTitle: any;
  accountNo: number;
  address: string = '';
  pinCode: number;
  BenRel: any;
  BeneficiaryId: any;
  Relations: Array<any>;
  mobileNo: string = '';
  Bank: any;
  Branch: any;
  Location: any;
  // bankName: any;
  // branchName: any;
  IFSC: string = '';
  TransferLimit: any;
  BeneAccountList: any;
  BeneAccountListOwn: any;
  BeneAccountListOther: any;
  emailId: string = '';
  RRN_No: any;
  pFlag: any;
  searchIcon: boolean = true;
  CBS_TranID: any;
  isDisabled: boolean = false;
  showVpayOtp: string = "hide";
  showUserModal: string = 'hideModal';
  UserDetail: Array<any>;
  tabOWN: boolean = false;
  tabOther: boolean = false;
  tpin: any;
  //ifscbank code popup
  clsClass: any = "DispNone";
  bank: any;
  bankdata: any;
  state: any;
  statedata: any;
  city: any;
  citydata: any;
  IFSC_CODE: any = "";
  branchdata: any;
  branch: any;
  bankAddress: any;
  ownBankList: any;
  otherBankList: any;
  ifsc: any;
  Disp_ifsclabel: boolean = false;
  Disp_ifscnotfound: boolean = false;
  btnBack: boolean = true;
  Disp_ifscpage: boolean = false;
  statusMsg: string = "";
  showTOPUP: boolean = false;

  displayedColumns: string[] = ['Acc_name', 'Acc_num', 'Address', 'Branch_name', 'Pincode'];
  dataSource: MatTableDataSource<MiniStatementData>;



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
      this.CUSTNAME = this.logInfo[0].SelectedBankData[0].CUSTNAME;
      this.InetUserID = this.logInfo[0].SelectedBankData[0].INET_USER_ID;
      this.InetCorpFlag = this.logInfo[0].SelectedBankData[0].INET_CORPORATE_FLAG;
      this.showBeneficiary = true;
      this.Get_BeneficieryList('A');
      this.Get_Relation();
    } else {
      this.message = "Invalid Data";
      MessageBox.show(this.dialog, this.message, "");
    }
    this.SearchBank();
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


  //Beneficiary Relation List
  Get_Relation() {
    this.Relations = [
      { 'ID': '609', 'name': 'None' },
      { 'ID': '346', 'name': 'Father' },
      { 'ID': '355', 'name': 'Daughter Of Step Mother' },
      { 'ID': '356', 'name': 'Son In Law' },
      { 'ID': '357', 'name': 'Brother' },
      { 'ID': '358', 'name': 'Step Brother' },
      { 'ID': '359', 'name': 'Sister in law' },
      { 'ID': '360', 'name': 'Sister' },
      { 'ID': '361', 'name': 'Step Sister' },
      { 'ID': '362', 'name': 'brother in Law' },
      { 'ID': '363', 'name': 'Grand Father' },
      { 'ID': '608', 'name': 'Wife' },
      { 'ID': '347', 'name': 'Hindu Undivided Family(H.U.F)' },
      { 'ID': '675', 'name': 'Grand Mother' },
      { 'ID': '1430', 'name': 'grand Son' },
      { 'ID': '1431', 'name': 'grand daughter' },
      { 'ID': '348', 'name': 'Husband' },
      { 'ID': '349', 'name': 'Mother' },
      { 'ID': '350', 'name': 'Step Mother' },
      { 'ID': '351', 'name': 'Son' },
      { 'ID': '352', 'name': 'Son Of Step Mother' },
      { 'ID': '353', 'name': 'Daughter On Law' },
      { 'ID': '354', 'name': 'Daughter' }
    ]

    // var obj = {
    //   opKeyword: 'CODEMST',
    //   CodeGroupID: 20,
    //   userId: this.loginInfo.Inet_User_Id,
    //   uuId: 'SID',
    //   src: 'SID',
    //   corporateFlag: this.loginInfo.Corporate_Flag,
    //   corporateId: this.loginInfo.Inet_Corp_Id,
    // }
    // this.spinner.show();
    // this.apiService.sendToServer<ICore>('/api/BeneficiaryDetails/getRelation', obj, this).subscribe(data => {
    // this.spinner.hide();
    //   this.Relations = data.codedetail;
    // },
    //   err => {
    // this.spinner.hide();
    //     this.errorHandler.handlePageError(err);
    //   },
    //   () => console.log('GetRelation')
    // );
  }

  //Beneficiary

  Get_BeneficieryList(PFlag) {
    var uinput = {
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      login_user_id: this.login_user_id,
      Secret_Key: this.secretKey,
      Customer_ID: this.Cbs_CustomerID,
      Tran_Mode: 'ALL',
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Bene_Type_Flag: PFlag,
      Bene_Confirm_Flag: 'A',
      url: this.url,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
    }
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/Bene_List', uinput, this).subscribe(data => {
      this.spinner.hide();
      if (data.code === 1 && data.msg.toUpperCase() == 'SUCCESS') {
        // this.BeneAccountList = data.cursor1;
        if (data.cursor1.length > 0) {
          //OWN Beneficiary
          let bnkmstid = data.cursor1.filter(item => item.BENE_TYPE_FLAG == "S");
          this.BeneAccountListOwn = bnkmstid;
          //other beneficiary
          let nonbnkmstid = data.cursor1.filter(item => item.BENE_TYPE_FLAG == 'O');
          this.BeneAccountListOther = nonbnkmstid;
          this.BeneAccountList = data.cursor1;
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      });
  }
  benBack() {
    this.tpin = '';
    this.showBeneficiary = true;
    this.addRemoveBeneficiary = false;
    this.btnAddBene = false;
    this.btnBack = true;
    this.btnDeleteBene = false;
  }

  Back() {
    this.showVpayOtp = "hide";
    // this.Mycardinfo();
    this.btnBack = true;
    this.showBeneficiary = true;
    this.tpin = '';
    this.otpCntrl.otp = '';
  }

  pageBack() {
    this.clearPage();
    this.router.navigate(['/bank'], { queryParams: { 'bank': false } });
  }
  //Fetch Mobile Number
  Get_Mobile_Accounts() {
    if (this.mobileNo == undefined || this.mobileNo == '' ||
      parseFloat(this.mobileNo) == 0 || parseFloat(this.mobileNo).toString().length != 10) {
      // alert('Enter 10 Digit Mobile Number.');
      this.message = "Enter 10 Digit Mobile Number.";
      MessageBox.show(this.dialog, this.message, "");
      this.clearPage();
      return false;
    }
    var uinput = {
      opKeyword: "ACLISTMOB",
      Client_Mst_Id: this.clientMstId,
      MobNo: this.mobileNo,
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Secret_Key: this.secretKey,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
      Customer_ID: this.Cbs_CustomerID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Inet_Corp_Id: this.InetCorpoID,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Request_From: 'WB',
      url: this.url
    }
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/GetAcList_FromMob', uinput, this).subscribe(data => {
      this.spinner.hide();
      if (data.code === 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.UserDetail = data.cursor1;
        this.dataSource = new MatTableDataSource(data.cursor1);

        if (this.UserDetail.length > 1) {
          this.showUserModal = "showModal";
          if (this.showUserModal == 'showModal') {
            $(document).ready(function () {
              $("#selectAccPopup").modal('show');
            });
          }
        } else {
          this.showUserModal = "hideModal";
        }
      }
      else {
      }
    },
      err => {
        this.spinner.hide();
        // alert('No Saving Account Found For This Mobile Number.');
        this.errorHandler.handlePageError(err);
        this.clearPage();
        this.mobileNo = '';
      });
  }
  // Beneficiary close


  //Add Beneficiary
  adBene() {
    this.addRemoveBeneficiary = true;
    this.btnBack = false;
    this.isDisabled = false;
    this.btnAddBene = true;
    this.btnModifyBene = false;
    this.showBeneficiary = false;
    this.beneTitle = 'Add Beneiciary';
    this.tabOWN = true;
    this.btnClearBene = true;
    this.tabOther = true;
    this.Open(0);
  }

  //Modify & Remove Beneficiary 
  beneOperation(obj, benFlag) {
    this.searchIcon = true;
    this.btnBack = false;
    if (benFlag == 'M') {
      this.btnModifyBene = true;
      this.isDisabled = false;
      this.beneTitle = "Update Beneficiary";

    }
    else {
      this.beneTitle = "Remove Beneficiary";
      this.searchIcon = false;
      this.isDisabled = true;
      this.btnDeleteBene = true;
      this.btnModifyBene = false;
    }
    this.padBottom = "padding-bot";
    this.btnClearBene = false;
    this.addRemoveBeneficiary = true;
    this.showBeneficiary = false;
    this.accountNo = obj.BENE_ACCOUNT_NUMBER;
    this.pinCode = obj.BENE_PINCODE;
    this.BenRel = obj.BENE_RELATION;
    this.BeneficiaryId = obj.BENE_MST_ID;
    if (obj.BENE_TYPE_FLAG == "S") {
      this.tabOWN = true;
      this.tabOther = false;
    } else {
      this.tabOWN = false;
      this.tabOther = true;
    }
    this.BeneficiaryTypeFlag = obj.BENE_TYPE_FLAG;
    this.address = obj.BENE_ADDRESS;
    this.mobileNo = obj.BENE_MOBNO;
    this.beneneficiaryName = obj.BENE_NAME;
    this.nickName = obj.BENE_NICKNAME;
    this.bank = obj.BANK_NAME;
    this.IFSC = obj.IFSC_CODE;
    this.branch = obj.BANK_BRANCH_NAME;
    this.TransferLimit = parseFloat(obj.MAX_TRAN_LIMIT);
    this.Location = obj.BRANCH_LOCATION;
  }
  //Remove Beneficiary Close

  //Tab-Open
  Open(Val) {
    this.clearPage();
    if (Val.index == 0 || Val == 0) {
      this.BeneficiaryTypeFlag = 'S'; //OWN Bank / Same Bank 
    }
    if (Val.index == 1 || Val == 1) {
      this.BeneficiaryTypeFlag = 'O'; //OTHER Bank 
    }
  }

  // Beneficiary Add
  benSubmit(flag) {
    if (flag == 'N') {
      this.BeneficiaryId = 0;
    }
    if (flag !== "R") {
      //Mobile No
      if (this.mobileNo == undefined || this.mobileNo == '' ||
        parseFloat(this.mobileNo) == 0 || parseFloat(this.mobileNo).toString().length != 10) {
        this.message = "Enter 10 Digit Mobile Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      //Beneficiary Account Number
      if (this.accountNo == undefined || this.accountNo == 0) {
        this.message = "Enter Beneficiary Account No.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.accountNo.toString().trim().length < 9) {
        this.message = "Enter Greater Than 9 Digit Account Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.accountNo.toString().trim().length > 20) {
        this.message = "Enter Less Than 20 Digit Account Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      //Beneficiary Name
      if (this.beneneficiaryName == undefined || this.beneneficiaryName == '') {
        this.message = "Enter Beneficiary Name.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      //Beneficiary Nick Name
      if (this.nickName == undefined || this.nickName == '') {
        this.message = "Enter Beneficiary Nick Name.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      //IFSC //OTHER Bank 
      if (this.BeneficiaryTypeFlag == 'O') {
        if (this.IFSC == undefined || this.IFSC == '') {
          this.message = "Enter IFSC.";
          MessageBox.show(this.dialog, this.message, "");
          return false;
        }
      }
      //Beneficiary Relationship
      if (this.BenRel == undefined || this.BenRel == '') {
        this.message = "Select Beneficiary Relationship.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }



      //Transfer Limit
      if (this.TransferLimit == undefined || this.TransferLimit == 0) {
        this.message = "Enter Transfer Limit";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (this.TransferLimit === 'undefined' || this.TransferLimit > 50000) {
        this.message = "Please Enter Transfer Limit less than 50,000.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }

      //Beneficiary Address
      if (this.address == undefined || this.address == '') {
        this.message = "Enter Beneficiary Address.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    }
    if (this.tpin == undefined || this.tpin.toString().trim() == "") {
      this.message = "Enter TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.tpin.trim().length != 4) {
      this.message = "Enter a valid 4 digit TPIN.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    // if (flag == 'R' || flag == 'M') {
    //   var res = confirm("Do You Want To Procced ?");
    //   if (!res) {
    //     return false;
    //   }
    // }
    this.BeneficiaryId = this.BeneficiaryId;
    this.pFlag = flag;
    var ParamsObj = {
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_Id: this.clientMstId,
      Login_User_Id: this.login_user_id,
      login_user_id: this.login_user_id,
      Secret_Key: this.secretKey,
      Customer_ID: this.Cbs_CustomerID,
      Tran_Mode: 'ALL',
      Flag: flag,
      Bene_Type_Flag: this.BeneficiaryTypeFlag,
      Bene_Account_Number: this.accountNo,
      Bene_Name: this.beneneficiaryName,
      Bene_Nickname: this.nickName,
      Bene_Address: this.address,
      Bene_Pincode: this.pinCode,
      Bene_Mobno: this.mobileNo,
      Bene_Emailid: this.emailId,
      Bene_Relation: this.BenRel,
      Ifsc_Code: this.IFSC,
      Bank_Name: this.bank == '' ? '' : this.bank,                 // Bank
      Bank_Branch_Name: this.branch == undefined ? '' : this.branch,        // Branch
      Branch_Location: this.Location == undefined ? '' : this.Location,       // Location
      Max_Tran_Limit: this.TransferLimit,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      url: this.url,
      Session_Id: this.sessionId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Beneficiary_ID: this.BeneficiaryId,
      TPIN: this.tpin,
      Source: 'Desktop',
      Device_Id: 'Desktop',
      Accept_Reject: 'Y',
    };
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualPay/Bene_Save', ParamsObj, this).subscribe(data => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        //response code ==00
        if (data.cursor1[0].RESPONSE_CODE == '00') {

          // if (flag == "R" || flag == "M") {
          //   // this.otpConfirmation(flag, data);
          //   this.addRemoveBeneficiary = false;
          //   this.RRN_No = data.cursor1[0].RRN_NUMBER
          // }
          // else {
          //   this.addRemoveBeneficiary = false;
          //   this.RRN_No = data.cursor1[0].RRN_NUMBER;
          //   // this.otpConfirmation(flag, data);
          // }
          if (data.cursor1[0].RESPONSE_CODE == '00') {
            this.CBS_TranID = data.cursor1[0].CBSTRNREFNO;
            var msg;
            if (this.pFlag == "R") {
              this.message = "Beneficiary Account Deleted successfully.";
            } else if (this.pFlag == "N") {
              this.message = "Beneficiary Account Added successfully.";
            } else if (this.pFlag == "M") {
              this.message = "Beneficiary Account Updated successfully.";
            }
            this.statusMsg = this.message;
            this.showTOPUP = true;
            if (this.showTOPUP == true) {
              $(document).ready(function () {
                $("#TopupDialog").modal('show');
              });
            }
          }
          else {
            this.message = data.cursor1[0].RESPONSE_MESSAGE;
            MessageBox.show(this.dialog, this.message, "");
            return false;
          }
        }
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
      // this.clearPage();
      // this.benBack();
    });
  }



  //Beneficiary Otp Process
  benOtpProcess() {
    var paramObj = {
      Request_From: 'WB',
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Client_Mst_Id: this.clientMstId,
      Secret_Key: this.secretKey,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
      Customer_ID: this.Cbs_CustomerID,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Request_Mode: 26, //this.Request_Mode,,
      Trancode: 200,//this.Trancode,
      Accept_Reject: 'Y',
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      Reject_Reason: '',
      CBS_OTP: this.otpCntrl.otp,
      RRN_Number: this.RRN_No,
      url: this.url
    }
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualPay/Authorize', paramObj, this).subscribe((data) => {
      this.spinner.hide();


      if (data != null && data != undefined) {
        if (data.Po_Error != null) {
          this.message = data.Po_Error;
          MessageBox.show(this.dialog, this.message, "");
        }
        else {
          if (data.code === 1) {
            if (data.cursor1[0].RESPONSE_CODE == '00') {
              this.CBS_TranID = data.cursor1[0].CBSTRNREFNO;
              var msg;
              if (this.pFlag == "R") {
                this.message = "Beneficiary Account Deleted successfully.";
              } else if (this.pFlag == "N") {
                this.message = "Beneficiary Account Added successfully.";
              } else if (this.pFlag == "M") {
                this.message = "Beneficiary Account Updated successfully.";
              }
              // this.message = 'CBS TranID:- ' + this.CBS_TranID + ' ' + data.cursor1[0].RESPONSE_MESSAGE;
              // msg = 'Your Referance ID is ' + this.CBS_TranID + ' .';
              // MessageBox.show(this.dialog, this.message, msg, "");
              this.statusMsg = this.message;
              this.showTOPUP = true;
              if (this.showTOPUP == true) {
                $(document).ready(function () {
                  $("#TopupDialog").modal('show');
                });
              }
              this.otpCntrl.otp = '';
              this.showVpayOtp = "hide";
              this.otpCntrl.hideOtp();
              // this.router.navigate(['/bank']);
              // this.clearPage();
            }
            else {
              this.message = data.cursor1[0].RESPONSE_MESSAGE;
              MessageBox.show(this.dialog, this.message, "");
              return false;
            }
          }
          else if (data.code === 0) {
            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
          }
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    this.otpCntrl.otp = '';
  }

  //beneficiary User data on select
  onUserDetail(obj) {
    this.accountNo = obj.ACCOUNT_NO;
    this.beneneficiaryName = obj.ACCOUNT_NAME;
    this.emailId = obj.EMAILID;
    this.address = obj.ADDRESS;
    this.TransferLimit = '';
    this.pinCode = obj.PINCODE;
  }

  //Page Data Delete
  clearPage() {
    this.accountNo = null;
    this.beneneficiaryName = ''; this.nickName = '';
    this.IFSC = '';
    this.padBottom = "";
    this.tpin = "";
    this.mobileNo = ''; this.address = ''; this.TransferLimit = '';
    this.pinCode = null;
    this.BenRel = null;
    this.clearIFSC();
  }

  //mobile no. list fetch btn
  accbtnClose() {
    this.showUserModal = "hideModal";
    // this.clearPage();
  }



  //pop up model  Bank
  OpenIfscPage() {
    this.Disp_ifscpage = true;
    this.clearIFSC();
  }

  SearchBank() {
    // bind Bank name from ifsc_code_master
    var uinput = {
      userid: 1,
      keyword: "BANK",
      device_id: "Desktop"
    };
    this.spinner.show();
    this.common.getBankIFSCData(uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1) {
          this.clsClass = "DispBlock";
          this.bankdata = data.cursor1;
        } else {
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log("institution master")
    );
  }

  setBankName(item) {
    this.state = "";
    this.statedata = null;
    this.city = "";
    this.citydata = null;
    this.branch = "";
    this.IFSC_CODE = '';
    this.branchdata = null;
    this.Disp_ifscnotfound = false;
    this.Disp_ifsclabel = false;
    let bankname = this.bankdata.filter(a => a.DESCRIPTION == item);
    if (bankname.length > 0) {
      this.bank = bankname[0].DESCRIPTION;
      this.SearchBankState();
    } else {
      this.bank = "";
    }
  }

  SearchBankState() {
    // bind Bank state name from ifsc_code_master
    var uinput = {
      userid: 1,
      keyword: "BANKSTATE" + "~" + this.bank,
      device_id: "Desktop"
    };
    this.common.getBankIFSCData(uinput, this).subscribe(
      data => {
        if (data.code === 1) {
          this.clsClass = "DispBlock";
          this.statedata = data.cursor1;
        } else {
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log("institution master")
    );
  }

  setBankState(item) {
    this.city = "";
    this.citydata = null;
    this.branch = "";
    this.branchdata = null;
    this.Disp_ifscnotfound = false;
    this.Disp_ifsclabel = false;
    let statename = this.statedata.filter(a => a.DESCRIPTION == item);
    if (statename.length > 0) {
      this.state = statename[0].DESCRIPTION;
      this.SearchBankCity();
    } else {
      this.state = "";
    }
  }

  SearchBankCity() {
    // bind Bank state name from ifsc_code_master
    var uinput = {
      userid: 1,
      keyword: "BANKCITY" + "~" + this.bank + "~" + this.state,
      device_id: "Desktop"
    };
    this.common.getBankIFSCData(uinput, this).subscribe(
      data => {
        if (data.code === 1) {
          this.clsClass = "DispBlock";
          this.citydata = data.cursor1;
        } else {
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log("institution master")
    );
  }

  setBankCity(item) {
    // bind Bank city name from ifsc_code_master
    this.branch = "";
    this.branchdata = null;
    this.Disp_ifscnotfound = false;
    this.Disp_ifsclabel = false;
    let cityname = this.citydata.filter(a => a.DESCRIPTION == item);
    if (cityname.length > 0) {
      this.city = cityname[0].DESCRIPTION;
      this.SearchBankBranch();
    } else {
      this.city = "";
    }
  }

  SearchBankBranch() {
    // bind Bank branch name from ifsc_code_master
    var uinput = {
      userid: 1,
      keyword: "BRANCH" + "~" + this.bank + "~" + this.state + "~" + this.city,
      device_id: "Desktop"
    };
    this.common.getBankIFSCData(uinput, this).subscribe(
      data => {
        if (data.code === 1) {
          this.clsClass = "DispBlock";
          this.branchdata = data.cursor1;
        } else {
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log("institution master")
    );
  }

  setBankBranch(item) {
    let branchname = this.branchdata.filter(a => a.DESCRIPTION == item);
    if (branchname.length > 0) {
      this.branch = branchname[0].DESCRIPTION;
      this.ifsc = branchname[0].IFSC_CODE;
      this.Disp_ifsclabel = true;
      this.Disp_ifscnotfound = false;
    } else {
      this.branch = "";
      this.Disp_ifsclabel = false;
      this.Disp_ifscnotfound = true;
    }
  }

  SetIFSC() {
    if (this.bank == "" || this.bank == undefined) {
      this.message = "Select Bank Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    } else if (this.state == "" || this.state == undefined) {
      this.message = "Select State Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    } else if (this.city == "" || this.city == undefined) {
      this.message = "Select City Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    } else if (this.branch == "" || this.branch == undefined) {
      this.message = "Select Branch Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.IFSC = this.ifsc;
    this.padBottom = "padding-bot";
    this.Disp_ifscpage = false;
    // const ifscpage = this.renderer2.selectRootElement(".modal-backdrop");
    // setTimeout(() => ifscpage.remove(), 0);
  }


  otpConfirmation(flag, data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (flag == "R") {
      dialogConfig.data = {
        id: 1,
        title: "OTP Verification Required !",
        content: "Do you want to remove beneficiary?",
      };
    }
    if (flag == "M") {
      dialogConfig.data = {
        id: 1,
        title: "OTP Verification Required !",
        content: "Do you want to modify beneficiary?",
      };
    }
    else {
      dialogConfig.data = {
        id: 1,
        title: "OTP Verification Required !",
        content: "Do you want to Add beneficiary?",
      };
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

      if (result == true) {
        this.RRN_No = data.cursor1[0].RRN_NUMBER,
          this.addRemoveBeneficiary = false;
        this.showVpayOtp = "show";
        this.otpCntrl.placeholder = 'Enter OTP';
        data.po_OTPExpDur = data.cursor1[0].OTP_EXPDURATION;
        this.otpCntrl.showOtp(data, this);
      }
      if (result == false) {
        this.benBack();
      }
    });
  }






  clearIFSC() {
    this.state = "";
    this.statedata = null;
    this.city = "";
    this.citydata = null;
    this.branch = "";
    this.branchdata = null;
    this.bank = null; this.branch = null;
    this.Disp_ifsclabel = false;
    this.branch = undefined;
    this.Disp_ifscnotfound = false;
  }


  ConverToDecimal() {
    if (parseFloat(this.TransferLimit))
      this.TransferLimit = parseFloat(this.TransferLimit).toFixed(2);
  }

  Get_IFSC_BankBranch() {
    this.bank = null; this.branch = null;
    if (this.IFSC == undefined || this.IFSC == null || this.IFSC.toString().trim() == "") {
      this.message = "Enter IFSC.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.IFSC.trim().length < 11) {
      this.message = "Enter Valid IFSC.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    var uinput = {
      // opKeyword: "IFSC",
      IFSC: this.IFSC.toUpperCase(),
      Request_From: 'WB',
      Bank_Reg_Mst_Id: this.BANK_REG_MST_ID,
      Client_Mst_ID: this.clientMstId,
      Client_Mst_Id: this.clientMstId,
      Secret_Key: this.secretKey,
      Session_Id: this.sessionId,
      Source: 'Desktop',
      Device_Id: 'Desktop',
      Customer_ID: this.Cbs_CustomerID,
      Inet_Corp_Id: this.InetCorpoID,
      Inet_User_Id: this.InetUserID,
      Inet_Corporate_Flag: this.InetCorpFlag,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      url: this.url
    }
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/Get_Bank_Branch', uinput, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.bank = data.cursor1[0].BANK_NAME;
        this.branch = data.cursor1[0].BRANCHNAME;
        this.padBottom = "padding-bot";
        this.bankAddress = data.cursor1[0].ADDRESS;
      } else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
    return false;

  }


}

export interface MiniStatementData {
  TRAN_DATE: string;
  PARTICULAR: string;
  DR_AMOUNT: string;
  CR_AMOUNT: string;
  LINE_BALANCE: string;
}

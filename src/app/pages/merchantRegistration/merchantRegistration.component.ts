import { Component, OnInit, ViewChild, ElementRef, EventEmitter, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataStorage } from '../../core/dataStorage';
import { Service } from './service';
import { GlobalState } from '../../global.state';

import * as moment from 'moment';
import { ErrorHandler } from '../../core/errorHandler';
import { dtp } from '../../shared/component/dtp/dtp.component';
import { ApiService } from '../../core/api.service';
import { Spinner } from "../../services/spinner";
import { ICore } from '../../interface/core';
import { ILogin } from '../../interface/login';
import { Help } from '../../shared/component/help/help.component';
import { Toast } from '../../services/toast';
import { Common } from '../../services/common';
import { Otp } from '../../shared/component/otp/otp.component';
import { IOtp } from '../../interface/otp';

import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-merchantRegistration',
  templateUrl: './merchantRegistration.component.html',
  styleUrls: ['./merchantRegistration.component.scss'],
  providers: [Service, Spinner, Common]
})

export class MerchantRegistrationComponent implements OnInit {
  @ViewChildren(Help) helpElement: QueryList<Help>;
  @ViewChildren(Otp) otpCntrl: QueryList<Otp>;
  @ViewChild(dtp) dtp: dtp; SetControlValue: string; _gatewaydetid: number = 0;
  mobileNo: any;
  password: any;
  clientMstId: number;
  login_user_id: string;
  Insti_Sub_Mst_Id: string = "";
  Insti_Mst_Id: string = "";
  Math: any;
  imgSize: number = 25; //in kb
  profilePhoto: string = "assets/images/profile-img.png";
  addImage: string = "assets/images/image.png";
  code: number;
  msg: string = "";
  data: Array<any>;
  businessSectionShow: boolean = false;
  labelFadeClass: string = "";

  countryLabel: string = "Country";
  countryKey: string = "CONTMAST";
  //txtCountryData: string;

  stateLabel: string = "State";
  stateKey: string = "STATEMAST";
  stateCode: string;
  txtStateData: string;

  distLabel: string = "District";
  distKey: string = "DISTMAST";
  distCode: string;

  tahasilLabel: string = "Tahasil";
  tahasilKey: string = "TAHMAST";
  tahasilCode: string;

  cityLabel: string = "City";
  cityKey: string = "CITYMAST";
  cityCode: string;

  identityProofLabel: string = "Identity Proof";
  identityProofKey: string = "DM~I";
  identityProofCode: string;
  identityProofList: any;

  addressProofLabel: string = "Address Proof";
  addressProofKey: string = "DM~A";
  addressProofCode: string;
  addressProofList: any;

  custTypeLabel: string = "Customer Type";
  custTypeKey: string = "CUSTMAST";
  custTypeCode: string;
  custTypeList: any;

  businessLineLabel: string = "Business Line";
  businessLineKey: string = "BUSIL";
  businessLineCode: string;
  businessLineList: any;

  businessTypeLabel: string = "Business Type";
  businessTypeKey: string = "BUSIT";
  businessTypeCode: string;
  businessTypeList: any;

  businessProofLabel: string = "Business Document Proof";
  businessProofKey: string = "DM~C" //"BUSIP";
  businessProofCode: string;
  businessProofList: any;

  //bankProofLabel: any;
  //bankProofId: number;
  //bankProofList:any;

  bankProofLabel: string = "Bank Document Proof";
  bankProofKey: string = "DM~B" //"BUSIP";
  bankProofCode: string;
  bankProofList: any;
  bankProof: any;
  dealerLabel: string = "Dealer Name";
  dealerKey: string = "DEALERM";
  dealerCode: string;

  taxableFlagLabel: string = "Taxable Flag";
  taxableFlagKey: string = "YESNO";
  taxableFlagCode: string = "Y";

  companyFlagLabel: string = "Composite Flag";
  companyFlagKey: string = "YESNO";
  companyFlagCode: string = "Y";

  accountTypeLabel: string = "Account Type";
  accountTypeKey: string = "ACTY";
  accountTypeCode: string = "SB";



  ClientReqDetId: number;

  loginuserid: string = '';
  clientname: string = '';
  clientFName: string = '';
  clientMName: string = '';
  clientLName: string = '';
  dob: string = '';
  aadharNumber: string = '';
  businessdet: string = '';


  businessAddress: string = '';
  panNumber: string = '';
  tan: string = '';
  gstin: string = '';
  gstRegDate: string = '';
  compFlag: string = '';
  acNo: string = '';
  acName: string = '';
  IFSC_CODE: string = '';
  ifsc: string = '';
  address: string = '';
  pinCode: string = '';
  landmark: string = '';
  areaName: string = '';
  cityname: string = '';




  countryCode: string;
  mobileno: string = '';
  phoneno: string = '';
  email: string = '';
  website: string = '';
  approvalflag: string = 'N';
  taxflag: string = '';
  clientlanguage: string = '';

  addressproof: any;

  businessproof: any;

  identityproof: any;
  clientphoto: any;
  activestatusdate: string = '';
  msgshowhide: string = '';
  DisplayMsg: string = '';
  Disp_ClientReqDetCode: boolean = false;
  Disp_SearchAllRecord: boolean = true;
  Disp_Submit: boolean = true;
  submitbutton: string = 'Save';
  helpData: any;
  clsClass: any = 'DispNone';
  pages: Array<any>;
  PageData: Array<any>;
  filesToUpload: Array<File> = [];
  cheque: any;
  logInfo: ILogin;
  msgType: string = "";
  option = {
    position: 'top-center',
    showClose: true,
    timeout: 5000,
    theme: 'bootstrap',
    type: this.msgType,
    closeOther: false,
    msg: ''
  }
  gstname: any;
  //bank IFSC
  bank: any;
  bankdata: any;
  state: any;
  statedata: any;
  city: any;
  citydata: any;

  branchdata: any;
  BANK_NAME: any;
  STATE_NAME: any;
  CITY_NAME: any;
  BRANCH_NAME: any;
  //for Ifsc code
  bank_name: any;
  branch: any;
  BankData: any;
  Disp_ifsclabel: boolean = false;
  Disp_ifscnotfound: boolean = false;
  Disp_ifscpage: boolean = false;
  otpElement: any;


  //mobile Banking
  BankList: any = [];
  listarray: any = [];
  showBankList = "show";
  showOverlay = "show";
  merchantForm = "hide";
  showcbsForm = "hide";
  cbsFormShow = "hide";
  bankObject: any;
  title: string = '';
  AC_NUMBER: any = "";
  DOB: any;
  Mobile_Number: any;
  Customer_ID: any;
  OpFlag: any = 'N';
  SECRET_KEY: any = '';
  showOtp = 'hide';
  RRN_Number: any = '';
  otp: any = '';
  clientpic: any;
  prof3: any;


  sessionId: any;
  opFlag: any = 'N';
  showTab1Class: string = "content-current";
  showTab2Class: string = "";
  showTab3Class: string = "";
  imageSizecp = " Size of file should be between 5kb–25kb";
  imageSizeAd: string = " Size of file should be between 5kb–25kb";
  imageSizeId: string = " Size of file should be between 5kb–25kb";
  imageSizeBp: string = " Size of file should be between 5kb–25kb";
  imageSizeCcp: string = " Size of file should be between 5kb–25kb";
  imageSizePrp: string = " Size of file should be between 5kb–25kb";

  //dialog

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

  constructor(private elementRef: ElementRef, private dialog: MatDialog, private route: ActivatedRoute, private errorHandler: ErrorHandler, private router: Router,
    public service: Service, private dataStorage: DataStorage, private _state: GlobalState, private toast: Toast,
    private renderer2: Renderer2, private common: Common, private apiService: ApiService, private spinner: Spinner) {

    this.clientpic = "data:image/png;base64,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";
    //this.clientpic="data:image/png;base64,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";
    this.prof3 = 'data:image/png;base64,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';

    this.taxflag = 'Y';
    this.compFlag = 'Y';
    this.taxableFlagCode = 'Y';
    //this.stateKey = "STATEMAST~"+this.service.stateCode;
    if (this.route.queryParams["_value"].mode == 'N') {

      this.Disp_ClientReqDetCode = false;
      this.Disp_SearchAllRecord = false;
    }
    else {
      this.Disp_ClientReqDetCode = true;
      this.Disp_SearchAllRecord = true;
    }

    if (this.route.queryParams["_value"].approvalFlag && this.route.queryParams["_value"].approvalFlag == 'R') {
      this.ClientReqDetId = this.route.queryParams["_value"].reqDetId;
      this.opFlag = 'U';
      this.getClientData();
    } else {
      this.ClientReqDetId = 0;
    }

    this.SearchCustType(this.custTypeKey);
    this.SearchCustType(this.addressProofKey);
    this.SearchCustType(this.identityProofKey);
    this.SearchCustType(this.businessLineKey);
    this.SearchCustType(this.businessTypeKey);
    this.SearchCustType(this.businessProofKey);
    this.SearchCustType(this.bankProofKey);


    //this.fillDDL(this.custTypeKey,this.custTypeList, this.custTypeCode);

  }


  ngOnInit() {

    this.logInfo = this.dataStorage.logInfo;
    this.mobileno = this.logInfo[0].LOGIN_USER_ID;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';
    this.Insti_Mst_Id = this.logInfo[0].INSTI_MST_ID != null ? this.logInfo[0].INSTI_MST_ID : '';
    this.sessionId = this.logInfo.sessionId;
    this.labelFadeClass = "fadeLabel";

    document.getElementById("sp1").style.color = "green";
    if (document.getElementById("sp2")) {
      document.getElementById("sp2").style.color = "black";
      document.getElementById("sp3").style.color = "black";
    }

    const txtFirstname = this.renderer2.selectRootElement('#txtFirstname');
    setTimeout(() => txtFirstname.focus(), 0);
    this.SearchBank();
    this.Get_BankList();
  }

  //Mobile Bank
  Get_BankList() {
    this.spinner.show();
    var paramObj = {
      Device_Id: "Desktop",
      request_from: "WB"
      // Client_Mst_ID: this.CLIENT_MST_ID,
      // Customer_ID: 12940,
      // CORPORATE_FLAG: this.CORPORATE_FLAG
    };
    this.apiService.sendToServer<ICore>("/api/virtualpay/Get_VPAYBANK", paramObj, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code == 1 && data.msg.toUpperCase() == "SUCCESS") {
          this.showBankList = "show";
          this.showOverlay = "show";
          this.BankList = data.cursor1;
          var list;
          for (var i = 0; i < this.BankList.length; i++) {
            list = {
              BANK_NAME: this.BankList[i].BANK_NAME,
              BANK_LOGO: this.BankList[i].BANK_LOGO == null ? "" : this.arrayBufferToBase64(this.BankList[i].BANK_LOGO.data),
              BANK_REG_MST_ID: this.BankList[i].BANK_REG_MST_ID,
              SECRET_KEY: this.BankList[i].SECRET_KEY,
              URL: this.BankList[i].URL,
              // CBS_CUSTOMER_ID: this.BankList[i].CBS_CUSTOMER_ID
            };
            this.listarray.push(list);
          }
          this.BankList = this.listarray;
        }
        
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      }
    );
    return false;
  }



  ngAfterViewInit() {
    this.otpElement = this.otpCntrl.find(a => a.eid == 'otp');
    // this.secretKeyElement =  this.otpCntrl.find(a=>a.eid=='seceretKey');
  }

  // btnClose() {
  //   // this.showProdList = 'show';
  //   this.showBankList = "hide ";
  //   this.showOverlay = "hide";
  // this.merchantForm = "show";
  // }

  toggleTab(secVar) {
    if (secVar === 'Section1') {
      this.showTab1Class = "content-current";
      this.showTab2Class = "";
      this.showTab3Class = "";
      document.getElementById("sp1").style.color = "green";
      if (document.getElementById("sp2")) {
        document.getElementById("sp2").style.color = "black";
        document.getElementById("sp3").style.color = "black";
      }
    }
    else if (secVar === 'Section2') {
      // if (!this.identityProofCode || (this.identityProofCode && this.identityProofCode.toString().trim().length == 0)) {
      //   // this.showTab1Class = "content-current";
      //   // this.showTab2Class = "";
      //   // this.showTab3Class = "";
      //   // return false;
      // }
      // else if (!this.addressProofCode == undefined || this.addressProofCode.toString().trim().length == 0) {
      //   // this.showTab1Class = "content-current";
      //   // this.showTab2Class = "";
      //   // this.showTab3Class = "";
      //   // return false;
      // }
      // else if (!this.addressproof) {
      //   // this.showTab1Class = "content-current";
      //   // this.showTab2Class = "";
      //   // this.showTab3Class = "";
      //   // return false;
      // }
      // else if (!this.identityproof) {
      //   this.showTab1Class = "content-current";
      //   this.showTab2Class = "";
      //   this.showTab3Class = "";
      //   return false;
      // }
      this.showTab1Class = "";
      document.getElementById("sp1").style.color = "black";
      if (this.businessSectionShow) {
        this.showTab2Class = "content-current";
        this.showTab3Class = "";
        if (document.getElementById("sp2")) {
          document.getElementById("sp2").style.color = "green";
          document.getElementById("sp3").style.color = "black";
        }
      }
      else {
        this.showTab2Class = "";
        this.showTab3Class = "content-current";
        if (document.getElementById("sp2")) {
          document.getElementById("sp2").style.color = "black";
          document.getElementById("sp3").style.color = "green";
        }

        if (this.clientFName && this.clientFName.trim().length > 0)
          this.acName = this.clientFName.trim();
        if (this.clientMName && this.clientMName.trim().length > 0)
          this.acName += " " + this.clientMName.trim();
        if (this.clientLName && this.clientLName.trim().length > 0)
          this.acName += " " + this.clientLName.trim();

      }
      return;
    }
    else if (secVar === 'PSection2') {
      this.showTab1Class = "";
      if (this.businessSectionShow) {
        this.showTab2Class = "content-current";
        this.showTab3Class = "";
        if (document.getElementById("sp2"))
          document.getElementById("sp2").style.color = "green";
      }
      else {
        this.showTab3Class = "";
        this.showTab1Class = "content-current";
        document.getElementById("sp1").style.color = "green";
      }
      document.getElementById("sp3").style.color = "black";


    }
    else if (secVar === 'Section3') {

      // if (!this.businessproof) {
      //   this.showTab2Class = "content-current";
      //   this.showTab3Class = "";
      //   this.showTab1Class = "";
      //   return false;
      // }
      this.showTab1Class = "";
      this.showTab2Class = "";
      this.showTab3Class = "content-current";
      if (this.clientFName && this.clientFName.trim().length > 0)
        this.acName = this.clientFName.trim();
      if (this.clientMName && this.clientMName.trim().length > 0)
        this.acName += " " + this.clientMName.trim();
      if (this.clientLName && this.clientLName.trim().length > 0)
        this.acName += " " + this.clientLName.trim();
      document.getElementById("sp1").style.color = "black";
      if (document.getElementById("sp2")) {
        document.getElementById("sp2").style.color = "black";
        document.getElementById("sp3").style.color = "green";
      }
    }
  }
  SearchCustType(keyword) {
    var uinput = {
      userid: 1,
      keyword: keyword,
      device_id: 'Desktop',
    }
    this.spinner.show();
    this.service.Search(uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1) {
          this.clsClass = 'DispBlock';
          switch (keyword) {
            case 'CUSTMAST': this.custTypeList = data.cursor1; this.custTypeCode = data.cursor1[0].KEY;
              this.businessSectionShow = this.custTypeCode.split('-')[1] == "I" ? false : true; break;
            case 'DM~A': this.addressProofList = data.cursor1; this.addressProofCode = data.cursor1[0].KEY; break;
            case 'DM~B': this.bankProofList = data.cursor1; this.bankProofCode = data.cursor1[0].KEY; break;
            case 'DM~C': this.businessProofList = data.cursor1; this.businessProofCode = data.cursor1[0].KEY; break;
            case 'DM~I': this.identityProofList = data.cursor1; this.identityProofCode = data.cursor1[0].KEY; break;
            case 'BUSIT': this.businessTypeList = data.cursor1; this.businessTypeCode = data.cursor1[0].KEY; break;
            case 'BUSIL': this.businessLineList = data.cursor1; this.businessLineCode = data.cursor1[0].KEY; break;
            default:
              break;
          }
        }
        else {

        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
        // this.option.msg=err;
        // this.toast.addToast(this.option);
      },
      // () => console.log('code master')
    );
  }
  fillDDL(keyword, listObj, selectedField) {
    var uinput = {
      userid: 1,
      keyword: 'CUSTMAST',
      device_id: 'Desktop',
    }
    this.spinner.show();
    this.service.Search(uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1 && data.cursor1.length > 0) {
          listObj = data.cursor1;
          selectedField = data.cursor1[0].KEY;
        }
        else {
          return null;
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
        // this.option.msg=err;
        // this.toast.addToast(this.option);
      },
      // () => console.log("client request details")
    );
  }


  //ngDoCheck(){
  //let logInfo:ILogin = this.dataStorage.logInfo;

  //}

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
      if (obj.SetControlValue == 'dob')
        this.dob = obj.mydate;
      if (obj.SetControlValue == 'DOB')
        this.DOB = obj.mydate;
      if (obj.SetControlValue == 'gstRegDate')
        this.gstRegDate = obj.mydate;
      if (obj.SetControlValue == 'activestatusdate')
        this.activestatusdate = obj.mydate;
    }
  }


  validation(val) {
    if (val == 'li' && this.loginuserid.toString().trim().length != 10) {
      this.message = "Enter 10 Digit Login User Id / Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      this.loginuserid = '';
    }
    else if (val == 'an' && this.aadharNumber.toString().trim().length != 12) {
      this.message = "Enter 12 Digit Aadhar Number.";
      MessageBox.show(this.dialog, this.message, "");
      this.aadharNumber = '';
    }
    else if (val == 'pc' && this.pinCode.toString().trim().length != 6) {
      this.message = "Enter 6 Digit PIN CODE.";
      MessageBox.show(this.dialog, this.message, "");
      this.pinCode = '';
    }
    else if (val == 'mn' && this.mobileno.toString().trim().length != 10) {
      this.message = "Enter 10 Digit Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      this.mobileno = '';
    }
  }

  gotoLogout() {
    let paramObj = {
      login_user_id: this.mobileNo
    }
    let pageObj = this;
    if (!confirm("Do you want to logout?"))
      return false;
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/auth/merchant/logout', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data && data.msg === 'Success') {
        this.mobileNo = '';
        this.password = '';
        this.message = "Logout Successfully.";
        MessageBox.show(this.dialog, this.message, "");
        this.router.navigate(['/home']);
      }

    });
  }



  showPopUp(v, obj) {

    switch (v) {
      case 'AP': let divPopUp: HTMLDivElement = obj.elementRef.nativeElement.querySelector('#popupAP');
        divPopUp.style.display = "block";
        break;
      case 'BP': let divPopUpBP: HTMLDivElement = obj.elementRef.nativeElement.querySelector('#popupBP');
        divPopUp.style.display = "block";
        break;
      case 'IP': let divPopUpIP: HTMLDivElement = obj.elementRef.nativeElement.querySelector('#popupIP');
        divPopUpIP.style.display = "block";
        break;

      default:
        break;
    }


  }
  hide(obj, keyword) {
    obj.elementRef.nativeElement.querySelector('#' + keyword).style.display = 'none';
  }
  bytesToSize(bytes) {

    this.Math = Math;
    let sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 0;
    var i = parseInt(this.Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  }
  fileSelected(fileInput: any, obj, elmFlag) {
    let dataURL = '';
    let self = this;
    let imgElm = obj.elementRef.nativeElement.querySelector('#imgId' + elmFlag);
    let imgId = imgElm.id;
    let tmpImgSize = obj.bytesToSize(fileInput.currentTarget.files[0].size);
    if (tmpImgSize.indexOf('MB') > -1 || parseFloat(tmpImgSize) > this.imgSize) {
      // if (obj.elementRef.nativeElement.querySelector('#warnsize' + elmFlag))
      //   obj.elementRef.nativeElement.querySelector('#warnsize' + elmFlag).style.display = 'block';
      //fileInput.currentTarget = null;
      imgElm.src = "assets/images/image.png";
      if (imgId == 'imgIdAddressProof') {
        this.imageSizeAd = 'Your file size must less than 25kb';
      }
      else if (imgId == 'imgIdfilePrfPhoto') {
        this.imageSizeId = 'Your file size must less than 25kb';
      }
      else if (imgId == 'imgIdIdentityProof') {
        this.imageSizeId = 'Your file size must less than 25kb';
      }
      else if (imgId == 'imgIdBusinessProof') {
        this.imageSizeBp = 'Your file size must less than 25kb';
      }
      else if (imgId == 'imgIdCancelChequeProof') {
        this.imageSizeCcp = 'Your file size must less than 25kb';
      }
      else if (imgId == 'imgIdCancelChequeProof') {
        this.imageSizePrp = 'Your file size must less than 25kb';
      }


      return false;
    }
    // if (obj.elementRef.nativeElement.querySelector('#success' + elmFlag))
    //   obj.elementRef.nativeElement.querySelector('#success' + elmFlag).style.display = 'block';
    // if (obj.elementRef.nativeElement.querySelector('#cross' + elmFlag))
    //   obj.elementRef.nativeElement.querySelector('#cross' + elmFlag).style.display = 'none';
    // if (obj.elementRef.nativeElement.querySelector('#view' + elmFlag))
    //   obj.elementRef.nativeElement.querySelector('#view' + elmFlag).style.display = 'block';
    // if (obj.elementRef.nativeElement.querySelector('#msg' + elmFlag))
    //   obj.elementRef.nativeElement.querySelector('#msg' + elmFlag).style.display = 'block';
    // if (obj.elementRef.nativeElement.querySelector('#trash' + elmFlag))
    //   obj.elementRef.nativeElement.querySelector('#trash' + elmFlag).style.display = 'block';
    // if (obj.elementRef.nativeElement.querySelector('#size' + elmFlag))
    //   obj.elementRef.nativeElement.querySelector('#size' + elmFlag).style.display = 'none';

    // if (obj.elementRef.nativeElement.querySelector('#fileinfo' + elmFlag))
    //   obj.elementRef.nativeElement.querySelector('#fileinfo' + elmFlag).style.display = 'block';
    // if (obj.elementRef.nativeElement.querySelector('#filename' + elmFlag))
    //   obj.elementRef.nativeElement.querySelector('#filename' + elmFlag).innerHTML = 'Name: ' + fileInput.currentTarget.files[0].name;

    // if (obj.elementRef.nativeElement.querySelector('#filesize' + elmFlag))
    //   obj.elementRef.nativeElement.querySelector('#filesize' + elmFlag).innerHTML = 'Size: ' + tmpImgSize;
    // if (obj.elementRef.nativeElement.querySelector('#filetype' + elmFlag))
    //   obj.elementRef.nativeElement.querySelector('#filetype' + elmFlag).innerHTML = 'Type: ' + fileInput.currentTarget.files[0].type;

    // obj.elementRef.nativeElement.querySelector('#filedim'+elmFlag).innerHTML = 'Dimension: ' + fileInput.currentTarget.files[0].naturalWidth + ' x ' + fileInput.currentTarget.files[0].naturalHeight;

    //let imgElm = obj.elementRef.nativeElement.querySelector('#imgId' + elmFlag);
    let reader = new FileReader();
    let canvas = document.createElement("canvas");
    let canvasContext = canvas.getContext("2d");

    if (imgId == 'imgIdAddressProof') {
      this.imageSizeAd = 'File Uploaded Successfully.';
      this.addressproof = null;
    }
    else if (imgId == 'imgIdIdentityProof') {
      this.imageSizeId = 'File Uploaded Successfully.';
      this.identityproof = null;
    }
    else if (imgId == 'imgIdBusinessProof') {
      this.imageSizeBp = 'File Uploaded Successfully.';
      this.businessproof = null;
    }
    else if (imgId == 'imgIdCancelChequeProof') {
      this.imageSizeCcp = 'File Uploaded Successfully.';
      this.bankProof = null;
    }
    else if (imgId == 'imgIdfilePrfPhoto') {
      this.imageSizePrp = 'File Uploaded Successfully.';
      this.bankProof = null;
    }


    imgElm.onload = function () {

      //Set canvas size is same as the picture
      canvas.width = imgElm.width;
      canvas.height = imgElm.height;
      // draw image into canvas element
      canvasContext.drawImage(imgElm, 0, 0, canvas.width, canvas.height);
      // get canvas contents as a data URL (returns png format by default)
      dataURL = canvas.toDataURL();
      switch (fileInput.srcElement.id) {
        case 'fileAddressProof': self.addressproof = dataURL; break;
        case 'fileIdentityProof': self.identityproof = dataURL; break;
        case 'fileBusinessProof': self.businessproof = dataURL; break;
        case 'filePrfPhoto': self.clientphoto = dataURL; break;
        case 'fileCancelChequeProof': self.bankProof = dataURL; break;
        default: break;
      }
    }

    reader.onload = function (e: any) {
      imgElm.src = e.target.result;
    }
    reader.readAsDataURL(fileInput.target.files[0]);



  }
  fileChangeEvent(fileInput: any, obj) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    let imgElm = obj.elementRef.nativeElement.querySelector('#prfImage');
    let reader = new FileReader();

    let canvas = document.createElement("canvas");
    let canvasContext = canvas.getContext("2d");

    imgElm.onload = function () {

      //Set canvas size is same as the picture
      canvas.width = 100;
      canvas.height = 100;
      // draw image into canvas element
      canvasContext.drawImage(imgElm, 0, 0, 100, 100);
      // get canvas contents as a data URL (returns png format by default)
      let dataURL = canvas.toDataURL();

    }
    reader.onload = function (e: any) {
      imgElm.src = e.target.result;
    }
    reader.readAsDataURL(fileInput.target.files[0]);

  }

  //Image array to base64 string
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

  onChangeAcType() {
    this.acName = '';
    this.acNo = '';
    this.IFSC_CODE = '';
    // this.bankProofCode='';

    let fileElm = this.elementRef.nativeElement.querySelector('#fileCancelChequeProof');
    fileElm.src = "/assets/images/image.png";
    fileElm.value = "";
    let imgElm = this.elementRef.nativeElement.querySelector('#imgIdCancelChequeProof');
    imgElm.src = "/assets/images/image.png";
    imgElm.value = "";
    this.bankProof = null;
  }

  saveClientData() {
    var uinput = {
      client_req_det_id: this.ClientReqDetId,
      customer_type: this.custTypeCode.split('-')[0],
      login_user_id: this.mobileno,
      client_name: this.clientFName + ' ' + this.clientMName + ' ' + this.clientLName,
      client_fname: this.clientFName,
      client_mname: this.clientMName == undefined ? '' : this.clientMName,
      client_lname: this.clientLName,
      date_of_birth: (this.dob && this.dob.trim().length == 0) || (!this.dob) ? null : moment(this.dob).format('DD-MMM-YYYY'),
      business_details: this.businessSectionShow == true ? this.businessdet : '',
      business_type: this.businessSectionShow == true ? this.businessTypeCode : '',
      bussiness_line: this.businessSectionShow == true ? this.businessLineCode : '',
      business_address: this.businessSectionShow == true ? this.businessAddress : '',
      aadhar_number: this.aadharNumber.toString().replace(/ /g, ""),
      pan_number: this.panNumber,
      tan_number: this.tan,
      gstin: this.gstin,
      gst_reg_date: this.gstRegDate.trim().length == 0 ? null : moment(this.gstRegDate).format('DD-MMM-YYYY'),
      comp_flag: this.compFlag,
      bank_ac_number: this.acNo,
      Bank_Ac_Name: this.acName,
      bank_ifsc: this.IFSC_CODE,
      address_1: this.address,
      pin_code: this.pinCode,
      landmark_name: this.landmark,
      area_name: this.areaName,
      city_name: this.cityname,
      city_code: this.cityCode,
      tahasil_code: this.tahasilCode,
      district_code: this.distCode,
      state_code: this.stateCode,
      country_code: this.countryCode,
      mobile_no: this.mobileno,
      phone_1: this.phoneno,
      email_id: this.email,
      website: this.website,
      approval_flag: 'P',
      taxable_flag: this.taxflag,
      bank_ac_type: this.accountTypeCode,
      client_language: 'E',// this.clientlanguage,
      Dealer_Mst_Id: this.dealerCode,
      address_id: this.addressProofCode,
      address_proof: this.addressproof,
      business_id: this.businessSectionShow == true ? this.businessProofCode : 25,
      Business_proof: this.businessproof,
      identity_id: this.identityProofCode,
      identity_proof: this.identityproof,
      client_photo: this.clientphoto,
      Bank_Proof: this.bankProof,
      Bank_ProofID: this.bankProofCode,
      active_status_date: moment(Date.now()).format('DD-MMM-YYYY'),
      enter_user_id: 0,
      enter_desc: this.clientFName, //+ ' ' + this.clientMName + ' ' + this.clientLName
      opflag: this.opFlag,
      request_from: 'WB',
      device_id: 'Desktop',
      reject_reason: ' ',

    }
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/auth/merchant/addClient', uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1 && data.status === "RNF") {
          // alert("Your Request Send Successfully ,Now You Can Login.");
          this.message = "Your Request Send Successfully ,Now You Can Login.";
          MessageBox.show(this.dialog, this.message, "");
          this.clear();
          this.router.navigate(['/home']);
        }
        else {
          // alert("check error");
          this.message = "Check Error.";
          MessageBox.show(this.dialog, this.message, "");
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
        //this.clear();

      },
      // () => console.log('client request details')
    );
  }

  getClientData() {
    var uinput = {
      client_req_det_id: this.ClientReqDetId,
      customer_type: '',
      login_user_id: '',
      client_name: '',
      client_fname: '',
      client_mname: '',
      client_lname: '',
      date_of_birth: '',
      business_details: '',
      business_type: '',
      bussiness_line: '',
      business_address: '',
      aadhar_number: '',
      pan_number: '',
      tan_number: '',
      gstin: '',
      gst_reg_date: '',
      comp_flag: '',
      bank_ac_number: '',
      bank_ifsc: '',
      address_1: '',
      pin_code: '',
      landmark_name: '',
      area_name: '',
      city_name: '',
      city_code: '',
      tahasil_code: '',
      district_code: '',
      state_code: '',
      country_code: '',
      mobile_no: '',
      phone_1: '',
      email_id: '',
      website: '',
      approval_flag: '',
      taxable_flag: '',
      bank_ac_type: '',
      client_language: 'E',// this.clientlanguage,
      Dealer_Mst_Id: '',
      address_id: '',
      address_proof: '',
      business_id: '',
      Business_proof: '',
      identity_id: '',
      identity_proof: '',
      client_photo: '',
      Bank_Proof: '',
      Bank_ProofID: '',
      active_status_date: '',
      enter_user_id: 0,
      enter_desc: '',
      opflag: 'V',
      request_from: 'WB',
      device_id: 'Desktop',
      reject_reason: ' ',
      Cbs_Customer_Id: '',
      Inet_Corp_Id: '',
      Inet_User_Id: '',
      Inet_Corporate_Flag: 'I',
      Cbs_Customer_Mobno: '',
      Bank_Reg_Mst_Id: '',
      Insti_Sub_Mst_Id: '',
      Thumb_Active_Flag: '',
      Thumb_Device_Det: '',
      Thumb_Device_No: '',
      Thumb_Mst_Id: '',

    }
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/auth/merchant/addClient', uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1 && data.msg === "Success") {

          this.custTypeCode = data.cursor1[0].CUSTOMER_TYPE + '-' + data.cursor1[0].CODE_VALUE;
          this.loginuserid = data.cursor1[0].LOGIN_USER_ID;
          this.clientname = data.cursor1[0].CLIENT_NAME;
          this.clientFName = data.cursor1[0].CLIENT_FNAME;
          this.clientMName = data.cursor1[0].CLIENT_MNAME;
          this.clientLName = data.cursor1[0].CLIENT_LNAME;
          this.dob = (data.cursor1[0].DATE_OF_BIRTH && data.cursor1[0].DATE_OF_BIRTH.trim().length == 0) || (!data.cursor1[0].DATE_OF_BIRTH) ? null : moment(data.cursor1[0].DATE_OF_BIRTH).format('DD-MMM-YYYY'),
            this.aadharNumber = data.cursor1[0].AADHAR_NUMBER;
          this.businessdet = data.cursor1[0].BUSINESS_DETAILS;
          this.businessTypeCode = data.cursor1[0].BUSINESS_TYPE;
          this.businessLineCode = data.cursor1[0].BUSSINESS_LINE;
          this.businessAddress = data.cursor1[0].BUSINESS_ADDRESS;
          this.panNumber = data.cursor1[0].PAN_NUMBER;
          this.tan = data.cursor1[0].TAN_NUMBER;
          this.gstin = data.cursor1[0].GSTIN;
          this.gstRegDate = moment(data.cursor1[0].GST_REG_DATE).format('DD/MMM/YYYY');
          this.compFlag = data.cursor1[0].COMP_FLAG;
          this.acNo = data.cursor1[0].BANK_AC_NUMBER;
          this.acName = data.cursor1[0].BANK_AC_NAME;
          this.IFSC_CODE = data.cursor1[0].BANK_IFSC;
          this.address = data.cursor1[0].ADDRESS_1;
          this.pinCode = data.cursor1[0].PIN_CODE;
          this.SearchPincode();
          this.landmark = data.cursor1[0].LANDMARK_NAME;
          this.areaName = data.cursor1[0].AREA_NAME;
          let page = this;
          this.helpElement.forEach(input => {
            switch (input.eid) {

              case 'country': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].COUNTRY; page.countryCode = data.cursor1[0].COUNTRY_CODE; input.elementRef.nativeElement.children[0].children[1].className = "fadeLabel"; break;
              case 'state': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].STATE; page.stateCode = data.cursor1[0].STATE_CODE; input.elementRef.nativeElement.children[0].children[1].className = "fadeLabel"; break;
              case 'district': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].DISTRICT; page.distCode = data.cursor1[0].DISTRICT_CODE; input.elementRef.nativeElement.children[0].children[1].className = "fadeLabel"; break;
              case 'tahasil': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].TAHASIL; page.tahasilCode = data.cursor1[0].TAHASIL_CODE; input.elementRef.nativeElement.children[0].children[1].className = "fadeLabel"; break;
              case 'city': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].CITY; page.cityCode = data.cursor1[0].CITY_CODE; input.elementRef.nativeElement.children[0].children[1].className = "fadeLabel"; break;
              default: break;
            }
          });
          this.mobileno = data.cursor1[0].MOBILE_NO;
          this.phoneno = data.cursor1[0].PHONE_1;
          this.email = data.cursor1[0].EMAIL_ID;
          this.website = data.cursor1[0].WEBSITE;
          // this.approvalflag = data.data[0].APPROVAL_FLAG;
          this.taxflag = data.cursor1[0].TAXABLE_FLAG;
          this.accountTypeCode = data.cursor1[0].BANK_AC_TYPE;
          this.clientlanguage = data.cursor1[0].CLIENT_LANGUAGE;
          this.addressProofCode = data.cursor2[0].DOCUMENT_MST_ID;

          let imgElmAddProof = this.elementRef.nativeElement.querySelector('#imgIdAddressProof');
          let imgElmIdProof = this.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
          let imgElmBusiProof = this.elementRef.nativeElement.querySelector('#imgIdBusinessProof');
          let imgElmCanChqProof = this.elementRef.nativeElement.querySelector('#imgIdCancelChequeProof');

          if (data.cursor2[0].DOCUMENT_IMAGE) {
            this.addressproof = this.arrayBufferToBase64(data.cursor2[0].DOCUMENT_IMAGE.data);
            imgElmAddProof.src = this.addressproof;
          }
          else {
            imgElmAddProof.src = "assets/images/image.png";
          }
          if (data.cursor2[1].DOCUMENT_IMAGE) {
            this.identityproof = this.arrayBufferToBase64(data.cursor2[1].DOCUMENT_IMAGE.data);
            imgElmIdProof.src = this.identityproof;
          }
          else {
            imgElmIdProof.src = "assets/images/image.png";
          }
          if (data.cursor2[2].length > 0) {
            this.businessproof = this.arrayBufferToBase64(data.cursor2[2].DOCUMENT_IMAGE.data);
            imgElmBusiProof.src = this.businessproof;
          }
          else {
            imgElmBusiProof.src = "assets/images/image.png";
          }
          if (data.cursor2[3].DOCUMENT_IMAGE) {
            this.bankProof = this.arrayBufferToBase64(data.cursor2[3].DOCUMENT_IMAGE.data);
            imgElmCanChqProof.src = this.bankProof;
          }
          else {
            imgElmCanChqProof.src = "assets/images/image.png";
          }

          this.identityProofCode = data.cursor2[1].DOCUMENT_MST_ID;
          this.businessProofCode = data.cursor2[2].DOCUMENT_MST_ID;
          this.bankProofCode = data.cursor2[3].DOCUMENT_MST_ID;
          this.clientphoto = this.arrayBufferToBase64(data.cursor1[0].CLIENT_PHOTO);
          this.activestatusdate = moment(data.cursor1[0].ACTIVE_STATUS_DATE).format('DD/MMM/YYYY');
        }
        else {
          this.message = "Check Error.";
          MessageBox.show(this.dialog, this.message, "");
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
        //this.clear();
      },
      // () => console.log('client request details')
    );
  }
  SearchPincode() {
    if (this.pinCode && this.pinCode.toString().trim().length != 6) {
      this.message = "Enter 6 Digit PIN CODE";
      MessageBox.show(this.dialog, this.message, "");
      return;
    }

    // for clear control
    this.helpElement.forEach(input => {
      switch (input.eid) {
        case 'country':
          input.elementRef.nativeElement.children[0].children[0].value = '';
          this.countryCode = '';
          break;
        case 'state':
          input.elementRef.nativeElement.children[0].children[0].value = '';
          this.stateCode = '';
          break;
        case 'district':
          input.elementRef.nativeElement.children[0].children[0].value = '';
          this.distCode = '';
          break;
        case 'tahasil':
          input.elementRef.nativeElement.children[0].children[0].value = '';
          this.tahasilCode = '';
          break;
        case 'city':
          input.elementRef.nativeElement.children[0].children[0].value = '';
          this.cityCode = '';
          break;
        default: break;
      }
    });
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/auth/merchant/GetPinCodeData', { PinCode: this.pinCode, Device_Id: 'Desktop' }, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1) {
          const txtAddress = this.renderer2.selectRootElement('#txtAddress');
          setTimeout(() => txtAddress.focus(), 500);
          this.countryCode = data.cursor1[0].CODE_MST_ID;
          this.stateCode = data.cursor1[1].CODE_MST_ID;
          this.distCode = data.cursor1[2].CODE_MST_ID;
          this.tahasilCode = data.cursor1[3].CODE_MST_ID;
          this.cityCode = data.cursor1[4].CODE_MST_ID;
          let page = this;
          this.helpElement.forEach(input => {
            switch (input.eid) {
              case 'country': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].CODE_DESCRIPTION;
                input.elementRef.nativeElement.children[0].children[0].className = input.elementRef.nativeElement.children[0].children[0].className.replace('ng-invalid', 'ng-valid');
                page.countryCode = data.cursor1[0].CODE_MST_ID; break;
              case 'state': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[1].CODE_DESCRIPTION;
                input.elementRef.nativeElement.children[0].children[0].className = input.elementRef.nativeElement.children[0].children[0].className.replace('ng-invalid', 'ng-valid');
                page.stateCode = data.cursor1[1].CODE_MST_ID; break;
              case 'district': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[2].CODE_DESCRIPTION;
                input.elementRef.nativeElement.children[0].children[0].className = input.elementRef.nativeElement.children[0].children[0].className.replace('ng-invalid', 'ng-valid');
                page.distCode = data.cursor1[2].CODE_MST_ID; break;
              case 'tahasil': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[3].CODE_DESCRIPTION;
                input.elementRef.nativeElement.children[0].children[0].className = input.elementRef.nativeElement.children[0].children[0].className.replace('ng-invalid', 'ng-valid');
                page.tahasilCode = data.cursor1[3].CODE_MST_ID; break;
              case 'city': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[4].CODE_DESCRIPTION;
                input.elementRef.nativeElement.children[0].children[0].className = input.elementRef.nativeElement.children[0].children[0].className.replace('ng-invalid', 'ng-valid');
                page.cityCode = data.cursor1[4].CODE_MST_ID; break;
              default: break;
            }
          });

        }
        else {
          this.message = "Record not Found.";
          MessageBox.show(this.dialog, this.message, "");
          this.clear();
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
        //this.clear();

      },
      // () => console.log('client request details')
    );

  }
  submit = function () {

    if (this.clientFName == undefined || this.clientFName.toString().trim().length == 0) {
      this.message = "Enter First Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.clientLName == undefined || this.clientLName.toString().trim().length == 0) {
      this.message = "Enter Last name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    // else if (this.aadharNumber == undefined || this.aadharNumber.toString().trim().length == 0) {
    //   alert("Enter Aadhar No.");
    //   // this.option.msg="Enter Aadhar No.";
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (this.panNumber == undefined || this.panNumber.toString().trim().length == 0) {
    //   // alert("Enter Pan No.");
    //   this.option.msg="Enter Pan No.";
    //   this.option.type ='error';
    //   this.toast.addToast(this.option);
    //   return;
    // }
    // else if (this.pinCode == undefined || this.pinCode.toString().trim().length == 0) {
    //   alert("Enter Pin Code.");
    //   // this.option.msg="Enter Pin Code.";
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    else if (this.address == undefined || this.address.toString().trim().length == 0) {
      this.message = "Enter Address.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    // else if (this.countryCode == undefined || this.countryCode.toString().trim().length == 0) {
    //   alert("Select Country Name.");
    //   // this.option.msg="Select Country Name.";
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (this.stateCode == undefined || this.stateCode.toString().trim().length == 0) {
    //   alert("Select State Name.");
    //   // this.option.msg="Select State Name.";
    //   // this.option.type ='error';
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (this.distCode == undefined || this.distCode.toString().trim().length == 0) {
    //   alert("Select District Name.");
    //   // this.option.msg="Select District Name.";
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (this.tahasilCode == undefined || this.tahasilCode.toString().trim().length == 0) {
    //   alert("Select Tahasil Name.");
    //   // this.option.msg="Select Tahasil Name.";
    //   // this.option.type ='error';
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (this.addressProofCode == undefined || this.addressProofCode.toString().trim().length == 0) {
    //   alert("Enter Address Proof Document Name.");
    //   // this.option.msg="Enter Address Proof Document Name.";
    //   // this.option.type ='error';
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // // else if (this.elementRef.nativeElement.querySelector('#fileAddressProof').files.length == 0) {
    // //   alert("Upload Address Proof document.");
    // //   return;
    // // }
    // else if (this.cityCode == undefined || this.cityCode.toString().trim().length == 0) {
    //   alert("Select City Name.");
    //   // this.option.msg="Select City Name.";
    //   // this.option.type ='error';
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (!this.identityProofCode == undefined || (this.identityProofCode && this.identityProofCode.toString().trim().length == 0)) {
    //   alert("Select Identity Proof document name.");
    //   // this.option.msg="Select Identity Proof document name.";
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (this.elementRef.nativeElement.querySelector('#fileIdentityProof').files.length == 0) {
    //   alert("Upload Identity Proof document.");
    //   return;
    // }
    // else if (this.dob == undefined || this.dob.trim().length == 0) {
    //   // alert("Enter Date of Birth");
    //   this.option.msg="Enter Date of Birth";
    //   this.option.type ='error';
    //   this.toast.addToast(this.option);
    //   return;
    // }
    else if (this.custTypeCode == undefined || this.custTypeCode.toString().trim().length == 0) {
      this.message = "Select Customer type.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    //else if (this.dealerCode == undefined || this.dealerCode.toString().trim().length == 0) {
    //alert("Select Dealer Name.");
    //return;
    //}

    //TODO
    // else if (!this.acName || (this.acName && this.acName.toString().trim().length == 0)) {
    //   alert("Enter Account Name.");
    //   return false;
    // }
    // else if (!this.acNo || (this.acNo && this.acNo.toString().trim().length == 0)) {
    //   alert("Enter Account No.");
    //   return false;
    // }
    // else if (this.ifsc == undefined || this.ifsc.toString().trim().length == 0) {
    //   alert("Enter IFSC Code.");
    //   // this.option.msg="Enter IFSC Code.";
    //   // this.option.type ='error';
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (this.accountTypeCode == undefined || this.accountTypeCode.toString().trim().length == 0) {
    //   alert("Select Account Type.");
    //   // this.option.msg="Select Account Type.";
    //   // this.option.type ='error';
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (!this.bankProof) {
    //   alert("Upload bank Proof document.");
    //   return false;
    // }
    // if (this.custTypeCode != "11-I" && this.businessproof == undefined) {
    //   // alert("Upload Business Proof document.");
    //   this.showTab2Class = "content-current";
    //   this.showTab3Class = "";
    //   return false;
    // }

    // else if (this.gstRegDate == undefined || this.gstRegDate == '') {
    //   alert("Enter GST Registration Date.");
    //   return;
    // }
    // else if (this.businessProofCode == undefined || this.businessProofCode.toString().trim().length == 0) {
    //   alert("Enter Business Code");
    //   return;
    // }


    this.dealerCode = 1;

    return this.saveClientData();

  }

  onChangeInputData(event, helpType) {
    switch (helpType) {
      // case 'C': this.countryCode=event; break;
      // case 'S': this.stateCode = (event!=null && event!=undefined)?event.KEY:''; this.distKey = 'DISTMAST~'+this.stateCode; break;
      // case 'D': this.distCode = (event!=null && event!=undefined)?event.KEY:''; this.tahasilKey = 'TAHMAST~'+this.distCode; break;
      // case 'T': this.tahasilCode = (event!=null && event!=undefined)?event.KEY:''; this.cityKey = 'CITYMAST~'+this.tahasilCode; break;
      case 'CT': this.cityname = event; break;
      // case 'AP': this.addressProofCode = (event!=null && event!=undefined)?event.KEY:'';  break;
      // case 'IP': this.identityProofCode = (event!=null && event!=undefined)?event.KEY:''; break;
      // case 'CUST': this.custTypeCode = (event!=null && event!=undefined)?event.KEY:''; break;
      // case 'BUSIP': this.businessProofCode = (event!=null && event!=undefined)?event.KEY:''; break;
      // case 'DEALERM': this.dealerCode = (event!=null && event!=undefined)?event.KEY:''; break;
      // case 'TAXF': this.taxableFlagCode = (event!=null && event!=undefined)?event.KEY:''; break;
      // case 'COMPF': this.compFlag = (event!=null && event!=undefined)?event.KEY:''; break;
      // case 'ACTY': this.accountTypeCode = (event!=null && event!=undefined)?event.KEY:''; break;
      default: break;
    }
  }
  clearCountry() {

  };
  onClickHelpData(event, helpType) {
    switch (helpType) {
      case 'C':
        this.countryCode = (event != null && event != undefined) ? event.KEY : '';
        this.service.stateKey = 'STATEMAST~' + this.countryCode;
        this.helpElement.forEach(input => {
          switch (input.eid) {
            case 'state': input.dataList = null; input.elementRef.nativeElement.children[0].children[0].value = ''; this.stateCode = ''; break;
            case 'district': input.dataList = null; input.elementRef.nativeElement.children[0].children[0].value = ''; this.distCode = ''; break;
            case 'tahasil': input.dataList = null; input.elementRef.nativeElement.children[0].children[0].value = ''; this.tahasilCode = ''; break;
            case 'city': input.dataList = null; input.elementRef.nativeElement.children[0].children[0].value = ''; this.cityCode = ''; break;
            default: break;
          }
        });
        //this.service.stateKey = '';
        //this.txtStateData = '';
        break;
      case 'S': this.stateCode = (event != null && event != undefined) ? event.KEY : '';
        this.service.distKey = 'DISTMAST~' + this.stateCode;
        this.helpElement.forEach(input => {
          switch (input.eid) {
            case 'district': input.dataList = null; input.elementRef.nativeElement.children[0].children[0].value = ''; this.distCode = ''; break;
            case 'tahasil': input.dataList = null; input.elementRef.nativeElement.children[0].children[0].value = ''; this.tahasilCode = ''; break;
            case 'city': input.dataList = null; input.elementRef.nativeElement.children[0].children[0].value = ''; this.cityCode = ''; break;
            default: break;
          }
        });

        break;
      case 'D': this.distCode = (event != null && event != undefined) ? event.KEY : ''; this.service.tahasilKey = 'TAHMAST~' + this.distCode;
        this.helpElement.forEach(input => {
          switch (input.eid) {
            case 'tahasil': input.dataList = null; input.elementRef.nativeElement.children[0].children[0].value = ''; this.tahasilCode = ''; break;
            case 'city': input.dataList = null; input.elementRef.nativeElement.children[0].children[0].value = ''; this.cityCode = ''; break;
            default: break;
          }
        });
        break;
      case 'T': this.tahasilCode = (event != null && event != undefined) ? event.KEY : ''; this.service.cityKey = 'CITYMAST~' + this.tahasilCode;
        this.helpElement.forEach(input => {
          switch (input.eid) {
            case 'city': input.dataList = null; input.elementRef.nativeElement.children[0].children[0].value = ''; this.cityCode = ''; break;
            default: break;
          }
        });
        break;
      case 'CT': this.cityCode = (event != null && event != undefined) ? event.KEY : ''; break;
      case 'AP': this.addressProofCode = (event != null && event != undefined) ? event : ''; break;
      case 'IP': this.identityProofCode = (event != null && event != undefined) ? event : ''; break;
      case 'CUST': this.businessSectionShow = this.custTypeCode.split('-')[1] == "I" ? false : true; break;
      case 'BUSIP': this.businessProofCode = (event != null && event != undefined) ? event : ''; break;
      case 'DEALERM': this.dealerCode = (event != null && event != undefined) ? event : ''; break;
      case 'TAXF': this.taxableFlagCode = (event != null && event != undefined) ? event : ''; break;
      case 'COMPF': this.compFlag = (event != null && event != undefined) ? event : ''; break;
      case 'ACTY': this.accountTypeCode = (event != null && event != undefined) ? event : ''; break;
      //case 'BUSIL': this.businessLineCode = (event != null && event != undefined) ? event.KEY : ''; break;
      //case 'BUSIT': this.businessTypeCode = (event != null && event != undefined) ? event.KEY : ''; break;

      default: break;
    }
  }




  SearchDocMast() {
    var uinput = {
      userid: 1,
      keyword: 'DM',
      device_id: 'Desktop',
    }
    // this.service.Search(uinput, this).subscribe(
    //   data => {
    //     if (data.code === 1) {
    //       this.clsClass = 'DispBlock';
    //       this.helpData = data.cursor1;
    //     }
    //     else {

    //     }
    //   },
    //   err => {
    //     
    //     this.message = err; 
    // MessageBox.show(this.dialog, this.message, "");
    //   },
    //   () => console.log('document master'));
  }

  //pop up model
  OpenIfscPage() {
    this.Disp_ifscpage = true;
    this.clearIFSC();
  }

  SearchBank() { // bind Bank name from ifsc_code_master 
    this.spinner.show();
    var uinput = {
      userid: 1,
      keyword: 'BANK',
      device_id: 'Desktop',
    }
    this.common.getBankIFSCData(uinput, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code === 1) {
        this.clsClass = 'DispBlock';
        this.bankdata = data.cursor1;
      }
      else {

      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('institution master')
    );

  }


  setBankName(item) {
    this.state = ''; this.statedata = null;
    this.city = ''; this.citydata = null;
    this.branch = ''; this.branchdata = null;
    this.Disp_ifscnotfound = false;
    this.Disp_ifsclabel = false;
    let bankname = this.bankdata.filter((a) => a.DESCRIPTION == item);
    if (bankname.length > 0) {
      this.bank = bankname[0].DESCRIPTION;
      this.SearchBankState();
    }
    else {
      this.bank = '';
    }
  }

  SearchBankState() { // bind Bank state name from ifsc_code_master 
    this.spinner.show();
    var uinput = {
      userid: 1,
      keyword: 'BANKSTATE' + '~' + this.bank,
      device_id: 'Desktop',
    }
    this.common.getBankIFSCData(uinput, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code === 1) {
        this.clsClass = 'DispBlock';
        this.statedata = data.cursor1;
      }
      else {

      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('institution master')
    );

  }

  setBankState(item) {
    this.city = ''; this.citydata = null;
    this.branch = ''; this.branchdata = null;
    this.Disp_ifscnotfound = false;
    this.Disp_ifsclabel = false;
    let statename = this.statedata.filter((a) => a.DESCRIPTION == item);
    if (statename.length > 0) {
      this.state = statename[0].DESCRIPTION;
      this.SearchBankCity();
    }
    else {
      this.state = '';
    }
  }

  SearchBankCity() { // bind Bank state name from ifsc_code_master 
    this.spinner.show();
    var uinput = {
      userid: 1,
      keyword: 'BANKCITY' + '~' + this.bank + '~' + this.state,
      device_id: 'Desktop',
    }
    this.common.getBankIFSCData(uinput, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code === 1) {
        this.clsClass = 'DispBlock';
        this.citydata = data.cursor1;
      }
      else {
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('institution master')
    );

  }

  setBankCity(item) { // bind Bank city name from ifsc_code_master
    this.branch = ''; this.branchdata = null;
    this.Disp_ifscnotfound = false;
    this.Disp_ifsclabel = false;
    let cityname = this.citydata.filter((a) => a.DESCRIPTION == item);
    if (cityname.length > 0) {
      this.city = cityname[0].DESCRIPTION;
      this.SearchBankBranch();
    }
    else {
      this.city = '';
    }
  }

  SearchBankBranch() { // bind Bank branch name from ifsc_code_master 
    this.spinner.show();
    var uinput = {
      userid: 1,
      keyword: 'BRANCH' + '~' + this.bank + '~' + this.state + '~' + this.city,
      device_id: 'Desktop',
    }
    this.common.getBankIFSCData(uinput, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code === 1) {
        this.clsClass = 'DispBlock';
        this.branchdata = data.cursor1;
      }
      else {
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('institution master')
    );

  }

  setBankBranch(item) {
    let branchname = this.branchdata.filter((a) => a.DESCRIPTION == item);
    if (branchname.length > 0) {
      this.branch = branchname[0].DESCRIPTION;
      this.ifsc = branchname[0].IFSC_CODE;
      this.Disp_ifsclabel = true;
      this.Disp_ifscnotfound = false;
    }
    else {
      this.branch = '';
      this.Disp_ifsclabel = false;
      this.Disp_ifscnotfound = true;
    }
  }

  SetIFSC() {

    if (this.bank == '' || this.bank == undefined) {
      this.message = "Select Bank Name";
      MessageBox.show(this.dialog, this.message, "");
      return;
    }
    else if (this.state == '' || this.state == undefined) {
      this.message = "Select State Name";
      MessageBox.show(this.dialog, this.message, "");
      return;
    }
    else if (this.city == '' || this.city == undefined) {
      this.message = "Select City Name";
      MessageBox.show(this.dialog, this.message, "");
      return;
    }
    else if (this.branch == '' || this.branch == undefined) {
      this.message = "Select BranchName";
      MessageBox.show(this.dialog, this.message, "");
      return;
    }
    this.IFSC_CODE = this.ifsc;
    this.Disp_ifscpage = false;
    const ifscpage = this.renderer2.selectRootElement('.modal-backdrop');
    setTimeout(() => ifscpage.remove(), 0);

  }

  clearIFSC() {
    this.bank = '';
    this.state = '';
    this.statedata = null;
    this.city = '';
    this.citydata = null;
    this.branch = '';
    this.branchdata = null;
    this.Disp_ifsclabel = false;
    this.branch = undefined;
    this.Disp_ifscnotfound = false;
  }

  close() {
    this.clsClass = 'DispNone';
  }

  Back() {
    this.showOverlay = "show";
    this.showBankList = "show";
    this.cbsFormShow = "hide";
    this.ClearCbsForm();
  }


  ClearCbsForm() {
    this.AC_NUMBER = '';
    // this.DEFAULT_FLAG = '';
    // this.Bank_Ac_Type = '';
    // this.bank_name = '';
    // this.branch_name = undefined;
    this.DOB = '';
    this.Mobile_Number = '';
    this.Customer_ID = '';
  }

  clear = function () {
    // let imgElm = this.elementRef.nativeElement.querySelector('#imgIdAddressProof');
    // imgElm.src = "assets/images/image.png";
    // imgElm = this.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
    // imgElm.src = "assets/images/image.png";
    // imgElm = this.elementRef.nativeElement.querySelector('#imgIdBusinessProof');
    // imgElm.src = "assets/images/image.png";
    // imgElm = this.elementRef.nativeElement.querySelector('#imgIdCancelChequeProof');
    // imgElm.src = "assets/images/image.png";
    this.companycode = '';
    this.ClientReqDetId = '';
    this.custTypeCode = '';
    this.loginuserid = '';
    this.clientname = '';
    this.clientFName = '';
    this.clientMName = '';
    this.clientLName = '';
    this.dob = '';
    this.aadharNumber = '';
    this.businessdet = '';
    this.businessTypeCode = '';
    this.businessLineCode = '';
    this.businessAddress = '';
    this.panNumber = '';
    this.tan = '';
    this.gstin = '';
    this.gstRegDate = '';
    this.compFlag = 'Y';
    this.acNo = '';
    this.acName = '';
    this.ifsc = '';
    this.address = '';
    this.pinCode = '';
    this.landmark = '';
    this.areaName = '';
    this.cityname = '';
    this.cityCode = '';
    this.tahasilCode = '';
    this.distCode = '';
    this.stateCode = '';
    this.countryCode = '';
    this.mobileno = '';
    this.phoneno = '';
    this.email = '';
    this.website = '';
    this.approvalflag = '';
    this.gstname = '';
    this.taxflag = 'Y';
    this.accountTypeCode = '';
    this.clientlanguage = '';
    this.addressProofCode = '';
    this.addressproof = null;
    this.businessProofCode = '';
    this.businessproof = null;
    this.identityProofCode = '';
    this.identityproof = null;
    this.clientphoto = null;
    this.bankProof = null;
    this.activestatusdate = '';
  }



  //Mobile Banking
  selectBank(bankObj) {
    this.showBankList = "hide";
    this.showOverlay = "hide";

    if (bankObj.BANK_REG_MST_ID && bankObj.BANK_REG_MST_ID != 0) {
      this.title = 'Bank Account';
      this.cbsFormShow = "show";
      this.showcbsForm = "show";
    } else {
      // this.addNewTab = "show";
      this.merchantForm = "show";
    }

    this.bankObject = bankObj;

  }

  SaveCbs() {
    //NEW BANK DETAILS TO INSERT

    let Customer_ID = this.Customer_ID;
    if (Customer_ID == undefined || Customer_ID.length == 0) {
      this.message = "Enter Customer ID.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    let AC_NUMBER = this.AC_NUMBER;
    if (AC_NUMBER == undefined || AC_NUMBER.length == 0) {
      this.message = "Enter Account Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    let Mobile_Number = this.Mobile_Number;
    if (Mobile_Number == undefined || Mobile_Number.length == 0) {
      this.message = "Enter Mobile Number";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (Mobile_Number.length != 10) {
      this.message = "Enter Valid Mobile Number";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    let DOB = this.DOB;
    if (DOB == undefined) {
      this.message = "Enter Date of Birth";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.OpFlag = 'N';
    this.BankProcess()
  }




  //pflag ='N'= NEW, ' = UPDATE,   D= DELETE
  //Bank Registration Process
  BankProcess() {

    var paramObj = {
      Client_Mst_Id: this.logInfo[0].LOGIN_USER_ID,//this.logInfo[0].CLIENT_MST_ID,
      Bank_Reg_Mst_Id: this.bankObject.BANK_REG_MST_ID,
      CBS_AcNo: this.AC_NUMBER,
      Customer_ID: this.Customer_ID,
      DOB: this.DOB,
      Mobile_No: this.Mobile_Number,
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: this.logInfo[0].LOGIN_USER_ID,
      Insti_Sub_Mst_Id: (this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : ''),
      CORPORATE_FLAG: this.logInfo[0].CORPORATE_FLAG,
      Corporate_Flag: this.logInfo[0].CORPORATE_FLAG,
      Secret_Key: this.bankObject.SECRET_KEY,
      Session_Id: this.sessionId,
      url: this.bankObject.URL,
      Source: 'Desktop',
    }
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualPay/RegOTPProcess', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        //response code ==00
        if (data.cursor1[0].RESPONSE_CODE == '00') {
          this.RRN_Number = data.cursor1[0].RRN_NUMBER
          this.showOtp = 'show';
          this.otpElement.placeholder = 'Enter OTP';
          data.po_OTPExpDur = '10';
          this.otpElement.showOtp(data);
        }
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


  //bank Registration Process
  bankRegistraionProcess() {

    this.spinner.show();
    var paramObj = {
      Client_Mst_Id: this.logInfo[0].LOGIN_USER_ID,
      Bank_Reg_Mst_Id: this.bankObject.BANK_REG_MST_ID,
      CBS_AcNo: this.AC_NUMBER,
      Customer_ID: this.Customer_ID,
      DOB: this.DOB,
      Mobile_No: this.Mobile_Number,
      login_user_id: this.logInfo[0].LOGIN_USER_ID,
      Insti_Sub_Mst_Id: (this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : ''),
      CORPORATE_FLAG: this.logInfo[0].CORPORATE_FLAG,
      Corporate_Flag: this.logInfo[0].CORPORATE_FLAG,
      OTP: this.otpElement.otp,
      RRN_Number: this.RRN_Number,
      Secret_Key: this.bankObject.SECRET_KEY,

    }
    this.apiService.sendToServer<IOtp>('/api/virtualpay/Bank_Registration_Process', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data != null && data != undefined) {
        if (data.Po_Error != null) {
          this.message = data.Po_Error;
          MessageBox.show(this.dialog, this.message, "");
        }
        else {
          if (data.code === 1) {
            if (data.cursor1[0].RESPONSE_CODE == '00') {
              this.getCustomerData();
            }
            else {
              this.message = data.cursor1[0].RESPONSE_MESSAGE;
              MessageBox.show(this.dialog, this.message, "");
              return false;
            }
          }
          else if (data.code === 0) {
          }
        }
      }
    }, err => {
      this.spinner.hide();
      var msgobj = {
        mtype: 'Mandatory',
        msg: err,
      }
      this.errorHandler.handlePageError(err);
      this.spinner.hide();
      // this.loadingService.toggleLoadingIndicator(false);
    });
    this.otp = '';

  }

  //Customer Info
  getCustomerData() {
    var paramObj = {
      Client_Mst_Id: this.logInfo[0].LOGIN_USER_ID,
      Customer_ID: this.Customer_ID,
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: this.logInfo[0].LOGIN_USER_ID,
      Insti_Sub_Mst_Id: (this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : ''),
      CORPORATE_FLAG: this.logInfo[0].CORPORATE_FLAG,
      Corporate_Flag: this.logInfo[0].CORPORATE_FLAG,
      Bank_Reg_Mst_Id: this.bankObject.BANK_REG_MST_ID,
      Secret_Key: this.bankObject.SECRET_KEY,
      Inet_Corp_Id: '',
      Inet_User_Id: '',
      Inet_Corporate_Flag: 'I',
      Session_Id: this.sessionId,
      Source: 'Desktop',
    }
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/Customer_Info', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        var userobj = data.cursor1;
        if (userobj != null)
          // if (this.logInfo.po_approvalflag == 'N') {
          this.SignUp_data(userobj);
        // }
        // else {
        //   this.LinkBankAcc(userobj);
        // }
        // this.Cleardata();
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

  //Register User 
  SignUp_data(userObj) {
    var paramObj = {
      client_req_det_id: '0',
      customer_type: 11,
      login_user_id: this.logInfo[0].LOGIN_USER_ID,
      client_fname: userObj[0].CLIENT_FNAME,
      client_mname: userObj[0].CLIENT_MNAME == null || userObj[0].CLIENT_MNAME == null ? '' : userObj[0].CLIENT_MNAME,
      client_lname: userObj[0].CLIENT_LNAME,
      client_name: userObj[0].CLIENT_NAME,
      aadhar_number: userObj[0].AADHAR_NUMBER == null ? '' : userObj[0].AADHAR_NUMBER,
      pan_number: userObj[0].PAN_NUMBER == null ? '' : userObj[0].PAN_NUMBER.toUpperCase(),
      tan_number: userObj[0].TAN_NUMBER == null ? '' : userObj[0].TAN_NUMBER.toUpperCase(),
      gstin: userObj[0].GSTIN == null ? '' : userObj[0].GSTIN.toUpperCase(),
      gst_reg_date: userObj[0].GST_REG_DATE == null ? '' : userObj[0].GST_REG_DATE,
      comp_flag: 'Y',
      bank_ac_name: userObj[0].ACNAME == null ? "" : userObj[0].ACNAME.trim(),
      bank_ac_number: userObj[0].ACNO == null ? this.AC_NUMBER : userObj[0].ACNO,
      bank_ifsc: userObj[0].IFSCCODE == null ? '' : userObj[0].IFSCCODE.toUpperCase(),
      bank_ac_type: userObj[0].ACTYPE,
      address_1: userObj[0].ADDRESS_1 == null ? "" : userObj[0].ADDRESS_1.trim(),
      pin_code: userObj[0].PIN_CODE == null ? 0 : userObj[0].PIN_CODE,
      landmark_name: userObj[0].LANDMARK_NAME == null ? '' : userObj[0].LANDMARK_NAME.trim(),
      area_name: userObj[0].AREA_NAME == null ? '' : userObj[0].AREA_NAME.trim(),
      city_name: userObj[0].CITY_NAME == null ? '' : userObj[0].CITY_NAME,
      city_code: userObj[0].CITY_CODE == null ? 0 : userObj[0].CITY_CODE,
      tahasil_code: userObj[0].TAHSIL_CODE == null ? 0 : userObj[0].TAHSIL_CODE,
      district_code: userObj[0].DISTRICT_CODE == null ? 0 : userObj[0].DISTRICT_CODE,
      state_code: userObj[0].STATE_CODE == null ? 0 : userObj[0].STATE_CODE,
      country_code: userObj[0].COUNTRY_CODE == null ? 0 : userObj[0].COUNTRY_CODE,
      business_details: userObj[0].BUSINESS_DETAILS == null ? "" : userObj[0].BUSINESS_DETAILS.trim(),
      business_type: userObj[0].BUSINESS_TYPE == null ? '' : userObj[0].BUSINESS_TYPE,
      bussiness_line: userObj[0].BUSSINESS_LINE == null ? '' : userObj[0].BUSSINESS_LINE,
      business_address: userObj[0].BUSINESS_ADDRESS == null ? "" : userObj[0].BUSINESS_ADDRESS.trim(),
      mobile_no: userObj[0].MOBILE_NO,
      email_id: userObj[0].EMAIL_ID == null ? "" : userObj[0].EMAIL_ID.trim(),
      website: '',
      active_status_date: '',
      enter_desc: userObj[0].CLIENT_FNAME.trim(),// + ' ' + userObj[0].RegForm.value.middlename + ' ' + userObj[0].RegForm.value.lastname,
      date_of_birth: moment(userObj[0].DATE_OF_BIRTH).format('DD-MMM-YYYY'),
      taxable_flag: 'N',
      client_language: 'E',
      enter_user_id: this.logInfo[0].LOGIN_USER_ID,
      Dealer_Mst_Id: "1",
      phone_1: userObj[0].PHONE_1,
      opflag: 'N',
      request_from: 'WB',
      reject_reason: '',
      Thumb_Mst_Id: '1',
      Thumb_Device_No: '',
      Thumb_Device_Det: '',
      Thumb_Active_Flag: '',
      approval_flag: 'Y',//this.loginInfo.approvalflag,
      Reported_By: '',
      Insti_Sub_Mst_Id: '',
      //images
      address_id: 1,
      address_proof: this.prof3,
      identity_id: 1,
      identity_proof: this.prof3,
      business_id: 1,
      Business_proof: this.prof3,
      Bank_ProofID: 1,
      Bank_Proof: this.prof3,
      client_photo: '',
      Bank_Reg_Mst_Id: this.bankObject.BANK_REG_MST_ID,
      Cbs_Customer_Id: this.Customer_ID,
      Cbs_Customer_Mobno: this.Mobile_Number,
    };
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/auth/merchant/addClient', paramObj, this).subscribe(data => {
      this.spinner.hide();
      if (data.code === 1 && data.status === "RNF") {
        this.message = "Your Request Send Successfully ,Now You Can Login.";
        MessageBox.show(this.dialog, this.message, "");
        this.clear();
        this.router.navigate(['/home']);
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

  btnClose() {
    // this.router.navigate(['/dashboard']);
    this.router.navigate(['/dashboard'], { queryParams: { 'kyc': false }, skipLocationChange: true });
  }

  checkGST() {
    if (this.gstin.length == 15) {
      this.spinner.show();
      var paramObj = {
        Flag: 'R',
        ClientMstId: this.clientMstId,
        LoginUserID: this.login_user_id,
        InstitutionMstID: this.Insti_Mst_Id,
        InstitutionSubMstID: this.Insti_Sub_Mst_Id,
        GSTNumber: this.gstin.toUpperCase(),
        SecretKey: "",
        Enter_User_Id: this.login_user_id,
      };
      //uinput = uinput.split('~');
      this.apiService.sendToServer<ICore>('/api/virtualpay/GetGSTData', paramObj, this).subscribe(data => {
        //console.log(data);
        if (data.code === 1) {
          console.log(data.message);
          this.gstname = data.message;
        }
        else {
          alert(data.message);
        }
        this.spinner.hide();
      },
        err => {
          this.spinner.hide();
          this.errorHandler.handlePageError(err);
        });
    }
  }
}
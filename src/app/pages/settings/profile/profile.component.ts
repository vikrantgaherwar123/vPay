import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import '../../../../assets/charts/echart/echarts-all.js';
import { DomSanitizer } from '@angular/platform-browser';
import { Service } from '../../merchantRegistration/service';
import { ErrorHandler } from '../../../core/errorHandler';
import * as moment from 'moment';
import * as $ from 'jquery';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { ICore } from '../../../interface/core';
import { ApiService } from '../../../core/api.service';
import { DataStorage } from '../../../core/dataStorage';
import { Spinner } from '../../../services/spinner';
import { ILogin } from '../../../interface/login';
import { Help } from '../../../shared/component/help/help.component';
import { Toast } from '../../../services/toast';
import { Common } from '../../../services/common';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";



@Component({
  selector: 'profile-upi',
  templateUrl: './profile.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ApiService, Spinner, Service, Common],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})




export class ProfileComponent implements OnInit {
  editProfile = true;
  editProfileIcon = 'icofont-edit';
  editAbout = true;
  editAboutIcon = 'icofont-edit';
  public editor;
  public editorConfig = {
    placeholder: 'About Your Self'
  };
  public data1: any;
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  profitChartOption: any;
  @ViewChildren(Help) helpElement: QueryList<Help>;
  @ViewChild(dtp) dtp: dtp; SetControlValue: string; _gatewaydetid: number = 0;
  code: number; msg: string; cursor1: any;
  data: Array<any>;
  logInfo: ILogin;
  clientMstId: number;
  login_user_id: string;
  BUSINESS_DETAILS: string = "";
  Insti_Sub_Mst_Id: string = "";
  Insti_Mst_Id: string = "";
  Corporate_Flag: any;
  customer_type: string;
  clientPhoto: string;
  client_name: string;
  client_fname: string;
  client_mname: string;
  client_lname: string;
  date_of_birth: string;
  mobileNo: string;
  phone: string;
  email: string;
  website: string;
  aadhar: string;
  pan: string;
  tan: string;
  gstin: string;
  gstname: string;
  gstregdate: string;
  taxable: string;
  business_type: string;
  bank_account_type: string;
  bank_account_number: string;
  ifsc: string;
  business_detail: string;
  business_line: string;
  business_address: string;
  aeps: string;
  address: string;
  pincode: string;
  landmark: string;
  area: string;
  city: string;
  city_code: string;
  tahasil: string;
  district: string;
  state: string;
  country: string;
  showUserIcon: boolean = false;
  headerClientName: string;
  kycFlag: any;
  profileDisplay: boolean = true;
  profileEdit: boolean = false;
  // merchant registration declaration
  password: any;
  Math: any;
  imgSize: number = 25; //in kb
  profilePhoto: string = "assets/images/profile-img.png";
  addImage: string = "assets/images/image.png";
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
  Documet_MstID_AddressProof: any;
  Documet_MstID_IDProof: any;
  Documet_MstID_BusinessProof: any;
  // Documet_MstID_BankProof:any;
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
  gstRegDate: string = '';
  compFlag: string = '';
  acNo: string = '';
  acName: string = '';
  pinCode: string = '';
  areaName: string = '';
  cityname: string = '';
  countryCode: string;
  mobileno: string = '';
  phoneno: string = '';
  approvalflag: string = 'N';
  taxflag: string = '';
  clientlanguage: string = '';
  countryCodeDisp: any;
  stateCodeDisp: any;
  distCodeDisp: any;
  tahasilCodeDisp: any;
  cityCodeDisp: any;
  addressproof: any;
  filePrfPhoto: any;
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
  opFlag: any;
  // emailPro: boole
  showTab1Class: string = "content-current";
  showTab2Class: string = "";
  showTab3Class: string = "";
  imageSizeAd: string = " Size of file should be between 5kb–25kb";
  imageSizeId: string = " Size of file should be between 5kb–25kb";
  imageSizeBp: string = " Size of file should be between 5kb–25kb";
  imageSizeCcp: string = " Size of file should be between 5kb–25kb";
  imageSizePrp: string = " Size of file should be between 5kb–25kb";
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

  constructor(private elementRef: ElementRef, private dialog: MatDialog, private errorHandler: ErrorHandler, private router: Router, private renderer2: Renderer2,
    private dataStorage: DataStorage, private route: ActivatedRoute, private toast: Toast, public service: Service, private common: Common,
    private apiService: ApiService, private domSanitizer: DomSanitizer, private spinner: Spinner) {
    this.SearchCustType(this.custTypeKey);
    this.SearchCustType(this.addressProofKey);
    this.SearchCustType(this.identityProofKey);
    this.SearchCustType(this.businessLineKey);
    this.SearchCustType(this.businessTypeKey);
    this.SearchCustType(this.businessProofKey);
    this.SearchCustType(this.bankProofKey);

  }
  ngOnInit() {
    // this.Get_CustomerProfile();
    this.logInfo = this.dataStorage.logInfo;
    this.mobileNo = this.logInfo[0].LOGIN_USER_ID;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';
    this.Insti_Mst_Id = this.logInfo[0].INSTI_MST_ID != null ? this.logInfo[0].INSTI_MST_ID : '';
    this.client_name = this.logInfo[0].CLIENT_NAME;
    if (this.logInfo[0].CLIENT_PHOTO) {
      this.clientPhoto = "data:image/JPEG;base64," + this.logInfo[0].CLIENT_PHOTO;
      this.showUserIcon = false;
    }
    else
      this.showUserIcon = true;
    this.headerClientName = this.client_name;
    if (this.route.queryParams["_value"].ID == "Y") {
      this.editPro();
    }
    this.kycFlag = this.logInfo[0].KYC_FLAG;

    this.getClientData();
    // document.getElementById("sp1").style.color = "green";
    // if (document.getElementById("sp2"))
    //   document.getElementById("sp2").style.color = "black";
    // // document.getElementById("sp3").style.color = "black";
    $('#sp1').css({ 'color': 'green', 'background-color': 'white' });
    if ($('#sp2'))
      $('#sp2').css('color', 'black');
  }
  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "22", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }
  editPro() {
    this.profileDisplay = false;
    this.profileEdit = true;
    if (this.Corporate_Flag == 'I') {
      this.businessSectionShow = false;
    }
    // this.toggleTab('Section1');
    this.getClientData();
  }
  // Merchant start from here
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
      if (obj.SetControlValue == 'gstRegDate')
        this.gstRegDate = obj.mydate;
      if (obj.SetControlValue == 'activestatusdate')
        this.activestatusdate = obj.mydate;
    }
  }
  toggleTab(secVar) {
    if (secVar === 'Section1') {
      this.showTab1Class = "content-current";
      this.showTab2Class = "";
      //this.showTab3Class = "";
      document.getElementById("sp1").style.color = "green";
      document.getElementById("sp1").style.backgroundColor = "#aae2b7";
      if(document.getElementById("sp2")){
        document.getElementById("sp2").style.color = "black";
        document.getElementById("sp2").style.backgroundColor = " #fff";
      }
      // document.getElementById("sp3").style.color = "black";
      // document.getElementById("sp3").style.backgroundColor = " #fff";
      // $('#sp1').css({'color':'green','background-color':'white'});
      //   if($('#sp2'))
      //   $('#sp2').css({'color':'black','background-color':'white'});
    }
    else if (secVar === 'Section2') {
      this.showTab1Class = "content-current";
      this.showTab2Class = "";
      // this.showTab3Class = "";
      document.getElementById("sp1").style.color = "black";
      document.getElementById("sp2").style.color = "green";
      document.getElementById("sp2").style.backgroundColor = "#aae2b7";
      document.getElementById("sp1").style.backgroundColor = " #fff";
      //  document.getElementById("sp3").style.backgroundColor = " #fff";
      //  document.getElementById("sp3").style.color = "black";

      if (this.clientFName == undefined || this.clientFName.toString().trim().length == 0) {
        // alert("Enter First name");
        this.message = "Enter First Name.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      else if (this.clientLName == undefined || this.clientLName.toString().trim().length == 0) {
        // alert("Enter Last name");
        this.message = "Enter Last Name.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      // else if (this.aadharNumber == undefined || this.aadharNumber.toString().trim().length == 0) {
      //   alert("Enter Aadhar No.");

      //   return false;
      // }
      // else if (this.pinCode == undefined || this.pinCode.toString().trim().length == 0) {
      //   alert("Enter Pin Code.");
      //   return false;
      // }
      else if (this.address == undefined || this.address.toString().trim().length == 0) {
        // alert("Enter Address");
        this.message = "Enter Address.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      // else if (this.countryCode == undefined || this.countryCode.toString().trim().length == 0) {
      //   alert("Select Country Name.");
      //   return false;
      // }
      // else if (this.stateCode == undefined || this.stateCode.toString().trim().length == 0) {
      //   alert("Select State Name.");
      //   return false;
      // }
      // else if (this.distCode == undefined || this.distCode.toString().trim().length == 0) {
      //   alert("Select District Name.");
      //   return false;
      // }
      // else if (this.tahasilCode == undefined || this.tahasilCode.toString().trim().length == 0) {
      //   alert("Select Tahasil Name.");
      //   return false;
      // }
      // else if (this.addressProofCode == undefined || this.addressProofCode.toString().trim().length == 0) {
      //   alert("Enter Address Proof Document Name.");
      //   return false;
      // }
      // else if (this.cityCode == undefined || this.cityCode.toString().trim().length == 0) {
      //   alert("Select City Name.");
      //   return false;
      // }
      // else if (!this.identityProofCode == undefined || (this.identityProofCode && this.identityProofCode.toString().trim().length == 0)) {
      //   alert("Select Identity Proof document name.");
      //   return false;
      // }
      else if (this.custTypeCode == undefined || this.custTypeCode.toString().trim().length == 0) {
        // alert("Select Customer type");
        this.message = "Select Customer Type.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      // if (!this.identityProofCode || (this.identityProofCode && this.identityProofCode.toString().trim().length == 0)) {
      //   alert("Select Identity Proof document name.");
      //   this.showTab1Class = "content-current";
      //   this.showTab2Class = "";
      //   this.showTab3Class = "";
      //   return false;
      // }
      // else if (!this.addressProofCode == undefined || this.addressProofCode.toString().trim().length == 0) {
      //   alert("Select Address Proof document name.");
      //   this.showTab1Class = "content-current";
      //   this.showTab2Class = "";
      //   this.showTab3Class = "";
      //   return false;
      // }
      // else if (!this.addressproof) {
      //   alert("Upload Address Proof document.");
      //   this.showTab1Class = "content-current";
      //   this.showTab2Class = "";
      //   this.showTab3Class = "";
      //   return false;
      // }
      // else if (!this.identityproof) {
      //   alert("Upload Identity Proof document.");
      //   this.showTab1Class = "content-current";
      //   this.showTab2Class = "";
      //   this.showTab3Class = "";
      //   return false;
      // }
      this.showTab1Class = "";
      document.getElementById("sp1").style.color = "black";
      if (this.businessSectionShow) {
        this.showTab2Class = "content-current";
        // this.showTab3Class = "";
        if (document.getElementById("sp2"))
          document.getElementById("sp2").style.color = "green";
        // document.getElementById("sp3").style.color = "black";
      }
      else {
        this.showTab2Class = "";
        //  this.showTab3Class = "content-current";
        if (document.getElementById("sp2"))
          document.getElementById("sp2").style.color = "black";
        // document.getElementById("sp3").style.color = "green";
      }
      return;
    }
    else if (secVar === 'PSection2') {
      this.showTab1Class = "";
      if (this.businessSectionShow) {
        this.showTab2Class = "content-current";
        //this.showTab3Class = "";
        if (document.getElementById("sp2"))
          document.getElementById("sp2").style.color = "green";
      }
      else {
        // this.showTab3Class = "";
        this.showTab1Class = "content-current";
        document.getElementById("sp1").style.color = "green";
      }
      // document.getElementById("sp3").style.color = "black";
    }
    else if (secVar === 'Section3') {
      // if (!this.businessproof) {
      //   alert("Upload Business Proof document.");
      //   this.showTab2Class = "content-current";
      //   this.showTab3Class = "";
      //   this.showTab1Class = "";
      //   return false;
      // }
      this.showTab1Class = "";
      this.showTab2Class = "";
      // this.showTab3Class = "content-current";
      document.getElementById("sp1").style.color = "black";
      if (document.getElementById("sp2"))
        document.getElementById("sp2").style.color = "black";
      // document.getElementById("sp3").style.color = "green";
    }
  }

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
      case 'CUST': this.businessSectionShow = this.custTypeCode.split('-')[1] == "I" ? false : true; this.toggleTab('Section1'); break;
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

      imgElm.src = "assets/images/image.png";
      if (imgId == 'imgIdAddressProof') {
        this.imageSizeAd = 'Your file size must less than 25kb';
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
      else if (imgId == 'imgIdfilePrfPhoto') {
        this.imageSizePrp = 'Your file size must less than 25kb';
      }
      return false;
    }

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
      this.filePrfPhoto = null;
    }
    imgElm.onload = function () {
      //Set canvas size is same as the picture
      canvas.width = 100;
      canvas.height = 100;
      // canvas.width = imgElm.width;
      // canvas.height = imgElm.height;
      // draw image into canvas element
      canvasContext.drawImage(imgElm, 0, 0, canvas.width, canvas.height);
      // get canvas contents as a data URL (returns png format by default)
      dataURL = canvas.toDataURL();
      switch (fileInput.srcElement.id) {
        case 'fileAddressProof': self.addressproof = dataURL; self.SaveImage(1); break;
        case 'fileIdentityProof': self.identityproof = dataURL; self.SaveImage(2); break;
        case 'fileBusinessProof': self.businessproof = dataURL; self.SaveImage(3); break;
        case 'filePrfPhoto': self.clientPhoto = dataURL; self.SaveImage(5); break;
        // case 'fileCancelChequeProof': self.bankProof = dataURL;  break;
        default: break;
      }
    }
    reader.onload = function (e: any) {
      imgElm.src = e.target.result;
    }
    reader.readAsDataURL(fileInput.target.files[0]);
  }

  SearchCustType(keyword) {
    this.spinner.show();
    var uinput = {
      userid: 1,
      keyword: keyword,
      device_id: 'Desktop',
    }
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
    );
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

  submit = function () {
    let imgElmAddProof = this.elementRef.nativeElement.querySelector('#imgIdAddressProof');
    let imgElmIdenProof = this.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
    let imgElmBusiProof = this.elementRef.nativeElement.querySelector('#imgIdBusinessProof');
    // let imgElmCanChqProof = this.elementRef.nativeElement.querySelector('#imgIdCancelChequeProof');
    if (this.clientFName == undefined || this.clientFName.toString().trim().length == 0) {
      // alert("Enter First name");
      this.message = "Enter First name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.clientLName == undefined || this.clientLName.toString().trim().length == 0) {
      // alert("Enter Last name");
      this.message = "Enter Last name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    // else if (this.aadharNumber == undefined || this.aadharNumber.toString().trim().length == 0) {
    //   alert("Enter Aadhar No.");
    // this.message = "Enter Aadhar No.";
    // MessageBox.show(this.dialog, this.message, "");
    //   return false;
    // }

    // else if (this.pinCode == undefined || this.pinCode.toString().trim().length == 0) {
    //   alert("Enter Pin Code.");
    // this.message = "Enter Pin Code.";
    // MessageBox.show(this.dialog, this.message, "");
    //   return false;
    // }
    else if (this.address == undefined || this.address.toString().trim().length == 0) {
      // alert("Enter Address");
      this.message = "Enter Address.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    // else if (this.countryCode == undefined || this.countryCode.toString().trim().length == 0) {
    //   alert("Select Country Name.");
    // this.message = "Select Country Name.";
    // MessageBox.show(this.dialog, this.message, "");
    //   return false;
    // }
    // else if (this.stateCode == undefined || this.stateCode.toString().trim().length == 0) {
    //   alert("Select State Name.");
    // this.message = "Select State Name.";
    // MessageBox.show(this.dialog, this.message, "");

    //   return false;
    // }
    // else if (this.distCode == undefined || this.distCode.toString().trim().length == 0) {
    //   alert("Select District Name.");
    // this.message = "Select District Name.";
    // MessageBox.show(this.dialog, this.message, "");

    //   return false;
    // }
    // else if (this.tahasilCode == undefined || this.tahasilCode.toString().trim().length == 0) {
    //   alert("Select Tahasil Name.");
    // this.message = "Select Tahasil Name.";
    // MessageBox.show(this.dialog, this.message, "");

    //   return false;
    // }
    // else if (this.addressProofCode == undefined || this.addressProofCode.toString().trim().length == 0) {
    //   alert("Enter Address Proof Document Name.");
    // this.message = "Enter Address Proof Document Name.";
    // MessageBox.show(this.dialog, this.message, "");
    //   return false;
    // }

    // else if (this.cityCode == undefined || this.cityCode.toString().trim().length == 0) {
    //   alert("Select City Name.");
    // this.message = "Select City Name.";
    // MessageBox.show(this.dialog, this.message, "");
    //   return false;
    // }
    // else if (!this.identityProofCode == undefined || (this.identityProofCode && this.identityProofCode.toString().trim().length == 0)) {
    //   alert("Select Identity Proof document name.");
    // this.message = "Select Identity Proof document name.";
    // MessageBox.show(this.dialog, this.message, "");
    //   return false;
    // }

    else if (this.custTypeCode == undefined || this.custTypeCode.toString().trim().length == 0) {
      // alert("Select Customer type");
      this.message = "Select Customer Type.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    //else if (this.dealerCode == undefined || this.dealerCode.toString().trim().length == 0) {
    //alert("Select Dealer Name.");
    // this.message = "Select Dealer Name.";
    // MessageBox.show(this.dialog, this.message, "");
    //return;
    //}

    //TODO
    // else if (!this.acName || (this.acName  && this.acName.toString().trim().length == 0)){
    //   alert("Enter Account Name.");
    // this.message = "Enter Account Name.";
    // MessageBox.show(this.dialog, this.message, "");
    //    return false;
    // }
    // else if (!this.acNo || (this.acNo && this.acNo.toString().trim().length == 0)) {
    //   alert("Enter Account No.");
    // this.message = "Enter Account No.";
    // MessageBox.show(this.dialog, this.message, "");
    //   return false;
    // }
    // else if (this.ifsc == undefined || this.ifsc.toString().trim().length == 0) {
    //   alert("Enter IFSC Code.");
    // this.message = "Enter IFSC Code.";
    // MessageBox.show(this.dialog, this.message, "");
    // this.option.msg="Enter IFSC Code.";
    // this.option.type ='error';
    // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (this.accountTypeCode == undefined || this.accountTypeCode.toString().trim().length == 0) {
    //   alert("Select Account Type.");
    // this.message = "Select Account Type.";
    // MessageBox.show(this.dialog, this.message, "");
    //   // this.option.msg="Select Account Type.";
    //   // this.option.type ='error';
    //   // this.toast.addToast(this.option);
    //   return false;
    // }
    // else if (!this.bankProof) {
    //   alert("Upload bank Proof document.");
    // this.message = "Upload bank Proof document.";
    // MessageBox.show(this.dialog, this.message, "");
    //   return false;
    // }
    // if (this.custTypeCode != "11-I" && this.businessproof == undefined) {
    //   // alert("Upload Business Proof document.");
    // this.message = "Upload Business Proof document.";
    // MessageBox.show(this.dialog, this.message, "");
    //   this.option.msg = "Upload Business Proof document.";
    //   this.toast.addToast(this.option);
    //   this.option.type = 'error';
    //   this.showTab2Class = "content-current";
    //   this.showTab3Class = "";
    //   return false;
    // }

    // else if (this.gstRegDate == undefined || this.gstRegDate == '') {
    //   alert("Enter GST Registration Date.");
    // this.message = "Enter GST Registration Date.";
    // MessageBox.show(this.dialog, this.message, "");
    //   return;
    // }
    // else if (this.businessProofCode == undefined || this.businessProofCode.toString().trim().length == 0) {
    //   alert("Enter Business Code");
    // this.message = "Enter Business Code.";
    // MessageBox.show(this.dialog, this.message, "");
    //   return;
    // }
    this.dealerCode = 1;
    return this.saveClientData();
  }

  SaveImage(ID) {
    var Document_Proof; var Document_ID; var Flag; var Documet_MstID;
    let pageObj = this;
    //Address Proof
    if (ID == 1) {
      Document_ID = this.addressProofCode;
      Document_Proof = pageObj.addressproof;
      Flag = 'A';
      Documet_MstID = pageObj.Documet_MstID_AddressProof;
    }
    //ID Proof
    if (ID == 2) {
      Document_ID = this.identityProofCode;
      Document_Proof = pageObj.identityproof;
      Flag = 'A';
      Documet_MstID = pageObj.Documet_MstID_IDProof;
    }
    //Business Proof
    if (ID == 3) {
      Document_ID = this.businessProofCode;
      Document_Proof = pageObj.businessproof;
      Flag = 'A';
      Documet_MstID = pageObj.Documet_MstID_BusinessProof;
    }
    // Bank Proof
    //  if(ID == 4){
    //    Document_ID=this.CancelChequeID;
    //    Document_Proof=this.canceledcheque;
    //    Flag='A';
    //    Documet_MstID=this.Documet_MstID_BankProof;
    //  }
    //Client Picture
    if (ID == 5) {
      Document_ID = this.logInfo[0].CLIENT_MST_ID;
      Document_Proof = this.clientPhoto;
      Flag = 'P';
      Documet_MstID = 0;
    }
    var paramObj = {
      Device_Id: 'Desktop',
      Request_From: 'WB',
      request_from: 'WB',
      Client_Mst_ID: pageObj.logInfo[0].CLIENT_MST_ID,
      Flag: Flag,
      Document_ID: Document_ID,
      Document: Document_Proof,
      Documet_MstID: Documet_MstID
    }
    this.apiService.sendToServer<ICore>('/api/virtualPay/UpdateDocument', paramObj, this).subscribe(data => {
      if (data.code === 1 && data.msg.toUpperCase() === "SUCCESS") {
        // alert('Image Inserted Successfully');
        this.message = "Image Inserted Successfully.";
        MessageBox.show(this.dialog, this.message, "");
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    },
      err => {
        this.errorHandler.handlePageError(err);
      });
  }
  saveClientData() {
    var uinput = {
      client_req_det_id: this.logInfo[0].CLIENT_REQ_DET_ID,
      Client_Req_Det_Id: this.logInfo[0].CLIENT_REQ_DET_ID,
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
      aadhar_number: this.aadharNumber == undefined ? '' : this.aadharNumber.toString().replace(/ /g, ""),
      pan_number: this.panNumber,
      tan_number: this.tan,
      gstin: this.gstin,
      gst_reg_date: (this.gstRegDate && this.gstRegDate.trim().length == 0) || (!this.gstRegDate) ? null : moment(this.gstRegDate).format('DD-MMM-YYYY'),
      comp_flag: this.compFlag,
      bank_ac_number: this.acNo,
      Bank_Ac_Name: this.acName,
      bank_ac_name: this.acName,
      bank_ifsc: this.ifsc,
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
      approval_flag: 'Y',
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
      client_photo: this.clientPhoto,
      Bank_Proof: this.bankProof,
      Bank_ProofID: this.bankProofCode,
      active_status_date: moment(Date.now()).format('DD-MMM-YYYY'),
      enter_user_id: 0,
      enter_desc: this.clientFName, //+ ' ' + this.clientMName + ' ' + this.clientLName
      opflag: 'M',
      request_from: 'WB',
      device_id: 'Desktop',
      // reject_reason: ' ',
    }
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/auth/merchant/addClient', uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1 && data.status === "RNF") {
          // alert("Profile Update Successfully .");
          this.message = "Profile Update Successfully.";
          MessageBox.show(this.dialog, this.message, "");
          // this.router.navigate(['/dashboard']);
          this.router.navigate(['/dashboard'], { queryParams: { 'kyc': false }, skipLocationChange: true });
        }
        else {
          // alert("check error");
          this.message = "check Error.";
          MessageBox.show(this.dialog, this.message, "");
          // this.option.msg="check error";
          // this.option.type ='error';
          //  this.toast.addToast(this.option);
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
        //this.clear();

      },
    );
  }
  getClientData() {
    this.spinner.show();
    var uinput = {
      // client_mst_id: this.clientMstId,
      // //  login_user_id: this.loginInfo.LOGIN_USER_ID,
      // device_id: "Desktop",
      // Corporate_Flag: this.Corporate_Flag,
      // Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id
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
      client_req_det_id: this.logInfo[0].CLIENT_REQ_DET_ID,
      Client_Req_Det_Id: this.logInfo[0].CLIENT_REQ_DET_ID,
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
      comp_flag: 'Y',
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
      approval_flag: 'Y',
      taxable_flag: 'Y',
      bank_ac_type: '',
      client_language: 'E',
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

    }

    let pageObj = this;
    this.apiService.sendToServer<ICore>('/auth/merchant/addClient', uinput, this).subscribe(
      data => {
        pageObj.spinner.show();
        if (data.code === 1 && data.msg === "Success") {
          if (pageObj.Corporate_Flag != 'I') {
            pageObj.businessSectionShow = true;
          }
          pageObj.custTypeCode = data.cursor1[0].CUSTOMER_TYPE + (data.cursor1[0].CODE_VALUE ? "-" + data.cursor1[0].CODE_VALUE : "");
          pageObj.loginuserid = data.cursor1[0].LOGIN_USER_ID;
          pageObj.clientname = data.cursor1[0].CLIENT_NAME;
          pageObj.clientFName = data.cursor1[0].CLIENT_FNAME;
          pageObj.clientMName = data.cursor1[0].CLIENT_MNAME;
          pageObj.clientLName = data.cursor1[0].CLIENT_LNAME;
          pageObj.dob = (data.cursor1[0].DATE_OF_BIRTH && data.cursor1[0].DATE_OF_BIRTH.trim().length == 0) || (!data.cursor1[0].DATE_OF_BIRTH) ? null : moment(data.cursor1[0].DATE_OF_BIRTH).format('DD/MMM/YYYY'),
            pageObj.aadharNumber = data.cursor1[0].AADHAR_NUMBER;
          pageObj.businessdet = data.cursor1[0].BUSINESS_DETAILS;
          pageObj.businessTypeCode = data.cursor1[0].BUSINESS_TYPE;
          pageObj.businessLineCode = data.cursor1[0].BUSSINESS_LINE;
          pageObj.businessAddress = data.cursor1[0].BUSINESS_ADDRESS;
          pageObj.panNumber = data.cursor1[0].PAN_NUMBER;
          pageObj.tan = data.cursor1[0].TAN_NUMBER;
          pageObj.gstin = data.cursor1[0].GSTIN;
          pageObj.gstRegDate = (data.cursor1[0].GST_REG_DATE && data.cursor1[0].GST_REG_DATE.trim().length == 0) || (!data.cursor1[0].GST_REG_DATE) ? null : moment(data.cursor1[0].GST_REG_DATE).format('DD/MMM/YYYY'),
            pageObj.compFlag = data.cursor1[0].COMP_FLAG;
          pageObj.acNo = data.cursor1[0].BANK_AC_NUMBER;
          pageObj.acName = data.cursor1[0].BANK_AC_NAME;
          pageObj.ifsc = data.cursor1[0].BANK_IFSC;
          pageObj.address = data.cursor1[0].ADDRESS_1;
          pageObj.pinCode = data.cursor1[0].PIN_CODE;
          //pageObj.SearchPincode();
          pageObj.landmark = data.cursor1[0].LANDMARK_NAME;
          pageObj.areaName = data.cursor1[0].AREA_NAME;
          pageObj.clientphoto = pageObj.arrayBufferToBase64(data.cursor1[0].CLIENT_PHOTO);
          pageObj.countryCodeDisp = data.cursor1[0].COUNTRY;
          pageObj.stateCodeDisp = data.cursor1[0].STATE;
          pageObj.distCodeDisp = data.cursor1[0].DISTRICT;
          pageObj.tahasilCodeDisp = data.cursor1[0].TAHASIL;
          pageObj.cityCodeDisp = data.cursor1[0].CITY;
          pageObj.helpElement.forEach(input => {
            switch (input.eid) {
              case 'country': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].COUNTRY; pageObj.countryCode = data.cursor1[0].COUNTRY_CODE; break;
              case 'state': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].STATE; pageObj.stateCode = data.cursor1[0].STATE_CODE; break;
              case 'district': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].DISTRICT; pageObj.distCode = data.cursor1[0].DISTRICT_CODE; break;
              case 'tahasil': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].TAHASIL; pageObj.tahasilCode = data.cursor1[0].TAHASIL_CODE; break;
              case 'city': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].CITY; pageObj.cityCode = data.cursor1[0].CITY_CODE; break;
              default: break;
            }
          });
          pageObj.mobileno = data.cursor1[0].MOBILE_NO;
          pageObj.phoneno = data.cursor1[0].PHONE_1;
          pageObj.email = data.cursor1[0].EMAIL_ID;
          pageObj.website = data.cursor1[0].WEBSITE;
          pageObj.taxflag = data.cursor1[0].TAXABLE_FLAG;
          pageObj.accountTypeCode = data.cursor1[0].BANK_AC_TYPE;
          pageObj.clientlanguage = data.cursor1[0].CLIENT_LANGUAGE;
          let imgElmAddProof = pageObj.elementRef.nativeElement.querySelector('#imgIdAddressProof');
          let imgElmIdProof = pageObj.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
          let imgElmBusiProof = pageObj.elementRef.nativeElement.querySelector('#imgIdBusinessProof');
          let imgElmCanChqProof = pageObj.elementRef.nativeElement.querySelector('#imgIdCancelChequeProof');
          //  let imgElmClientphoto = pageObj.elementRef.nativeElement.querySelector('#imgIdfilePrfPhoto');
          if (this.profileEdit == true) {
            if (data.cursor2.length > 0) {
              for (var i = 0; i < data.cursor2.length; i++) {
                if (data.cursor2[i].DOCUMENT_IMAGE && data.cursor2[i].DOC_TYPE == 'A') {
                  pageObj.addressProofCode = data.cursor2[i].DOCUMENT_MST_ID;
                  pageObj.addressproof = pageObj.arrayBufferToBase64(data.cursor2[i].DOCUMENT_IMAGE.data);
                  imgElmAddProof.src = pageObj.addressproof != undefined ? pageObj.addressproof : imgElmAddProof.src = "assets/images/image.png";
                  pageObj.Documet_MstID_AddressProof = data.cursor2[i].DOCUMENT_DET_ID == undefined ? 0 : data.cursor2[i].DOCUMENT_DET_ID;
                }
                if (data.cursor2[i].DOCUMENT_IMAGE && data.cursor2[i].DOC_TYPE == 'I') {
                  pageObj.identityProofCode = data.cursor2[i].DOCUMENT_MST_ID;
                  pageObj.identityproof = pageObj.arrayBufferToBase64(data.cursor2[i].DOCUMENT_IMAGE.data);
                  imgElmIdProof.src = pageObj.identityproof != undefined ? pageObj.identityproof : imgElmIdProof.src = "assets/images/image.png";
                  pageObj.Documet_MstID_IDProof = data.cursor2[i].DOCUMENT_DET_ID == undefined ? 0 : data.cursor2[i].DOCUMENT_DET_ID;
                }
                if (data.cursor2[i].DOCUMENT_IMAGE && data.cursor2[i].DOC_TYPE == 'C') {
                  pageObj.businessProofCode = data.cursor2[i].DOCUMENT_MST_ID;
                  pageObj.businessproof = pageObj.arrayBufferToBase64(data.cursor2[i].DOCUMENT_IMAGE.data);
                  imgElmBusiProof.src = pageObj.businessproof != undefined ? pageObj.businessproof : imgElmBusiProof.src = "assets/images/image.png";
                  pageObj.Documet_MstID_BusinessProof = data.cursor2[i].DOCUMENT_DET_ID == undefined ? 0 : data.cursor2[i].DOCUMENT_DET_ID;
                }
                // if(data.cursor2[i].DOCUMENT_IMAGE && data.cursor2[i].DOC_TYPE=='B'){
                //   pageObj.bankProofCode = data.cursor2[i].DOCUMENT_MST_ID;
                //   pageObj.bankProof = pageObj.arrayBufferToBase64(data.cursor2[i].DOCUMENT_IMAGE.data);
                //   imgElmCanChqProof.src= pageObj.bankProof != undefined ? pageObj.bankProof : imgElmCanChqProof.src= "assets/images/image.png" ;
                //   pageObj.Documet_MstID_BankProof=data.cursor2[i].DOCUMENT_DET_ID==undefined ? 0:data.cursor2[i].DOCUMENT_DET_ID;
                //  }
              }
            } else {
              pageObj.Documet_MstID_AddressProof = 0;
              pageObj.Documet_MstID_IDProof = 0;
              pageObj.Documet_MstID_BusinessProof = 0;
              // pageObj.Documet_MstID_BankProof=0;
            }
          }
          pageObj.activestatusdate = moment(data.cursor1[0].ACTIVE_STATUS_DATE).format('DD/MMM/YYYY');

        }
        else {
          // alert("check error");
          pageObj.message = "Check Error.";
          MessageBox.show(pageObj.dialog, pageObj.message, "");
          return false;
        }
        pageObj.spinner.hide();
      },
      err => {
        pageObj.spinner.hide();
        pageObj.errorHandler.handlePageError(err);
      },
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
    this.apiService.sendToServer<ICore>('/auth/merchant/GetPinCodeData', { PinCode: this.pinCode, Device_Id: 'Desktop' }, this).subscribe(
      data => {
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
        this.pinCode = '';
      },
    );
  }

  clear = function () {
    let imgElm = this.elementRef.nativeElement.querySelector('#imgIdAddressProof');
    imgElm.src = "assets/images/image.png";
    imgElm = this.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
    imgElm.src = "assets/images/image.png";
    imgElm = this.elementRef.nativeElement.querySelector('#imgIdBusinessProof');
    imgElm.src = "assets/images/image.png";
    imgElm = this.elementRef.nativeElement.querySelector('#imgIdCancelChequeProof');
    imgElm.src = "assets/images/image.png";

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
    this.taxflag = 'Y';
    this.accountTypeCode = '';
    this.clientlanguage = '';
    this.addressProofCode = '';
    this.addressproof = null;
    this.businessProofCode = '';
    this.businessproof = null;
    this.identityProofCode = '';
    this.identityproof = null;
    this.gstname = "";
    // this.clientphoto = null;
    // this.bankProof = null;
    this.activestatusdate = '';
  }

  // cancelPro() {
  //   // if(!confirm("Do you want to cancel?"))
  //   // return false;
  //   // this.router.navigate(['/']);
  //   // return;

  //   this.profileDisplay = true;
  //   this.profileEdit = false;
  //   this.clear();
  // }
  cancelPro() {
    this.getClientData();
    this.onClickHelpData(this.custTypeCode, 'CUST')
    this.profileDisplay = true;
    this.profileEdit = false;
  }



  toggleEditProfile() {
    this.editProfileIcon = (this.editProfileIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editProfile = !this.editProfile;
  }

  toggleEditAbout() {
    this.editAboutIcon = (this.editAboutIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editAbout = !this.editAbout;
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
   
        this.spinner.hide();
        if (data.code === 1) {
     
          this.gstname = data.message;
        }
        else {
          // alert(data.message);
          this.message = data.message;
          MessageBox.show(this.dialog, this.message, "");
        }

      },
        err => {
          this.spinner.hide();
          this.errorHandler.handlePageError(err);
        });
    } else {
      this.gstname = '';
    }
  }

  editProBank() {
    this.router.navigate(['/settings/setBankDetails']);
  }
}

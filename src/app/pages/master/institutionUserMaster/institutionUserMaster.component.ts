import { Component, OnInit, ViewChild, ElementRef, EventEmitter, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataStorage } from '../../../core/dataStorage';
import { Service } from '../service';
import { GlobalState } from '../../../global.state';

import * as moment from 'moment';
import { Help } from '../../../shared/component/help/help.component';
import { ErrorHandler } from '../../../core/errorHandler';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { ApiService } from '../../../core/api.service';
import { Spinner } from "../../../services/spinner";
import { ICore } from '../../../interface/core';
import { ILogin } from '../../../interface/login';
import { Toast } from '../../../services/toast';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'vgipl-institutionUserMaster',
  templateUrl: './institutionUserMaster.component.html',
  styleUrls: ['./institutionUserMaster.component.scss'],
  providers: [Service, Spinner]
})

export class InstitutionUserMasterComponent implements OnInit {
  @ViewChildren(Help) helpElement: QueryList<Help>;
  @ViewChild(dtp) dtp: dtp; SetControlValue: string; _gatewaydetid: number = 0;
  mode: string = "A";
  mobileNo1: string = '';
  instName: string;
  instMstId: string;
  reportedByCode: string;
  reportedByList: any;
  reportedByKey: string = 'INSTISUBCLIENT';

  Math: any;
  imgSize: number = 25; //in kb
  profilePhoto: string = "assets/images/profile-img.png";
  addImage: string = "assets/images/image.png";
  code: number;
  msg: string = "";
  data: Array<any>;
  businessSectionShow: boolean = false;
  labelFadeClass: string = "";
  insertFlag: boolean = true;

  subInsteLabel: string = "SubInstID";
  subInstKey: string = "INSTISUBCHILD";
  subInstList: any;
  subInstCode: string;
  txtsubInstData: string;

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
  custTypeCode: string = '';
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
  dealerCode: string = '1';

  taxableFlagLabel: string = "Taxable Flag";
  taxableFlagKey: string = "YESNO";
  taxableFlagCode: string = "Y";

  companyFlagLabel: string = "Composite Flag";
  companyFlagKey: string = "YESNO";
  companyFlagCode: string = "Y";

  accountTypeLabel: string = "Account Type";
  accountTypeKey: string = "ACTY";
  accountTypeCode: string = "SB";

  Documet_MstID_AddressProof: any;
  Documet_MstID_IDProof: any;
  Documet_MstID_BusinessProof: any;

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
  ifsc: string = '';
  address: string = '';
  pinCode: string = '';
  landmark: string = '';
  areaName: string = '';
  cityname: string = '';

  countryCode: string;
  //mobileNo: string = '';
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

  opFlag: any = 'N';
  showTab1Class: string = "content-current";
  showTab2Class: string = "";
  showTab3Class: string = "";
  imageSizeAd: string = " Size of file should be between 5kb–25kb";
  imageSizeId: string = " Size of file should be between 5kb–25kb";
  imageSizeBp: string = " Size of file should be between 5kb–25kb";
  imageSizeCcp: string = " Size of file should be between 5kb–25kb";
  userFlag: string;
  disableSubInst: boolean;

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

  constructor(private elementRef: ElementRef, private dialog: MatDialog, private errorHandler: ErrorHandler, private router: Router,
    public service: Service, private renderer2: Renderer2, private dataStorage: DataStorage, private _state: GlobalState, private toast: Toast, private apiService: ApiService, private spinner: Spinner) {


    this.SearchCustType(this.custTypeKey);
    this.SearchCustType(this.addressProofKey);
    this.SearchCustType(this.identityProofKey);
    this.SearchCustType(this.businessLineKey);
    this.SearchCustType(this.businessTypeKey);
    this.SearchCustType(this.businessProofKey);
    this.SearchCustType(this.bankProofKey);


  }
  changeMode(mode) {
    if (mode == 'A') {
      this.mode = mode;
      document.getElementById("sp1").style.color = "green";
      document.getElementById("sp1").style.backgroundColor = "#aae2b7";
      document.getElementById("sp2").style.color = "black";
      document.getElementById("sp3").style.color = "black";
      document.getElementById("sp2").style.backgroundColor = " #fff";
      document.getElementById("sp3").style.backgroundColor = " #fff";
      this.opFlag = 'N';
      const txtMobile = this.renderer2.selectRootElement('#txtMobile');
      setTimeout(() => txtMobile.focus(), 500);

    }
    else if (mode == 'M') {
      this.mode = mode;
      document.getElementById("sp1").style.color = "black";
      document.getElementById("sp2").style.color = "green";
      document.getElementById("sp2").style.backgroundColor = "#aae2b7";
      document.getElementById("sp1").style.backgroundColor = " #fff";
      document.getElementById("sp3").style.backgroundColor = " #fff";
      document.getElementById("sp3").style.color = "black";
      this.opFlag = 'M';
      const txtMobile = this.renderer2.selectRootElement('#txtMobile');
      setTimeout(() => txtMobile.focus(), 500);

    }
    else {
      this.mode = mode;
      this.opFlag = 'D';
      document.getElementById("sp1").style.color = "black";
      document.getElementById("sp2").style.color = "black";
      document.getElementById("sp3").style.color = "green";
      document.getElementById("sp3").style.backgroundColor = "#aae2b7";
      document.getElementById("sp1").style.backgroundColor = " #fff";
      document.getElementById("sp2").style.backgroundColor = " #fff";
    }
    this.clear();
  }
  ngOnInit() {
    document.getElementById("sp1").style.backgroundColor = "#aae2b7";
    const txtMobile = this.renderer2.selectRootElement('#txtMobile');
    setTimeout(() => txtMobile.focus(), 500);
    this.logInfo = this.dataStorage.logInfo;
    //this.mobileNo = this.logInfo[0].LOGIN_USER_ID;
    this.labelFadeClass = "fadeLabel";
    this.instName = this.logInfo[0].INSTITUTION_NAME;
    this.instMstId = this.logInfo[0].INSTI_MST_ID;
    this.subInstKey += '~' + this.instMstId;
    //pageObj.subInstCode = data.cursor1[0].KEY;
    this.SearchCustType(this.subInstKey);
    if (this.logInfo[0].ADMINUSER == 'Y') {
      this.userFlag = 'A'
      this.disableSubInst = false;
    }
    else {
      this.userFlag = 'S'
      this.disableSubInst = true;
    }
    this.changeMode('A');



  }



  onChangeSubInstCode() {
    this.reportedByKey = 'INSTISUBCLIENT~' + this.subInstCode;
    this.SearchCustType(this.reportedByKey);
  }

  getData() {
    if (this.mode == 'A') {
      this.getMobileData('C');
    }
    else if (this.mode == 'M' || this.mode == 'D') {
      this.getMobileData('D');
    }



  }
  getMobileData(flag) {
    if (this.mobileNo1.toString().trim().length != 10) {
      this.message = "Enter 10 Digit Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      this.mobileNo1 = '';
      const txtMobile = this.renderer2.selectRootElement('#txtMobile');
      setTimeout(() => txtMobile.focus(), 500);
      return;
    }
    var uinput = {
      Insti_Sub_Mst_Id: this.subInstCode,
      MobileNo: this.mobileNo1,
      Device_Id: 'D',
      Request_From: 'WC',
      Flag: flag,
      FromDate: moment(Date.now()).format('DD-MMM-YYYY'),
      UpToDate: moment(Date.now()).format('DD-MMM-YYYY')
    }
    let pageObj = this;
    this.apiService.sendToServer<ICore>('/auth/merchant/GetMobileData', uinput, this).subscribe(
      data => {
        if (data.code === 1) {
          if (data.cursor1 && data.cursor1.length == 0) {
            this.message = "Record not Found.";
            MessageBox.show(this.dialog, this.message, "");
            pageObj.clear();
            return;
          }
          pageObj.custTypeCode = data.cursor1[0].CUSTOMER_TYPE;
          pageObj.ClientReqDetId = data.cursor1[0].CLIENT_REQ_DET_ID;
          // this.InstiSubId= data.cursor1[0].INSTI_SUB_MST_ID;
          //  this.ReportedBy = data.cursor1[0].REPORTED_BY;
          // this.loginuserid = data.cursor1[0].LOGIN_USER_ID;
          //this.clien = data.cursor1[0].CLIENT_NAME;
          pageObj.clientFName = data.cursor1[0].CLIENT_FNAME;
          pageObj.clientMName = data.cursor1[0].CLIENT_MNAME;
          pageObj.clientLName = data.cursor1[0].CLIENT_LNAME;
          // pageObj.dob = moment(data.cursor1[0].DATE_OF_BIRTH).format('DD/MMM/YYYY');
          pageObj.dob = (data.cursor1[0].DATE_OF_BIRTH && data.cursor1[0].DATE_OF_BIRTH.trim().length == 0) || (!data.cursor1[0].DATE_OF_BIRTH) ? null : moment(data.cursor1[0].DATE_OF_BIRTH).format('DD/MMM/YYYY'),
            pageObj.aadharNumber = data.cursor1[0].AADHAR_NUMBER;
          pageObj.panNumber = data.cursor1[0].PAN_NUMBER;
          //this.bankacnumber = data.cursor1[0].BANK_AC_NUMBER;
          //this.bankifsc = data.cursor1[0].BANK_IFSC;
          pageObj.address = data.cursor1[0].ADDRESS_1;
          pageObj.pinCode = data.cursor1[0].PIN_CODE;
          pageObj.SearchPincode();

          pageObj.landmark = data.cursor1[0].LANDMARK_NAME;
          pageObj.areaName = data.cursor1[0].AREA_NAME;
          pageObj.cityname = data.cursor1[0].CITY_NAME;
          pageObj.cityCode = data.cursor1[0].CITY_CODE;
          pageObj.tahasilCode = data.cursor1[0].TAHASIL_CODE;
          pageObj.distCode = data.cursor1[0].DISTRICT_CODE;
          pageObj.stateCode = data.cursor1[0].STATE_CODE;
          pageObj.countryCode = data.cursor1[0].COUNTRY_CODE;
          pageObj.mobileNo1 = data.cursor1[0].MOBILE_NO;
          pageObj.phoneno = data.cursor1[0].PHONE_1;
          pageObj.email = data.cursor1[0].EMAIL_ID;
          // this.approvalflag = data.data[0].APPROVAL_FLAG;
          // this.bankActype = data.cursor1[0].BANK_AC_TYPE;
          // this.bankacname = data.cursor1[0].BANK_AC_NAME;
          // this.clientlanguage = data.cursor1[0].CLIENT_LANGUAGE;
          pageObj.dealerCode = data.cursor1[0].DEALER_MST_ID;
          // this.addressid = data.cursor2[0].DOCUMENT_MST_ID;
          // this.addressproof = data.cursor2[0].DOCUMENT_IMAGE;
          // this.identityid = data.cursor2[1].DOCUMENT_MST_ID;
          // this.identityproof = data.cursor2[1].DOCUMENT_IMAGE;
          //  this.bankproofid = data.cursor2[3].DOCUMENT_MST_ID;
          // this.bankproof = data.cursor2[3].DOCUMENT_IMAGE;

          // if (data.cursor1[0].CODE_VALUE != 'I') {
          //   this.busdetail = data.cursor1[0].BUSINESS_DETAILS;
          //   this.bustype = data.cursor1[0].BUSINESS_TYPE;
          //   this.busline = data.cursor1[0].BUSSINESS_LINE;
          //   this.busadd = data.cursor1[0].BUSINESS_ADDRESS;
          //   this.tannumber = data.cursor1[0].TAN_NUMBER;
          //   this.gstin = data.cursor1[0].GSTIN;
          //   this.gstregdate = moment(data.cursor1[0].GST_REG_DATE).format('DD/MMM/YYYY');
          //   this.compflag = data.cursor1[0].COMP_FLAG;
          //  // this.businessid = data.cursor2[2].DOCUMENT_MST_ID;
          //  // this.businessproof = data.cursor2[2].DOCUMENT_IMAGE;
          //   this.website = data.cursor1[0].WEBSITE;
          //   this.taxflag = data.cursor1[0].TAXABLE_FLAG;
          //   // this.activestatusdate = moment(data.cursor1[0].ACTIVE_STATUS_DATE).format('DD/MMM/YYYY');
          // }
          // else {
          //   this.busdetail = '';  // data.cursor1[0].BUSINESS_DETAILS;
          //   this.bustype = ''; // data.cursor1[0].BUSINESS_TYPE;
          //   this.busline = ''; // data.cursor1[0].BUSSINESS_LINE;
          //   this.busadd = ''; // data.cursor1[0].BUSINESS_ADDRESS;
          //   this.tannumber = ''; // data.cursor1[0].TAN_NUMBER;
          //   this.gstin = ''; // data.cursor1[0].GSTIN;
          //   this.gstregdate = ''; // moment(data.cursor1[0].GST_REG_DATE).format('DD/MMM/YYYY');
          //   this.compflag = ''; // data.cursor1[0].COMP_FLAG;
          //   this.businessid = ''; // data.cursor2[2].DOCUMENT_MST_ID;
          //   this.businessproof = ''; // data.cursor2[2].DOCUMENT_IMAGE;
          //   this.website = ''; // data.cursor1[0].WEBSITE;
          //   this.taxflag = ''; // data.cursor1[0].TAXABLE_FLAG;
          //   // this.activestatusdate = moment(data.cursor1[0].ACTIVE_STATUS_DATE).format('DD/MMM/YYYY');
          // }
          // if(data.cursor1[0].CLIENT_PHOTO){
          //   this.clientphoto = data.cursor1[0].CLIENT_PHOTO;
          // }

          let imgElmAddProof = pageObj.elementRef.nativeElement.querySelector('#imgIdAddressProof');
          let imgElmIdProof = pageObj.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
          let imgElmCpProof = pageObj.elementRef.nativeElement.querySelector('#imgIdfilePrfPhoto');

          if (data.cursor1[0].CLIENT_PHOTO) {
            pageObj.clientphoto = this.arrayBufferToBase64(data.cursor1[0].CLIENT_PHOTO.data);
            imgElmCpProof.src = pageObj.clientphoto;
          }
          else {
            imgElmCpProof.src = "assets/images/profile-img.png";
          }


          // if (data.cursor2[0].DOCUMENT_IMAGE) {
          //   this.addressproof = this.arrayBufferToBase64(data.cursor2[0].DOCUMENT_IMAGE.data);
          //   imgElmAddProof.src = this.addressproof;
          // }
          // else {
          //   imgElmAddProof.src = "assets/images/image.png";
          // }
          // if (data.cursor2[1].DOCUMENT_IMAGE) {
          //   this.identityproof = this.arrayBufferToBase64(data.cursor2[1].DOCUMENT_IMAGE.data);
          //   imgElmIdProof.src = this.identityproof;
          // }
          // else {
          //   imgElmIdProof.src = "assets/images/image.png";
          // }
          // if (data.cursor1[0].CLIENT_PHOTO) {
          //   this.clientphoto = this.arrayBufferToBase64(data.cursor2[1].DOCUMENT_IMAGE.data);
          //   imgElmCpProof.src = this.clientphoto;
          // }
          // else {
          //   imgElmCpProof.src = "assets/images/profile-img.png";
          // }

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
              //  if(data.cursor2[i].DOCUMENT_IMAGE && data.cursor2[i].DOC_TYPE=='C'){
              //    pageObj.businessProofCode = data.cursor2[i].DOCUMENT_MST_ID;
              //    pageObj.businessproof = pageObj.arrayBufferToBase64(data.cursor2[i].DOCUMENT_IMAGE.data);
              //    imgElmBusiProof.src= pageObj.businessproof != undefined ? pageObj.businessproof : imgElmBusiProof.src= "assets/images/image.png" ;
              //    pageObj.Documet_MstID_BusinessProof=data.cursor2[i].DOCUMENT_DET_ID==undefined ? 0:data.cursor2[i].DOCUMENT_DET_ID;
              //   }
              // if(data.cursor2[i].DOCUMENT_IMAGE && data.cursor2[i].DOC_TYPE=='B'){
              //   pageObj.bankProofCode = data.cursor2[i].DOCUMENT_MST_ID;
              //   pageObj.bankProof = pageObj.arrayBufferToBase64(data.cursor2[i].DOCUMENT_IMAGE.data);
              //   imgElmCanChqProof.src= pageObj.bankProof != undefined ? pageObj.bankProof : imgElmCanChqProof.src= "assets/images/image.png" ;
              //   //this.Documet_MstID_BankProof=data.cursor2[i].DOCUMENT_DET_ID==undefined ? 0:data.cursor2[i].DOCUMENT_DET_ID;
              //  }
            }
          } else {
            pageObj.Documet_MstID_AddressProof = 0;
            pageObj.Documet_MstID_IDProof = 0;
            //  this.Documet_MstID_BusinessProof=0;
            // this.Documet_MstID_BankProof=0;
          }


          // let page = this;
          // this.helpElement.forEach(input => {
          //   switch (input.eid) {

          //     case 'country': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].COUNTRY_CODE; page.countryCode = data.cursor1[0].COUNTRY_CODE;  break;
          //     case 'state': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].STATE_CODE; page.stateCode = data.cursor1[0].STATE_CODE;  break;
          //     case 'district': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].DISTRICT; page.distCode = data.cursor1[0].DISTRICT_CODE;  break;
          //     case 'tahasil': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].TAHASIL; page.tahasilCode = data.cursor1[0].TAHASIL_CODE;  break;
          //     case 'city': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].CITY; page.cityCode = data.cursor1[0].CITY_CODE;  break;
          //     default: break;
          //   }
          // });

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

  save() {
    this.submit();
  }




  toggleTab(secVar) {
    if (secVar === 'Section1') {
      this.insertFlag = true;
      this.showTab1Class = "content-current";
      // this.showTab2Class="";
      // this.showTab3Class="";
      document.getElementById("sp1").style.color = "green";
      if (document.getElementById("sp2"))
        document.getElementById("sp2").style.color = "black";
      document.getElementById("sp3").style.color = "black";
    }
    else if (secVar === 'Section2') {
      this.insertFlag = false;
      this.showTab1Class = "content-current";
    }
    else if (secVar === 'Section3') {
      this.showTab1Class = "content-current";
    }
  }
  SearchCustType(keyword) {
    var uinput = {
      userid: 1,
      keyword: keyword,
      device_id: 'Desktop',
    }
    this.spinner.show();
    debugger;
    let pageObj = this;
    this.service.Search(uinput, this).subscribe(
      data => {
        pageObj.spinner.hide();
        if (data.code === 1) {
          pageObj.clsClass = 'DispBlock';
          if (keyword.indexOf('INSTISUBCHILD') == 0) {
            pageObj.subInstList = data.cursor1;
            pageObj.subInstCode = data.cursor1[0].KEY;
            pageObj.reportedByKey += '~' + data.cursor1[0].KEY;
            this.SearchCustType(this.reportedByKey);
            return;
          }
          if (keyword.indexOf('INSTISUBCLIENT') == 0) {
            pageObj.reportedByList = data.cursor1;
            pageObj.reportedByCode = data.cursor1[0].CLIENT_MST_ID;
            return;
          }
          switch (keyword) {
            case 'CUSTMAST': this.custTypeList = data.cursor1; this.custTypeCode = data.cursor1[0].KEY;
              this.custTypeCode = (data.cursor1.filter(data => data.KEY.split('-')[1] == "I"))[0].KEY.split('-')[0];
              //this.businessSectionShow = this.custTypeCode.split('-')[1] == "I" ? false : true; break;
              break;
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
      // this.option.msg = "Enter 10 Digit Login User Id / Mobile No.";
      // this.option.type = 'error';
      // this.toast.addToast(this.option);

      this.loginuserid = '';
    }
    else if (val == 'an' && this.aadharNumber.toString().trim().length != 12) {
      this.message = "Enter 12 Digit Aadhar Number.";
      MessageBox.show(this.dialog, this.message, "");
      // this.option.msg = "Enter 12 Digit Aadhar Number";
      // this.option.type = 'error';
      // this.toast.addToast(this.option);
      this.aadharNumber = '';
    }
    else if (val == 'pc' && this.pinCode.toString().trim().length != 6) {
      this.message = "Enter 6 Digit PIN CODE";
      MessageBox.show(this.dialog, this.message, "");
      // this.option.msg = "Enter 6 Digit PIN CODE";
      // this.option.type = 'error';
      // this.toast.addToast(this.option);
      this.pinCode = '';
    }
    else if (val == 'mn' && this.mobileNo1.toString().trim().length != 10) {
      this.message = "Enter 10 Digit Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      // this.option.msg = "Enter 10 Digit Mobile No.";
      // this.option.type = 'error';
      // this.toast.addToast(this.option);
      this.mobileNo1 = '';
    }
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
        this.imageSizeCcp = 'Your file size must less than 25kb';
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
      this.imageSizeCcp = 'File Uploaded Successfully.';
      this.bankProof = null;
    }


    imgElm.onload = function () {

      //Set canvas size is same as the picture
      canvas.width = 100;
      canvas.height = 100;
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

              case 'country': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[0].CODE_DESCRIPTION; page.countryCode = data.cursor1[0].CODE_MST_ID; break;
              case 'state': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[1].CODE_DESCRIPTION; page.stateCode = data.cursor1[1].CODE_MST_ID; break;
              case 'district': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[2].CODE_DESCRIPTION; page.distCode = data.cursor1[2].CODE_MST_ID; break;
              case 'tahasil': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[3].CODE_DESCRIPTION; page.tahasilCode = data.cursor1[3].CODE_MST_ID; break;
              case 'city': input.elementRef.nativeElement.children[0].children[0].value = data.cursor1[4].CODE_DESCRIPTION; page.cityCode = data.cursor1[4].CODE_MST_ID; break;
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

  saveClientData() {
    this.spinner.show();
    var uinput = {
      Cbs_Customer_Id: '',
      Inet_Corp_Id: '',//this.inetcorpID,       
      Inet_User_Id: '',//this.InetuserID,      
      Inet_Corporate_Flag: 'I',//this.inetcorpselectflag,
      Cbs_Customer_Mobno: '',
      Bank_Reg_Mst_Id: '',
      Thumb_Active_Flag: '',
      Thumb_Device_Det: '',
      Thumb_Device_No: '',
      Thumb_Mst_Id: '',
      client_req_det_id: this.ClientReqDetId,
      Client_Req_Det_Id: this.ClientReqDetId,
      Insti_Sub_Mst_Id: this.subInstCode,
      Reported_By: this.reportedByCode,
      customer_type: this.custTypeCode,
      login_user_id: this.mobileNo1,
      client_name: this.clientFName + ' ' + this.clientMName + ' ' + this.clientLName,
      client_fname: this.clientFName,
      client_mname: this.clientMName == undefined ? '' : this.clientMName,
      client_lname: this.clientLName,
      date_of_birth: (this.dob && this.dob.trim().length == 0) || (!this.dob) ? null : moment(this.dob).format('DD-MMM-YYYY'),
      business_details: null,
      business_type: null,
      bussiness_line: null,
      business_address: null,
      aadhar_number: this.aadharNumber.toString().replace(/ /g, ""),
      pan_number: this.panNumber,
      tan_number: null,
      gstin: null,
      gst_reg_date: null,
      comp_flag: null,
      bank_ac_number: null,
      Bank_Ac_Name: null,
      bank_ifsc: null,
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
      mobile_no: this.mobileNo1,
      phone_1: this.phoneno,
      email_id: this.email,
      website: '',
      approval_flag: 'Y',
      taxable_flag: 'N',
      bank_ac_type: '',
      client_language: 'E',// this.clientlanguage,
      Dealer_Mst_Id: 1, //this.dealerCode
      address_id: this.addressProofCode,
      address_proof: this.addressproof,
      business_id: null,
      Business_proof: null,
      identity_id: this.identityProofCode,
      identity_proof: this.identityproof,
      client_photo: this.clientphoto,
      Bank_Proof: null,
      Bank_ProofID: null,
      active_status_date: moment(Date.now()).format('DD-MMM-YYYY'),
      enter_user_id: this.logInfo[0].CLIENT_MST_ID,
      enter_desc: this.clientFName, //+ ' ' + this.clientMName + ' ' + this.clientLName
      opflag: this.opFlag,
      request_from: 'WC',
      device_id: 'Desktop',
      reject_reason: ' ',


    }
    
    this.apiService.sendToServer<ICore>('/auth/merchant/addClient', uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1 && data.status === "RNF") {
          this.message = "Your Request Send Successfully For Approval.";
          MessageBox.show(this.dialog, this.message, "");
          this.clear();
          // this.option.msg="Your Request Send Successfully For Approval.";
          // this.option.type ='success';
          // this.toast.addToast(this.option);
          //this.clear();
          //alert("Record Saved Successfully.");
          //this.router.navigate(['/home']);
        }
        else {
          this.message = "check error.";
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
      // () => console.log('client request details')
    );
  }

  getClientData() {
    this.spinner.show();
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
    
    this.apiService.sendToServer<ICore>('/auth/merchant/addClient', uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1 && data.msg === "Success") {

          //this.reportedByCode = data.cursor1[0].CUSTOMER_TYPE;
          this.reportedByCode = data.cursor1[0].CUSTOMER_TYPE + '-' + data.cursor1[0].CODE_VALUE;
          this.loginuserid = data.cursor1[0].LOGIN_USER_ID;
          this.clientname = data.cursor1[0].CLIENT_NAME;
          this.clientFName = data.cursor1[0].CLIENT_FNAME;
          this.clientMName = data.cursor1[0].CLIENT_MNAME;
          this.clientLName = data.cursor1[0].CLIENT_LNAME;
          this.dob = (this.dob && this.dob.trim().length == 0) || (!this.dob) ? null : moment(this.dob).format('DD/MMM/YYYY'),
            // this.dob = moment(data.cursor1[0].DATE_OF_BIRTH).format('DD/MMM/YYYY');
            this.aadharNumber = data.cursor1[0].AADHAR_NUMBER;
          this.businessdet = data.cursor1[0].BUSINESS_DETAILS;
          this.businessTypeCode = data.cursor1[0].BUSINESS_TYPE;
          this.businessLineCode = data.cursor1[0].BUSSINESS_LINE;
          this.businessAddress = data.cursor1[0].BUSINESS_ADDRESS;
          this.panNumber = data.cursor1[0].PAN_NUMBER;
          this.tan = data.cursor1[0].TAN_NUMBER;
          this.gstin = data.cursor1[0].GSTIN;
          // this.gstRegDate = moment(data.cursor1[0].GST_REG_DATE).format('DD/MMM/YYYY');
          this.gstRegDate = this.gstRegDate.trim().length == 0 ? null : moment(this.gstRegDate).format('DD/MMM/YYYY'),
            this.compFlag = data.cursor1[0].COMP_FLAG;
          this.acNo = data.cursor1[0].BANK_AC_NUMBER;
          this.acName = data.cursor1[0].Bank_AC_NAME;
          this.ifsc = data.cursor1[0].BANK_IFSC;
          this.address = data.cursor1[0].ADDRESS_1;
          this.pinCode = data.cursor1[0].PIN_CODE;
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


          // this.cityname = data.cursor1[0].CITY_NAME;
          // this.cityCode = data.cursor1[0].CITY_CODE;
          // this.tahasilCode = data.cursor1[0].TAHASIL_CODE;
          // this.distCode = data.cursor1[0].DISTRICT_COD;
          // this.stateCode = data.cursor1[0].STATE_COD;
          // this.countryCode = data.cursor1[0].COUNTRY_CODE;






          //this.mobileNo1 = data.cursor1[0].MOBILE_NO;
          this.phoneno = data.cursor1[0].PHONE_1;
          this.email = data.cursor1[0].EMAIL_ID;
          this.website = data.cursor1[0].WEBSITE;
          // this.approvalflag = data.data[0].APPROVAL_FLAG;
          this.taxflag = data.cursor1[0].TAXABLE_FLAG;
          this.accountTypeCode = data.cursor1[0].BANK_AC_TYPE;
          this.clientlanguage = data.cursor1[0].CLIENT_LANGUAGE;
          this.addressProofCode = data.cursor2[0].DOCUMENT_MST_ID;
          //TODO  this.addressproof = "data:image/png;base64,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";

          // let bp:any = document.getElementById('#popupBP');
          // bp.style.display='block';
          // let abc:any = document.getElementById('#viewBusinessProof') ;
          // abc.style.display='block';
          // let abs:any = document.getElementById('#previewBusinessProof') ;
          // abs.src=this.addressproof;


          // bp.style.display='none';

          // this.identityProofCode = data.cursor2[1].DOCUMENT_MST_ID;
          // this.identityproof = this.arrayBufferToBase64(data.cursor2[1].DOCUMENT_IMAGE.data);
          // this.businessProofCode = data.cursor2[2].DOCUMENT_MST_ID;
          // this.businessproof = this.arrayBufferToBase64(data.cursor2[2].DOCUMENT_IMAGE.data);
          // this.bankProofId = data.cursor2[3].DOCUMENT_MST_ID;
          // this.bankProof = this.arrayBufferToBase64(data.cursor2[3].DOCUMENT_IMAGE.data);
          // this.clientphoto = this.arrayBufferToBase64(data.cursor1[0].CLIENT_PHOTO);
          // this.activestatusdate = moment(data.cursor1[0].ACTIVE_STATUS_DATE).format('DD/MMM/YYYY');

          this.identityProofCode = data.cursor2[1].DOCUMENT_MST_ID;
          //TODO this.identityproof = "data:image/png;base64,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";
          this.businessProofCode = data.cursor2[2].DOCUMENT_MST_ID;
          //TODO this.businessproof = "data:image/png;base64,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";
          this.bankProofCode = data.cursor2[3].DOCUMENT_MST_ID;
          //TODO this.bankProof = "data:image/png;base64,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";
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

  submit = function () {
    let imgElmAddProof = this.elementRef.nativeElement.querySelector('#imgIdAddressProof');
    let imgElmIdenProof = this.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
    // let imgElmCpProof = this.elementRef.nativeElement.querySelector('#imgIdfilePrfPhoto');

    if (this.mobileNo1 == undefined || this.mobileNo1.toString().trim().length == 0) {
      this.message = "Enter Mobile Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.clientFName == undefined || this.clientFName.toString().trim().length == 0) {
      this.message = "Enter First Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.clientLName == undefined || this.clientLName.toString().trim().length == 0) {
      this.message = "Enter Last Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.aadharNumber == undefined || this.aadharNumber.toString().trim().length == 0) {
      this.message = "Enter Aadhar Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.pinCode == undefined || this.pinCode.toString().trim().length == 0) {
      this.message = "Enter Pin Code.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.address == undefined || this.address.toString().trim().length == 0) {
      this.message = "Enter Address.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.countryCode == undefined || this.countryCode.toString().trim().length == 0) {
      this.message = "Select Country Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.stateCode == undefined || this.stateCode.toString().trim().length == 0) {
      this.message = "Select  State Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.distCode == undefined || this.distCode.toString().trim().length == 0) {
      this.message = "Select District Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.tahasilCode == undefined || this.tahasilCode.toString().trim().length == 0) {
      this.message = "Select Tahasil Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.cityCode == undefined || this.cityCode.toString().trim().length == 0) {
      this.message = "Select City Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.addressProofCode == undefined || this.addressProofCode.toString().trim().length == 0) {
      this.message = "Enter Address Proof Document Name.";
      MessageBox.show(this.dialog, this.message, "");

      return false;
    }
    else if (imgElmAddProof.src.match('assets/images/image.png')) {
      this.message = "Please upload Address Proof Document.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (this.identityProofCode == undefined || this.identityProofCode.toString().trim().length == 0) {
      this.message = "Select Identity Proof document Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    else if (imgElmIdenProof.src.match('assets/images/image.png')) {
      this.message = "Please upload Identity Proof Document.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }


    this.dealerCode = 1;
    return this.saveClientData();

  }

  onChangeInputData(event, helpType) {
    switch (helpType) {
      case 'CT': this.cityname = event; break;
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
      case 'CUST': this.businessSectionShow = this.reportedByCode.split('-')[1] == "I" ? false : true; break;
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
  clearIdImg(id) {
    let imgElm;
    if (id == "A") {
      imgElm = this.elementRef.nativeElement.querySelector('#imgIdAddressProof');
      imgElm.src = "assets/images/image.png";
    } else {
      imgElm = this.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
      imgElm.src = "assets/images/image.png";
    }
  }


  close() {
    this.clsClass = 'DispNone';
  }

  clear = function () {
    let imgElm = this.elementRef.nativeElement.querySelector('#imgIdAddressProof');
    imgElm.src = "assets/images/image.png";
    imgElm = this.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
    imgElm.src = "assets/images/image.png";
    this.companycode = '';
    this.ClientReqDetId = '';
    // this.reportedByCode = '';
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
    this.mobileNo1 = '';
    this.phoneno = '';
    this.email = '';
    this.website = '';
    this.approvalflag = '';
    this.taxflag = 'Y';
    this.accountTypeCode = '';
    this.clientlanguage = '';
    // this.addressProofCode = '';
    this.addressproof = null;
    // this.businessProofCode = '';
    this.businessproof = null;
    // this.identityProofCode = '';
    this.identityproof = null;
    // var src = $('#imgIdfilePrfPhoto').attr('src');
    $('#imgIdfilePrfPhoto').attr('src', 'assets/images/profile-img.png');
    this.clientphoto = null;
    //this.clientphoto = "assets/images/profile-img.png";
    this.activestatusdate = '';
  }




  gotoLogin() {
    this.router.navigate(['/login']);
  }
  gotoAboutBL() {
    this.router.navigate(['/aboutBL']);
  }
  gotoContactBL() {
    this.router.navigate(['/contactBL']);
  }
  gotoSignUp() {
    this.router.navigate(['/signup']);
  }



}
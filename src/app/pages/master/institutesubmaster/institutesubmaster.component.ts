import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { Service } from '../service';
import { Spinner } from "../../../services/spinner";
import { DataStorage } from '../../../core/dataStorage';
import { Help } from '../../../shared/component/help/help.component';
import { dtp } from '../../../shared/component/dtp/dtp.component';
import { ErrorHandler } from '../../../core/errorHandler';
import { ILogin } from '../../../interface/login';
import * as moment from 'moment';
import { Common } from "../../../services/common";
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'vgipl-institutesubmaster',
  styleUrls: ['./institutesubmaster.scss'],
  templateUrl: './institutesubmaster.html',
  providers: [ApiService, Spinner, Service, Common]

})
export class InstitutionSubMasterComponent implements OnInit {
  @ViewChildren(Help) helpElement: QueryList<Help>;
  @ViewChild(dtp) dtp: dtp;
  Opflag: string = ''; isValid: boolean = false;
  clsAddUser: string = ''; clsModifyUser: string = ''; clsInactiveUser: string = '';
  logInfo: ILogin;
  SuperClientMstId: number;

  /* Document Images */
  Math: any; imgSize: number = 25; //Size in kb.
  ImageInstitution: any; imageSizeId: string = " Size of file should be between 5kb–25kb";
  ImageBankDocument: any; imageSizeBp: string = " Size of file should be between 5kb–25kb";

  /* Interface Login Declaration */
  INSTI_MST_ID: number = 0; INSTI_SUB_MST_ID: number = 0;
  INSTITUTION_NAME: string; SUB_INSTI_NAME: string; LOGIN_USER_ID: string; CLIENT_NAME: string;

  /* Control Name */
  instname: string = ''; instsubname: string = ''; mobile: string = ''; landline: string = '';
  gstnumber: string = ''; gstregdate: string = ''; taxflag: string = '';
  registnumber: string = ''; regdate: string = ''; emailadd: string = ''; webadd: string = '';
  cityname: string = ''; pincode: string = ''; address: string = ''; landmark: string = ''; areaname: string = '';
  superclientData: any; ctrl_supclientcode: boolean = false;

  /* Table */
  RptInstiShowHide: string = '';

  bankActype: string = ''; bankacnumber: string = ''; bankacname: string = ''; IFSC_CODE: string = '';

  SetControlValue: string; _gatewaydetid: number = 0;
  InstitutionSubMstId: number;
  InstitutionMstId: number;

  loginuserid: string = '';
  gstin: string = '';
  Institutionname: string = '';
  clientlanguage: string = '';
  operationflag: any;
  activestatusdate: string = '';
  msgshowhide: string = '';
  DisplayMsg: string = '';
  Disp_InstitutionSubMstId: boolean = false;
  Disp_Submit: boolean = true;
  submitbutton: string = 'Submit';
  Disp_Show: boolean = false;
  Disp_Division: boolean = true;
  Disp_Div: boolean = true;
  Disp_Div1: boolean = true;

  ButtonShow: string = 'Show';
  helpData: any;
  isDesc: boolean = false;
  column: string = '';

  activeFlag: any;

  clsClass: any = 'DispNone';
  acceptreject: string = '';
  rejectreason: string = '';
  pages: Array<any>;
  PageData: Array<any>;

  /* --- Forth Row --- */
  countryLabel: string = "Country"; countrykey: string = "CONTMAST"; countryCode: string;
  stateLabel: string = "State"; stateKey: string = "STATEMAST"; stateCode: string; txtStateData: string;
  distLabel: string = "District"; distKey: string = "DISTMAST"; distCode: string;
  tahasilLabel: string = "Tahasil"; tahasilKey: string = "TAHMAST"; tahasilCode: string;
  cityLabel: string = "City"; cityKey: string = "CITYMAST"; cityCode: string;

  /* --- First Row --- */
  instimstidLabel: string = "Institution Name"; instimstidKey: string = "INSTIMAST"; instimstidCode: string;

  dispcheck: boolean = false;
  bankproofid: number;
  businessid: number;

  bankproof: any;
  BussinessImage: any;
  BankProofImage: any;
  DocMastBankProof: any;
  DocMastBusiness: any;

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
  ifsc: string = '';
  bank_name: any;
  branch: any;
  BankData: any;
  Disp_ifsclabel: boolean = false;
  Disp_ifscnotfound: boolean = false;
  Disp_ifscpage: boolean = false;
  showTab1Class: string = "content-current";

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

  constructor(private elementRef: ElementRef, private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private renderer2: Renderer2,
    private apiserv: ApiService,private errorHandler: ErrorHandler, private spinner: Spinner, private dataStorage: DataStorage, private common: Common,
    public service: Service, ) {

  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.INSTI_MST_ID = this.logInfo[0].INSTI_MST_ID;
    this.instname = this.logInfo[0].INSTITUTION_NAME;
    this.LOGIN_USER_ID = this.logInfo[0].LOGIN_USER_ID;
    this.SuperClientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.CLIENT_NAME = this.logInfo[0].CLIENT_NAME;

    this.InitialValues();
    this.GetSuperClient();
    this.GetInstitutionProofData();
    this.GetBankProofData();
    this.SearchBank();
    this.TakeAction('ADD');
  }

  InitialValues() {

    this.taxflag = 'Y';
    this.bankActype = 'SB';
  }

  TakeAction(Val1) {
    this.RptInstiShowHide = 'hideclass';
    this.showTab1Class = "content-current";
    this.clsAddUser = this.clsModifyUser = this.clsInactiveUser = '';
    this.ClearData();
    if (Val1 == 'ADD') {
      this.Opflag = 'N';
      // this.clsAddUser = 'clsTakeAction';
      document.getElementById("sp1").style.color = "green";
      document.getElementById("sp1").style.backgroundColor = "#aae2b7";
      document.getElementById("sp2").style.color = "black";
      document.getElementById("sp3").style.color = "black";
      document.getElementById("sp2").style.backgroundColor = " #fff";
      document.getElementById("sp3").style.backgroundColor = " #fff";
    }
    if (Val1 == 'MODIFY') {
      this.Opflag = 'M';
      this.RptInstiShowHide = 'showclass';
      // this.clsModifyUser = 'clsTakeAction';
      this.Get_AllSubInstitute('0');
      document.getElementById("sp1").style.color = "black";
      document.getElementById("sp2").style.color = "green";
      document.getElementById("sp2").style.backgroundColor = "#aae2b7";
      document.getElementById("sp1").style.backgroundColor = " #fff";
      document.getElementById("sp3").style.backgroundColor = " #fff";
      document.getElementById("sp3").style.color = "black";
    }
    if (Val1 == 'INACTIVE') {
      this.Opflag = 'D';
      this.RptInstiShowHide = 'showclass';
      // this.clsInactiveUser = 'clsTakeAction';
      this.Get_AllSubInstitute('0');
      document.getElementById("sp1").style.color = "black";
      document.getElementById("sp2").style.color = "black";
      document.getElementById("sp3").style.color = "green";
      document.getElementById("sp3").style.backgroundColor = "#aae2b7";
      document.getElementById("sp1").style.backgroundColor = " #fff";
      document.getElementById("sp2").style.backgroundColor = " #fff";
    }
  }

  Get_AllSubInstitute(SubId) {
    this.spinner.show();
    var uinput = {
      Insti_Sub_Mst_Id: SubId,
      Opflag: 'V',
    }
    this.service.AddModify_InstitutionData(uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1) {
          this.clsClass = 'DispBlock';
          this.helpData = data.cursor1;
        }
        else {

        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('Get All Sub Institute')
    );
  }

  GetSuperClient() {
    this.spinner.show();
    var uinput = {
      userid: this.LOGIN_USER_ID,
      keyword: 'INSTISUBCLIENT' + '~' + this.INSTI_SUB_MST_ID,
      device_id: 'Desktop',
    }
    this.service.Search(uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1) {
          this.superclientData = data.cursor1;
        }
        else {
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('Institution Sub master')
    );
  }

  GetBankProofData() {
    this.spinner.show();
    var uinput = {
      userid: this.LOGIN_USER_ID,
      keyword: 'DM~B',
      device_id: 'Desktop',
    }
    this.service.Search(uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1) {
          this.DocMastBankProof = data.cursor1;
          this.bankproofid = data.cursor1[0].KEY;
        }
        else {

        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('Get Bank Proof Documents')
    );
  }

  SearchPincode() {
    if (this.pincode && this.pincode.toString().trim().length != 6) {
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

    var uinput = {
      PinCode: this.pincode,
    }
    this.service.GetPinCodeData(uinput, this).subscribe(
      data => {
        if (data.code === 1) {
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

        }
      },
      err => {
      },
      // () => console.log('Search PIN Code')
    );
  }

  Get_SingleInstitute(SubId) {
    var uinput = {
      Insti_Sub_Mst_Id: SubId,
      Enter_User_Id: this.LOGIN_USER_ID,
      Enter_Desc: this.CLIENT_NAME,
      Opflag: 'V',
    }
    this.service.GetInstituteData(uinput, this).subscribe(
      data => {
        if (data.code === 1) {
          if (data.cursor1) {
            let d1 = data.cursor1[0];
            this.INSTI_MST_ID = this.instimstidCode = d1.INSTITUTION_NAME.split('-')[0];
            this.INSTI_SUB_MST_ID = d1.INSTI_SUB_MST_ID;
            this.instsubname = d1.SUB_INSTI_NAME;
            this.mobile = d1.MOBILE_NO;
            this.landline = d1.PHONE_1;
            this.gstnumber = d1.GSTIN;
            this.gstregdate == '';
            if (d1.GST_REG_DATE != null && d1.GST_REG_DATE != '')
              this.gstregdate = moment(d1.GST_REG_DATE).format('DD/MMM/YYYY');
            this.taxflag = d1.TAXABLE_FLAG;
            this.SuperClientMstId = d1.SUPER_CLIENT_MST_ID;
            this.registnumber = d1.REG_NUMBER;
            this.regdate == '';
            if (d1.REG_DATE != null && d1.REG_DATE != '')
              this.regdate = moment(d1.REG_DATE).format('DD/MMM/YYYY');
            this.emailadd = d1.EMAIL_ID;
            this.webadd = d1.WEBSITE;
            this.address = d1.ADDRESS_1;
            this.landmark = d1.LANDMARK_NAME;
            this.areaname = d1.AREA_NAME;
            this.pincode = d1.PIN_CODE;
            this.countryCode = d1.COUNTRY_CODE;
            this.stateCode = d1.STATE_CODE;
            this.distCode = d1.DISTRICT_CODE;
            this.tahasilCode = d1.TAHASIL_CODE;
            this.cityCode = d1.CITY_CODE;
            this.cityname = d1.CITY_NAME;
            this.bankActype = d1.BANK_AC_TYPE;
            this.bankacnumber = d1.BANK_AC_NUMBER;
            this.bankacname = d1.BANK_AC_NAME;
            this.IFSC_CODE = d1.BANK_IFSC;

            if (data.cursor2) {
              for (var i = 0; i < data.cursor2.length; i++) {
                let d2 = data.cursor2[i];
                if (d2) {
                  if (d2.DOC_TYPE === 'C') {
                    let img = this.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
                    this.businessid = d2.DOCUMENT_MST_ID;
                    this.ImageInstitution = this.arrayBufferToBase64(d2.DOCUMENT_IMAGE.data).toString();
                    img.src = this.ImageInstitution;
                    this.imageSizeId = '';
                  }
                  if (d2.DOC_TYPE === 'B') {
                    let img = this.elementRef.nativeElement.querySelector('#imgIdBusinessProof');
                    this.bankproofid = d2.DOCUMENT_MST_ID;
                    this.ImageBankDocument = this.arrayBufferToBase64(d2.DOCUMENT_IMAGE.data).toString();
                    img.src = this.ImageBankDocument;
                    this.imageSizeBp = '';
                  }
                }
              }
            }

            this.SearchPincode();
          }
        }
        else {
          this.message = "Record not Found.";
          MessageBox.show(this.dialog, this.message, "");

        }
      },
      err => {
      },
      // () => console.log('Institution Sub Master')
    );
  }

  GetInstitutionProofData() {
    this.spinner.show();
    var uinput = {
      userid: this.LOGIN_USER_ID,
      keyword: 'DM~C',
      device_id: 'Desktop',
    }
    this.service.Search(uinput, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code === 1) {
          this.DocMastBusiness = data.cursor1;
          this.businessid = data.cursor1[0].KEY;
        }
        else {
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      },
      // () => console.log('Institution Identity Proof')
    );
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
      if (obj.SetControlValue == 'gstregdate')
        this.gstregdate = obj.mydate;
      if (obj.SetControlValue == 'regdate')
        this.regdate = obj.mydate;
      if (obj.SetControlValue == 'activestatusdate')
        this.activestatusdate = obj.mydate;
    }
  }

  validation(val) {
    // if (val == 'mn' && this.mobile.toString().trim().length != 10) {
    //   alert("Enter 10 Digit Mobile No.");
    //   this.mobile = '';
    // }

    // else if (val == 'pc' && this.pincode.toString().trim().length != 6) {
    //   this.message ="Enter 6 Digit PIN CODE"; 
    // MessageBox.show(this.dialog, this.message, "");
    //   this.pincode = '';
    // }
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
      default: break;
    }
  }




  GetUserInput() {
    if (this.Opflag == 'N') {
      this.INSTI_SUB_MST_ID = 0;
    }

    //GST Number
    let gstnum = this.gstnumber;
    if (gstnum != undefined && gstnum != "") {
      gstnum = gstnum.toString().toUpperCase();
    }
    //Registration Number
    let regnum = this.registnumber;
    if (regnum != undefined && regnum != "") {
      regnum = regnum.toString().toUpperCase();
    }

    var uinput = {
      Insti_Sub_Mst_Id: this.INSTI_SUB_MST_ID,
      Insti_Mst_Id: this.INSTI_MST_ID,
      Sub_Insti_Name: this.instsubname,
      Taxable_Flag: this.taxflag,
      Gstin: gstnum,
      Gst_Reg_Date: this.gstregdate,
      Reg_Number: regnum,
      Reg_Date: this.regdate,
      Super_Client_Mst_Id: this.SuperClientMstId,
      Bank_Ac_Type: this.bankActype,
      Bank_Ac_Number: this.bankacnumber,
      Bank_Ac_Name: this.bankacname,
      Bank_Ifsc: this.IFSC_CODE,
      Address_1: this.address,
      Pin_Code: this.pincode,
      Landmark_Name: this.landmark,
      Area_Name: this.areaname,
      City_Name: this.cityname,
      City_Code: this.cityCode,
      Tahasil_Code: this.tahasilCode,
      District_Code: this.distCode,
      State_Code: this.stateCode,
      Country_Code: this.countryCode,
      Mobile_No: this.mobile,
      Phone_1: this.landline,
      Email_Id: this.emailadd,
      Website: this.webadd,

      Business_Flag: 'C',
      Business_Id: this.businessid,
      Business_Proof: this.ImageInstitution,

      Bank_Flag: 'B',
      Bank_ProofID: this.bankproofid,
      Bank_Proof: this.ImageBankDocument,

      Active_Flag: 'Y',
      Active_Status_Date: moment(Date.now()).format('DD-MMM-YYYY'),
      Enter_User_Id: this.SuperClientMstId,
      Enter_Desc: this.CLIENT_NAME,
      Opflag: this.Opflag,
      Request_From: 'WC',
      Device_Id: 'Desktop',

    }

    return uinput
  }

  ValidateData() {
    if (this.Opflag == 'M' || this.Opflag == 'D') {
      if (this.INSTI_SUB_MST_ID == 0) {
        this.message = "Select Sub-Institute Before Modification OR InActivation.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    }

    // Institute Sub Name
    if (this.instsubname == undefined || this.instsubname.toString().trim() == "") {
      this.message = "Enter Sub-Institute Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    //Mobile Number 
    // if (this.mobile == undefined || this.mobile.toString().trim() == "") {
    //   alert('Enter Mobile Number.')
    //   return false;
    // }
    // if (this.mobile.toString().length != 10) {
    //   alert('Enter Valid Mobile Number.')
    //   return false;
    // }
    //Address
    if (this.address == undefined || this.address.toString().trim() == "") {
      this.message = "Enter Address.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    //PinCode
    // if (this.pincode == undefined || this.pincode.toString().trim() == "") {
    //   alert('Enter Pincode.')
    //   return false;
    // }
    //Bank Account Number
    // if (this.bankacnumber == undefined || this.bankacnumber.toString().trim() == "") {
    //   alert('Enter Bank Account Number.')
    //   return false;
    // }
    // //Bank Account Name
    // if (this.bankacname == undefined || this.bankacname.toString().trim() == "") {
    //   alert('Enter Bank Account Name.')
    //   return false;
    // }
    // //Bank Account IFSC
    // if (this.bankifsc == undefined || this.bankifsc.toString().trim() == "") {
    //   alert('Enter Bank Account IFSC.')
    //   return false;
    // }

    return true;
  }

  SubmitData() {
    this.isValid = this.ValidateData();
    if (this.isValid == false) {
      return;
    }

    var val = confirm('Do you want to Submit ?');
    if (val) {
      this.service.AddModify_InstitutionData(this.GetUserInput(), this).subscribe(
        data => {
          if (data.code === 1) {
            if (this.Opflag == 'N') {
              this.message = "Sub-Institution Created Successfully.";
              MessageBox.show(this.dialog, this.message, "");
            }
            else if (this.Opflag == 'M') {
              this.message = "Sub-Institution Modified Successfully.";
              MessageBox.show(this.dialog, this.message, "");
            }
            else if (this.Opflag == 'D') {
              this.message = "Sub-Institution Inactivated Successfully.";
              MessageBox.show(this.dialog, this.message, "");
            }
          }
          else {
            this.message = "check error";
            MessageBox.show(this.dialog, this.message, "");
          }
        },
        err => {
          alert(err.error);
          this.message = err.error;
          MessageBox.show(this.dialog, this.message, "");

        },
        // () => console.log('Institution Sub Master')
      );
    }
  }

  RequestApproveReject = function () {
    var elm = this.elementRef.nativeElement.querySelector('#ddlacceptR');
    var optionElm = elm.selectedOptions[0];
    this.acceptreject = optionElm.value;
    if (this.acceptreject == 'R') {
      this.Disp_Div = true;
      this.divClientThumb = false;
    }
    else if (this.acceptreject == 'A') {
      this.Disp_Div = false;
      this.divClientThumb = true;
    }

  }

  submit = function () {
    if (this.route.queryParams["_value"].mode == 'N') {
      this.InstitutionSubMstId = 0;
    }
    else {
      if (this.InstitutionSubMstId == undefined || this.InstitutionSubMstId.toString().trim().length == 0) {
        this.message = "Select Record from table.";
        MessageBox.show(this.dialog, this.message, "");
        return;
      }
    }

    if (this.instimstidCode == undefined || this.instimstidCode == '') {
      this.message = "Enter Institution Master Id.";
      MessageBox.show(this.dialog, this.message, "");
      return;
    }
    // else if (this.mobile == undefined || this.mobile == '') {
    //   alert("Enter Mobile No.");
    //   return;
    // }

    // else if (this.address == undefined || this.address == '') {
    //   alert("Enter Address");
    //   return;
    // }


    // if (this.gstregdate == undefined || this.gstregdate == '') {
    //   alert("Enter GST Registration Date.");
    //   return;
    // }


    // if (this.bankacnumber == undefined || this.bankacnumber == '') {
    //   alert("Enter Bank A/c Number.");
    //   return;
    // }
    // else if (this.bankifsc == undefined || this.bankifsc == '') {
    //   alert("Enter Bank IFSC Code");
    //   return;
    // }
    // else if (this.bankActype == undefined || this.bankActype == '') {
    //   alert("Enter Bank A/c Type");
    //   return;
    // }


    let inputFileBusiness: HTMLInputElement = this.elementRef.nativeElement.querySelector('#inputbusinessproof');
    let fileCountbusiness: number = inputFileBusiness.files.length;
    let inputFileBankProof: HTMLInputElement = this.elementRef.nativeElement.querySelector('#inputbankproof');
    let fileCountBankProof: number = inputFileBankProof.files.length;

    // 5120 byte = 5KB,  6144 Byte = 6 KB, 7168 Byte = 7 MB, 25600 byte=25KB
    if (fileCountbusiness > 0) { //businessproof
      if (inputFileBusiness.files.item(0).size > 25600) {
        this.message = "Bussiness Proof Image size can not be Greater than 25 KB.";
        MessageBox.show(this.dialog, this.message, "");
        return;
      }
    }

    if (fileCountBankProof > 0) { //clientphoto
      if (inputFileBankProof.files.item(0).size > 25600) {
        this.message = "Bank Proof Image size can not be Greater than 25 KB.";
        MessageBox.show(this.dialog, this.message, "");
        return;
      }
    }
    if (this.route.queryParams["_value"].mode == 'N') {
      return this.saveInstitutionSubMasterData();
    }
    else {
      this.saveInstitutionSubMasterData();
    }
  }








  GetKey(val) {
    // alert('Get Key');
    this.message = "Get Key";
    MessageBox.show(this.dialog, this.message, "");
    if (this.route.queryParams["_value"].mode == 'N') { }
    else {
      this.InstitutionSubMstId = val;


    }
  }

  bytesToSize(bytes) {
    this.Math = Math;
    let sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 0;
    var i = parseInt(this.Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
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

  fileSelected(fileInput: any, obj, elmFlag) {
    let dataURL = '';
    let self = this;
    let imgElm = obj.elementRef.nativeElement.querySelector('#imgId' + elmFlag);
    let imgId = imgElm.id;
    let tmpImgSize = obj.bytesToSize(fileInput.currentTarget.files[0].size);
    if (tmpImgSize.indexOf('MB') > -1 || parseFloat(tmpImgSize) > this.imgSize) {
      imgElm.src = "assets/images/image.png";
      //For Institution
      if (imgId == 'imgIdIdentityProof') {
        this.imageSizeId = 'Your file size must less than 25kb';
      }
      //For Bank
      if (imgId == 'imgIdBusinessProof') {
        this.imageSizeBp = 'Your file size must less than 25kb';
      }

      return false;
    }

    let reader = new FileReader();
    let canvas = document.createElement("canvas");
    let canvasContext = canvas.getContext("2d");
    //For Institution
    if (imgId == 'imgIdIdentityProof') {
      this.imageSizeId = 'File Uploaded Successfully.';
      this.ImageInstitution = null;
    }
    //For Bank
    if (imgId == 'imgIdBusinessProof') {
      this.imageSizeBp = 'File Uploaded Successfully.';
      this.ImageBankDocument = null;
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
        case 'fileIdentityProof': self.ImageInstitution = dataURL; break;
        case 'fileBusinessProof': self.ImageBankDocument = dataURL; break;
        default: break;
      }
    }
    reader.onload = function (e: any) {
      imgElm.src = e.target.result;
    }
    reader.readAsDataURL(fileInput.target.files[0]);
  }

  GetKeyDocMastBusinessProof(val) {
    this.businessid = val;
  }

  close() {
    this.clsClass = 'DispNone';
  }

  ClearData() {
    this.instimstidCode = '';
    this.instsubname = '';
    this.taxflag = 'Y';
    this.gstin = ''; this.gstregdate = '';
    this.registnumber = ''; this.regdate = '';
    this.mobile = ''; this.landline = ''; this.emailadd = ''; this.webadd = '';
    this.bankActype = '';
    this.bankacnumber = '';
    this.bankacname = '';
    this.IFSC_CODE = '';
    this.address = '';
    this.pincode = '';
    this.landmark = '';
    this.gstnumber = '';
    this.areaname = '';
    this.cityname = '';
    this.cityCode = '';
    this.tahasilCode = '';
    this.distCode = '';
    this.stateCode = '';
    this.countryCode = '';
    this.bankacname = '';
    this.clientlanguage = '';
    this.activestatusdate = '';
    this.ButtonShow = 'Show';
    this.bankActype = 'SB';
    this.rejectreason = '';

    try {
      this.ImageInstitution = null; this.ImageBankDocument = null;
      let img1 = this.elementRef.nativeElement.querySelector('#imgIdIdentityProof');
      // img1.src = null;
      img1.src = "/assets/images/image.png";
      let img2 = this.elementRef.nativeElement.querySelector('#imgIdBusinessProof');
      img2.src = "/assets/images/image.png";
    }
    catch (error) { }

    try {
      if (this.helpElement) {
        this.helpElement.forEach(input => {
          if (input) {
            switch (input.eid) {
              case 'country':
                input.elementRef.nativeElement.children[0].children[0].value = '';
                input.elementRef.nativeElement.children[0].children[1].className = '';
                this.countryCode = '';
                break;
              case 'state':
                input.elementRef.nativeElement.children[0].children[0].value = '';
                input.elementRef.nativeElement.children[0].children[1].className = '';
                this.stateCode = '';
                break;
              case 'district':
                input.elementRef.nativeElement.children[0].children[0].value = '';
                input.elementRef.nativeElement.children[0].children[1].className = '';
                this.distCode = '';
                break;
              case 'tahasil':
                input.elementRef.nativeElement.children[0].children[0].value = '';
                input.elementRef.nativeElement.children[0].children[1].className = '';
                this.tahasilCode = '';
                break;
              case 'city':
                input.elementRef.nativeElement.children[0].children[0].value = '';
                input.elementRef.nativeElement.children[0].children[1].className = '';
                this.cityCode = '';
                break;
              case 'instimstid':
                input.elementRef.nativeElement.children[0].children[0].value = '';
                input.elementRef.nativeElement.children[0].children[1].className = '';
                this.instimstidCode = '';
                break;
              default: break;
            }
          }
        });
      }
    }
    catch (error) { }
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

  sort(property) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    let direction = this.isDesc ? 1 : -1;
    this.helpData.sort(function (a, b) {
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


}
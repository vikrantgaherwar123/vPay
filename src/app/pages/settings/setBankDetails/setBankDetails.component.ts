import { Component, OnInit, Renderer2, Inject, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ICore } from "../../../interface/core";
import { ILogin } from "../../../interface/login";
import { ApiService } from "../../../core/api.service";
import { DataStorage } from "../../../core/dataStorage";
import { Spinner } from "../../../services/spinner";
import { Service } from '../../merchantRegistration/service';
import { IOtp } from "../../../interface/otp";
import { ErrorHandler } from "../../../core/errorHandler";
import { Toast } from "../../../services/toast";
import { Common } from "../../../services/common";
import { Otp } from "../../../shared/component/otp/otp.component";
import * as moment from "moment";
import { dtp } from "../../../shared/component/dtp/dtp.component";
import { MatDialog, MatDialogConfig,} from '@angular/material';
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
import { ConfirmDialogComponent } from '../../../shared/component/confirm-dialog/confirm-dialog.component';

declare const $: any;
@Component({
  selector: "vgipl-setBankDetails",
  templateUrl: "./setBankDetails.component.html",
  styleUrls: ["./setBankDetails.component.scss"],
  providers: [ApiService, Spinner, Common, Service]
})
export class SetBankDetailsComponent implements OnInit, AfterViewInit {
  @ViewChildren(Otp) otpCntrl: QueryList<Otp>;
  @ViewChild(dtp)
  dtp: dtp;
  logInfo: ILogin;
  clientMstId: number;
  login_user_id: string;
  BUSINESS_DETAILS: string = "";
  Insti_Sub_Mst_Id: string = "";
  showBankName: string = "hide";
  Corporate_Flag: any;
  model: any;
  bankProofList: any;
  bankProofCode: string;
  bankProofName: any;
  otp: any;
  bankAcData: any;
  bankAc: any;
  INSTI_SUB_MST_ID: any;
  CLIENT_MST_ID: any;
  CORPORATE_FLAG: any = "I";
  CLIENT_BANK_MST_ID: any;
  CBS_CUSTOMER_ID: any;
  CBS_CUSTOMER_MOBNO: any;
  SETCLASS: any = "REMOVEROWCOLOR";
  IFSC_CODE: any = "";
  BANK_AC_NAME: any = "";
  AC_NUMBER: any = "";
  bankProofKey: string = "DM~B"
  DEFAULT_FLAG: boolean = false;
  OTP_ExpDur: any = "";
  Po_Otp_Det_ID: any = "";
  select: any = false;
  Bank_Ac_Type: any = "";
  OpFlag: any = "N";
  search: any = false;
  BANK_NAME: any;
  STATE_NAME: any;
  CITY_NAME: any;
  BRANCH_NAME: any;
  //for Ifsc code
  bank_name: any;
  branch: any;
  BankData: any;
  myparam: any;
  // pflag:any;
  addNewTab: string = 'hide';
  addNewDevBtn: boolean = false;
  disDevTab: boolean = true;
  addBtn: boolean = true;
  editDevBtn: boolean = false;
  showOtp: string = "hide cta OtpBtn";
  showVpayOtp: string = "hide";
  // hideOtp: string = "hide";
  showOtpModel: boolean = false;
  showOtpModelPrim: boolean = false;
  showOtpDivBox: string = "hide";
  btnDel: boolean = false;
  btnShowGenOtp: boolean = true;
  showBankImage: boolean = false;
  //ifscbank code popup
  clsClass: any = "DispNone";
  bank: any;
  bankdata: any;
  state: any;
  statedata: any;
  city: any;
  citydata: any;

  branchdata: any;
  ifsc: any;
  Disp_ifsclabel: boolean = false;
  Disp_ifscnotfound: boolean = false;
  Disp_ifscpage: boolean = false;
  // showForm: string = "show";
  showForm: boolean = true;

  msgType: string = "";
  option = {
    position: "top-center",
    showClose: true,
    timeout: 5000,
    theme: "bootstrap",
    type: this.msgType,
    closeOther: false,
    msg: ""
  };
  otpElement: any;
  // otpElement1: any;
  vpayOtpElement: any;
  OTP_Det_ID: string = "";
  po_OTPExpDur: any;

  //mobile Banking
  showcbsForm = false;
  cbsFormShow = "hide";
  Disp_BankModal = false;
  // showBankList = false;
  // showOverlay = false;
  BankList: any = [];
  listarray: any = [];
  DOB: any;
  Mobile_Number: any;
  Customer_ID: any;
  msgshowhide: string = "";
  DisplayMsg: string = "";
  BANK_REG_MST_ID: any;
  OTPData: any;
  OTP_ExpireDur: any = '';
  bankObject: any;
  // SECRET_KEY: any = '';
  RRN_Number: any = '';

  clientpic: any;
  kycFlag: any;
  prof3: any;
  BANK_MST_ID: any;
  otherBank_MstID: any;
  termCondContent: string;
  inetcorpflag: any;
  InetuserID: any;
  inetcorpID: any;
  sessionId: any;
  inetcorpselectflag: any = 0;
  inetselectcorpid: any = 0;
  inetflagresp: any = false;
  imgSize: number = 25; //in kb
  imageSizeCcp: string = " Size of file should be between 5kb–25kb";
  CancelChequeProof: string = "assets/images/image.png";
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
  Math: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dataStorage: DataStorage,
    private errorHandler: ErrorHandler,
    public dialog: MatDialog,
    private renderer2: Renderer2,
    private common: Common,
    private toast: Toast,
    private elementRef: ElementRef,
    public service: Service,
    private spinner: Spinner
  ) {
    // this.loginClass = "btn-login1";
    this.SearchCustType(this.bankProofKey);
  }


  ngOnInit() {
    $("#vpayBanner").hide();

    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.sessionId = this.logInfo.sessionId;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';
    this.kycFlag = this.logInfo[0].KYC_FLAG;
    this.GetUpdateBankData("V", this);
    this.SearchBank();


  }
  ngAfterViewInit() {
    this.otpElement = this.otpCntrl.find(a => a.eid == "otp");
    // this.otpElement1 = this.otpCntrl.find(a => a.eid == "otp1");
    this.vpayOtpElement = this.otpCntrl.find(a => a.eid == "vpayOtp");

    // this.secretKeyElement =  this.otpCntrl.find(a=>a.eid=='seceretKey');
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
            case 'DM~B': this.bankProofList = data.cursor1; this.bankProofCode = data.cursor1[0].KEY; break;
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
  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "19", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }



  getOtp(pflag) {
    var paramObj = {
      device_id: "Desktop",
      Device_Id: "Desktop",
      login_user_id: this.login_user_id,
      flag: "BA",
      request_from: "WB",
      Client_Mst_Id: this.clientMstId,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag
    };
    this.spinner.show();
    let pageObj = this;

    this.apiService.sendToServer<IOtp>("/api/virtualPay/GetOTP", paramObj, this).subscribe(
      data => {
        this.spinner.hide();
        if (data != null && data != undefined) {
          if (data.Po_Error != null) {
            this.message = data.Po_Error;
            MessageBox.show(this.dialog, this.message, "");
          } else {
            pageObj.OTP_Det_ID = data.Po_Otp_Det_ID;
            pageObj.po_OTPExpDur = data.po_OTPExpDur;

            // this.DEFAULT_FLAG = '';
            // if (pageObj.showOtp == "show cta OtpBtn") {
            //   pageObj.otpElement1.placeholder = "Enter OTP";
            //   pageObj.otpElement1.showOtp(data, pageObj);
            // } else {
            pageObj.otpElement.placeholder = "Enter OTP";
            pageObj.otpElement.showOtp(data, pageObj);
            // }
            pageObj.Po_Otp_Det_ID = pageObj.OTP_Det_ID;
          }
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      }
    );
    return false;
  }

  onClickCheckOTP(pflag) {
    var curotp = "";

    // if (this.showOtp == "show cta OtpBtn") {
    //   curotp = this.otpElement1.otp;
    // } else {
    curotp = this.otpElement.otp;
    // }
    // for Otp control

    // curotp = this.otpCntrl.otp;
    if (!curotp || (curotp && curotp.trim().length != 6)) {
      // alert("Please Enter valid OTP.");
      this.message = "Please Enter valid OTP.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.spinner.show();
    let paramObj = {
      login_user_id: this.login_user_id,
      OTP_Det_ID: this.Po_Otp_Det_ID,
      otp: curotp,
      Request_From: "WB"
    };
    let pageObj = this;
    this.apiService
      .sendToServer<IOtp>("/auth/merchant/CheckOTP", paramObj, this)
      .subscribe(
        data => {
          this.spinner.hide();
          if (data && data.msg === "Success") {
            pageObj.showOtpDivBox = "show";
            pageObj.GetUpdateBankData(pflag, pageObj);
            pageObj.showOtpDivBox = "hide";
            pageObj.otpElement.hideOtp();
            // pageObj.otpElement1.hideOtp();
          } else {

            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
            // this.option.msg= data.msg;
            // this.toast.addToast(this.option);
          }
        },
        err => {
          this.spinner.hide();
          this.errorHandler.handlePageError(err);
        }
      );
  }

  regenerateOTP() {
    this.spinner.show();
    let paramObj = {
      Otp_Det_ID: this.Po_Otp_Det_ID
    };
    let pageObj = this;
    this.apiService.sendToServer<IOtp>("/auth/merchant/regenOTP", paramObj, this).subscribe(
      data => {
        if (data) {
          this.spinner.hide();
          if (data.msg === "Success") {
            pageObj.OTP_Det_ID = data.Pio_Otp_Det_ID;
            pageObj.po_OTPExpDur = data.Po_Otpexpdur;
            pageObj.otpElement.placeholder = "Enter OTP";
            pageObj.otpElement.showOtp(data, pageObj);
            pageObj.Po_Otp_Det_ID = pageObj.OTP_Det_ID;
            // for Otp control
          } else {

            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
            this.otpElement.otp = "";
            // this.otpElement1.otp = "";
            this.router.navigate(["/authentication/login"]);
          }
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      }
    );
  }

  //pflag ='N'= NEW, ' = UPDATE,   D= DELETE
  GetUpdateBankData(pflag, pageObj) {
    if (pflag == 'V') {
      this.addNewTab = "hide";
      this.showBankImage = false;
    }
    this.spinner.show();

    var paramObj = {
      Client_Bank_Mst_Id: pageObj.CLIENT_BANK_MST_ID != null ? pageObj.CLIENT_BANK_MST_ID : "",//0
      Client_Mst_Id: pageObj.clientMstId,
      Bank_Ac_Number: pageObj.AC_NUMBER,
      Bank_Ifsc: pageObj.IFSC_CODE,
      Bank_Ac_Name: pageObj.BANK_AC_NAME,
      Default_Flag: pageObj.DEFAULT_FLAG == true ? "Y" : "N",
      Bank_Ac_Type: pageObj.Bank_Ac_Type,
      Opflag: pflag,
      Bank_Reg_Mst_Id: pageObj.BANK_REG_MST_ID != null ? pageObj.BANK_REG_MST_ID : 0,
      Cbs_Customer_Id: pageObj.CBS_CUSTOMER_ID != null ? pageObj.CBS_CUSTOMER_ID : "",
      Cbs_Customer_Mobno: pageObj.CBS_CUSTOMER_MOBNO != null ? pageObj.CBS_CUSTOMER_MOBNO : "",
      Request_From: "WB",
      device_id: "Desktop",
      Device_Id: "Desktop",
      login_user_id: pageObj.login_user_id,
      Insti_Sub_Mst_Id: pageObj.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: pageObj.Corporate_Flag,
      Corporate_Flag: pageObj.Corporate_Flag,
      corporate_flag: pageObj.Corporate_Flag,
      DocMstID_Bank: (pageObj.bankProofCode == undefined ? null : pageObj.bankProofCode),
      Doc_IMG_Bank: (pageObj.CancelChequeProof == undefined ? null : pageObj.CancelChequeProof),
    };
    this.apiService.sendToServer<ICore>("/api/virtualPay/ClientBankDetails", paramObj, pageObj).subscribe(
      data => {
        this.spinner.hide();
        if (data.code == 1 && data.msg.toUpperCase() == "SUCCESS") {
          if (pflag == "V") {
            if (data.data.length > 0) {
              //bind data to select option
              //other than 0 
              let bnkmstid = data.data.filter(item => item.BANK_REG_MST_ID > 0)
              bnkmstid = bnkmstid.map(item => item.BANK_REG_MST_ID);
              if (bnkmstid.length > 0)
                this.BANK_MST_ID = bnkmstid[0];
              else
                this.BANK_MST_ID = 0;
              //other Bank =0 || null
              let nonbnkmstid = data.data.filter(item => item.BANK_REG_MST_ID == 0 || item.BANK_REG_MST_ID == null)
              nonbnkmstid = nonbnkmstid.map(item => item.BANK_REG_MST_ID);
              if (nonbnkmstid.length > 0)
                this.otherBank_MstID = nonbnkmstid[0] == null ? 0 : nonbnkmstid[0];
              else
                this.otherBank_MstID = 1;
              this.bankAcData = data.data;
              if (data.data[0].BANKNAME == null) {
                this.showBankName = "hide";
                this.AddNew('N');
              }
              else {
                this.showBankName = "show";
              }
            }
          } else {
            //save record message
            if (pflag == "D") {
              this.message = "Bank Account Deleted successfully.";
              MessageBox.show(this.dialog, this.message, "");
            } else if (pflag == "N") {
              this.message = "Bank Account Added successfully.";
              MessageBox.show(this.dialog, this.message, "");
            } else if (pflag == "M") {
              this.message = "Bank Account Updated successfully.";
              MessageBox.show(this.dialog, this.message, "");
            }
            this.router.navigate(['/home']);
            pageObj.showOtpDivBox = "hide";
            pageObj.disDevTab = true;
            pageObj.GetUpdateBankData("V", pageObj);
            pageObj.Cleardata();
            pageObj.Back();
          }
        } else {
          this.spinner.hide();
          if (data.msg == "Record not Found.") {
            this.AddNew('N');
          }
          else {
            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
          }
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      }
    );
  }

  Back() {
    this.disDevTab = true;
    this.addNewTab = 'hide';
    this.bank_name = "";
    this.cbsFormShow = "hide";
    this.branch = undefined;
    this.otpElement.otp = "";
    this.vpayOtpElement.otp = '';
    this.po_OTPExpDur = 0;
    this.showVpayOtp = "hide";
    this.showOtpDivBox = "hide";
    this.ClearCbsForm();
    this.GetUpdateBankData("V", this);
  }

  SelectAc(obj) {
    this.btnShowGenOtp = true;
    this.showOtpDivBox = 'hide';
    this.showForm = true;
    this.disDevTab = false;
    this.addBtn = false;
    this.OpFlag = "M";
    this.addNewTab = 'show';
    this.editDevBtn = true;
    this.title = "Update Bank Account";
    this.showBankImage = true;
    this.IFSC_CODE = obj.BANK_IFSC;
    this.AC_NUMBER = obj.BANK_AC_NUMBER;
    this.CLIENT_BANK_MST_ID = obj.CLIENT_BANK_MST_ID;
    this.CLIENT_MST_ID = obj.CLIENT_MST_ID;
    this.BANK_AC_NAME = obj.BANK_AC_NAME;
    this.DEFAULT_FLAG = obj.DEFAULT_FLAG == "Y" ? true : false;
    this.Bank_Ac_Type = obj.BANK_AC_TYPE;
    this.bank_name = obj.BANKNAME;
    if (obj.DEFAULT_FLAG == "Y") {
      //this.alertCtrl.presentToast('A/c is set as a default account,can not delete');
    } else {
    }
  }

  AddNew(Opflag) {
    this.Cleardata();
    this.OpFlag = "N";
    this.addBtn = true;
    this.listarray = [];
    this.Get_BankList();
    // this.addNewTab = "col-md-12 col-sm-12 show";
    this.editDevBtn = false;
    this.title = "Add New Bank Account";
    this.showBankImage = true;
    this.disDevTab = false;
    this.btnShowGenOtp = true;
    this.DEFAULT_FLAG = false;
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
  //     width: '250px',
  //     // data: {name: this.name, animal: this.animal}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     // this.animal = result;
  //   });
  // }

  clearIdImg(id) {
    let imgElm;
    if (id == "B") {
      imgElm = this.elementRef.nativeElement.querySelector('#imgIdCancelChequeProof');
      imgElm.src = "assets/images/image.png";
    } 
  }




  Delete(item) {
    if (item.CLIENT_BANK_MST_ID != undefined) {
      this.OpFlag = "D";
      if (!confirm("Do you want to Delete Account?")) {
        this.showOtpDivBox = "hide";
        this.btnDel = false;
        return false;
      } else {
        this.CLIENT_BANK_MST_ID = item.CLIENT_BANK_MST_ID;
        this.BANK_AC_NAME = item.BANK_AC_NAME;
        this.AC_NUMBER = item.BANK_AC_NUMBER;
        this.Bank_Ac_Type = item.BANK_AC_TYPE;
        this.IFSC_CODE = item.BANK_IFSC;
        this.CLIENT_MST_ID = item.CLIENT_MST_ID;
        this.CBS_CUSTOMER_ID = item.CBS_CUSTOMER_ID;
        this.CBS_CUSTOMER_MOBNO = item.CBS_CUSTOMER_MOBNO;
        this.BANK_REG_MST_ID = item.BANK_REG_MST_ID;

        // this.hideOtp = "show";
        this.title = "Delete Account";
        this.addNewTab = 'show';
        this.showForm = false;
        this.showOtpDivBox = "show";
        this.disDevTab = false;
        this.editDevBtn = false;
        this.addBtn = false;
        this.btnDel = true;
        this.getOtp("D");
      }
    }
  }

  SetPrimary(item) {
    if (item.DEFAULT_FLAG == "Y") {
      this.message = "Already set as primary account";
      MessageBox.show(this.dialog, this.message, "");
      $("#activeCheck").on("change", function () {
        this.checked = !this.checked ? true : true;
      });
      // this.showOtpDivBox = "hide";
    } else {
      this.CLIENT_BANK_MST_ID = item.CLIENT_BANK_MST_ID;
      this.BANK_AC_NAME = item.BANK_AC_NAME;
      this.AC_NUMBER = item.BANK_AC_NUMBER;
      this.Bank_Ac_Type = item.BANK_AC_TYPE;
      this.IFSC_CODE = item.BANK_IFSC;
      this.CLIENT_MST_ID = item.CLIENT_MST_ID;
      this.CBS_CUSTOMER_ID = item.CBS_CUSTOMER_ID;
      this.CBS_CUSTOMER_MOBNO = item.CBS_CUSTOMER_MOBNO;
      this.BANK_REG_MST_ID = item.BANK_REG_MST_ID;

      this.po_OTPExpDur = "";
      this.addNewTab = 'show';
      this.addBtn = false;
      this.showOtpDivBox = "show";
      this.showForm = false;
      this.po_OTPExpDur = "";
      this.title = "Set Primary Account";
      this.disDevTab = false;
      this.editDevBtn = true;
      this.btnDel = false;
      this.DEFAULT_FLAG = true;
      // this.hideOtp = "show";
      this.OpFlag = "M";
      this.getOtp("M");
    }
  }

  CheckFalBox() {
    $('input[type="checkbox"]').on('change', function () {
      var chk = $('input[type="checkbox"]').val();
      $('input[type="checkbox"]').not(this).prop('checked', true);
    });
  }

  getrecord(item, flag) {

    if (flag == 'SP') {
      if (item.DEFAULT_FLAG == "Y") {
        this.message = "Already set as primary account";
        MessageBox.show(this.dialog, this.message, "");
        $("#activeCheck").on("change", function () {
          this.checked = !this.checked ? true : true;
        });
        return false;
      }
    }

    this.IFSC_CODE = item.BANK_IFSC;
    this.AC_NUMBER = item.BANK_AC_NUMBER;
    this.CLIENT_BANK_MST_ID = item.CLIENT_BANK_MST_ID;
    this.CLIENT_MST_ID = item.CLIENT_MST_ID;
    this.BANK_AC_NAME = item.BANK_AC_NAME;
    this.DEFAULT_FLAG = item.DEFAULT_FLAG;
    this.Bank_Ac_Type = item.BANK_AC_TYPE;
    this.bank_name = item.BANKNAME;
    this.CancelChequeProof = "assets/images/image.png";
    if (flag == "SP") {
      this.po_OTPExpDur = "";
      this.addNewTab = 'show'; this.addBtn = false;
      this.showOtpDivBox = "show";
      this.showForm = false;
      this.po_OTPExpDur = "";
      this.title = "Set Primary Account";
      this.disDevTab = false;
      this.editDevBtn = true;
      this.btnDel = false;
      this.DEFAULT_FLAG = true;
      // this.hideOtp = "show";
      this.OpFlag = "M";
      this.getOtp("M");
    } else {
      this.btnShowGenOtp = true;
      this.showOtpDivBox = 'hide';
      this.showForm = true;
      this.disDevTab = false;
      this.addBtn = false;
      this.OpFlag = "M";
      this.addNewTab = 'show';
      this.editDevBtn = true;
      this.title = "Update Bank Account";
      this.showBankImage = true;
    }

    if (item.CLIENT_BANK_MST_ID != undefined) {
      var paramObj = {
        Client_Mst_Id: this.clientMstId,
        Client_Bank_Mst_Id: item.CLIENT_BANK_MST_ID,
      };
      this.spinner.show();
      this.apiService.sendToServer<ICore>('/api/virtualpay/Get_Client_Doc_Details', paramObj, this).subscribe((data) => {
        // console.log(data)
        this.spinner.hide();
        if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
          let obj = data.cursor1[0];
          // this.SelectedBANK_REG_MST_ID = obj.BANK_REG_MST_ID;
          this.CBS_CUSTOMER_ID = obj.CBS_CUSTOMER_ID;
          this.CBS_CUSTOMER_MOBNO = obj.CBS_CUSTOMER_MOBNO;
          this.bankProofName = obj.DOCUMENT_NAME;
          this.bankProofCode = obj.DOCUMENT_MST_ID;
          this.CancelChequeProof = this.arrayBufferToBase64(obj.DOCUMENT_IMAGE.data) != undefined ? this.arrayBufferToBase64(obj.DOCUMENT_IMAGE.data) : this.CancelChequeProof = "assets/images/image.png";
        } else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
          if (item.DEFAULT_FLAG == "N") {
            $("#activeCheck").on("change", function () {
              this.checked = !this.checked ? false : false;
            });
            return false;
          }
        }
      }, err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      });
    }
  }

  Update() {
    if (this.CLIENT_BANK_MST_ID != undefined) {
      // this.bankAc = this.filterItemsByAccount(this.CLIENT_BANK_MST_ID);
      // if(this.bankAc.length > 0)
      // {
      //   alert(1);
      // }
      // this.getOtp('M');
      this.addNewTab = 'show';
      this.select = false;
      this.OpFlag = "M";
      this.showOtp = "show cta OtpBtn";
      this.btnShowGenOtp = false;
    }
  }
  close() {
    this.addNewTab = 'hide';
    this.bank_name = "";
  }

  filterItemsByFlag(searchTerm) {
    this.bankAc = this.bankAcData;
    return this.bankAc.filter(item => {
      return item.DEFAULT_FLAG == searchTerm;
    });
  }

  filterItemsByAccount(searchTerm) {
    this.bankAc = this.bankAcData;
    return this.bankAc.filter(item => {
      return item.CLIENT_BANK_MST_ID == searchTerm;
    });
  }

  Save() {
    //NEW BANK DETAILS TO INSERT
    let imgElmbankProof = this.elementRef.nativeElement.querySelector('#imgIdCancelChequeProof');

    let IFSC_CODE = this.IFSC_CODE;
    if (IFSC_CODE == undefined || IFSC_CODE.length == 0) {
      this.message = "Enter IFSC CODE.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    let Bank_Ac_Type = this.Bank_Ac_Type;
    if (Bank_Ac_Type == undefined || Bank_Ac_Type.length == 0) {
      this.message = "Enter A/c Type.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    let AC_NUMBER = this.AC_NUMBER;
    if (AC_NUMBER == undefined || AC_NUMBER.length == 0) {
      this.message = "Enter A/c Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    let BANK_AC_NAME = this.BANK_AC_NAME;
    if (BANK_AC_NAME == undefined || BANK_AC_NAME.length == 0) {
      this.message = "Enter A/c Name.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.bankProofCode == undefined || this.bankProofCode.toString().trim().length == 0) {
      // alert("Select Bank Proof");
      this.message = "Select Bank Proof.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    // if (this.CancelChequeProof && this.CancelChequeProof == "assets/images/image.png") {
    //   this.message = "Add Bank Proof Document.";
    //   MessageBox.show(this.dialog, this.message, "");
    //   return false;
    // }
    if (imgElmbankProof.src.match('assets/images/image.png')) {
      this.message = "Please upload Bank Proof Document.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.btnShowGenOtp = false;
    this.showOtpDivBox = "show";
    this.showForm = false;
    this.BANK_REG_MST_ID = 0;
    this.getOtp(this.OpFlag);
  }
  Cleardata() {
    this.IFSC_CODE = "";
    this.AC_NUMBER = "";
    this.BANK_AC_NAME = "";
    this.Bank_Ac_Type = "";
    this.bank_name = "";
    this.branch = undefined;
    this.BRANCH_NAME = undefined;
    this.vpayOtpElement.otp = "";
    this.bankProofCode = null;
    // this.CancelChequeProof = null;
    this.CancelChequeProof = "assets/images/image.png";
    this.imageSizeCcp = " Size of file should be between 5kb–25kb";
    // this.otpElement1.otp = "";

  }

  clear() {
    this.BANK_NAME = "";
    this.STATE_NAME = "";
    this.CITY_NAME = "";
    this.BRANCH_NAME = undefined;
    this.otpElement.otp = "";
    // this.otpElement1.otp = "";
  }

  cancel() {
    this.showOtpDivBox = "hide";
    this.disDevTab = true;
    this.addNewTab = 'hide';
    this.otpElement.otp = "";
    this.vpayOtpElement.otp = "";
    // this.otpElement1.otp = "";
    this.po_OTPExpDur = 0;

    this.otpElement.hideOtp();
    // this.otpElement1.hideOtp();
    this.GetUpdateBankData("V", this);
  }

  //Mobile Bank
  Get_BankList() {
    var paramObj = {
      Device_Id: "Desktop",
      request_from: "WB"
      // Client_Mst_ID: this.CLIENT_MST_ID,
      // Customer_ID: 12940,
      // CORPORATE_FLAG: this.CORPORATE_FLAG
    };
    this.spinner.show();
    this.apiService.sendToServer<ICore>("/api/virtualpay/Get_VPAYBANK", paramObj, this).subscribe(
      data => {
        this.spinner.hide();
        if (data.code == 1 && data.msg.toUpperCase() == "SUCCESS") {
          this.BankList = data.cursor1;
          if (this.BankList.length > 1) {
          
            var list;
            for (var i = 0; i < this.BankList.length; i++) {
              list = {
                BANK_NAME: this.BankList[i].BANK_NAME,
                BANK_LOGO: this.BankList[i].BANK_LOGO == null ? "" : this.arrayBufferToBase64(this.BankList[i].BANK_LOGO.data),
                BANK_REG_MST_ID: this.BankList[i].BANK_REG_MST_ID,
                SECRET_KEY: this.BankList[i].SECRET_KEY,
                URL: this.BankList[i].URL,
                CBS_CUSTOMER_ID: this.BankList[i].Cbs_Customer_Id,
                Cbs_Customer_Mobno: this.BankList[i].Cbs_Customer_Mobno
              };
              this.listarray.push(list);
            }

            let bnkmstid = data.cursor1.filter(item => item.BANK_REG_MST_ID > 0)
            bnkmstid = bnkmstid.map(item => item.BANK_REG_MST_ID);
            if (bnkmstid.length > 0)
              this.BANK_MST_ID = bnkmstid[0];
            else
              this.BANK_MST_ID = 0;
            //other Bank =0 || null
            let nonbnkmstid = data.cursor1.filter(item => item.BANK_REG_MST_ID == 0 || item.BANK_REG_MST_ID == null)
            nonbnkmstid = nonbnkmstid.map(item => item.BANK_REG_MST_ID);
            if (nonbnkmstid.length > 0)
              this.otherBank_MstID = nonbnkmstid[0] == null ? 0 : nonbnkmstid[0];
            else
              this.otherBank_MstID = 1;
            this.BankList = this.listarray;
            this.Disp_BankModal = true;
            if (this.Disp_BankModal == true) {
              $(document).ready(function () {
                $("#BankModal").modal('show');
              });
            }

            // const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            //   width: '70vw',
            //   data: { BankArray: this.BankList }
            // });

            // dialogRef.afterClosed().subscribe(result => {
            //   // console.log('The dialog was closed');
            //   // console.log(result);
            //   // this.BankList = result;
            //   let bankObj = result;
            //   if (result) {
            //     if (bankObj.BANK_REG_MST_ID && bankObj.BANK_REG_MST_ID != 0) {
            //       this.title = 'Bank Account';
            //       this.cbsFormShow = "show";
            //       this.showcbsForm = true;
            //       this.addNewTab = 'hide';
            //     } else {
            //       this.addNewTab = 'show';
            //       this.showForm = true;
            //     }
            //     this.bankObject = bankObj;
            //   } else
            //     this.disDevTab = true;
            // });
          } else {
            this.addNewTab = 'show';
            this.showForm = true;
          }
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      }
    );
    return false;
  }

  btnClose() {
    // this.showProdList = 'show';
    // this.showBankList = false;
    // this.showOverlay = false;
    this.disDevTab = true;
  }


  DateTimeCtrl = function (Val1, Val2) {
    this.Call_MsgDiv("HIDE", "");
    this.SetControlValue = Val2;
    this.objdttm = {
      setoncontrol: Val2,
      mtype: Val1 == "D" ? "SET DATE" : "SET TIME",
      ctrl: "DTTMPC"
    };
    this.dtp.toggleDTTMcontrol(this.objdttm, this);
  };
  Call_MsgDiv(ShowHide, Msg) {
    if (ShowHide == "SHOW") this.msgshowhide = "_show";
    if (ShowHide == "HIDE") this.msgshowhide = "_hide";
    this.DisplayMsg = Msg;
  }

  CallBack = function (obj) {
    if (obj != null) {
      if (obj.SetControlValue == "DOB") this.DOB = obj.mydate;
    }
  };


  selectBank(bankObj) {


    for(var i=0; i < this.bankAcData.length; i++){
if(this.bankAcData[i].BANK_REG_MST_ID !=0 && this.bankAcData[i].BANK_REG_MST_ID===bankObj.BANK_REG_MST_ID){
this.message= "This Bank is Already Linked."
MessageBox.show(this.dialog,this.message,"");
this.disDevTab=true;
return false;
}
    }
    // this.showBankList = false;
    // this.showOverlay = false;

    if (bankObj.BANK_REG_MST_ID && bankObj.BANK_REG_MST_ID != 0) {
      this.title = 'Bank Account';
      this.cbsFormShow = "show";
      this.showcbsForm = true;
      this.addNewTab = 'hide';
    } else {
      this.addNewTab = 'show';
      this.showForm = true;
    }

    this.bankObject = bankObj;

  }

  SaveCbs() {
    //NEW BANK DETAILS TO INSERT
    let Customer_ID = this.Customer_ID;
    if (Customer_ID == undefined || Customer_ID.length == 0) {
      // alert("Enter Customer ID");
      this.message = "Enter Customer ID.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    let AC_NUMBER = this.AC_NUMBER;
    if (AC_NUMBER == undefined || AC_NUMBER.length == 0) {
      // alert("Enter Account Number");
      this.message = "Enter Account Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    let Mobile_Number = this.Mobile_Number;
    if (Mobile_Number == undefined || Mobile_Number.length == 0) {
      this.message = "Enter Mobile Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    if (Mobile_Number.length != 10) {
      // alert("Enter Valid Mobile Number");
      this.message = "Enter Valid Mobile Number.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    let DOB = this.DOB;
    if (DOB == undefined) {
      // alert("Enter Date of Birth");
      this.message = "Enter Date of Birth.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.OpFlag = "N";
    this.BankProcess();
  }


  //pflag ='N'= NEW, ' = UPDATE,   D= DELETE
  //CBS Bank Registration Process
  BankProcess() {
    var paramObj = {
      Client_Mst_Id: this.clientMstId,// this.clientMstId,
      Bank_Reg_Mst_Id: this.bankObject.BANK_REG_MST_ID,
      CBS_AcNo: this.AC_NUMBER,
      Customer_ID: this.Customer_ID,
      DOB: this.DOB,
      Mobile_No: this.Mobile_Number,
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: this.login_user_id,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Corporate_Flag: this.Corporate_Flag,
      Secret_Key: this.bankObject.SECRET_KEY,
      url: this.bankObject.URL,
      Session_Id: this.sessionId,
      Source: 'Desktop',
    }
    this.spinner.show();
    this.apiService.sendToServer<IOtp>('/api/virtualPay/RegOTPProcess', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        //response code ==00
        if (data.cursor1[0].RESPONSE_CODE == '00') {
          this.RRN_Number = data.cursor1[0].RRN_NUMBER
          this.showVpayOtp = "show";
          this.showcbsForm = false;
          this.vpayOtpElement.placeholder = 'Enter OTP';
          data.po_OTPExpDur = data.cursor1[0].OTP_EXPDURATION;;
          this.vpayOtpElement.showOtp(data);
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

  //CBS bank Otp process
  //bank Registration Process
  bankRegistraionProcess() {
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Bank_Reg_Mst_Id: this.bankObject.BANK_REG_MST_ID,
      CBS_AcNo: this.AC_NUMBER,
      Customer_ID: this.Customer_ID,
      DOB: this.DOB,
      Mobile_No: this.Mobile_Number,
      login_user_id: this.login_user_id,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Corporate_Flag: this.Corporate_Flag,
      OTP: this.vpayOtpElement.otp,
      RRN_Number: this.RRN_Number,
      Secret_Key: this.bankObject.SECRET_KEY,
      url: this.bankObject.URL,
      Session_Id: this.sessionId,
      Source: 'Desktop',

    }
    this.spinner.show();
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
              this.inetcorpflag = data.cursor1[0].CORPORATE_FLAG;
              if (this.inetcorpflag == 'B') {
                this.inetflagresp = true;
                this.showVpayOtp = "hide";
                this.inetselectcorpid = data.cursor1[0].INET_CORP_ID;
              }
              else {
                this.inetcorpID = data.cursor1[0].INET_CORP_ID;
                this.InetuserID = data.cursor1[0].INET_USER_ID;
                this.inetcorpselectflag = data.cursor1[0].CORPORATE_FLAG;
                this.getCustomerData();
              }
            }
            else {
              this.message = data.cursor1[0].RESPONSE_MESSAGE;
              MessageBox.show(this.dialog, this.message, "");
              this.ClearCbsForm();
              return false;
            }
          }
          else if (data.code === 0) {
          }
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
      // this.loadingService.toggleLoadingIndicator(false);
    });
    this.otp = '';
  }


  SaveAccountdata() {
    if (this.inetcorpselectflag == 'I') {
      if (this.InetuserID == undefined) {
        // alert('Enter User ID');
        this.message = "Enter User ID.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      this.inetcorpID = this.InetuserID;
    }
    else if (this.inetcorpselectflag == 'C') {
      if (this.InetuserID == undefined) {
        // alert('Enter User ID');
        this.message = "Enter User ID.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      // if(this.inetcorpID ==undefined){
      //   alert('Enter Corporate ID'));
      //   return false;
      // }
      this.inetcorpID = this.inetselectcorpid;

      if(this.InetuserID == this.inetcorpID ){
        this.message = "Enter User ID is Same as Corporate ID.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    }
    else {
      // alert('Select Account');
      this.message = "Select Account.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    this.getCustomerData();
  }


  getflag(event) {
    this.inetcorpselectflag = event.value;
    if (this.inetcorpselectflag == 'C')
      this.inetcorpID = this.inetselectcorpid;
  }

  //Customer Info
  getCustomerData() {
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Customer_ID: this.Customer_ID,
      Request_From: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      login_user_id: this.login_user_id,
      Insti_Sub_Mst_Id: this.Insti_Sub_Mst_Id,
      CORPORATE_FLAG: this.Corporate_Flag,
      Corporate_Flag: this.Corporate_Flag,
      Bank_Reg_Mst_Id: this.bankObject.BANK_REG_MST_ID,
      Secret_Key: this.bankObject.SECRET_KEY,
      url: this.bankObject.URL,
      Inet_Corp_Id: this.inetcorpID,
      Inet_User_Id: this.InetuserID,
      Inet_Corporate_Flag: this.inetcorpselectflag,
      Session_Id: this.sessionId,
      Source: 'Desktop',
    }
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/Customer_Info', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        var userobj = data.cursor1;
        if (userobj != null)
          this.LinkBankAcc(userobj);
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


  //Link Bank Account
  LinkBankAcc(userObj) {
    var paramObj = {
      Client_Mst_Id: this.clientMstId,
      Login_User_Id: this.login_user_id,
      login_user_id: this.login_user_id,
      Client_Name: userObj[0].CLIENT_FNAME + ' ' + userObj[0].CLIENT_MNAME + ' ' + userObj[0].CLIENT_LNAME,
      Client_Fname: userObj[0].CLIENT_FNAME,
      Client_Mname: userObj[0].CLIENT_MNAME == null || userObj[0].CLIENT_MNAME == null ? '' : userObj[0].CLIENT_MNAME,
      Client_Lname: userObj[0].CLIENT_LNAME,
      Date_Of_Birth: moment(userObj[0].DATE_OF_BIRTH).format('DD-MMM-YYYY'),
      Business_Details: userObj[0].BUSINESS_DETAILS == null ? "" : userObj[0].BUSINESS_DETAILS.trim(),
      Business_Type: userObj[0].BUSINESS_TYPE == null ? '' : userObj[0].BUSINESS_TYPE,
      Bussiness_Line: userObj[0].BUSSINESS_LINE == null ? '' : userObj[0].BUSSINESS_LINE,
      Business_Address: userObj[0].BUSINESS_ADDRESS == null ? "" : userObj[0].BUSINESS_ADDRESS.trim(),
      Aadhar_Number: userObj[0].AADHAR_NUMBER == null ? '' : userObj[0].AADHAR_NUMBER,
      Pan_Number: userObj[0].PAN_NUMBER == null ? '' : userObj[0].PAN_NUMBER.toUpperCase(),
      Tan_Number: userObj[0].TAN_NUMBER == null ? '' : userObj[0].TAN_NUMBER.toUpperCase(),
      Gstin: userObj[0].GSTIN == null ? '' : userObj[0].GSTIN.toUpperCase(),
      Gst_Reg_Date: userObj[0].GST_REG_DATE == null ? '' : userObj[0].GST_REG_DATE,
      Address_1: userObj[0].ADDRESS_1 == null ? "" : userObj[0].ADDRESS_1.trim(),
      Pin_Code: userObj[0].PIN_CODE == null ? 0 : userObj[0].PIN_CODE,
      Landmark_Name: userObj[0].LANDMARK_NAME == null ? '' : userObj[0].LANDMARK_NAME.trim(),
      Area_Name: userObj[0].AREA_NAME == null ? '' : userObj[0].AREA_NAME.trim(),
      City_Name: userObj[0].CITY_NAME == null ? '' : userObj[0].CITY_NAME,
      Mobile_No: userObj[0].MOBILE_NO == null ? 0 : userObj[0].MOBILE_NO,
      Phone_1: userObj[0].PHONE_1,
      Email_Id: userObj[0].EMAIL_ID == null ? "" : userObj[0].EMAIL_ID.trim(),
      Bank_Ac_Number: userObj[0].ACNO == null ? this.AC_NUMBER : userObj[0].ACNO,
      Bank_Ac_Name: userObj[0].ACNAME == null ? "" : userObj[0].ACNAME.trim(),
      Bank_Ifsc: userObj[0].IFSCCODE == null ? '' : userObj[0].IFSCCODE.toUpperCase(),
      Bank_Ac_Type: userObj[0].ACTYPE,
      Bank_Reg_Mst_Id: this.bankObject.BANK_REG_MST_ID,
      Cbs_Customer_Id: this.Customer_ID,
      Cbs_Customer_Mobno: this.Mobile_Number,
      Request_From: 'WB',
      Device_Id: '',
      Inet_Corp_Id: this.inetcorpID,
      Inet_User_Id: this.InetuserID,
      Inet_Corporate_Flag: this.inetcorpselectflag

    };

    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/Client_Update', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code === 1) {
        // alert('Bank Linked Success.');
        this.message = "Bank Linked Success.";
        MessageBox.show(this.dialog, this.message, "");
        // this.navController.setRoot(FIRST_PAGE);
        this.clear();
        this.router.navigate(['/home']);
        // this.router.navigate(['/dashboard']);
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


  ClearCbsForm() {
    this.AC_NUMBER = '';
    // this.DEFAULT_FLAG = '';
    this.Bank_Ac_Type = '';
    this.bank_name = '';
    // this.branch_name = undefined;
    this.DOB = '';
    this.Mobile_Number = '';
    this.Customer_ID = '';
  }
  //pop up model
  OpenIfscPage() {
    this.Disp_ifscpage = true;
    this.clearIFSC();
  }

  SearchBank() {
    // bind Bank name from ifsc_code_master
    this.spinner.show();
    var uinput = {
      userid: 1,
      keyword: "BANK",
      device_id: "Desktop"
    };
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
      return;
    } else if (this.state == "" || this.state == undefined) {
      this.message = "Select State Name.";
      MessageBox.show(this.dialog, this.message, "");
      return;
    } else if (this.city == "" || this.city == undefined) {
      this.message = "Select City Name.";
      MessageBox.show(this.dialog, this.message, "");
      return;
    } else if (this.branch == "" || this.branch == undefined) {
      this.message = "Select Branch Name.";
      MessageBox.show(this.dialog, this.message, "");
      return;
    }
    this.IFSC_CODE = this.ifsc;
    this.Disp_ifscpage = false;
    const ifscpage = this.renderer2.selectRootElement(".modal-backdrop");
    setTimeout(() => ifscpage.remove(), 0);
  }

  otpConfirmation(item){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: "OTP Verification Required !",
      content: "Do you want to change default bank?",
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      //   console.log("“ Dialog was closed“" )
      //  console.log(result)
      if (result == true)
      this.SetPrimary(item);
      if(result == false)
      this.Back(); 

    });
  }

  otpConfirmation1(item, flag){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: "OTP Verification Required !",
      content: "Do you want to change default bank?",   
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      //   console.log("“ Dialog was closed“" )
      //  console.log(result)
      if (result == true)
      // this.getrecord(item,'');
      this.getrecord(item,'SP')
      if(result == false)
      this.Back(); 

    });
  }



  clearIFSC() {
    this.bank = "";
    this.state = "";
    this.statedata = null;
    this.city = "";
    this.citydata = null;
    this.branch = "";
    this.branchdata = null;
    this.Disp_ifsclabel = false;
    this.branch = undefined;
    this.Disp_ifscnotfound = false;
  }

  /**
  *  Image array to base64 string
  */
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
  /**
   * returns bytes in kb
   */
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
      if (imgId == 'imgIdCancelChequeProof') {
        this.imageSizeCcp = 'Your file size must less than 25kb';
        return false;
      }
    }

    let reader = new FileReader();
    let canvas = document.createElement("canvas");
    let canvasContext = canvas.getContext("2d");
    if (imgId == 'imgIdCancelChequeProof') {
      this.imageSizeCcp = 'File Uploaded Successfully.';
      this.CancelChequeProof = null;
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
        case 'fileCancelChequeProof': self.CancelChequeProof = dataURL; break;
        default: break;
      }
    }
    reader.onload = function (e: any) {
      imgElm.src = e.target.result;
    }
    reader.readAsDataURL(fileInput.target.files[0]);
  }
}



// @Component({
//   selector: 'dialog-overview-example-dialog',
//   templateUrl: 'BankDialog.component.html',
// })
// export class DialogOverviewExampleDialog {
//   bankObject: [];
//   constructor(
//     public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData) {
//     // console.log('data :-' + data.BankArray);
//     this.dialogRef.disableClose = true;
//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }

// export interface DialogData {
//   BankArray: Array<any>;
// }
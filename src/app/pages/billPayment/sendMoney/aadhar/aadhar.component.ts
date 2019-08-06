import { Component, OnInit, Renderer2 } from "@angular/core";
import { Router } from '@angular/router'
import { ApiService } from "../../../../core/api.service";
import { ICore } from "../../../../interface/core";
import { IAadhar } from "../../../../interface/aadhar";
import { ILogin } from "../../../../interface/login";
import { ErrorHandler } from "../../../../core/errorHandler";
import { DataStorage } from "../../../../core/dataStorage";
import * as xml2js from "xml2js";
import { Toast } from "../../../../services/toast";
import { Common } from "../../../../services/common";
import { Spinner } from "../../../../services/spinner";
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
declare const $: any;
@Component({
  selector: "app-aadhar",
  templateUrl: "./aadhar.html",
  providers: [ApiService, Spinner, Common]
})
export class SendAadharComponent implements OnInit {
  termCondContent: string;
  mCust: string;
  resultMessage: string = "";
  logInfo: ILogin;
  aeps_terminal_id: any;
  code: number;
  msg: string = "";
  data: Array<any>;
  po_res_desc: string;
  clientMstId: number;
  VPA: string;
  // amount: string;
  // remarks: string;
  aadharRemarks: any = "";
  billNumber: string;
  showCollReqF: boolean = true;
  showCollA: boolean = true;
  showCollU: boolean = false;
  showCollP: boolean = false;
  bankList: Array<any>;
  aadharNo1: number;
  aadharNo2: number;
  aadharNo3: number;
  msgshowhide: string = "";
  DisplayMsg: string = "";
  login_user_id: string;
  showOtherInfo: boolean = false;
  TCchek: boolean = true;
  showAadharInstallInfo: boolean = true;
  showBusinness: string;
  showAadharTranId: string;
  option = {
    position: "top-center",
    showClose: true,
    timeout: 5000,
    theme: "bootstrap",
    type: "error",
    closeOther: false,
    msg: ""
  };

  statusImage: any;
  statusMessage: any;
  business: string = "";
  merchantName: string = "";
  customerName: string = "";
  rrn: string = "";
  status: string = "";
  balance: string = "";
  tranDate: string = "";
  collMessage: string = "";
  showStatusBox = false;
  thumbData: any;
  showStartek: string;
  showSecuGen: string;
  deviceSerialNo: string;

  // send
  VpayConatctlist: any;
  clientlist: any = [];
  NotMatchContactList: any;
  showAadharForm = false;
  showDonation = true;
  payName: any;
  donateNumber: string = "";
  VpayUserlist: any;
  showUserModal: boolean = false;

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

  constructor(
    private apiService: ApiService,
    private dataStorage: DataStorage,
    private renderer2: Renderer2,
    private router: Router,
    private errorHandler: ErrorHandler,
    private toast: Toast,
    private spinner: Spinner,
    private common: Common,
    private dialog: MatDialog
  ) { }

  DeviceData() {
    var paramObj = {
      Client_Mst_ID: this.dataStorage.logInfo[0].CLIENT_MST_ID,
      request_from: "WB",
      device_id: "Desktop",
      Device_Id: "Desktop",
      Flag: "S",
      Thumb_Mst_Id: null,
      Thumb_Device_No: null,
      Thumb_Device_Det: null,
      Default_Flag: "Y",
      login_user_id: this.dataStorage.logInfo[0].LOGIN_USER_ID,
      Insti_Sub_Mst_Id: this.dataStorage.logInfo[0].INSTI_SUB_MST_ID,
      CORPORATE_FLAG: this.dataStorage.logInfo[0].CORPORATE_FLAG,
      Corporate_Flag: this.dataStorage.logInfo[0].CORPORATE_FLAG
    };
    this.spinner.show();
    this.apiService.sendToServer<ICore>("/api/virtualpay/ThumbDeviceUpdate", paramObj, this)
      .subscribe(
        data => {
          if (data.code == 1 && data.msg.toUpperCase() == "SUCCESS") {
            this.thumbData = data;
            if (data.cursor2.length > 0 && data.cursor2[0].THUMB_DEVICE_NO) {
              let regDev = data.cursor1.filter(a => {
                return a.THUMB_MST_ID == data.cursor2[0].THUMB_MST_ID;
              });
              if (regDev && regDev.length > 0) {
                this.deviceSerialNo = data.cursor2[0].THUMB_DEVICE_NO.toUpperCase();
                if (regDev[0].COMPANY_NAME.indexOf("SecureGen") > -1) {
                  this.showSecuGen = "show";
                  this.showStartek = "hide";
                } else {
                  this.showSecuGen = "hide";
                  this.showStartek = "show";
                }
              }
            } else {
              this.showStartek = "hide";
              this.showSecuGen = "hide";
              // alert("Please First Register Thumb Device by Using Menu 'Setting > Set Thumb Device'.");
              this.message = "Please First Register Thumb Device by Using Menu 'Setting > Set Thumb Device'.";
              MessageBox.show(this.dialog, this.message, "");
            }
          } else {
            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
          }
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          this.message = err;
          MessageBox.show(this.dialog, this.message, "");
        }
      );
  }

  ngOnInit() {
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.aeps_terminal_id = this.logInfo[0].AEPS_TERMINAL_ID;
    if (this.aeps_terminal_id == undefined || this.aeps_terminal_id == null || this.aeps_terminal_id == '') {
      this.message = "You are not a Authorised user";
      MessageBox.show(this.dialog, this.message, "");
      this.router.navigate(['/dashboard'], { queryParams: { 'kyc': false } });
      return false;
    }

    this.DeviceData();
    this.showCollA = true;
    // this.aadharRemarks = this.logInfo[0].CLIENT_NAME + '-' + this.logInfo[0].CITY_NAME;
    this.aadharRemarks =
      this.logInfo[0].CLIENT_NAME +
      (this.logInfo[0].CITY_NAME ? "-" + this.logInfo[0].CITY_NAME : "");

    this.GetAADHARBANK();
    this.Search();



  }

  //for aadhar
  onkeyup() {
    let pageObj = this;
    $("input").keyup(function () {
      pageObj.showStatusBox = false;

      if (this.className.indexOf("aadhar") > -1) {
        if (this.value.length == this.maxLength) {
          var $next = $(this).next(".aadhar");
          if ($next.length) {
            $(this)
              .next(".aadhar")
              .focus();
          } else {
            $(this).blur();
          }
        }
        if (this.value.length > 4) {
          this.value = this.value.slice(0, 4);
        }
      }
    });
    // $('#footerimg').css('background-image','none')
  }

  termConditions() {
    // alert('term condition');
    this.common
      .TermConditons({ Term_Cond_Type: "3", loginFlag: "A" }, this)
      .subscribe(data => {
        if (data.code == 1) {
          this.termCondContent = data.cursor1;
        }
      });
  }

  pageHelp() {
    // alert('term condition');
    this.common.TermConditons({ Term_Cond_Type: "34", loginFlag: 'A' }, this).subscribe(data => {
      if (data.code == 1) {
        this.termCondContent = data.cursor1;
      }
    });
  }

  setAmountFormat() {
    if (parseFloat(this.aadharModel.amount))
      this.aadharModel.amount = parseFloat(this.aadharModel.amount).toFixed(2);
  }
  showOthInfo(e) {
    if (e.srcElement.checked == true) this.showOtherInfo = true;
    else {
      this.showOtherInfo = false;
    }
  }

  //Aadhar Variables
  aadharModel = {
    aadharNo1: "",
    aadharNo2: "",
    aadharNo3: "",
    aadhar: "",
    aadharBankList: null,
    bankCode: "",
    bankName: "",
    amount: "",
    customerName: "",
    billNumber: "",
    custGSTNo: "",
    remark: ""
  };

  //# START Aadhar ==============================================

  GetAADHARBANK() {
    var paramObj = {
      key: "IIN",
      CLIENT_MST_ID: this.logInfo.CLIENT_MST_ID
    };
    this.spinner.show();
    this.apiService.sendToServer<IAadhar>("/api/virtualpay/GetAADHARMemberBank", paramObj, this).subscribe(
      data => {
        if (data.code == 1 && data.msg.toUpperCase() == "SUCCESS") {
          this.aadharModel.aadharBankList = data.cursor1;
        } else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      }
    );
  }

  // setBankCode(){
  //   let pageObj = this;
  //   let selectedBank = this.aadharModel.aadharBankList.filter(a=> a.BANK_NAME == pageObj.aadharModel.bankName);
  //   if(!selectedBank || (selectedBank && selectedBank.length==0)){
  //     this.message ="Please select Bank name."; 
  // MessageBox.show(this.dialog, this.message, "");
  //     this.aadharModel.bankName ='';
  //     const txtAadharBank = this.renderer2.selectRootElement('#txtAadharBank');
  //     setTimeout(() => txtAadharBank.focus(), 0);
  //     return false;
  //   }
  //   pageObj.aadharModel.bankCode = selectedBank[0].IIN;
  // }

  setBankCode() {
    let pageObj = this;
    let selectedBank = this.aadharModel.aadharBankList.filter(
      a => a.BANK_NAME == pageObj.aadharModel.bankName
    );
    if (!selectedBank || (selectedBank && selectedBank.length == 0)) {
      this.message = "Please select Bank name.";
      MessageBox.show(this.dialog, this.message, "");
      this.aadharModel.bankName = null;
      this.aadharModel.bankCode = null;
      // const txtAadharBank = this.renderer2.selectRootElement('#txtAadharBank');
      // setTimeout(() => txtAadharBank.focus(), 0);
      return false;
    }
    pageObj.aadharModel.bankCode = selectedBank[0].IIN;
  }

  ReversalTransaction(data, thisObj, AADHARObjOld) {
    var AADHARObj = {
      login_user_id: thisObj.login_user_id,
      client_mst_id: thisObj.clientMstId,
      fieldid_0: "0400",
      fieldid_2: AADHARObjOld.fieldid_2,
      fieldid_4: AADHARObjOld.fieldid_4,
      fieldid_11: AADHARObjOld.fieldid_11, //same as req
      fieldid_22: "019",
      fieldid_24: "001",
      fieldid_25: "05",
      fieldid_36: "WDLS ||0,0,0,0,0,0,0.00",
      fieldid_41: this.aeps_terminal_id,
      fieldid_42: "VGIPL",
      fieldid_125: AADHARObjOld.fieldid_125,
      naadharpay_reqid: data.po_aadharpay_reqid,
      customer_name: this.aadharModel.customerName,
      bill_number: this.aadharModel.billNumber,
      gst_number: this.aadharModel.custGSTNo
    };
    this.spinner.show();
    this.apiService.sendToServer<IAadhar>("/api/virtualPay/ReversalAADHAR", AADHARObj, thisObj).subscribe(
      data => {
        this.spinner.hide();
        if (
          data.code == 1 &&
          data.msg.toUpperCase() == "SUCCESS" &&
          data.REVREQ.toUpperCase() == "SUCCESS"
        ) {
          //this.presentAlert('Transaction Save.');

          // this.navController.push(AADHAR_STATUS, {
          //   RESDESC: data.po_res_desc,
          //   AMOUNT: this.model.amount,
          //   CUST_NAME: this.model.customer_name
          // });
          thisObj.aadharModel.aadhar = "";
          thisObj.aadharModel.aadharno1 = "";
          thisObj.aadharModel.aadharno2 = "";
          thisObj.aadharModel.aadharno3 = "";
          thisObj.aadharModel.amount = null;
          thisObj.aadharModel.customerName = "";
          thisObj.aadharModel.billNumber = "";
          thisObj.aadharModel.custGSTNo = "";
          thisObj.aadharModel.remark = "";
        } else if (data.REVREQ.toUpperCase() == "TIMEOUT") {
          // alert(data.REVREQ);
          this.message = data.REVREQ;
          MessageBox.show(this.dialog, this.message, "");
          // this.option.msg = data.REVREQ;
          // this.toast.addToast(this.option);
        } else {
          this.message = data.msg;
          MessageBox.show(this.dialog, this.message, "");
          // this.option.msg = data.msg;
          // this.toast.addToast(this.option);
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      }
    );

    let btnLogin = $("#aadharBtn");
    setTimeout(() => btnLogin.attr("disabled", "true"), 0);
  }

  SendAADHARtoService(obj, thisObj) {
    var AADHARObj = {
      login_user_id: thisObj.login_user_id,
      client_mst_id: thisObj.clientMstId,
      type: obj.type,
      thumb: obj.thumb,
      dc: obj.dc,
      dpId: obj.dpId,
      mc: obj.mc,
      mi: obj.mi,
      rdsId: obj.rdsId,
      rdsVer: obj.rdsVer,
      Hmac: obj.Hmac,
      ci: obj.ci,
      Skey: obj.Skey,
      fieldid_0: "0100",
      fieldid_2: this.aadharModel.bankCode + "0" + thisObj.aadharModel.aadhar,
      fieldid_3: "421000",
      fieldid_4: parseFloat(thisObj.aadharModel.amount).toFixed(2),
      fieldid_11: obj.po_aadharpay_reqid,
      fieldid_22: "019",
      fieldid_24: "001",
      fieldid_25: "05",
      fieldid_36: "WDLS ||0,0,0,0,0,0,0.00",
      fieldid_41: this.aeps_terminal_id,
      fieldid_42: "VGIPL",
      fieldid_125: obj.po_tranidf,
      customer_name: this.aadharModel.customerName,
      bill_number: this.aadharModel.billNumber,
      gst_number: this.aadharModel.custGSTNo
    };
    this.spinner.show();
    let pageObj = this;
    this.apiService
      .sendToServer<IAadhar>("/api/virtualPay/SendAADHAR", AADHARObj, thisObj)
      .subscribe(
        data => {
          this.spinner.hide();
          if (
            data.code == 1 &&
            data.msg.toUpperCase() == "SUCCESS" &&
            data.REVREQ.toUpperCase() == "SUCCESS"
          ) {
            if (data.po_res_desc) {
              let tmp = data.po_res_desc.split("|");
              //TODO=============
              if (
                tmp[0]
                  .split("-")[2]
                  .toString()
                  .toUpperCase() ==
                tmp[0]
                  .split("-")[4]
                  .toString()
                  .toUpperCase()
              ) {
                tmp[0] = tmp[0].split("-")[2];
              } else {
                tmp[0] = tmp[0].split("-")[2] + "," + tmp[0].split("-")[4];
              }
              //=================
              let msgArr = tmp[0].split("-");
              let msgAadhar = "";
              let i = 2;
              if (msgArr.length > 2) {
                for (i; i < msgArr.length; i++) {
                  msgAadhar += msgArr[i];
                }
              } else {
                msgAadhar = tmp[0];
              }

              if (
                this.aadharModel.customerName &&
                this.aadharModel.customerName.trim().length > 0
              )
                this.mCust = "show";
              else this.mCust = "hide";
              if (this.logInfo[0].BUSINESS_DETAILS) {
                this.showBusinness = "show";
              } else {
                this.showBusinness = "hide";
              }
              if (!tmp[1] || (tmp[1] && tmp[1].trim().length == 0))
                this.showAadharTranId = "hide";
              else this.showAadharTranId = "show";

              if (tmp[tmp.length - 1] == "N") {
                this.resultMessage = "error";
                this.statusImage = "assets/images/error.png";
                this.statusMessage = "Transaction failed";
                this.business = this.logInfo[0].BUSINESS_DETAILS;
                this.merchantName = this.logInfo[0].CLIENT_NAME;
                this.customerName = this.aadharModel.customerName;
                this.rrn = tmp[1];
                this.collMessage = msgAadhar;
                this.balance = this.aadharModel.amount;
                this.tranDate = tmp[2];
                this.showStatusBox = true;
              } else {
                this.resultMessage = "success";
                this.statusImage = "assets/images/success.png";
                this.statusMessage = "Transaction Success.";

                this.business = this.logInfo[0].BUSINESS_DETAILS;
                this.merchantName = this.logInfo[0].CLIENT_NAME;
                this.customerName = this.aadharModel.customerName;
                this.rrn = tmp[1];
                this.collMessage = msgAadhar;
                this.balance = this.aadharModel.amount;
                this.tranDate = tmp[2];
                this.showStatusBox = true;
                this.clear();
                let btnLogin = $("#aadharBtn");
                setTimeout(() => btnLogin.attr("disabled", "true"), 0);
              }
            } else {
              //TODO
            }
            // alert(data.po_res_desc);
            //this.option.msg = data.po_res_desc;
            //this.toast.addToast(this.option);

            // this.navController.push(AADHAR_STATUS, {
            //   RESDESC: data.po_res_desc,
            //   AMOUNT: this.model.amount,
            //   CUST_NAME: this.model.customer_name
            // });
            thisObj.aadharModel.aadhar = "";
            thisObj.aadharModel.aadharNo1 = "";
            thisObj.aadharModel.aadharNo2 = "";
            thisObj.aadharModel.aadharNo3 = "";
            thisObj.aadharModel.Mobile = "";
            thisObj.aadharModel.amount = null;
            thisObj.aadharModel.remark = "";
          } else if (data.REVREQ.toUpperCase() == "REVREQ") {
            // alert("Time-Out, Responce not getting from services, Please Try Again.");
            this.message = "Time-Out, Responce not getting from services, Please Try Again.";
            MessageBox.show(this.dialog, this.message, "");
            return;
            //IF IT RETURNS REVERSAL..CALL REVERSAL METHOD
            // var paramObj = {
            //   login_user_id: thisObj.login_user_id,
            //   client_mst_id: thisObj.client_mst_id,
            //   field_0: '0400',
            //   field_2: this.aadharModel.bankCode,
            //   field_3: '421000',
            //   field_4: parseFloat(this.aadharModel.amount).toFixed(2),
            //   field_11: 0,
            //   field_12: 0,
            //   field_13: 0,
            //   field_22: '019',
            //   field_24: '001',
            //   field_25: '05',
            //   field_36: 'WDLS ||0,0,0,0,0,0,0.00',
            //   field_37: 0,
            //   field_38: 0,
            //   field_39: 0,
            //    field_41:  thisObj.dataStorage.logInfo[0].AEPS_TERMINAL_ID,
            //   field_42: 'VGIPL',
            //   field_43: 0,
            //   field_54: 0,
            //   field_60: 0,
            //   field_62: 0,
            //   field_63: 0,
            //   field_64: 0,
            //   field_65: 0,
            //   field_102: 0,
            //   field_103: 0,
            //   field_120: 0,
            //   field_122: 0,
            //   field_123: 0,
            //   field_124: 0,
            //   field_125: 0,
            //   field_126: 0,
            //   field_127: 0,
            //   response_string: '',
            //   response_string_1: '',
            //   request_from: 'MB',
            //   customer_name: this.aadharModel.customerName,
            //   bill_number: this.aadharModel.billNumber,
            //   gst_number: this.aadharModel.custGSTNo,
            // };
            // this.spinner.show();
            // thisObj.apiService.sendToServer('/api/virtualPay/GetAADHARTranID', paramObj, thisObj).subscribe((data) => {
            //   this.spinner.hide();
            //   if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
            //     this.ReversalTransaction(data, thisObj, AADHARObj);
            //   }
            //   else {
            //    //  this.message = data.msg; 
            // MessageBox.show(this.dialog, this.message, "");
            //     this.option.msg=data.msg;
            //     this.toast.addToast(this.option);
            //   }
            // }, err => {
            //   this.spinner.hide();
            //   this.errorHandler.handlePageError(err);
            // });
          } else if (data.REVREQ.toUpperCase() == "TIMEOUT") {
            this.message = "TIMEOUT.";
            MessageBox.show(this.dialog, this.message, "");
            //this.option.msg = 'TIMEOUT';
            //this.toast.addToast(this.option);
          } else {
            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
            //this.option.msg = data.msg;
            //this.toast.addToast(this.option);
          }
        },
        err => {
          this.spinner.hide();
          this.errorHandler.handlePageError(err);
        }
      );
  }

  GetTransactionNumber(obj, thisObj, ThumbDeviceNo) {
    try {
      if (thisObj.aadharModel.aadhar.toString().trim().length === 0) {
        this.message = "Enter aadhar Number.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (thisObj.aadharModel.amount.toString().trim().length === 0) {
        this.message = "Enter Amount.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
    } catch (e) { }

    var paramObj = {
      login_user_id: thisObj.login_user_id,
      client_mst_id: thisObj.clientMstId,
      field_0: "0100",
      field_2: thisObj.aadharModel.bankCode,
      field_3: "421000",
      field_4: parseFloat(thisObj.aadharModel.amount).toFixed(2),
      field_11: 0,
      field_12: 0,
      field_13: 0,
      field_22: "019",
      field_24: "001",
      field_25: "05",
      field_36: "WDLS ||0,0,0,0,0,0,0.00",
      field_37: 0,
      field_38: 0,
      field_39: 0,
      field_41: this.aeps_terminal_id,
      field_42: "VGIPL",
      field_43: 0,
      field_54: 0,
      field_60: 0,
      field_62: 0,
      field_63: 0,
      field_64: 0,
      field_65: 0,
      field_102: 0,
      field_103: 0,
      field_120: 0,
      field_122: 0,
      field_123: 0,
      field_124: 0,
      field_125: 0,
      field_126: 0,
      field_127: 0,
      response_string: "",
      response_string_1: "",
      //request_from: 'MB',
      customer_name: this.aadharModel.customerName,
      // bill_number: this.aadharModel.billNumber,
      bill_number: this.logInfo[0].CLIENT_MST_ID + "~" + this.aadharModel.billNumber,
      gst_number: this.aadharModel.custGSTNo,
      Thumb_Device_Info: ThumbDeviceNo
    };
    if (!confirm("If you want to transfer amount then click on OK."))
      return false;
    this.spinner.show();
    this.apiService
      .sendToServer<IAadhar>(
        "/api/virtualPay/GetAADHARTranID",
        paramObj,
        thisObj
      )
      .subscribe(
        data => {
          this.spinner.hide();
          if (data.code == 1 && data.msg.toUpperCase() == "SUCCESS") {
            obj.po_aadharpay_reqid = data.po_aadharpay_reqid;
            obj.po_tranidf = data.po_tranidf;
            thisObj.SendAADHARtoService(obj, thisObj);
          } else {
            this.message = data.msg;
            MessageBox.show(this.dialog, this.message, "");
            // this.option.msg = data.msg;
            // this.toast.addToast(this.option);
          }
        },
        err => {
          this.spinner.hide();
          this.errorHandler.handlePageError(err);
        }
      );
  }

  getJSONCapture = function (url, callback) {
    let pageObj = this;
    let xhr = new XMLHttpRequest();
    try {
      xhr.open("CAPTURE", url, true);
    } catch (e) {
    }

    xhr.responseType = "text"; //json
    // "<PidOptions ver=\"1.0\">"
    //   + "<Opts env=\"PP\" fCount=\"1\" fType=\"0\" format=\"0\" iCount=\"0\" iType=\"0\" pCount=\"0\" pType=\"0\" pidVer=\"2.0\" posh=\"UNKNOWN\" timeout=\"10000\"/>"
    //   + "</PidOptions>";
    //var InputXml = `<PidOptions ver=\"1.0\"><Opts env=\"P\" fCount=\"1\" fType=\"0\" format=\"0\" iCount=\"0\" iType=\"0\" pCount=\"0\" pType=\"0\" pidVer=\"2.0\" posh=\"UNKNOWN\" timeout=\"10000\"/></PidOptions>`;

    //var	uri 	= "http://localhost:11100/rd/capture";
    // params  += "&PidXML=" + encodeURIComponent(enc_pid_b64);
    var InputXml =
      '<PidOptions ver="1.0"> <Opts fCount="1"  format="0" pidVer="2.0" timeout="20000" env="P" posh="LEFT_INDEX" /></PidOptions>';

    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.onerror = function (error) {
      pageObj.message = "Please install Fingerprint Scanner Device.";
      MessageBox.show(pageObj.dialog, pageObj.message, "");
      // pageObj.option.msg = 'Please install Fingerprint Scanner Device.';
      // pageObj.toast.addToast(pageObj.option);
    };
    try {
      xhr.send(InputXml);
    } catch (e) {
    }
  };

  startActivityGetThumbData() {
    //var obj = this;
    var port;
    var urlStr = "";
    urlStr = "http://localhost:11100/rd/capture";
    let pageObj = this;
    try {
      this.getJSONCapture(urlStr, function (err, data) {
        if (err != null) {
          pageObj.message = "Something went wrong: " + err;
          MessageBox.show(pageObj.dialog, pageObj.message, "");
        } else {
          if (data.indexOf('errCode="999"') > -1) {
            pageObj.message = "Please connect your Thumb Scanner.";
            MessageBox.show(pageObj.dialog, pageObj.message, "");
            return false;
          }
          xml2js.parseString(data, function (err, result) {
            let MAC_NUMBER;
            if (pageObj.showStartek == "show")
              MAC_NUMBER =
                result.PidData.DeviceInfo[0].additional_info[0].Param[0].$
                  .value;
            else if (pageObj.showSecuGen == "show")
              MAC_NUMBER =
                result.PidData.DeviceInfo[0].additional_info[0].Param[0].$
                  .value;
            if (!MAC_NUMBER) {
              pageObj.message = "Please connect your Thumb Scanner.";
              MessageBox.show(pageObj.dialog, pageObj.message, "");
              return false;
            }
            if (
              MAC_NUMBER &&
              pageObj.deviceSerialNo == MAC_NUMBER.toUpperCase()
            ) {
            } else {
              // alert("Your Thumb Device Serial number not matched. Please First Register Thumb Device by Using Menu 'Setting > Set Thumb Device'.");
              pageObj.message = "Your Thumb Device Serial number not matched. Please First Register Thumb Device by Using Menu 'Setting > Set Thumb Device'.";
              MessageBox.show(pageObj.dialog, pageObj.message, "");
              return false;
            }

            var paramObj = {
              type: result.PidData.Data[0].$.type,
              thumb: result.PidData.Data[0]._,
              dc: result.PidData.DeviceInfo[0].$.dc,
              dpId: result.PidData.DeviceInfo[0].$.dpId,
              mc: result.PidData.DeviceInfo[0].$.mc,
              mi: result.PidData.DeviceInfo[0].$.mi,
              rdsId: result.PidData.DeviceInfo[0].$.rdsId,
              rdsVer: result.PidData.DeviceInfo[0].$.rdsVer,
              Hmac: result.PidData.Hmac[0],
              ci: result.PidData.Skey[0].$.ci,
              Skey: result.PidData.Skey[0]._,
              po_aeps_reqid: "",
              po_tranidf: ""
            };
            let deviceInfo;
            deviceInfo = result.PidData.DeviceInfo[0].additional_info[0];
            pageObj.GetTransactionNumber(paramObj, pageObj, deviceInfo);
          });
        }
      });
    } catch (e) {
    }
  }

  btnThumbScanClick() {
    if (
      this.aadharModel.aadharNo1.trim().length == 0 ||
      this.aadharModel.aadharNo1.trim().length != 4
    ) {
      this.message = "Enter Proper AADHAR No.";
      MessageBox.show(this.dialog, this.message, "");
      const txtAadhar1 = this.renderer2.selectRootElement("#txtAadhar1");
      setTimeout(() => txtAadhar1.focus(), 0);
      return false;
    } else if (
      this.aadharModel.aadharNo2.length == 0 ||
      this.aadharModel.aadharNo2.trim().length != 4
    ) {
      this.message = "Enter Proper AADHAR No.";
      MessageBox.show(this.dialog, this.message, "");
      const txtAadhar2 = this.renderer2.selectRootElement("#txtAadhar2");
      setTimeout(() => txtAadhar2.focus(), 0);
      return false;
    } else if (
      this.aadharModel.aadharNo3.length == 0 ||
      this.aadharModel.aadharNo3.trim().length != 4
    ) {
      this.message = "Enter Proper AADHAR No.";
      MessageBox.show(this.dialog, this.message, "");
      const txtAadhar3 = this.renderer2.selectRootElement("#txtAadhar3");
      setTimeout(() => txtAadhar3.focus(), 0);
      return false;
    }
    if (
      this.aadharModel.aadharNo1.length +
      this.aadharModel.aadharNo2.length +
      this.aadharModel.aadharNo3.length !=
      12
    ) {
      this.message = "Invalid AADHAR.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.aadharModel.bankCode == null || this.aadharModel.bankCode == '' || this.aadharModel.bankCode == undefined || this.aadharModel.bankCode.length === 0) {
      this.message = "Select Bank.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.aadharModel.amount == '' || this.aadharModel.amount == null || this.aadharModel.amount == undefined) {
      this.message = "Enter Amount.";
      MessageBox.show(this.dialog, this.message, "");
      this.aadharModel.amount = '';
      return false;
    }
    if (parseFloat(this.aadharModel.amount) == 0) {
      this.message = "Enter Amount greater than 0.00.";
      MessageBox.show(this.dialog, this.message, "");
      const txtAmount = this.renderer2.selectRootElement("#txtAmount");
      setTimeout(() => txtAmount.focus(), 0);
      return false;
    }
    if (this.aadharModel.amount.length == 0 || this.aadharModel.amount == null) {
      this.message = "Enter Amount.";
      MessageBox.show(this.dialog, this.message, "");
      const txtAmount = this.renderer2.selectRootElement("#txtAmount");
      setTimeout(() => txtAmount.focus(), 0);
      return false;
    }
    if (this.aadharModel.amount.substr(0, this.aadharModel.amount.indexOf(".") - 1).length > 9 || this.aadharModel.amount > '100000') {
      this.message = "Amount should not exceed 10000.00.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }


    if (!this.TCchek) {
      this.message = "Please check Terms and conditions.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    // } catch (e) { }
    this.aadharModel.aadhar = this.aadharModel.aadharNo1 + "" + this.aadharModel.aadharNo2 + "" + this.aadharModel.aadharNo3;
    this.startActivityGetThumbData();
  }

  clear() {
    this.aadharModel.aadhar = "";
    this.aadharModel.aadharNo1 = "";
    this.aadharModel.aadharNo2 = "";
    this.aadharModel.aadharNo3 = "";
    // this.aadharModel.aadharBankList= null;
    // this.aadharModel.bankCode= 'Select Bank';
    this.aadharModel.amount = null;
    this.aadharModel.bankName = null;
    this.aadharModel.customerName = "";
    this.aadharModel.billNumber = "";
    this.aadharModel.custGSTNo = "";
    this.donateNumber = "";
  }

  // send payment

  Search() {
    var paramObj = {
      userid: 1,
      keyword: "PAYTOCLIENT"
    };
    this.spinner.show();
    // uinput = uinput.split('~');
    this.apiService.sendToServer<ILogin>("/auth/merchant/Search", paramObj, this).subscribe(data => {
      //console.log(data);
      this.spinner.hide();

      if (data.code === 1 && data.msg.toUpperCase() === "SUCCESS") {
        // console.log(data.cursor1);
        this.VpayConatctlist = data.cursor1;
        const txtDonationNumber = this.renderer2.selectRootElement('#txtDonationNumber');
        setTimeout(() => txtDonationNumber.focus(), 0);
        if (this.VpayConatctlist.length > 0) {
          for (var i = 0; i < this.VpayConatctlist.length; i++) {
            let data = {
              CLIENT_NAME: this.VpayConatctlist[i].CLIENT_NAME,
              LOGIN_USER_ID: this.VpayConatctlist[i].LOGIN_USER_ID,
              CLIENT_MST_ID: this.VpayConatctlist[i].CLIENT_MST_ID,
              CUSTOMER_TYPE: this.VpayConatctlist[i].CUSTOMER_TYPE
            };
            // this.VpayConatctlist.push(data);
            this.clientlist.push(data);
            // console.log(this.clientlist);
          }
          // this.NotMatchContactList=this.clientlist;
          this.VpayConatctlist = this.clientlist.filter(item => {
            //100
            return item.CUSTOMER_TYPE == "99999";
          });
          // console.log(this.VpayConatctlist);
          // alert('donation'+this.VpayConatctlist);
          // console.log( JSON.stringify(Mobcontactlist));
          // this.fetchDeviceContact()
          //this.fetchMatchData(Mobcontactlist);
          //this.VpayConatctlist=this.clientlist;
        }
      } else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
      }
    },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
      }
    );
  }
  Go() {
    if (this.donateNumber.trim().length == 0) {
      this.message = "Please Enter Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
    if (this.donateNumber.trim().length != 10) {
      this.message = "Please Enter 10 digits Mobile No.";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }

    this.spinner.show();
    this.VpayUserlist = [];
    this.apiService.sendToServer<ILogin>("/auth/merchant/getClientInfo", { MobileNo: this.donateNumber, allClient: true }, this).subscribe(
      data => {

        this.spinner.hide();
        if (data && data.msg.toUpperCase() === "SUCCESS") {
          this.VpayUserlist = data.cursor1;
          if (this.VpayUserlist.length > 0) {
            //this.VpayUserlist &&
            if (this.VpayUserlist.length > 1) {
              this.showUserModal = true;
              if (this.showUserModal == true) {
                $(document).ready(function () {
                  $("#vpayUserModal").modal('show');
                });
              }

            } else {
              this.payName = this.VpayUserlist[0].CLIENT_NAME;
              this.login_user_id = this.VpayUserlist[0].LOGIN_USER_ID;
              this.clientMstId = this.VpayUserlist[0].CLIENT_MST_ID;
              this.aadharModel.billNumber = this.VpayUserlist[0].CLIENT_NAME.charAt(0) + this.VpayUserlist[0].CLIENT_MST_ID;
              this.showDonation = false;
              this.showAadharForm = true;
              // const txtAadhar1 = this.renderer2.selectRootElement('#txtAadhar1');
              // setTimeout(() => txtAadhar1.focus(), 0);
            }
          } else {
            // alert(this.donateNumber + " " + "is Not registered with Vpay");
            this.message = this.donateNumber + " " + "is Not registered with Vpay.";
            MessageBox.show(this.dialog, this.message, "");
            return false;
          }
        }
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handlePageError(err);
        this.donateNumber = "";
      }
    );
  }

  submitDonate(obj) {
    // let thisObj = this;
    if (obj.CLIENT_MST_ID != 0) {
      this.payName = obj.CLIENT_NAME;
      this.login_user_id = obj.LOGIN_USER_ID;
      this.clientMstId = obj.CLIENT_MST_ID;
      this.aadharModel.billNumber = obj.CLIENT_NAME.charAt(0) + obj.CLIENT_MST_ID;
      this.showDonation = false;
      this.showAadharForm = true;
      // const txtAadhar1 = this.renderer2.selectRootElement('#txtAadhar1');
      // setTimeout(() => txtAadhar1.focus(), 0);
    } else {
      // alert(obj.CLIENT_NAME + " " + "is Not registered with Vpay");
      this.message = obj.CLIENT_NAME + " " + "is Not registered with Vpay";
      MessageBox.show(this.dialog, this.message, "");
      return false;
    }
  }

  backDonation() {
    this.showDonation = true;
    this.showAadharForm = false;
    this.VpayUserlist = null;
    this.showAadharInstallInfo = false;
    this.clear();
  }
}

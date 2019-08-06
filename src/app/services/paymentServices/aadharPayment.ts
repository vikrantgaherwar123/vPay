import { Injectable, Renderer2 } from '@angular/core';
import * as xml2js from 'xml2js';
import { IAadhar } from '../../interface/aadhar';
import { ILogin } from '../../interface/login';
import { ErrorHandler } from '../../core/errorHandler';
import { ApiService } from '../../core/api.service';
import { Spinner } from '../../services/spinner';
import { DataStorage } from '../../core/dataStorage';
import { ICore } from "../../interface/core";

import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class AadharPayment {
  logInfo: ILogin;
  //Aadhar Variables
  aadharModel = {
    aadharNo1: '',
    aadharNo2: '',
    aadharNo3: '',
    aadhar: '',
    aadharBankList: null,
    bankCode: '',
    bankName: '',
    amount: '',
    customerName: '',
    billNumber: '',
    custGSTNo: '',
    remark: ''
  }

  AadharModel: any;
  thumbData: any;
  mCust: string;
  showBusinness: string;
  showAadharTranId: string;
  showStartek: string;
  showSecuGen: string; SpinnerSpinner
  deviceSerialNo: string;
  statusImage: any;
  statusMessage: any;
  business: string = '';
  merchantName: string = '';
  customerName: string = '';
  resultMessage: string = '';
  rrn: string = '';
  status: string = '';
  balance: string = '';
  tranDate: string = '';
  collMessage: string = '';
  showStatusBox = false;
  parentPageObj: any;
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

  public constructor(public apiService: ApiService, private dialog: MatDialog, private errorHandler: ErrorHandler,
    private renderer2: Renderer2, private spinner: Spinner, private dataStorage: DataStorage, ) {
    this.DeviceData();
  }



  GetAADHARBANK() {
    this.spinner.show();
    var paramObj = {
      key: 'IIN',
      CLIENT_MST_ID: this.logInfo.CLIENT_MST_ID
    };
    this.apiService.sendToServer<IAadhar>('/api/virtualpay/GetAADHARMemberBank', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.aadharModel.aadharBankList = data.cursor1;
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

  setBankCode() {
    let pageObj = this;
    let selectedBank = this.aadharModel.aadharBankList.filter(a => a.BANK_NAME == pageObj.aadharModel.bankName);
    if (!selectedBank || (selectedBank && selectedBank.length == 0)) {
      this.message = "Please select Bank name";
      MessageBox.show(this.dialog, this.message, "");
      this.aadharModel.bankName = '';
      const txtAadharBank = this.renderer2.selectRootElement('#txtAadharBank');
      setTimeout(() => txtAadharBank.focus(), 0);
      return false;
    }
    pageObj.aadharModel.bankCode = selectedBank[0].IIN;
  }

  DeviceData() {
    this.spinner.show();
    var paramObj = {
      Client_Mst_ID: this.dataStorage.logInfo[0].CLIENT_MST_ID,
      request_from: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
      Flag: 'S',
      Thumb_Mst_Id: null,
      Thumb_Device_No: null,
      Thumb_Device_Det: null,
      Default_Flag: 'Y',
      login_user_id: this.dataStorage.logInfo[0].LOGIN_USER_ID,
      Insti_Sub_Mst_Id: this.dataStorage.logInfo[0].INSTI_SUB_MST_ID,
      CORPORATE_FLAG: this.dataStorage.logInfo[0].CORPORATE_FLAG,
      Corporate_Flag: this.dataStorage.logInfo[0].CORPORATE_FLAG

    }
    this.apiService.sendToServer<ICore>('/api/virtualpay/ThumbDeviceUpdate', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.thumbData = data;
        if (data.cursor2.length > 0 && data.cursor2[0].THUMB_DEVICE_NO) {
          let regDev = data.cursor1.filter((a) => { return a.THUMB_MST_ID == data.cursor2[0].THUMB_MST_ID });
          if (regDev && regDev.length > 0) {
            this.deviceSerialNo = data.cursor2[0].THUMB_DEVICE_NO.toUpperCase();
            if (regDev[0].COMPANY_NAME.indexOf('SecureGen') > -1) {
              this.showSecuGen = 'show';
              this.showStartek = 'hide';
            } else {
              this.showSecuGen = 'hide';
              this.showStartek = 'show';
            }
          }
        }
        else {
          this.showStartek = 'hide';
          this.showSecuGen = 'hide';
          this.message = "Please First Register Thumb Device by Using Menu 'Setting > Set Thumb Device'.";
          MessageBox.show(this.dialog, this.message, "");
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

  ThumbScan(aadharModel, pageCallback, callbackUpdateTranId, pageObj) {
    this.parentPageObj = pageObj;
    try {
      if (aadharModel.aadharNo1.trim().length == 0 || aadharModel.aadharNo1.trim().length != 4) {
        this.message = "Enter Proper AADHAR No.";
        MessageBox.show(this.dialog, this.message, "");
        const txtAadhar1 = this.renderer2.selectRootElement('#txtAadhar1');
        setTimeout(() => txtAadhar1.focus(), 0);
        return false;
      }
      else if (aadharModel.aadharNo2.length == 0 || aadharModel.aadharNo2.trim().length != 4) {
        this.message = "Enter Proper AADHAR No.";
        MessageBox.show(this.dialog, this.message, "");
        const txtAadhar2 = this.renderer2.selectRootElement('#txtAadhar2');
        setTimeout(() => txtAadhar2.focus(), 0);
        return false;
      }
      else if (aadharModel.aadharNo3.length == 0 || aadharModel.aadharNo3.trim().length != 4) {
        this.message = "Enter Proper AADHAR No.";
        MessageBox.show(this.dialog, this.message, "");
        const txtAadhar3 = this.renderer2.selectRootElement('#txtAadhar3');
        setTimeout(() => txtAadhar3.focus(), 0);
        return false;
      }
      if (aadharModel.aadharNo1.length + aadharModel.aadharNo2.length + aadharModel.aadharNo3.length != 12) {
        this.message = "Invalid AADHAR.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (aadharModel.bankCode.length === 0) {
        this.message = "Select Bank.";
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }

      if (aadharModel.amount.length == 0) {
        this.message = 'Enter Amount';
        MessageBox.show(this.dialog, this.message, "");
        const txtAmount = this.renderer2.selectRootElement('#txtAmount');
        setTimeout(() => txtAmount.focus(), 0);
        return false;
      }
      if (aadharModel.amount.substr(0, aadharModel.amount.indexOf('.') - 1).length > 9) {
        this.message = "Amount should not exceed 10000.00.";
        MessageBox.show(this.dialog, this.message, "");
        aadharModel.amount = '0.00';
        return false;
      }
      if (parseFloat(aadharModel.amount) == 0) {
        this.message = "Enter Amount greater than 0.00.";
        MessageBox.show(this.dialog, this.message, "");
        const txtAmount = this.renderer2.selectRootElement('#txtAmount');
        setTimeout(() => txtAmount.focus(), 0);
        return false;
      }
    }
    catch (e) { }
    aadharModel.aadhar = aadharModel.aadharNo1 + "" + aadharModel.aadharNo2 + "" + aadharModel.aadharNo3;
    this.startActivityGetThumbData(aadharModel, pageCallback, callbackUpdateTranId);
  }


  startActivityGetThumbData(aadharModel, pageCallback, callbackUpdateTranId) {
    this.AadharModel = aadharModel;
    var port;
    var urlStr = '';
    urlStr = 'http://localhost:11100/rd/capture';
    let pageObj = this;
    try {
      this.getJSONCapture(urlStr,
        function (err, data) {
          if (err != null) {
            this.message = "Something went wrong: ' + err.";
            MessageBox.show(this.dialog, this.message, "");
          }
          else {
            if (data.indexOf('errCode="999"') > -1) {
              this.message = "Please connect your Thumb Scanner.";
              MessageBox.show(this.dialog, this.message, "");
              return false;
            }
            xml2js.parseString(data, function (err, result) {

              let MAC_NUMBER;
              if (pageObj.showStartek == 'show')
                MAC_NUMBER = result.PidData.DeviceInfo[0].additional_info[0].Param[0].$.value;
              else if (pageObj.showSecuGen == 'show')
                MAC_NUMBER = result.PidData.DeviceInfo[0].additional_info[0].Param[0].$.value;
              if (!MAC_NUMBER) {
                this.message = "Please connect your Thumb Scanner.";
                MessageBox.show(this.dialog, this.message, "");
                return false;
              }
              if (MAC_NUMBER && pageObj.deviceSerialNo == MAC_NUMBER.toUpperCase()) {

              }
              else {
                // alert("Your Thumb Device Serial number not matched. Please First Register Thumb Device by Using Menu 'Setting > Set Thumb Device'.");
                // return false;
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
                po_aeps_reqid: '',
                po_tranidf: ''
              };
              pageObj.GetTransactionNumber(paramObj, pageObj, pageCallback, callbackUpdateTranId);
            });
          }
        });
    } catch (e) {
    }
  }


  getJSONCapture = function (url, callback) {
    let pageObj = this;
    let xhr = new XMLHttpRequest();
    try {
      xhr.open('CAPTURE', url, true);
    }
    catch (e) {
    }

    xhr.responseType = 'text'; //json
    // "<PidOptions ver=\"1.0\">"
    //   + "<Opts env=\"PP\" fCount=\"1\" fType=\"0\" format=\"0\" iCount=\"0\" iType=\"0\" pCount=\"0\" pType=\"0\" pidVer=\"2.0\" posh=\"UNKNOWN\" timeout=\"10000\"/>"
    //   + "</PidOptions>";
    //var InputXml = `<PidOptions ver=\"1.0\"><Opts env=\"P\" fCount=\"1\" fType=\"0\" format=\"0\" iCount=\"0\" iType=\"0\" pCount=\"0\" pType=\"0\" pidVer=\"2.0\" posh=\"UNKNOWN\" timeout=\"10000\"/></PidOptions>`;


    //var	uri 	= "http://localhost:11100/rd/capture";
    // params  += "&PidXML=" + encodeURIComponent(enc_pid_b64);
    var InputXml = '<PidOptions ver="1.0"> <Opts fCount="1"  format="0" pidVer="2.0" timeout="20000" env="P" posh="LEFT_INDEX" /></PidOptions>';

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
    }
    try {
      xhr.send(InputXml);
    } catch (e) {
    }

  };


  GetTransactionNumber(obj, thisObj, pageCallback, callbackUpdateTranId) {
    try {
      if (thisObj.AadharModel.aadhar.toString().trim().length === 0) {
        this.message = 'Enter aadhar Number.';
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }
      if (thisObj.AadharModel.amount.toString().trim().length === 0) {
        this.message = 'Enter Amount';
        MessageBox.show(this.dialog, this.message, "");
        return false;
      }

    }
    catch (e) {

    }

    var paramObj = {
      login_user_id: thisObj.dataStorage.logInfo[0].LOGIN_USER_ID,
      client_mst_id: thisObj.dataStorage.logInfo[0].CLIENT_MST_ID,
      field_0: '0100',
      field_2: thisObj.AadharModel.bankCode,
      field_3: '421000',
      field_4: parseFloat(thisObj.AadharModel.amount).toFixed(2),
      field_11: 0,
      field_12: 0,
      field_13: 0,
      field_22: '019',
      field_24: '001',
      field_25: '05',
      field_36: 'WDLS ||0,0,0,0,0,0,0.00',
      field_37: 0,
      field_38: 0,
      field_39: 0,
      field_41: thisObj.dataStorage.logInfo[0].AEPS_TERMINAL_ID,
      field_42: 'VGIPL',
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
      response_string: '',
      response_string_1: '',
      //request_from: 'MB',
      customer_name: this.AadharModel.customerName,
      bill_number: this.AadharModel.billNumber,
      gst_number: this.AadharModel.custGSTNo
    };
    if (!confirm("If you want to transfer amount then click on OK."))
      return false;
    this.spinner.show();
    this.apiService.sendToServer<IAadhar>('/api/virtualPay/GetAADHARTranID', paramObj, thisObj).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        obj.po_aadharpay_reqid = data.po_aadharpay_reqid;
        obj.po_tranidf = data.po_tranidf;
        thisObj.SendAADHARtoService(obj, thisObj, pageCallback, callbackUpdateTranId);
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        // this.option.msg = data.msg;
        // this.toast.addToast(this.option);
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }



  SendAADHARtoService(obj, thisObj, pageCallback, callbackUpdateTranId) {
    this.spinner.show();
    var AADHARObj = {
      login_user_id: thisObj.dataStorage.logInfo[0].LOGIN_USER_ID,
      client_mst_id: thisObj.dataStorage.logInfo[0].CLIENT_MST_ID,
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
      fieldid_0: '0100',
      fieldid_2: this.AadharModel.bankCode + '0' + thisObj.AadharModel.aadhar,
      fieldid_3: '421000',
      fieldid_4: parseFloat(thisObj.AadharModel.amount).toFixed(2),
      fieldid_11: obj.po_aadharpay_reqid,
      fieldid_22: '019',
      fieldid_24: '001',
      fieldid_25: '05',
      fieldid_36: 'WDLS ||0,0,0,0,0,0,0.00',
      fieldid_41: 'VA000001',
      fieldid_42: 'VGIPL',
      fieldid_125: obj.po_tranidf,
      customer_name: this.AadharModel.customerName,
      bill_number: this.AadharModel.billNumber,
      gst_number: this.AadharModel.custGSTNo
    };
    let pageObj = this;
    this.apiService.sendToServer<IAadhar>('/api/virtualPay/SendAADHAR', AADHARObj, thisObj).subscribe(async (data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS' && data.REVREQ.toUpperCase() == 'SUCCESS') {
        if (data.po_res_desc) {
          let tmp = data.po_res_desc.split('|');
          //TODO=============
          if (tmp[0].split('-')[2].toString().toUpperCase() == tmp[0].split('-')[4].toString().toUpperCase()) {
            tmp[0] = tmp[0].split('-')[2];
          }
          else {
            tmp[0] = tmp[0].split('-')[2] + ',' + tmp[0].split('-')[4];
          }
          //=================
          let msgArr = tmp[0].split('-');
          let msgAadhar = '';
          let i = 2;
          if (msgArr.length > 2) {
            for (i; i < msgArr.length; i++) {
              msgAadhar += msgArr[i];
            }
          } else {
            msgAadhar = tmp[0];
          }

          if (this.AadharModel.customerName && this.AadharModel.customerName.trim().length > 0)
            this.mCust = 'show';
          else
            this.mCust = 'hide';
          if (this.dataStorage.logInfo[0].BUSINESS_DETAILS) {
            this.showBusinness = "show";
          }
          else {
            this.showBusinness = "hide";
          }
          if (!tmp[1] || (tmp[1] && tmp[1].trim().length == 0))
            this.showAadharTranId = 'hide';
          else
            this.showAadharTranId = 'show';
          let status = '';
          if (tmp[tmp.length - 1] == 'N')
            status = "F";  //Failed
          else
            status = "S"; //Success
          let res = await callbackUpdateTranId(pageObj, this.parentPageObj, tmp[1], status);
          if (res)
            pageCallback(tmp, this.mCust, this.showBusinness, this.showAadharTranId, this.parentPageObj);
          else
            return false;
        }
        else {
          //TODO
        }
        thisObj.AadharModel.aadhar = '';
        thisObj.AadharModel.aadharNo1 = '';
        thisObj.AadharModel.aadharNo2 = '';
        thisObj.AadharModel.aadharNo3 = '';
        thisObj.AadharModel.Mobile = '';
        thisObj.AadharModel.amount = '';
        thisObj.AadharModel.remark = '';
      }
      else if (data.REVREQ.toUpperCase() == 'REVREQ') {
        // alert("Time-Out, Responce not getting from services, Please Try Again.")
        this.message = "Time-Out, Responce not getting from services, Please Try Again.";
        MessageBox.show(this.dialog, this.message, "");
        return;
      }
      else if (data.REVREQ.toUpperCase() == 'TIMEOUT') {
        this.message = 'TIMEOUT';
        MessageBox.show(this.dialog, this.message, "");
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



  clear() {
    this.AadharModel.aadhar = '';
    this.AadharModel.aadharNo1 = '';
    this.AadharModel.aadharNo2 = '';
    this.AadharModel.aadharNo3 = '';
    // this.aadharModel.aadharBankList= null;
    // this.aadharModel.bankCode= 'Select Bank';
    this.AadharModel.amount = '0.00';
    this.AadharModel.customerName = '';
    this.AadharModel.billNumber = '';
    this.AadharModel.custGSTNo = '';
  }
}
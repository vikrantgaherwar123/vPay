import { Injectable, Renderer2 } from '@angular/core';
import { ILogin } from '../../../../interface/login';
import { ErrorHandler } from '../../../../core/errorHandler';
import { ApiService } from '../../../../core/api.service';
import { Spinner } from '../../../../services/spinner';
import { DataStorage } from '../../../../core/dataStorage';
import { ICore } from "../../../../interface/core";
import { IBillCollectionUPI } from '../../../../interface/billCollectionUPI';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Injectable()
export class QrPayment {
  parentPageObj: any;
  callback: any;

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
    private renderer2: Renderer2, private spinner: Spinner, private dataStorage: DataStorage) {

  }

  
  getQrCode(callback, qrParamObj: IQrCode, parentPageObj) {
    this.parentPageObj = parentPageObj;
    this.callback = callback;
    this.spinner.show();
    var paramObj = {
      client_mst_id: this.dataStorage.logInfo[0].CLIENT_MST_ID,
      merchant_id: '',
      merchant_name: '',
      sub_merchant_id: '',
      sub_merchant_name: '',
      terminal_id: '',
      merchant_tran_id: '',
      original_bank_rrn: '',
      orig_mer_tran_id: '',
      payer_va: '',
      amount: parseFloat(qrParamObj.qRAmount.toString()).toFixed(2),
      remarks: qrParamObj.qrRemark,
      bill_number: qrParamObj.qrBillNo,
      online_refund: '',
      collect_by_date: '',
      request_flag: 'Q',
      request_from: 'WB',
      device_id: 'D',
      login_user_id: this.dataStorage.logInfo[0].LOGIN_USER_ID,
      customer_name: qrParamObj.customerName,
      gst_number: qrParamObj.gstNo,
    };

    let pageObj = this;
    this.apiService.sendToServer<ICore>('/api/virtualPay/tranreq', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.QRsendToService(data.data[0], qrParamObj, pageObj.parentPageObj);
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        return;
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }


  QRsendToService(obj, qrParamObj: IQrCode, pageObj) {
    var paramObj = {
      BILL_NUMBER: qrParamObj.qrBillNo,
      AMOUNT: parseFloat(qrParamObj.qRAmount.toString()).toFixed(2),
      MERCHANT_ID: obj.MERCHANT_ID,
      TERMINAL_ID: obj.TERMINAL_ID,
      MERCHANT_TRAN_ID: obj.MERCHANT_TRAN_ID,//obj.UPI_REQ_ID
      REMARKS: qrParamObj.qrRemark,
      MERCHANT_NAME: obj.MERCHANT_NAME,
      SUB_MERCHANT_ID: obj.SUB_MERCHANT_ID,
      SUB_MERCHANT_NAME: obj.SUB_MERCHANT_NAME,
      UPI_REQ_ID: obj.UPI_REQ_ID,
      login_user_id: pageObj.logInfo[0].LOGIN_USER_ID,
      bill_number: qrParamObj.qrBillNo,
      customer_name: qrParamObj.customerName,
      gst_number: qrParamObj.gstNo,
      message: ''
    };
    this.apiService.sendToServer<ICore>('/api/virtualPay/qrcodetoService', paramObj, pageObj).subscribe((data) => {
      this.QRSaveResponse(data, paramObj, pageObj);

    }, err => {
      this.spinner.hide();
      paramObj.message = JSON.parse(err.error).msg;
      MessageBox.show(pageObj.dialog, pageObj.message,"");
      this.callback(paramObj, null, pageObj);
      //this.errorHandler.handlePageError(err);
    });
  }

  QRSaveResponse(obj, param, pageObj) {

    var paramObj = {

      upi_req_id: param.UPI_REQ_ID,
      client_mst_id: pageObj.dataStorage.logInfo[0].CLIENT_MST_ID,
      merchant_id: obj.merchantId,
      sub_merchant_id: obj.subMerchantId,
      merchant_tran_id: obj.merchantTranId,
      orig_bank_rrn: obj.BankRRN,
      success: obj.success,
      message: obj.message,
      response: obj.response,
      status: '',
      terminal_id: obj.terminalId,
      request_flag: 'Q',
      request_string: obj.BILL_NUMBER + '|' + obj.AMOUNT + '|' + obj.REMARKS + '|' + obj.MERCHANT_ID + '|' + obj.MERCHANT_NAME + '|' + obj.SUB_MERCHANT_ID + '|' + obj.SUB_MERCHANT_NAME + '|' + obj.TERMINAL_ID + '|' + obj.MERCHANT_TRAN_ID + '|' + obj.UPI_REQ_ID,
      request_from: 'WB',
      device_id: 'D',
      login_user_id: pageObj.logInfo[0].LOGIN_USER_ID,
      bill_number: param.bill_number,
      customer_name: param.customer_name,
      gst_number: param.gst_number,
      PAYER_NAME: '',
      PAYER_MOBILE: '',
      PAYER_VA: '',
      PAYER_AMOUNT: '',
      TXNINITDATE: '',
      TXNCOMPLETIONDATE: '',
      reference_id: obj.refId

    };
    //this.spinner.show(); 
    this.apiService.sendToServer<IBillCollectionUPI>('/api/virtualPay/tranresponse', paramObj, pageObj).subscribe((data) => {
      this.spinner.hide();
      if (data.po_res_desc) {
        let tmp = data.po_res_desc.split('|');
        this.callback(paramObj, param, pageObj);


        // let btnLogin = $('#qrCodeBtn');
        // setTimeout(() => btnLogin.attr('disabled', 'true'), 0);
        //this.clearQR();

      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
      //this.QRFlag = false;

    });
  }


}
interface IQrCode {
  qRAmount: number;
  qrRemark: string;
  qrBillNo: string;
  customerName: string;
  gstNo: string;
}


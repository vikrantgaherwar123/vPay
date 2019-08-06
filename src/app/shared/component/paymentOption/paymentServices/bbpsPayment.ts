import { Injectable, Renderer2 } from '@angular/core';
import { ILogin } from '../../../../interface/login';
import { ErrorHandler } from '../../../../core/errorHandler';
import { ApiService } from '../../../../core/api.service';
import { Spinner } from '../../../../services/spinner';
import { DataStorage } from '../../../../core/dataStorage';
import { IBbps } from '../../../../interface/bbps';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class BbpsPayment {
  logInfo: ILogin;
  parentPageObj: any;
  callback: any;
  errorDisplay: any;
  BillerData: any;
  Amount: any;

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


  //Pay Bill Without Featching Bill Data 

  saveBbpsBillOnly(Paybillonly) {
    this.spinner.show();
    var paramObj = {
      // Client_Mst_ID: this.model.client_mst_id,
      KEYWORD: Paybillonly.KEYWORD,
      USERNAME: 'abcd',
      PASSWORD: 'abcd',
      VARCHAR_1: Paybillonly.VARCHAR_1, //this.loginInfo.LOGIN_USER_ID,   //customer mobile
      VARCHAR_2: Paybillonly.VARCHAR_2,           //customer Email
      VARCHAR_3: Paybillonly.VARCHAR_3, //this.referenceId
      VARCHAR_4: Paybillonly.VARCHAR_4,  //id
      VARCHAR_5: Paybillonly.VARCHAR_5, //Biller ID
      VARCHAR_6: Paybillonly.VARCHAR_6,   //quickPay
      VARCHAR_7: Paybillonly.VARCHAR_7,    //splitPay
      VARCHAR_8: Paybillonly.paymentMode,   //Paybillonly.VARCHAR_8,   //paymentMode
      VARCHAR_9: Paybillonly.VARCHAR_9,
      VARCHAR_10: Paybillonly.VARCHAR_10,
      VARCHAR_11: Paybillonly.VARCHAR_11,
      VARCHAR_12: Paybillonly.VARCHAR_12,
      VARCHAR_13: Paybillonly.VARCHAR_13,
      VARCHAR_14: Paybillonly.VARCHAR_14,   //clientReferenceID
      VARCHAR_15: Paybillonly.VARCHAR_15,   //Remark
      VARCHAR_17: Paybillonly.VARCHAR_17 == null ? '' : Paybillonly.VARCHAR_17,
      VARCHAR_18: Paybillonly.VARCHAR_18 == null ? '' : Paybillonly.VARCHAR_18,
      VARCHAR_19: Paybillonly.VARCHAR_19 == null ? '' : Paybillonly.VARCHAR_19,
      VARCHAR_20: Paybillonly.VARCHAR_20 == null ? '' : Paybillonly.VARCHAR_20,
      VARCHAR_21: Paybillonly.VARCHAR_21 == null ? '' : Paybillonly.VARCHAR_21,
      VARCHAR_22: Paybillonly.VARCHAR_22 == null ? '' : Paybillonly.VARCHAR_22,
      VARCHAR_23: Paybillonly.VARCHAR_23 == null ? '' : Paybillonly.VARCHAR_23,
      VARCHAR_24: Paybillonly.VARCHAR_24 == null ? '' : Paybillonly.VARCHAR_24,
      VARCHAR_25: Paybillonly.VARCHAR_25 == null ? '' : Paybillonly.VARCHAR_25,
      VARCHAR_26: Paybillonly.VARCHAR_26 == null ? '' : Paybillonly.VARCHAR_26,

      request_from: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
    }
    this.apiService.sendToServer<IBbps>('/api/virtualpay/PayBillPayOnly', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.errorMessages.length > 0) {
          // alert('Transaction Failed');
          this.message = "Transaction Failed.";
          MessageBox.show(this.dialog, this.message, "");
          this.errorDisplay = data.errorMessages;
          if (this.errorDisplay != null) {
            // alert(this.errorDisplay[0].errorDtl)
            this.message = this.errorDisplay[0].errorDtl;
            MessageBox.show(this.dialog, this.message, "");
            return false;
          }
        }
        else {
          this.BillerData = data;
          this.message = "Transaction Successfull.";
          MessageBox.show(this.dialog, this.message, "");
          this.Amount = (this.BillerData.amount) / 100;
          this.Amount = parseFloat(this.Amount);
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



  //Pay Bill With Featching Bill Data
  saveBbpsBill(PayBill) {
    this.spinner.show();
    var paramObj = {
      // Client_Mst_ID: this.model.client_mst_id,
      KEYWORD: 'PayBill',
      USERNAME: 'abcd',
      PASSWORD: 'abcd',
      VARCHAR_1: PayBill.VARCHAR_1,
      VARCHAR_2: PayBill.VARCHAR_2, // this.loginInfo.LOGIN_USER_ID,
      VARCHAR_3: PayBill.VARCHAR_3,
      VARCHAR_4: PayBill.VARCHAR_4,
      VARCHAR_5: PayBill.VARCHAR_5,
      VARCHAR_6: PayBill.VARCHAR_6,
      VARCHAR_7: PayBill.VARCHAR_7,
      VARCHAR_8: PayBill.VARCHAR_8,
      VARCHAR_9: PayBill.paymentMode, //PayBill.VARCHAR_9,
      VARCHAR_10: PayBill.VARCHAR_10,
      VARCHAR_11: PayBill.VARCHAR_11,
      VARCHAR_12: PayBill.VARCHAR_12,
      VARCHAR_13: PayBill.VARCHAR_13,
      VARCHAR_14: PayBill.VARCHAR_14,
      VARCHAR_15: PayBill.VARCHAR_15,
      VARCHAR_16: PayBill.VARCHAR_16,
      VARCHAR_17: PayBill.VARCHAR_17,
      // VARCHAR_21:this.inputfieldarray[0].name,
      // VARCHAR_22:PayBill.VARCHAR_22e,
      VARCHAR_21: PayBill.VARCHAR_21 == null ? '' : PayBill.VARCHAR_21,
      VARCHAR_22: PayBill.VARCHAR_22 == null ? '' : PayBill.VARCHAR_22,
      VARCHAR_23: PayBill.VARCHAR_23 == null ? '' : PayBill.VARCHAR_23,
      VARCHAR_24: PayBill.VARCHAR_24 == null ? '' : PayBill.VARCHAR_24,
      VARCHAR_25: PayBill.VARCHAR_25 == null ? '' : PayBill.VARCHAR_25,
      VARCHAR_26: PayBill.VARCHAR_26 == null ? '' : PayBill.VARCHAR_26,
      VARCHAR_27: PayBill.VARCHAR_27 == null ? '' : PayBill.VARCHAR_27,
      VARCHAR_28: PayBill.VARCHAR_28 == null ? '' : PayBill.VARCHAR_28,
      VARCHAR_29: PayBill.VARCHAR_29 == null ? '' : PayBill.VARCHAR_29,
      VARCHAR_30: PayBill.VARCHAR_30 == null ? '' : PayBill.VARCHAR_30,
      request_from: 'WB',
      device_id: 'Desktop',
      Device_Id: 'Desktop',
    }
    this.apiService.sendToServer<IBbps>('/api/virtualpay/PayBill', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.errorMessages.length > 0) {
          // alert('Transaction Failed');
          this.message = "Transaction Failed.";
          MessageBox.show(this.dialog, this.message, "");
          this.errorDisplay = data.errorMessages;
          //this.errorDisplay = data.errors;
          if (this.errorDisplay != null) {
            // alert(this.errorDisplay[0].errorDtl)
            this.message = this.errorDisplay[0].errorDtl;
            MessageBox.show(this.dialog, this.message, "");
            return false;
          }
        }
        else {
          this.BillerData = data;
          this.message = "Transaction Successfull.";
          MessageBox.show(this.dialog, this.message, "");
          this.Amount = (this.BillerData.amount) / 100;
          this.Amount = parseFloat(this.Amount);
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


}
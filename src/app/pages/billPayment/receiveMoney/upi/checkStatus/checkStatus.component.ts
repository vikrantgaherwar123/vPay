import { Component, OnInit, ViewChild } from '@angular/core';

import { ErrorHandler } from '../../../../../core/errorHandler';
import { Spinner } from '../../../../../services/spinner';
import { ApiService } from '../../../../../core/api.service';
import { DataStorage } from '../../../../../core/dataStorage';
import { Router } from '@angular/router';
import { ICore } from '../../../../../interface/core';
import { ILogin } from '../../../../../interface/login';
import { IBillCollectionUPI } from '../../../../../interface/billCollectionUPI';
import { Toast } from '../../../../../services/toast';
import * as moment from 'moment';


import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
declare const $: any;
@Component({
  selector: 'R-vgipl-checkStatus',
  templateUrl: './checkStatus.html',
  styleUrls: ['./checkStatus.scss'],
  providers: [Spinner]
})

export class CheckStatusComponent implements OnInit {
  fromDate: Date = new Date();
  toDate: Date = new Date();
  SetControlValue: string; _gatewaydetid: number = 0;
  login_user_id: string;
  BUSINESS_DETAILS: string = "";
  Insti_Sub_Mst_Id: string = "";
  Corporate_Flag: any;
  value: string = 'Techiediaries';
  successDialoage: boolean = false;
  failureDialoage: boolean = false;
  msgshowhide: string = '';
  DisplayMsg: string = '';
  display: string;
  // curDate: any;
  mCust: string;
  showVPayTranId: string;
  //CHECK STATUS 
  showUPIStatusRecord: boolean = true;
  txt_Fdate: any; txt_Tdate: any;
  UPIItems: any;
  RESPONSE: any;

  statusImage: any;
  statusMessage: any;
  business: string = '';
  merchantName: string = '';
  logInfo: ILogin;
  customerName: string = '';
  rrn: string = '';
  status: string = '';
  balance: number = 0.00;
  tranDate: string = '';
  collMessage: string = '';
  successSVG: boolean = false;
  failedSVG: boolean = false;
  showCheckPopUP: boolean = false;
  //END
  showCollReqF: boolean = true;
  clientMstId: number;
  option = {
    position: 'top-center',
    showClose: true,
    timeout: 5000,
    theme: 'bootstrap',
    type: 'error',
    closeOther: false,
    msg: ''
  }

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



  constructor(private apiService: ApiService, private dialog: MatDialog, private router: Router, private dataStorage: DataStorage,
    private errorHandler: ErrorHandler, private toast: Toast, private spinner: Spinner) {

  }

  ngOnInit() {
  
    this.logInfo = this.dataStorage.logInfo;
    this.clientMstId = this.logInfo[0].CLIENT_MST_ID;
    this.login_user_id = this.logInfo[0].LOGIN_USER_ID;
    this.BUSINESS_DETAILS = this.logInfo[0].BUSINESS_DETAILS;
    this.Corporate_Flag = this.logInfo[0].CORPORATE_FLAG;
    this.Insti_Sub_Mst_Id = this.logInfo[0].INSTI_SUB_MST_ID != null ? this.logInfo[0].INSTI_SUB_MST_ID : '';
    // this.curDate = moment(this.logInfo[0].LOGIN_DATE).format('DD/MMM/YYYY');
    this.txt_Fdate = this.fromDate;
    this.txt_Tdate = this.toDate;

  }
  //# START UPI Status ====================================================

  processUPIStatus() {
    this.txt_Fdate = moment(this.txt_Fdate).format("DD/MMM/YYYY");
    this.txt_Tdate = moment(this.txt_Tdate).format("DD/MMM/YYYY");
    if (this.txt_Fdate == '' || this.txt_Fdate == undefined) {
      // alert('Enter From Date');
      this.message = "Enter From Date.";
      MessageBox.show(this.dialog, this.message, "");
      // this.option.msg='Enter From Date.';
      // this.toast.addToast(this.option);
      return false;
    }
    if (this.txt_Tdate == '' || this.txt_Tdate == undefined) {
      // alert('Enter Upto Date');
      this.message = "Enter Upto Date.";
      MessageBox.show(this.dialog, this.message, "");
      // this.option.msg='Enter Upto Date.';
      // this.toast.addToast(this.option);
      return false;
    }
    if (this.checkDateVal(this))
      var paramObj = {
        client_mst_id: this.clientMstId,
        Client_Mst_Id: this.clientMstId,
        fromdate: this.txt_Fdate,
        uptodate: this.txt_Tdate,
        login_user_id: this.login_user_id
      };
    this.spinner.show();
    this.apiService.sendToServer<IBillCollectionUPI>('/api/virtualPay/UPIStatus', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        if (data.cursor1.length == 0) {
          // alert('No Data Found.');  
          this.message = "No Data Found.";
          MessageBox.show(this.dialog, this.message, "");
          // this.option.msg='No Data Found.';
          // this.toast.addToast(this.option);
        }
        else {
          this.UPIItems = data.cursor1;
          this.txt_Fdate = new Date(this.txt_Fdate);
          this.txt_Tdate = new Date(this.txt_Tdate);
        }
      }
    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });
  }

  UPIGetStatus(obj) {
    if (this.checkDateVal(this))
      this.UPICheckStatusgetRequestID(obj);
    else
      return false;
  }

  UPICheckStatusgetRequestID(obj) {
    var paramObj = {
      client_mst_id: this.clientMstId,
      merchant_id: '',
      merchant_name: '',
      sub_merchant_id: '',
      sub_merchant_name: '',
      terminal_id: '',
      merchant_tran_id: obj.MERCHANT_TRAN_ID,
      original_bank_rrn: '',
      orig_mer_tran_id: '',
      payer_va: '',
      amount: obj.TRANSAMT,
      remarks: '',
      bill_number: '',
      online_refund: '',
      collect_by_date: '',
      request_flag: 'S',
      request_from: 'WB'
    };
    let pageObj = obj;
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/tranreq', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.UPICheckStatussendToService(data.data[0], paramObj, pageObj);
      }
      else {
        this.message = data.msg;
        MessageBox.show(this.dialog, this.message, "");
        // this.option.msg=data.msg;
        //  this.toast.addToast(this.option);
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);

    });

  }

  UPICheckStatussendToService(obj, param, pageObj) {

    var paramObj = {
      client_mst_id: param.client_mst_id,
      MERCHANT_ID: obj.MERCHANT_ID,
      SUB_MERCHANT_ID: obj.SUB_MERCHANT_ID,
      TERMINAL_ID: obj.TERMINAL_ID,
      MERCHANT_TRAN_ID: param.merchant_tran_id,//obj.UPI_REQ_ID
      NEWUPI_REQ_ID: obj.UPI_REQ_ID
    };
    this.spinner.show();
    this.apiService.sendToServer<ICore>('/api/virtualPay/TransactionStatus', paramObj, this).subscribe((data) => {
      this.spinner.hide();
      if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
        this.UPICheckStatusSaveResponse(JSON.parse(data.d), paramObj, pageObj);
      }

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);

    });
  }

  UPICheckStatusSaveResponse(obj, param, pageObj) {
    this.spinner.show();
    var paramObj = {
      upi_req_id: param.NEWUPI_REQ_ID,
      client_mst_id: param.client_mst_id,
      merchant_id: param.MERCHANT_ID,
      sub_merchant_id: param.SUB_MERCHANT_ID,
      merchant_tran_id: param.MERCHANT_TRAN_ID,//param.MERCHANT_TRAN_ID,
      orig_bank_rrn: obj.OriginalBankRRN,
      success: obj.success,
      message: obj.message,
      response: obj.response,
      status: obj.status,
      terminal_id: param.TERMINAL_ID,
      request_flag: 'S',
      request_string: param.client_mst_id + '|' + param.MERCHANT_ID + '|' + param.SUB_MERCHANT_ID + '|' + param.TERMINAL_ID + '|' + param.MERCHANT_TRAN_ID,
      request_from: 'WB',
      bill_number: '',
      customer_name: '',
      gst_number: '',
      PAYER_NAME: '',
      PAYER_MOBILE: '',
      PAYER_VA: '',
      PAYER_AMOUNT: '',
      TXNINITDATE: '',
      TXNCOMPLETIONDATE: '',
      reference_id: ''
    };

    this.apiService.sendToServer<IBillCollectionUPI>('/api/virtualPay/tranresponse', paramObj, this).subscribe((data) => {
      this.spinner.show();
      if (data.po_res_desc) {
        this.showCheckPopUP = true;
        if (this.showCheckPopUP == true) {
          $(document).ready(function () {
            $("#checkStatusModal").modal('show');
          });
        }
        let tmp = data.po_res_desc.split('|');
        //TODO=============
        if (tmp[0].split('-')[2].toString().toUpperCase() == tmp[0].split('-')[4].toString().toUpperCase()) {
          tmp[0] = tmp[0].split('-')[2];
        }
        else {
          tmp[0] = tmp[0].split('-')[2] + ',' + tmp[0].split('-')[4];
        }
        if (!tmp[1] || (tmp[1] && tmp[1].trim().length == 0))
          this.showVPayTranId = 'hide';
        else
          this.showVPayTranId = 'show';
        if (tmp[tmp.length - 1] == 'N') {
          // this.statusImage = "assets/images/error.png";
     
          this.failedSVG = true;
          this.successSVG = false;
          this.statusMessage = "Transaction failed";
          this.business = this.logInfo[0].BUSINESS_DETAILS;
          this.merchantName = this.logInfo[0].CLIENT_NAME;
          // this.customerName = this.CollectionCustomerName;
          this.rrn = tmp[1];
          this.collMessage = tmp[0].replace(/-/g, '');
          this.status = "Pending";
          this.balance = pageObj.TRANSAMT;
          this.tranDate = tmp[2];         
        }
        else {
          // this.statusImage = "assets/images/success.png";
          this.successSVG = true;
          this.failedSVG = false;
          this.statusMessage = "Transaction Success.";
          this.business = this.logInfo[0].BUSINESS_DETAILS;
          this.merchantName = this.logInfo[0].CLIENT_NAME;
          // this.customerName = this.CollectionCustomerName;
          this.rrn = tmp[1];
          this.collMessage = tmp[0].replace(/-/g, '');
          this.status = "Pending";
          this.balance = pageObj.TRANSAMT;
          this.tranDate = tmp[2];     
        }

        let btnLogin = $('#collBtn');
        setTimeout(() => btnLogin.attr('disabled', 'true'), 0);
        //this.UPIStatusclear();

      }

      else {
        //TODO
      }


      if (data.po_res_desc && data.po_res_desc.indexOf("Internal Server Error") > -1) {
        let tempResult = data.po_res_desc.split('-');

        //Avinash N Shende-VGIPL Cloud Store-Internal Server Error.--||19-FEB-18|N
        this.failureDialoage = true;

      }
      else
        this.successDialoage = true;
      this.RESPONSE = data.po_res_desc;
      // this.navController.push(STATUS, {
      //   RESDESC: data.po_res_desc,
      //   AMOUNT:this.TRANSAMT,
      //   CUST_NAME:this.model.customer_name
      // });
      this.spinner.hide();

    }, err => {
      this.spinner.hide();
      this.errorHandler.handlePageError(err);
    });

  }
  //TODO
  UPIStatusclear() {
    this.txt_Fdate = new Date();
    this.txt_Tdate = new Date();
    this.UPIItems = null;
  }

  checkDateVal(obj) {
    var StartDate = (<HTMLInputElement>document.getElementById('txtStartDate')).value;
    var EndDate = (<HTMLInputElement>document.getElementById('txtEndDate')).value;
    var eDate = new Date(EndDate);
    var sDate = new Date(StartDate);
    if (StartDate != '' && StartDate != '' && sDate > eDate) {
      this.UPIStatusclear();
      this.message = "Please ensure that the End Date is greater than or equal to the Start Date.";
      MessageBox.show(this.dialog, this.message, "");
      this.spinner.hide();
      return false;
    }

    return true;

  }



  //# END UPI Status ======================================================

  //# START QR CODE ======================================================


  //# END QR CODE ======================================================== 

}
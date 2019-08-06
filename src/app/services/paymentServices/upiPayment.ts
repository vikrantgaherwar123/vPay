import { Injectable, Renderer2 } from '@angular/core';
import { ILogin } from '../../interface/login';
import { ErrorHandler } from '../../core/errorHandler';
import { ApiService } from '../../core/api.service';
import { Spinner } from '../../services/spinner';
import { DataStorage } from '../../core/dataStorage';
import { ICore } from "../../interface/core";
import { IBillCollectionUPI } from '../../interface/billCollectionUPI';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Injectable()
export class UpiPayment {
    logInfo: ILogin;
    parentPageObj: any;
    callback: any;
    mCust: any;
    showBusinness: any;
    showVPayTranId: any;
    
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

    public constructor(public apiService: ApiService, private dialog: MatDialog,private errorHandler: ErrorHandler,
        private renderer2: Renderer2, private spinner: Spinner, private dataStorage: DataStorage) {

    }



    updateProdTranMaster(pageObj, rrn) {
        return new Promise(resolve => {
            let obj = {
                _id: pageObj.parentPageObj.tranId,
                CLIENT_MST_ID: pageObj.parentPageObj.logInfo[0].CLIENT_MST_ID,
                TRAN_DET_ID: rrn
            }
            this.apiService.sendToServer<ICore>('/api/product/updateProdTranMaster', { data: obj }, pageObj).subscribe(data => {
                if (data && data.msg === 'Success') {
                    //pageObj.billNo = data.result.value.sequence_value;
                    resolve(data);
                    return true;
                }
                else {
                    this.message = data.msg;
                    MessageBox.show(this.dialog, this.message, "");
                    return false;
                }
            });
        });
    }

    CollectionSaveResponse(obj, param, pageObj, dataObj, callbackUpdateTranId, pageCallback) {
        this.spinner.show();
        var paramObj = {

            upi_req_id: param.UPI_REQ_ID,
            client_mst_id: dataObj.logInfo[0].CLIENT_MST_ID,
            merchant_id: obj.merchantId,
            sub_merchant_id: obj.subMerchantId,
            merchant_tran_id: obj.merchantTranId,
            orig_bank_rrn: obj.BankRRN,
            success: obj.success,
            message: obj.message,
            response: obj.response,
            status: '',
            terminal_id: obj.terminalId,
            request_flag: 'C',
            request_string: obj.BILL_NUMBER + '|' + obj.PAYER_VA + '|' + obj.AMOUNT + '|' + obj.REMARKS + '|' + obj.MERCHANT_ID + '|' + obj.MERCHANT_NAME + '|' + obj.SUB_MERCHANT_ID + '|' + obj.SUB_MERCHANT_NAME + '|' + obj.TERMINAL_ID + '|' + obj.MERCHANT_TRAN_ID + '|' + obj.UPI_REQ_ID,
            request_from: 'WB',
            device_id: 'D',
            login_user_id: dataObj.logInfo[0].LOGIN_USER_ID, //1,
            bill_number: dataObj.upiPaymentObj.CollectionBillNumber,
            customer_name: dataObj.upiPaymentObj.CollectionCustomerName,
            gst_number: dataObj.upiPaymentObj.CollectionGstNumber,
            PAYER_NAME: '',
            PAYER_MOBILE: '',
            PAYER_VA: '',
            PAYER_AMOUNT: '',
            TXNINITDATE: '',
            TXNCOMPLETIONDATE: '',
            reference_id: ''
        };
        this.apiService.sendToServer<IBillCollectionUPI>('/api/virtualPay/tranresponse', paramObj, this).subscribe(async (data) => {
            this.spinner.hide();
            if (data.po_res_desc) {
                let tmp = data.po_res_desc.split('|');
                //TODO=============
                if (tmp[0].split('-')[2].toString().toUpperCase() == tmp[0].split('-')[4].toString().toUpperCase()) {
                    tmp[0] = tmp[0].split('-')[2];
                }
                else {
                    tmp[0] = tmp[0].split('-')[2] + ',' + tmp[0].split('-')[4];
                }
                let msgArr = tmp[0].split('-');
                let msgcoll = '';
                let i = 2;
                if (msgArr.length > 2) {
                    for (i; i < msgArr.length; i++) {
                        msgcoll += msgArr[i];
                    }
                }
                if (dataObj.upiPaymentObj.CollectionCustomerName && dataObj.upiPaymentObj.CollectionCustomerName.trim().length > 0) {
                    this.mCust = 'show';
                }
                else {
                    this.mCust = 'hide';
                }
                if (this.dataStorage.logInfo[0].BUSINESS_DETAILS) {
                    this.showBusinness = "show";
                }
                else {
                    this.showBusinness = "hide";
                }
                if (!tmp[1] || (tmp[1] && tmp[1].trim().length == 0))
                    this.showVPayTranId = 'hide';
                else
                    this.showVPayTranId = 'show';

                let status = '';
                if (tmp[tmp.length - 1] == 'N')
                    status = "F";  //Failed
                else
                    status = "S"; //Success

                let res = await callbackUpdateTranId(pageObj, dataObj, tmp[1], status);
                if (res)
                    pageCallback(tmp, this.mCust, this.showBusinness, this.showVPayTranId, dataObj);
                else
                    return false;

                // if (tmp[tmp.length - 1] == 'N') {
                //     this.resultMessage = "error";
                //     this.statusImage = "assets/images/error.png";
                //     this.statusMessage = "Transaction failed";
                //     this.business = this.logInfo[0].BUSINESS_DETAILS;
                //     this.merchantName = this.logInfo[0].CLIENT_NAME;
                //     this.customerName = this.CollectionCustomerName;
                //     this.rrn = tmp[1];
                //     this.collMessage = msgcoll;          //tmp[0].replace(/-/g,'');
                //     //this.status = "Pending";
                //     this.balance = this.CollectionAmount;
                //     this.tranDate = tmp[2];
                //     // this.display='block'; 
                //     this.showStatusBox = true;
                // }
                // else {
                //     this.resultMessage = "success";
                //     this.statusImage = "assets/images/success.png";
                //     this.statusMessage = "Transaction Success.";

                //     this.business = this.logInfo[0].BUSINESS_DETAILS;
                //     this.merchantName = this.logInfo[0].CLIENT_NAME;
                //     this.customerName = this.CollectionCustomerName;
                //     this.rrn = tmp[1];
                //     this.collMessage = tmp[0].replace(/-/g, '');
                //     this.status = "Pending";
                //     this.balance = this.CollectionAmount;
                //     this.tranDate = tmp[2];
                //     this.showStatusBox = true;
                // }


                //this.clearUPI();
                
            }

            else {
                
            }
        }, err => {
            this.spinner.hide();
            this.errorHandler.handlePageError(err);
        });
    }

    CollectionsendToService(obj, pageObj, dataObj, callbackUpdateTranId, pageCallback) {
        this.spinner.show();
        var paramObj = {
            PAYER_VA: obj.PAYER_VA,
            AMOUNT: parseFloat(obj.AMOUNT).toFixed(2),
            REMARKS: obj.REMARKS,
            MERCHANT_ID: obj.MERCHANT_ID,
            MERCHANT_NAME: obj.MERCHANT_NAME,
            SUB_MERCHANT_ID: obj.SUB_MERCHANT_ID,
            SUB_MERCHANT_NAME: obj.SUB_MERCHANT_NAME,
            TERMINAL_ID: obj.TERMINAL_ID,
            MERCHANT_TRAN_ID: obj.MERCHANT_TRAN_ID,//obj.UPI_REQ_ID
            UPI_REQ_ID: obj.UPI_REQ_ID,
            login_user_id: dataObj.logInfo[0].LOGIN_USER_ID,
            bill_number: dataObj.upiPaymentObj.CollectionBillNumber,
            customer_name: dataObj.upiPaymentObj.CollectionCustomerName,
            gst_number: dataObj.upiPaymentObj.CollectionGstNumber,

        };
        this.apiService.sendToServer<ICore>('/api/virtualPay/tranreqtoService', paramObj, this).subscribe((data) => {
            this.spinner.hide();
            pageObj.CollectionSaveResponse(data, paramObj, pageObj, dataObj, callbackUpdateTranId, pageCallback);
        }, err => {
            this.spinner.hide();
            this.errorHandler.handlePageError(err);

        });
    }

    CollectiongetRequestID(dataObj, callbackUpdateTranId, pageCallback) {
        if (dataObj.upiPaymentObj.CollectionVPA == '' || dataObj.upiPaymentObj.CollectionVPA == undefined) {
            this.message = "Enter VPA Name.";
            MessageBox.show(this.dialog, this.message, "");
            return false;
        }
        // if (this.CollectionAmount == '' || this.CollectionAmount == undefined) {
        //   this.message ="Enter Amount Number."; 
        // MessageBox.show(this.dialog, this.message, "");
        //   return false;
        // }
        // if (this.CollectionBillNumber == '' || this.CollectionBillNumber == undefined) {
        //   this.message ="Enter Bill Number."; 
        // MessageBox.show(this.dialog, this.message, "");
        //   return false;
        // }

        // if (parseFloat(this.CollectionAmount) == 0) {
        //   this.message ="Transaction Amount must be greater than Zero."; 
        // MessageBox.show(this.dialog, this.message, "");
        //   return false;
        // }
        // if (!this.TCchek) {
        //   this.message = "Please check Terms and conditions."; 
        // MessageBox.show(this.dialog, this.message, "");
        //   return false;
        // }

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
            payer_va: dataObj.upiPaymentObj.CollectionVPA,
            amount: parseFloat(dataObj.upiPaymentObj.CollectionAmount).toFixed(2),
            remarks: dataObj.upiPaymentObj.CollectionRemarks,
            bill_number: dataObj.upiPaymentObj.CollectionBillNumber,
            online_refund: '',
            collect_by_date: '',
            request_flag: 'C',
            request_from: 'WB',
            device_id: 'D',
            login_user_id: this.dataStorage.logInfo[0].LOGIN_USER_ID,
            customer_name: dataObj.upiPaymentObj.CollectionCustomerName,
            gst_number: dataObj.upiPaymentObj.CollectionGstNumber,
        };
        this.spinner.show();
        let pageObj = this;
        this.apiService.sendToServer<ICore>('/api/virtualPay/tranreq', paramObj, this).subscribe((data) => {
            this.spinner.hide();
            if (data.code == 1 && data.msg.toUpperCase() == 'SUCCESS') {
                this.CollectionsendToService(data.data[0], pageObj, dataObj, callbackUpdateTranId, pageCallback);
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

    processUPI(dataObj, parentPageObj, callbackUpdateTranId, pageCallback) {
        this.parentPageObj = parentPageObj;
        // this.parentPageObj = dataObj;
        // this.callback = callback;
        this.CollectiongetRequestID(dataObj, callbackUpdateTranId, pageCallback);
    }







}
import { Injectable, Renderer2 } from '@angular/core';
import { ILogin } from '../../../../interface/login';
import { ErrorHandler } from '../../../../core/errorHandler';
import { ApiService } from '../../../../core/api.service';
import { Spinner } from '../../../../services/spinner';
import { DataStorage } from '../../../../core/dataStorage';
import { ICore } from "../../../../interface/core";
import { IPayment } from '../../../../interface/payment';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from "@angular/material";
import { MessageBox, MessageBoxButton, MessageBoxStyle } from "../../../../services/_shared/message-box";
import { Subscription } from "rxjs/Subscription";
@Injectable()
export class PaymentGateway {
    parentPageObj: any;
    paymentGatewayObj: any;
    callback: any;
    refno: string;
    encryptedkey: string;
    merchantid: string;
    submerchantid: string;
    returnurl: string;
    tranamount: number;
    ORIGINALURL: string;
    ENCRYPTURL: string;
    gstnumber: string;
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


    public constructor(public domSanitizer: DomSanitizer, private dialog: MatDialog, public apiService: ApiService, private errorHandler: ErrorHandler,
        private renderer2: Renderer2, private spinner: Spinner, private dataStorage: DataStorage) {
        this.Get_PaymentSettings();
    }
    /**
     * Get Payment Setting
     */
    Get_PaymentSettings() {
        this.spinner.show();
        var uinput = {
            opKeyword: "GETPAYSETMST",
        }
        this.apiService.sendToServer<IPayment>('/api/paymentgateway/PaymentSettings', uinput, this).subscribe(data => {
            this.spinner.hide();
            if (data && data.msg !== 'Success') {

            }
            if (data && data.msg === 'Success') {
                var result = data.cursor1[0];
                if (result) {
                    this.encryptedkey = result.ENCRY_KEY;
                    this.merchantid = result.MERCHANT_ID;
                    this.submerchantid = result.SUB_MERCHANT_ID;
                    this.returnurl = result.RETURN_URL;
                    this.gstnumber = '';
                }
            }
            else {

            }
        },
            err => {
                this.spinner.hide();
                this.errorHandler.handlePageError(err);
            })
    }
    /**
     * Save Page Request
     * @param pageObj
     */
    Save_PGRequest(pageObj) {
        if (this.dataStorage.logInfo[0] && this.dataStorage.logInfo[0].CLIENT_MST_ID > 0) {
            this.spinner.show();
            var uinput = {
                opKeyword: 'PAYGATEREQ',
                pay_gate_req_id: 0,
                client_mst_id: this.dataStorage.logInfo[0].CLIENT_MST_ID,
                eazypay_merchant_id: pageObj.merchantid,
                reference_no: pageObj.refno,
                sub_merchant_id: pageObj.submerchantid,
                tran_amount: this.paymentGatewayObj.tranamount,
                amount_1: 0, amount_2: 0, amount_3: 0, amount_4: 0,
                return_url: pageObj.returnurl,
                before_encry: pageObj.ORIGINALURL, after_encry: pageObj.ENCRYPTURL,
                bill_number: this.paymentGatewayObj.billnumber,
                customer_name: this.paymentGatewayObj.customername,
                gst_number: pageObj.gstnumber,
            }
            this.apiService.sendToServer<IPayment>('/api/paymentgateway/SaveRequest', uinput, this).subscribe(
                data => {
                    this.spinner.hide();
                    if (data && data.msg === 'Success') {
                        //window.showModalDialog(this.ENCRYPTURL);
                        window.open(this.ENCRYPTURL, "_blank", "width:80%;height:70%");
                        // this.callback(this.ENCRYPTURL,this.parentPageObj);
                    }
                    else {

                    }
                },
                err => {
                    this.spinner.hide();
                    this.errorHandler.handlePageError(err);
                },
                // () => console.log('Save_PGRequest')
            );
        }
    }
    /**
     * 
     * @param pageObj 
     */
    Process(pageObj) {
        var currentDate = new Date();
        var cd = '';
        cd = currentDate.toString().split(' ')[4].replace(':', '').replace(':', '') + currentDate.toString().split(' ')[2]; // + currentDate.toString().split(' ')[3]
        
        this.spinner.show();
        var uinput = {
            ENCRYPTEDKEY: this.encryptedkey,
            MERCHANT_ID: this.merchantid,
            SUB_MERCHANT_ID: this.submerchantid,
            REFERENCE_NO: this.refno, // cd, //TODO - Use Instant Generated
            TRANSACTION_AMOUNT: this.paymentGatewayObj.tranamount,
            MOBILE_NO: '',
            AMOUNT_1: 0,
            AMOUNT_2: 0,
            AMOUNT_3: 0,
            AMOUNT_4: 0,
            PAYMENT_MODE: 9,
            RETURN_URL: this.returnurl,
        }
        this.apiService.sendToServer<IPayment>('/api/paymentgateway/RequestResponse', uinput, this).subscribe(
            data => {
                this.spinner.hide();
                if (data) {
                    let res = data.d;
                    if (res) {
                        this.ORIGINALURL = JSON.parse(res).oURl;
                        this.ENCRYPTURL = JSON.parse(res).Encryurl;

                        this.Save_PGRequest(pageObj);
                        //window.open(this.ENCRYPTURL);
                    }

                }
                else {
                    if (data) {
                        this.message = data.msg;
                        MessageBox.show(this.dialog, this.message, "");
                        // this.option.msg=data.msg;
                        // this.toast.addToast(this.option);

                    }
                }
            },
            err => {
                this.spinner.hide();
                this.errorHandler.handlePageError(err);
            },
            // () => console.log('RequestrespnseURL')
        );
    }
    /**
     * Get Reference No
     */
    paymentGatewayPay(callback, paymentGatewayObj, obj) {
        this.paymentGatewayObj = paymentGatewayObj;
        this.parentPageObj = obj;
        this.callback = callback;
        this.refno = '';
        this.spinner.show();
        var uinput = {
            opKeyword: 'GETREFNO',
        }
        let pageObj = this;
        this.apiService.sendToServer<IPayment>('/api/paymentgateway/ReferenceNo', uinput, this).subscribe(data => {
            this.spinner.hide(); 
            if (data && data.msg !== 'Success') {

            }
            if (data && data.msg === 'Success') {
                this.refno = data.result;
                this.Process(pageObj);
            }
            else {

            }
        },
            err => {
                this.spinner.hide();
                this.errorHandler.handlePageError(err);
            })
    }

}